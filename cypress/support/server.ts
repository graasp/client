import { API_ROUTES } from '@graasp/query-client';
import {
  AccountType,
  App,
  ChatMention,
  CompleteGuest,
  CompleteMember,
  CompleteMembershipRequest,
  DiscriminatedItem,
  HttpMethod,
  Invitation,
  ItemBookmark,
  ItemGeolocation,
  ItemMembership,
  ItemPublished,
  ItemValidationGroup,
  ItemVisibilityType,
  Member,
  PermissionLevel,
  PermissionLevelCompare,
  PublicProfile,
  PublicationStatus,
  RecycledItemData,
  ShortLink,
  ShortLinksOfItem,
  buildPathFromIds,
  getIdsFromPath,
  isDescendantOf,
  isError,
  isRootItem,
} from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';

import { ITEM_PAGE_SIZE, SETTINGS } from '../../src/modules/builder/constants';
import { buildInvitation } from '../e2e/builder/fixtures/invitations';
import {
  AVATAR_LINK,
  ITEM_THUMBNAIL_LINK,
} from '../e2e/builder/fixtures/thumbnails/links';
import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';
import {
  CURRENT_MEMBER,
  MEMBERS,
  MEMBER_PUBLIC_PROFILE,
} from '../fixtures/members';
import { MEMBER_STORAGE_ITEM_RESPONSE } from '../fixtures/storage';
import { API_HOST } from './env';
import { ItemForTest, MemberForTest } from './types';
import {
  ID_FORMAT,
  SHORTLINK_FORMAT,
  checkMemberHasAccess,
  extractItemIdOrThrow,
  getChildren,
  getItemById,
  parseStringToRegExp,
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
  buildGetItemPublishedInformationRoute,
  buildAppListRoute,
  buildGetLastItemValidationGroupRoute,
  buildEditItemRoute,
  buildItemUnpublishRoute,
  buildGetMemberRoute,
  buildPostManyItemMembershipsRoute,
  ITEMS_ROUTE,
  buildUploadFilesRoute,
  GET_BOOKMARKED_ITEMS_ROUTE,
  buildPostItemLoginSignInRoute,
  buildPostItemVisibilityRoute,
  buildEditItemMembershipRoute,
  buildDeleteItemMembershipRoute,
  buildPostItemFlagRoute,
  buildExportItemChatRoute,
  buildPostItemChatMessageRoute,
  buildClearItemChatRoute,
  buildDeleteItemVisibilityRoute,
  buildUploadItemThumbnailRoute,
  buildImportZipRoute,
  buildPostInvitationsRoute,
  buildGetItemInvitationsForItemRoute,
  buildDeleteInvitationRoute,
  buildPatchInvitationRoute,
  buildPostUserCSVUploadWithTemplateRoute,
  buildResendInvitationRoute,
  buildPostUserCSVUploadRoute,
  buildGetPublishedItemsForMemberRoute,
  buildItemPublishRoute,
  buildGetPublicationStatusRoute,
  buildPostItemValidationRoute,
  buildGetShortLinkAvailableRoute,
  buildGetShortLinksItemRoute,
  buildPostShortLinkRoute,
  buildPatchShortLinkRoute,
  buildDeleteShortLinkRoute,
  buildDeleteItemThumbnailRoute,
  buildImportH5PRoute,
} = API_ROUTES;

const checkMembership = ({
  item,
}: {
  item: ItemForTest;
  currentMember: Member;
}) => {
  return PermissionLevelCompare.gte(item?.permission, PermissionLevel.Read);
};

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

export const mockGetAppListRoute = (apps: App[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: `${API_HOST}/${buildAppListRoute}`,
    },
    (req) => {
      req.reply(apps);
    },
  ).as('getApps');
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
  currentMember: CompleteMember | null,
  currentGuest: CompleteGuest | null,
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
        if (currentGuest == null) {
          return reply({ statusCode: StatusCodes.UNAUTHORIZED });
        } else {
          return reply(currentGuest);
        }
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

