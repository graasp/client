import {
  type JSX,
  type ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

import { INITIAL_EDITING_PROPS } from '../constants.js';

type EditingProp = {
  open: boolean;
  id: string;
  body: string;
};

export type EditingContextType = {
  open: boolean;
  body: string;
  messageId: string;
  editing: EditingProp;
  enableEdit: (id: string, body: string) => void;
  cancelEdit: () => void;
};

export const EditingContext = createContext<EditingContextType>({
  open: false,
  body: '',
  messageId: '',
  editing: INITIAL_EDITING_PROPS,
  enableEdit: () => null,
  cancelEdit: () => null,
});

type Props = {
  children: ReactNode;
};

export const EditingContextProvider = ({ children }: Props): JSX.Element => {
  const [editing, setEditing] = useState(INITIAL_EDITING_PROPS);
  const open = editing.open;
  const body = editing.body;
  const messageId = editing.id;
  const enableEdit = (id: string, newBody: string): void =>
    setEditing({ id, open: true, body: newBody });
  const cancelEdit = (): void => setEditing(INITIAL_EDITING_PROPS);

  return (
    <EditingContext.Provider
      value={{ open, body, messageId, editing, enableEdit, cancelEdit }}
    >
      {children}
    </EditingContext.Provider>
  );
};

export const useEditingContext = (): EditingContextType =>
  useContext<EditingContextType>(EditingContext);
