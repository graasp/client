import {
  type KeyboardEvent,
  type ReactNode,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mention,
  MentionItem,
  MentionsInput,
  OnChangeHandlerFunc,
  SuggestionDataItem,
} from 'react-mentions';

import { Send as SendIcon } from '@mui/icons-material';
import { Box, IconButton, Typography, styled, useTheme } from '@mui/material';

import { useQuery } from '@tanstack/react-query';

import { NS } from '@/config/constants.js';
import { getCurrentAccountOptions } from '@/openapi/client/@tanstack/react-query.gen.js';
import type { CreateChatMessageData } from '@/openapi/client/types.gen.js';

import {
  ALL_MEMBERS_ID,
  ALL_MEMBERS_SUGGESTION,
  GRAASP_MENTION_COLOR,
  HARD_MAX_MESSAGE_LENGTH,
} from '../constants.js';
import { useMessagesContext } from '../context/MessagesContext.js';
import {
  charCounterCypress,
  inputTextFieldCypress,
  inputTextFieldTextAreaCypress,
  sendButtonCypress,
} from '../selectors.js';
import { MENTION_MARKUP } from '../utils.js';

const HelperText = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre',
  paddingLeft: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: 'gray',
}));

const mentionStyle = {
  backgroundColor: GRAASP_MENTION_COLOR,
};

type Props = {
  id?: string;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  placeholder?: string;
  textInput: string;
  setTextInput: (newText: string) => void;
  sendOrEditMessage: (newBody: CreateChatMessageData['body']) => void;
};

export function Input({
  id,
  inputRef,
  textInput,
  setTextInput,
  placeholder,
  sendOrEditMessage,
}: Readonly<Props>) {
  // use mui theme for the mentions component
  // we can not use 'useStyles' with it because it requests an object for the styles
  const theme = useTheme();
  // padding for the input field, needs to match the padding for the overlay
  // in the 'highlighter' key
  const inputPadding = theme.spacing(1);
  const inputRadius = theme.spacing(0.5);
  const inputStyle = {
    width: '100%',
    height: '100%',
    minWidth: '0px',
    // mentions
    control: {
      minHeight: '63px',
    },
    input: {
      padding: inputPadding,
      border: '1px solid silver',
      width: '100%',
      overflow: 'auto',
      height: '100%',
      maxHeight: '30vh',
      lineHeight: 'inherit',
      borderRadius: inputRadius,
    },
    highlighter: {
      padding: inputPadding,
      border: '1px solid transparent',
      boxSizing: 'border-box',
      overflow: 'hidden',
      height: '100%',
      maxHeight: '30vh',
    },

    suggestions: {
      // hides the sharp corners
      overflow: 'hidden',
      borderRadius: inputRadius,
      list: {
        // hides the sharp corners
        overflow: 'hidden',
        backgroundColor: 'white',
        fontSize: '1rem',
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: inputRadius,
      },
      item: {
        padding: theme.spacing(0.5, 2),
        '&focused': {
          backgroundColor: '#b9b9ed',
        },
      },
    },
  } as const;

  const { members } = useMessagesContext();
  const { data: currentAccount } = useQuery(getCurrentAccountOptions());
  const { t } = useTranslation(NS.Chatbox);
  const [currentMentions, setCurrentMentions] = useState<string[]>([]);
  const [plainTextMessage, setPlainTextMessage] = useState<string>('');

  // autofocus on first render
  useEffect(
    () => {
      inputRef.current?.focus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!currentAccount) {
    return null;
  }

  const { id: currentMemberId } = currentAccount;

  // exclude self from suggestions and add @all pseudo member
  const memberSuggestions: SuggestionDataItem[] = [
    ALL_MEMBERS_SUGGESTION,
    ...(members
      ?.filter((m) => m.id !== currentMemberId)
      ?.map((m) => ({ id: m.id, display: m.name })) || []),
  ];

  // compute if message exceeds max length
  const isMessageTooLong = textInput.length > HARD_MAX_MESSAGE_LENGTH;

  const onSend = (): void => {
    if (textInput) {
      let expandedMentions: string[] = currentMentions;
      // expand '@all' to all members in mentions array (skip if there are no members)
      if (currentMentions.includes(ALL_MEMBERS_ID) && members?.length) {
        expandedMentions = members.map((m) => m.id);
      }
      sendOrEditMessage({ body: textInput, mentions: expandedMentions });

      // reset input content
      setTextInput('');
      setPlainTextMessage('');
      setCurrentMentions([]);
    }
  };

  // controlled input onChange handler
  const onChange: OnChangeHandlerFunc = (
    _: {
      target: { value: string };
    },
    // new value of the field
    newValue: string,
    // newPlainTextValue of the field
    newPlainTextValue: string,
    newMentions: MentionItem[],
  ): void => {
    setTextInput(newValue);
    setPlainTextMessage(newPlainTextValue);
    setCurrentMentions(newMentions.map(({ id: mentionId }) => mentionId));
  };

  // catch {enter} key press to send messages
  const keyDown = (
    e: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>,
  ): void => {
    // let user insert a new line with shift+enter
    if (e.key === 'Enter' && !e.shiftKey) {
      // do not propagate keypress event when only enter is pressed
      e.preventDefault();
      if (!isMessageTooLong) {
        // send message
        onSend();
      }
    }
  };

  const renderHelperText = (): ReactNode => {
    // when the textInput is empty, return a text with just a whitespace
    // to keep the height of the element the same
    let helperText = ' ';
    if (textInput && plainTextMessage) {
      helperText = plainTextMessage.length.toString();
      // append the max message size
      if (isMessageTooLong) {
        // there is a "space" before the message
        helperText += ` ${t('INPUT_MESSAGE_TOO_LONG', {
          length: HARD_MAX_MESSAGE_LENGTH,
        })}`;
      }
    }
    return (
      <HelperText
        sx={{ ...(isMessageTooLong && { color: 'red !important' }) }}
        variant="caption"
        data-cy={charCounterCypress}
      >
        {helperText}
      </HelperText>
    );
  };

  return (
    <div>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        id={id}
      >
        <MentionsInput
          data-cy={inputTextFieldCypress}
          id={inputTextFieldTextAreaCypress}
          inputRef={inputRef}
          value={textInput}
          onChange={onChange}
          onKeyDown={keyDown}
          style={inputStyle}
          forceSuggestionsAboveCursor
          a11ySuggestionsListLabel={t('SUGGESTED_MENTIONS')}
          placeholder={placeholder ?? t('INPUT_FIELD_PLACEHOLDER')}
        >
          <Mention
            displayTransform={(_, display): string => `@${display}`}
            markup={MENTION_MARKUP}
            trigger="@"
            renderSuggestion={(_, __, highlightedDisplay): ReactNode => (
              <div className="user">{highlightedDisplay}</div>
            )}
            data={memberSuggestions}
            style={mentionStyle}
          />
        </MentionsInput>
        <IconButton
          data-cy={sendButtonCypress}
          onClick={onSend}
          disabled={isMessageTooLong}
        >
          <SendIcon color={isMessageTooLong ? 'disabled' : 'primary'} />
        </IconButton>
      </Box>
      {renderHelperText()}
    </div>
  );
}
