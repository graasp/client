import { forwardRef } from 'react';

import { CardActionArea, CardActionAreaProps } from '@mui/material';

import { LinkComponent, createLink } from '@tanstack/react-router';

interface MUICardActionAreaProps extends Omit<CardActionAreaProps, 'href'> {
  dataUmamiEvent: string;
}

const MUICardActionAreaComponent = forwardRef<
  HTMLAnchorElement,
  MUICardActionAreaProps
>((props, ref) => {
  const { dataUmamiEvent, ...restProps } = props;
  return (
    <CardActionArea
      component={'a'}
      ref={ref}
      data-umami-event={dataUmamiEvent}
      {...restProps}
    />
  );
});

const CreatedLinkComponent = createLink(MUICardActionAreaComponent);

export const CardActionAreaLink: LinkComponent<
  typeof MUICardActionAreaComponent
> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
