import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { DEBOUNCED_TEXT_FIELD_ID } from '@/config/selectors';

import DebouncedTextField, { DEBOUNCE_MS } from './DebouncedTextField';

const LABEL = 'Label';
const VALUE = 'My value';

const meta: Meta<typeof DebouncedTextField> = {
  title: 'Builder/DebouncedTextField',
  component: DebouncedTextField,
  args: {
    initialValue: VALUE,
    label: LABEL,
    onUpdate: fn(),
  },
  // Optional: if you want consistent layout/width etc.
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const textFieldFrom = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  // Preferred: the component adds data-testid using this selector ID
  const byTestId = () =>
    canvas.getByTestId(DEBOUNCED_TEXT_FIELD_ID) as
      | HTMLInputElement
      | HTMLTextAreaElement;

  try {
    return byTestId();
  } catch {
    // Fallback to role + id if you don’t use data-testid
    return (
      (canvasElement.querySelector(`#${DEBOUNCED_TEXT_FIELD_ID}`) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null) ??
      (canvas.getByRole('textbox') as HTMLInputElement | HTMLTextAreaElement)
    );
  }
};

export const InitialValueDoesNotCallOnUpdate: Story = {
  args: {},
  play: async ({ canvasElement, args }) => {
    const textarea = textFieldFrom(canvasElement);
    const onUpdate = args.onUpdate;

    expect(textarea).toBeVisible();

    // No interaction: debounce should not fire
    await waitFor(
      () => {
        expect(onUpdate).not.toHaveBeenCalled();
      },
      { timeout: DEBOUNCE_MS + 50 },
    );
  },
};

export const EditValueCallsOnUpdate: Story = {
  args: {},
  play: async ({ canvasElement, args }) => {
    const textarea = textFieldFrom(canvasElement);
    const onUpdate = args.onUpdate;
    const NEW_VALUE = 'My new value';

    await userEvent.clear(textarea);
    await userEvent.type(textarea, NEW_VALUE);

    await waitFor(
      () => {
        expect(onUpdate).toHaveBeenCalledTimes(1);
        expect(onUpdate).toHaveBeenCalledWith(NEW_VALUE);
      },
      { timeout: DEBOUNCE_MS + 50 },
    );
  },
};

export const DebouncesOnMultipleEdits: Story = {
  args: {},
  play: async ({ canvasElement, args }) => {
    const textarea = textFieldFrom(canvasElement);
    const onUpdate = args.onUpdate;

    const NEW_VALUE = 'My new value';
    const APPEND_VALUE = ' which has been debounced';
    const FINAL_VALUE = `${NEW_VALUE}${APPEND_VALUE}`;

    await userEvent.clear(textarea);
    await userEvent.type(textarea, NEW_VALUE);

    // Intentionally hammer the field quickly: userEvent already
    // space‑out key events a bit, so no manual wait is required.
    await userEvent.type(textarea, APPEND_VALUE);

    await waitFor(
      () => {
        expect(onUpdate).toHaveBeenCalledTimes(1);
        expect(onUpdate).toHaveBeenCalledWith(FINAL_VALUE);
      },
      { timeout: DEBOUNCE_MS + 150 },
    );
  },
};

export const RequiredFieldDoesNotUpdateWhenEmpty: Story = {
  args: {
    required: true,
  },
  play: async ({ canvasElement, args }) => {
    const textarea = textFieldFrom(canvasElement);
    const onUpdate = args.onUpdate;

    await userEvent.clear(textarea);

    await waitFor(
      () => {
        // Under the original contract, empty value should not trigger update
        expect(onUpdate).not.toHaveBeenCalled();
      },
      { timeout: DEBOUNCE_MS + 50 },
    );
  },
};

export const RequiredFieldUpdatesWhenNotEmpty: Story = {
  args: {
    required: true,
  },
  play: async ({ canvasElement, args }) => {
    const textarea = textFieldFrom(canvasElement);
    const onUpdate = args.onUpdate;
    const NEW_VALUE = 'My new value';

    await userEvent.clear(textarea);
    await userEvent.type(textarea, NEW_VALUE);

    await waitFor(
      () => {
        expect(onUpdate).toHaveBeenCalledTimes(1);
        expect(onUpdate).toHaveBeenCalledWith(NEW_VALUE);
      },
      { timeout: DEBOUNCE_MS + 50 },
    );
  },
};
