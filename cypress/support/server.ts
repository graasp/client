import { API_ROUTES } from '@graasp/query-client';
import {
  ChatMessage,
  CompleteMember,
  HttpMethod,
  ItemGeolocation,
  Member,
  PublicProfile,
  getIdsFromPath,
  isDescendantOf,
  isError,
  isRootItem,
} from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';

import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';
import { CURRENT_MEMBER, MEMBER_PUBLIC_PROFILE } from '../fixtures/members';
import { MockItem } from '../fixtures/mockTypes';
import { MEMBER_STORAGE_ITEM_RESPONSE } from '../fixtures/storage';
import { ANALYTICS_HOST, API_HOST, BUILDER_HOST } from './env';
import { MemberForTest } from './types';
import {
  ID_FORMAT,
  checkMemberHasAccess,
  getChatMessagesById,
  getChildren,
  getItemById,
} from './utils';

const {
  buildGetCurrentMemberRoute,
  SIGN_OUT_ROUTE,
  buildPatchCurrentMemberRoute,
  buildUploadAvatarRoute,
  buildPatchMemberPasswordRoute,
  buildGetOwnPublicProfileRoute,
  buildPatchPublicProfileRoute,
  buildPostMemberEmailUpdateRoute,
  buildGetMemberStorageRoute,
  buildExportMemberDataRoute,
  buildDeleteCurrentMemberRoute,
  buildGetItemGeolocationRoute,
  buildGetItemChatRoute,
  buildGetItemRoute,
  buildGetItemLoginSchemaRoute,
  buildDownloadFilesRoute,
} = API_ROUTES;

export const redirectionReply = {
  headers: { 'content-type': 'text/html' },
  statusCode: StatusCodes.OK,
  body: `
  <!DOCTYPE html>
  <html lang="en">
    <body><h1>Mock Auth Page</h1></body>
  </html>
  `,
};

export const mockGetOwnProfile = (
  publicProfile = MEMBER_PUBLIC_PROFILE,
  shouldThrowError = false,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: `${API_HOST}/${buildGetOwnPublicProfileRoute()}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          body: null,
        });
      }
      return reply({ statusCode: StatusCodes.OK, body: publicProfile });
    },
  ).as('getOwnProfile');
};

export const mockEditPublicProfile = (
  currentProfile: PublicProfile,
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: `${API_HOST}/${buildPatchPublicProfileRoute()}`,
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ ...currentProfile, ...body });
    },
  ).as('editPublicProfile');
};

export const mockGetCurrentMember = (
  currentMember: CompleteMember | null = CURRENT_MEMBER,
  shouldThrowError = false,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      pathname: `/${buildGetCurrentMemberRoute()}`,
    },
    ({ reply }) => {
      // simulate member accessing without log in
      if (currentMember == null) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED });
      }
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }
      // avoid sign in redirection
      return reply(currentMember);
    },
  ).as('getCurrentMember');
};

export const mockEditCurrentMember = (
  currentMember: CompleteMember,
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      pathname: `/${buildPatchCurrentMemberRoute()}`,
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ ...currentMember, ...body });
    },
  ).as('editMember');
};

export const mockSignInRedirection = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      pathname: '/signin',
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('signInRedirection');
};

export const mockSignOut = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(SIGN_OUT_ROUTE),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('signOut');
};

export const mockGetCurrentMemberAvatar = (
  currentMember: MemberForTest | null,
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/members/${ID_FORMAT}/avatar/(original|large|medium|small)\\?replyUrl\\=true`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError || !currentMember) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const { thumbnails } = currentMember;
      if (!thumbnails) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      return reply(thumbnails);
    },
  ).as('getCurrentMemberAvatarUrl');
};

