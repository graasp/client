export const SETTINGS_PAGE_CONTAINER_ID = 'settings-page-container';

export const PREFERENCES_LANGUAGE_SWITCH_ID = 'preferences-language-switch';
export const PREFERENCES_LANGUAGE_DISPLAY_ID = 'preferences-language-display';
export const PREFERENCES_ANALYTICS_SWITCH_ID = 'preferences-analytics-switch';
export const PREFERENCES_EMAIL_FREQUENCY_ID = 'preferences-email-frequency';
export const PREFERENCES_EDIT_BUTTON_ID = 'preferences-edit-button';
export const PREFERENCES_EDIT_CONTAINER_ID = 'preferences-edit-container';
export const PREFERENCES_SAVE_BUTTON_ID = 'preferences-save-button';
export const PREFERENCES_CANCEL_BUTTON_ID = 'preferences-cancel-button';

export const DELETE_MEMBER_SECTION_ID = 'delete-member-section';
export const DELETE_MEMBER_BUTTON_ID = 'delete-member-button';
export const DELETE_MEMBER_DIALOG_CONFIRMATION_FIELD_ID =
  'delete-member-confirmation-field';
export const DELETE_MEMBER_DIALOG_CONFIRMATION_BUTTON_ID =
  'delete-member-confirmation-button';
export const DELETE_MEMBER_DIALOG_TITLE_ID = 'alert-dialog-title';
export const DELETE_MEMBER_DIALOG_DESCRIPTION_ID = 'alert-dialog-description';

export const STORAGE_BAR_ID = 'storage-progress-bar';
export const STORAGE_BAR_LABEL_ID = 'storage-bar-label';
export const MEMBER_STORAGE_FILE_NAME_ID = 'storage-file-name';
export const MEMBER_STORAGE_FILE_SIZE_ID = 'storage-file-size';
export const MEMBER_STORAGE_FILE_UPDATED_AT_ID = 'storage-file-updated-at';
export const MEMBER_STORAGE_PARENT_FOLDER_ID = 'storage-parent-folder';
export const getCellId = (cellName: string, fileId: string): string =>
  `${cellName}-${fileId}`;

export const CARD_TIP_ID = 'tip-card';
export const MEMBER_AVATAR_WRAPPER_ID = 'member-avatar';
export const MEMBER_AVATAR_IMAGE_ID = 'member-avatar-image';
export const MEMBER_CREATED_AT_ID = 'member-created-at';
export const MEMBER_USERNAME_DISPLAY_ID = 'member-username-display';

export const AVATAR_UPLOAD_INPUT_ID = 'avatar-upload-input';
export const AVATAR_UPLOAD_ICON_ID = 'avatar-upload-icon';

export const CROP_MODAL_CONFIRM_BUTTON_ID = 'crop-modal-confirm-button';

export const PERSONAL_INFO_EDIT_BUTTON_ID = 'personal-info-edit-button';
export const PERSONAL_INFO_EDIT_CONTAINER_ID = 'personal-info-edit-container';
export const PERSONAL_INFO_CANCEL_BUTTON_ID = 'personal-info-cancel-button';
export const PERSONAL_INFO_SAVE_BUTTON_ID = 'personal-info-save-button';
export const PERSONAL_INFO_DISPLAY_CONTAINER_ID = 'personal-info-display';
export const PERSONAL_INFO_USERNAME_DISPLAY_ID = 'personal-info-username';
export const PERSONAL_INFO_EMAIL_DISPLAY_ID = 'personal-info-email';
export const PERSONAL_INFO_EMAIL_UPDATE_ALERT_ID =
  'personal-info-email-update-alert';
export const PERSONAL_INFO_INPUT_USERNAME_ID = 'personal-info-input-username';
export const PERSONAL_INFO_INPUT_EMAIL_ID = 'personal-info-input-email';

export const PUBLIC_PROFILE_BIO_ID = 'public-profile-bio';
export const PUBLIC_PROFILE_EDIT_BUTTON_ID = 'public-profile-edit-button';
export const PUBLIC_PROFILE_CONFIGURE_BUTTON_ID =
  'public-profile-configure-button';
export const PUBLIC_PROFILE_SAVE_BUTTON_ID = 'public-profile-save-button';
export const PUBLIC_PROFILE_DISPLAY_CONTAINER_ID =
  'public-profile-display-container';
