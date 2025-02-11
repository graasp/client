import { useTranslation } from 'react-i18next';

import { Divider, Stack, useMediaQuery, useTheme } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { MenuTabs } from '@/modules/home/MenuTabs';

import { RecentItems } from '~account/home/recentItems/RecentItems';
import { useItemSearch } from '~builder/components/item/ItemSearch';
import { NewFolderButton } from '~builder/components/item/form/folder/NewFolderButton';
import NewItemButton from '~builder/components/main/NewItemButton';
import { SelectionContextProvider } from '~builder/components/main/list/SelectionContext';
import { BuilderPageLayout } from '~builder/components/pages/BuilderPageLayout';
import { HomeScreenContent } from '~builder/components/pages/home/HomeScreenContent';

export const Route = createFileRoute('/_memberOnly/home')({
  component: HomeRoute,
});

function HomeRoute() {
  const { t } = useTranslation(NS.Common, { keyPrefix: 'PAGE_TITLES' });
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const itemSearch = useItemSearch();

  return (
    <Stack gap={4} alignItems="center">
      <MenuTabs />
      <Divider flexItem />
      <RecentItems />
      <Divider flexItem />
      <BuilderPageLayout
        title={t('MY_GRAASP')}
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
    </Stack>
  );
}
