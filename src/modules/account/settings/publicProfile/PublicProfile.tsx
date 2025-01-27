import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Skeleton, Typography } from '@mui/material';

import SocialLinks from 'social-links';

import { BorderedSection } from '@/components/layout/BorderedSection';
import { Button } from '@/components/ui/Button';
import { NS } from '@/config/constants';
import { hooks, mutations } from '@/config/queryClient';
import {
  PUBLIC_PROFILE_BIO_ID,
  PUBLIC_PROFILE_CONFIGURE_BUTTON_ID,
  PUBLIC_PROFILE_DISPLAY_CONTAINER_ID,
  PUBLIC_PROFILE_EDIT_BUTTON_ID,
  PUBLIC_PROFILE_NOT_CONFIGURED_CONTAINER_ID,
} from '@/config/selectors';

import { DisplayLink } from './DisplayLink';
import { EditPublicProfile, Inputs } from './EditPublicProfile';

export function PublicProfile(): JSX.Element {
  const socialLinks = new SocialLinks();

  const { t } = useTranslation(NS.Account, { keyPrefix: 'PUBLIC_PROFILE' });
  const { t: translateCommon } = useTranslation(NS.Common);
  const { data: publicProfile } = hooks.useOwnProfile();

  const { mutate: postProfile } = mutations.usePostPublicProfile();
  const { mutate: patchProfile } = mutations.usePatchPublicProfile();

  const { bio, linkedinID, twitterID, facebookID } = publicProfile || {};

  const [isEditing, setIsEditing] = useState(false);

  const onClose = (newProfile?: Inputs) => {
    if (newProfile) {
      if (publicProfile) {
        patchProfile(newProfile);
      } else {
        postProfile(newProfile);
      }
    }
    setIsEditing(false);
  };
  const onOpen = () => setIsEditing(true);

  if (isEditing) {
    return <EditPublicProfile onClose={onClose} profile={publicProfile} />;
  }

  if (publicProfile) {
    return (
      <BorderedSection
        id={PUBLIC_PROFILE_DISPLAY_CONTAINER_ID}
        title={t('TITLE')}
        topAction={
          <Button
            variant="contained"
            onClick={onOpen}
            id={PUBLIC_PROFILE_EDIT_BUTTON_ID}
            size="small"
          >
            {translateCommon('EDIT.BUTTON_TEXT')}
          </Button>
        }
      >
        <Typography variant="body1" color="textSecondary">
          {t('BIO_LABEL')}
        </Typography>
        <Typography variant="body1" id={PUBLIC_PROFILE_BIO_ID}>
          {bio ?? t('BIO_EMPTY_MSG')}
        </Typography>
        {linkedinID && (
          <DisplayLink
            icon={<LinkedInIcon />}
            contentId="linkedinID"
            href={socialLinks.sanitize('linkedin', linkedinID)}
            content={linkedinID}
          />
        )}
        {twitterID && (
          <DisplayLink
            icon={<TwitterIcon />}
            contentId="twitterID"
            href={socialLinks.sanitize('twitter', twitterID)}
            content={twitterID}
          />
        )}
        {facebookID && (
          <DisplayLink
            icon={<FacebookIcon />}
            contentId="facebookID"
            href={socialLinks.sanitize('facebook', facebookID)}
            content={facebookID}
          />
        )}
      </BorderedSection>
    );
  }
  return (
    <BorderedSection
      id={PUBLIC_PROFILE_NOT_CONFIGURED_CONTAINER_ID}
      title={t('TITLE')}
      topAction={
        <Button
          variant="contained"
          onClick={onOpen}
          id={PUBLIC_PROFILE_CONFIGURE_BUTTON_ID}
          size="small"
        >
          {t('CONFIGURE')}
        </Button>
      }
    >
      {publicProfile === null ? (
        <Typography color="textSecondary" fontStyle="italic">
          {t('NOT_CONFIGURED_DESCRIPTION')}
        </Typography>
      ) : (
        <Skeleton width="100%" />
      )}
    </BorderedSection>
  );
}
