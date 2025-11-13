import { MouseEventHandler, forwardRef } from 'react';

import { Button, ButtonProps } from '@mui/material';

import {
  LinkComponent,
  UseLinkPropsOptions,
  createLink,
  useLinkProps,
} from '@tanstack/react-router';

interface MUIButtonProps extends Omit<ButtonProps, 'href'> {
  // Add any additional props you want to pass to the button
  dataUmamiEvent?: string;
}

const MUILinkComponent = forwardRef<HTMLAnchorElement, MUIButtonProps>(
  (props, ref) => {
    const linkProps = useLinkProps(props as UseLinkPropsOptions);

    // obtain fontweight, usually from activeProps
    const fw =
      'fontWeight' in linkProps ? (linkProps.fontWeight as string) : 'inherit';

    const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      props.onClick?.(e);
      if (props.dataUmamiEvent) {
        window.umami.track(props.dataUmamiEvent);
      }
    };

    return (
      <Button
        component={'a'}
        ref={ref}
        {...props}
        sx={{
          textTransform: 'none',
          minWidth: 'unset',
          fontWeight: fw,
          ...props.sx,
        }}
        onClick={onClick}
      />
    );
  },
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const ButtonLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
