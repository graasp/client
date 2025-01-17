import { CCIconsProps } from './CCIconsProps.js';

const Nd = ({ size }: CCIconsProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlSpace="preserve"
  >
    <circle fill="#FFF" cx={32.064} cy={31.788} r={29.013} />
    <path d="M31.944 0c8.952 0 16.533 3.105 22.744 9.314C60.895 15.486 64 23.046 64 32s-3.049 16.457-9.146 22.514C48.418 60.838 40.78 64 31.943 64c-8.65 0-16.153-3.143-22.514-9.43C3.144 48.286 0 40.762 0 32.001c0-8.724 3.144-16.285 9.43-22.685C15.64 3.106 23.144 0 31.943 0zm.117 5.771c-7.276 0-13.43 2.57-18.459 7.715-5.22 5.297-7.83 11.468-7.83 18.514 0 7.125 2.59 13.257 7.771 18.4 5.181 5.182 11.352 7.77 18.516 7.77 7.123 0 13.332-2.607 18.627-7.827 5.028-4.876 7.543-10.99 7.543-18.343 0-7.313-2.554-13.484-7.657-18.514-5.067-5.144-11.238-7.715-18.511-7.715zm12.056 18.685v5.485H20.86v-5.485h23.257zm0 10.287v5.482H20.86v-5.482h23.257z" />
  </svg>
);
export default Nd;
