import { ReactNode } from 'react';

import { Stack, styled } from '@mui/material';

import { Link } from '@tanstack/react-router';

import { DEFAULT_LIGHT_PRIMARY_COLOR } from '../theme';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
}));

type Props = {
  active?: boolean;
  title: string;
  icon: ReactNode;
  to: string;
};

export function MenuTab({ icon, title, to, active = false }: Readonly<Props>) {
  return (
    <StyledLink to={to}>
      <Stack
        direction="row"
        gap={1}
        width="auto"
        px={2}
        py={1}
        borderRadius={5}
        sx={
          active
            ? { background: DEFAULT_LIGHT_PRIMARY_COLOR.main }
            : {
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: DEFAULT_LIGHT_PRIMARY_COLOR.main,
              }
        }
      >
        {icon} {title}
      </Stack>
    </StyledLink>
  );
}
