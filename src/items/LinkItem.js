import React from 'react';
import { makeStyles } from '@material-ui/core';
import { getEmbeddedLinkExtra } from '../utils/itemExtra';

const useStyles = makeStyles(() => ({
  iframe: {
    width: '100%',
    border: 'none',
  },
}));

const LinkItem = ({ item, height }) => {
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
  return (
    <iframe
      id={id}
      className={classes.iframe}
      title={name}
      src={url}
      height={height || '100%'}
    />
  );
};

export default LinkItem;
