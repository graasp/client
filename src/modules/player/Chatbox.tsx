import { Chatbox as GraaspChatbox } from '@graasp/chatbox';
import { DiscriminatedItem } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';

import { ITEM_CHATBOX_ID } from '../../config/selectors';

const { useItemChat, useAvatarUrl, useItemMemberships, useCurrentMember } =
  hooks;
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
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships(item.id);
  const members = itemPermissions?.map((m) => m.account);
  const { data: currentMember } = useCurrentMember();
  const { mutate: sendMessage } = usePostItemChatMessage();
  const { mutate: editMessage } = usePatchItemChatMessage();
  const { mutate: deleteMessage } = useDeleteItemChatMessage();

  if (isChatLoading || isLoadingItemPermissions) {
    return <Loader />;
  }

  return (
    <GraaspChatbox
      id={ITEM_CHATBOX_ID}
      members={members}
      currentMember={currentMember}
      chatId={item.id}
      messages={messages}
      sendMessageFunction={sendMessage}
      editMessageFunction={editMessage}
      deleteMessageFunction={deleteMessage}
      useAvatarUrl={useAvatarUrl}
    />
  );
};

export default Chatbox;
