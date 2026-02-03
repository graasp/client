import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tab, Tabs, styled } from '@mui/material';

import { MimeTypes } from '@graasp/sdk';

import { NS } from '@/config/constants';
import {
  CREATE_ITEM_APP_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_ETHERPAD_ID,
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_FOLDER_ID,
  CREATE_ITEM_H5P_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_ZIP_ID,
} from '@/config/selectors';
import ItemIcon from '@/ui/icons/ItemIcon';

import { BUILDER } from '../../langs';
import { InternalItemType, NewItemTabType } from '../../types';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  maxWidth: 150,

  '& .MuiTabs-scrollButtons svg': {
    background: theme.palette.primary.main,
    borderRadius: '50px',
    color: 'white',
  },
}));

type Props = {
  onTypeChange: (type: NewItemTabType) => void;
  initialValue: NewItemTabType;
};

const ItemTypeTabs = ({ onTypeChange, initialValue }: Props): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const [value, setValue] = useState<NewItemTabType>(initialValue ?? 'folder');

  const handleChange = (_event: unknown, newValue: NewItemTabType) => {
    setValue(newValue);
    onTypeChange(newValue);
  };

  const zipIcon = (
    <ItemIcon
      alt={translateBuilder(BUILDER.NEW_ITEM_ZIP_TAB_TEXT)}
      type={'file'}
      mimetype={MimeTypes.ZIP}
    />
  );

  return (
    <StyledTabs
      variant="scrollable"
      scrollButtons="auto"
      orientation="vertical"
      value={value}
      onChange={handleChange}
    >
      <Tab
        id={CREATE_ITEM_FOLDER_ID}
        value={'folder'}
        label={translateBuilder(BUILDER.NEW_ITEM_FOLDER_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_FOLDER_TAB_TEXT)}
            type={'folder'}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_FILE_ID}
        value={'file'}
        label={translateBuilder(BUILDER.NEW_ITEM_FILE_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_FILE_TAB_TEXT)}
            type="upload"
          />
        }
      />
      <Tab
        id={CREATE_ITEM_LINK_ID}
        value={'embeddedLink'}
        label={translateBuilder(BUILDER.NEW_ITEM_LINK_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_LINK_TAB_TEXT)}
            type={'embeddedLink'}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_DOCUMENT_ID}
        value={'document'}
        label={translateBuilder(BUILDER.NEW_ITEM_DOCUMENT_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_DOCUMENT_TAB_TEXT)}
            type={'document'}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_APP_ID}
        value={'app'}
        label={translateBuilder(BUILDER.NEW_ITEM_APP_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_APP_TAB_TEXT)}
            type={'app'}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_ZIP_ID}
        value={InternalItemType.ZIP}
        label={translateBuilder(BUILDER.NEW_ITEM_ZIP_TAB_TEXT)}
        icon={zipIcon}
      />
      <Tab
        id={CREATE_ITEM_H5P_ID}
        value={'h5p'}
        label={translateBuilder(BUILDER.NEW_ITEM_H5P_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_H5P_TAB_TEXT)}
            type={'h5p'}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_ETHERPAD_ID}
        value={'etherpad'}
        label={translateBuilder(BUILDER.NEW_ITEM_ETHERPAD_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_ETHERPAD_TAB_TEXT)}
            type={'etherpad'}
          />
        }
      />
    </StyledTabs>
  );
};

export default ItemTypeTabs;
