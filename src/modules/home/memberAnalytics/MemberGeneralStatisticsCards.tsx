import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Stack, Typography, styled } from '@mui/material';

import { Action, ActionTriggers } from '@graasp/sdk';

import { NS } from '@/config/constants';

const StyledCardBox = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(228, 224, 228, 0.61)',
  borderRadius: theme.spacing(2),
  color: '#808080',
  flex: 1,
  justifyContent: 'space-between',
}));

function MyAnalyticsCard({
  title,
  stat,
}: Readonly<{
  title: string;
  stat: number;
}>): JSX.Element {
  return (
    <StyledCardBox>
      <Typography fontWeight={700}>{title}</Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          fontWeight: 900,
          color: '#7F82CD',
        }}
      >
        {stat}
      </Box>
    </StyledCardBox>
  );
}

type Props = {
  actionsGroupedByTypes: { [key: string]: Action[] };
};
export function MemberGeneralStatisticsCards({
  actionsGroupedByTypes,
}: Readonly<Props>): JSX.Element {
  const { t } = useTranslation(NS.Analytics);

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
      <MyAnalyticsCard
        title={t('GENERAL_STATISTIC_ITEMS_CREATED')}
        stat={actionsGroupedByTypes[ActionTriggers.Create]?.length ?? 0}
      />
      <MyAnalyticsCard
        title={t('GENERAL_STATISTIC_LIKED_ITEMS')}
        stat={actionsGroupedByTypes[ActionTriggers.ItemLike]?.length ?? 0}
      />
      <MyAnalyticsCard
        title={t('GENERAL_STATISTIC_DOWNLOADED_ITEMS')}
        stat={actionsGroupedByTypes[ActionTriggers.ItemDownload]?.length ?? 0}
      />
      <MyAnalyticsCard
        title={t('GENERAL_STATISTIC_CHAT_CREATED')}
        stat={actionsGroupedByTypes[ActionTriggers.ChatCreate]?.length ?? 0}
      />
    </Stack>
  );
}
