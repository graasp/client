import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Stack } from '@mui/material';

import { RecaptchaAction, isEmail } from '@graasp/sdk';

import { useLocation, useNavigate } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  MAGIC_LINK_EMAIL_FIELD_ID,
  SIGN_IN_BUTTON_ID,
} from '@/config/selectors';

import { AUTH } from '~auth/langs';

import { executeCaptcha } from '../../context/RecaptchaContext';
import { useMobileAppLogin } from '../../hooks/useMobileAppLogin';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { EmailInput } from './EmailInput';

type Inputs = {
  email: string;
};

type MagicLinkLoginFormProps = {
  search: {
    url?: string;
  };
};

export function MagicLinkLoginForm({
  search,
}: Readonly<MagicLinkLoginFormProps>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t: translateCommon } = useTranslation(NS.Common, {
    keyPrefix: 'FIELD_ERROR',
  });
  const { t } = useTranslation(NS.Auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { isMobile, challenge } = useMobileAppLogin();

  const {
    mutateAsync: signIn,
    isPending: isLoadingSignIn,
    error: webSignInError,
  } = mutations.useSignIn();
  const {
    mutateAsync: mobileSignIn,
    isPending: isLoadingMobileSignIn,
    error: mobileSignInError,
  } = mutations.useMobileSignIn();

  const signInError = webSignInError || mobileSignInError;

  const handleSignIn = async ({ email }: Inputs) => {
    const lowercaseEmail = email.toLowerCase();

    try {
      const token = await executeCaptcha(
        isMobile ? RecaptchaAction.SignInMobile : RecaptchaAction.SignIn,
      );
      await (isMobile
        ? mobileSignIn({ email: lowercaseEmail, captcha: token, challenge })
        : signIn({
            email: lowercaseEmail,
            captcha: token,
            url: search.url,
          }));

      // navigate to success path
      navigate({
        to: '/auth/success',
        search: { email, back: location.pathname },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const emailError = errors.email?.message;

  return (
    <Stack
      component="form"
      direction="column"
      spacing={1}
      alignItems="center"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <EmailInput
        id={MAGIC_LINK_EMAIL_FIELD_ID}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        form={register('email', {
          required: translateCommon('REQUIRED'),
          validate: (email) =>
            isEmail(email, {}) || translateCommon('INVALID_EMAIL'),
        })}
        placeholder={t(AUTH.EMAIL_INPUT_PLACEHOLDER)}
        error={emailError}
      />
      <ErrorDisplay error={signInError} />
      <Button
        type="submit"
        id={SIGN_IN_BUTTON_ID}
        variant="contained"
        sx={{ textTransform: 'none' }}
        fullWidth
        loading={isLoadingMobileSignIn || isLoadingSignIn}
      >
        {t(AUTH.SIGN_IN_BUTTON)}
      </Button>
    </Stack>
  );
}
