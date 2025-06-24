import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Alert, Button, Stack } from '@mui/material';

import { RecaptchaAction, isEmail } from '@graasp/sdk';

import { TypographyLink } from '@/components/ui/TypographyLink';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  EMAIL_SIGN_IN_FIELD_ID,
  PASSWORD_SIGN_IN_BUTTON_ID,
  PASSWORD_SIGN_IN_FIELD_ID,
  PASSWORD_SUCCESS_ALERT,
} from '@/config/selectors';

import { executeCaptcha } from '~auth/context/RecaptchaContext';
import { useMobileAppLogin } from '~auth/hooks/useMobileAppLogin';
import { AUTH } from '~auth/langs';

import { ErrorDisplay } from '../common/ErrorDisplay';
import { PasswordInput } from '../common/PasswordInput';
import { EmailInput } from './EmailInput';

type Inputs = {
  email: string;
  password: string;
};

type PasswordLoginProps = {
  search: {
    url?: string;
  };
};

export function PasswordLoginForm({ search }: Readonly<PasswordLoginProps>) {
  const { t } = useTranslation(NS.Auth);
  const { isMobile, challenge } = useMobileAppLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    mutateAsync: signInWithPassword,
    isSuccess: signInWithPasswordSuccess,
    isPending: isLoadingPasswordSignIn,
    error: webPasswordSignInError,
  } = mutations.useSignInWithPassword();
  const {
    mutateAsync: mobileSignInWithPassword,
    isSuccess: mobileSignInWithPasswordSuccess,
    isPending: isLoadingMobilePasswordSignIn,
    error: mobilePasswordSignInError,
  } = mutations.useMobileSignInWithPassword();

  const passwordSignInError =
    webPasswordSignInError || mobilePasswordSignInError;

  const handlePasswordSignIn = async (data: Inputs) => {
    const lowercaseEmail = data.email.toLowerCase();

    const token = await executeCaptcha(
      isMobile
        ? RecaptchaAction.SignInWithPasswordMobile
        : RecaptchaAction.SignInWithPassword,
    );
    try {
      const result = await (isMobile
        ? mobileSignInWithPassword({
            ...data,
            email: lowercaseEmail,
            captcha: token,
            challenge,
          })
        : signInWithPassword({
            ...data,
            email: lowercaseEmail,
            captcha: token,
            url: search.url,
          }));
      // successful redirect
      if (result?.resource) {
        window.location.href = result.resource;
      }
    } catch (e) {
      // show error from react-query's error
      console.error(e);
    }
  };

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(handlePasswordSignIn)}
      direction="column"
      spacing={1}
      alignItems="center"
    >
      <EmailInput
        id={EMAIL_SIGN_IN_FIELD_ID}
        form={register('email', {
          required: t('REQUIRED_FIELD_ERROR'),
          validate: (email) => isEmail(email, {}) || t('INVALID_EMAIL_ERROR'),
        })}
        placeholder={t(AUTH.EMAIL_INPUT_PLACEHOLDER)}
        error={emailError}
      />
      <Stack direction="column" alignItems="flex-end">
        <PasswordInput
          id={PASSWORD_SIGN_IN_FIELD_ID}
          error={passwordError}
          form={register('password', {
            required: t('REQUIRED_FIELD_ERROR'),
          })}
        />
        <TypographyLink
          color="textSecondary"
          variant="caption"
          sx={{
            textDecoration: 'none',
            '&:hover': { color: 'palette.primary.main' },
          }}
          to="/auth/forgot-password"
        >
          {t(AUTH.REQUEST_PASSWORD_RESET_LINK)}
        </TypographyLink>
      </Stack>
      <ErrorDisplay error={passwordSignInError} />
      <Button
        type="submit"
        disabled={Boolean(passwordError) || Boolean(emailError)}
        id={PASSWORD_SIGN_IN_BUTTON_ID}
        variant="contained"
        color="primary"
        sx={{ textTransform: 'none' }}
        fullWidth
        loading={isLoadingMobilePasswordSignIn || isLoadingPasswordSignIn}
      >
        {t(AUTH.SIGN_IN_PASSWORD_BUTTON)}
      </Button>

      {(signInWithPasswordSuccess || mobileSignInWithPasswordSuccess) && (
        <Alert severity="success" id={PASSWORD_SUCCESS_ALERT}>
          {t(AUTH.PASSWORD_SUCCESS_ALERT)}
        </Alert>
      )}
    </Stack>
  );
}
