import { useTranslation } from 'react-i18next';

import { DialogActions, DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { getParentFromPath } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NS } from '@/config/constants';
import { convertCapsuleToFolderMutation } from '@/openapi/client/@tanstack/react-query.gen';
import { getKeyForParentId, itemKeys } from '@/query/keys';

import useModalStatus from '~builder/components/hooks/useModalStatus';

export function ConvertToFolderButton({
  itemId,
  itemPath,
}: Readonly<{ itemId: string; itemPath: string }>) {
  const { t } = useTranslation(NS.Builder);
  const { t: translateCommon } = useTranslation(NS.Common);
  const { isOpen, openModal, closeModal } = useModalStatus();
  const queryClient = useQueryClient();
  const { mutate: switchToFolder } = useMutation({
    ...convertCapsuleToFolderMutation(),
    onSuccess: async () => {
      const parentKey = getKeyForParentId(getParentFromPath(itemPath));
      // refetchOnMount is false by default, so we need to remove the queries for a correct refetch
      queryClient.removeQueries({
        queryKey: parentKey,
      });
      await queryClient.invalidateQueries({
        queryKey: itemKeys.single(itemId).content,
      });
    },
  });

  const convert = () => {
    switchToFolder({
      path: { id: itemId },
    });
    closeModal();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{ ml: 1 }}
        onClick={openModal}
        type="button"
        aria-label={t('CONVERT_TO_FOLDER_MODAL_TITLE')}
      >
        {t('CONVERT_TO_FOLDER_MODAL_TITLE')}
      </Button>
      <Dialog onClose={closeModal} open={isOpen}>
        <DialogTitle>{t('CONVERT_TO_FOLDER_MODAL_TITLE')}</DialogTitle>
        <DialogContent>
          <p>{t('CONVERT_TO_FOLDER_MODAL_CONTENT')}</p>
          <p>
            <strong>
              {t('CONVERT_TO_FOLDER_MODAL_CONTENT_DETAILS.TITLE')}
            </strong>
            <ul>
              <li>
                <strong>
                  {t(
                    'CONVERT_TO_FOLDER_MODAL_CONTENT_DETAILS.FLEXIBLE_PERMISSIONS.TITLE',
                  )}
                </strong>
                {': '}
                {t(
                  'CONVERT_TO_FOLDER_MODAL_CONTENT_DETAILS.FLEXIBLE_PERMISSIONS.DESCRIPTION',
                )}
              </li>
              <li>
                <strong>
                  {t(
                    'CONVERT_TO_FOLDER_MODAL_CONTENT_DETAILS.FOLDER_EDITOR.TITLE',
                  )}
                </strong>
                {': '}
                {t(
                  'CONVERT_TO_FOLDER_MODAL_CONTENT_DETAILS.FOLDER_EDITOR.DESCRIPTION',
                )}
              </li>
              <li>
                <strong>
                  {t(
                    'CONVERT_TO_FOLDER_MODAL_CONTENT_DETAILS.EXPANDED_VISIBILITY.TITLE',
                  )}
                </strong>
                {': '}
                {t(
                  'CONVERT_TO_FOLDER_MODAL_CONTENT_DETAILS.EXPANDED_VISIBILITY.DESCRIPTION',
                )}
              </li>
            </ul>
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>
            {translateCommon('CANCEL.BUTTON_TEXT')}
          </Button>
          <Button
            variant="contained"
            onClick={convert}
            aria-label={t('CONVERT_TO_FOLDER_MODAL_CONFIRM_BUTTON_ARIA_LABEL')}
          >
            {t('CONVERT_TO_FOLDER_MODAL_CONFIRM_BUTTON')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
