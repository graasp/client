import { PackedFolderItemFactory } from '@graasp/sdk';

import { ITEM_FULLSCREEN_BUTTON_ID } from '../../../src/config/selectors';
import { buildContentPagePath } from './utils';

type FullscreenState = {
  element: Element | null;
};

const visitWithFullscreenApi = (path: string): FullscreenState => {
  const fullscreenState: FullscreenState = { element: null };

  cy.visit(path, {
    onBeforeLoad: (win) => {
      Object.defineProperty(win.document, 'fullscreenElement', {
        configurable: true,
        get: () => fullscreenState.element,
      });
      Object.defineProperty(win.document.documentElement, 'requestFullscreen', {
        configurable: true,
        value: cy.stub().callsFake(() => {
          fullscreenState.element = win.document.documentElement;
          win.document.dispatchEvent(new win.Event('fullscreenchange'));
          return Promise.resolve();
        }),
      });
      Object.defineProperty(win.document, 'exitFullscreen', {
        configurable: true,
        value: cy.stub().callsFake(() => {
          fullscreenState.element = null;
          win.document.dispatchEvent(new win.Event('fullscreenchange'));
          return Promise.resolve();
        }),
      });
    },
  });

  return fullscreenState;
};

const expectSearchParams = (expected: Record<string, string>): void => {
  cy.location('search').should((search) => {
    const searchParams = new URLSearchParams(search);

    Object.entries(expected).forEach(([key, value]) => {
      expect(searchParams.get(key)).to.equal(value);
    });
  });
};

describe('Fullscreen', () => {
  const item = PackedFolderItemFactory({ settings: {} });

  beforeEach(() => {
    cy.setUpApi({ items: [item] });
  });

  it('Toggles fullscreen from the player and preserves search parameters', () => {
    visitWithFullscreenApi(
      buildContentPagePath({
        rootId: item.id,
        itemId: item.id,
        searchParams: 'shuffle=true',
      }),
    );

    cy.get(`#${ITEM_FULLSCREEN_BUTTON_ID}`).should('be.visible').click();

    expectSearchParams({ fullscreen: 'true', shuffle: 'true' });
    cy.window()
      .its('document.documentElement.requestFullscreen')
      .should('have.been.calledOnce');

    cy.get(`#${ITEM_FULLSCREEN_BUTTON_ID}`).click();

    expectSearchParams({ fullscreen: 'false', shuffle: 'true' });
    cy.window().its('document.exitFullscreen').should('have.been.calledOnce');
  });

  it('Returns to the normal player route after an external fullscreen exit', () => {
    const fullscreenState = visitWithFullscreenApi(
      buildContentPagePath({ rootId: item.id, itemId: item.id }),
    );

    cy.get(`#${ITEM_FULLSCREEN_BUTTON_ID}`).click();
    expectSearchParams({ fullscreen: 'true' });

    cy.window().then((win) => {
      fullscreenState.element = null;
      win.document.dispatchEvent(new win.Event('fullscreenchange'));
    });

    expectSearchParams({ fullscreen: 'false' });
  });

  it('Uses resize as a fallback when fullscreen exits externally', () => {
    const fullscreenState = visitWithFullscreenApi(
      buildContentPagePath({ rootId: item.id, itemId: item.id }),
    );

    cy.get(`#${ITEM_FULLSCREEN_BUTTON_ID}`).click();
    expectSearchParams({ fullscreen: 'true' });

    cy.window().then((win) => {
      fullscreenState.element = null;
      win.dispatchEvent(new win.Event('resize'));
    });

    expectSearchParams({ fullscreen: 'false' });
  });

  it('Corrects a fullscreen route when the browser is not fullscreen', () => {
    cy.visit(
      buildContentPagePath({
        rootId: item.id,
        itemId: item.id,
        searchParams: 'fullscreen=true',
      }),
    );

    expectSearchParams({ fullscreen: 'false' });
  });

  it('Hides the fullscreen button on mobile', () => {
    cy.viewport('iphone-x');
    cy.visit(buildContentPagePath({ rootId: item.id, itemId: item.id }));

    cy.get(`#${ITEM_FULLSCREEN_BUTTON_ID}`).should('not.exist');
  });
});