export const mockPostItemLogin = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${buildPostItemLoginSignInRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url, body }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      // check query match item login schema
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);
      const { itemLoginSchema } = item;

      // provide either username or member id
      if (body.username) {
        expect(body).not.to.have.keys('memberId');
      } else if (body.memberId) {
        expect(body).not.to.have.keys('username');
      }

      // should have password if required
      if (
        itemLoginSchema.type ===
        SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME_AND_PASSWORD
      ) {
        expect(body).to.have.any.keys('password');
      }

      reply({
        headers: { 'content-type': 'text/html' },
        statusCode: StatusCodes.OK,
      });
    },
  ).as('postItemLogin');
};

export const mockPutItemLoginSchema = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Put,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login-schema$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      // check query match item login schema
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);

      reply(item);
    },
  ).as('putItemLoginSchema');
};

export const mockDeleteItemLoginSchema = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login-schema$`),
    },
    ({ reply, url }) => {
      // check query match item login schema
      const id = url.slice(API_HOST.length).split('/')[2];

      reply(id);
    },
  ).as('deleteItemLoginSchema');
};

export const mockGetItemLogin = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetItemLoginSchemaRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      reply({
        body: item?.itemLoginSchema ?? {},
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItemLogin');
};

export const mockGetItemLoginSchema = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      // TODO: use build url
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login\\-schema$`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      const schema = item?.itemLoginSchema;
      if (!schema) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }
      return reply({
        body: schema,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItemLoginSchema');
};

export const mockGetItemLoginSchemaType = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login\\-schema\\-type$`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      // if no item login schema is defined, the backend returns null
      return reply({
        body: item?.itemLoginSchema?.type ?? null,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItemLoginSchemaType');
};

export const mockEditItemMembershipForItem = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(
        `${API_HOST}/${buildEditItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply }) => {
      // this mock intercept does nothing
      reply('true');
    },
  ).as('editItemMembership');
};

export const mockDeleteItemMembershipForItem = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(
        `${API_HOST}/${buildDeleteItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply }) => {
      // this mock intercept does nothing
      reply('true');
    },
  ).as('deleteItemMembership');
};

export const mockPostItemVisibility = (
  items: ItemForTest[],
  currentMember: Member,
  shouldThrowError: boolean,
): void => {
  // mock all tag type
  Object.values(ItemVisibilityType).forEach((type) => {
    cy.intercept(
      {
        method: HttpMethod.Post,
        url: new RegExp(
          `${API_HOST}/${buildPostItemVisibilityRoute({
            itemId: ID_FORMAT,
            type,
          })}$`,
        ),
      },
      ({ reply, url, body }) => {
        if (shouldThrowError) {
          reply({ statusCode: StatusCodes.BAD_REQUEST });
          return;
        }
        const itemId = url.slice(API_HOST.length).split('/')[2];
        const tagType = url
          .slice(API_HOST.length)
          .split('/')[4] as ItemVisibilityType;
        const item = items.find(({ id }) => itemId === id);

        if (!item?.visibilities) {
          item.visibilities = [];
        }
        item.visibilities.push({
          id: v4(),
          type: tagType,
          // avoid circular dependency
          item: { id: item.id, path: item.path } as DiscriminatedItem,
          createdAt: '2021-08-11T12:56:36.834Z',
          creator: currentMember,
        });
        reply(body);
      },
    ).as(`postItemVisibility-${type}`);
  });
};

export const mockDeleteItemVisibility = (shouldThrowError: boolean): void => {
  // mock all tag type
  Object.values(ItemVisibilityType).forEach((type) => {
    cy.intercept(
      {
        method: HttpMethod.Delete,
        url: new RegExp(
          `${API_HOST}/${buildDeleteItemVisibilityRoute({
            itemId: ID_FORMAT,
            type,
          })}$`,
        ),
      },
      ({ reply, body }) => {
        if (shouldThrowError) {
          reply({ statusCode: StatusCodes.BAD_REQUEST });
          return;
        }

        reply(body);
      },
    ).as(`deleteItemVisibility-${type}`);
  });
};

export const mockPostItemFlag = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostItemFlagRoute(ID_FORMAT)}$`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('postItemFlag');
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

export const mockGetAccessibleItems = (items: ItemForTest[]): void => {
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

export const mockGetOwnRecycledItemData = (
  recycledItemData: RecycledItemData[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      pathname: `/items/recycled`,
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      const params = new URL(url).searchParams;

      const page = parseInt(params.get('page') ?? '1', 10);
      const pageSize = parseInt(params.get('pageSize') ?? '10', 10);

      const result = recycledItemData.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      reply({
        data: result.map(({ item }) => item),
        totalCount: recycledItemData.length,
        pagination: { page: 1, pageSize: ITEM_PAGE_SIZE },
      });
    },
  ).as('getOwnRecycledItemData');
};

export const mockPostItem = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/items\\?parentId|${API_HOST}/items$`),
    },
    ({ body, reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      // add necessary properties id, path and creator
      const id = v4();
      return reply({
        ...body,
        id,
        path: buildPathFromIds(id),
        creator: CURRENT_MEMBER.id,
      });
    },
  ).as('postItem');
};

export const mockDeleteItems = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/items\\?id\\=`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.ACCEPTED,
      });
    },
  ).as('deleteItems');
};

