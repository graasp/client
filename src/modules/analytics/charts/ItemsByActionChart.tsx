import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material';

import { ActionTriggers } from '@graasp/sdk';

import groupBy from 'lodash/groupBy';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { NS } from '@/config/constants';

import { DataContext } from '~analytics/context/DataProvider';

import ChartContainer from '../common/ChartContainer';
import ChartTitle from '../common/ChartTitle';
import {
  TOP_NUMBER_OF_ITEMS_TO_DISPLAY,
  getColorForActionTriggerType,
} from '../constants';
import {
  filterActionsByActionTypes,
  findItemNameByPath,
  groupByFirstLevelItems,
} from '../utils';
import { EmptyChart } from './EmptyChart';

const ItemsByActionChart = (): JSX.Element => {
  const { t } = useTranslation(NS.Analytics);
  const { t: translateAction } = useTranslation(NS.Enums);
  const { direction } = useTheme();

  const {
    actions,
    selectedActionTypes,
    itemData: item,
    itemChildren: children,
  } = useContext(DataContext);

  const allActions = filterActionsByActionTypes(actions, selectedActionTypes);
  const types = [...new Set(allActions.map((a) => a.type))];
  const groupedItems = groupByFirstLevelItems(allActions, item);
  const formattedItemsByAction = [];
  const allItems = item && children ? [...children, item] : [];
  for (const [currentPath, items] of Object.entries(groupedItems)) {
    const userActions: {
      name: string;
      total: number;
      [key: string]: string | number;
    } = {
      name: findItemNameByPath(currentPath, allItems),
      total: items.length,
    };
    const groupedActions = groupBy(items, (i) => i.type);
    for (const groupedAction of Object.entries(groupedActions)) {
      userActions[groupedAction[0]] = groupedAction[1].length;
    }
    formattedItemsByAction.push(userActions);
  }
  formattedItemsByAction.sort((a, b) => b.total - a.total);
  const title = t('MOST_INTERACTED_ITEMS_BY_ACTION', {
    nb: TOP_NUMBER_OF_ITEMS_TO_DISPLAY,
  });
  if (!formattedItemsByAction.length) {
    return <EmptyChart chartTitle={title} />;
  }

  const firstFormattedItemsByUser = formattedItemsByAction.slice(
    0,
    TOP_NUMBER_OF_ITEMS_TO_DISPLAY,
  );
  return (
    <>
      <ChartTitle title={title} />
      <ChartContainer>
        <ComposedChart data={firstFormattedItemsByUser}>
          <CartesianGrid strokeDasharray="2" />
          <XAxis interval={0} dataKey="name" tick={{ fontSize: 14 }} />
          <YAxis
            tick={{ fontSize: 14 }}
            orientation={direction === 'rtl' ? 'right' : 'left'}
          />
          <Tooltip
            formatter={(value, name: `${ActionTriggers}`) => [
              value,
              translateAction(name),
            ]}
          />
          {types.map((type) => (
            <Bar
              key=""
              dataKey={type}
              stackId="1"
              fill={getColorForActionTriggerType(type)}
            />
          ))}
        </ComposedChart>
      </ChartContainer>
    </>
  );
};

export default ItemsByActionChart;
