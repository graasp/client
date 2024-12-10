import { createLazyFileRoute } from '@tanstack/react-router';

import { PlatformCube } from '~landing/Platforms/PlatformCube';
import { NewsLetter } from '~landing/home/NewsLetter';
import { OurMissionSection } from '~landing/home/OurMissionSection';
import { TitleSection } from '~landing/home/TitleSection';
import { UserStorySection } from '~landing/home/UserStorySection';
import { UserTestimoniesSection } from '~landing/home/UserTestimoniesSection';

export const Route = createLazyFileRoute('/_landing/')({
  component: Index,
});

function Index() {
  return (
    <>
      <TitleSection />
      <PlatformCube />
      <UserStorySection />
      <OurMissionSection />
      <UserTestimoniesSection />
      <NewsLetter />
    </>
  );
}
