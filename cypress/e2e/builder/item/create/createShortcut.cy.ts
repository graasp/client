import {
  HttpMethod,
  ItemType,
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
} from '@graasp/sdk';

import {
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  MY_GRAASP_ITEM_PATH,
  buildItemsGridMoreButtonSelector,
} from '../../../../../src/config/selectors';
import { HOME_PATH, buildItemPath } from '../../utils';

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const IMAGE_ITEM_CHILD = PackedLocalFileItemFactory({ parentItem: FOLDER });
const FOLDER2 = PackedFolderItemFactory();

const createShortcut = ({
  id,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
  cy.get(buildItemsGridMoreButtonSelector(id)).click();
  cy.get(`.${ITEM_MENU_SHORTCUT_BUTTON_CLASS}`).click();
  cy.handleTreeMenu(toItemPath, rootId);
};

const checkCreateShortcutRequest = ({
  id,
  toItemId,
}: {
  id: string;
  toItemId?: string;
}) => {
  cy.wait('@postItemShortcut').then(({ request: { body, url } }) => {
    // check post item request is correct

    expect(body.target).to.eql(id);
    expect(body.type).to.eql(ItemType.SHORTCUT);

    if (toItemId) {
      const search = new URLSearchParams();
      search.set('parentId', toItemId);
      expect(url).to.include(search.toString());
    } else {
      expect(url).to.not.include('parentId');
      cy.wait('@getAccessibleItems');
    }
  });
};

describe('Create Shortcut', () => {
  beforeEach(() => {
    cy.intercept({
      method: HttpMethod.Post,
      url: /\/items\/shortcuts\//,
    }).as('postItemShortcut');
  });

  it('create shortcut from Home to Home', () => {
    cy.setUpApi({ items: [IMAGE_ITEM] });
    cy.visit(HOME_PATH);

    const { id } = IMAGE_ITEM;
    createShortcut({ id, toItemPath: MY_GRAASP_ITEM_PATH });

    checkCreateShortcutRequest({ id });
  });

  it('create shortcut from Home to Item', () => {
    cy.setUpApi({ items: [FOLDER, IMAGE_ITEM] });
    cy.visit(HOME_PATH);

    const { id } = IMAGE_ITEM;
    const { id: toItemId, path: toItemPath } = FOLDER;
    createShortcut({ id, toItemPath });

    checkCreateShortcutRequest({ id, toItemId });
  });

  it('create shortcut from Item to Item', () => {
    cy.setUpApi({ items: [FOLDER, FOLDER2, IMAGE_ITEM_CHILD] });
    cy.visit(buildItemPath(FOLDER.id));

    const { id } = IMAGE_ITEM_CHILD;
    const { id: toItemId, path: toItemPath } = FOLDER2;
    createShortcut({ id, toItemPath });
    checkCreateShortcutRequest({ id, toItemId });
  });
});
