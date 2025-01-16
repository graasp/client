// import { useTranslation } from 'react-i18next';

// import { IconButton } from '@mui/material';

// import { AccountType } from '@graasp/sdk';

// import {
//   Link,
//   useLocation,
//   useParams,
//   useSearch,
// } from '@tanstack/react-router';
// import { ChevronRightIcon, Home } from 'lucide-react';

// import { NS } from '@/config/constants';
// import { hooks } from '@/config/queryClient';
// import {
//   NAVIGATION_HOME_ID,
//   NAVIGATION_ROOT_ID,
//   buildNavigationLink,
// } from '@/config/selectors';
// import Navigation from '@/ui/Navigation/Navigation';

// import { buildExtraItems } from './utils';

// const { useItem, useParents, useCurrentMember, useChildren } = hooks;

// const Navigator = (): JSX.Element | null => {
//   const searchParams = useSearch({ strict: false });
//   const { t: translateBuilder } = useTranslation(NS.Builder);
//   const { itemId } = useParams({ strict: false });
//   const { pathname } = useLocation();
//   const { data: currentMember } = useCurrentMember();
//   const { data: item, isLoading: isItemLoading } = useItem(itemId);

//   const { pathname: location } = useLocation();

//   const { data: parents, isLoading: areParentsLoading } = useParents({
//     id: itemId,
//   });

//   if (isItemLoading || areParentsLoading) {
//     return null;
//   }

//   const renderRoot = () => {
//     // no access to root if signed out
//     if (currentMember?.type !== AccountType.Individual) {
//       return null;
//     }

//     return (
//       <>
//         <Link to="/account" search={searchParams}>
//           <IconButton id={NAVIGATION_HOME_ID}>
//             <Home />
//           </IconButton>
//         </Link>
//         <ChevronRightIcon />
//       </>
//     );
//   };

//   if (item === undefined && pathname !== HOME_PATH) {
//     return null;
//   }

//   // const extraItems = buildExtraItems({
//   //   translate: translateBuilder,
//   //   location,
//   //   itemId,
//   // });

//   return (
//     <Navigation
//       id={NAVIGATION_ROOT_ID}
//       sx={{ paddingLeft: 2 }}
//       item={item}
//       buildToItemPath={`/builder/items/$itemId`}
//       parents={parents}
//       renderRoot={renderRoot}
//       buildMenuItemId={buildNavigationLink}
//       useChildren={useChildren as any}
//       // extraItems={extraItems}
//     />
//   );
// };

// export default Navigator;
