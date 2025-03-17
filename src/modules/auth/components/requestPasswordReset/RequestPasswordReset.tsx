import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@mui/lab';
import { Alert, Stack, TextField } from '@mui/material';

import { RecaptchaAction, isEmail } from '@graasp/sdk';

import { TypographyLink } from '@/components/ui/TypographyLink';
import { HELP_EMAIL, NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  REQUEST_PASSWORD_RESET_EMAIL_FIELD_HELPER_ID,
  REQUEST_PASSWORD_RESET_EMAIL_FIELD_ID,
  REQUEST_PASSWORD_RESET_ERROR_MESSAGE_ID,
  REQUEST_PASSWORD_RESET_SUBMIT_BUTTON_ID,
  REQUEST_PASSWORD_RESET_SUCCESS_MESSAGE_ID,
} from '@/config/selectors';

import { executeCaptcha } from '~auth/context/RecaptchaContext';
import { AUTH } from '~auth/langs';

import { EmailAdornment } from '../common/adornments';
import { CenteredContent } from '../layout/CenteredContent';
import { DialogHeader } from '../layout/DialogHeader';

const { useCreatePasswordResetRequest } = mutations;

type Inputs = {
  email: string;
};

export function RequestPasswordReset() {
  const { t } = useTranslation(NS.Auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    mutate: requestPasswordReset,
    isError,
    isSuccess,
    isPending: isLoading,
  } = useCreatePasswordResetRequest();

  const resetPassword = async ({ email }: Inputs) => {
    const captcha = await executeCaptcha(RecaptchaAction.ResetPassword);
    requestPasswordReset({ email, captcha });
  };

  const errorMessage = errors.email?.message;
  const hasErrors = !!errorMessage;

  return (
    <CenteredContent
      header={
        <DialogHeader
          title={t(AUTH.REQUEST_PASSWORD_RESET_TITLE)}
          description={t(AUTH.REQUEST_PASSWORD_RESET_TEXT)}
        />
      }
    >
      <Stack
        width="100%"
        component="form"
        onSubmit={handleSubmit(resetPassword)}
        gap={1}
      >
        <TextField
          id={REQUEST_PASSWORD_RESET_EMAIL_FIELD_ID}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          {...register('email', {
            required: t('REQUIRED_FIELD_ERROR'),
            validate: (email) =>
              isEmail(email, {}) || t(AUTH.INVALID_EMAIL_ERROR),
          })}
          slotProps={{
            input: {
              startAdornment: EmailAdornment,
            },
            formHelperText: {
              id: REQUEST_PASSWORD_RESET_EMAIL_FIELD_HELPER_ID,
            },
          }}
          placeholder={t(AUTH.EMAIL_INPUT_PLACEHOLDER)}
          helperText={errorMessage}
          error={hasErrors}
          // once the request is sent disable the input
          disabled={isSuccess || isError}
        />
        {isError && (
          <Alert id={REQUEST_PASSWORD_RESET_ERROR_MESSAGE_ID} severity="error">
            {t(AUTH.REQUEST_PASSWORD_RESET_ERROR_MESSAGE, {
              email: HELP_EMAIL,
            })}
          </Alert>
        )}
        {isSuccess ? (
          <Alert
            id={REQUEST_PASSWORD_RESET_SUCCESS_MESSAGE_ID}
            severity="success"
          >
            {t(AUTH.REQUEST_PASSWORD_RESET_SUCCESS_MESSAGE)}
          </Alert>
        ) : (
          <LoadingButton
            variant="contained"
            loading={isLoading}
            id={REQUEST_PASSWORD_RESET_SUBMIT_BUTTON_ID}
            fullWidth
            type="submit"
            disabled={hasErrors}
          >
            {t(AUTH.REQUEST_PASSWORD_RESET_BUTTON)}
          </LoadingButton>
        )}
      </Stack>
      <TypographyLink
        color="textSecondary"
        sx={{ textDecoration: 'none' }}
        to="/auth/login"
      >
        {t(AUTH.REQUEST_PASSWORD_RESET_BACK_BUTTON)}
      </TypographyLink>
    </CenteredContent>
  );
}
