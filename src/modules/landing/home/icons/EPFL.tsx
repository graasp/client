import type { JSX } from 'react';

export function Epfl({
  width,
  height,
}: Readonly<{
  width: string;
  height: string;
}>): JSX.Element {
  return (
    <svg
      version="1.1"
      id="Calque_1"
      style={{ maxHeight: height, maxWidth: width }}
      viewBox="-20 -15 220 83"
    >
      <style type="text/css">{`.stepfl{fill:#FF0000;}`}</style>
      <g>
        <polygon
          className="stepfl"
          points="0,21.6 11.4,21.6 11.4,9.8 38.3,9.8 38.3,0 0,0"
        />
        <polygon
          className="stepfl"
          points="0,53 38.3,53 38.3,43.2 11.4,43.2 11.4,31.4 0,31.4"
        />
        <rect x="11.4" y="21.6" className="stepfl" width="24.6" height="9.8" />
        <path
          className="stepfl"
          d="M86,4.9c-1.5-1.5-3.4-2.6-5.7-3.5C78,0.4,75.1,0,71.8,0H48.1v53h11.4V31.4h12.2c3.3,0,6.1-0.4,8.5-1.3
		c2.3-0.9,4.2-2.1,5.7-3.5c1.5-1.5,2.5-3.1,3.2-5s1-3.8,1-5.8s-0.3-4-1-5.8C88.5,8,87.4,6.3,86,4.9z M78,18.7
		c-0.6,0.8-1.3,1.4-2.3,1.8c-0.9,0.4-2,0.7-3.3,0.9c-1.2,0.1-2.5,0.2-3.9,0.2h-9.1V9.8h9.1c1.3,0,2.6,0.1,3.9,0.2
		c1.2,0.1,2.3,0.4,3.3,0.9c0.9,0.4,1.7,1,2.3,1.8c0.6,0.8,0.9,1.8,0.9,3S78.6,18,78,18.7z"
        />
        <polygon
          className="stepfl"
          points="155.5,43.2 155.5,0 144,0 144,53 182.4,53 182.4,43.2"
        />
        <polygon
          className="stepfl"
          points="97.4,21.6 108.9,21.6 108.9,9.8 135.8,9.8 135.8,0 97.4,0"
        />
        <rect x="97.4" y="31.4" className="stepfl" width="11.4" height="21.6" />
        <rect x="108.9" y="21.6" className="stepfl" width="24.6" height="9.8" />
      </g>
    </svg>
  );
}
