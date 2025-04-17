import {
  ChatMention,
  ChatMessage,
  CompleteGuest,
  CompleteMember,
  CompleteMembershipRequest,
  DiscriminatedItem,
  Invitation,
  ItemBookmark,
  ItemGeolocation,
  ItemLoginSchema,
  ItemMembership,
  ItemPublished,
  ItemValidationGroup,
  ItemVisibility,
  LocalFileItemType,
  MemberStorageItem,
  MembershipRequestStatus,
  PermissionLevelOptions,
  PublicProfile,
  PublicationStatus,
  RecycledItemData,
  S3FileItemType,
  ShortLink,
  Tag,
  ThumbnailsBySize,
} from '@graasp/sdk';

export type ItemForTest = DiscriminatedItem & {
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
  permission?: PermissionLevelOptions | null;
  public?: ItemVisibility;
};

export type MemberForTest = CompleteMember & { thumbnails?: string };

export type LocalFileItemForTest = LocalFileItemType & {
  createFilepath: string;
  readFilepath: string;
};
export type S3FileItemForTest = S3FileItemType & {
  createFilepath: string;
  readFilepath: string;
};
export type FileItemForTest = LocalFileItemForTest | S3FileItemForTest;

export type ApiConfig = {
  currentGuest?: CompleteGuest | null;
  hasPassword?: boolean;
  currentProfile?: PublicProfile | null;
  getCurrentProfileError?: boolean;
  editPublicProfileError?: boolean;
  items?: ItemForTest[];
  recycledItems?: DiscriminatedItem[];
  members?: MemberForTest[];
  currentMember?: MemberForTest | null;
  mentions?: ChatMention[];
  shortLinks?: ShortLink[];
  itemId?: DiscriminatedItem['id'];
  bookmarkedItems?: ItemBookmark[];
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
  getAppDataError?: boolean;
  postAppDataError?: boolean;
  patchAppDataError?: boolean;
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
