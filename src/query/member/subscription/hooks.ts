import { useQuery } from '@tanstack/react-query';

import {
  CARDS_KEY,
  CURRENT_CUSTOMER_KEY,
  PLANS_KEY,
  memberKeys,
} from '../../keys.js';
import { QueryClientConfig } from '../../types.js';
import * as Api from './api.js';

export default (queryConfig: QueryClientConfig) => {
  const { defaultQueryOptions: defaultOptions } = queryConfig;

  const usePlan = ({ planId }: { planId: string }) =>
    useQuery({
      queryKey: memberKeys.single().subscription(planId),
      queryFn: () => Api.getPlan({ planId }),
      ...defaultOptions,
    });

  const usePlans = () =>
    useQuery({
      queryKey: PLANS_KEY,
      queryFn: () => Api.getPlans(),
      ...defaultOptions,
    });

  const useOwnPlan = () =>
    useQuery({
      queryKey: memberKeys.current().subscription,
      queryFn: () => Api.getOwnPlan(),
      ...defaultOptions,
    });

  const useCards = () =>
    useQuery({
      queryKey: CARDS_KEY,
      queryFn: () => Api.getCards(),
      ...defaultOptions,
    });

  const useCurrentCustomer = () =>
    useQuery({
      queryKey: CURRENT_CUSTOMER_KEY,
      queryFn: () => Api.getCurrentCustomer(),
      ...defaultOptions,
    });

  return { usePlan, usePlans, useOwnPlan, useCards, useCurrentCustomer };
};
