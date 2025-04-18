import type { JSX } from 'react';

import { DiscriminatedItem } from '@graasp/sdk';

import { Chatbox as GraaspChatbox } from '@/components/chatbox/Chatbox/Chatbox';
import { hooks, mutations } from '@/config/queryClient';
import Loader from '@/ui/Loader/Loader';

import { ITEM_CHATBOX_ID } from '../../config/selectors';

const { useItemChat, useCurrentMember } = hooks;
const {
  usePostItemChatMessage,
  usePatchItemChatMessage,
  useDeleteItemChatMessage,
} = mutations;

type Props = {
  item: DiscriminatedItem;
};

const Chatbox = ({ item }: Props): JSX.Element => {
  const { data: messages, isLoading: isChatLoading } = useItemChat(item.id);
  const { data: currentMember } = useCurrentMember();
  const { mutate: sendMessage } = usePostItemChatMessage();
  const { mutate: editMessage } = usePatchItemChatMessage();
  const { mutate: deleteMessage } = useDeleteItemChatMessage();

  if (isChatLoading) {
    return <Loader />;
  }

  return (
    <GraaspChatbox
      id={ITEM_CHATBOX_ID}
      currentMember={currentMember}
      itemId={item.id}
      messages={messages}
      sendMessageFunction={sendMessage}
      editMessageFunction={editMessage}
      deleteMessageFunction={deleteMessage}
    />
  );
};

export default Chatbox;
