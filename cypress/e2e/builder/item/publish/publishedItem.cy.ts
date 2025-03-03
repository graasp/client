import {
  ItemType,
  ItemTypeUnion,
  ItemValidationGroup,
  ItemValidationStatus,
  ItemVisibilityType,
  PackedFolderItemFactory,
  PackedItem,
  PermissionLevel,
  PublicationStatus,
  PublishableItemTypeChecker,
} from '@graasp/sdk';

import {
  EMAIL_NOTIFICATION_CHECKBOX,
  PUBLIC_VISIBILITY_MODAL_VALIDATE_BUTTON,
  buildDataCyWrapper,
  buildItemPublicationButton,
  buildPublicationStatus,
  buildPublishButtonId,
} from '../../../../../src/config/selectors';
import { MEMBERS } from '../../../../fixtures/members';
import { ItemForTest, MemberForTest } from '../../../../support/types';
import {
  ItemValidationGroupFactory,
  PublishedItemFactory,
} from '../../fixtures/items';
import { createPublicItemByType } from '../../fixtures/publish/publish';
import { buildItemPath } from '../../utils';

const openPublishItemTab = (id: string) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const setUpAndVisitItemPage = (
  item: PackedItem | ItemForTest,
  {
    itemPublicationStatus,
    itemValidationGroups,
    currentMember,
  }: {
    itemPublicationStatus?: PublicationStatus;
    itemValidationGroups?: ItemValidationGroup[];
    currentMember?: MemberForTest;
  } = {},
) => {
  cy.setUpApi({
    items: [item],
    itemValidationGroups,
    currentMember,
    itemPublicationStatus:
      itemPublicationStatus ?? PublicationStatus.Unpublished,
  });
  cy.visit(buildItemPath(item.id));
};

const getPublicationButton = (status: PublicationStatus) =>
  cy.get(buildDataCyWrapper(buildItemPublicationButton(status)));

const getPublicationStatusComponent = (status: PublicationStatus) =>
  cy.get(buildDataCyWrapper(buildPublicationStatus(status)));

const confirmSetItemToPublic = () =>
  cy.get(buildDataCyWrapper(PUBLIC_VISIBILITY_MODAL_VALIDATE_BUTTON)).click();

const waitOnRequest = (request: string, item: PackedItem) => {
  cy.wait(request).then((data) => {
    const {
      request: { url },
    } = data;
    expect(url.includes(item.id));
  });
};

const waitOnItemValidation = (item: PackedItem) => {
  waitOnRequest('@postItemValidation', item);
};

const waitOnPublishItem = (
  item: PackedItem,
  { shouldNotify }: { shouldNotify: boolean } = { shouldNotify: false },
) => {
  cy.wait('@publishItem').then((data) => {
    const {
      request: { url, query },
    } = data;
    expect(url.includes(item.id));
    if (shouldNotify) {
      expect(`${query.notification}`).equals(`${shouldNotify}`);
    } else {
      expect(query.notification).equals(undefined);
    }
  });
};

const waitOnSetItemPublic = (item: PackedItem) => {
  waitOnRequest(`@postItemVisibility-${ItemVisibilityType.Public}`, item);
};

const waitOnUnpublishItem = (item: PackedItem) => {
  waitOnRequest('@unpublishItem', item);
};

describe('Unauthorized members should not have access to publish tab', () => {
  let item: PackedItem;

  afterEach(() => {
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });

  it('Unlogged members should not view publish tab', () => {
    item = PackedFolderItemFactory(
      {},
      { permission: null, publicVisibility: {} },
    );
    setUpAndVisitItemPage(item, { currentMember: null });
  });

  it('Readers should not view publish tab', () => {
    item = PackedFolderItemFactory({}, { permission: PermissionLevel.Read });
    setUpAndVisitItemPage(item, { currentMember: MEMBERS.BOB });
  });

  it('Writers should not view publish tab', () => {
    item = PackedFolderItemFactory({}, { permission: PermissionLevel.Write });
    setUpAndVisitItemPage(item, { currentMember: MEMBERS.BOB });
  });
});

