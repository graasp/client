import type { JSX } from 'react';

import { styled } from '@mui/material';

import { Account, ChatMessage, CurrentAccount } from '@graasp/sdk';

import { CONTAINER_HEIGHT_SAFETY_MARGIN } from '../constants.js';
import { CurrentMemberContextProvider } from '../context/CurrentMemberContext.js';
import { EditingContextProvider } from '../context/EditingContext.js';
import { MessagesContextProvider } from '../context/MessagesContext.js';
import {
  DeleteMessageFunctionType,
  EditMessageFunctionType,
  SendMessageFunctionType,
} from '../types.js';
import { InputBar } from './InputBar.js';
import { Messages } from './Messages.js';

const ChatboxContainer = styled('div')({
  // set height of full container
  // the margin is used to make it "slightly" smaller than the ful height to not have very small scrollbars
  height: `calc(100vh - ${CONTAINER_HEIGHT_SAFETY_MARGIN}px)`,
  minHeight: '0px',
  display: 'flex',
  flexDirection: 'column',
});

const InputContainer = styled('div')({
  // no flex growing -> keep container at bottom of window
  flex: 'none',
});

type Props = {
  id?: string;
  sendMessageBoxId?: string;
  messages?: ChatMessage[];
  sendMessageFunction?: SendMessageFunctionType;
  deleteMessageFunction?: DeleteMessageFunctionType;
  editMessageFunction?: EditMessageFunctionType;
  chatId: string;
  showAdminTools?: boolean;
  currentMember?: CurrentAccount | null;
  members?: Account[];
};

export function Chatbox({
  id,
  sendMessageBoxId,
  sendMessageFunction,
  deleteMessageFunction,
  editMessageFunction,
  messages,
  chatId,
  showAdminTools = false,
  currentMember,
  members,
}: Readonly<Props>): JSX.Element {
  return (
    <EditingContextProvider>
      <CurrentMemberContextProvider currentMember={currentMember}>
        <MessagesContextProvider
          chatId={chatId}
          members={members}
          messages={messages}
        >
          <ChatboxContainer id={id}>
            <Messages
              currentMember={currentMember}
              isAdmin={showAdminTools}
              deleteMessageFunction={deleteMessageFunction}
            />
            <InputContainer>
              <InputBar
                sendMessageBoxId={sendMessageBoxId}
                sendMessageFunction={sendMessageFunction}
                editMessageFunction={editMessageFunction}
              />
            </InputContainer>
          </ChatboxContainer>
        </MessagesContextProvider>
      </CurrentMemberContextProvider>
    </EditingContextProvider>
  );
}
