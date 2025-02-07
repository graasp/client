import { Invitation, Pagination, WebsocketClient } from '@graasp/sdk';

import { keepPreviousData } from '@tanstack/react-query';
import { AxiosError, AxiosInstance } from 'axios';

export const NotificationStatus = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;
export type NotificationStatusType =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];
export type EnableNotifications =
  | {
      [status in NotificationStatusType]?: boolean;
    }
  | boolean;
export type EnableNotificationsParam = {
  enableNotifications: EnableNotifications;
};

export type NotifierOptions = Partial<EnableNotificationsParam>;

export type Notifier = (
  e: {
    type: string;
    payload?: {
      error?: Error | AxiosError;
      message?: string;
      [key: string]: unknown;
    };
  },
  options?: NotifierOptions,
) => void;

export type QueryClientConfig = {
  API_HOST: string;
  SHOW_NOTIFICATIONS: boolean;
  WS_HOST: string;
  enableWebsocket: boolean;
  wsClient?: WebsocketClient | null;
  notifier?: Notifier;
  axios: AxiosInstance;
  defaultQueryOptions?: {
    // time until data in cache considered stale if cache not invalidated
    staleTime?: number;
    // time before cache labeled as inactive to be garbage collected
    gcTime?: number;
    retry?:
      | number
      | boolean
      | ((failureCount: number, error: Error) => boolean);
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    keepPreviousData?: boolean;
    placeholderData?: typeof keepPreviousData;
    refetchOnMount?: boolean;
  };
};

export type PartialQueryConfigForApi = Pick<
  QueryClientConfig,
  'API_HOST' | 'axios'
>;

// todo: move per feature folders
export type NewInvitation = Pick<Invitation, 'email' | 'permission'>;
export const defaultPagination: Partial<Pagination> = { page: 1 };

export type EmbeddedLinkMetadata = {
  title?: string;
  description?: string;
  thumbnails: string[];
  icons: string[];
  html?: string;
  isEmbeddingAllowed: boolean;
};

export type Routine = {
  TRIGGER: string;
  REQUEST: string;
  FAILURE: string;
  SUCCESS: string;
  FULFILL: string;
};
