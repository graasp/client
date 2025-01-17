import { FlagType, PackedFolderItemFactory } from '@graasp/sdk';

import {
  ITEM_MENU_FLAG_BUTTON_CLASS,
  buildFlagListItemId,
  buildItemsGridMoreButtonSelector,
} from '../../../../config/selectors';
import { BUILDER } from '../../../../langs';
// import i18n, { BUILDER_NAMESPACE } from '../../../../config/i18n';
import { HOME_PATH } from '../../../../paths';
import { CURRENT_USER } from '../../../fixtures/members';

const openFlagItemModal = (itemId: string) => {
  cy.get(buildItemsGridMoreButtonSelector(itemId)).click();
  cy.get(`.${ITEM_MENU_FLAG_BUTTON_CLASS}`).click();
};

const flagItem = (itemId: string, type: FlagType) => {
  openFlagItemModal(itemId);

  const flagListItem = cy.get(`#${buildFlagListItemId(type)}`);

  flagListItem.click();

  i18n.changeLanguage(CURRENT_USER.extra.lang as string);
  const text = i18n.t(BUILDER.FLAG_ITEM_BUTTON, { ns: BUILDER_NAMESPACE });
  const flagItemButton = cy.get(`button:contains("${text}")`);

  flagItemButton.click();
};

const FOLDER = PackedFolderItemFactory();

describe('Flag Item', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [FOLDER] });
    cy.visit(HOME_PATH);
  });

  it('flag item', () => {
    const item = FOLDER;
    const type = FlagType.FalseInformation;

    flagItem(item.id, type);

    cy.wait('@postItemFlag').then(
      ({
        request: {
          url,
          body: { type: flagType },
        },
      }) => {
        expect(flagType).to.equal(type);
        expect(url).to.contain(item.id);
      },
    );
  });
});
