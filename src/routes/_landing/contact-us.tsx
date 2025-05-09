import { Trans, useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { Link, createFileRoute } from '@tanstack/react-router';

import { NS } from '@/config/constants';

import { socialLinks } from '~landing/footer/Footer';

export const Route = createFileRoute('/_landing/contact-us')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'CONTACT_US' });
  return (
    <Stack gap={4} maxWidth="60ch" mt={8}>
      <Typography variant="h1" color="primary">
        {t('TITLE')}
      </Typography>
      <Stack gap={2}>
        <Typography variant="body1" textAlign="left">
          <Trans t={t} i18nKey={'DESCRIPTION'} />
        </Typography>
      </Stack>
      <Stack gap={2}>
        <Typography variant="h2" textAlign="left">
          <Trans t={t} i18nKey={'SUPPORT.TITLE'} />
        </Typography>
        <Typography variant="body1" textAlign="left">
          <Trans t={t} i18nKey={'SUPPORT.DESCRIPTION'} />
        </Typography>
        <Typography variant="body1" fontWeight="bold" textAlign="left">
          {t('SUPPORT.EMAIL')}
        </Typography>
      </Stack>
      <Stack gap={2}>
        <Typography variant="h2" textAlign="left">
          {t('OTHER.TITLE')}
        </Typography>
        <Typography variant="body1" textAlign="left">
          {t('OTHER.DESCRIPTION')}
        </Typography>
        <Typography variant="body1" fontWeight="bold" textAlign="left">
          {t('OTHER.EMAIL')}
        </Typography>
      </Stack>
      <Stack gap={2}>
        <Typography variant="h2" textAlign="left">
          {t('SOCIAL.TITLE')}
        </Typography>
        <Typography variant="body1" textAlign="left">
          {t('SOCIAL.DESCRIPTION')}
        </Typography>
        {socialLinks.map(({ Icon, title, href }) => (
          <Stack key={title} direction="row" alignItems="center" gap={1}>
            <Icon size={24} fill="black" />
            <Link to={href}>{title}</Link>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
