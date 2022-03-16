import { PropTypes } from '@material-ui/core';
import React, { FC } from 'react';
import GraaspButton from '../Button';
import { ButtonVariant } from '../types';

interface SaveButtonProps {
  onClick: (e: any) => void;
  hasChanges: boolean;
  id?: string;
  text?: string;
  noChangeText?: string;
  color?: PropTypes.Color;
  variant?: ButtonVariant;
}

const SaveButton: FC<SaveButtonProps> = ({
  id,
  onClick,
  variant,
  color,
  text = 'Save',
  noChangeText = 'Saved',
  hasChanges,
}) => {
  return (
    <GraaspButton
      id={id}
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={hasChanges}
    >
      {hasChanges ? text : noChangeText}
    </GraaspButton>
  );
};

export default SaveButton;
