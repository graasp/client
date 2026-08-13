import { PackedDocumentItemFactory } from '@graasp/sdk';

import {
  FOLDER_NAME_TITLE_CLASS,
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_PINNED_BUTTON_ID,
  MAIN_MENU_ID,
  PDF_LEARNING_CONTENT_ID,
  PDF_LEARNING_GOALS_ID,
  PDF_LEARNING_INSTRUCTIONS_ID,
  PDF_LEARNING_NOTES_ID,
  PDF_LEARNING_PANEL_CLOSE_ID,
  PDF_LEARNING_PANEL_ID,
  PDF_LEARNING_PANEL_RESIZER_ID,
  PDF_LEARNING_PANEL_TOGGLE_ID,
  PDF_LEARNING_PROGRESS_ID,
  PDF_LEARNING_WORKSPACE_ID,
} from '../../../src/config/selectors';
import { GRAASP_APP_ITEM } from '../../fixtures/apps';
import {
  IMAGE_ITEM_DEFAULT,
  PDF_ITEM_DEFAULT,
  VIDEO_ITEM_DEFAULT,
} from '../../fixtures/files';
import {
  FOLDER_WITHOUT_CHILDREN_ORDER,
  FOLDER_WITH_SUBFOLDER_ITEM,
} from '../../fixtures/items';
import {
  GRAASP_LINK_ITEM,
  GRAASP_LINK_ITEM_IFRAME_ONLY,
  YOUTUBE_LINK_ITEM,
} from '../../fixtures/links';
import { MEMBERS } from '../../fixtures/members';
import {
  PUBLIC_STATIC_ELECTRICITY,
  STATIC_ELECTRICITY,
} from '../../fixtures/useCases/staticElectricity';
import {
  buildContentPagePath,
  expectAppViewScreenLayout,
  expectDocumentViewScreenLayout,
  expectFileViewScreenLayout,
  expectFolderButtonLayout,
  expectFolderLayout,
  expectLinkViewScreenLayout,
} from './utils';

const GRAASP_DOCUMENT_ITEM = PackedDocumentItemFactory();
const PDF_ITEM_WITH_CHAT = {
  ...PDF_ITEM_DEFAULT,
  id: 'cd5519a2-5ba9-4305-b221-185facbe6b00',
  path: 'cd5519a2_5ba9_4305_b221_185facbe6b00',
  settings: {
    ...PDF_ITEM_DEFAULT.settings,
    showChatbox: true,
  },
};
const PDF_ITEM_WITH_PINNED = {
  ...PDF_ITEM_DEFAULT,
  id: 'cd5519a2-5ba9-4305-b221-185facbe6b01',
  path: 'cd5519a2_5ba9_4305_b221_185facbe6b01',
};
const PINNED_PDF_CHILD = {
  ...IMAGE_ITEM_DEFAULT,
  id: 'ad5519a2-5ba9-4305-b221-185facbe6b01',
  path: `${PDF_ITEM_WITH_PINNED.path}.ad5519a2_5ba9_4305_b221_185facbe6b01`,
  settings: { ...IMAGE_ITEM_DEFAULT.settings, isPinned: true },
};
const items = [
  { ...GRAASP_LINK_ITEM, permission: 'admin' as const, creator: null },
  {
    ...GRAASP_LINK_ITEM_IFRAME_ONLY,
    permission: 'admin' as const,
  },
  { ...YOUTUBE_LINK_ITEM, permission: 'admin' as const, creator: null },
  { ...IMAGE_ITEM_DEFAULT, permission: 'admin' as const, creator: null },
  { ...VIDEO_ITEM_DEFAULT, permission: 'admin' as const, creator: null },
  { ...PDF_ITEM_DEFAULT, permission: 'admin' as const, creator: null },
  { ...PDF_ITEM_WITH_CHAT, permission: 'admin' as const, creator: null },
  { ...PDF_ITEM_WITH_PINNED, permission: 'admin' as const, creator: null },
  { ...PINNED_PDF_CHILD, permission: 'admin' as const, creator: null },
  { ...GRAASP_DOCUMENT_ITEM, permission: 'admin' as const, creator: null },
  { ...GRAASP_APP_ITEM, permission: 'admin' as const, creator: null },
  ...FOLDER_WITH_SUBFOLDER_ITEM.items,
  ...FOLDER_WITHOUT_CHILDREN_ORDER.items,
];

