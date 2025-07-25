import itemMutations from '../item/mutations.js';
import itemTagMutations from '../item/tag/mutations.js';
import memberMutations from '../member/mutations.js';
import publicProfileMutations from '../member/publicProfile/mutations.js';
import { QueryClientConfig } from '../types.js';
import csvUserImportMutations from './csvUserImport.js';
import etherpadMutations from './etherpad.js';
import invitationMutations from './invitation.js';
import itemExportMutations from './itemExport.js';
import itemGeolocationMutations from './itemGeolocation.js';
import itemLoginMutations from './itemLogin.js';
import itemPublishMutations from './itemPublish.js';
import itemValidationMutations from './itemValidation.js';
import visibilitiesMutations from './itemVisibility.js';
import mentionMutations from './mention.js';
import shortLinksMutations from './shortLink.js';

const configureMutations = (queryConfig: QueryClientConfig) => ({
  ...csvUserImportMutations(queryConfig),
  ...etherpadMutations(queryConfig),
  ...invitationMutations(queryConfig),
  ...itemExportMutations(queryConfig),
  ...itemGeolocationMutations(queryConfig),
  ...itemLoginMutations(queryConfig),
  ...itemMutations(queryConfig),
  ...itemPublishMutations(queryConfig),
  ...itemValidationMutations(queryConfig),
  ...memberMutations(queryConfig),
  ...mentionMutations(queryConfig),
  ...publicProfileMutations(queryConfig),
  ...shortLinksMutations(queryConfig),
  ...visibilitiesMutations(queryConfig),
  ...itemTagMutations(queryConfig),
});

export default configureMutations;
