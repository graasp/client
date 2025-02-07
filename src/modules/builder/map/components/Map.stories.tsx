import {
  MemberFactory,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { MapComponent } from './Map';

const meta = {
  title: 'Map',
  component: MapComponent,
  args: {
    viewItem: fn(),
    viewItemInBuilder: fn(),
    useDeleteItemGeolocation: fn(),
  },
} satisfies Meta<typeof MapComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

const item = PackedFolderItemFactory();

export const DefaultMap = {
  args: {
    item,
    currentMember: MemberFactory(),
    // useItemsInMap: () =>
    //   ({
    //     data: [
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.511,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.512,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.51,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //       {
    //         id: v4(),
    //         lat: 46.41,
    //         lng: 6.513,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //     ],
    //   }) as any,
    // useAddressFromGeolocation: () =>
    //   ({ data: { addressLabel: 'address', country: 'countryName' } }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usePostItem: () => ({}) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useRecycleItems: () => ({}) as any,
    // useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
    handleAddOnClick({ location }) {
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
    currentMember: null,
    // useItemsInMap: () => ({ data: [] }) as any,
    // useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usePostItem: () => ({}) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useRecycleItems: () => ({}) as any,
    // useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
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
    currentMember: MemberFactory(),
    // useItemsInMap: () =>
    //   ({
    //     data: [
    //       {
    //         lat: 46.51,
    //         lng: 6.5,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //     ],
    //   }) as any,
    // useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usePostItem: () => ({}) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useRecycleItems: () => ({}) as any,
    // useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
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
    currentMember: null,
    // useItemsInMap: () => ({ data: [] }) as any,
    // useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usePostItem: () => ({}) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useRecycleItems: () => ({}) as any,
    // useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
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
    currentMember: MemberFactory({ extra: { lang: 'fr' } }),
    // useItemsInMap: () => ({ data: [] }) as any,
    // useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usePostItem: () => ({}) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useRecycleItems: () => ({}) as any,
    // useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
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
    currentMember: MemberFactory({ extra: { lang: 'fr' } }),
    // useItemsInMap: () =>
    //   ({
    //     data: [
    //       {
    //         lat: 46.51,
    //         lng: 6.5,
    //         addressLabel: 'EPFL',
    //         item,
    //       },
    //     ],
    //   }) as any,
    // useAddressFromGeolocation: () => ({ data: 'address' }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usePostItem: () => ({}) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useRecycleItems: () => ({}) as any,
    // useSuggestionsForAddress: MOCK_USE_SUGGESTIONS as any,
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
