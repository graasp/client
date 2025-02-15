import { type ReactNode } from 'react';

import { CurrentAccount, redirect } from '@graasp/sdk';

import RedirectionContent from './RedirectionContent.js';

export type SignedInWrapperProps = {
  redirectionLink: string;
  currentAccount?: CurrentAccount | null;
  onRedirect?: () => void;
  children?: ReactNode;
};

const SignedInWrapper = ({
  currentAccount,
  redirectionLink,
  onRedirect,
  children,
}: SignedInWrapperProps): SignedInWrapperProps['children'] => {
  const redirectToSignIn = (): void => {
    if (!redirectionLink) {
      console.debug('No link has been set for redirection');
      return;
    }
    redirect(window, redirectionLink);
  };

  // check authorization: user shouldn't be empty
  if (currentAccount?.id) {
    return children;
  }

  onRedirect?.();

  redirectToSignIn();

  // redirect page if redirection is not working
  return <RedirectionContent link={redirectionLink} />;
};

export default SignedInWrapper;
