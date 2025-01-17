import { PackedFolderItemFactory } from '@graasp/sdk';

import { getParentsIdsFromPath } from '../../../../../src/modules/builder/utils/item';
import duplicateItem from '../../../../support/actionsUtils';
import { HOME_PATH, buildItemPath } from '../../utils';

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
    const parentsIds = getParentsIdsFromPath(path);

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
