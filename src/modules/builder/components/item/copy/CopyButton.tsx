import { useTranslation } from 'react-i18next';

import {
  ActionButtonVariant,
  ColorVariantsType,
  CopyButton as GraaspCopyButton,
} from '@graasp/ui';

import { NS } from '@/config/constants';
import {
  ITEM_COPY_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '@/config/selectors';

import { BUILDER } from '../../../langs/constants';

export type Props = {
  color?: ColorVariantsType;
  id?: string;
  onClick?: () => void;
  type?: ActionButtonVariant;
};

const CopyButton = ({ color, id, type, onClick }: Props): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  return (
    <GraaspCopyButton
      type={type}
      id={id}
      text={translateBuilder(BUILDER.COPY_BUTTON)}
      color={color}
      iconClassName={ITEM_COPY_BUTTON_CLASS}
      menuItemClassName={ITEM_MENU_COPY_BUTTON_CLASS}
      onClick={onClick}
    />
  );
};

export default CopyButton;