export const mockGetStorage = (storageAmountInBytes: number): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetMemberStorageRoute()}`),
    },
    ({ reply }) =>
      reply({ current: storageAmountInBytes, maximum: 5368709120 }),
  ).as('getCurrentMemberStorage');
};

export const mockGetMemberStorageFiles = (
  files = MEMBER_STORAGE_ITEM_RESPONSE,
  shouldThrowError = false,
): void => {
  const route = new RegExp(`${API_HOST}/members/current/storage/files`);
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: route,
    },
    ({ url, reply }) => {
      const params = new URL(url).searchParams;

      const page = window.parseInt(params.get('page') ?? '1');
      const pageSize = window.parseInt(params.get('pageSize') ?? '10', 10);

      const result = files.slice((page - 1) * pageSize, page * pageSize);

      if (shouldThrowError) {
        return reply({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          body: null,
        });
      }
      return reply({
        statusCode: StatusCodes.OK,
        body: {
          data: result,
          pagination: {
            page,
            pageSize,
          },
          totalCount: files.length,
        },
      });
    },
  ).as('getMemberStorageFiles');
};

export const mockPostAvatar = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      pathname: `/${buildUploadAvatarRoute()}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.OK });
    },
  ).as('uploadAvatar');
};

export const mockUpdatePassword = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      pathname: `/${buildPatchMemberPasswordRoute()}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply('update password');
    },
  ).as('updatePassword');
};

export const mockCreatePassword = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      pathname: `/password`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ status: StatusCodes.NO_CONTENT });
    },
  ).as('createPassword');
};

export const mockUpdateEmail = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      pathname: `/${buildPostMemberEmailUpdateRoute()}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('updateMemberEmail');
};

export const mockExportData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      pathname: `/${buildExportMemberDataRoute()}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('exportData');
};

export const mockDeleteCurrentMember = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      pathname: `/${buildDeleteCurrentMemberRoute()}`,
    },
    ({ reply }) => reply({ statusCode: StatusCodes.NO_CONTENT }),
  ).as('deleteCurrentMember');
};

export const mockGetPasswordStatus = (hasPassword: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      pathname: `/members/current/password/status`,
    },
    ({ reply }) => reply({ hasPassword }),
  ).as('getPasswordStatus');
};

export const mockGetStatus = (shouldThrowServerError = false) => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: `${API_HOST}/status`,
    },
    ({ reply }) => {
      if (shouldThrowServerError) {
        return reply({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR });
      }
      return reply({ statusCode: StatusCodes.OK });
    },
  ).as('getStatus');
};

export const mockRequestPasswordReset = (shouldThrowServerError = false) => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: `${API_HOST}/password/reset`,
    },
    ({ reply }) => {
      if (shouldThrowServerError) {
        // member email was not found
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('requestPasswordReset');
};

export const mockResetPassword = (shouldThrowServerError = false) => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: `${API_HOST}/password/reset`,
    },
    ({ reply }) => {
      if (shouldThrowServerError) {
        // token is not present or password is too weak
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('resetPassword');
};

export const mockLogin = (shouldThrowServerError = false) => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: `${API_HOST}/login`,
    },
    ({ reply }) => {
      if (shouldThrowServerError) {
        // token is not present or password is too weak
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('login');
};

export const mockGetAccessibleItems = (items: MockItem[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/accessible`),
    },
    ({ url, reply }) => {
      const params = new URL(url).searchParams;

      const page = parseInt(params.get('page') ?? '1', 10);
      const pageSize = parseInt(params.get('pageSize') ?? '10', 10);

      // warning: we don't check memberships
      const root = items.filter(isRootItem);

      // improvement: apply requested filters

      const result = root.slice((page - 1) * pageSize, page * pageSize);

      reply({ data: result, totalCount: root.length });
    },
  ).as('getAccessibleItems');
};

