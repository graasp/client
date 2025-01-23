import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Container, Divider, Stack, Typography, styled } from '@mui/material';

import { useSearch } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { ITEM_MAIN_CLASS } from '@/config/selectors';
import { DrawerHeader } from '@/ui/DrawerHeader/DrawerHeader';

import { useOutletContext } from '~builder/contexts/OutletContext';

import Chatbox from '../common/Chatbox';
import ItemPanel from './ItemPanel';
import ItemHeader from './header/ItemHeader';

const StyledContainer = styled(Container)<{ open: boolean }>(({
  theme,
  open,
}) => {
  const openStyles = open
    ? {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }
    : {};

  return {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',

    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    ...openStyles,
  };
});

type Props = {
  children: JSX.Element | JSX.Element[];
  id?: string;
};

const ItemMain = ({ id, children }: Props): JSX.Element => {
  const { item } = useOutletContext();
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { chat: chatIsOpen } = useSearch({
    from: '/builder/items/$itemId',
  });

  const [isChatboxOpen, setIsChatboxOpen] = useState(chatIsOpen ?? false);
  const toggleChatbox = () => setIsChatboxOpen((s) => !s);

  return (
    <>
      <Helmet>
        <title>{item?.name}</title>
      </Helmet>
      <Stack id={id} pt={2} className={ITEM_MAIN_CLASS} height="100%">
        {isChatboxOpen && (
          <ItemPanel open={isChatboxOpen}>
            <DrawerHeader
              handleDrawerClose={() => {
                setIsChatboxOpen(false);
              }}
              direction="rtl"
            >
              <Typography variant="h6">
                {translateBuilder('ITEM_CHATBOX_TITLE', {
                  name: item?.name,
                })}
              </Typography>
            </DrawerHeader>
            <Divider />
            {item && <Chatbox item={item} />}
          </ItemPanel>
        )}
        <StyledContainer open={isChatboxOpen}>
          <ItemHeader
            showNavigation
            isChatboxOpen={isChatboxOpen}
            toggleChatbox={toggleChatbox}
          />

          {children}
        </StyledContainer>
      </Stack>
    </>
  );
};

export default ItemMain;
