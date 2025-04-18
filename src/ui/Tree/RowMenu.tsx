import { type JSX, useState } from 'react';

import { KeyboardArrowRight } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { ItemType } from '@graasp/sdk';

import ItemIcon from '@/ui/icons/ItemIcon.js';

import type { NavigationElement } from './types.js';

export interface RowMenuProps {
  item: NavigationElement;
  onNavigate: (item: NavigationElement) => void;
  selectedId?: string;
  onClick: (item: NavigationElement) => void;
  isDisabled?: (item: NavigationElement) => boolean;
  id?: string;
  arrowId?: string;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  justifyContent: 'start',
  background: isSelected ? theme.palette.grey[200] : 'none',
  textTransform: 'none',
  pl: 1,
}));

const RowMenu = ({
  item,
  onNavigate,
  onClick,
  selectedId,
  isDisabled,
  id,
  arrowId,
}: RowMenuProps): JSX.Element | null => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      id={id}
      sx={{
        '& .arrow': {
          visibility: 'hidden',
        },
        '&:hover .arrow': {
          visibility: 'unset',
        },
      }}
    >
      <Stack direction="row" alignItems="center" width="100%">
        <StyledButton
          onClick={() => {
            onClick(item);
          }}
          isSelected={selectedId === item.id}
          disabled={isDisabled?.(item)}
          startIcon={
            <ItemIcon
              size="20px"
              alt={`${item.name} icon`}
              type={ItemType.FOLDER}
            />
          }
        >
          <Typography
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            variant="body1"
          >
            {item.name}
          </Typography>
        </StyledButton>
        {isLoading && <CircularProgress size={20} />}
        {!isLoading && (
          <IconButton
            className="arrow"
            onClick={() => {
              setIsLoading(true);
              onNavigate(item);
            }}
            id={arrowId}
            size="small"
          >
            <KeyboardArrowRight />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
};

export default RowMenu;
