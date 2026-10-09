import {
  GuestFactory,
  ItemLoginSchemaFactory,
  ItemLoginSchemaType,
  PackedDocumentItemFactory,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import {
  buildDownloadButtonId,
  buildExportAsZipButtonId,
  buildItemsGridMoreButtonSelector,
  buildPublicExportZipButtonId,
} from '../../../../../src/config/selectors';
import { HOME_PATH, buildItemPath } from '../../utils';

describe('Export Folder as ZIP', () => {
  const buildExportZipUrl = (itemId: string) => `/api/items/${itemId}/export`;

  it('Export ZIP exists in item menu for folder', () => {
    const item = PackedFolderItemFactory();
    cy.setUpApi({ items: [item] });
    cy.intercept('POST', buildExportZipUrl(item.id)).as('exportZip');
    cy.visit(HOME_PATH);
    cy.get(buildItemsGridMoreButtonSelector(item.id)).click();
    cy.get(`[role="menu"] #${buildExportAsZipButtonId(item.id)}`).click();
    cy.wait('@exportZip');
    // no normal download file button
    cy.get(`[role="menu"] #${buildDownloadButtonId(item.id)}`).should(
      'not.exist',
    );
  });

  it('Export ZIP should not exist in item menu for document', () => {
    const item = PackedDocumentItemFactory();
    cy.setUpApi({ items: [item] });
    cy.visit(HOME_PATH);
    cy.get(buildItemsGridMoreButtonSelector(item.id)).click();
    // no zip export button
    cy.get(`[role="menu"] #${buildExportAsZipButtonId(item.id)}`).should(
      'not.exist',
    );
  });

  it('Export ZIP should not exist in menu in card for guest', () => {
    const folder = PackedFolderItemFactory();
    const itemLoginSchema = ItemLoginSchemaFactory({
      type: ItemLoginSchemaType.Username,
      item: folder,
    });
    const item = PackedFolderItemFactory({ parentItem: folder });
    cy.setUpApi({
      items: [folder, item],
      currentMember: null,
      currentGuest: GuestFactory({ itemLoginSchema }),
    });
    cy.visit(buildItemPath(folder.id));

    cy.get(buildItemsGridMoreButtonSelector(item.id)).click();
    cy.get(`[role="menu"] #${buildDownloadButtonId(item.id)}`).should(
      'not.exist',
    );
  });
});

describe('Download public folder as ZIP', () => {
  const publicVisibility = (item: { path: string }) => ({
    id: 'public-visibility-id',
    type: 'public' as const,
    itemPath: item.path,
    createdAt: new Date().toISOString(),
  });
  const buildAdminExportHref = (itemId: string) =>
    `/public/folders/${itemId}/export`;

  it('logged out visitor can download a public folder and its subfolder', () => {
    const parent = PackedFolderItemFactory();
    const parentWithVisibility = {
      ...parent,
      public: publicVisibility(parent),
    };
    const child = PackedFolderItemFactory({ parentItem: parent });
    const childWithVisibility = {
      ...child,
      public: publicVisibility(parent),
    };
    cy.setUpApi({
      items: [parentWithVisibility, childWithVisibility],
      currentMember: null,
    });

    // subfolder card menu
    cy.visit(buildItemPath(parent.id));
    cy.get(buildItemsGridMoreButtonSelector(child.id)).click();
    cy.get(`[role="menu"] #${buildPublicExportZipButtonId(child.id)}`)
      .should('have.attr', 'href')
      .and('eq', buildAdminExportHref(child.id));
    cy.get('body').type('{esc}');

    // folder header menu
    cy.get(`[aria-label="More"]`).first().click();
    cy.get(`[role="menu"] #${buildPublicExportZipButtonId(parent.id)}`)
      .should('have.attr', 'href')
      .and('eq', buildAdminExportHref(parent.id));
    // logged out visitors do not use the emailed export
    cy.get(`[role="menu"] #${buildExportAsZipButtonId(parent.id)}`).should(
      'not.exist',
    );
  });

  it('is not shown on a non-public folder', () => {
    const parent = PackedFolderItemFactory();
    const child = PackedFolderItemFactory({ parentItem: parent });
    cy.setUpApi({ items: [parent, child], currentMember: null });
    cy.visit(buildItemPath(parent.id));
    cy.get(`#${buildPublicExportZipButtonId(child.id)}`).should('not.exist');
    cy.get(`#${buildPublicExportZipButtonId(parent.id)}`).should('not.exist');
  });
});
