import { toast } from 'react-toastify';

import { Notifier, routines } from '@graasp/query-client';

import axios from 'axios';

import { MessageKeys } from '@/@types/i18next';

import { NS } from './constants';

const {
  updatePasswordRoutine,
  postPublicProfileRoutine,
  patchPublicProfileRoutine,
  updateEmailRoutine,
  exportMemberDataRoutine,
} = routines;

// todo: find a way to use the i18n instance instead
const translate = (str: string, _options: { ns: string }) => str;

export const getErrorMessageFromPayload = (
  payload?: Parameters<Notifier>[0]['payload'],
): keyof MessageKeys => {
  if (payload?.error && axios.isAxiosError(payload.error)) {
    return ((payload.error.response?.data as { message: string } | undefined)
      ?.message ?? 'UNEXPECTED_ERROR') as keyof MessageKeys;
  }

  return (payload?.error?.message ?? 'UNEXPECTED_ERROR') as keyof MessageKeys;
};

type ErrorPayload = Parameters<Notifier>[0]['payload'] & {
  failure?: unknown[];
};

type SuccessPayload = {
  message?: string;
};

type Payload = ErrorPayload & SuccessPayload;

const getSuccessMessageFromPayload = (payload?: SuccessPayload) =>
  (payload?.message ?? 'DEFAULT_SUCCESS') as keyof MessageKeys;

export default ({
  type,
  payload,
}: {
  type: string;
  payload?: Payload;
}): void => {
  let message: keyof MessageKeys | undefined = undefined;

  switch (type) {
    // error messages
    case updatePasswordRoutine.FAILURE:
    case postPublicProfileRoutine.FAILURE:
    case updateEmailRoutine.FAILURE:
    case patchPublicProfileRoutine.FAILURE:
    case exportMemberDataRoutine.FAILURE: {
      message = getErrorMessageFromPayload(payload);
      break;
    }

    // success messages
    case updatePasswordRoutine.SUCCESS:
    case postPublicProfileRoutine.SUCCESS:
    case updateEmailRoutine.SUCCESS:
    case patchPublicProfileRoutine.SUCCESS:
    case exportMemberDataRoutine.SUCCESS: {
      message = getSuccessMessageFromPayload(payload);
      break;
    }

    default:
  }

  // error notification
  if (payload?.error && message) {
    toast.error(translate(message, { ns: NS.Messages }));
  }
  // success notification
  else if (message) {
    toast.success(translate(message, { ns: NS.Messages }));
  }
};