export const PUBLIC_PROFILE_NOT_CONFIGURED_CONTAINER_ID =
  'public-profile-not-configured-container';
export const PUBLIC_PROFILE_EDIT_CONTAINER_ID = 'public-profile-edit-container';

export const PASSWORD_DISPLAY_CONTAINER_ID = 'password-display-container';
export const PASSWORD_DISPLAY_INFORMATION_ID = 'password-display-information';
export const PASSWORD_EDIT_BUTTON_ID = 'password-edit-button';
export const PASSWORD_EDIT_CONTAINER_ID = 'password-edit-container';
export const PASSWORD_CREATE_CONTAINER_ID = 'password-create-container';
export const PASSWORD_SAVE_BUTTON_ID = 'password-save-button';
export const PASSWORD_INPUT_NEW_PASSWORD_ID = 'new-password';
export const PASSWORD_INPUT_CONFIRM_PASSWORD_ID = 'confirm-password';
export const PASSWORD_INPUT_CURRENT_PASSWORD_ID =
  'password-input-current-password';

export const EMAIL_VALIDATION_BUTTON_ID = 'email-validation-button';
export const EMAIL_VALIDATION_SUCCESS_MESSAGE_ID = 'email-validation-success';
export const EMAIL_VALIDATION_UNAUTHORIZED_MESSAGE_ID =
  'email-validation-unauthorized';
export const EMAIL_VALIDATION_CONFLICT_MESSAGE_ID = 'email-validation-conflict';

export const LOGIN_REQUIRED_TEXT_ID = 'login-required-text';
export const LOGIN_REQUIRED_BUTTON_ID = 'login-required-button';
export const EXPORT_DATA_BUTTON_ID = 'export-data-button-id';
export const NOT_FOUND_TEXT_ID = 'not-found-text-id';
export const NOT_FOUND_MESSAGE_ID = 'not-found-message-id';
export const GO_TO_LANDING_ID = 'to-landing-id';

// ----------------------
// Auth
// ----------------------
export const NAME_SIGN_UP_FIELD_ID = 'nameSignUpField';

export const MAGIC_LINK_EMAIL_FIELD_ID = 'magicLinkEmail';

export const EMAIL_SIGN_UP_FIELD_ID = 'emailSignUpField';
export const EMAIL_SIGN_IN_FIELD_ID = 'emailSignInField';

export const REQUEST_PASSWORD_RESET_EMAIL_FIELD_ID = 'passwordResetEmailField';
export const REQUEST_PASSWORD_RESET_EMAIL_FIELD_HELPER_ID =
  'passwordResetEmailFieldHelper';
export const REQUEST_PASSWORD_RESET_SUBMIT_BUTTON_ID =
  'passwordResetSubmitButton';
export const REQUEST_PASSWORD_RESET_SUCCESS_MESSAGE_ID =
  'passwordResetSuccessMessage';
export const REQUEST_PASSWORD_RESET_ERROR_MESSAGE_ID =
  'passwordResetErrorMessage';

export const RESET_PASSWORD_TOKEN_ERROR_ID = 'resetPasswordTokenError';
export const RESET_PASSWORD_ERROR_MESSAGE_ID = 'resetPasswordErrorMessage';
export const RESET_PASSWORD_NEW_PASSWORD_FIELD_ID =
  'resetPasswordNewPasswordField';
export const RESET_PASSWORD_NEW_PASSWORD_CONFIRMATION_FIELD_ID =
  'resetPasswordNewPasswordConfirmationField';
export const RESET_PASSWORD_SUBMIT_BUTTON_ID = 'resetPasswordSubmitButton';
export const RESET_PASSWORD_SUCCESS_MESSAGE_ID = 'resetPasswordSuccessMessage';
export const RESET_PASSWORD_NEW_PASSWORD_FIELD_ERROR_TEXT_ID =
  'resetPasswordNewPasswordErrorText';
export const RESET_PASSWORD_NEW_PASSWORD_CONFIRMATION_FIELD_ERROR_TEXT_ID =
  'resetPasswordNewPasswordConfirmationErrorText';
export const RESET_PASSWORD_BACK_TO_LOGIN_BUTTON_ID =
  'resetPasswordBackToLoginButton';

