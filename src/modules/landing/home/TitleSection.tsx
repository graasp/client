import { useTranslation } from 'react-i18next';

import { Button, Stack, Typography } from '@mui/material';

import { Image } from '@/components/ui/StyledImages';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';

import { ButtonLink } from '../../../components/ui/ButtonLink';
import { BeLEARN } from './icons/BeLEARN';
import { Epfl } from './icons/EPFL';
import { EdTech } from './icons/EdTech';
import { GoLab } from './icons/GoLab';
import { Unine } from './icons/Unine';

export function TitleSection(): JSX.Element {
  const { t } = useTranslation(NS.Landing);
  return (
    <Stack component="section" direction="column" my={5} maxWidth="lg">
      <Stack
        direction={{ xs: 'column', lg: 'row-reverse' }}
        justifyItems="flex-start"
        alignItems="center"
        width="100%"
        gap={10}
      >
        <Stack
          flex={{ lg: 1 }}
          height={{ xs: '400px', lg: 'unset' }}
          borderRadius={4}
          overflow="hidden"
        >
          <Image alt="cover" src="/illustration/children-old.webp" />
        </Stack>
        <Stack direction="column" gap={10} flex={{ lg: 2 }}>
          <Stack direction="column" gap={4}>
            <Stack direction="column">
              <Typography
                variant="h2"
                color="primary"
                alignSelf={{ xs: 'center', lg: 'flex-start' }}
              >
                {t('HOME.TITLE')}
              </Typography>
              <Typography
                variant="h1"
                color="primary"
                textAlign={{ xs: 'center', lg: 'unset' }}
                alignSelf={{ xs: 'center', lg: 'flex-start' }}
              >
                {t('HOME.SUBTITLE')}
              </Typography>
            </Stack>
            <Typography
              variant="h4"
              component="p"
              textAlign={{ xs: 'center', lg: 'unset' }}
              alignSelf={{ xs: 'center', lg: 'flex-start' }}
            >
              {t('HOME.DESCRIPTION')}
            </Typography>
          </Stack>
          <Stack direction="column" gap={4}>
            <Stack
              id="buttonsContainer"
              direction={{ xs: 'column', md: 'row' }}
              justifyItems="center"
              alignItems="center"
              gap={4}
            >
              <ButtonLink variant="contained" to="/auth/register">
                {t('HOME.REGISTER_CALL_TO_ACTION')}
              </ButtonLink>
              <Button
                component="a"
                variant="contained"
                color="library"
                href={GRAASP_LIBRARY_HOST}
              >
                {t('HOME.LIBRARY_CALL_TO_ACTION')}
              </Button>
            </Stack>
          </Stack>
          <Stack direction="column" gap={1}>
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
              <Epfl width="150px" height="3rem" />
              <BeLEARN width="150px" height="3rem" />
              <EdTech width="150px" height="3rem" />
              <Unine width="150px" height="3rem" />
              <GoLab width="150px" height="3rem" />
              {/* <span>GOGA</span>
              <span>IHUB4SCHOOL</span>
              <span>UNCTAD</span> */}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
