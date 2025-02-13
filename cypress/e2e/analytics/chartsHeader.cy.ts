import { Context, HttpMethod } from '@graasp/sdk';

import {
  SELECT_ACTION_ID,
  SELECT_USER_ID,
  SELECT_VIEW_ID,
  SELECT_VIEW_RENDERED_TEXT_ID,
  TAB_USERS,
  TOGGLE_FILTERS_DRAWER_BUTTON_ID,
  buildSelectViewId,
  buildSelectedActionChipId,
  buildSelectedUserChipId,
  buildSidebarListItemId,
} from '../../../src/modules/analytics/config/selectors';
import MOCK_ACTION_DATA from '../../fixtures/analytics/actions';
import {
  MOCK_AGGREGATE_ACTIONS_ACTIVE_USERS,
  MOCK_AGGREGATE_ACTIONS_BY_DAY,
  MOCK_AGGREGATE_ACTIONS_BY_TIME,
  MOCK_AGGREGATE_ACTIONS_BY_WEEKDAY,
  MOCK_AGGREGATE_ACTIONS_TOTAL_ACTIONS,
  MOCK_AGGREGATE_ACTIONS_TOTAL_USERS,
  MOCK_AGGREGATE_ACTIONS_TYPE,
} from '../../fixtures/analytics/aggregateActions';
import MOCK_ITEMS from '../../fixtures/analytics/items';
import MOCK_MEMBERS from '../../fixtures/analytics/members';
import { buildItemPath } from './utils';

const visitItemPage = (item: { id: string }) => {
  cy.visit(buildItemPath({ itemId: item.id }));
};

const checkContainViewText = (view: Context) =>
  cy.get(`#${buildSelectViewId(view)}`).should('contain', view);

const setupIntercepts = () => {
  cy.intercept(
    { method: HttpMethod.Get, pathname: /\/items\/(.*?)\/actions$/ },
    MOCK_ACTION_DATA,
  ).as('getItemActions');
  cy.intercept(
    {
      method: HttpMethod.Get,
      pathname: /\/items\/(.*?)\/actions\/aggregation$/,
    },
    (request) => {
      const { countGroupBy, aggregateBy, aggregateMetric, aggregateFunction } =
        request.query;

      if (
        countGroupBy === 'user' &&
        aggregateMetric === 'user' &&
        aggregateFunction === 'count'
      ) {
        return MOCK_AGGREGATE_ACTIONS_TOTAL_USERS;
      }
      if (
        countGroupBy === 'createdDay' &&
        aggregateBy === 'createdDay' &&
        aggregateMetric === 'actionCount' &&
        aggregateFunction === 'count'
      ) {
        return MOCK_AGGREGATE_ACTIONS_ACTIVE_USERS;
      }
      if (
        countGroupBy === 'createdDay' &&
        aggregateBy === 'createdDay' &&
        aggregateMetric === 'actionCount' &&
        aggregateFunction === 'avg'
      ) {
        return MOCK_AGGREGATE_ACTIONS_BY_DAY;
      }
      if (
        countGroupBy === 'createdDay' &&
        aggregateBy === 'createdDay' &&
        aggregateMetric === 'actionCount' &&
        aggregateFunction === 'sum'
      ) {
        return MOCK_AGGREGATE_ACTIONS_TOTAL_ACTIONS;
      }
      if (
        countGroupBy === 'createdTimeOfDay' &&
        aggregateBy === 'createdTimeOfDay' &&
        aggregateMetric === 'actionCount' &&
        aggregateFunction === 'avg'
      ) {
        return MOCK_AGGREGATE_ACTIONS_BY_TIME;
      }
      if (
        countGroupBy === 'createdDayOfWeek' &&
        aggregateBy === 'createdDayOfWeek' &&
        aggregateMetric === 'actionCount' &&
        aggregateFunction === 'avg'
      ) {
        return MOCK_AGGREGATE_ACTIONS_BY_WEEKDAY;
      }
      if (
        countGroupBy === 'actionType' &&
        aggregateBy === 'actionType' &&
        aggregateMetric === 'actionCount' &&
        aggregateFunction === 'sum'
      ) {
        return MOCK_AGGREGATE_ACTIONS_TYPE;
      }
      return [];
    },
  ).as('getAggregateActions');
};

