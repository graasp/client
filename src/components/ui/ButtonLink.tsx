import React from 'react';

import { Button, ButtonProps } from '@mui/material';

import { LinkComponent, createLink } from '@tanstack/react-router';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MUILinkProps extends Omit<ButtonProps, 'href'> {
  // Add any additional props you want to pass to the button
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
  (props, ref) => {
    return <Button component={'a'} ref={ref} {...props} />;
  },
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const ButtonLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
