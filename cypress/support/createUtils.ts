import type { AppItem, DocumentItem, PackedItem } from '@/openapi/client';

import {
  ADD_FOLDER_BUTTON_CY,
  CREATE_ITEM_APP_ID,
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_CLOSE_BUTTON_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_H5P_ID,
  CREATE_ITEM_ZIP_ID,
  DASHBOARD_UPLOADER_ID,
  H5P_DASHBOARD_UPLOADER_ID,
  ZIP_DASHBOARD_UPLOADER_ID,
  buildDataCyWrapper,
} from '../../src/config/selectors';
import { InternalItemType } from '../../src/modules/builder/types';
import { ZIPInternalItem } from '../e2e/builder/fixtures/files';
import { FileItemForTest } from './types';

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

export const createFile = (
  payload: FileItemForTest,
  options?: { confirm?: boolean },
): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  const { confirm = true } = options ?? {};
  cy.get(`#${CREATE_ITEM_FILE_ID}`).click();

  // drag-drop a file in the uploader
  cy.attachFile(
    cy.get(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
    payload?.createFilepath,
    {
      action: 'drag-drop',
      force: true,
    },
  );
  if (confirm) {
    cy.get(`#${CREATE_ITEM_CLOSE_BUTTON_ID}`).click();
  }
};

// todo: question: only used by import zip ??
export const createItem = (
  payload: PackedItem | ZIPInternalItem | { type: 'h5p'; filepath: string },
  options?: { confirm?: boolean },
): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();

  switch (payload.type) {
    case 'file': {
      const { confirm = true } = options;
      cy.get(`#${CREATE_ITEM_FILE_ID}`).click();

      // drag-drop a file in the uploader
      cy.attachFile(
        cy.get(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        payload?.createFilepath,
        {
          action: 'drag-drop',
          force: true,
        },
      );
      if (confirm) {
        cy.get(`#${CREATE_ITEM_CLOSE_BUTTON_ID}`).click();
      }
      break;
    }
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
    case 'document':
      cy.get(`#${CREATE_ITEM_DOCUMENT_ID}`).click();
      cy.fillDocumentModal(payload, options);
      break;
    case 'app':
      cy.get(`#${CREATE_ITEM_APP_ID}`).click();
      cy.fillAppModal(payload, options);
      break;
    case 'folder':
    default:
      cy.fillFolderModal(payload, options);
      break;
  }
};
