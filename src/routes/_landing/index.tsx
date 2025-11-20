import { Stack } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { MaintenanceAnnouncement } from '@/modules/home/MaintenanceAnnouncement';

import BodyWrapper from '~landing/components/BodyWrapper';
import CallToAction from '~landing/home/CallToAction';
import { Messages } from '~landing/home/Messages';
import { NeedSupport } from '~landing/home/NeedSupport';
import { NewsLetter } from '~landing/home/NewsLetter';
import { OurMissions } from '~landing/home/OurMissions';
import { Supporters } from '~landing/home/Supporters';
import { TitleSection } from '~landing/home/TitleSection';
import { UserTestimoniesSection } from '~landing/home/UserTestimoniesSection';
import { Preview } from '~landing/preview/PreviewModeContext';

export const Route = createFileRoute('/_landing/')({
  component: Index,
});

function Index() {
  return (
    <>
      <Stack mb={8}>
        <MaintenanceAnnouncement showCloseButton={false} suffix="landing" />
        <TitleSection />
        <Supporters />
      </Stack>
      <BodyWrapper>
        <Messages />
        <NeedSupport />
        <OurMissions />
        <Preview>
          <UserTestimoniesSection />
        </Preview>
        <NewsLetter />
        <CallToAction />
      </BodyWrapper>
    </>
  );
}
