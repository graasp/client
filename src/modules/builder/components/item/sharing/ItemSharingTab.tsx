import { useTranslation } from 'react-i18next';

import {
  Alert,
  Box,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { AccountType } from '@graasp/sdk';

import { getRouteApi } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { VISIBILITY_HIDDEN_ALERT_ID } from '@/config/selectors';

import DeleteItemLoginSchemaButton from './DeleteItemLoginSchemaButton';
import HideSettingCheckbox from './HideSettingCheckbox';
import VisibilitySelect from './VisibilitySelect';
import MembershipTabs from './membershipTable/MembershipTabs';
import ShortLinksRenderer from './shortLink/ShortLinksRenderer';

const itemRoute = getRouteApi('/builder/_layout/items/$itemId');
const ItemSharingTab = (): JSX.Element | null => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  // const { item, canAdmin } = useOutletContext<OutletType>();
  // TODO: change this
  const canAdmin = true;
  const { itemId } = itemRoute.useParams();
  const { data: currentAccount } = hooks.useCurrentMember();
  const { data: memberships } = hooks.useItemMemberships(itemId);
  const { data: item } = hooks.useItem(itemId);

  // remove once we get the outlet context working again
  if (item) {
    return (
      <Container disableGutters component="div">
        <Stack gap={2} mb={5}>
          <Box>
            <Typography variant="h5">
              {translateBuilder('SHARING_TITLE')}
            </Typography>
            <ShortLinksRenderer
              itemId={itemId}
              canAdminShortLink={Boolean(memberships && canAdmin)}
            />
          </Box>
          <Divider />
          {currentAccount?.type === AccountType.Individual ? (
            <>
              <Stack gap={2}>
                <Typography variant="h6">
                  {translateBuilder('ITEM_SETTINGS_VISIBILITY_TITLE')}
                </Typography>
                <DeleteItemLoginSchemaButton itemId={itemId} />
                {item?.hidden ? (
                  <Alert
                    id={VISIBILITY_HIDDEN_ALERT_ID}
                    sx={{ my: 1 }}
                    severity="info"
                  >
                    {translateBuilder(
                      'ITEM_SETTINGS_VISIBILITY_HIDDEN_INFORMATION',
                    )}
                  </Alert>
                ) : (
                  <VisibilitySelect item={item} edit={canAdmin} />
                )}
                <HideSettingCheckbox item={item} />
              </Stack>
              <Divider />
            </>
          ) : null}
          <MembershipTabs />
        </Stack>
      </Container>
    );
  }
  return null;
};

export default ItemSharingTab;
