import { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import { MessageBodyType } from '@graasp/sdk';

import { useEditingContext } from '../context/EditingContext.js';
import { useMessagesContext } from '../context/MessagesContext.js';
import { EditMessageFunctionType, SendMessageFunctionType } from '../types.js';
import { EditBanner } from './EditBanner.js';
import { Input } from './Input.js';

type Props = {
  sendMessageBoxId?: string;
  sendMessageFunction?: SendMessageFunctionType;
  editMessageFunction?: EditMessageFunctionType;
};

export function InputBar({
  sendMessageBoxId,
  sendMessageFunction,
  editMessageFunction,
}: Readonly<Props>) {
  const { open, body, messageId, cancelEdit } = useEditingContext();
  const [textInput, setTextInput] = useState(open ? body : '');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { chatId } = useMessagesContext();

  useEffect(
    () => {
      // when in editing mode, seed the textfield with the old message body
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setTextInput(open ? body : '');
      // focus the input field
      if (open) {
        inputRef.current?.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, messageId],
  );

  const handleOnCloseEditingBanner = (): void => {
    cancelEdit();
    setTextInput('');
  };

  const handleSendMessageFunction = (newBody: MessageBodyType): void => {
    if (open) {
      editMessageFunction?.({
        messageId: messageId,
        itemId: chatId,
        // todo: here we only send an update of the text and leave out the mention update
        body: newBody.body,
      });
    } else {
      sendMessageFunction?.({ itemId: chatId, ...newBody });
    }
    // reset editing
    cancelEdit();
  };

  return (
    <Box width="100%">
      <EditBanner onClose={handleOnCloseEditingBanner} editedText={body} />
      <Input
        id={sendMessageBoxId}
        inputRef={inputRef}
        textInput={textInput}
        setTextInput={setTextInput}
        sendMessageFunction={handleSendMessageFunction}
      />
    </Box>
  );
}
