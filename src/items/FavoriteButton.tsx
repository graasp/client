import React, { FC } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../constants';

export interface FavoriteButtonProps {
  isFavorite: boolean;
  handleUnfavorite: any;
  handleFavorite: any;
  size: 'default' | 'small' | 'large' | 'inherit' | 'medium' | undefined;
}

export const FlagItemButton: FC<FavoriteButtonProps> = ({
  isFavorite,
  handleUnfavorite,
  handleFavorite,
  size = 'large',
}) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      title={isFavorite ? t('Remove from Favorites') : t('Add to Favorites')}
    >
      <IconButton
        aria-label='favorite'
        className={FAVORITE_ITEM_BUTTON_CLASS}
        onClick={isFavorite ? handleUnfavorite : handleFavorite}
      >
        {isFavorite ? (
          <FavoriteIcon fontSize={size} />
        ) : (
          <FavoriteBorderIcon fontSize={size} />
        )}
      </IconButton>
    </Tooltip>
  );
};