export const mockRecycleItems = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/recycle\\?id\\=`),
      query: { id: new RegExp(ID_FORMAT) },
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.ACCEPTED,
        // body: ids.map((id) => getItemById(items, id)),
      });
    },
  ).as('recycleItems');
};

export const mockRestoreItems = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/restore\\?id\\=`),
      query: { id: new RegExp(ID_FORMAT) },
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.ACCEPTED,
      });
    },
  ).as('restoreItems');
};

export const mockGetItem = (
  { items, currentMember }: { items: ItemForTest[]; currentMember: Member },
  shouldThrowError: boolean,
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
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      if (shouldThrowError) {
        return reply({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }

      if (item.public) {
        return reply({
          body: item,
          statusCode: StatusCodes.OK,
        });
      }

      if (!checkMembership({ item, currentMember })) {
        if (!currentMember) {
          return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
        }
        return reply({ statusCode: StatusCodes.FORBIDDEN, body: null });
      }

      return reply({
        body: item,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItem');
};

export const mockGetItems = ({
  items,
  currentMember,
}: {
  items: ItemForTest[];
  currentMember: Member;
}): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}\\?id\\=`),
    },
    ({ url, reply }) => {
      const search = new URL(url).searchParams;
      const itemIds = search.getAll('id');
      const result: {
        data: { [key: string]: ItemForTest };
        errors: { statusCode: number }[];
      } = { data: {}, errors: [] };
      itemIds.forEach((id) => {
        const item = getItemById(items, id);

        const haveMembership = checkMembership({ item, currentMember });

        if (!haveMembership) {
          result.errors.push({
            statusCode: StatusCodes.UNAUTHORIZED,
          });
        } else if (!item) {
          result.errors.push({ statusCode: StatusCodes.NOT_FOUND });
        } else {
          result.data[item.id] = item;
        }
      });

      return reply(result);
    },
  ).as('getItems');
};

export const mockGetItemChat = (
  { items }: { items: ItemForTest[] },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetItemChatRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      return reply(item?.chat ?? []);
    },
  ).as('getItemChat');
};

export const mockDownloadItemChat = (
  { items }: { items: ItemForTest[] },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildExportItemChatRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      const messages = item?.chat?.map((c) => ({
        ...c,
        creatorName: Object.values(MEMBERS).find((m) => m.id === c.creator.id)
          ?.name,
      }));
      return reply({
        id: itemId,
        messages,
      });
    },
  ).as('downloadItemChat');
};

export const mockPostItemChatMessage = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${buildPostItemChatMessageRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      return reply(body);
    },
  ).as('postItemChatMessage');
};

export const mockClearItemChat = (
  { items }: { items: ItemForTest[] },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/${buildClearItemChatRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      return reply({ id: itemId, messages: item?.chat });
    },
  ).as('clearItemChat');
};

export const mockGetMemberMentions = (
  { mentions }: { mentions: ChatMention[] },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/mentions`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(mentions);
    },
  ).as('getMemberMentions');
};

