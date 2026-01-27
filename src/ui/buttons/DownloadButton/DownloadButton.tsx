import { type JSX } from 'react';

import {
  IconButton,
  ListItemIcon,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';

import { DownloadIcon } from 'lucide-react';

import {
  ActionButton,
  ActionButtonVariant,
  ColorVariantsType,
  TooltipPlacement,
} from '@/ui/types.js';

import { useButtonColor } from '../hooks.js';

export const DEFAULT_LOADER_SIZE = 24;

export type DownloadButtonProps = {
  ariaLabel: string;
  link: string;
  /**
   * CircularProgress's color
   */
  color?: ColorVariantsType;
  /**
   * Tooltip's title
   */
  title: string;
  /**
   * Tooltip's placement
   */
  placement?: TooltipPlacement;
  type?: ActionButtonVariant;
  id?: string;
};

const DownloadButton = ({
  id,
  link,
  color,
  ariaLabel = 'download',
  title = 'Download',
  placement = 'bottom',
  type = ActionButton.ICON_BUTTON,
}: DownloadButtonProps): JSX.Element => {
  const { color: iconColor } = useButtonColor(color);
  const icon = <DownloadIcon color={iconColor} />;
  switch (type) {
    case ActionButton.ICON:
      return icon;
    case ActionButton.MENU_ITEM:
      return (
        <MenuItem
          id={id}
          key={title}
          href={link}
          style={{ font: 'unset', textDecoration: 'unset', color: 'unset' }}
          component="a"
          download
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <Typography color={color}>{title}</Typography>
        </MenuItem>
      );
    case ActionButton.ICON_BUTTON:
    default:
      return (
        <Tooltip title={title} placement={placement}>
          <span id={id}>
            <IconButton
              color={color}
              href={link}
              aria-label={ariaLabel}
              download
            >
              {icon}
            </IconButton>
          </span>
        </Tooltip>
      );
  }
};

export default DownloadButton;
