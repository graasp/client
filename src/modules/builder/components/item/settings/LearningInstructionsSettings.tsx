import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, CircularProgress, Stack, Typography } from '@mui/material';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardList } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { MAX_DESCRIPTION_LENGTH, NS } from '@/config/constants';
import { LEARNING_INSTRUCTIONS_EDITOR_ID } from '@/config/selectors';
import type { PackedItem } from '@/openapi/client';
import {
  getLearningWorkspaceSettingsOptions,
  getLearningWorkspaceSettingsQueryKey,
  updateLearningWorkspaceSettingsMutation,
} from '@/openapi/client/@tanstack/react-query.gen';
import TextEditor from '@/ui/TextEditor/TextEditor';

import { stripHtml } from '~builder/utils/item';

import ItemSettingProperty from './ItemSettingProperty';

type Props = {
  item: PackedItem;
};

type EditorProps = {
  initialInstructions: string;
  isSaving: boolean;
  onSave: (instructions: string) => Promise<string>;
};

const normalizeInstructions = (instructions: string): string =>
  stripHtml(instructions).replaceAll('&nbsp;', ' ').trim() ? instructions : '';

const InstructionsEditor = ({
  initialInstructions,
  isSaving,
  onSave,
}: EditorProps): JSX.Element => {
  const { t } = useTranslation(NS.Builder);
  const normalizedInitialInstructions =
    normalizeInstructions(initialInstructions);
  const [draft, setDraft] = useState(normalizedInitialInstructions);
  const [savedInstructions, setSavedInstructions] = useState(
    normalizedInitialInstructions,
  );
  const [saveFailed, setSaveFailed] = useState(false);
  const [saveSucceeded, setSaveSucceeded] = useState(false);

  const normalizedDraft = normalizeInstructions(draft);
  const hasChanged = normalizedDraft !== savedInstructions;
  const exceedsLimit = normalizedDraft.length > MAX_DESCRIPTION_LENGTH;

  const handleSave = async () => {
    setSaveSucceeded(false);
    try {
      const saved = normalizeInstructions(await onSave(normalizedDraft));
      setDraft(saved);
      setSavedInstructions(saved);
      setSaveFailed(false);
      setSaveSucceeded(true);
    } catch {
      setSaveFailed(true);
    }
  };

  return (
    <Stack gap={1} mt={2}>
      <TextEditor
        id={LEARNING_INSTRUCTIONS_EDITOR_ID}
        value={draft}
        placeholderText={t('LEARNING_INSTRUCTIONS_SETTINGS_PLACEHOLDER')}
        onChange={(value) => {
          setDraft(value);
          setSaveFailed(false);
          setSaveSucceeded(false);
        }}
      />
      <Typography
        variant="caption"
        color={exceedsLimit ? 'error' : 'text.secondary'}
        aria-live="polite"
      >
        {t('LEARNING_INSTRUCTIONS_SETTINGS_CHARACTER_COUNT', {
          current: normalizedDraft.length,
          maximum: MAX_DESCRIPTION_LENGTH,
        })}
      </Typography>
      {saveFailed && (
        <Alert severity="error">
          {t('LEARNING_INSTRUCTIONS_SETTINGS_SAVE_FAILED')}
        </Alert>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="caption" color="text.secondary" aria-live="polite">
          {isSaving
            ? t('ITEM_STATUS_SYNCHRONIZING')
            : saveSucceeded && !hasChanged
              ? t('ITEM_STATUS_SYNCHRONIZED')
              : ''}
        </Typography>
        <Stack direction="row" gap={1}>
          <Button
            variant="text"
            disabled={!hasChanged || isSaving}
            onClick={() => {
              setDraft(savedInstructions);
              setSaveFailed(false);
              setSaveSucceeded(false);
            }}
          >
            {t('LEARNING_INSTRUCTIONS_SETTINGS_CANCEL')}
          </Button>
          <Button
            variant="contained"
            disabled={!hasChanged || exceedsLimit || isSaving}
            onClick={() => void handleSave()}
          >
            {t('LEARNING_INSTRUCTIONS_SETTINGS_SAVE')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

const LearningInstructionsSettings = ({ item }: Props): JSX.Element => {
  const { t } = useTranslation(NS.Builder);
  const queryClient = useQueryClient();
  const queryOptions = getLearningWorkspaceSettingsOptions({
    path: { itemId: item.id },
  });
  const settingsQuery = useQuery(queryOptions);
  const updateSettings = useMutation(updateLearningWorkspaceSettingsMutation());
  const queryKey = getLearningWorkspaceSettingsQueryKey({
    path: { itemId: item.id },
  });

  const content = (() => {
    if (settingsQuery.isPending) {
      return (
        <Stack direction="row" gap={1} alignItems="center" mt={2}>
          <CircularProgress size={20} />
          <Typography variant="body2">
            {t('LEARNING_INSTRUCTIONS_SETTINGS_LOADING')}
          </Typography>
        </Stack>
      );
    }

    if (settingsQuery.isError) {
      return (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void settingsQuery.refetch()}
            >
              {t('LEARNING_INSTRUCTIONS_SETTINGS_RETRY')}
            </Button>
          }
        >
          {t('LEARNING_INSTRUCTIONS_SETTINGS_LOAD_FAILED')}
        </Alert>
      );
    }

    return (
      <InstructionsEditor
        initialInstructions={settingsQuery.data?.instructions ?? ''}
        isSaving={updateSettings.isPending}
        onSave={async (instructions) => {
          const settings = await updateSettings.mutateAsync({
            path: { itemId: item.id },
            body: { instructions },
          });
          queryClient.setQueryData(queryKey, settings);
          await queryClient.invalidateQueries({ queryKey });
          return settings.instructions;
        }}
      />
    );
  })();

  return (
    <ItemSettingProperty
      title={t('LEARNING_INSTRUCTIONS_SETTINGS_TITLE')}
      icon={<ClipboardList />}
      valueText={t('LEARNING_INSTRUCTIONS_SETTINGS_DESCRIPTION')}
      inputSetting={
        updateSettings.isPending ? (
          <CircularProgress size={20} />
        ) : (
          <span aria-hidden />
        )
      }
      additionalInfo={content}
    />
  );
};

export default LearningInstructionsSettings;
