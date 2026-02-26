import type { AppItem, DocumentItem } from '@/openapi/client';

import {
  ADD_FOLDER_BUTTON_CY,
  CREATE_ITEM_APP_ID,
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_H5P_ID,
  CREATE_ITEM_ZIP_ID,
  H5P_DASHBOARD_UPLOADER_ID,
  ZIP_DASHBOARD_UPLOADER_ID,
  buildDataCyWrapper,
} from '../../src/config/selectors';
import { InternalItemType } from '../../src/modules/builder/types';
import { ZIPInternalItem } from '../e2e/builder/fixtures/files';

export const createApp = (
  payload: AppItem,
  options?: { confirm?: boolean; custom?: boolean; id?: string },
): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  cy.get(`#${CREATE_ITEM_APP_ID}`).click();
  cy.fillAppModal(payload, options);
};

export const createDocument = (
  payload: DocumentItem,
  options?: { confirm?: boolean },
): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  cy.get(`#${CREATE_ITEM_DOCUMENT_ID}`).click();
  cy.fillDocumentModal(payload, options);
};

export const createFolder = (
  payload: { name?: string; description?: string },
  options?: { confirm?: boolean },
): void => {
  cy.get(buildDataCyWrapper(ADD_FOLDER_BUTTON_CY)).click({ force: true });
  cy.fillFolderModal(payload, options);
};

// todo: question: only used by import zip ??
export const createItem = (
  payload: ZIPInternalItem | { type: 'h5p'; filepath: string },
  options?: { confirm?: boolean },
): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();

  switch (payload.type) {
    case InternalItemType.ZIP: {
      cy.get(`#${CREATE_ITEM_ZIP_ID}`).click();

      // drag-drop a file in the uploader
      cy.attachFile(cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID}`), payload?.filepath);
      break;
    }
    case 'h5p': {
      cy.get(`#${CREATE_ITEM_H5P_ID}`).click();

      // drag-drop a file in the uploader
      cy.attachFile(
        cy.get(`#${H5P_DASHBOARD_UPLOADER_ID}`),
        (payload as { filepath: string })?.filepath,
      );
      break;
    }
    default:
      cy.fillFolderModal(payload, options);
      break;
  }
};
