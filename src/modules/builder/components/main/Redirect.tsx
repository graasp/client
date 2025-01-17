import { useEffect } from 'react';

import { redirectToSavedUrl } from '@graasp/sdk';

import RedirectionContent from '@/ui/Authorization/RedirectionContent';

import { HOME_PATH } from '../../paths';

const Redirect = (): JSX.Element => {
  useEffect(() => {
    redirectToSavedUrl(window, HOME_PATH);
  }, []);

  return <RedirectionContent link={HOME_PATH} />;
};

export default Redirect;
