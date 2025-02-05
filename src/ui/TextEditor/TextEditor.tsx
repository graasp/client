import { type JSX, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';

import { Stack, styled } from '@mui/material';

import katex from 'katex';

import Button from '../buttons/Button/Button.js';
import SaveButton from '../buttons/SaveButton/SaveButton.js';

declare const window: Window &
  typeof globalThis & {
    katex: typeof katex;
  };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.katex = katex;

const TEXT_EDITOR_TOOLBAR = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }], // default colors depending on theme
  [{ background: [] }], // default colors depending on theme
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }, 'code-block', 'link', 'formula'],
];

const TEXT_EDITOR_MIN_HEIGHT = 200;
const TEXT_EDITOR_MAX_HEIGHT = 400;

export type TextEditorProps = {
  cancelButtonId?: string;
  cancelButtonText?: string;
  id?: string;
  onCancel?: (text: string) => void;
  onChange?: (text: string) => void;
  onSave?: (text: string) => void;
  placeholderText?: string;
  saveButtonId?: string;
  saveButtonText?: string;
  savedButtonText?: string;
  showActions?: boolean;
  value?: string;
};

const Div = styled('div')(({ theme }) => ({
  width: '100%',
  '.ql-tooltip': {
    zIndex: theme.zIndex.tooltip,
  },
  '& .ql-editor': {
    // adapt height if read only
    minHeight: TEXT_EDITOR_MIN_HEIGHT,
    // necessary styles to avoid window scrolling top on paste
    // set a max height only on edition
    maxHeight: TEXT_EDITOR_MAX_HEIGHT,
    overflow: 'auto',

    '& p': {
      paddingBottom: 3,
      paddingTop: 3,
    },
  },
  '& .ql-container': {
    // use font size from mui theme
    fontSize: 'unset',
  },
}));

const TextEditor = ({
  cancelButtonId,
  cancelButtonText = 'Cancel',
  id,
  onCancel,
  onChange,
  onSave,
  placeholderText = 'Write something…',
  saveButtonId,
  saveButtonText,
  savedButtonText,
  showActions = true,
  value: initialValue = '',
}: TextEditorProps): JSX.Element | null => {
  // keep current content
  const [content, setContent] = useState(initialValue ?? '');
  const editorRef = useRef<ReactQuill>(null);

  const onTextChange = (text: string): void => {
    // keep track of the current content
    setContent(text);
    onChange?.(text);
  };

  const onCancelClick = (): void => {
    onCancel?.(content);
    setContent(initialValue);
  };

  useEffect(() => {
    // update the content with initialValue only when initialValue changes
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setContent(initialValue);
  }, [initialValue]);

  // this hack is necessary because the "placeholder" prop does not update
  // see: https://github.com/zenoamaro/react-quill/issues/340
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getEditor().root.dataset.placeholder = placeholderText;
    }
  }, [placeholderText]);

  return (
    <Stack direction="column" spacing={1} alignItems="flex-end">
      <Div>
        <ReactQuill
          ref={editorRef}
          id={id}
          placeholder={placeholderText}
          theme="snow"
          value={content}
          onChange={onTextChange}
          modules={{
            toolbar: TEXT_EDITOR_TOOLBAR,
            clipboard: {
              matchVisual: false,
            },
          }}
        />
      </Div>
      {showActions && (
        <Stack spacing={1} direction="row">
          <Button variant="text" id={cancelButtonId} onClick={onCancelClick}>
            {cancelButtonText}
          </Button>
          <SaveButton
            id={saveButtonId}
            onClick={() => onSave?.(content)}
            text={saveButtonText}
            savedText={savedButtonText}
            hasChanges={content !== initialValue}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default TextEditor;
