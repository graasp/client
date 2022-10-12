/// <reference types="../cypress"/>
import { List } from 'immutable';
import { v4 } from 'uuid';

import React from 'react';

import { convertJs } from '@graasp/sdk';

import { ImmutableMember } from '../../src';
import Chatbox from '../../src/components/Chatbox/Chatbox';
import {
  dataCyWrapper,
  inputTextFieldTextAreaCypress,
  messageIdCyWrapper,
  messagesContainerCypress,
} from '../../src/config/selectors';
import {
  CHAT_ID,
  CHAT_MESSAGES,
  getMockMessage,
} from '../fixtures/chat_messages';
import { MEMBERS } from '../fixtures/members';
import { mockUseAvatar } from '../fixtures/mockHooks';

describe('Render Avatar', () => {
  beforeEach(() => {
    const { hook: fakeHook } = mockUseAvatar();
    cy.mount(
      <Chatbox
        chatId={CHAT_ID}
        currentMember={new ImmutableMember(MEMBERS.ANNA)}
        members={List(convertJs(Object.values(MEMBERS)))}
        messages={List(convertJs(CHAT_MESSAGES))}
        useAvatarHook={fakeHook}
      />,
    );
  });

  it('should call avatar hook', () => {
    const { hook: fakeHook, name: fakeHookName } = mockUseAvatar();
    cy.mount(
      <Chatbox
        chatId={CHAT_ID}
        currentMember={new ImmutableMember(MEMBERS.ANNA)}
        members={List(convertJs(Object.values(MEMBERS)))}
        messages={List(convertJs(CHAT_MESSAGES))}
        useAvatarHook={fakeHook}
      />,
    );
    cy.get(`@${fakeHookName}`).should('have.been.called');
  });
});

describe('Autofocus input field', () => {
  it('should autofocus input field on first render', () => {
    const { hook: fakeHook } = mockUseAvatar();
    cy.mount(
      <Chatbox
        chatId={CHAT_ID}
        currentMember={new ImmutableMember(MEMBERS.ANNA)}
        members={List(convertJs(Object.values(MEMBERS)))}
        messages={List(convertJs(CHAT_MESSAGES))}
        useAvatarHook={fakeHook}
      />,
    ).then(() =>
      cy.get(`#${inputTextFieldTextAreaCypress}`).should('be.focused'),
    );
  });
});

describe('Messages container', () => {
  it('should scroll when there are a lot of messages', () => {
    const { hook: fakeHook } = mockUseAvatar();
    const firstId = v4();
    const lastId = v4();
    cy.mount(
      <Chatbox
        chatId={CHAT_ID}
        currentMember={new ImmutableMember(MEMBERS.ANNA)}
        members={List(convertJs(Object.values(MEMBERS)))}
        messages={List(
          convertJs([
            {
              ...CHAT_MESSAGES[0],
              id: firstId,
            },
            getMockMessage({ member: MEMBERS.ANNA }),
            getMockMessage({ member: MEMBERS.BOB }),
            getMockMessage({ member: MEMBERS.ANNA }),
            getMockMessage({ member: MEMBERS.ANNA }),
            getMockMessage({ member: MEMBERS.BOB }),
            getMockMessage({ member: MEMBERS.BOB }),
            getMockMessage({ member: MEMBERS.ANNA }),
            getMockMessage({ member: MEMBERS.ANNA }),
            {
              ...CHAT_MESSAGES[0],
              id: lastId,
            },
          ]),
        )}
        useAvatarHook={fakeHook}
      />,
    ).then(() => {
      cy.get(dataCyWrapper(messageIdCyWrapper(lastId))).should('be.visible');
      cy.get(dataCyWrapper(messagesContainerCypress)).scrollTo('top');
      cy.get(dataCyWrapper(messageIdCyWrapper(firstId))).should('be.visible');
    });
  });
});
