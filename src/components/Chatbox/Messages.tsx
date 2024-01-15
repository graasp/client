import { FC, Fragment, useEffect, useRef } from 'react';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

import { ChatMessage, CompleteMember } from '@graasp/sdk';

import { format } from 'date-fns';
import groupBy from 'lodash.groupby';

import { getDateLocale, useChatboxTranslation } from '@/config/i18n';
import { messagesContainerCypress } from '@/config/selectors';
import { DEFAULT_DATE_FORMAT, SCROLL_SAFETY_MARGIN } from '@/constants';
import { useEditingContext } from '@/context/EditingContext';
import { useMessagesContext } from '@/context/MessagesContext';
import type { DeleteMessageFunctionType } from '@/types';

import Date from './Date';
import Message from './Message';
import MessageActions from './MessageActions';

const Container = styled('div')({
  // used in accordance with the main container (input + scroll window)
  overflowY: 'auto',
  // grow container to push input at bottom of window
  flex: 1,
  minHeight: '0px',
});

const MessageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
});

const SingleMessageContainer = styled(Box)({
  // make sure that the box container takes the most space
  width: '100%',
  display: 'flex',
  // used to place actions on the left of the message
  flexDirection: 'row',
  // center button with message box
  alignItems: 'center',
  alignContent: 'stretch',
});

type Props = {
  currentMember?: CompleteMember | null;
  isAdmin?: boolean;
  deleteMessageFunction?: DeleteMessageFunctionType;
};

const Messages: FC<Props> = ({
  currentMember,
  isAdmin = false,
  deleteMessageFunction,
}) => {
  const { i18n } = useChatboxTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { open } = useEditingContext();
  const { messages, members } = useMessagesContext();

  // scroll down to last message at start, on new message and on editing message
  useEffect(() => {
    if (ref?.current) {
      // temporarily hide the scroll bars when scrolling the container
      ref.current.style.overflowY = 'hidden';
      // scroll down the height of the container + some margin to make sure we are at the bottom
      ref.current.scrollTop = ref.current.scrollHeight + SCROLL_SAFETY_MARGIN;
      // re-activate scroll
      ref.current.style.overflowY = 'auto';
    }
  }, [ref, messages, open]);

  const isOwn = (message: ChatMessage): boolean =>
    message.creator?.id === currentMember?.id;
  const messagesByDay = Object.entries(
    groupBy(messages, ({ createdAt }) =>
      format(createdAt, DEFAULT_DATE_FORMAT, {
        locale: getDateLocale(i18n.language),
      }),
    ),
  );

  return (
    <Container ref={ref} data-cy={messagesContainerCypress}>
      <MessageContainer>
        {messagesByDay?.map(([date, m]) => (
          <Fragment key={date}>
            <Date date={date} />
            {m?.map((message) => {
              const isOwnMessage = isOwn(message);
              return (
                <SingleMessageContainer
                  key={message.id}
                  sx={{
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Message
                    currentMember={currentMember}
                    message={message}
                    member={members?.find(
                      ({ id }) => id === message.creator?.id,
                    )}
                  />
                  {(isOwnMessage || isAdmin) && (
                    <MessageActions
                      message={message}
                      isOwn={isOwnMessage}
                      deleteMessageFunction={deleteMessageFunction}
                    />
                  )}
                </SingleMessageContainer>
              );
            })}
          </Fragment>
        ))}
      </MessageContainer>
    </Container>
  );
};

export default Messages;
