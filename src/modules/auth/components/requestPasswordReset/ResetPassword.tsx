import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { isPasswordStrong } from '@graasp/sdk';

import { useSearch } from '@tanstack/react-router';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { TypographyLink } from '@/components/ui/TypographyLink';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  RESET_PASSWORD_BACK_TO_LOGIN_BUTTON_ID,
  RESET_PASSWORD_ERROR_MESSAGE_ID,
  RESET_PASSWORD_NEW_PASSWORD_CONFIRMATION_FIELD_ERROR_TEXT_ID,
  RESET_PASSWORD_NEW_PASSWORD_CONFIRMATION_FIELD_ID,
  RESET_PASSWORD_NEW_PASSWORD_FIELD_ERROR_TEXT_ID,
  RESET_PASSWORD_NEW_PASSWORD_FIELD_ID,
  RESET_PASSWORD_SUBMIT_BUTTON_ID,
  RESET_PASSWORD_SUCCESS_MESSAGE_ID,
} from '@/config/selectors';

import { HELP_EMAIL } from '~auth/constants';
import { useValidateJWTToken } from '~auth/hooks/useValidateJWTToken';
import { AUTH } from '~auth/langs';
import { getValidationMessage } from '~auth/validation';

import { PasswordAdornment } from '../common/Adornments';
import { CenteredContent } from '../layout/CenteredContent';
import { DialogHeader } from '../layout/DialogHeader';
import { InvalidTokenScreen } from './InvalidTokenScreen';

const { useResolvePasswordResetRequest } = mutations;

