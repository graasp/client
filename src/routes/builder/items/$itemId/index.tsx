import { type JSX, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Divider, Stack, Typography } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { ITEM_MAIN_CLASS } from '@/config/selectors';
import CustomInitialLoader from '@/ui/CustomInitialLoader/CustomInitialLoader';
import DrawerHeader from '@/ui/DrawerHeader/DrawerHeader';

import Chatbox from '~builder/components/common/Chatbox';
import { ItemContent } from '~builder/components/item/ItemContent';
import ItemPanel from '~builder/components/item/ItemPanel';
import ItemHeader from '~builder/components/item/header/ItemHeader';
import { useOutletContext } from '~builder/contexts/OutletContext';

export const Route = createFileRoute('/builder/items/$itemId/')({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { item } = useOutletContext();
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { chatOpen: chatIsOpen } = Route.useSearch();

  const [isChatboxOpen, setIsChatboxOpen] = useState(chatIsOpen ?? false);
  const toggleChatbox = () => setIsChatboxOpen((s) => !s);

  if (item) {
    return (
      <>
        <Helmet>
          <title>{item.name}</title>
        </Helmet>
        <Stack direction="row" className={ITEM_MAIN_CLASS} height="100%">
          <Stack p={2} width="100%" maxWidth="xl" mx="auto">
            <ItemHeader
              showNavigation
              isChatboxOpen={isChatboxOpen}
              toggleChatbox={toggleChatbox}
            />

            <ItemContent item={item} />
          </Stack>
          {isChatboxOpen && (
            <ItemPanel open={isChatboxOpen}>
              <DrawerHeader
                handleDrawerClose={() => {
                  setIsChatboxOpen(false);
                }}
              >
                <Typography variant="h6">
                  {translateBuilder('ITEM_CHATBOX_TITLE', {
                    name: item.name,
                  })}
                </Typography>
              </DrawerHeader>
              <Divider />
              <Chatbox item={item} />
            </ItemPanel>
          )}
        </Stack>
      </>
    );
  }
  return <CustomInitialLoader />;
}
