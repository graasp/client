import React from 'react';

import {
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { useMainMenuOpenContext, useMobileView } from '@graasp/ui';

import { LinkComponent, createLink } from '@tanstack/react-router';

/**
 * MUI integration with `@tanstack/router`
 * https://tanstack.com/router/latest/docs/framework/react/guide/custom-link#mui-example
 */
interface MUIListItemButtonProps extends Omit<ListItemButtonProps, 'href'> {
  id?: string;
  text: string;
  icon: JSX.Element;
  dataUmamiEvent?: string;
}

const MUILinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MUIListItemButtonProps
>((props, ref) => {
  const { id, icon, text, dataUmamiEvent, onClick, ...rest } = props;
  const { isMobile } = useMobileView();
  const { setOpen } = useMainMenuOpenContext();

  const onClickHandler = (e: any) => {
    if (isMobile) {
      setOpen(false);
    }
    // call original onclick
    onClick?.(e);
  };

  return (
    <ListItem disablePadding id={id}>
      <ListItemButton
        component={'a'}
        ref={ref}
        data-umami-event={dataUmamiEvent}
        onClick={onClickHandler}
        {...rest}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
});

const CreatedLinkComponent = createLink(MUILinkComponent);

export const MainMenuItem: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />;
};
