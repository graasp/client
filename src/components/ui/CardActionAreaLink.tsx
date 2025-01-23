import { forwardRef } from 'react';

import { CardActionArea, CardActionAreaProps } from '@mui/material';

import { LinkComponent, createLink } from '@tanstack/react-router';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MUICardActionAreaProps extends Omit<CardActionAreaProps, 'href'> {
  // Add any additional props you want to pass to the card action area
}

const MUICardActionAreaComponent = forwardRef<
  HTMLAnchorElement,
  MUICardActionAreaProps
>((props, ref) => {
  return <CardActionArea component={'a'} ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(MUICardActionAreaComponent);

export const CardActionAreaLink: LinkComponent<
  typeof MUICardActionAreaComponent
> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
