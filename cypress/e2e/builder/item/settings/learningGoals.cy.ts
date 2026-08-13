import { LEARNING_GOALS_NEW_INPUT_ID } from '../../../../../src/config/selectors';
import {
  IMAGE_ITEM_DEFAULT,
  PDF_ITEM_DEFAULT,
} from '../../../../fixtures/files';
import { CURRENT_MEMBER } from '../../../../fixtures/members';
import { buildItemSettingsPath } from '../../utils';

describe('PDF learning goals settings', () => {
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
  const now = new Date().toISOString();
  const firstGoal = {
    id: '898a9ed6-f1cb-41d8-84dc-f1bb20d5af7d',
    itemId: pdf.id,
    text: 'Identify the argument',
    position: 0,
    createdAt: now,
    updatedAt: now,
  };
  const secondGoal = {
    id: 'e8befdd4-d99f-4ab0-a16b-54a363742980',
    itemId: pdf.id,
    text: 'Explain the conclusion',
    position: 1,
    createdAt: now,
    updatedAt: now,
  };

  it('appears only for PDFs', () => {
    cy.setUpApi({ items: [pdf, image] });

    cy.visit(buildItemSettingsPath(image.id));
    cy.contains('Learning goals').should('not.exist');

    cy.visit(buildItemSettingsPath(pdf.id));
    cy.contains('Learning goals').should('be.visible');
    cy.contains('No learning goals have been added.')
      .scrollIntoView()
      .should('be.visible');
  });

  it('supports add, edit, reorder, and delete', () => {
    cy.setUpApi({
      items: [pdf],
      learningGoals: { [pdf.id]: [firstGoal, secondGoal] },
    });
    cy.visit(buildItemSettingsPath(pdf.id));

    cy.get(`#${LEARNING_GOALS_NEW_INPUT_ID}`).type('Compare the evidence');
    cy.contains('button', 'Add').click();
    cy.wait('@createLearningGoal')
      .its('request.body')
      .should('deep.equal', { text: 'Compare the evidence' });

    cy.get('button[aria-label="Edit Identify the argument"]').click();
    cy.get('input[value="Identify the argument"]')
      .clear()
      .type('Identify the main argument');
    cy.contains('button', 'Save').click();
    cy.wait('@updateLearningGoal')
      .its('request.body')
      .should('deep.equal', { text: 'Identify the main argument' });

    cy.get('button[aria-label="Move Explain the conclusion up"]').click();
    cy.wait('@reorderLearningGoals')
      .its('request.body.goalIds.0')
      .should('equal', secondGoal.id);

    cy.get('button[aria-label="Delete Identify the main argument"]').click();
    cy.contains('Delete learning goal?').should('be.visible');
    cy.get('[role="dialog"]').contains('button', 'Delete').click();
    cy.wait('@deleteLearningGoal');
    cy.contains('Identify the main argument').should('not.exist');
  });

  it('keeps a goal and exposes recovery when deletion fails', () => {
    cy.setUpApi({
      items: [pdf],
      learningGoals: { [pdf.id]: [firstGoal] },
    });
    cy.intercept(
      {
        method: 'DELETE',
        pathname: `/api/items/${pdf.id}/learning-goals/${firstGoal.id}`,
        times: 1,
      },
      { statusCode: 500 },
    ).as('failedLearningGoalDelete');
    cy.visit(buildItemSettingsPath(pdf.id));

    cy.get(`button[aria-label="Delete ${firstGoal.text}"]`).click();
    cy.get('[role="dialog"]').contains('button', 'Delete').click();
    cy.wait('@failedLearningGoalDelete');

    cy.get('[role="dialog"]').should('not.exist');
    cy.contains(firstGoal.text).should('be.visible');
    cy.contains('The learning-goal change could not be saved.').should(
      'be.visible',
    );
    cy.contains('button', 'Reload goals').click();
    cy.wait('@getLearningGoals');
  });
});
