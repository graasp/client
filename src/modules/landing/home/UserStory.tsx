import { type JSX, type ReactNode } from 'react';

import { Stack, Typography } from '@mui/material';

const IMAGE_CONTAINER = 'image-container';
const TEXT_CONTAINER = 'text-container';

type UserStoryProps = {
  title: string;
  children: ReactNode;
  image: ReactNode;
  imageAttribution?: ReactNode;
};
export function UserStory({
  title,
  children,
  image,
  imageAttribution,
}: Readonly<UserStoryProps>): JSX.Element {
  return (
    <Stack>
      <Stack direction="row" gap={5} mt={3} position="relative">
        <Stack className={IMAGE_CONTAINER} flex={1} gap={1} alignItems="center">
          <Stack borderRadius={6} overflow="hidden">
            {image}
          </Stack>
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
