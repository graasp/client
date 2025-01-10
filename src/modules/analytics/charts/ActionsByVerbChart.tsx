import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, styled } from '@mui/material';

import { ActionTriggers } from '@graasp/sdk';

import { Cell, Pie, PieChart, PieLabel, Tooltip } from 'recharts';

import { NS } from '@/config/constants';

import { DataContext } from '~analytics/context/DataProvider';

import ActionChartLabel from '../charts-layout/ActionChartLabel';
import ChartContainer from '../common/ChartContainer';
import ChartTitle from '../common/ChartTitle';
import { CONTAINER_HEIGHT, getColorForActionTriggerType } from '../constants';
import { filterActions, formatActionsByVerb, getActionsByVerb } from '../utils';
import { EmptyChart } from './EmptyChart';

const EmptyChartAlert = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: `${CONTAINER_HEIGHT}px`,
});
const PieLabelComp: PieLabel = (props) => <ActionChartLabel {...props} />;
const ActionsByVerbChart = (): JSX.Element => {
  const { t } = useTranslation(NS.Analytics);
  const { t: translateActions } = useTranslation(NS.Enums);

  const { actions, selectedUsers, selectedActionTypes } =
    useContext(DataContext);

  let actionsByVerb = {};
  if (actions?.length) {
    actionsByVerb = filterActions({
      selectedUsers,
      selectedActionTypes,
      actions,
      chartFunction: getActionsByVerb,
    });
  }
  const formattedActionsByVerb = formatActionsByVerb(actionsByVerb);
  const title = t('ACTIONS_DISTRIBUTIONS');

  // if no user is selected, this chart will be the same as Total Actions Distribution
  // instead show an info text
  if (!selectedUsers?.length) {
    return (
      <>
        <ChartTitle title={title} />
        <EmptyChartAlert>
          <Typography>{t('NO_USER_SELECTED')}</Typography>
        </EmptyChartAlert>
      </>
    );
  }

  // if selected user(s) have no actions, render component with message that there are no actions
  if (!formattedActionsByVerb?.length) {
    return <EmptyChart chartTitle={title} />;
  }

  const formattedActionsByVerbSorted = [...formattedActionsByVerb];
  formattedActionsByVerbSorted.sort((a, b) => a.type.localeCompare(b.type));

  return (
    <>
      <ChartTitle title={title} />
      <ChartContainer>
        <PieChart>
          <Pie
            data={formattedActionsByVerbSorted}
            dataKey="percentage"
            nameKey="type"
            label={PieLabelComp}
            labelLine={false}
          >
            {formattedActionsByVerbSorted.map((entry) => (
              <Cell
                key={entry.type}
                fill={getColorForActionTriggerType(entry.type)}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name: `${ActionTriggers}`) => [
              `${value}%`,
              translateActions(name),
            ]}
          />
        </PieChart>
      </ChartContainer>
    </>
  );
};

export default ActionsByVerbChart;
