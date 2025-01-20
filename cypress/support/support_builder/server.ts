// export const mockGetItemMembershipsForItem = (
//   items: ItemForTest[],
//   currentMember: Member,
// ): void => {
//   cy.intercept(
//     {
//       method: HttpMethod.Get,
//       url: new RegExp(
//         `${API_HOST}/${parseStringToRegExp(
//           buildGetItemMembershipsForItemsRoute([]),
//         )}`,
//       ),
//     },
//     ({ reply, url }) => {
//       const itemId = new URL(url).searchParams.get('itemId');
//       const selectedItems = items.filter(({ id }) => itemId.includes(id));
//       // todo: use reduce
//       const result: {
//         data: {
//           [key: string]: ItemMembership[];
//         };
//         errors: { statusCode: number }[];
//       } = { data: {}, errors: [] };
//       selectedItems.forEach((item) => {
//         const { creator, id, memberships } = item;
//         // build default membership depending on current member
//         // if the current member is the creator, it has membership
//         // otherwise it should return an error
//         const isCreator = creator.id === currentMember?.id;

//         // if the defined memberships does not contain currentMember, it should throw
//         const currentMemberHasMembership = memberships?.find(
//           ({ account }) => account.id === currentMember?.id,
//         );
//         // no membership
//         if (!currentMemberHasMembership && !isCreator) {
//           result.errors.push({ statusCode: StatusCodes.UNAUTHORIZED });
//         }

//         // return defined memberships or default membership
//         result.data[id] = memberships || [
//           {
//             permission: PermissionLevel.Admin,
//             account: { ...creator, type: AccountType.Individual },
//             item,
//             id: v4(),
//             createdAt: '2021-08-11T12:56:36.834Z',
//             updatedAt: '2021-08-11T12:56:36.834Z',
//           },
//         ];
//       });
//       reply(result);
//     },
//   ).as('getItemMemberships');
// };
