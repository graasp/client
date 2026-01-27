import {
  GuestFactory,
  ItemLoginSchemaFactory,
  ItemLoginSchemaType,
  PackedDocumentItemFactory,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import path from 'node:path';

import {
  buildDataCyWrapper,
  buildDownloadButtonId,
  buildExportAsZipButtonId,
  buildItemMenuDataCy,
  buildItemsGridMoreButtonSelector,
} from '../../../../../src/config/selectors';
import { HOME_PATH, buildItemPath } from '../../utils';

const interceptDownloadedFile = ({
  itemId,
  name,
}: {
  itemId: string;
  name: string;
}) => {
  const exportFileUrl = `/api/items/${itemId}/download-file`;
  cy.intercept('GET', exportFileUrl, ({ reply }) => {
    reply({
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${name}"`,
      },
    });
  }).as('exportFile');
};

const expectFileInDownloads = (name: string) => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.readFile(path.join(downloadsFolder, name));
};

describe('Download Item', () => {
  it('Download menu item should exist for document', () => {
    const item = PackedDocumentItemFactory();
    cy.setUpApi({ items: [item] });

    const downloadName = 'myfile.html';
    interceptDownloadedFile({ itemId: item.id, name: downloadName });

    cy.visit(HOME_PATH);
    cy.get(buildDataCyWrapper(buildItemMenuDataCy(item.id))).click();
    cy.get(`[role="menu"] #${buildDownloadButtonId(item.id)}`).click();

    expectFileInDownloads(downloadName);

    // no zip export button
    cy.get(`[role="menu"] #${buildExportAsZipButtonId(item.id)}`).should(
      'not.exist',
    );
  });

  it('Download menu item should exist for public document in card if logged out', () => {
    const folder = PackedFolderItemFactory();
    const document = PackedDocumentItemFactory({ parentItem: folder });
    cy.setUpApi({
      items: [folder, document],
      currentMember: null,
    });

    const downloadName = 'myfile.html';
    interceptDownloadedFile({ itemId: document.id, name: downloadName });

    cy.visit(buildItemPath(folder.id));

    cy.get(buildItemsGridMoreButtonSelector(document.id)).click();
    cy.get(`[role="menu"] #${buildDownloadButtonId(document.id)}`).click();

    expectFileInDownloads(downloadName);
  });

  it('Download menu item should exist in card for guest', () => {
    const folder = PackedFolderItemFactory();
    const itemLoginSchema = ItemLoginSchemaFactory({
      type: ItemLoginSchemaType.Username,
      item: folder,
    });
    const document = PackedDocumentItemFactory({ parentItem: folder });
    cy.setUpApi({
      items: [folder, document],
      currentMember: null,
      currentGuest: GuestFactory({ itemLoginSchema }),
    });

    const downloadName = 'myfile.html';
    interceptDownloadedFile({ itemId: document.id, name: downloadName });

    cy.visit(buildItemPath(folder.id));

    cy.get(buildItemsGridMoreButtonSelector(document.id)).click();
    cy.get(`[role="menu"] #${buildDownloadButtonId(document.id)}`).click();

    expectFileInDownloads(downloadName);
  });
});
