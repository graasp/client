import {
  DiscriminatedItem,
  MemberFactory,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';

import { MOCK_USE_SUGGESTIONS } from '../../.storybook/fixtures';
import MapComponent from './Map';

const meta = {
  title: 'Map',
  component: MapComponent,
} satisfies Meta<typeof MapComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

const item = PackedFolderItemFactory();

export const Map = {
  args: {
    item,
    viewItem: () => ({}) as any,
    currentMember: MemberFactory(),
    useDeleteItemGeolocation: () => ({}) as any,
    useItemsInMap: () =>
      ({
        data: [
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.511,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.512,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.51,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
          {
            lat: 46.41,
            lng: 6.513,
            addressLabel: 'EPFL',
            item,
          },
        ],
      }) as any,
    useAddressFromGeolocation: () =>
      ({ data: { addressLabel: 'address', country: 'countryName' } }) as any,
    usePostItem: () => ({}) as any,
    useRecycleItems: () => ({}) as any,
    useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
    handleAddOnClick({ location }) {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(location));
    },
  },
  decorators: [
    (Story) => (
      <div style={{ margin: 'auto', width: '95vw', height: '95vh' }}>
        <Story />
      </div>
    ),
  ],
  // cannot play inside an iframe
} satisfies Story;

// it shows the country form if localisation is disabled
// it shows the current location otherwise
export const MapSignedOut = {
  args: {
    item: PackedFolderItemFactory(),
    viewItem: () => ({}) as any,
    currentMember: null,
    useDeleteItemGeolocation: () => ({}) as any,
    useItemsInMap: () => ({ data: [] }) as any,
    useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    usePostItem: () => ({}) as any,
    useRecycleItems: () => ({}) as any,
    useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
  },
  decorators: [
    (Story) => (
      <div style={{ margin: 'auto', width: '95vw', height: '95vh' }}>
        <Story />
      </div>
    ),
  ],
  // cannot play inside an iframe
} satisfies Story;

export const MapMobile = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: {
    item,
    viewItem: () => ({}) as any,
    currentMember: MemberFactory(),
    useDeleteItemGeolocation: () => ({}) as any,
    useItemsInMap: () =>
      ({
        data: [
          {
            lat: 46.51,
            lng: 6.5,
            addressLabel: 'EPFL',
            item,
          },
        ],
      }) as any,
    useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    usePostItem: () => ({}) as any,
    useRecycleItems: () => ({}) as any,
    useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
  },
  decorators: [
    (Story) => (
      <div style={{ margin: 'auto', width: '95vw', height: '95vh' }}>
        <Story />
      </div>
    ),
  ],
  // cannot play inside an iframe
} satisfies Story;

// it shows the country form if localisation is disabled
// it shows the current location otherwise
export const MapSignOutMobile = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: {
    item: PackedFolderItemFactory(),
    viewItem: () => ({}) as any,
    currentMember: null,
    useDeleteItemGeolocation: () => ({}) as any,
    useItemsInMap: () => ({ data: [] }) as any,
    useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    usePostItem: () => ({}) as any,
    useRecycleItems: () => ({}) as any,
    useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
  },
  decorators: [
    (Story) => (
      <div style={{ margin: 'auto', width: '95vw', height: '95vh' }}>
        <Story />
      </div>
    ),
  ],
  // cannot play inside an iframe
} satisfies Story;

export const MapFrench = {
  args: {
    item: PackedFolderItemFactory(),
    viewItem: () => ({}) as any,
    currentMember: MemberFactory({ extra: { lang: 'fr' } }),
    useDeleteItemGeolocation: () => ({}) as any,
    useItemsInMap: () => ({ data: [] }) as any,
    useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    usePostItem: () => ({}) as any,
    useRecycleItems: () => ({}) as any,
    useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
  },
  decorators: [
    (Story) => (
      <div style={{ margin: 'auto', width: '95vw', height: '95vh' }}>
        <Story />
      </div>
    ),
  ],
  // cannot play inside an iframe
} satisfies Story;

export const MapRead = {
  args: {
    item: PackedFolderItemFactory({}, { permission: PermissionLevel.Read }),
    viewItem: () => ({}) as any,
    viewItemInBuilder: (it: DiscriminatedItem) => {
      // eslint-disable-next-line no-console
      console.log(it.id);
    },
    currentMember: MemberFactory({ extra: { lang: 'fr' } }),
    useDeleteItemGeolocation: () => ({}) as any,
    useItemsInMap: () =>
      ({
        data: [
          {
            lat: 46.51,
            lng: 6.5,
            addressLabel: 'EPFL',
            item,
          },
        ],
      }) as any,
    useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    usePostItem: () => ({}) as any,
    useRecycleItems: () => ({}) as any,
    useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
  },
  decorators: [
    (Story) => (
      <div style={{ margin: 'auto', width: '95vw', height: '95vh' }}>
        <Story />
      </div>
    ),
  ],
  // cannot play inside an iframe
} satisfies Story;
