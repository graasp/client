import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid2 as Grid, Stack, Typography } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { GhostIcon } from 'lucide-react';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';

import ItemCard from '~player/common/ItemCard';
import LoadingItemsIndicator from '~player/common/LoadingItemsIndicator';

const GridWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>{children}</Grid>
);

const placeholderItems = [
  { id: '6a704d93-3f00-4ff6-a142-77bf4192aef6' },
  { id: '8507cea8-a95f-4650-8cdd-d4065488f1dc' },
  { id: 'dbb1a033-c056-4753-8fd4-a4691581f3ad' },
  { id: '8d8ad96d-a7b5-40d9-9a51-1472a126e35e' },
  { id: '9858060a-0a22-457e-9f64-0d0f61360a0a' },
  { id: '652fa7f0-1653-4baf-8a00-e533dafc6655' },
];

export function DisplayItems({
  items,
  isLoading,
}: Readonly<{
  items?: PackedItem[];
  isLoading: boolean;
}>): ReactNode | null {
  const { t } = useTranslation(NS.Player);

  if (items) {
    if (!items.length) {
      return (
        <Stack
          sx={{ backgroundColor: 'secondary.light', borderRadius: 2, p: 1 }}
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" gap={1}>
            <GhostIcon />
            <Typography>{t('HOME_EMPTY')}</Typography>
          </Stack>
          <ButtonLink to="/builder">Start Creating</ButtonLink>
        </Stack>
      );
    }

    return items.map((item) => (
      <GridWrapper key={item.id}>
        <ItemCard key={item.id} item={item} />
      </GridWrapper>
    ));
  }

  if (isLoading) {
    return placeholderItems.map(({ id }) => (
      <GridWrapper key={id}>
        <LoadingItemsIndicator />
      </GridWrapper>
    ));
  }
  return null;
}