export const PASSWORD_SIGN_IN_FIELD_ID = 'passwordSignInField';
export const PASSWORD_SIGN_IN_BUTTON_ID = 'passwordSignInButton';
export const REGISTER_AGREEMENTS_CHECKBOX_ID = 'registerAgreementsCheckbox';
export const SIGN_IN_BUTTON_ID = 'signInButton';
export const REGISTER_BUTTON_ID = 'registerButton';
export const REGISTER_HEADER_ID = 'registerHeader';
export const LOG_IN_HEADER_ID = 'logInHeader';
export const REGISTER_SAVE_ACTIONS_ID = 'registerSaveActions';
export const EMAIL_SIGN_IN_METHOD_BUTTON_ID = 'emailSignInMethodButton';
export const USER_SWITCH_ID = 'userSwitch';
export const SUCCESS_CONTENT_ID = 'successContent';
export const BACK_BUTTON_ID = 'backButtonId';
export const RESEND_EMAIL_BUTTON_ID = 'resendEmailButton';
export const PASSWORD_SUCCESS_ALERT = 'passwordSuccessAlert';

export const PLATFORM_ADVERTISEMENT_CONTAINER_ID =
  'platformAdvertisementContainer';

export const REDIRECTION_CONTENT_CONTAINER_ID = 'redirectionContentContainer';

export const ERROR_DISPLAY_ID = 'errorDisplay';

// player
export const AUTO_LOGIN_CONTAINER_ID = 'autoLoginContainer';
export const AUTO_LOGIN_ERROR_CONTAINER_ID = 'autoLoginErrorContainer';
export const AUTO_LOGIN_NO_ITEM_LOGIN_ERROR_ID = 'autoLoginNoItemLoginError';

export const HOME_PAGE_PAGINATION_ID = 'homePagePagination';
export const buildHomePaginationId = (page: number | null): string =>
  `homePagination-${page}`;

export const MAIN_MENU_ID = 'mainMenu';
export const TREE_VIEW_ID = 'treeView';
export const TREE_FALLBACK_RELOAD_BUTTON_ID = 'treeViewReloadButton';
export const buildTreeItemClass = (id: string): string => `buildTreeItem-${id}`;

export const ITEM_LOGIN_USERNAME_INPUT_ID = 'itemLoginInput';
export const ITEM_LOGIN_SIGN_IN_BUTTON_ID = 'itemLoginSignInButton';
export const ITEM_LOGIN_PASSWORD_INPUT_ID = 'itemLoginPasswordInput';

export const REQUEST_MEMBERSHIP_BUTTON_ID = 'requestMembershipButton';
export const FOLDER_NAME_TITLE_CLASS = 'folderNameTitle';

export const buildFileId = (id: string): string => `file-${id}`;
export const buildDocumentId = (id: string): string => `document-${id}`;
export const buildAppId = (id: string): string => `app-${id}`;
export const buildLinkItemId = (id: string): string => `link-${id}`;
export const COLLAPSIBLE_WRAPPER_ID = 'collapsibleWrapper';
export const buildCollapsibleId = (id: string): string =>
  `${COLLAPSIBLE_WRAPPER_ID}-${id}`;
export const buildFolderButtonId = (id: string): string => `folderButton-${id}`;

export const BACK_TO_SHORTCUT_ID = 'backToButtonShortcut';

export const ENROLL_BUTTON_SELECTOR = 'enrollButton';
export const FORBIDDEN_CONTENT_ID = 'forbiddenContent';
export const FORBIDDEN_CONTENT_CONTAINER_ID = 'forbiddenContentContainer';

export const USER_SWITCH_SIGN_IN_BUTTON_ID = 'userSwitchSignInButton';

export const NAVIGATION_ISLAND_CLASSNAME = 'navigationIsland';
export const ITEM_CHATBOX_BUTTON_ID = 'itemChatboxButton';
export const ITEM_MAP_BUTTON_ID = 'itemMapButton';
export const ITEM_PINNED_BUTTON_ID = 'itemPinnedButton';

export const CHATBOX_DRAWER_ID = 'chatboxDrawer';
export const PANEL_CLOSE_BUTTON_SELECTOR = `#${CHATBOX_DRAWER_ID} [data-testid="ChevronRightIcon"]`;

export const ITEM_FULLSCREEN_BUTTON_ID = 'item-fullscreen-button';

export const ITEM_PINNED_ID = 'item-pinned';
export const ITEM_CHATBOX_ID = 'chatbox';

export const PREVENT_GUEST_MESSAGE_ID = 'prevent-guests';
