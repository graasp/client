import { Fragment } from 'react';

import { Stack } from '@mui/material';

import { type FileItemExtra, MimeTypes, getFileExtra } from '@graasp/sdk';

import { Navigate, createFileRoute } from '@tanstack/react-router';

import AdminChatSettings from '~builder/components/item/settings/AdminChatSettings';
import CustomizedTagsSettings from '~builder/components/item/settings/CustomizedTagsSettings';
import GeolocationPicker from '~builder/components/item/settings/GeolocationPicker';
import ItemLicenseSettings from '~builder/components/item/settings/ItemLicenseSettings';
import ItemMetadataContent from '~builder/components/item/settings/ItemMetadataContent';
import ItemSettingsProperties from '~builder/components/item/settings/ItemSettingsProperties';
import LearningGoalsSettings from '~builder/components/item/settings/LearningGoalsSettings';
import LearningInstructionsSettings from '~builder/components/item/settings/LearningInstructionsSettings';
import ThumbnailSetting from '~builder/components/item/settings/ThumbnailSetting';
import { useOutletContext } from '~builder/contexts/OutletContext';

export const Route = createFileRoute(
  '/builder/items/$itemId/_itemPage/settings',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  const { canWrite, item } = useOutletContext();
  const mimetype =
    item.type === 'file'
      ? getFileExtra(item.extra as FileItemExtra).mimetype
      : undefined;
  const isPdf = Boolean(mimetype && MimeTypes.isPdf(mimetype));

  if (canWrite) {
    return (
      <Stack gap={4} mb={4}>
        <ThumbnailSetting item={item} />
        <ItemMetadataContent />
        {isPdf && (
          <Fragment key={item.id}>
            <LearningInstructionsSettings item={item} />
            <LearningGoalsSettings item={item} />
          </Fragment>
        )}
        <CustomizedTagsSettings item={item} />
        <ItemSettingsProperties item={item} />
        <AdminChatSettings item={item} />
        <ItemLicenseSettings />
        <GeolocationPicker itemId={item.id} />
      </Stack>
    );
  }

  // redirect the user to the item if he doesn't have the permission to access this page
  return <Navigate to="/builder/items/$itemId" params={{ itemId }} replace />;
}
