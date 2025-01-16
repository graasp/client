import { useTranslation } from 'react-i18next';

import { DiscriminatedItem, ItemMembership } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { buildItemMembershipRowDeleteButtonId } from '@/config/selectors';

import useModalStatus from '~builder/components/hooks/useModalStatus';
import { BUILDER } from '~builder/langs/constants';

import DeleteItemMembershipDialog from './DeleteItemMembershipDialog';
import TableRowDeleteButton from './TableRowDeleteButton';

const DeleteItemMembershipButton = ({
  data,
  itemId,
}: {
  data: ItemMembership;
  itemId: DiscriminatedItem['id'];
}): JSX.Element => {
  const { isOpen, closeModal, openModal } = useModalStatus();
  const { t: translateBuilder } = useTranslation(NS.Builder);

  return (
    <>
      <TableRowDeleteButton
        onClick={() => openModal()}
        id={buildItemMembershipRowDeleteButtonId(data.id)}
        tooltip={translateBuilder(
          BUILDER.ITEM_MEMBERSHIPS_TABLE_CANNOT_DELETE_PARENT_TOOLTIP,
        )}
      />
      <DeleteItemMembershipDialog
        open={isOpen}
        handleClose={closeModal}
        itemId={itemId}
        membershipToDelete={data}
      />
    </>
  );
};

export default DeleteItemMembershipButton;
