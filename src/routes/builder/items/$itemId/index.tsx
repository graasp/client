import type { JSX } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import ItemContent from '~builder/components/item/ItemContent';
import ItemMain from '~builder/components/item/ItemMain';

export const Route = createFileRoute('/builder/items/$itemId/')({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return (
    <ItemMain>
      <ItemContent />
    </ItemMain>
  );
}
