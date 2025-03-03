import { PackedFolderItemFactory, getIdsFromPath } from '@graasp/sdk';

import {
  ITEM_MENU_DUPLICATE_BUTTON_CLASS,
  buildItemsGridMoreButtonSelector,
} from '../../../../../src/config/selectors';
import { HOME_PATH, buildItemPath } from '../../utils';

const duplicateItem = ({ id }: { id: string }): void => {
  cy.get(buildItemsGridMoreButtonSelector(id)).click();
  cy.get(`.${ITEM_MENU_DUPLICATE_BUTTON_CLASS}`).click();
};

describe('duplicate Item in Home', () => {
  it(`duplicate item on Home`, () => {
    const FOLDER = PackedFolderItemFactory();
    cy.setUpApi({ items: [FOLDER] });
    cy.visit(HOME_PATH);

    // duplicate
    const { id: duplicateItemId } = FOLDER;
    duplicateItem({ id: duplicateItemId });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      expect(url).to.contain(duplicateItemId);
      // as we duplicate on home parentId will be undefined
      expect(body.parentId).to.equal(undefined);
    });
  });
});
describe('duplicate Item in item', () => {
  it(`duplicate item in item`, () => {
    const FOLDER = PackedFolderItemFactory();
    const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
    cy.setUpApi({ items: [FOLDER, CHILD] });
    const { id, path } = FOLDER;
    const parentsIds = getIdsFromPath(path);

    // go to children item
    cy.visit(buildItemPath(id));

    // duplicate
    const { id: duplicateItemId } = CHILD;
    duplicateItem({ id: duplicateItemId });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      expect(url).to.contain(duplicateItemId);
      expect(body.parentId).to.equal(parentsIds[0]);
    });
  });
});