export const mockGetItemThumbnailUrl = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      // TODO: handle blob endpoint
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/${ID_FORMAT}/thumbnails`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[2];

      const thumbnails = items.find(
        ({ id: thisId }) => id === thisId,
      )?.thumbnails;
      if (!thumbnails) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      // TODO: RETURN URL
      return reply(ITEM_THUMBNAIL_LINK);
    },
  ).as('downloadItemThumbnailUrl');
};

export const mockPostItemThumbnail = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${buildUploadItemThumbnailRoute(ID_FORMAT)}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.OK });
    },
  ).as('uploadItemThumbnail');
};

export const mockDeleteItemThumbnail = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${buildDeleteItemThumbnailRoute(ID_FORMAT)}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('deleteItemThumbnail');
};

export const mockGetAvatarUrl = (
  members: MemberForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      // TODO: include all sizes
      url: new RegExp(
        `${API_HOST}/members/${ID_FORMAT}/avatar/small\\?replyUrl\\=true`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[2];

      const { thumbnails } =
        members.find(({ id: thisId }) => id === thisId) ?? {};
      if (!thumbnails) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      // TODO: REPLY URL
      return reply(AVATAR_LINK);
    },
  ).as('downloadAvatarUrl');
};

export const mockGetChildren = ({
  items,
  currentMember,
}: {
  items: ItemForTest[];
  currentMember: Member;
}): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/children`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);
      const itemDepthLevel = getIdsFromPath(item.path).length;
      const children = items.filter(
        (elem) =>
          // should be a descendant of the the item
          elem.path.startsWith(item.path) &&
          // should be a direct child
          getIdsFromPath(elem.path).length === itemDepthLevel + 1,
      );
      if (item.public) {
        return reply(children);
      }

      if (!checkMembership({ item, currentMember })) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
      }
      return reply(children);
    },
  ).as('getChildren');
};

export const mockGetParents = ({
  items,
  currentMember,
}: {
  items: ItemForTest[];
  currentMember: Member;
}): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/parents`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);

      if (!checkMembership({ item, currentMember })) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
      }

      // remove 36 from uuid and 1 for the dot
      const parents = items.filter(
        (i) =>
          item?.path.includes(i.path) &&
          i.path.length === (item?.path.length || 0) - 37,
      );
      return reply(parents);
    },
  ).as('getParents');
};

export const mockGetTagsByItem = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/tags`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const result = items.find(({ id }) => id === itemId)?.tags || [];
      return reply(result);
    },
  ).as('getTagsByItem');
};

export const mockAddTag = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/tags`),
    },
    ({ reply }) => reply({ status: StatusCodes.NO_CONTENT }),
  ).as('addTag');
};

export const mockRemoveTag = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/tags/${ID_FORMAT}`),
    },
    ({ reply }) => reply({ status: StatusCodes.NO_CONTENT }),
  ).as('removeTag');
};

export const mockGetItemValidationGroups = (
  itemValidationGroups: ItemValidationGroup[],
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/validations/groups/${ID_FORMAT}`),
    },
    ({ reply }) => {
      reply(itemValidationGroups);
    },
  ).as('getItemValidationGroups');
};

export const mockPostItemValidation = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostItemValidationRoute(ID_FORMAT)}`),
    },
    ({ reply, body }) => {
      reply(body);
    },
  ).as('postItemValidation');
};

export const mockGetLatestValidationGroup = (
  _items: ItemForTest[],
  itemValidationGroups: ItemValidationGroup[],
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetLastItemValidationGroupRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];

      const validationGroup = itemValidationGroups?.find(
        (ivg) => ivg.item.id === itemId,
      );

      if (!validationGroup) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      // TODO: should be dynamic and include failure
      // const validationGroup: ItemValidationGroup = { id: v4(), item, createdAt: '2021-08-11T12:56:36.834Z', itemValidations: [{ item, status: ItemValidationStatus.Success, id: v4(), process: ItemValidationProcess.BadWordsDetection, result: '', createdAt: '2021-08-11T12:56:36.834Z', updatedAt: new Date() }] as ItemValidation[] }
      // TODO: get latest

      return reply(validationGroup);
    },
  ).as('getLatestValidationGroup');
};

