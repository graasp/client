import { Stack } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { MaintenanceAnnouncement } from '@/modules/home/MaintenanceAnnouncement';

import BodyWrapper from '~landing/components/BodyWrapper';
import { Messages } from '~landing/home/Messages';
import { NewsLetter } from '~landing/home/NewsLetter';
import { OurMissionSection } from '~landing/home/OurMissionSection';
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
      <Stack mb={15}>
        <MaintenanceAnnouncement showCloseButton={false} suffix="landing" />
        <TitleSection />
        <Supporters />
      </Stack>
      <BodyWrapper>
        <Messages />
        <OurMissionSection />
        <Preview>
          <UserTestimoniesSection />
        </Preview>
        <Preview>
          <NewsLetter />
        </Preview>
      </BodyWrapper>
    </>
  );
}