export const mockGetItem = (
  { items, currentMember }: { items: MockItem[]; currentMember: Member | null },
  shouldThrowError?: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetItemRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, itemId);

      // item does not exist in db
      if (!item || shouldThrowError) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({
        item,
        items,
        member: currentMember,
      });

      if (isError(error)) {
        return reply(error);
      }

      return reply({
        body: item,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItem');
};

export const mockGetItemChat = ({
  chatMessages,
}: {
  chatMessages: ChatMessage[];
}): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetItemChatRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const itemChat = getChatMessagesById(chatMessages, itemId);

      return reply({
        body: itemChat,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItemChat');
};

export const mockGetChildren = (
  items: MockItem[],
  member: Member | null,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/children`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id: thisId }) => id === thisId);

      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({ item, items, member });
      if (isError(error)) {
        return reply(error);
      }
      const children = getChildren(items, item, member);
      return reply(children);
    },
  ).as('getChildren');
};

export const mockGetDescendants = (
  items: MockItem[],
  member: Member | null,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/descendants`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id: thisId }) => id === thisId);

      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({ item, items, member });
      if (isError(error)) {
        return reply(error);
      }
      const descendants = items.filter(
        (newItem) =>
          isDescendantOf(newItem.path, item.path) &&
          checkMemberHasAccess({ item: newItem, items, member }) ===
            undefined &&
          newItem.path !== item.path,
      );
      return reply(descendants);
    },
  ).as('getDescendants');
};

export const mockDefaultDownloadFile = (
  { items, currentMember }: { items: MockItem[]; currentMember: Member | null },
  shouldThrowError?: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildDownloadFilesRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id: thisId }) => id === thisId);
      const replyUrl = new URLSearchParams(new URL(url).search).get('replyUrl');
      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({
        item,
        items,
        member: currentMember,
      });
      if (isError(error)) {
        return reply(error);
      }

      // either return the file url or the fixture data
      // info: we don't test fixture data anymore since the frontend uses url only
      if (replyUrl && item.filepath) {
        return reply(item.filepath);
      }

      return reply({ fixture: item.filefixture });
    },
  ).as('downloadFile');
};

export const mockGetLoginSchemaType = (itemLogins: {
  [key: string]: string;
}): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetItemLoginSchemaRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];

      // improvement: add response for itemLoginSchemaType
      const itemLogin = itemLogins[itemId];

      if (itemLogin) {
        return reply(itemLogin);
      }
      return reply({
        statusCode: StatusCodes.NOT_FOUND,
      });
    },
  ).as('getLoginSchemaType');
};

export const mockBuilder = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${BUILDER_HOST}`),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('builder');
};

export const mockAnalytics = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(ANALYTICS_HOST),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('analytics');
};

export const mockGetAppLink = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildAppItemLinkForTest()}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const filepath = url.slice(API_HOST.length).split('?')[0];
      return reply({ fixture: filepath });
    },
  ).as('getAppLink');
};

export const mockAppApiAccessToken = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildAppApiAccessTokenRoute(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ token: 'token' });
    },
  ).as('appApiAccessToken');
};

export const mockGetAppData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'get app data' });
    },
  ).as('getAppData');
};

export const mockPostAppData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'post app data' });
    },
  ).as('postAppData');
};

export const mockDeleteAppData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'delete app data' });
    },
  ).as('deleteAppData');
};

export const mockPatchAppData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'patch app data' });
    },
  ).as('patchAppData');
};

export const mockGetItemGeolocation = (items: MockItem[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetItemGeolocationRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => id === itemId);

      if (!item) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      if (item?.geolocation) {
        return reply(item?.geolocation);
      }

      const parentIds = getIdsFromPath(item.path);
      // suppose return only one
      const geolocs = items
        .filter((i) => parentIds.includes(i.id))
        .filter(Boolean)
        .map((i) => i.geolocation) as Partial<ItemGeolocation>[];

      if (geolocs.length) {
        return reply(geolocs[0]);
      }

      return reply({ statusCode: StatusCodes.NOT_FOUND });
    },
  ).as('getItemGeolocation');
};

export const mockGetItemsInMap = (
  items: MockItem[],
  currentMember: Member | null,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/geolocation`),
    },
    ({ reply, url }) => {
      const itemId = new URL(url).searchParams.get('parentItemId');
      const item = items.find(({ id }) => id === itemId);

      if (!item) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      const children = getChildren(items, item, currentMember);

      const geolocs = [
        item?.geolocation,
        ...children.map((c) => c.geolocation),
      ].filter(Boolean);

      return reply(geolocs);
    },
  ).as('getItemsInMap');
};
