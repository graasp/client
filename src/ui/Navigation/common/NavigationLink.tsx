import { ReactNode } from 'react';

import { styled } from '@mui/material';

import { Link } from '@tanstack/react-router';

const NavigationLink: (props: {
  id?: string;
  children: ReactNode;
  to: string;
}) => ReactNode = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));
export default NavigationLink;
