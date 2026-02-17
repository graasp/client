import type {
  ChatMention,
  ChatMessage,
  CompleteGuest,
  CompleteMember,
  CompleteMembershipRequest,
  ItemGeolocation,
  ItemLoginSchema,
  MemberStorageItem,
  MembershipRequestStatus,
  PublicationStatus,
  RecycledItemData,
  ShortLink,
  Tag,
  ThumbnailsBySize,
} from '@graasp/sdk';

import type {
  CurrentSettings,
  Invitation,
  ItemMembership,
  ItemPublished,
  ItemValidationGroup,
  ItemVisibility,
  PackedBookmark,
  PackedItem,
  Profile,
} from '@/openapi/client';

export type ItemForTest = PackedItem & {
  geolocation?: Partial<ItemGeolocation>;
  tags?: Tag[];
  thumbnails?: ThumbnailsBySize;
  visibilities?: ItemVisibility[];
  itemLoginSchema?: Partial<ItemLoginSchema>;
  readFilepath?: string;
  chat?: ChatMessage[];
  memberships?: ItemMembership[];
  invitations?: Partial<Invitation>[];
  published?: ItemPublished;
  public?: ItemVisibility;
};

export type MemberForTest = CompleteMember & { thumbnails?: string };

export type FileItemForTest = PackedItem & {
  createFilepath: string;
  readFilepath: string;
};
export type ApiConfig = {
  currentGuest?: CompleteGuest | null;
  currentSettings?: Partial<CurrentSettings>;
  hasPassword?: boolean;
  currentProfile?: Profile | null;
  getCurrentProfileError?: boolean;
  editPublicProfileError?: boolean;
  items?: ItemForTest[];
  recycledItems?: PackedItem[];
  members?: MemberForTest[];
  currentMember?: MemberForTest | null;
  mentions?: ChatMention[];
  shortLinks?: ShortLink[];
  bookmarkedItems?: PackedBookmark[];
  recycledItemData?: RecycledItemData[];
  itemPublicationStatus?: PublicationStatus;
  publishedItemData?: ItemPublished[];
  membershipRequests?: (CompleteMembershipRequest & {
    status?: MembershipRequestStatus;
  })[];
  itemValidationGroups?: ItemValidationGroup[];
  deleteItemsError?: boolean;
  postItemError?: boolean;
  moveItemsError?: boolean;
  copyItemsError?: boolean;
  getItemError?: boolean;
  editItemError?: boolean;
  shareItemError?: boolean;
  getMemberError?: boolean;
  defaultUploadError?: boolean;
  defaultDownloadFileError?: boolean;
  getCurrentMemberError?: boolean;
  postItemVisibilityError?: boolean;
  postItemLoginError?: boolean;
  putItemLoginError?: boolean;
  editMemberError?: boolean;
  postItemFlagError?: boolean;
  getItemChatError?: boolean;
  recycleItemsError?: boolean;
  getRecycledItemsError?: boolean;
  deleteItemVisibilityError?: boolean;
  restoreItemsError?: boolean;
  getItemThumbnailError?: boolean;
  getAvatarUrlError?: boolean;
  postItemThumbnailError?: boolean;
  postAvatarError?: boolean;
  importZipError?: boolean;
  getCategoriesError?: boolean;
  getItemCategoriesError?: boolean;
  postItemCategoryError?: boolean;
  deleteItemCategoryError?: boolean;
  postInvitationsError?: boolean;
  getItemInvitationsError?: boolean;
  patchInvitationError?: boolean;
  deleteInvitationError?: boolean;
  updatePasswordError?: boolean;
  createPasswordError?: boolean;
  updateEmailError?: boolean;
  exportDataError?: boolean;
  storageAmountInBytes?: number;
  files?: MemberStorageItem[];
  getMemberStorageFilesError?: boolean;
  shouldFailRequestPasswordReset?: boolean;
  shouldFailResetPassword?: boolean;
  shouldFailLogin?: boolean;
  chatMessages?: ChatMessage[];
  postItemChatMessageError?: boolean;
  clearItemChatError?: boolean;
  getMemberMentionsError?: boolean;
  getAppLinkError?: boolean;
  appApiAccessTokenError?: boolean;
  deleteAppDataError?: boolean;
  getPublishedItemsError?: boolean;
  importH5pError?: boolean;
  deleteShortLinkError?: boolean;
  patchShortLinkError?: boolean;
  postShortLinkError?: boolean;
  getShortLinkAvailable?: boolean;
  getShortLinksItemError?: boolean;
  deleteBookmarkError?: boolean;
  addBookmarkError?: boolean;
  getBookmarkError?: boolean;
};