describe('Select platform view ', () => {
  beforeEach(() => {
    cy.setUpApi({});
    setupIntercepts();
  });

  it('select platform view should be library, or player, or builder', () => {
    visitItemPage(MOCK_ITEMS[0]);
    cy.get(`#${SELECT_VIEW_ID}`).click();
    [Context.Library, Context.Builder, Context.Player].forEach((ele) => {
      checkContainViewText(ele);
    });
  });

  it('change selected view', () => {
    visitItemPage(MOCK_ITEMS[0]);
    cy.get(`#${SELECT_VIEW_ID}`).click();
    cy.get(`#${buildSelectViewId(Context.Player)}`).click();
    cy.get(`#${SELECT_VIEW_RENDERED_TEXT_ID}`).should(
      'contain.text',
      Context.Player,
    );
  });

  it('values of view select should be maintained when navigating within different routes', () => {
    visitItemPage(MOCK_ITEMS[0]);
    cy.get(`#${SELECT_VIEW_ID}`).click();
    cy.get(`#${buildSelectViewId(Context.Player)}`).click();
    cy.get(`#${SELECT_VIEW_RENDERED_TEXT_ID}`).should(
      'contain.text',
      Context.Player,
    );
    cy.get(`#${buildSidebarListItemId(TAB_USERS)}`).click();

    cy.get(`#${SELECT_VIEW_ID}`).should('contain.text', Context.Player);
  });
});

describe('Select users', () => {
  beforeEach(() => {
    cy.setUpApi({});
    setupIntercepts();
  });
  it('values of user select should be maintained when navigating within different routes', () => {
    visitItemPage(MOCK_ITEMS[0]);

    // open filter drawers
    cy.get(`#${TOGGLE_FILTERS_DRAWER_BUTTON_ID}`).click();

    cy.get(`#${SELECT_USER_ID}`).click();
    cy.get(`#${SELECT_USER_ID}-option-0`).click();
    cy.get(`#${buildSelectedUserChipId(MOCK_MEMBERS[0].name)}`).should(
      'contain.text',
      MOCK_MEMBERS[0].name,
    );

    // close panel
    cy.get('button').contains('Close').click();
    cy.get(`#${buildSidebarListItemId(TAB_USERS)}`).click();

    cy.get(`#${buildSidebarListItemId(TAB_USERS)}`).click();

    // open filter drawers
    cy.get(`#${TOGGLE_FILTERS_DRAWER_BUTTON_ID}`).click();

    cy.get(`#${buildSelectedUserChipId(MOCK_MEMBERS[0].name)}`).should(
      'contain.text',
      MOCK_MEMBERS[0].name,
    );
  });
});

describe('Select actions', () => {
  beforeEach(() => {
    cy.setUpApi({});
    setupIntercepts();
  });
  it('values of action select should be maintained when navigating within different routes', () => {
    visitItemPage(MOCK_ITEMS[0]);

    // open filter drawers
    cy.get(`#${TOGGLE_FILTERS_DRAWER_BUTTON_ID}`).click();

    cy.get(`#${SELECT_ACTION_ID}`).click();
    cy.get(`#${SELECT_ACTION_ID}-option-0`).click();
    cy.get(
      `#${buildSelectedActionChipId(MOCK_ACTION_DATA.actions[0].type)}`,
    ).should('contain.text', MOCK_ACTION_DATA.actions[0].type);

    // close panel
    cy.get('button').contains('Close').click();
    cy.get(`#${buildSidebarListItemId(TAB_USERS)}`).click();

    // open filter drawers
    cy.get(`#${TOGGLE_FILTERS_DRAWER_BUTTON_ID}`).click();

    cy.get(
      `#${buildSelectedActionChipId(MOCK_ACTION_DATA.actions[0].type)}`,
    ).should('contain.text', MOCK_ACTION_DATA.actions[0].type);
  });
});
