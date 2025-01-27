import {
  type JSX,
  KeyboardEvent,
  MouseEvent,
  useContext,
  useState,
} from 'react';

import { Badge, IconButton, Stack, SwipeableDrawer } from '@mui/material';

import { Filter } from 'lucide-react';

import { useMobileView } from '@/ui/hooks/useMobileView';

import DateRangeInput from '~analytics/common/DateRangeInput';
import { TOGGLE_FILTERS_DRAWER_BUTTON_ID } from '~analytics/config/selectors';
import { DataContext } from '~analytics/context/DataProvider';

import ActionsSelect from '../functionality/ActionsSelect';
import UsersSelect from '../functionality/UsersSelect';
import ViewSelect from '../functionality/ViewSelect';

const ChartsHeader = (): JSX.Element => {
  const { isMobile } = useMobileView();

  const { dateRange, setDateRange, selectedUsers, selectedActionTypes } =
    useContext(DataContext);
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (event: KeyboardEvent | MouseEvent) => {
    // Keep the drawer open when using the Tab key to navigate between filter inputs
    if (
      event &&
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' ||
        (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpenDrawer(!openDrawer);
  };

  const filtersSelected = selectedUsers.length + selectedActionTypes.length;

  const filterButton = (
    <IconButton
      aria-label="open-filter"
      onClick={toggleDrawer}
      id={TOGGLE_FILTERS_DRAWER_BUTTON_ID}
    >
      <Badge color="primary" badgeContent={filtersSelected}>
        <Filter />
      </Badge>
    </IconButton>
  );

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={{ xs: 2, sm: 3, lg: 4 }}
        p={2}
        width="100%"
      >
        <ViewSelect />

        {isMobile ? (
          filterButton
        ) : (
          <Stack direction="row">
            <DateRangeInput dateRange={dateRange} setDateRange={setDateRange} />
            {filterButton}
          </Stack>
        )}
      </Stack>
      <SwipeableDrawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={openDrawer}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        <Stack
          sx={{
            width: '100%',
            padding: 2,
            mt: isMobile ? 3 : 8,
            gap: 2,
            minWidth: '350px',
          }}
        >
          {isMobile && (
            <DateRangeInput dateRange={dateRange} setDateRange={setDateRange} />
          )}
          <UsersSelect />
          <ActionsSelect />
        </Stack>
      </SwipeableDrawer>
    </>
  );
};

export default ChartsHeader;
