import {
  type ChangeEvent,
  type JSX,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PanelRightClose } from 'lucide-react';

import { useAuth } from '@/AuthContext';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';
import {
  PDF_LEARNING_GOALS_ID,
  PDF_LEARNING_INSTRUCTIONS_ID,
  PDF_LEARNING_NOTES_ID,
  PDF_LEARNING_PANEL_CLOSE_ID,
  PDF_LEARNING_PANEL_ID,
  PDF_LEARNING_PROGRESS_ID,
} from '@/config/selectors';
import type {
  FileItem,
  LearningGoalCompletion,
  UpdateOwnLearningWorkspaceData,
} from '@/openapi/client';
import {
  completeLearningGoalMutation,
  getLearningGoalsOptions,
  getLearningWorkspaceSettingsOptions,
  getOwnLearningGoalCompletionsOptions,
  getOwnLearningGoalCompletionsQueryKey,
  getOwnLearningWorkspaceOptions,
  getOwnLearningWorkspaceQueryKey,
  uncompleteLearningGoalMutation,
  updateOwnLearningWorkspaceMutation,
} from '@/openapi/client/@tanstack/react-query.gen';
import TextDisplay from '@/ui/TextDisplay/TextDisplay';

type Props = {
  item: FileItem;
  onClose: () => void;
  inDrawer?: boolean;
};

type NotesSaveState = 'unsaved' | 'saving' | 'saved' | 'failed';

