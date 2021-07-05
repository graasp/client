import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const useSearchStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const ItemSearchInput = (props) => {
  const { searchInputHandler, searchTextState } = props;
  const classes = useSearchStyles();

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <OutlinedInput
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        onChange={searchInputHandler}
        value={searchTextState}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
};

ItemSearchInput.propTypes = {
  searchInputHandler: PropTypes.func,
  searchTextState: PropTypes.string,
};

ItemSearchInput.defaultProps = {
  searchInputHandler: () => {},
  searchTextState: '',
};

const useItemSearch = (items) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchInput = (event) => {
    const text = event.target.value;
    setSearchText(text.toLowerCase());
  };

  const searchResults = items.filter((it) =>
    it.name.toLowerCase().includes(searchText),
  );

  const itemSearchInput = (
    <ItemSearchInput
      searchInputHandler={handleSearchInput}
      searchTextState={searchText}
    />
  );
  return { searchResults, itemSearchInput };
};

export { useItemSearch, ItemSearchInput };
