import {
  type JSX,
  type KeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Drawer,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { PanelRightOpen } from 'lucide-react';

import { useAuth } from '@/AuthContext';
import { Button } from '@/components/ui/Button';
import { NS } from '@/config/constants';
import { LocalStorage } from '@/config/localStorage';
import { hooks } from '@/config/queryClient';
import {
  PDF_LEARNING_CONTENT_ID,
  PDF_LEARNING_PANEL_ID,
  PDF_LEARNING_PANEL_RESIZER_ID,
  PDF_LEARNING_PANEL_TOGGLE_ID,
  PDF_LEARNING_WORKSPACE_ID,
} from '@/config/selectors';
import type { FileItem } from '@/openapi/client';

import { useLayoutContext } from '~player/contexts/LayoutContext';

import LearningPanel from './LearningPanel';

type Props = {
  children: ReactNode;
  item: FileItem;
};

type WorkspacePreferences = {
  width: number;
  collapsed: boolean;
};

const DEFAULT_PANEL_WIDTH = 320;
const MIN_PANEL_WIDTH = 240;
const MAX_PANEL_WIDTH = 480;
const MIN_PDF_WIDTH = 720;
const MIN_COMFORTABLE_PDF_WIDTH = 800;
const PANEL_GAP = 16;
const MIN_SPLIT_LAYOUT_WIDTH =
  DEFAULT_PANEL_WIDTH + MIN_COMFORTABLE_PDF_WIDTH + PANEL_GAP;

const preferenceKey = (accountId: string) =>
  `pdf-learning-workspace:${accountId}`;

const readPreferences = (accountId?: string): WorkspacePreferences => {
  if (!accountId) {
    return { width: DEFAULT_PANEL_WIDTH, collapsed: false };
  }
  try {
    const value = LocalStorage.getItem(preferenceKey(accountId));
    if (!value) {
      return { width: DEFAULT_PANEL_WIDTH, collapsed: false };
    }
    const preferences = JSON.parse(value) as Partial<WorkspacePreferences>;
    const savedWidth = preferences.width;
    return {
      width:
        typeof savedWidth === 'number' && Number.isFinite(savedWidth)
          ? Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, savedWidth))
          : DEFAULT_PANEL_WIDTH,
      collapsed:
        typeof preferences.collapsed === 'boolean'
          ? preferences.collapsed
          : false,
    };
  } catch {
    return { width: DEFAULT_PANEL_WIDTH, collapsed: false };
  }
};

