import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { Map } from 'immutable';
import { getEmbeddedLinkExtra } from '../utils/itemExtra';

const useStyles = makeStyles(() => ({
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
}));

const LinkItem = ({ item }) => {
  const classes = useStyles();

  const id = item.get('id');
  const extra = getEmbeddedLinkExtra(item.get('extra'));

  // if available, display specific player
  const html = extra?.html;
  if (html) {
    // eslint-disable-next-line react/no-danger
    return <div id={id} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // default case is an iframe with given link
  const url = extra?.url;
  const name = item.get('name');
  return <iframe id={id} className={classes.iframe} title={name} src={url} />;
};

LinkItem.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default LinkItem;
