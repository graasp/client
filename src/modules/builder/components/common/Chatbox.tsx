import type { JSX } from 'react';

import { PackedItem, PermissionLevel } from '@graasp/sdk';

import { Chatbox as GraaspChatbox } from '@/components/chatbox/Chatbox/Chatbox';
import { hooks, mutations } from '@/config/queryClient';
import { CHATBOX_ID, CHATBOX_INPUT_BOX_ID } from '@/config/selectors';
import { Loader } from '@/ui/Loader/Loader';

const { useItemChat, useItemMemberships } = hooks;
const {
  usePostItemChatMessage,
  usePatchItemChatMessage,
  useDeleteItemChatMessage,
} = mutations;

type Props = {
  item: PackedItem;
};

const Chatbox = ({ item }: Props): JSX.Element | null => {
  const { data: chatMessages, isLoading: isChatLoading } = useItemChat(item.id);
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships(item.id);
  const members = itemPermissions?.map(({ account }) => account);
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    hooks.useCurrentMember();
  const { mutate: sendMessage } = usePostItemChatMessage();
  const { mutate: editMessage } = usePatchItemChatMessage();
  const { mutate: deleteMessage } = useDeleteItemChatMessage();

  if (isChatLoading || isLoadingItemPermissions || isLoadingCurrentMember) {
    return <Loader />;
  }

  // only signed in member can see the chat
  if (!currentMember) {
    return null;
  }

  // only show export chat when user has admin right on the item
  const isAdmin = item.permission === PermissionLevel.Admin;

  return (
    <GraaspChatbox
      id={CHATBOX_ID}
      members={members}
      sendMessageBoxId={CHATBOX_INPUT_BOX_ID}
      currentMember={currentMember}
      chatId={item.id}
      messages={chatMessages}
      showAdminTools={isAdmin}
      sendMessageFunction={sendMessage}
      deleteMessageFunction={deleteMessage}
      editMessageFunction={editMessage}
    />
  );
};

export default Chatbox;
