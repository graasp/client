import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { TableCell, Typography } from '@mui/material';

import {
  AccountType,
  DiscriminatedItem,
  ItemLoginSchemaStatus,
  PermissionLevelOptions,
} from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import {
  buildItemMembershipRowEditButtonId,
  buildItemMembershipRowId,
} from '@/config/selectors';
import { ItemMembership } from '@/openapi/client';
import { updateItemMembershipMutation } from '@/openapi/client/@tanstack/react-query.gen';
import { itemKeys } from '@/query/keys';
import { DEFAULT_TEXT_DISABLED_COLOR } from '@/ui/theme';

import DeleteItemMembershipButton from './DeleteItemMembershipButton';
import EditPermissionButton from './EditPermissionButton';
import { StyledTableRow } from './StyledTableRow';

const ItemMembershipTableRow = ({
  allowDowngrade = false,
  isOnlyAdmin = false,
  item,
  data,
  isDisabled,
}: {
  data: ItemMembership;
  item: DiscriminatedItem;
  allowDowngrade?: boolean;
  isOnlyAdmin?: boolean;
  isDisabled: boolean;
}): JSX.Element => {
  const { t: translateEnums } = useTranslation(NS.Enums);
  const queryClient = useQueryClient();
  const { mutate: editItemMembership } = useMutation({
    ...updateItemMembershipMutation(),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: itemKeys.single(item.id).memberships,
      });
    },
  });
  const { mutate: shareItem } = mutations.usePostItemMembership();

  const changePermission = (newPermission: PermissionLevelOptions) => {
    if (data.item.path === item.path) {
      editItemMembership({
        path: { id: data.id, itemId: item.id },
        body: { permission: newPermission },
      });
    } else {
      shareItem({
        id: item.id,
        accountId: data.account.id,
        permission: newPermission,
      });
    }
  };

  return (
    <StyledTableRow data-cy={buildItemMembershipRowId(data.id)} key={data.id}>
      <TableCell>
        <Typography
          noWrap
          sx={{ color: isDisabled ? DEFAULT_TEXT_DISABLED_COLOR : undefined }}
          fontWeight="bold"
        >
          {data.account.name}
        </Typography>
        <Typography
          noWrap
          variant="subtitle2"
          sx={{ color: isDisabled ? DEFAULT_TEXT_DISABLED_COLOR : undefined }}
        >
          {data.account.type === AccountType.Individual && data.account.email}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>
          {isDisabled ? (
            <Typography sx={{ color: DEFAULT_TEXT_DISABLED_COLOR }}>
              {translateEnums(ItemLoginSchemaStatus.Disabled)}
            </Typography>
          ) : (
            translateEnums(data.permission)
          )}
        </Typography>
      </TableCell>
      <TableCell align="right">
        {!isOnlyAdmin && (
          <EditPermissionButton
            name={data.account.name}
            email={
              data.account.type === AccountType.Individual
                ? data.account.email
                : undefined
            }
            handleUpdate={changePermission}
            allowDowngrade={allowDowngrade}
            permission={data.permission}
            id={buildItemMembershipRowEditButtonId(data.id)}
          />
        )}
        {!isOnlyAdmin && allowDowngrade && (
          <DeleteItemMembershipButton itemId={item.id} data={data} />
        )}
      </TableCell>
    </StyledTableRow>
  );
};

export default ItemMembershipTableRow;
