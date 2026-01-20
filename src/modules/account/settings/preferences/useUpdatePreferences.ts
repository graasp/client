import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type CurrentSettings, NotificationFrequency } from '@/openapi/client';
import {
  getCurrentSettingsQueryKey,
  marketingEmailsSubscribeMutation,
  marketingEmailsUnsubscribeMutation,
  updateCurrentAccountMutation,
} from '@/openapi/client/@tanstack/react-query.gen';
import { memberKeys } from '@/query/keys';

export const useUpdatePreferences = ({
  marketingEmailsSubscribedAt,
}: Readonly<{
  marketingEmailsSubscribedAt: CurrentSettings['marketingEmailsSubscribedAt'];
}>) => {
  const queryClient = useQueryClient();
  const { mutateAsync: editMember, error } = useMutation({
    ...updateCurrentAccountMutation(),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: memberKeys.current().content,
      });
      await queryClient.invalidateQueries({
        queryKey: getCurrentSettingsQueryKey(),
      });
    },
  });
  const { mutateAsync: emailSubscribe } = useMutation({
    ...marketingEmailsSubscribeMutation(),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getCurrentSettingsQueryKey(),
      });
    },
  });
  const { mutateAsync: emailUnsubscribe } = useMutation({
    ...marketingEmailsUnsubscribeMutation(),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getCurrentSettingsQueryKey(),
      });
    },
  });

  const saveSettings = async ({
    lang,
    enableSaveActions,
    notificationFrequency,
    isSubscribedToMarketingEmails,
  }: {
    lang: string;
    enableSaveActions: boolean;
    notificationFrequency: NotificationFrequency;
    isSubscribedToMarketingEmails: boolean;
  }) => {
    try {
      await editMember({
        body: {
          extra: {
            lang,
            emailFreq: notificationFrequency,
          },
          enableSaveActions,
        },
      });

      // subscribe or unsubscribe from the email notifications on change
      if (
        Boolean(marketingEmailsSubscribedAt) !== isSubscribedToMarketingEmails
      ) {
        if (isSubscribedToMarketingEmails) {
          await emailSubscribe({});
        } else {
          emailUnsubscribe({});
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { saveSettings, error };
};
