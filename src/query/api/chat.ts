import {
  ChatMessage,
  ChatMessageWithCreator,
  DeleteChatMessageParamType,
  PatchChatMessageParamType,
  PostChatMessageParamType,
  UUID,
} from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  buildClearItemChatRoute,
  buildDeleteItemChatMessageRoute,
  buildGetItemChatRoute,
  buildPatchItemChatMessageRoute,
  buildPostItemChatMessageRoute,
} from '../routes.js';
import { verifyAuthentication } from './axios.js';

export const getItemChat = async (id: UUID) =>
  axios
    .get<ChatMessageWithCreator[]>(`${API_HOST}/${buildGetItemChatRoute(id)}`)
    .then(({ data }) => data);

export const postItemChatMessage = async ({
  itemId,
  body,
  mentions,
}: PostChatMessageParamType) =>
  verifyAuthentication(() =>
    axios
      .post<ChatMessage>(
        `${API_HOST}/${buildPostItemChatMessageRoute(itemId)}`,
        {
          body,
          mentions,
        },
      )
      .then(({ data }) => data),
  );

export const patchItemChatMessage = async ({
  itemId,
  messageId,
  body,
  mentions,
}: PatchChatMessageParamType) =>
  verifyAuthentication(() =>
    axios
      .patch<ChatMessage>(
        `${API_HOST}/${buildPatchItemChatMessageRoute(itemId, messageId)}`,
        {
          body,
          mentions,
        },
      )
      .then(({ data }) => data),
  );

export const deleteItemChatMessage = async ({
  itemId,
  messageId,
}: DeleteChatMessageParamType) =>
  verifyAuthentication(() =>
    axios
      .delete<ChatMessage>(
        `${API_HOST}/${buildDeleteItemChatMessageRoute(itemId, messageId)}`,
      )
      .then(({ data }) => data),
  );

export const clearItemChat = async (id: UUID) =>
  verifyAuthentication(() =>
    axios
      .delete<void>(`${API_HOST}/${buildClearItemChatRoute(id)}`)
      .then(({ data }) => data),
  );
