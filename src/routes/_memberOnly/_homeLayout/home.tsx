import { Divider, Stack, useMediaQuery, useTheme } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { BookmarkedItems } from '@/modules/home/bookmarks/BookmarkedItems';

import { useItemSearch } from '~builder/components/item/ItemSearch';
import { NewFolderButton } from '~builder/components/item/form/folder/NewFolderButton';
import NewItemButton from '~builder/components/main/NewItemButton';
import { SelectionContextProvider } from '~builder/components/main/list/SelectionContext';
import { HomeScreenContent } from '~builder/components/pages/home/HomeScreenContent';

export const Route = createFileRoute('/_memberOnly/_homeLayout/home')({
  component: HomeRoute,
  staticData: { pageTitle: 'MY_GRAASP' },
});

function HomeRoute() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const itemSearch = useItemSearch();

  return (
    <>
      <BookmarkedItems />
      <Divider flexItem />
      <SelectionContextProvider>
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
        <HomeScreenContent searchText={itemSearch.text} />
      </SelectionContextProvider>
    </>
  );
}