export const mockGetItemFavorites = (
  itemFavorites: ItemBookmark[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: `${API_HOST}/${GET_BOOKMARKED_ITEMS_ROUTE}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(itemFavorites);
    },
  ).as('getFavoriteItems');
};

export const mockAddFavorite = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${GET_BOOKMARKED_ITEMS_ROUTE}/${ID_FORMAT}`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('bookmarkItem');
};

export const mockDeleteFavorite = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/${GET_BOOKMARKED_ITEMS_ROUTE}/${ID_FORMAT}`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('unbookmarkItem');
};

export const mockPostInvitations = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostInvitationsRoute(ID_FORMAT)}`),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.split('/')[4];
      const invitations = items.find(({ id }) => id === itemId)?.invitations;

      const result: {
        data: { [key: string]: Invitation };
        errors: { statusCode: number; message: string; data: unknown }[];
      } = {
        data: {},
        errors: [],
      };
      body.invitations.forEach((inv: Parameters<typeof buildInvitation>[0]) => {
        const thisInv = invitations?.find(({ email }) => email === inv.email);
        if (thisInv) {
          result.errors.push({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'An invitation already exists for this email',
            data: inv,
          });
        } else {
          result.data[inv.email] = buildInvitation(inv);
        }
      });
      return reply(result);
    },
  ).as('postInvitations');
};

export const mockGetItemInvitations = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetItemInvitationsForItemRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => id === itemId);
      const invitations = item?.invitations ?? [];

      return reply(invitations);
    },
  ).as('getInvitationsForItem');
};

export const mockResendInvitation = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildResendInvitationRoute({ itemId: ID_FORMAT, id: ID_FORMAT }),
        )}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('resendInvitation');
};

export const mockPatchInvitation = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(
        `${API_HOST}/${buildPatchInvitationRoute({
          itemId: ID_FORMAT,
          id: ID_FORMAT,
        })}`,
      ),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const invitationId = url.slice(API_HOST.length).split('/')[4];
      const item = items.find(({ id }) => id === itemId);
      const invitation = item?.invitations?.find(
        ({ id }) => id === invitationId,
      );
      const newInvitation = { ...invitation, ...body };
      return reply(newInvitation);
    },
  ).as('patchInvitation');
};

export const mockDeleteInvitation = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(
        `${API_HOST}/${buildDeleteInvitationRoute({
          itemId: ID_FORMAT,
          id: ID_FORMAT,
        })}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const invitationId = url.slice(API_HOST.length).split('/')[4];
      const item = items.find(({ id }) => id === itemId);
      const invitation = item?.invitations?.find(
        ({ id }) => id === invitationId,
      );
      return reply(invitation);
    },
  ).as('deleteInvitation');
};

export const mockUploadInvitationCSV = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostUserCSVUploadRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      const itemId = url.split('/').at(-3);
      const item = items.find(({ id }) => id === itemId);
      return reply({ memberships: item.memberships });
    },
  ).as('uploadCSV');
};
export const mockUploadInvitationCSVWithTemplate = (
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${buildPostUserCSVUploadWithTemplateRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      return reply([{ groupName: 'A', memberships: [], invitations: [] }]);
    },
  ).as('uploadCSVWithTemplate');
};

export const mockGetPublicationStatus = (status: PublicationStatus): void => {
  const interceptingPathFormat = buildGetPublicationStatusRoute(ID_FORMAT);
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${interceptingPathFormat}`),
    },
    ({ reply }) => reply(status),
  ).as('getPublicationStatus');
};

