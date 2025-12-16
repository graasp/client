import { forwardRef } from 'react';

import { MenuItem, MenuItemProps } from '@mui/material';

import { LinkComponent, createLink } from '@tanstack/react-router';

interface MUIMenuItemProps extends Omit<MenuItemProps, 'href'> {
  // Add any additional props you want to pass to the typography
  dataUmamiEvent?: string;
}

const MUIMenuItemComponent = forwardRef<HTMLAnchorElement, MUIMenuItemProps>(
  (props, ref) => {
    return <MenuItem component={'a'} ref={ref} {...props} />;
  },
);

const CreatedLinkComponent = createLink(MUIMenuItemComponent);

export const MenuItemLink: LinkComponent<typeof MUIMenuItemComponent> = (
  props,
) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
