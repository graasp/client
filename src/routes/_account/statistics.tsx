import { createFileRoute } from '@tanstack/react-router';

import { OwnAnalyticsWrapper } from '~account/home/memberAnalytics/OwnAnalytics';

export const Route = createFileRoute('/_account/statistics')({
  component: RouteComponent,
});

function RouteComponent() {
  return <OwnAnalyticsWrapper />;
}
