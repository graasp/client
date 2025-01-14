import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Id, toast } from 'react-toastify';

import { AxiosProgressEvent } from 'axios';

import { NS } from '@/config/constants';

export const useUploadWithProgress = (): {
  update: (p: AxiosProgressEvent) => void;
  close: (e?: Error) => void;
  show: (p?: number) => void;
} => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  // we need to keep a reference of the toastId to be able to update it
  const toastId = useRef<Id | null>(null);

  const show = (progress = 0) => {
    toastId.current = toast.info(translateBuilder('UPLOADING'), {
      progress,
      position: 'bottom-left',
    });
  };

  const update = ({ progress }: AxiosProgressEvent) => {
    // check if we already displayed a toast
    if (toastId.current === null && progress && progress < 1) {
      show(progress);
    }
    if (toastId.current) {
      toast.update(toastId.current, { progress });
    }
  };

  const close = (error?: Error) => {
    // show correct feedback message
    if (error) {
      toast.error(error.message);
    } else if (toastId.current) {
      toast.done(toastId.current);
    }
    // delete reference
    if (toastId.current) {
      toastId.current = null;
    }
  };

  return { show, update, close };
};
