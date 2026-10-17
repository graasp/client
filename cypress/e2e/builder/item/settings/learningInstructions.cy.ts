import { LEARNING_INSTRUCTIONS_EDITOR_ID } from '../../../../../src/config/selectors';
import {
  IMAGE_ITEM_DEFAULT,
  PDF_ITEM_DEFAULT,
} from '../../../../fixtures/files';
import { CURRENT_MEMBER } from '../../../../fixtures/members';
import { buildItemSettingsPath } from '../../utils';

describe('PDF learning workspace instructions settings', () => {
  const pdf = {
    ...PDF_ITEM_DEFAULT,
    permission: 'admin' as const,
    creator: CURRENT_MEMBER,
  };
  const image = {
    ...IMAGE_ITEM_DEFAULT,
    permission: 'admin' as const,
    creator: CURRENT_MEMBER,
  };

  it('appears only for PDFs', () => {
    cy.setUpApi({ items: [pdf, image] });

    cy.visit(buildItemSettingsPath(image.id));
    cy.contains('Learning workspace instructions').should('not.exist');

    cy.visit(buildItemSettingsPath(pdf.id));
    cy.contains('Learning workspace instructions')
      .scrollIntoView()
      .should('be.visible');
  });

  it('loads, cancels, saves, and retains a failed draft', () => {
    const now = new Date().toISOString();
    cy.setUpApi({
      items: [pdf],
      learningWorkspaceSettings: {
        [pdf.id]: {
          itemId: pdf.id,
          instructions: '<p>Read the introduction.</p>',
          createdAt: now,
          updatedAt: now,
        },
      },
    });
    cy.visit(buildItemSettingsPath(pdf.id));
    cy.wait('@getLearningWorkspaceSettings');

    const editor = () =>
      cy.get(`#${LEARNING_INSTRUCTIONS_EDITOR_ID} .ql-editor`);

    editor().should('contain.text', 'Read the introduction.');
    editor().click().type(' Draft');
    cy.contains('button', 'Cancel').click();
    editor().should('have.text', 'Read the introduction.');

    editor().click().type(' Then compare the conclusions.');
    cy.intercept(
      {
        method: 'PATCH',
        pathname: `/api/items/${pdf.id}/learning-workspace-settings`,
        times: 1,
      },
      { statusCode: 500 },
    ).as('failedInstructionsUpdate');
    cy.contains('button', 'Save').click();
    cy.wait('@failedInstructionsUpdate');
    cy.contains('The instructions could not be saved').should('be.visible');
    editor().should('contain.text', 'Then compare the conclusions.');

    cy.contains('button', 'Save').click();
    cy.wait('@updateLearningWorkspaceSettings')
      .its('request.body.instructions')
      .should('contain', 'Then compare the conclusions.');
    cy.contains('Saved').should('be.visible');

    editor().clear();
    cy.contains('button', 'Save').click();
    cy.wait('@updateLearningWorkspaceSettings')
      .its('request.body')
      .should('deep.equal', { instructions: '' });
  });

  it('retries after instructions fail to load', () => {
    cy.setUpApi({ items: [pdf] });
    cy.intercept(
      {
        method: 'GET',
        pathname: `/api/items/${pdf.id}/learning-workspace-settings`,
        times: 1,
      },
      { statusCode: 500 },
    ).as('failedInstructionsLoad');
    cy.visit(buildItemSettingsPath(pdf.id));

    cy.wait('@failedInstructionsLoad');
    cy.contains('Instructions could not be loaded.').should('be.visible');
    cy.contains('button', 'Retry').click();
    cy.wait('@getLearningWorkspaceSettings');
    cy.get(`#${LEARNING_INSTRUCTIONS_EDITOR_ID}`).should('be.visible');
  });
});
