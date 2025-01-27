import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, useMediaQuery, useTheme } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { NS } from '@/config/constants';

import { useItemSearch } from '~builder/components/item/ItemSearch';
import { NewFolderButton } from '~builder/components/item/form/folder/NewFolderButton';
import NewItemButton from '~builder/components/main/NewItemButton';
import { SelectionContextProvider } from '~builder/components/main/list/SelectionContext';
import { BuilderPageLayout } from '~builder/components/pages/BuilderPageLayout';
import { HomeScreenContent } from '~builder/components/pages/home/HomeScreenContent';

export const Route = createFileRoute('/builder/_layout/')({
  component: HomeScreen,
});

function HomeScreen(): JSX.Element {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const itemSearch = useItemSearch();

  return (
    <BuilderPageLayout
      title={translateBuilder('MY_ITEMS_TITLE')}
      options={
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          {itemSearch.input}
          <NewFolderButton type={isMd ? 'button' : 'icon'} />
          <NewItemButton
            key="newButton"
            size="medium"
            type={isMd ? 'button' : 'icon'}
          />
        </Stack>
      }
    >
      <SelectionContextProvider>
        <HomeScreenContent searchText={itemSearch.text} />
      </SelectionContextProvider>
    </BuilderPageLayout>
  );
}