export const mockPublishItem = (items: ItemForTest[]): void => {
  const interceptingPathFormat = buildItemPublishRoute(ID_FORMAT);
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${interceptingPathFormat}`),
    },
    ({ reply, url }) => {
      const itemId = extractItemIdOrThrow(interceptingPathFormat, new URL(url));
      const searchItem = items.find((item) => item?.id === itemId);

      if (!searchItem) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      return reply(searchItem);
    },
  ).as('publishItem');
};

export const mockUnpublishItem = (items: ItemForTest[]): void => {
  const interceptingPathFormat = buildItemUnpublishRoute(ID_FORMAT);
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/${interceptingPathFormat}`),
    },
    ({ reply, url }) => {
      const itemId = extractItemIdOrThrow(interceptingPathFormat, new URL(url));
      const searchItem = items.find((item) => item?.id === itemId);

      if (!searchItem) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      return reply(searchItem);
    },
  ).as('unpublishItem');
};

export const mockGetPublishItemInformations = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetItemPublishedInformationRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[3];
      const item = items.find((i) => i?.id === itemId);
      if (!item?.published) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      return reply({ item });
    },
  ).as('getPublishItemInformations');
};

export const mockGetPublishItemsForMember = (
  publishedItemData: ItemPublished[],
  shoulThrow = false,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetPublishedItemsForMemberRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      if (shoulThrow) {
        return reply({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR });
      }

      const memberId = url.slice(API_HOST.length).split('/')[4];
      const published = publishedItemData
        .filter((p) => p.item.creator.id === memberId)
        .map((i) => i.item);
      return reply(published);
    },
  ).as('getPublishedItemsForMember');
};

export const mockMoveItems = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/move\\?id\\=`),
    },
    ({ url, reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      const ids = url
        .slice(API_HOST.length)
        .split('=')
        .splice(1)
        .map((x) => x.replace('&id', ''));

      const updated = ids.map((id) => getItemById(items, id));
      // actually update cached items
      for (const item of updated) {
        let path = buildPathFromIds(item.id);
        if (body.parentId) {
          const parentItem = getItemById(items, body.parentId);
          path = `${parentItem.path}.${path}`;
        }
        item.path = path;
      }

      // todo: do for all children

      return reply({
        statusCode: StatusCodes.ACCEPTED,
      });
    },
  ).as('moveItems');
};

export const mockCopyItems = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/items/copy\\?id\\=`),
    },
    ({ url, reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }
      const ids = url
        .slice(API_HOST.length)
        .split('=')
        .splice(1)
        .map((x) => x.replace('&id', ''));
      const original = ids.map((id) => getItemById(items, id));
      const copies = [];
      for (const item of original) {
        const newId = v4();
        // actually copy
        let path = buildPathFromIds(newId);
        if (body.parentId) {
          const parentItem = getItemById(items, body.parentId);
          path = `${parentItem.path}.${path}`;
        }
        const newItem = { ...item, id: newId, path };
        items.push(newItem);
        copies.push(newItem);
      }
      // todo: do for all children
      return reply({
        statusCode: StatusCodes.ACCEPTED,
      });
    },
  ).as('copyItems');
};

export const mockPostItemMembership = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: `${API_HOST}/item-memberships?*`,
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('postItemMembership');
};

export const mockEditItem = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(`${API_HOST}/${buildEditItemRoute(ID_FORMAT)}`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('editItem');
};

export const mockPostManyItemMemberships = (
  args: { items: ItemForTest[]; members: MemberForTest[] },
  shouldThrowError: boolean,
): void => {
  const { items, members } = args;
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${buildPostManyItemMembershipsRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      const itemId = url.split('/')[4];
      const itemMemberships = items.find(
        ({ id }) => id === itemId,
      )?.memberships;

      // return membership or error if membership
      // for member id already exists
      const result: {
        data: {
          [key: string]: {
            permission: PermissionLevel;
            member: Member;
            item: DiscriminatedItem;
          };
        };
        errors: { statusCode: number; message: string; data: unknown }[];
      } = { data: {}, errors: [] };

      body.memberships.forEach(
        (m: {
          itemPath: string;
          permission: PermissionLevel;
          memberId: string;
        }) => {
          const thisM = itemMemberships?.find(
            ({ account }) => m.memberId === account.id,
          );
          if (thisM) {
            result.errors.push({
              statusCode: StatusCodes.BAD_REQUEST,
              message: 'membership already exists',
              data: thisM,
            });
          }
          result.data[m.memberId] = {
            permission: m.permission,
            member: members?.find(({ id }) => m.memberId === id),
            item: items?.find(({ path }) => m.itemPath === path),
          };
        },
      );
      return reply(result);
    },
  ).as('postManyItemMemberships');
};

