import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@mui/lab';
import { Alert, Button, Stack, Typography } from '@mui/material';

import { isPasswordStrong } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';

import axios from 'axios';

import { BorderedSection } from '@/components/layout/BorderedSection';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  PASSWORD_CREATE_CONTAINER_ID,
  PASSWORD_INPUT_CONFIRM_PASSWORD_ID,
  PASSWORD_INPUT_NEW_PASSWORD_ID,
  PASSWORD_SAVE_BUTTON_ID,
} from '@/config/selectors';

import { PasswordField } from './PasswordField';

type CreatePasswordProps = {
  onClose: () => void;
};

type Inputs = {
  newPassword: string;
  confirmNewPassword: string;
};

export const getValidationMessage = (fieldError?: FieldError) => {
  if (fieldError?.type === 'required') {
    return 'REQUIRED_FIELD_ERROR' as const;
  }
  return fieldError?.message;
};

const CreatePassword = ({ onClose }: CreatePasswordProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { t } = useTranslation(NS.Account);
  const { t: translateMessage } = useTranslation(NS.Messages);
  const { t: translateCommon } = useTranslation(NS.Common);

  const {
    mutateAsync: createPassword,
    error: createPasswordError,
    isPending: isCreatePasswordLoading,
  } = mutations.useCreatePassword();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await createPassword({ password: data.newPassword });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const newPasswordErrorMessage = getValidationMessage(errors.newPassword);
  const confirmNewPasswordErrorMessage = getValidationMessage(
    errors.confirmNewPassword,
  );
  const hasErrors = Boolean(
    newPasswordErrorMessage ?? confirmNewPasswordErrorMessage,
  );

  const createNetworkError = axios.isAxiosError(createPasswordError)
    ? translateMessage(
        createPasswordError.response?.data.name ??
          FAILURE_MESSAGES.UNEXPECTED_ERROR,
      )
    : null;
  return (
    <BorderedSection
      id={PASSWORD_CREATE_CONTAINER_ID}
      title={t('PASSWORD_TITLE')}
    >
      <Typography variant="body1">
        {t('PASSWORD_SETTINGS_CONFIRM_INFORMATION')}
      </Typography>
      <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={2}>
          <PasswordField
            label={t('PASSWORD_SETTINGS_NEW_LABEL')}
            error={Boolean(newPasswordErrorMessage)}
            helperText={
              newPasswordErrorMessage &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              t(newPasswordErrorMessage)
            }
            id={PASSWORD_INPUT_NEW_PASSWORD_ID}
            form={register('newPassword', {
              required: t('REQUIRED_FIELD_ERROR'),
              validate: {
                strong: (value) =>
                  isPasswordStrong(value) || t('PASSWORD_WEAK_ERROR'),
              },
            })}
          />
          <PasswordField
            label={t('PASSWORD_SETTINGS_NEW_CONFIRM_LABEL')}
            error={Boolean(confirmNewPasswordErrorMessage)}
            helperText={
              confirmNewPasswordErrorMessage &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              t(confirmNewPasswordErrorMessage)
            }
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
        {Boolean(createNetworkError) && (
          <Alert severity="error">{createNetworkError}</Alert>
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
            loading={isCreatePasswordLoading}
            data-umami-event="create-password"
          >
            {translateCommon('SAVE.BUTTON_TEXT')}
          </LoadingButton>
        </Stack>
      </Stack>
    </BorderedSection>
  );
};

export default CreatePassword;
