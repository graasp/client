import { useTranslation } from 'react-i18next';

import { ThumbnailSize } from '@graasp/sdk';
import { Avatar } from '@graasp/ui';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { buildMemberAvatarId } from '@/config/selectors';

import { AVATAR_ICON_HEIGHT } from '~builder/config/constants';

type Props = {
  maxWidth?: number;
  maxHeight?: number;
};

export function CurrentMemberAvatar({
  maxWidth = AVATAR_ICON_HEIGHT,
  maxHeight = AVATAR_ICON_HEIGHT,
}: Readonly<Props>): JSX.Element {
  const { t } = useTranslation(NS.Builder);
  const { data: member, isLoading } = hooks.useCurrentMember();
  const { data: avatarUrl, isLoading: isLoadingAvatar } = hooks.useAvatarUrl({
    id: member?.id,
    size: ThumbnailSize.Small,
  });
  return (
    <Avatar
      id={buildMemberAvatarId(member?.id)}
      url={avatarUrl}
      isLoading={isLoading || isLoadingAvatar}
      alt={member?.name ?? t('AVATAR_DEFAULT_ALT')}
      component="avatar"
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      sx={{ mx: 1 }}
    />
  );
}
