import { Stack, Tooltip, Typography } from '@mui/material';

import { Info } from 'lucide-react';

import { useButtonColor } from '@/ui/buttons/hooks';

const ChartTitle = ({
  title,
  description = title,
}: {
  title: string;
  description?: string;
}): JSX.Element => {
  const { color } = useButtonColor('primary');
  return (
    <Stack
      spacing={1}
      pt={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h6" align="center">
        {title}
      </Typography>
      <Tooltip title={description}>
        <Info color={color} />
      </Tooltip>
    </Stack>
  );
};

export default ChartTitle;
