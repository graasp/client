import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@material-ui/core';
import ReportIcon from '@material-ui/icons/Report';

export interface FlagItemButtonProps {
  setOpen: (arg: boolean) => void;
  buttonColor: 'primary' | 'secondary' | 'default' | undefined;
  iconSize: 'default' | 'small' | 'large' | 'inherit' | 'medium' | undefined;
}

export const FlagItemButton: FC<FlagItemButtonProps> = ({
  setOpen,
  buttonColor = 'primary',
  iconSize = 'large',
}) => {
  const { t } = useTranslation();

  const openItemFlagDialog = (): void => {
    setOpen(true);
  };

  return (
    <Tooltip title={t('Report')}>
      <IconButton color={buttonColor} onClick={openItemFlagDialog}>
        <ReportIcon fontSize={iconSize} />
      </IconButton>
    </Tooltip>
  );
};

export default FlagItemButton;
