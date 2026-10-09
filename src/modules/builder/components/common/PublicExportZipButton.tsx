import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { ListItemIcon, MenuItem } from '@mui/material';

import { PackageIcon } from 'lucide-react';

import { NS } from '@/config/constants';
import { buildPublicExportZipButtonId } from '@/config/selectors';
import type { GenericItem } from '@/openapi/client';

type Props = {
  itemId: GenericItem['id'];

  /**
   * ui context the button is located
   */
  dataUmamiContext?: string;
};

/**
 * Download a public folder as zip, for visitors who are not logged in
 * The export is served by the admin app, which also serves this client,
 * so the path is absolute without a host
 */
const PublicExportZipButton = ({
  itemId,
  dataUmamiContext,
}: Props): JSX.Element => {
  const { t } = useTranslation(NS.Builder);

  return (
    <MenuItem
      id={buildPublicExportZipButtonId(itemId)}
      component="a"
      href={`/public/folders/${itemId}/export`}
      data-umami-event="public-export-zip"
      data-umami-event-context={dataUmamiContext}
    >
      <ListItemIcon>
        <PackageIcon />
      </ListItemIcon>
      {t('ITEM_MENU_PUBLIC_EXPORT_ZIP_MENU_ITEM')}
    </MenuItem>
  );
};

export default PublicExportZipButton;
