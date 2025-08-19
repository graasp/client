/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { type KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LexicalEditor } from 'lexical';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { NS } from '@/config/constants';

import { MAX_ALLOWED_FONT_SIZE, MIN_ALLOWED_FONT_SIZE } from './constants';
import { updateFontSize, updateFontSizeInSelection } from './utils';

export function parseAllowedFontSize(input: string): string {
  const match = input.match(/^(\d+(?:\.\d+)?)px$/);
  if (match) {
    const n = Number(match[1]);
    if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
      return input;
    }
  }
  return '';
}

export function FontSize({
  selectionFontSize,
  disabled = false,
  editor,
}: {
  selectionFontSize: string;
  disabled?: boolean;
  editor: LexicalEditor;
}) {
  const { t } = useTranslation(NS.PageEditor, {
    keyPrefix: 'TOOLBAR.FONT_SIZE',
  });
  const [inputChangeFlag, setInputChangeFlag] = useState<boolean>(false);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(selectionFontSize);

    if (e.key === 'Tab') {
      return;
    }
    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault();
      return;
    }
    setInputChangeFlag(true);
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();

      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleInputBlur = () => {
    if (selectionFontSize !== '' && inputChangeFlag) {
      const inputValueNumber = Number(selectionFontSize);
      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const updateFontSizeByInputValue = (inputValueNumber: number) => {
    let updatedFontSize = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE;
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE;
    }

    updateFontSizeInSelection(editor, String(updatedFontSize) + 'px', null);
    setInputChangeFlag(false);
  };

  return (
    <>
      <button
        type="button"
        disabled={
          disabled ||
          (selectionFontSize !== '' &&
            Number(selectionFontSize) <= MIN_ALLOWED_FONT_SIZE)
        }
        onClick={() => updateFontSize(editor, 'decrement', selectionFontSize)}
        className="toolbar-item font-decrement"
        aria-label={t('DECREASE')}
        title={t('DECREASE')}
      >
        <MinusIcon size={14} />
      </button>

      <input
        name="fontSize"
        type="number"
        title="Font size"
        value={selectionFontSize}
        disabled={disabled}
        style={{
          textAlign: 'center',
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#ccc',
          borderStyle: 'solid',
          width: 30,
          height: 30,
          boxSizing: 'border-box',
        }}
        className="font-size-input"
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onKeyDown={handleKeyPress}
        onBlur={handleInputBlur}
      />

      <button
        type="button"
        disabled={
          disabled ||
          (selectionFontSize !== '' &&
            Number(selectionFontSize) >= MAX_ALLOWED_FONT_SIZE)
        }
        onClick={() => updateFontSize(editor, 'increment', selectionFontSize)}
        className="toolbar-item font-increment"
        aria-label={t('INCREASE')}
        title={t('INCREASE')}
      >
        <PlusIcon size={14} />
      </button>
    </>
  );
}