const PdfLearningWorkspace = ({ children, item }: Props): JSX.Element => {
  const { t } = useTranslation(NS.Player);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const initialPreferences = useMemo(
    () => readPreferences(user?.id),
    [user?.id],
  );
  const [isDesktopOpen, setIsDesktopOpen] = useState(
    !initialPreferences.collapsed,
  );
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(initialPreferences.width);
  const [containerWidth, setContainerWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelWidthRef = useRef(initialPreferences.width);
  const resizeCleanupRef = useRef<() => void>(() => undefined);
  const { isChatboxOpen, isPinnedOpen, setIsChatboxOpen, setIsPinnedOpen } =
    useLayoutContext();
  const { data: childrenItems } = hooks.useChildren(item.id);

  const hasPinnedItems = childrenItems?.some(
    ({ settings, hidden }) => settings.isPinned && !hidden,
  );
  const hasOpenSideDrawer =
    (item.settings.showChatbox && isChatboxOpen) ||
    (hasPinnedItems && isPinnedOpen);

  const savePreferences = useCallback(
    (patch: Partial<WorkspacePreferences>) => {
      if (!user?.id) {
        return;
      }
      const current = readPreferences(user.id);
      LocalStorage.setItem(
        preferenceKey(user.id),
        JSON.stringify({ ...current, ...patch }),
      );
    },
    [user?.id],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => resizeCleanupRef.current(), []);

  useEffect(() => {
    // Temporary drawers are deliberately not restored between PDF items.
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setIsMobileDrawerOpen(false);
  }, [item.id]);

  useEffect(() => {
    if (hasOpenSideDrawer && isMobileDrawerOpen) {
      // Chat and pinned content take precedence over the learning drawer.
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setIsMobileDrawerOpen(false);
    }
  }, [hasOpenSideDrawer, isMobileDrawerOpen]);

  const maxPanelWidth = Math.max(
    MIN_PANEL_WIDTH,
    Math.min(
      MAX_PANEL_WIDTH,
      (containerWidth ?? Number.POSITIVE_INFINITY) - MIN_PDF_WIDTH - PANEL_GAP,
    ),
  );
  const currentPanelWidth = Math.min(panelWidth, maxPanelWidth);
  const isCompactLayout =
    isMobile ||
    (containerWidth !== undefined && containerWidth < MIN_SPLIT_LAYOUT_WIDTH);
  const showDesktopPanel =
    !isCompactLayout && isDesktopOpen && !hasOpenSideDrawer;
  const pdfWidth = showDesktopPanel
    ? `calc(100% - ${currentPanelWidth + PANEL_GAP}px)`
    : '100%';

  const openLearningWorkspace = () => {
    setIsChatboxOpen(false);
    setIsPinnedOpen(false);
    if (isCompactLayout) {
      setIsMobileDrawerOpen(true);
    } else {
      setIsDesktopOpen(true);
      savePreferences({ collapsed: false });
    }
  };

  const closeLearningWorkspace = () => {
    if (isCompactLayout) {
      setIsMobileDrawerOpen(false);
    } else {
      setIsDesktopOpen(false);
      savePreferences({ collapsed: true });
    }
  };

  const updatePanelWidth = (width: number, persist = false) => {
    const nextWidth = Math.min(maxPanelWidth, Math.max(MIN_PANEL_WIDTH, width));
    panelWidthRef.current = nextWidth;
    setPanelWidth(nextWidth);
    if (persist) {
      savePreferences({ width: nextWidth });
    }
  };

  const handleSeparatorPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    resizeCleanupRef.current();

    const separator = event.currentTarget;
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startWidth = currentPanelWidth;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    try {
      separator.setPointerCapture(pointerId);
    } catch {
      // Synthetic pointer events used by browser tests do not always register
      // an active pointer. Window listeners below still guarantee cleanup.
    }
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handlePointerMove = (pointerEvent: PointerEvent) => {
      updatePanelWidth(startWidth + startX - pointerEvent.clientX);
    };

    const cleanup = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
      if (
        separator.hasPointerCapture?.(pointerId) &&
        separator.releasePointerCapture
      ) {
        separator.releasePointerCapture(pointerId);
      }
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      resizeCleanupRef.current = () => undefined;
    };

    const handlePointerEnd = () => {
      cleanup();
      savePreferences({ width: panelWidthRef.current });
    };

    resizeCleanupRef.current = cleanup;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);
  };

  const handleSeparatorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    event.preventDefault();
    const step = event.shiftKey ? 48 : 16;
    const delta = event.key === 'ArrowLeft' ? step : -step;
    updatePanelWidth(currentPanelWidth + delta, true);
  };

  const showOpenButton = isCompactLayout
    ? !isMobileDrawerOpen
    : !showDesktopPanel;

  return (
    <Stack gap={1}>
      {showOpenButton && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ direction: 'ltr' }}
        >
          <Button
            id={PDF_LEARNING_PANEL_TOGGLE_ID}
            size="small"
            color="player"
            startIcon={<PanelRightOpen />}
            aria-expanded={false}
            aria-controls={PDF_LEARNING_PANEL_ID}
            onClick={openLearningWorkspace}
          >
            {t('PDF_LEARNING_WORKSPACE_SHOW')}
          </Button>
        </Stack>
      )}
      <Box
        ref={containerRef}
        id={PDF_LEARNING_WORKSPACE_ID}
        width="100%"
        sx={{ position: 'relative', direction: 'ltr' }}
      >
        <Box
          id={PDF_LEARNING_CONTENT_ID}
          width={pdfWidth}
          minWidth={showDesktopPanel ? MIN_PDF_WIDTH : 0}
          sx={{ direction: theme.direction }}
        >
          {children}
        </Box>
        {showDesktopPanel && (
          <Box
            width={currentPanelWidth}
            height="100%"
            sx={{
              position: 'absolute',
              insetBlock: 0,
              right: 0,
              direction: theme.direction,
            }}
          >
            <Box
              id={PDF_LEARNING_PANEL_RESIZER_ID}
              role="separator"
              tabIndex={0}
              aria-label={t('PDF_LEARNING_WORKSPACE_RESIZE')}
              aria-orientation="vertical"
              aria-valuemin={MIN_PANEL_WIDTH}
              aria-valuemax={maxPanelWidth}
              aria-valuenow={currentPanelWidth}
              aria-controls={`${PDF_LEARNING_CONTENT_ID} ${PDF_LEARNING_PANEL_ID}`}
              onKeyDown={handleSeparatorKeyDown}
              onPointerDown={handleSeparatorPointerDown}
              sx={{
                position: 'absolute',
                zIndex: 1,
                top: 0,
                bottom: 0,
                left: -8,
                width: 16,
                cursor: 'col-resize',
                touchAction: 'none',
                borderLeft: '2px solid transparent',
                '&:hover, &:focus-visible': {
                  borderColor: 'player.main',
                  outline: 'none',
                },
              }}
            />
            <LearningPanel item={item} onClose={closeLearningWorkspace} />
          </Box>
        )}
      </Box>
      {isCompactLayout && (
        <Drawer
          anchor="right"
          variant="temporary"
          open={isMobileDrawerOpen}
          onClose={closeLearningWorkspace}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: { width: isMobile ? '100%' : currentPanelWidth },
          }}
        >
          <Toolbar />
          <LearningPanel
            item={item}
            inDrawer
            onClose={closeLearningWorkspace}
          />
        </Drawer>
      )}
    </Stack>
  );
};

export default PdfLearningWorkspace;