describe('Main Screen', () => {
  describe('Individual Items', () => {
    beforeEach(() => {
      cy.clearLocalStorage(/^pdf-learning-workspace:/);
      cy.setUpApi({
        items,
      });
    });

    describe('Links', () => {
      it('Website link', () => {
        const { id } = GRAASP_LINK_ITEM;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        expectLinkViewScreenLayout(GRAASP_LINK_ITEM);
      });
      it('Website link as iframe', () => {
        const { id } = GRAASP_LINK_ITEM_IFRAME_ONLY;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        expectLinkViewScreenLayout(GRAASP_LINK_ITEM_IFRAME_ONLY);
      });
      it('Youtube link', () => {
        const { id } = YOUTUBE_LINK_ITEM;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        expectLinkViewScreenLayout(YOUTUBE_LINK_ITEM);
      });
    });

    describe('Files', () => {
      it('Image', () => {
        const { id } = IMAGE_ITEM_DEFAULT;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        expectFileViewScreenLayout(IMAGE_ITEM_DEFAULT);
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('not.exist');
      });
      it('Video', () => {
        const { id } = VIDEO_ITEM_DEFAULT;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        expectFileViewScreenLayout(VIDEO_ITEM_DEFAULT);
      });
      it('Pdf', () => {
        const { id } = PDF_ITEM_DEFAULT;
        let openPdfWidth = 0;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        expectFileViewScreenLayout(PDF_ITEM_DEFAULT);
        cy.get(`#${PDF_LEARNING_PANEL_ID}`)
          .should('be.visible')
          .and('contain.text', 'Instructions')
          .and('contain.text', 'My notes')
          .and('contain.text', 'Learning goals')
          .and(
            'contain.text',
            'No learning goals have been provided for this PDF',
          );
        cy.get(`#${PDF_LEARNING_PROGRESS_ID}`).should('not.exist');
        cy.contains(PDF_ITEM_DEFAULT.description).should('have.length', 1);
        cy.get(`#${PDF_LEARNING_INSTRUCTIONS_ID}`)
          .should('contain.text', 'No instructions provided.')
          .and('not.contain.text', PDF_ITEM_DEFAULT.description);
        cy.get(`#${PDF_LEARNING_CONTENT_ID}`).then(($content) => {
          const contentRect = $content[0].getBoundingClientRect();
          openPdfWidth = contentRect.width;
          cy.get(`#${PDF_LEARNING_PANEL_ID}`).should(($panel) => {
            const panelRect = $panel[0].getBoundingClientRect();
            expect(panelRect.left).to.be.greaterThan(contentRect.right);
          });
        });

        cy.get(`#${PDF_LEARNING_PANEL_CLOSE_ID}`).click();
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('not.exist');
        cy.get(`#${PDF_LEARNING_CONTENT_ID}`).should(($content) => {
          expect($content[0].getBoundingClientRect().width).to.be.greaterThan(
            openPdfWidth,
          );
        });
        expectFileViewScreenLayout(PDF_ITEM_DEFAULT);

        cy.get(`#${PDF_LEARNING_PANEL_TOGGLE_ID}`).click();
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('be.visible');
      });

      it('Keeps the PDF full width and opens a temporary drawer on small screens', () => {
        const { id } = PDF_ITEM_DEFAULT;
        cy.viewport('iphone-x');
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        expectFileViewScreenLayout(PDF_ITEM_DEFAULT);
        cy.get(`#${PDF_LEARNING_WORKSPACE_ID}`).should('be.visible');
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('not.be.visible');
        cy.get(`#${PDF_LEARNING_PANEL_TOGGLE_ID}`).click();
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('be.visible');
        cy.get('.MuiDrawer-paper').should('have.css', 'width', '375px');
      });

      it('Uses a drawer when the desktop player area is too narrow for a useful split', () => {
        const { id } = PDF_ITEM_DEFAULT;
        cy.viewport(1100, 720);
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('not.be.visible');
        cy.get(`#${PDF_LEARNING_WORKSPACE_ID}`).then(($workspace) => {
          cy.get(`#${PDF_LEARNING_CONTENT_ID}`).should(($content) => {
            expect($content[0].getBoundingClientRect().width).to.equal(
              $workspace[0].getBoundingClientRect().width,
            );
          });
        });
        cy.get(`#${PDF_LEARNING_PANEL_TOGGLE_ID}`).click();
        cy.get('.MuiDrawer-paper').should('be.visible');
      });

      it('Temporarily hides the learning panel while chat is open', () => {
        const { id } = PDF_ITEM_WITH_CHAT;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('be.visible');
        cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).should('be.visible').click();
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('not.exist');

        cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).click();
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('be.visible');
      });

      it('Temporarily hides the learning panel while pinned content is open', () => {
        const { id } = PDF_ITEM_WITH_PINNED;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('be.visible');
        cy.get(`#${ITEM_PINNED_BUTTON_ID}`).should('be.visible').click();
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('not.exist');

        cy.get(`#${ITEM_PINNED_BUTTON_ID}`).click();
        cy.get(`#${PDF_LEARNING_PANEL_ID}`).should('be.visible');
      });

      it('Shows an empty instructions state without hiding the PDF description', () => {
        const pdfWithoutInstructions = {
          ...PDF_ITEM_DEFAULT,
          id: 'cd5519a2-5ba9-4305-b221-185facbe6b02',
          path: 'cd5519a2_5ba9_4305_b221_185facbe6b02',
        };
        cy.setUpApi({
          items: [
            ...items,
            {
              ...pdfWithoutInstructions,
              permission: 'admin' as const,
              creator: null,
            },
          ],
        });
        cy.visit(
          buildContentPagePath({
            rootId: pdfWithoutInstructions.id,
            itemId: pdfWithoutInstructions.id,
          }),
        );

        cy.contains(PDF_ITEM_DEFAULT.description).should('have.length', 1);
        cy.get(`#${PDF_LEARNING_INSTRUCTIONS_ID}`)
          .should('contain.text', 'No instructions provided')
          .and('not.contain.text', PDF_ITEM_DEFAULT.description);
      });

      it('Supports pointer and keyboard resizing and restores the saved width', () => {
        const { id } = PDF_ITEM_DEFAULT;
        let savedWidth: string | undefined;
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.get(`#${PDF_LEARNING_PANEL_RESIZER_ID}`)
          .should('have.attr', 'role', 'separator')
          .and('have.attr', 'aria-valuenow', '320')
          .focus()
          .type('{leftArrow}')
          .should('have.attr', 'aria-valuenow', '336');

        cy.get(`#${PDF_LEARNING_PANEL_RESIZER_ID}`).then(($separator) => {
          const { x, y } = $separator[0].getBoundingClientRect();
          cy.wrap($separator)
            .trigger('pointerdown', { pointerId: 1, clientX: x, clientY: y })
            .trigger('pointermove', {
              pointerId: 1,
              clientX: x - 24,
              clientY: y,
            });
          cy.get('body').trigger('pointerup', {
            pointerId: 1,
            clientX: x - 24,
            clientY: y,
          });
        });
        cy.get(`#${PDF_LEARNING_PANEL_RESIZER_ID}`).should(($separator) => {
          const maximum = Number($separator.attr('aria-valuemax'));
          expect(Number($separator.attr('aria-valuenow'))).to.equal(
            Math.min(360, maximum),
          );
        });

        cy.get(`#${PDF_LEARNING_PANEL_RESIZER_ID}`).then(($separator) => {
          const { x, y } = $separator[0].getBoundingClientRect();
          cy.wrap($separator)
            .trigger('pointerdown', { pointerId: 2, clientX: x, clientY: y })
            .trigger('pointermove', {
              pointerId: 2,
              clientX: x - 1000,
              clientY: y,
            });
          cy.get('body').trigger('pointerup', {
            pointerId: 2,
            clientX: x - 1000,
            clientY: y,
          });
        });
        cy.get(`#${PDF_LEARNING_PANEL_RESIZER_ID}`)
          .should(($separator) => {
            expect($separator.attr('aria-valuenow')).to.equal(
              $separator.attr('aria-valuemax'),
            );
          })
          .focus()
          .type('{rightArrow}')
          .invoke('attr', 'aria-valuenow')
          .then((value) => {
            savedWidth = value;
          });

        cy.reload();
        cy.get(`#${PDF_LEARNING_PANEL_RESIZER_ID}`).should(($separator) => {
          expect($separator.attr('aria-valuenow')).to.equal(savedWidth);
        });
      });

      it('Saves notes and derives progress from self-reported learning goals', () => {
        const { id } = PDF_ITEM_DEFAULT;
        const firstGoalId = '498a9ed6-f1cb-41d8-84dc-f1bb20d5af7d';
        const secondGoalId = 'd8befdd4-d99f-4ab0-a16b-54a363742980';
        const now = new Date().toISOString();
        cy.setUpApi({
          items,
          learningGoals: {
            [id]: [
              {
                id: firstGoalId,
                itemId: id,
                text: 'Identify the main argument',
                position: 0,
                createdAt: now,
                updatedAt: now,
              },
              {
                id: secondGoalId,
                itemId: id,
                text: 'Explain the conclusion',
                position: 1,
                createdAt: now,
                updatedAt: now,
              },
            ],
          },
        });
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));
        cy.wait('@getLearningWorkspace');

        cy.get(`#${PDF_LEARNING_NOTES_ID}`).type('A private note').blur();
        cy.wait('@updateLearningWorkspace')
          .its('request.body')
          .should('deep.equal', { notes: 'A private note' });
        cy.contains('Saved').should('be.visible');

        cy.get(`#${PDF_LEARNING_PROGRESS_ID}`).should(
          'contain.text',
          '0 of 2 learning goals completed',
        );
        cy.get(
          'input[type="checkbox"][aria-label="Identify the main argument"]',
        ).check();
        cy.wait('@completeLearningGoal');
        cy.get(`#${PDF_LEARNING_PROGRESS_ID}`)
          .should('contain.text', '1 of 2 learning goals completed')
          .find('[role="progressbar"]')
          .should('have.attr', 'aria-valuenow', '50');
        cy.get(
          'input[type="checkbox"][aria-label="Explain the conclusion"]',
        ).check();
        cy.wait('@completeLearningGoal');
        cy.get(`#${PDF_LEARNING_PROGRESS_ID}`)
          .should('contain.text', '2 of 2 learning goals completed')
          .find('[role="progressbar"]')
          .should('have.attr', 'aria-valuenow', '100');
        cy.get(`#${PDF_LEARNING_GOALS_ID}`).should(
          'not.contain.text',
          'Add a task',
        );
      });

      it('Retains a failed note draft and retries it', () => {
        const { id } = PDF_ITEM_DEFAULT;
        cy.intercept(
          {
            method: 'PATCH',
            pathname: `/api/items/${id}/learning-workspace`,
            times: 1,
          },
          { statusCode: 500 },
        ).as('failedWorkspaceUpdate');
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.get(`#${PDF_LEARNING_NOTES_ID}`).type('Keep this draft').blur();
        cy.wait('@failedWorkspaceUpdate');
        cy.contains('Save failed').should('be.visible');
        cy.get(`#${PDF_LEARNING_NOTES_ID}`).should(
          'have.value',
          'Keep this draft',
        );
        cy.contains('button', 'Retry').click();
        cy.wait('@updateLearningWorkspace');
        cy.contains('Saved').should('be.visible');
      });

      it('Rolls back a failed goal toggle and retries it', () => {
        const { id } = PDF_ITEM_DEFAULT;
        const goalId = 'a98901f9-e50e-44a6-a982-c06460c07bea';
        const now = new Date().toISOString();
        cy.setUpApi({
          items,
          learningGoals: {
            [id]: [
              {
                id: goalId,
                itemId: id,
                text: 'Summarize the PDF',
                position: 0,
                createdAt: now,
                updatedAt: now,
              },
            ],
          },
        });
        cy.intercept(
          {
            method: 'PUT',
            pathname: `/api/items/${id}/learning-goals/${goalId}/completion`,
            times: 1,
          },
          { statusCode: 500 },
        ).as('failedGoalCompletion');
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.get(
          'input[type="checkbox"][aria-label="Summarize the PDF"]',
        ).check();
        cy.wait('@failedGoalCompletion');
        cy.get('input[type="checkbox"][aria-label="Summarize the PDF"]').should(
          'not.be.checked',
        );
        cy.get(`#${PDF_LEARNING_PROGRESS_ID}`).should(
          'contain.text',
          '0 of 1 learning goals completed',
        );
        cy.get(`#${PDF_LEARNING_GOALS_ID}`).contains('button', 'Retry').click();
        cy.wait('@completeLearningGoal');
        cy.get(`#${PDF_LEARNING_PROGRESS_ID}`).should(
          'contain.text',
          '1 of 1 learning goals completed',
        );
      });

      it('Keeps instructions available when personal data fails to load', () => {
        const { id } = PDF_ITEM_DEFAULT;
        const now = new Date().toISOString();
        const instructions = '<p>Read pages one and two.</p>';
        cy.setUpApi({
          items,
          learningWorkspaceSettings: {
            [id]: {
              itemId: id,
              instructions,
              createdAt: now,
              updatedAt: now,
            },
          },
        });
        cy.intercept(
          {
            method: 'GET',
            pathname: `/api/items/${id}/learning-workspace`,
            times: 1,
          },
          { statusCode: 500 },
        ).as('failedWorkspaceLoad');
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.wait('@failedWorkspaceLoad');
        cy.get(`#${PDF_LEARNING_PANEL_ID}`)
          .should('contain.text', 'Instructions')
          .and('contain.text', 'Read pages one and two.')
          .and('contain.text', 'Your workspace could not be loaded');
        cy.contains(PDF_ITEM_DEFAULT.description).should('have.length', 1);
        cy.contains('button', 'Retry').click();
        cy.wait('@getLearningWorkspace');
        cy.get(`#${PDF_LEARNING_NOTES_ID}`).should('be.visible');
      });

      it('Shows instructions and a sign-in prompt to signed-out users', () => {
        const { id } = PDF_ITEM_DEFAULT;
        const now = new Date().toISOString();
        const instructions = '<p>Compare the two arguments.</p>';
        cy.setUpApi({
          items,
          currentMember: null,
          learningWorkspaceSettings: {
            [id]: {
              itemId: id,
              instructions,
              createdAt: now,
              updatedAt: now,
            },
          },
          learningGoals: {
            [id]: [
              {
                id: '81bc88d9-2b17-4286-b0cc-f0048ae2b619',
                itemId: id,
                text: 'Read the introduction',
                position: 0,
                createdAt: now,
                updatedAt: now,
              },
            ],
          },
        });
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.get(`#${PDF_LEARNING_PANEL_ID}`)
          .should('contain.text', 'Compare the two arguments.')
          .and('contain.text', 'Sign in to save private notes')
          .and('contain.text', 'Read the introduction')
          .and('contain.text', 'Sign in to track your progress');
        cy.get(`#${PDF_LEARNING_NOTES_ID}`).should('not.exist');
        cy.get(`#${PDF_LEARNING_PROGRESS_ID}`).should('not.exist');
        cy.contains('a', 'Sign In')
          .should('have.attr', 'href')
          .and('include', '/auth/login')
          .and('include', 'url=');
      });

      it('Keeps the rest of the workspace available when instructions fail to load', () => {
        const { id } = PDF_ITEM_DEFAULT;
        cy.intercept(
          {
            method: 'GET',
            pathname: `/api/items/${id}/learning-workspace-settings`,
            times: 1,
          },
          { statusCode: 500 },
        ).as('failedInstructionsLoad');
        cy.visit(buildContentPagePath({ rootId: id, itemId: id }));

        cy.wait('@failedInstructionsLoad');
        cy.get(`#${PDF_LEARNING_INSTRUCTIONS_ID}`).should(
          'contain.text',
          'Instructions could not be loaded.',
        );
        cy.get(`#${PDF_LEARNING_NOTES_ID}`).should('be.visible');
        cy.get(`#${PDF_LEARNING_GOALS_ID}`).should('be.visible');
        cy.get(`#${PDF_LEARNING_INSTRUCTIONS_ID}`)
          .contains('button', 'Retry')
          .click();
        cy.wait('@getLearningWorkspaceSettings');
        cy.get(`#${PDF_LEARNING_INSTRUCTIONS_ID}`).should(
          'contain.text',
          'No instructions provided.',
        );
      });
    });

    describe('Documents', () => {
      it('Graasp Document', () => {
        cy.visit(
          buildContentPagePath({
            rootId: GRAASP_DOCUMENT_ITEM.id,
            itemId: GRAASP_DOCUMENT_ITEM.id,
          }),
        );

        expectDocumentViewScreenLayout(GRAASP_DOCUMENT_ITEM);
      });
    });

    describe('Apps', () => {
      it('App', () => {
        cy.visit(
          buildContentPagePath({
            rootId: GRAASP_APP_ITEM.id,
            itemId: GRAASP_APP_ITEM.id,
          }),
        );

        expectAppViewScreenLayout(GRAASP_APP_ITEM);
      });
    });

    describe('Folders', () => {
      it('Display sub Folder', () => {
        const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[0];
        cy.visit(
          buildContentPagePath({ rootId: parent.id, itemId: parent.id }),
        );

        cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', parent.name);

        expectFolderButtonLayout(FOLDER_WITH_SUBFOLDER_ITEM.items[1]);
      });
      it('Display Folder without childrenOrder', () => {
        const parent = FOLDER_WITHOUT_CHILDREN_ORDER.items[0];
        cy.visit(
          buildContentPagePath({ rootId: parent.id, itemId: parent.id }),
        );

        cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', parent.name);
      });
    });
  });

  describe('Use cases', () => {
    it(`Display ${STATIC_ELECTRICITY.items[0].name}`, () => {
      cy.setUpApi(STATIC_ELECTRICITY);
      const parentFolder = STATIC_ELECTRICITY.items[0];
      const rootId = parentFolder.id;
      cy.visit(buildContentPagePath({ rootId, itemId: rootId }));

      expectFolderLayout({
        rootId,
        items: STATIC_ELECTRICITY.items,
      });
    });
    it(`Cannot display ${STATIC_ELECTRICITY.items[0].name} if does not have membership`, () => {
      cy.setUpApi({
        items: STATIC_ELECTRICITY.items.map((i) => {
          return { ...i, permission: null };
        }),
        currentMember: MEMBERS.BOB,
      });
      const parentFolder = STATIC_ELECTRICITY.items[0];
      const rootId = parentFolder.id;
      cy.visit(buildContentPagePath({ rootId, itemId: rootId }));
      cy.get(`#${MAIN_MENU_ID}`).should('not.exist');
    });
    it(`Display ${PUBLIC_STATIC_ELECTRICITY.items[0].name}`, () => {
      cy.setUpApi({ ...PUBLIC_STATIC_ELECTRICITY, currentMember: MEMBERS.BOB });
      const parentFolder = PUBLIC_STATIC_ELECTRICITY.items[0];
      const rootId = parentFolder.id;
      cy.visit(buildContentPagePath({ rootId, itemId: rootId }));

      expectFolderLayout({
        rootId,
        items: PUBLIC_STATIC_ELECTRICITY.items,
      });
    });
  });

  describe('Write access', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [GRAASP_DOCUMENT_ITEM, ...FOLDER_WITH_SUBFOLDER_ITEM.items],
      });
    });
    // todo: check that the builder can be accessed using the navigation
  });
});
