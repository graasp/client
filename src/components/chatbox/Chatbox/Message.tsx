import { useTranslation } from 'react-i18next';

import { Box, Stack, Typography, colors, styled } from '@mui/material';

import { Account, ChatMessage, CurrentAccount } from '@graasp/sdk';

import { format } from 'date-fns';
import truncate from 'lodash.truncate';

import { NS } from '@/config/constants.js';
import { getLocalForDateFns } from '@/config/langs.js';
import { hooks } from '@/config/queryClient.js';
import Avatar from '@/ui/Avatar/Avatar.js';

import {
  DEFAULT_USER_NAME,
  MAX_AVATAR_SIZE,
  MAX_USERNAME_LENGTH,
} from '../constants.js';
import { messageIdCyWrapper } from '../selectors.js';
import MessageBody from './MessageBody.js';

const MessageWrapper = styled(Box)(({ theme }) => ({
  background: colors.grey[100],
  borderRadius: '5px',
  margin: theme.spacing(1, 0),
  padding: theme.spacing(0.5, 1, 0),
  maxWidth: '70%',
  width: 'fit-content',
  minWidth: 100,
  // wrap text at box limit
  wordBreak: 'break-word',
}));

const TimeText = styled(Typography)({
  float: 'right',
});

type Props = {
  message: ChatMessage;
  currentMember?: CurrentAccount | null;
  member?: Account;
};

const Message = ({ message, currentMember, member }: Props) => {
  const { t, i18n } = useTranslation(NS.Chatbox);
  const {
    data: avatarUrl,
    isLoading: isLoadingAvatar,
    isFetching: isFetchingAvatar,
  } = hooks.useAvatarUrl({
    id: member?.id,
    size: 'small',
  });
  const creatorId = message.creator?.id;
  const isOwnMessage = creatorId === currentMember?.id;
  const creatorName = member?.name
    ? truncate(member?.name, { length: MAX_USERNAME_LENGTH })
    : DEFAULT_USER_NAME;
  const time = format(message.createdAt, 'HH:mm aaa', {
    locale: getLocalForDateFns(i18n.language),
  });

  return (
    <MessageWrapper
      p={1}
      sx={
        isOwnMessage
          ? { background: colors.grey[300], alignSelf: 'flex-end' }
          : undefined
      }
      data-cy={messageIdCyWrapper(message.id)}
    >
      {!isOwnMessage && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
          gap={1}
        >
          {member?.id && (
            <Avatar
              variant={'circular'}
              alt={creatorName}
              isLoading={isLoadingAvatar || isFetchingAvatar}
              component="avatar"
              url={avatarUrl}
              maxHeight={MAX_AVATAR_SIZE}
              maxWidth={MAX_AVATAR_SIZE}
            />
          )}
          <Typography variant="subtitle2">{creatorName}</Typography>
        </Stack>
      )}
      <MessageBody messageBody={message.body} />
      <TimeText variant="caption">
        {`${
          // when the createdAt and updatedAt times are different it means the message has been modified
          message.updatedAt !== message.createdAt
            ? t('MESSAGE_MODIFIED_INDICATOR')
            : ''
        } ${time}`}
      </TimeText>
    </MessageWrapper>
  );
};

export default Message;
