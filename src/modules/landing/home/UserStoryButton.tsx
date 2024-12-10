import { styled } from '@mui/material';

import { ChevronDownIcon } from 'lucide-react';

const StyledAnchor = styled('a')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  alignItems: 'center',
  color: 'unset',
  fontWeight: 'bold',
  textDecoration: 'none',
  borderRadius: theme.spacing(2),
  backgroundColor: '#f7eefe',
  padding: theme.spacing(2, 4),
}));

export function UserStoryButton({ id, text }: { id: string; text: string }) {
  return (
    <StyledAnchor href={`#${id}`}>
      {text}
      <ChevronDownIcon />
    </StyledAnchor>
  );
}