export const mockGetMember = (members: Member[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetMemberRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const memberId = url.slice(API_HOST.length).split('/')[2];
      const member = members.find((m) => m.id === memberId);

      // member does not exist in db
      if (!member) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return reply({
        body: member,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getMember');
};

export const mockEditMember = (
  _members: Member[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(`${API_HOST}/${buildPatchCurrentMemberRoute()}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply('edit member');
    },
  ).as('editMember');
};

// mock upload item for default and s3 upload methods
export const mockUploadItem = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildUploadFilesRoute(ID_FORMAT),
        )}$|${API_HOST}/${buildUploadFilesRoute()}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply();
    },
  ).as('uploadItem');
};

export const mockImportZip = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(buildImportZipRoute())}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.ACCEPTED });
    },
  ).as('importZip');
};

export const mockImportH5p = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(buildImportH5PRoute())}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.ACCEPTED });
    },
  ).as('importH5p');
};

export const mockGetDescendants = (
  items: ItemForTest[],
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
  {
    items,
    currentMember,
  }: { items: ItemForTest[]; currentMember: Member | null },
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
      const replyUrl = new URL(url).searchParams.get('replyUrl');
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
      if (replyUrl && item.readFilepath) {
        return reply(item.readFilepath);
      }

      return reply({ fixture: item.readFilepath });
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

export const mockGetItemGeolocation = (items: ItemForTest[]): void => {
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
  items: ItemForTest[],
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

// Intercept ShortLinks calls
export const mockGetShortLinksItem = (
  itemId: string,
  shortLinks: ShortLink[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetShortLinksItemRoute(ID_FORMAT)}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(
        shortLinks
          .filter(({ itemId: id }) => id === itemId)
          .reduce<ShortLinksOfItem>((acc, s) => {
            if (acc[s.platform]) {
              throw new Error(
                `Duplication of platform ${s} in shortlinks for item ${itemId}!`,
              );
            }

            return { ...acc, [s.platform]: s.alias };
          }, {}),
      );
    },
  ).as('getShortLinksItem');
};

export const mockCheckShortLink = (shouldAliasBeAvailable: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetShortLinkAvailableRoute(SHORTLINK_FORMAT)}`,
      ),
    },
    ({ reply }) => {
      if (shouldAliasBeAvailable) {
        return reply({ available: true });
      }

      return reply({ available: false });
    },
  ).as('checkShortLink');
};

export const mockPostShortLink = (
  shortLinks: ShortLink[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostShortLinkRoute()}`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      shortLinks.push(body);

      return reply(body);
    },
  ).as('postShortLink');
};

export const mockPatchShortLink = (
  shortLinks: ShortLink[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(
        `${API_HOST}/${buildPatchShortLinkRoute(SHORTLINK_FORMAT)}`,
      ),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const urlParams = url.split('/');
      const patchedAlias = urlParams[urlParams.length - 1];

      const shortLink = shortLinks.find(
        (shortlink) => shortlink.alias === patchedAlias,
      );

      // This works only because of JS referenced object. It is for a mocked db only.
      shortLink.alias = body.alias;

      return reply(shortLink);
    },
  ).as('patchShortLink');
};

export const mockDeleteShortLink = (
  shortLinks: ShortLink[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(
        `${API_HOST}/${buildDeleteShortLinkRoute(SHORTLINK_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const urlParams = url.split('/');
      const deletedAlias = urlParams[urlParams.length - 1];

      const idxToRemove = shortLinks.findIndex(
        (shortLink) => shortLink.alias === deletedAlias,
      );
      const removed = shortLinks[idxToRemove];
      // This works only because of JS referenced object. It is for a mocked db only.
      shortLinks.splice(idxToRemove, 1);

      return reply(removed);
    },
  ).as('deleteShortLink');
};

export const mockGetLinkMetadata = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/embedded-links/metadata*`),
    },
    ({ reply, url }) => {
      let linkUrl = new URL(url).searchParams.get('link');

      if (!linkUrl.includes('http')) {
        linkUrl = `https://${linkUrl}`;
      }
      if (URL.canParse(linkUrl)) {
        return reply({
          title: 'Page title',
          description: 'Page description',
          html: '',
          icons: [],
          thumbnails: [],
        });
      }
      return reply({ statusCode: StatusCodes.BAD_REQUEST });
    },
  ).as('getLinkMetadata');
};

