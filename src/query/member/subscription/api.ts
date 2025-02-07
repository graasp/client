import axios from 'axios';

import { API_HOST } from '@/config/env.js';
import { verifyAuthentication } from '@/query/api/axios.js';

import {
  CREATE_SETUP_INTENT_ROUTE,
  GET_CARDS_ROUTE,
  GET_CURRENT_CUSTOMER,
  GET_OWN_PLAN_ROUTE,
  GET_PLANS_ROUTE,
  buildChangePlanRoute,
  buildGetPlanRoute,
  buildSetDefaultCardRoute,
} from '../routes.js';

export const getPlan = async ({ planId }: { planId: string }) =>
  verifyAuthentication(() =>
    axios
      .get(`${API_HOST}/${buildGetPlanRoute(planId)}`)
      .then(({ data }) => data),
  );

export const getPlans = async () =>
  verifyAuthentication(() =>
    axios.get(`${API_HOST}/${GET_PLANS_ROUTE}`).then(({ data }) => data),
  );

export const getOwnPlan = async () =>
  verifyAuthentication(() =>
    axios.get(`${API_HOST}/${GET_OWN_PLAN_ROUTE}`).then(({ data }) => data),
  );

// payload: planId
export const changePlan = async ({
  planId,
  cardId,
}: {
  planId: string;
  cardId?: string;
}) =>
  verifyAuthentication(() =>
    axios
      .patch(`${API_HOST}/${buildChangePlanRoute(planId)}`, { cardId })
      .then(({ data }) => data),
  );

export const getCards = async () =>
  verifyAuthentication(() =>
    axios.get(`${API_HOST}/${GET_CARDS_ROUTE}`).then(({ data }) => data),
  );

export const setDefaultCard = async ({ cardId }: { cardId: string }) =>
  verifyAuthentication(() =>
    axios
      .patch(`${API_HOST}/${buildSetDefaultCardRoute(cardId)}`)
      .then(({ data }) => data),
  );

export const createSetupIntent = async () =>
  verifyAuthentication(() =>
    axios
      .post(`${API_HOST}/${CREATE_SETUP_INTENT_ROUTE}`)
      .then(({ data }) => data),
  );

export const getCurrentCustomer = async () =>
  verifyAuthentication(() =>
    axios.get(`${API_HOST}/${GET_CURRENT_CUSTOMER}`).then(({ data }) => data),
  );
