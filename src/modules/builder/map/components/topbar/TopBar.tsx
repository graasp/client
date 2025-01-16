import { useMap } from 'react-leaflet';

import { Box, Divider, Stack } from '@mui/material';

import { useMobileView } from '@/ui/hooks/useMobileView';

import GeolocationPicker, {
  GeolocationPickerProps,
} from '../GeolocationPicker/GeolocationPicker';
import { useQueryClientContext } from '../context/QueryClientContext';
import MobileTopBar from './MobileTopBar';
import Search from './Search';

const TopBar = ({
  onChange,
  tags,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}): JSX.Element => {
  const map = useMap();
  const { useSuggestionsForAddress, currentMember } = useQueryClientContext();

  const { isMobile } = useMobileView();

  const onChangeOption: GeolocationPickerProps['onChangeOption'] = ({
    lat,
    lng,
  }) => {
    map.flyTo({ lat, lng }, 10);
  };

  if (isMobile) {
    return <MobileTopBar tags={tags} onChange={onChange} />;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        left: '10%',
        width: '80%',
        zIndex: 450,
      }}
    >
      <Stack justifyContent="center" alignItems="center" py={2}>
        <Stack
          sx={{
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 3px 15px rgba(0,0,0,0.5)',
          }}
          direction="row"
          gap={2}
          p={2}
        >
          {currentMember && (
            <>
              <Stack>
                <GeolocationPicker
                  useSuggestionsForAddress={useSuggestionsForAddress}
                  onChangeOption={onChangeOption}
                  invisible
                />
              </Stack>
              <Divider orientation="vertical" flexItem />
            </>
          )}
          <Stack>
            <Search invisible tags={tags} onChange={onChange} />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export default TopBar;
