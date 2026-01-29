import { DiscriminatedItem } from '@graasp/sdk';

export type OnChangeLangProp = (lang: string) => void;

// we manually add capsule to the list of possible types, since it isn't a real type in the backend
export type ItemTypeOptions = DiscriminatedItem['type'] | 'capsule';
