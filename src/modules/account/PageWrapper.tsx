import { type JSX, type ReactNode } from 'react';

import { styled } from '@mui/material';

import { Context } from '@graasp/sdk';

import { Link } from '@tanstack/react-router';

import { HeaderRightContent } from '@/components/ui/HeaderRightContent';
import Main from '@/ui/Main/Main';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));

const LinkComponent = ({ children }: { children: ReactNode }): JSX.Element => (
  <StyledLink to="/home">{children}</StyledLink>
);

export function PageWrapper({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <Main
      context={Context.Account}
      LinkComponent={LinkComponent}
      headerRightContent={<HeaderRightContent />}
    >
      {children}
    </Main>
  );
}
