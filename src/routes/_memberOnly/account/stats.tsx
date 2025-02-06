import { createFileRoute } from '@tanstack/react-router';

import { OwnAnalyticsWrapper } from '~account/home/memberAnalytics/OwnAnalytics';

export const Route = createFileRoute('/_memberOnly/account/stats')({
  component: RouteComponent,
});

function RouteComponent() {
  return <OwnAnalyticsWrapper />;
}
