import { JSX, MouseEventHandler } from 'react';

import { IconButton } from '@mui/material';

import ItemIcon from '@/ui/icons/ItemIcon';

import { PartialItemWithChildren } from './utils';

type Props = {
  element: PartialItemWithChildren;
  level: number;
  isExpanded: boolean;
  toggleExpand: (id: string) => void;
};

export function ExpandButton({
  element,
  level,
  isExpanded,
  toggleExpand,
}: Readonly<Props>): JSX.Element {
  const handleExpandClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    toggleExpand(element.id);
  };

  return (
    <>
      {/* icon type for root level items */}
      {level === 0 && element.metadata?.type && (
        <ItemIcon
          size="17px"
          alt="icon"
          type={element.metadata.type}
          mimetype={element.metadata.mimetype}
        />
      )}
      {level > 0 && (
        <IconButton
          onClick={handleExpandClick}
          sx={{
            p: 0,
            '&:hover': {
              opacity: 0.6,
            },
          }}
        >
          {/* lucid icons */}
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5050d2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5050d2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
            </svg>
          )}
        </IconButton>
      )}
    </>
  );
}
