import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@mui/lab';
import { Alert, Box, Stack, Typography } from '@mui/material';

import { isPasswordStrong } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';

import axios from 'axios';

import { BorderedSection } from '@/components/layout/BorderedSection';
import { Button } from '@/components/ui/Button';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  PASSWORD_EDIT_CONTAINER_ID,
  PASSWORD_INPUT_CONFIRM_PASSWORD_ID,
  PASSWORD_INPUT_CURRENT_PASSWORD_ID,
  PASSWORD_INPUT_NEW_PASSWORD_ID,
  PASSWORD_SAVE_BUTTON_ID,
} from '@/config/selectors';

import { PasswordField } from './PasswordField';

type EditPasswordProps = {
  onClose: () => void;
};

type Inputs = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const EditPassword = ({ onClose }: EditPasswordProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { t } = useTranslation(NS.Account);
  const { t: translateMessage } = useTranslation(NS.Messages);
  const { t: translateCommon } = useTranslation(NS.Common);

  const {
    mutateAsync: updatePassword,
    error: updatePasswordError,
    isPending: isUpdatePasswordLoading,
  } = mutations.useUpdatePassword();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // perform password update
      await updatePassword({
        password: data.newPassword,
        currentPassword: data.currentPassword,
      });

      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const currentPasswordErrorMessage = errors.currentPassword?.message;
  const newPasswordErrorMessage = errors.newPassword?.message;
  const confirmNewPasswordErrorMessage = errors.confirmNewPassword?.message;
  const hasErrors = Boolean(
    currentPasswordErrorMessage ||
      newPasswordErrorMessage ||
      confirmNewPasswordErrorMessage,
  );

  const updateNetworkError = axios.isAxiosError(updatePasswordError)
    ? translateMessage(
        updatePasswordError.response?.data.name ??
          FAILURE_MESSAGES.UNEXPECTED_ERROR,
      )
    : null;

  return (
    <BorderedSection
      id={PASSWORD_EDIT_CONTAINER_ID}
      title={t('PASSWORD_SETTINGS_TITLE')}
    >
      <Stack
        direction="column"
        gap={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="body1">
          {t('PASSWORD_SETTINGS_CONFIRM_INFORMATION')}
        </Typography>
        <Box>
          <PasswordField
            id={PASSWORD_INPUT_CURRENT_PASSWORD_ID}
            label={t('PASSWORD_SETTINGS_CURRENT_LABEL')}
            error={Boolean(currentPasswordErrorMessage)}
            helperText={currentPasswordErrorMessage}
            form={register('currentPassword', {
              required: t('REQUIRED_FIELD_ERROR'),
              validate: {
                strong: (value) =>
                  isPasswordStrong(value) || t('PASSWORD_WEAK_ERROR'),
              },
            })}
          />
        </Box>

        <Stack direction="row" gap={2}>
          <PasswordField
            label={t('PASSWORD_SETTINGS_NEW_LABEL')}
            error={Boolean(newPasswordErrorMessage)}
            helperText={newPasswordErrorMessage}
            id={PASSWORD_INPUT_NEW_PASSWORD_ID}
            form={register('newPassword', {
              required: t('REQUIRED_FIELD_ERROR'),
              validate: {
                different: (newPassword, formState) =>
                  newPassword !== formState.currentPassword ||
                  t('NEW_PASSWORD_SHOULD_NOT_MATCH_CURRENT_PASSWORD_ERROR'),
                strong: (value) =>
                  isPasswordStrong(value) || t('PASSWORD_WEAK_ERROR'),
              },
            })}
          />
          <PasswordField
            label={t('PASSWORD_SETTINGS_NEW_CONFIRM_LABEL')}
            error={Boolean(confirmNewPasswordErrorMessage)}
            helperText={confirmNewPasswordErrorMessage}
            id={PASSWORD_INPUT_CONFIRM_PASSWORD_ID}
            form={register('confirmNewPassword', {
              required: t('REQUIRED_FIELD_ERROR'),
              validate: {
                match: (confirmPassword, formState) =>
                  confirmPassword === formState.newPassword ||
                  t('PASSWORD_DO_NOT_MATCH_ERROR'),
              },
            })}
          />
        </Stack>
        {Boolean(updateNetworkError) && (
          <Alert severity="error">{updateNetworkError}</Alert>
        )}
        <Stack direction="row" gap={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose} size="small">
            {translateCommon('CANCEL.BUTTON_TEXT')}
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            id={PASSWORD_SAVE_BUTTON_ID}
            disabled={hasErrors}
            size="small"
            type="submit"
            loading={isUpdatePasswordLoading}
            data-umami-event="update-password"
          >
            {translateCommon('SAVE.BUTTON_TEXT')}
          </LoadingButton>
        </Stack>
      </Stack>
    </BorderedSection>
  );
};

export default EditPassword;
