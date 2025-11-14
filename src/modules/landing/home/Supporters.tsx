import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { NS } from '@/config/constants';

import {
  BeLEARN,
  EdTech,
  Epfl,
  GoLab,
  SDC,
  SupporterLink,
  SwissUniversities,
  Unine,
} from './supporterIcons';

export function Supporters() {
  const { t } = useTranslation(NS.Landing);

  return (
    <Stack px={6} bgcolor="white" py={3}>
      <Stack
        direction={{ lg: 'row' }}
        width="100%"
        mx="auto"
        maxWidth="lg"
        justifyContent="space-between"
        alignItems={{ xs: 'left', lg: 'center' }}
      >
        <Typography color="textSecondary">
          {t('HOME.SUPPORTERS_LABEL')}
        </Typography>
        <Stack
          id="logosContainer"
          direction="row"
          gap={1}
          flexWrap="wrap"
          alignItems="center"
        >
          <SupporterLink
            width="90px"
            height="3rem"
            Icon={Epfl}
            href="https://www.epfl.ch"
          />
          <SupporterLink
            width="150px"
            height="3rem"
            Icon={BeLEARN}
            href="https://belearn.swiss/en/"
          />
          <SupporterLink
            width="90px"
            height="3rem"
            Icon={EdTech}
            href="https://www.edtech-collider.ch"
          />
          <SupporterLink
            width="90px"
            height="3rem"
            Icon={Unine}
            href="https://www.unine.ch/imi/en/"
          />
          <SupporterLink
            width="90px"
            height="3rem"
            Icon={GoLab}
            href="https://www.golabz.eu/"
          />
          <SupporterLink
            width="90px"
            height="3rem"
            Icon={SwissUniversities}
            href="https://www.swissuniversities.ch/fr/themes/digitalisation/open-education-digital-competencies/projets-soutenus"
          />
          <SupporterLink
            width="90px"
            height="3rem"
            Icon={SDC}
            href="https://www.eda.admin.ch/eda/en/fdfa/fdfa/organisation-fdfa/directorates-divisions/sdc.html"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Supporters;
