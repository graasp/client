import type { JSX } from 'react';

import { Box, Typography } from '@mui/material';

import { Api } from '@graasp/query-client';
import { Context, ItemType, PackedItem, PermissionLevel } from '@graasp/sdk';

import { AuthenticatedMember } from '@/AuthContext';
import { API_HOST } from '@/config/env';
import { axios } from '@/config/queryClient';
import AppItem from '@/ui/items/AppItem';

import {
  APP_ITEM_CLASS_NAME,
  buildAppItemSelector,
} from '~analytics/config/selectors';

const APP_ITEM_DEFAULT_HEIGHT = '70vh';

const AppContent = ({
  item,
  member,
}: {
  item: PackedItem;
  member: AuthenticatedMember;
}): JSX.Element | null => {
  if (item.permission && item.type == ItemType.APP) {
    const permission = item.permission;

    return (
      <Box id={buildAppItemSelector(item.id)} className={APP_ITEM_CLASS_NAME}>
        <Typography m={1} variant="h6" align="center">
          {item.name}
        </Typography>
        <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <AppItem
            isResizable={false}
            item={item}
            height={APP_ITEM_DEFAULT_HEIGHT}
            requestApiAccessToken={(payload: {
              id: string;
              key: string;
              origin: string;
            }) => Api.requestApiAccessToken(payload, { API_HOST, axios })}
            contextPayload={{
              apiHost: API_HOST,
              itemId: item.id,
              accountId: member.id,
              permission: permission || PermissionLevel.Read,
              settings: item.settings,
              lang: item.lang || member.lang,
              context: Context.Analytics,
            }}
          />
        </Box>
      </Box>
    );
  }

  return null;
};

export default AppContent;