describe('Private Item', () => {
  const privateItem = PackedFolderItemFactory({}, { publicVisibility: null });

  describe('Unpublished Item', () => {
    const status = PublicationStatus.Unpublished;

    beforeEach(() => {
      setUpAndVisitItemPage(privateItem, { itemPublicationStatus: status });
      openPublishItemTab(privateItem.id);
    });

    it('Publication status should be Unpublished', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Item can be validated', () => {
      getPublicationButton(status).click(); // Click on validate
      // confirming the modal will not send to the backend until the validation is done
      confirmSetItemToPublic();
      waitOnItemValidation(privateItem);
    });
  });

  describe('Ready to Publish Item', () => {
    const status = PublicationStatus.ReadyToPublish;
    const itemValidationGroup = ItemValidationGroupFactory(privateItem);

    beforeEach(() => {
      setUpAndVisitItemPage(privateItem, {
        itemPublicationStatus: status,
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(privateItem.id);
    });

    it('Publication status should be Ready to publish', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Publishing private item should warn user before changing visibility', () => {
      getPublicationButton(status).click(); // click on publish
      confirmSetItemToPublic();
      waitOnSetItemPublic(privateItem);
      waitOnPublishItem(privateItem);
    });
  });

  describe('Item is not valid', () => {
    const status = PublicationStatus.Invalid;
    const itemValidationGroup = ItemValidationGroupFactory(privateItem, {
      status: ItemValidationStatus.Failure,
    });

    beforeEach(() => {
      setUpAndVisitItemPage(privateItem, {
        itemPublicationStatus: status,
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(privateItem.id);
    });

    it('Publication status should be Invalid', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Item can be validated again', () => {
      getPublicationButton(status).click(); // click on retry
      // confirming the modal will not send to the backend until the validation is done
      confirmSetItemToPublic();
      waitOnItemValidation(privateItem);
    });
  });
});

describe('Public Item', () => {
  const publicItem = PackedFolderItemFactory({}, { publicVisibility: {} });

  describe('Unpublished Item', () => {
    const status = PublicationStatus.Unpublished;

    beforeEach(() => {
      setUpAndVisitItemPage(publicItem, { itemPublicationStatus: status });
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Unpublished', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Item can be validated', () => {
      getPublicationButton(status).click(); // Click on validate
      waitOnItemValidation(publicItem);
    });
  });

  describe('Validation is Pending', () => {
    const status = PublicationStatus.Pending;
    const itemValidationGroup = ItemValidationGroupFactory(publicItem, {
      status: ItemValidationStatus.Pending,
    });

    beforeEach(() => {
      setUpAndVisitItemPage(PublishedItemFactory(publicItem), {
        itemPublicationStatus: status,
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Pending', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('No actions are available during this state', () => {
      Object.values(PublicationStatus).forEach((state) => {
        getPublicationButton(state).should('not.exist');
      });
    });
  });

  describe('Ready to Publish Item', () => {
    const status = PublicationStatus.ReadyToPublish;
    const itemValidationGroup = ItemValidationGroupFactory(publicItem);

    beforeEach(() => {
      setUpAndVisitItemPage(publicItem, {
        itemPublicationStatus: status,
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Ready to publish', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Publish the item without notification', () => {
      getPublicationButton(status).click(); // click on publish
      waitOnPublishItem(publicItem);
    });

    it('Publish the item with notification', () => {
      cy.get(buildDataCyWrapper(EMAIL_NOTIFICATION_CHECKBOX)).click();
      getPublicationButton(status).click(); // click on publish
      waitOnPublishItem(publicItem, { shouldNotify: true });
    });
  });

  describe('Published Item', () => {
    const status = PublicationStatus.Published;
    const itemValidationGroup = ItemValidationGroupFactory(publicItem);

    beforeEach(() => {
      setUpAndVisitItemPage(PublishedItemFactory(publicItem), {
        itemPublicationStatus: status,
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Published', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Unpublish the item', () => {
      getPublicationButton(status).click(); // click on unpublish
      waitOnUnpublishItem(publicItem);
    });
  });

  describe('Only authorized types can be published', () => {
    const testItemType = (
      testTitle: string,
      item: ItemForTest,
      statusExpected: PublicationStatus,
    ) => {
      it(testTitle, () => {
        setUpAndVisitItemPage(item, { itemPublicationStatus: statusExpected });
        openPublishItemTab(item.id);
        getPublicationStatusComponent(statusExpected)
          .should('exist')
          .should('be.visible');
      });
    };

    const testAuthorizedType = (item: ItemForTest) => {
      testItemType(
        `Publication should be allowed for type "${item.type}"`,
        item,
        PublicationStatus.Unpublished,
      );
    };

    const testUnauthorizedType = (item: ItemForTest) => {
      testItemType(
        `Publication should NOT be allowed for type "${item.type}"`,
        item,
        PublicationStatus.ItemTypeNotAllowed,
      );
    };

    Object.values(ItemType).forEach((itemType: ItemTypeUnion) => {
      const item = createPublicItemByType(itemType);
      if (PublishableItemTypeChecker.isItemTypeAllowedToBePublished(itemType)) {
        testAuthorizedType(item);
      } else {
        testUnauthorizedType(item);
      }
    });
  });
});
