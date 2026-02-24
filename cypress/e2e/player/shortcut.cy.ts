import {
  PackedFolderItemFactory,
  PackedShortcutItemFactory,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import {
  BACK_TO_SHORTCUT_ID,
  MAIN_MENU_ID,
  buildFolderButtonId,
} from '../../../src/config/selectors';
import { buildContentPagePath } from './utils';

describe('Shortcuts', () => {
  it('Come back from external shortcut navigation', () => {
    const parentItem = PackedFolderItemFactory({
      name: 'parent item',
      settings: {},
    });
    const toShortcut = PackedFolderItemFactory({
      name: 'target folder',
      settings: {},
    });
    const shortcut = PackedShortcutItemFactory({
      name: 'shortcut',
      parentItem,
      settings: {},
      extra: { shortcut: { target: toShortcut.id } },
    });
    cy.setUpApi({ items: [parentItem, shortcut, toShortcut] });

    cy.visit(
      buildContentPagePath({ rootId: parentItem.id, itemId: parentItem.id }),
    );

    // show shortcut in navigation
    cy.get(`#${MAIN_MENU_ID}`).should('contain', shortcut.name);

    // click on folder shortcut
    cy.get(`#${buildFolderButtonId(toShortcut.id)}`).click();
    cy.url()
      .should('contain', 'from')
      // context has changed
      .and('contain', `player/${toShortcut.id}/${toShortcut.id}`)
      .and(
        'contain',
        encodeURIComponent(`player/${parentItem.id}/${parentItem.id}`),
      )
      // fromUrl
      .and('contain', parentItem.id)
      .and('contain', 'fromName')
      .and('contain', 'parent+item');

    cy.wait(1000);

    // go back to origin
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).click();
    cy.url().should('contain', parentItem.id);

    // no back button displayed
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).should('not.exist');
  });

  it('Come back from internal shortcut navigation', () => {
    const parentItem = PackedFolderItemFactory({
      name: 'parent item',
      settings: {},
    });
    const toShortcut = PackedFolderItemFactory({
      name: 'target folder',
      settings: {},
      parentItem,
    });
    const shortcut = PackedShortcutItemFactory({
      name: 'shortcut',
      parentItem,
      settings: {},
      extra: { shortcut: { target: toShortcut.id } },
    });
    cy.setUpApi({ items: [parentItem, shortcut, toShortcut] });

    cy.visit(
      buildContentPagePath({ rootId: parentItem.id, itemId: parentItem.id }),
    );

    // don't show shortcut in navigation
    cy.get(`#${MAIN_MENU_ID}`).should('not.contain', shortcut.name);

    // click on folder shortcut
    cy.get(`#${buildFolderButtonId(toShortcut.id)}`).click();
    cy.url()
      .should('contain', 'from')
      // context should be the same
      .and('contain', `player/${parentItem.id}/${toShortcut.id}`)
      // fromUrl
      .and(
        'contain',
        encodeURIComponent(`player/${parentItem.id}/${parentItem.id}`),
      )
      .and('contain', 'fromName')
      .and('contain', 'parent+item');

    cy.wait(1000);

    // go back to origin
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).click();
    cy.url().should('contain', parentItem.id);

    // no back button displayed
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).should('not.exist');
  });

  it('Keep other params from shortcut navigation like shuffle', () => {
    const parentItem = PackedFolderItemFactory({
      name: 'parent item',
      settings: {},
    });
    const toShortcut = PackedFolderItemFactory({
      name: 'target folder',
      settings: {},
    });
    const shortcut = PackedShortcutItemFactory({
      name: 'shortcut',
      parentItem,
      settings: {},
      extra: { shortcut: { target: toShortcut.id } },
    });
    cy.setUpApi({ items: [parentItem, shortcut, toShortcut] });

    cy.visit(
      buildContentPagePath({
        rootId: parentItem.id,
        itemId: parentItem.id,
        searchParams: 'fullscreen=true',
      }),
    );

    // click on folder shortcut
    cy.get(`#${buildFolderButtonId(toShortcut.id)}`).click();
    cy.url()
      .should('contain', 'from')
      .and('contain', parentItem.id)
      .and('contain', 'fromName')
      .and('contain', 'parent+item')
      .and('contain', 'fullscreen=true');

    // go back to origin
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).click();
    cy.url().should('contain', parentItem.id).and('contain', 'fullscreen=true');
  });

  it('No from name does not show button', () => {
    const parentItem = PackedFolderItemFactory({ name: 'parent item' });
    cy.setUpApi({ items: [parentItem] });

    cy.visit(
      `${buildContentPagePath({
        rootId: parentItem.id,
        itemId: parentItem.id,
      })}?from=/${v4()}`,
    );

    // need wait for wrongly shown button to appear
    cy.wait(1000);

    // should not show from button
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).should('not.exist');
  });

  it('Hacking query params is safe', () => {
    const parentItem = PackedFolderItemFactory({ name: 'parent item' });
    cy.setUpApi({ items: [parentItem] });

    cy.visit(
      `${buildContentPagePath({
        rootId: parentItem.id,
        itemId: parentItem.id,
      })}?from=/idid&fromName=shouldnotdisplay`,
    );

    // need wait for wrongly shown button to appear
    cy.wait(1000);

    // should not show from button
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).should('not.exist');
  });

  it('Hacking from url with external url is safe', () => {
    const parentItem = PackedFolderItemFactory({ name: 'parent item' });
    cy.setUpApi({ items: [parentItem] });

    cy.visit(
      `${buildContentPagePath({
        rootId: parentItem.id,
        itemId: parentItem.id,
      })}?from=http://example.org&fromName=shouldnotdisplay`,
    );

    // need wait for wrongly shown button to appear
    cy.wait(1000);

    // should not show from button
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).should('not.exist');
  });
});
