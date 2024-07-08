import { ChangeEvent, useState } from 'react';

import { Box, Button, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';

import { isPasswordStrong } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';

import { useAccountTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  CONFIRM_PASSWORD_ID,
  NEW_PASSWORD_ID,
  PASSWORD_SAVE_BUTTON_ID,
} from '@/config/selectors';

type onCloseProp = {
  onClose: () => void;
};
const PasswordSettings = ({ onClose }: onCloseProp): JSX.Element => {
  const { t } = useAccountTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState<string | null>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >();
  const { mutate: updatePassword } = mutations.useUpdatePassword();
  const [isEditing, setIsEditing] = useState(false);

  const verifyEmptyPassword = () => {
    const newPasswordIsNotEmpty = Boolean(newPassword);
    const confirmPasswordIsNotEmpty = Boolean(confirmPassword);
    setNewPasswordError(
      newPasswordIsNotEmpty ? null : FAILURE_MESSAGES.PASSWORD_EMPTY_ERROR,
    );
    setConfirmPasswordError(
      confirmPasswordIsNotEmpty ? null : FAILURE_MESSAGES.PASSWORD_EMPTY_ERROR,
    );

    return newPasswordIsNotEmpty || confirmPasswordIsNotEmpty;
  };

  const onCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // verify there are no empty inputs
    const isValid = verifyEmptyPassword();

    if (isValid) {
      // perform validation when all fields are filled in
      if (currentPassword === newPassword) {
        setNewPasswordError(FAILURE_MESSAGES.PASSWORD_EQUAL_ERROR);
        return;
      }
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError(FAILURE_MESSAGES.PASSWORD_CONFIRM_ERROR);
        return;
      }

      // perform password update
      updatePassword({
        password: newPassword,
        currentPassword,
      });
    }
    onCancel();
    onClose();
  };

  const handleCurrentPasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(event.target.value);
    setIsEditing(true);
  };

  const handleNewPasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
    setIsEditing(true);
    if (!event.target.value) {
      setNewPasswordError(FAILURE_MESSAGES.PASSWORD_EMPTY_ERROR);
    } else if (!isPasswordStrong(event.target.value)) {
      setNewPasswordError(FAILURE_MESSAGES.PASSWORD_WEAK_ERROR);
    } else {
      setNewPasswordError(null);
    }
  };
  const handleConfirmPasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setIsEditing(true);
    setConfirmPasswordError(event.target.value ? null : 'Password is empty');
  };

  return (
    <>
      <Typography variant="h5">{t('PASSWORD_SETTINGS_TITLE')}</Typography>

      <Typography variant="body1">
        {t('PASSWORD_SETTINGS_CONFIRM_INFORMATION')}
      </Typography>
      <Stack spacing={2}>
        <Box>
          <TextField
            required
            label={t('PASSWORD_SETTINGS_CURRENT_LABEL')}
            variant="outlined"
            value={currentPassword}
            onChange={handleCurrentPasswordInput}
            type="password"
          />
          <Typography variant="subtitle2">
            {t('PASSWORD_SETTINGS_CURRENT_INFORMATION')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <TextField
            required
            label={t('PASSWORD_SETTINGS_NEW_LABEL')}
            variant="outlined"
            value={newPassword}
            error={Boolean(newPasswordError)}
            helperText={newPasswordError}
            onChange={handleNewPasswordInput}
            type="password"
            id={NEW_PASSWORD_ID}
          />
          <TextField
            required
            label={t('PASSWORD_SETTINGS_NEW_CONFIRM_LABEL')}
            variant="outlined"
            value={confirmPassword}
            error={Boolean(confirmPasswordError)}
            helperText={confirmPasswordError}
            onChange={handleConfirmPasswordInput}
            type="password"
            id={CONFIRM_PASSWORD_ID}
          />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={onClose} size="small">
          {t('CLOSE_BUTTON')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleChangePassword}
          id={PASSWORD_SAVE_BUTTON_ID}
          disabled={Boolean(newPasswordError) || !isEditing}
          size="small"
        >
          {t('PASSWORD_SETTINGS_CONFIRM_BUTTON')}
        </Button>
      </Stack>
    </>
  );
};

export default PasswordSettings;