type Inputs = {
  password: string;
  confirmPassword: string;
};
export function ResetPassword() {
  const { t } = useTranslation(NS.Auth);

  const search = useSearch({ from: '/auth/reset-password' });
  const { isValid, token } = useValidateJWTToken(search.t);

  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    mutate: resolveRequestPasswordReset,
    isPending: isLoading,
    isError,
    isSuccess,
  } = useResolvePasswordResetRequest();

  if (!isValid) {
    return <InvalidTokenScreen />;
  }

  const resetPassword = ({ password }: Inputs) => {
    resolveRequestPasswordReset({ password, token });
  };

  const passwordErrorMessage = getValidationMessage(errors.password);
  const confirmPasswordErrorMessage = getValidationMessage(
    errors.confirmPassword,
  );
  const hasErrors = Boolean(
    passwordErrorMessage || confirmPasswordErrorMessage,
  );

  return (
    <CenteredContent
      header={
        <DialogHeader
          title={t(AUTH.RESET_PASSWORD_TITLE)}
          description={
            <Stack gap={1} width="100%">
              {t(AUTH.RESET_PASSWORD_DESCRIPTION)}
              <Typography>
                {t(AUTH.RESET_PASSWORD_REQUIREMENTS_TITLE)}
                <ul style={{ margin: 0 }}>
                  <li>
                    {t(AUTH.RESET_PASSWORD_REQUIREMENTS_LENGTH, { length: 8 })}
                  </li>
                  <li>
                    {t(AUTH.RESET_PASSWORD_REQUIREMENTS_LOWERCASE, {
                      count: 1,
                    })}
                  </li>
                  <li>
                    {t(AUTH.RESET_PASSWORD_REQUIREMENTS_UPPERCASE, {
                      count: 1,
                    })}
                  </li>
                  <li>
                    {t(AUTH.RESET_PASSWORD_REQUIREMENTS_NUMBER, {
                      count: 1,
                    })}
                  </li>
                </ul>
              </Typography>
            </Stack>
          }
        />
      }
    >
      <Stack
        component="form"
        onSubmit={handleSubmit(resetPassword)}
        direction="column"
        alignItems="center"
        spacing={1}
        width="100%"
      >
        <TextField
          id={RESET_PASSWORD_NEW_PASSWORD_FIELD_ID}
          slotProps={{
            input: {
              startAdornment: PasswordAdornment,
            },
            formHelperText: {
              id: RESET_PASSWORD_NEW_PASSWORD_FIELD_ERROR_TEXT_ID,
            },
          }}
          {...register('password', {
            required: true,
            validate: (value) =>
              isPasswordStrong(value) || t(AUTH.PASSWORD_WEAK_ERROR),
          })}
          label={t(AUTH.RESET_PASSWORD_NEW_PASSWORD_FIELD_LABEL)}
          variant="outlined"
          error={Boolean(passwordErrorMessage)}
          helperText={passwordErrorMessage}
          type={showPasswords ? '' : 'password'}
          fullWidth
          disabled={isSuccess || isError}
        />
        <TextField
          id={RESET_PASSWORD_NEW_PASSWORD_CONFIRMATION_FIELD_ID}
          slotProps={{
            input: {
              startAdornment: PasswordAdornment,
            },
            formHelperText: {
              id: RESET_PASSWORD_NEW_PASSWORD_CONFIRMATION_FIELD_ERROR_TEXT_ID,
            },
          }}
          {...register('confirmPassword', {
            required: true,
            validate: {
              strong: (value) =>
                isPasswordStrong(value) || t(AUTH.PASSWORD_WEAK_ERROR),
              match: (confirmPassword, formState) =>
                confirmPassword === formState.password ||
                t(AUTH.PASSWORD_DO_NOT_MATCH_ERROR),
            },
          })}
          label={t(AUTH.RESET_PASSWORD_NEW_PASSWORD_CONFIRMATION_FIELD_LABEL)}
          variant="outlined"
          error={Boolean(confirmPasswordErrorMessage)}
          helperText={confirmPasswordErrorMessage}
          type={showPasswords ? '' : 'password'}
          fullWidth
          disabled={isSuccess || isError}
        />
        <FormControlLabel
          sx={{ width: '100%' }}
          control={
            <Checkbox
              value={showPasswords}
              onChange={() => setShowPasswords((v) => !v)}
            />
          }
          label={t(AUTH.SHOW_PASSWORD)}
        />
        {isError && (
          <>
            <Alert id={RESET_PASSWORD_ERROR_MESSAGE_ID} severity="error">
              {t(AUTH.RESET_PASSWORD_ERROR_MESSAGE, { email: HELP_EMAIL })}
            </Alert>
            <ButtonLink
              variant="contained"
              fullWidth
              to="/auth/forgot-password"
              sx={{ textDecoration: 'none' }}
            >
              {t(AUTH.REQUEST_PASSWORD_RESET_TITLE)}
            </ButtonLink>
          </>
        )}
        {isSuccess ? (
          <>
            <Alert id={RESET_PASSWORD_SUCCESS_MESSAGE_ID} severity="success">
              {t(AUTH.RESET_PASSWORD_SUCCESS_MESSAGE)}
            </Alert>
            <ButtonLink
              variant="contained"
              fullWidth
              to="/auth/login"
              id={RESET_PASSWORD_BACK_TO_LOGIN_BUTTON_ID}
            >
              {t(AUTH.BACK_TO_SIGN_IN_BUTTON)}
            </ButtonLink>
          </>
        ) : (
          <LoadingButton
            id={RESET_PASSWORD_SUBMIT_BUTTON_ID}
            variant="contained"
            loading={isLoading}
            fullWidth
            type="submit"
            disabled={hasErrors || isError}
          >
            {t(AUTH.RESET_PASSWORD_BUTTON)}
          </LoadingButton>
        )}
      </Stack>
      {
        // only show this when `isSuccess` is false
        !isSuccess && (
          <TypographyLink
            to="/auth/login"
            color="textSecondary"
            sx={{ textDecoration: 'none' }}
          >
            {t(AUTH.BACK_TO_SIGN_IN_BUTTON)}
          </TypographyLink>
        )
      }
    </CenteredContent>
  );
}
