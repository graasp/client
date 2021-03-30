import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isUrlValid } from '../../../utils/item';
import { ITEM_FORM_LINK_INPUT_ID } from '../../../config/selectors';

function LinkForm({ onChange, item }) {
  const { t } = useTranslation();

  const handleLinkInput = (event) => {
    onChange({
      ...item,
      name: 'a random name for link', // todo: this is replaced by iframely
      extra: { embeddedLinkItem: { url: event.target.value } },
    });
  };

  const { url } = item.extra?.embeddedLinkItem || {};
  const isLinkInvalid = url?.length && !isUrlValid(url);

  return (
    <>
      <TextField
        id={ITEM_FORM_LINK_INPUT_ID}
        error={isLinkInvalid}
        autoFocus
        margin="dense"
        label={t('Link')}
        value={url}
        onChange={handleLinkInput}
        helperText={Boolean(isLinkInvalid) && t('This link is not valid')}
      />
    </>
  );
}

LinkForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    extra: PropTypes.shape({
      embeddedLinkItem: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default LinkForm;
