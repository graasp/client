import { type JSX, type ReactNode } from 'react';

import { Stack, Typography } from '@mui/material';

const IMAGE_CONTAINER = 'image-container';
const TEXT_CONTAINER = 'text-container';

type MessageProps = {
  title: string;
  children: ReactNode;
  image: string;
  imageAttribution?: ReactNode;
};
export function Message({
  title,
  children,
  image,
  imageAttribution,
}: Readonly<MessageProps>): JSX.Element {
  return (
    <Stack>
      <Stack
        direction={{ md: 'row' }}
        gap={{ xs: 0, md: 3 }}
        mt={3}
        position="relative"
      >
        <Stack className={IMAGE_CONTAINER} flex={1} gap={1} alignItems="center">
          <img style={{ maxWidth: '500px' }} alt={title} src={image} />
          {imageAttribution && (
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ '& a': { color: 'inherit' } }}
            >
              {imageAttribution}
            </Typography>
          )}
        </Stack>
        <Stack className={TEXT_CONTAINER} gap={3} flex={2}>
          <Typography variant="h2" color="primary">
            {title}
          </Typography>
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
}
