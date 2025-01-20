import { Box } from '@mui/material'

import { Outlet, createFileRoute } from '@tanstack/react-router'

import ErrorAlert from '~builder/components/common/ErrorAlert'
import { useOutletContext } from '~builder/contexts/OutletContext'

export const Route = createFileRoute('/builder/items/$itemId/_itemPage')({
  component: RouteComponent,
})

function RouteComponent() {
  // const { itemId } = Route.useParams();
  // const search = Route.useSearch();
  const outletContext = useOutletContext()

  if (outletContext.item) {
    return (
      <Box py={1} px={2}>
        <Box display="flex" alignItems="center">
          <span style={{ backgroundColor: 'green' }}>Nav is here</span>
          {/*
          <Tooltip title={t(BUILDER.BACK)}>
      <Link to={{
              pathname: buildItemPath(itemId),
              search: search.toString(),
            }}>
        <IconButton>
          <ArrowCircleLeftRoundedIcon fontSize="large" />
        </IconButton>
      </Link>
    </Tooltip>
          <Navigation /> */}
        </Box>
        <Box px={2}>
          <Outlet />
        </Box>
      </Box>
    )
  }

  return <ErrorAlert />
}
