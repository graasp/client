import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { PackedItem, formatDate } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { FOLDER_NAME_TITLE_CLASS } from '@/config/selectors';
import TextDisplay from '@/ui/TextDisplay/TextDisplay';
import Thumbnail from '@/ui/Thumbnail/Thumbnail';

type SectionHeaderProps = {
  item: PackedItem;
};

export function SectionHeader({
  item,
}: Readonly<SectionHeaderProps>): JSX.Element {
  const { t, i18n } = useTranslation(NS.Player);
  const thumbnailSrc = item.thumbnails?.medium;

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Thumbnail
          maxWidth="96px"
          maxHeight="96px"
          url={thumbnailSrc}
          alt={item.name}
          sx={{ borderRadius: 5 }}
        />
        <Stack>
          <Typography className={FOLDER_NAME_TITLE_CLASS} variant="h2">
            {item.name}
          </Typography>
          <Typography variant="caption">
            {t('ITEM_TITLE_UPDATED_AT', {
              date: formatDate(item.updatedAt, {
                locale: i18n.language,
              }),
            })}
          </Typography>
        </Stack>
      </Stack>
      <TextDisplay content={item.description ?? ''} />
    </Stack>
  );
}
