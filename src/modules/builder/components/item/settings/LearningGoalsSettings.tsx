import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Pencil, Target, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { NS } from '@/config/constants';
import { LEARNING_GOALS_NEW_INPUT_ID } from '@/config/selectors';
import type { LearningGoal, PackedItem } from '@/openapi/client';
import {
  createLearningGoalMutation,
  deleteLearningGoalMutation,
  getLearningGoalsOptions,
  getLearningGoalsQueryKey,
  reorderLearningGoalsMutation,
  updateLearningGoalMutation,
} from '@/openapi/client/@tanstack/react-query.gen';

import ItemSettingProperty from './ItemSettingProperty';

const MAX_GOALS = 20;

type Props = {
  item: PackedItem;
};

const LearningGoalsSettings = ({ item }: Props): JSX.Element => {
  const { t } = useTranslation(NS.Builder);
  const queryClient = useQueryClient();
  const queryOptions = getLearningGoalsOptions({
    path: { itemId: item.id },
  });
  const goalsQuery = useQuery(queryOptions);
  const createGoal = useMutation(createLearningGoalMutation());
  const updateGoal = useMutation(updateLearningGoalMutation());
  const deleteGoal = useMutation(deleteLearningGoalMutation());
  const reorderGoals = useMutation(reorderLearningGoalsMutation());
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string>();
  const [editingText, setEditingText] = useState('');
  const [goalToDelete, setGoalToDelete] = useState<LearningGoal>();
  const [mutationFailed, setMutationFailed] = useState(false);

  const goals = goalsQuery.data ?? [];
  const queryKey = getLearningGoalsQueryKey({ path: { itemId: item.id } });
  const isSaving =
    createGoal.isPending ||
    updateGoal.isPending ||
    deleteGoal.isPending ||
    reorderGoals.isPending;

  const finishMutation = async (nextGoals: LearningGoal[]) => {
    queryClient.setQueryData(queryKey, nextGoals);
    setMutationFailed(false);
    await queryClient.invalidateQueries({ queryKey });
  };

  const handleAdd = async () => {
    const text = newText.trim();
    if (!text || goals.length >= MAX_GOALS) {
      return;
    }
    try {
      const goal = await createGoal.mutateAsync({
        path: { itemId: item.id },
        body: { text },
      });
      setNewText('');
      await finishMutation([...goals, goal]);
    } catch {
      setMutationFailed(true);
    }
  };

  const handleSaveEdit = async (goalId: string) => {
    const text = editingText.trim();
    if (!text) {
      return;
    }
    try {
      const updated = await updateGoal.mutateAsync({
        path: { itemId: item.id, goalId },
        body: { text },
      });
      setEditingId(undefined);
      setEditingText('');
      await finishMutation(
        goals.map((goal) => (goal.id === goalId ? updated : goal)),
      );
    } catch {
      setMutationFailed(true);
    }
  };

  const handleDelete = async () => {
    if (!goalToDelete) {
      return;
    }
    try {
      await deleteGoal.mutateAsync({
        path: { itemId: item.id, goalId: goalToDelete.id },
      });
      const nextGoals = goals
        .filter(({ id }) => id !== goalToDelete.id)
        .map((goal, position) => ({ ...goal, position }));
      setGoalToDelete(undefined);
      await finishMutation(nextGoals);
    } catch {
      setGoalToDelete(undefined);
      setMutationFailed(true);
    }
  };

  const moveGoal = async (index: number, offset: -1 | 1) => {
    const target = index + offset;
    if (target < 0 || target >= goals.length) {
      return;
    }
    const previous = goals;
    const reordered = [...goals];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    const optimistic = reordered.map((goal, position) => ({
      ...goal,
      position,
    }));
    queryClient.setQueryData(queryKey, optimistic);
    try {
      const saved = await reorderGoals.mutateAsync({
        path: { itemId: item.id },
        body: { goalIds: optimistic.map(({ id }) => id) },
      });
      await finishMutation(saved);
    } catch {
      queryClient.setQueryData(queryKey, previous);
      setMutationFailed(true);
    }
  };

  const content = (() => {
    if (goalsQuery.isPending) {
      return (
        <Stack direction="row" gap={1} alignItems="center" py={2}>
          <CircularProgress size={20} />
          <Typography variant="body2">
            {t('LEARNING_GOALS_SETTINGS_LOADING')}
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
              {t('LEARNING_GOALS_SETTINGS_RETRY')}
            </Button>
          }
        >
          {t('LEARNING_GOALS_SETTINGS_LOAD_FAILED')}
        </Alert>
      );
    }

    return (
      <Stack gap={2} pt={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <TextField
            id={LEARNING_GOALS_NEW_INPUT_ID}
            fullWidth
            size="small"
            label={t('LEARNING_GOALS_SETTINGS_ADD_LABEL')}
            value={newText}
            slotProps={{ htmlInput: { maxLength: 200 } }}
            helperText={`${newText.length}/200`}
            disabled={isSaving || goals.length >= MAX_GOALS}
            onChange={(event) => setNewText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void handleAdd();
              }
            }}
          />
          <Button
            variant="contained"
            disabled={isSaving || !newText.trim() || goals.length >= MAX_GOALS}
            onClick={() => void handleAdd()}
          >
            {t('LEARNING_GOALS_SETTINGS_ADD')}
          </Button>
        </Stack>

        {goals.length >= MAX_GOALS && (
          <Typography variant="caption" color="text.secondary">
            {t('LEARNING_GOALS_SETTINGS_LIMIT')}
          </Typography>
        )}

        {goals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('LEARNING_GOALS_SETTINGS_EMPTY')}
          </Typography>
        ) : (
          <Stack gap={1}>
            {goals.map((goal, index) => (
              <Stack
                key={goal.id}
                direction={{ xs: 'column', sm: 'row' }}
                gap={1}
                alignItems={{ sm: 'center' }}
              >
                {editingId === goal.id ? (
                  <>
                    <TextField
                      fullWidth
                      size="small"
                      value={editingText}
                      slotProps={{ htmlInput: { maxLength: 200 } }}
                      helperText={`${editingText.length}/200`}
                      onChange={(event) => setEditingText(event.target.value)}
                    />
                    <Stack direction="row" gap={1}>
                      <Button
                        size="small"
                        disabled={isSaving || !editingText.trim()}
                        onClick={() => void handleSaveEdit(goal.id)}
                      >
                        {t('LEARNING_GOALS_SETTINGS_SAVE')}
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        disabled={isSaving}
                        onClick={() => {
                          setEditingId(undefined);
                          setEditingText('');
                        }}
                      >
                        {t('LEARNING_GOALS_SETTINGS_CANCEL')}
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      flex={1}
                      sx={{ overflowWrap: 'anywhere' }}
                    >
                      {goal.text}
                    </Typography>
                    <Stack direction="row">
                      <Tooltip title={t('LEARNING_GOALS_SETTINGS_MOVE_UP')}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={isSaving || index === 0}
                            aria-label={t(
                              'LEARNING_GOALS_SETTINGS_MOVE_UP_GOAL',
                              { goal: goal.text },
                            )}
                            onClick={() => void moveGoal(index, -1)}
                          >
                            <ArrowUp size={18} />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={t('LEARNING_GOALS_SETTINGS_MOVE_DOWN')}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={isSaving || index === goals.length - 1}
                            aria-label={t(
                              'LEARNING_GOALS_SETTINGS_MOVE_DOWN_GOAL',
                              { goal: goal.text },
                            )}
                            onClick={() => void moveGoal(index, 1)}
                          >
                            <ArrowDown size={18} />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={t('LEARNING_GOALS_SETTINGS_EDIT')}>
                        <IconButton
                          size="small"
                          disabled={isSaving}
                          aria-label={t('LEARNING_GOALS_SETTINGS_EDIT_GOAL', {
                            goal: goal.text,
                          })}
                          onClick={() => {
                            setEditingId(goal.id);
                            setEditingText(goal.text);
                          }}
                        >
                          <Pencil size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('LEARNING_GOALS_SETTINGS_DELETE')}>
                        <IconButton
                          size="small"
                          disabled={isSaving}
                          aria-label={t('LEARNING_GOALS_SETTINGS_DELETE_GOAL', {
                            goal: goal.text,
                          })}
                          onClick={() => setGoalToDelete(goal)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </>
                )}
              </Stack>
            ))}
          </Stack>
        )}

        {mutationFailed && (
          <Alert
            severity="error"
            action={
              <Button
                size="small"
                color="inherit"
                onClick={() => {
                  setMutationFailed(false);
                  void goalsQuery.refetch();
                }}
              >
                {t('LEARNING_GOALS_SETTINGS_RELOAD')}
              </Button>
            }
          >
            {t('LEARNING_GOALS_SETTINGS_SAVE_FAILED')}
          </Alert>
        )}
      </Stack>
    );
  })();

  return (
    <>
      <ItemSettingProperty
        title={t('LEARNING_GOALS_SETTINGS_TITLE')}
        icon={<Target />}
        valueText={t('LEARNING_GOALS_SETTINGS_DESCRIPTION')}
        inputSetting={
          isSaving ? <CircularProgress size={20} /> : <span aria-hidden />
        }
        additionalInfo={content}
      />
      <Dialog
        open={Boolean(goalToDelete)}
        onClose={() => {
          if (!isSaving) {
            setGoalToDelete(undefined);
          }
        }}
      >
        <DialogTitle>{t('LEARNING_GOALS_SETTINGS_DELETE_TITLE')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('LEARNING_GOALS_SETTINGS_DELETE_DESCRIPTION')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            disabled={isSaving}
            onClick={() => setGoalToDelete(undefined)}
          >
            {t('LEARNING_GOALS_SETTINGS_CANCEL')}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={isSaving}
            onClick={() => void handleDelete()}
          >
            {deleteGoal.isPending
              ? t('ITEM_STATUS_SYNCHRONIZING')
              : t('LEARNING_GOALS_SETTINGS_DELETE')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LearningGoalsSettings;