const NotesEditor = ({
  initialNotes,
  onSave,
}: {
  initialNotes: string;
  onSave: (notes: string) => Promise<void>;
}): JSX.Element => {
  const { t } = useTranslation(NS.Player);
  const [draft, setDraft] = useState(initialNotes);
  const [saveState, setSaveState] = useState<NotesSaveState>('saved');
  const draftRef = useRef(draft);
  const isSavingRef = useRef(false);
  const queuedSaveRef = useRef(false);

  useEffect(() => {
    if (saveState === 'saved') {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setDraft(initialNotes);
      draftRef.current = initialNotes;
    }
  }, [initialNotes, saveState]);

  const save = useCallback(async () => {
    if (isSavingRef.current) {
      queuedSaveRef.current = true;
      return;
    }

    const notesToSave = draftRef.current;
    isSavingRef.current = true;
    setSaveState('saving');
    try {
      await onSave(notesToSave);
      setSaveState(draftRef.current === notesToSave ? 'saved' : 'unsaved');
    } catch {
      setSaveState('failed');
    } finally {
      isSavingRef.current = false;
      if (queuedSaveRef.current || draftRef.current !== notesToSave) {
        queuedSaveRef.current = false;
        setSaveState('unsaved');
      }
    }
  }, [onSave]);

  useEffect(() => {
    if (saveState !== 'unsaved') {
      return;
    }
    const timer = window.setTimeout(() => void save(), 800);
    return () => window.clearTimeout(timer);
  }, [draft, save, saveState]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    draftRef.current = value;
    setDraft(value);
    setSaveState('unsaved');
  };

  const stateLabel: Record<NotesSaveState, string> = {
    unsaved: t('PDF_LEARNING_WORKSPACE_NOTES_UNSAVED'),
    saving: t('PDF_LEARNING_WORKSPACE_NOTES_SAVING'),
    saved: t('PDF_LEARNING_WORKSPACE_NOTES_SAVED'),
    failed: t('PDF_LEARNING_WORKSPACE_NOTES_SAVE_FAILED'),
  };

  return (
    <Stack gap={1}>
      <TextField
        id={PDF_LEARNING_NOTES_ID}
        value={draft}
        multiline
        minRows={5}
        fullWidth
        slotProps={{ htmlInput: { maxLength: 20000 } }}
        placeholder={t('PDF_LEARNING_WORKSPACE_NOTES_PLACEHOLDER')}
        onChange={handleChange}
        onBlur={() => {
          if (saveState === 'unsaved') {
            void save();
          }
        }}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="caption"
          color={saveState === 'failed' ? 'error' : 'text.secondary'}
          aria-live="polite"
        >
          {stateLabel[saveState]}
        </Typography>
        {saveState === 'failed' && (
          <Button size="small" color="player" onClick={() => void save()}>
            {t('PDF_LEARNING_WORKSPACE_RETRY')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

const LearningPanel = ({
  item,
  onClose,
  inDrawer = false,
}: Props): JSX.Element => {
  const { t } = useTranslation(NS.Player);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const workspaceOptions = getOwnLearningWorkspaceOptions({
    path: { itemId: item.id },
  });
  const instructionsOptions = getLearningWorkspaceSettingsOptions({
    path: { itemId: item.id },
  });
  const goalsOptions = getLearningGoalsOptions({
    path: { itemId: item.id },
  });
  const completionOptions = getOwnLearningGoalCompletionsOptions({
    path: { itemId: item.id },
  });
  const workspaceQuery = useQuery({
    ...workspaceOptions,
    enabled: isAuthenticated,
  });
  const instructionsQuery = useQuery(instructionsOptions);
  const goalsQuery = useQuery(goalsOptions);
  const completionQuery = useQuery({
    ...completionOptions,
    enabled: isAuthenticated,
  });
  const updateWorkspace = useMutation(updateOwnLearningWorkspaceMutation());
  const completeGoal = useMutation(completeLearningGoalMutation());
  const uncompleteGoal = useMutation(uncompleteLearningGoalMutation());
  const [completionSaveFailed, setCompletionSaveFailed] = useState(false);
  const lastFailedCompletion = useRef<
    { goalId: string; completed: boolean } | undefined
  >(undefined);

  const saveNotes = useCallback(
    async (notes: string) => {
      const body: UpdateOwnLearningWorkspaceData['body'] = { notes };
      const workspace = await updateWorkspace.mutateAsync({
        path: { itemId: item.id },
        body,
      });
      queryClient.setQueryData(
        getOwnLearningWorkspaceQueryKey({ path: { itemId: item.id } }),
        workspace,
      );
      await queryClient.invalidateQueries({
        queryKey: getOwnLearningWorkspaceQueryKey({
          path: { itemId: item.id },
        }),
      });
    },
    [item.id, queryClient, updateWorkspace],
  );

  const completionKey = getOwnLearningGoalCompletionsQueryKey({
    path: { itemId: item.id },
  });

  const toggleGoal = useCallback(
    async (goalId: string, completed: boolean) => {
      const previous =
        queryClient.getQueryData<LearningGoalCompletion[]>(completionKey) ?? [];
      const optimistic = completed
        ? [
            ...previous.filter((entry) => entry.goalId !== goalId),
            { goalId, completedAt: new Date().toISOString() },
          ]
        : previous.filter((entry) => entry.goalId !== goalId);
      queryClient.setQueryData(completionKey, optimistic);
      setCompletionSaveFailed(false);

      try {
        const options = { path: { itemId: item.id, goalId } };
        if (completed) {
          await completeGoal.mutateAsync(options);
        } else {
          await uncompleteGoal.mutateAsync(options);
        }
        lastFailedCompletion.current = undefined;
        await queryClient.invalidateQueries({ queryKey: completionKey });
      } catch {
        queryClient.setQueryData(completionKey, previous);
        lastFailedCompletion.current = { goalId, completed };
        setCompletionSaveFailed(true);
      }
    },
    [completeGoal, completionKey, item.id, queryClient, uncompleteGoal],
  );

  const goals = goalsQuery.data ?? [];
  const currentGoalIds = new Set(goals.map(({ id }) => id));
  const completedGoalIds = new Set(
    (completionQuery.data ?? [])
      .map(({ goalId }) => goalId)
      .filter((goalId) => currentGoalIds.has(goalId)),
  );
  const completedCount = completedGoalIds.size;
  const progress = goals.length
    ? Math.round((completedCount / goals.length) * 100)
    : 0;
  const progressText = t('PDF_LEARNING_WORKSPACE_PROGRESS_TEXT', {
    completed: completedCount,
    total: goals.length,
  });
  const completionSaving = completeGoal.isPending || uncompleteGoal.isPending;

  const instructionsContent = (() => {
    if (instructionsQuery.isPending) {
      return (
        <Stack direction="row" gap={1} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2">
            {t('PDF_LEARNING_WORKSPACE_INSTRUCTIONS_LOADING')}
          </Typography>
        </Stack>
      );
    }

    if (instructionsQuery.isError) {
      return (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void instructionsQuery.refetch()}
            >
              {t('PDF_LEARNING_WORKSPACE_RETRY')}
            </Button>
          }
        >
          {t('PDF_LEARNING_WORKSPACE_INSTRUCTIONS_LOAD_FAILED')}
        </Alert>
      );
    }

    const instructions = instructionsQuery.data?.instructions ?? '';
    const hasInstructions = Boolean(
      instructions &&
        instructions !== '<p><br></p>' &&
        instructions
          .replace(/<[^>]*>?/g, '')
          .replaceAll('&nbsp;', ' ')
          .trim(),
    );

    return hasInstructions ? (
      <TextDisplay content={instructions} />
    ) : (
      <Typography variant="body2" color="text.secondary">
        {t('PDF_LEARNING_WORKSPACE_INSTRUCTIONS_EMPTY')}
      </Typography>
    );
  })();

  const notesContent = (() => {
    if (!isAuthenticated) {
      return (
        <Alert severity="info">
          <Stack gap={1} alignItems="flex-start">
            <Typography variant="body2">
              {t('PDF_LEARNING_WORKSPACE_NOTES_SIGN_IN_PROMPT')}
            </Typography>
            <ButtonLink
              size="small"
              variant="contained"
              color="player"
              to="/auth/login"
              search={{ url: window.location.href }}
            >
              {t('SIGN_IN_BUTTON_TEXT')}
            </ButtonLink>
          </Stack>
        </Alert>
      );
    }

    if (workspaceQuery.isPending) {
      return (
        <Stack direction="row" gap={1} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2">
            {t('PDF_LEARNING_WORKSPACE_LOADING')}
          </Typography>
        </Stack>
      );
    }

    if (workspaceQuery.isError) {
      return (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void workspaceQuery.refetch()}
            >
              {t('PDF_LEARNING_WORKSPACE_RETRY')}
            </Button>
          }
        >
          {t('PDF_LEARNING_WORKSPACE_LOAD_FAILED')}
        </Alert>
      );
    }

    return (
      <NotesEditor
        initialNotes={workspaceQuery.data?.notes ?? ''}
        onSave={saveNotes}
      />
    );
  })();

  const goalsContent = (() => {
    if (goalsQuery.isPending) {
      return (
        <Stack direction="row" gap={1} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2">
            {t('PDF_LEARNING_GOALS_LOADING')}
          </Typography>
        </Stack>
      );
    }

    if (goalsQuery.isError) {
      return (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void goalsQuery.refetch()}
            >
              {t('PDF_LEARNING_WORKSPACE_RETRY')}
            </Button>
          }
        >
          {t('PDF_LEARNING_GOALS_LOAD_FAILED')}
        </Alert>
      );
    }

    if (goals.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('PDF_LEARNING_GOALS_EMPTY')}
        </Typography>
      );
    }

    if (!isAuthenticated) {
      return (
        <Stack gap={1}>
          <List dense disablePadding component="ul">
            {goals.map((goal) => (
              <ListItem key={goal.id} component="li" disableGutters>
                <ListItemText primary={goal.text} />
              </ListItem>
            ))}
          </List>
          <Alert severity="info">
            <Stack gap={1} alignItems="flex-start">
              <Typography variant="body2">
                {t('PDF_LEARNING_GOALS_SIGN_IN_PROMPT')}
              </Typography>
              <ButtonLink
                size="small"
                variant="contained"
                color="player"
                to="/auth/login"
                search={{ url: window.location.href }}
              >
                {t('SIGN_IN_BUTTON_TEXT')}
              </ButtonLink>
            </Stack>
          </Alert>
        </Stack>
      );
    }

    if (completionQuery.isError) {
      return (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void completionQuery.refetch()}
            >
              {t('PDF_LEARNING_WORKSPACE_RETRY')}
            </Button>
          }
        >
          {t('PDF_LEARNING_GOALS_COMPLETIONS_LOAD_FAILED')}
        </Alert>
      );
    }

    return (
      <Stack>
        {goals.map((goal) => (
          <FormControlLabel
            key={goal.id}
            control={
              <Checkbox
                checked={completedGoalIds.has(goal.id)}
                disabled={completionQuery.isPending || completionSaving}
                inputProps={{ 'aria-label': goal.text }}
                onChange={(_, checked) => void toggleGoal(goal.id, checked)}
              />
            }
            label={
              <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                {goal.text}
              </Typography>
            }
            sx={{ m: 0 }}
          />
        ))}
        {completionSaveFailed && (
          <Alert
            severity="error"
            action={
              <Button
                size="small"
                color="inherit"
                onClick={() => {
                  const failed = lastFailedCompletion.current;
                  if (failed) {
                    void toggleGoal(failed.goalId, failed.completed);
                  }
                }}
              >
                {t('PDF_LEARNING_WORKSPACE_RETRY')}
              </Button>
            }
          >
            {t('PDF_LEARNING_GOALS_SAVE_FAILED')}
          </Alert>
        )}
      </Stack>
    );
  })();

  return (
    <Paper
      id={PDF_LEARNING_PANEL_ID}
      component="aside"
      variant={inDrawer ? undefined : 'outlined'}
      elevation={inDrawer ? 0 : undefined}
      aria-label={t('PDF_LEARNING_WORKSPACE_TITLE')}
      sx={{ height: '100%', overflow: 'auto' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        px={2}
        py={1}
        sx={{ direction: 'ltr' }}
      >
        <Typography component="h2" variant="h6" dir="auto">
          {t('PDF_LEARNING_WORKSPACE_TITLE')}
        </Typography>
        <Tooltip title={t('PDF_LEARNING_WORKSPACE_HIDE')}>
          <IconButton
            id={PDF_LEARNING_PANEL_CLOSE_ID}
            size="small"
            color="player"
            aria-label={t('PDF_LEARNING_WORKSPACE_HIDE')}
            aria-expanded
            aria-controls={PDF_LEARNING_PANEL_ID}
            onClick={onClose}
          >
            <PanelRightClose />
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider />

      <Stack id={PDF_LEARNING_INSTRUCTIONS_ID} gap={1} p={2}>
        <Typography component="h3" variant="subtitle1" fontWeight="bold">
          {t('PDF_LEARNING_WORKSPACE_INSTRUCTIONS_TITLE')}
        </Typography>
        {instructionsContent}
      </Stack>
      <Divider />

      <Stack gap={1} p={2}>
        <Typography component="h3" variant="subtitle1" fontWeight="bold">
          {t('PDF_LEARNING_WORKSPACE_NOTES_TITLE')}
        </Typography>
        {notesContent}
      </Stack>
      <Divider />

      {isAuthenticated &&
        goals.length > 0 &&
        !goalsQuery.isError &&
        !completionQuery.isError && (
          <>
            <Stack id={PDF_LEARNING_PROGRESS_ID} gap={1} p={2}>
              <Typography component="h3" variant="subtitle1" fontWeight="bold">
                {t('PDF_LEARNING_WORKSPACE_PROGRESS_TITLE')}
              </Typography>
              {completionQuery.isPending ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    aria-label={t('PDF_LEARNING_WORKSPACE_PROGRESS_TITLE')}
                    aria-valuetext={progressText}
                    sx={{
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'player.main',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {progressText}
                  </Typography>
                </>
              )}
            </Stack>
            <Divider />
          </>
        )}

      <Stack id={PDF_LEARNING_GOALS_ID} gap={1} p={2}>
        <Typography component="h3" variant="subtitle1" fontWeight="bold">
          {t('PDF_LEARNING_GOALS_TITLE')}
        </Typography>
        {goalsContent}
      </Stack>
    </Paper>
  );
};

export default LearningPanel;
