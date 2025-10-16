import { forwardRef } from 'react';

import { MenuItem, MenuItemProps } from '@mui/material';

import {
  LinkComponent,
  UseLinkPropsOptions,
  createLink,
  useLinkProps,
} from '@tanstack/react-router';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MUIMenuItemProps extends Omit<MenuItemProps, 'href'> {
  // Add any additional props you want to pass to the typography
}

const MUIMenuItemComponent = forwardRef<HTMLAnchorElement, MUIMenuItemProps>(
  (props, ref) => {
    const linkProps = useLinkProps(props as UseLinkPropsOptions);

    // obtain 'selected', usually from activeProps
    const selected = Boolean(linkProps.selected);

    return (
      <MenuItem component={'a'} ref={ref} selected={selected} {...props} />
    );
  },
);

const CreatedLinkComponent = createLink(MUIMenuItemComponent);

export const MenuItemLink: LinkComponent<typeof MUIMenuItemComponent> = (
  props,
) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
