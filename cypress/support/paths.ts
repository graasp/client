const GRAASP_LIBRARY_HOST = Cypress.env('VITE_GRAASP_LIBRARY_HOST');
export const GRAASP_REDIRECTION_HOST = Cypress.env(
  'VITE_GRAASP_REDIRECTION_HOST',
);

export const buildGraaspPlayerView = (id: string): string =>
  `/player/${id}/${id}`;
export const buildGraaspBuilderView = (id: string): string =>
  `/builder/items/${id}`;
export const buildGraaspLibraryLink = (id: string): string =>
  `${GRAASP_LIBRARY_HOST}/collections/${id}`;