export const mockGetOwnMembershipRequests = (
  currentMember: Member,
  membershipRequests: CompleteMembershipRequest[],
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/items/${ID_FORMAT}/memberships/requests/own$`,
      ),
    },
    ({ reply, url }) => {
      const urlParams = url.split('/');
      const itemId = urlParams[urlParams.length - 4];
      return reply(
        membershipRequests.find(
          ({ item, member }) =>
            item.id === itemId && member.id === currentMember.id,
        ),
      );
    },
  ).as('getOwnMembershipRequests');
};

export const mockRequestMembership = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/memberships/requests$`),
    },
    ({ reply }) => reply({ statusCode: StatusCodes.OK }),
  ).as('requestMembership');
};

export const mockGetMembershipRequestsForItem = (
  membershipRequests: CompleteMembershipRequest[],
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/memberships/requests$`),
    },
    ({ reply, url }) => {
      const urlParams = url.split('/');
      const itemId = urlParams[urlParams.length - 3];
      return reply(membershipRequests.filter(({ item }) => item.id === itemId));
    },
  ).as('getMembershipRequestsForItem');
};

export const mockRejectMembershipRequest = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(
        `${API_HOST}/items/${ID_FORMAT}/memberships/requests/${ID_FORMAT}`,
      ),
    },
    ({ reply }) => {
      reply({ statusCode: StatusCodes.OK });
    },
  ).as('rejectMembershipRequest');
};

export const mockEnroll = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/enroll`),
    },
    ({ reply }) => {
      reply({ statusCode: StatusCodes.OK });
    },
  ).as('enroll');
};

export const mockGetItemMembershipsForItem = (
  items: ItemForTest[],
  currentMember: Member,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/item-memberships`),
    },
    ({ reply, url }) => {
      const itemId = new URL(url).searchParams.get('itemId');
      const selectedItems = items.filter(({ id }) => itemId.includes(id));
      // todo: use reduce
      const result: {
        data: {
          [key: string]: ItemMembership[];
        };
        errors: { statusCode: number }[];
      } = { data: {}, errors: [] };
      selectedItems.forEach((item) => {
        const { creator, id, memberships } = item;
        // build default membership depending on current member
        // if the current member is the creator, it has membership
        // otherwise it should return an error
        const isCreator = creator.id === currentMember?.id;

        // if the defined memberships does not contain currentMember, it should throw
        const currentMemberHasMembership = memberships?.find(
          ({ account }) => account.id === currentMember?.id,
        );
        // no membership
        if (!currentMemberHasMembership && !isCreator) {
          result.errors.push({ statusCode: StatusCodes.UNAUTHORIZED });
        }

        // return defined memberships or default membership
        result.data[id] = memberships || [
          {
            permission: PermissionLevel.Admin,
            account: { ...creator, type: AccountType.Individual },
            item,
            id: v4(),
            createdAt: '2021-08-11T12:56:36.834Z',
            updatedAt: '2021-08-11T12:56:36.834Z',
          },
        ];
      });
      reply(result);
    },
  ).as('getItemMemberships');
};
