import { useTranslation } from 'react-i18next';

import { DialogActions, DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { getParentFromPath } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NS } from '@/config/constants';
import { convertFolderToCapsuleMutation } from '@/openapi/client/@tanstack/react-query.gen';
import { getKeyForParentId, itemKeys } from '@/query/keys';

import useModalStatus from '~builder/components/hooks/useModalStatus';

export function ConvertToCapsuleButton({
  itemId,
  itemPath,
}: Readonly<{ itemId: string; itemPath: string }>) {
  const { t } = useTranslation(NS.Builder);
  const { t: translateCommon } = useTranslation(NS.Common);
  const { isOpen, openModal, closeModal } = useModalStatus();

  const queryClient = useQueryClient();
  const { mutate: switchToCapsule } = useMutation({
    ...convertFolderToCapsuleMutation(),
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
    switchToCapsule({
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
        aria-label={t('CONVERT_TO_CAPSULE_MODAL_TITLE')}
      >
        {t('CONVERT_TO_CAPSULE_MODAL_TITLE')}
      </Button>
      <Dialog onClose={closeModal} open={isOpen}>
        <DialogTitle>{t('CONVERT_TO_CAPSULE_MODAL_TITLE')}</DialogTitle>
        <DialogContent>
          <p>{t('CONVERT_TO_CAPSULE_MODAL_CONTENT')}</p>
          <p>
            {t('CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.TITLE')}
            <ul>
              <li>
                <strong>
                  {t(
                    'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.SIMPLIFIED_PERMISSIONS.TITLE',
                  )}
                </strong>
                {': '}
                {t(
                  'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.SIMPLIFIED_PERMISSIONS.DESCRIPTION',
                )}
              </li>
              <li>
                <strong>
                  {t(
                    'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.INLINE_EDITOR.TITLE',
                  )}
                </strong>
                {': '}
                {t(
                  'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.INLINE_EDITOR.DESCRIPTION',
                )}
              </li>
              <li>
                <strong>
                  {t(
                    'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.CLEAR_ROLES_AND_VIEWS.TITLE',
                  )}
                </strong>
                {': '}
                <ul>
                  <li>
                    {t(
                      'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.CLEAR_ROLES_AND_VIEWS.READERS',
                    )}
                  </li>
                  <li>
                    {t(
                      'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.CLEAR_ROLES_AND_VIEWS.WRITERS_AND_ADMINS',
                    )}
                  </li>
                </ul>
              </li>
              <li>
                <strong>
                  {t(
                    'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.ACTIVITY_UNITY.TITLE',
                  )}
                </strong>
                {': '}
                {t(
                  'CONVERT_TO_CAPSULE_MODAL_CONTENT_DETAILS.ACTIVITY_UNITY.DESCRIPTION',
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
            type="button"
            variant="contained"
            onClick={convert}
            aria-label={t('CONVERT_TO_CAPSULE_MODAL_CONFIRM_BUTTON_ARIA_LABEL')}
          >
            {t('CONVERT_TO_CAPSULE_MODAL_CONFIRM_BUTTON')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
