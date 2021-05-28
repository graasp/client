import { QueryClient } from 'react-query';
import itemMutations from './item';
import memberMutations from './member';
import tagsMutations from './itemTag';
import { QueryClientConfig } from '../types';

const configureMutations = (
  queryClient: QueryClient,
  queryConfig: QueryClientConfig,
) => {
  itemMutations(queryClient, queryConfig);
  memberMutations(queryClient, queryConfig);
  tagsMutations(queryClient, queryConfig);
};

export default configureMutations;
