import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/builder/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/builder/_layout/"!</div>
}
