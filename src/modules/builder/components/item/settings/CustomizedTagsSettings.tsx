import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { NS } from '@/config/constants';
import type { Item } from '@/openapi/client';

import { BUILDER } from '~builder/langs';

import CustomizedTags from '../publish/customizedTags/CustomizedTags';

type Props = {
  item: Item;
};

export const CustomizedTagsSettings = ({ item }: Props): JSX.Element => {
  const { t } = useTranslation(NS.Builder);

  return (
    <Stack spacing={1}>
      <Typography variant="h4">{t(BUILDER.ITEM_TAGS_TITLE)}</Typography>
      <Typography>{t(BUILDER.ITEM_TAGS_PLACEHOLDER)}</Typography>
      <CustomizedTags itemId={item.id} />
    </Stack>
  );
};

export default CustomizedTagsSettings;
