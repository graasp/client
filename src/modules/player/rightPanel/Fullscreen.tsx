import * as React from 'react';
import { useEffect, useRef } from 'react';

// const key = {
//   fullscreenEnabled: 0,
//   fullscreenElement: 1,
//   requestFullscreen: 2,
//   exitFullscreen: 3,
//   fullscreenchange: 4,
//   fullscreenerror: 5,
// };

// const methods = {
//   fullscreenEnabled: {
//     chrome: 'fullscreenEnabled',
//     webkit: 'webkitFullscreenEnabled',
//     moz: 'mozFullScreenEnabled',
//     ms: 'msFullscreenEnabled',
//   },
//   fullscreenElement: {
//     chrome: 'fullscreenElement',
//     webkit: 'webkitFullscreenElement',
//     moz: 'mozFullScreenElement',
//     ms: 'msFullscreenElement',
//   },
//   requestFullscreen: {
//     chrome: 'requestFullscreen',
//     webkit: 'requestFullscreen',
//     moz: 'mozRequestFullScreen',
//     ms: 'msRequestFullscreen',
//   },
//   exitFullscreen: {
//     chrome: 'exitFullscreen',
//     webkit: 'webkitExitFullscreen',
//     moz: 'mozCancelFullScreen',
//     ms: 'msExitFullscreen',
//   },
//   fullscreenchange: {
//     chrome: 'fullscreenchange',
//     webkit: 'webkitfullscreenchange',
//     moz: 'mozfullscreenchange',
//     ms: 'MSFullscreenChange',
//   },
//   fullscreenerror: {
//     chrome: 'fullscreenerror',
//     webkit: 'webkitfullscreenerror',
//     moz: 'mozfullscreenerror',
//     ms: 'MSFullscreenError',
//   },
// } as const;

// const webkit = [
//   'webkitFullscreenEnabled',
//   'webkitFullscreenElement',
//   'webkitRequestFullscreen',
//   'webkitExitFullscreen',
//   'webkitfullscreenchange',
//   'webkitfullscreenerror',
// ] as const;

// const moz = [
//   'mozFullScreenEnabled',
//   'mozFullScreenElement',
//   'mozRequestFullScreen',
//   'mozCancelFullScreen',
//   'mozfullscreenchange',
//   'mozfullscreenerror',
// ] as const;

// const ms = [
//   'msFullscreenEnabled',
//   'msFullscreenElement',
//   'msRequestFullscreen',
//   'msExitFullscreen',
//   'MSFullscreenChange',
//   'MSFullscreenError',
// ] as const;

// // so it doesn't throw if no window or document
// const document =
//   typeof window !== 'undefined' && typeof window.document !== 'undefined'
//     ? window.document
//     : null;

// const vendor =
//   ('fullscreenEnabled' in document && 'chrome') ||
//   (webkit[0] in document && 'webkit') ||
//   (moz[0] in document && 'moz') ||
//   (ms[0] in document && 'ms') ||
//   'chrome';

// class fscreen {
//   static requestFullscreen(element: HTMLElement) {
//     return element.requestFullscreen();
//   }
//   static requestFullscreenFunction(element: HTMLElement) {
//     return element.requestFullscreen;
//   }
//   static get exitFullscreen() {
//     return document[vendor[key.exitFullscreen]].bind(document);
//   }
//   static addEventListener(type, handler, options) {
//     return document.addEventListener(vendor[key[type]], handler, options);
//   }
//   static removeEventListener(type, handler, options) {
//     return document.removeEventListener(vendor[key[type]], handler, options);
//   }
//   static get fullscreenEnabled() {
//     return Boolean(document[vendor[key.fullscreenEnabled]]);
//   }
//   static set fullscreenEnabled(val) {}
//   static get fullscreenElement() {
//     return document[vendor[key.fullscreenElement]];
//   }
//   static set fullscreenElement(val) {}
//   static get onfullscreenchange() {
//     return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()];
//   }
//   static set onfullscreenchange(handler) {
//     document[`on${vendor[key.fullscreenchange]}`.toLowerCase()] = handler;
//   }
//   static get onfullscreenerror() {
//     return document[`on${vendor[key.fullscreenerror]}`.toLowerCase()];
//   }
//   static set onfullscreenerror(handler) {
//     document[`on${vendor[key.fullscreenerror]}`.toLowerCase()] = handler;
//   }
// }

// export type IFullScreenProps = {
//   onClose?: () => void;
//   onOpen?: () => void;
//   onChange?: (state: boolean) => void;
//   enabled?: boolean;
// };

// /**
//  *  The returned value indicates whether fullscreen mode is supported by the browser or not.
//  *  If the value is true, it means fullscreen is enabled and supported.
//  *  If the value is false, it means fullscreen is not enabled or supported.
//  */
// export const getFullScreenEnabled = () => {
//   // It returns the value of the fullscreenEnabled property from the fscreen object.
//   return fscreen.fullscreenEnabled;
// };

// export default class FullScreenClass extends React.Component<
//   React.PropsWithChildren<IFullScreenProps>,
//   never
// > {
//   static defaultProps = {
//     enabled: false,
//   };
//   node: React.ReactNode;

//   constructor(props: IFullScreenProps) {
//     super(props);
//   }

//   componentDidMount() {
//     fscreen.addEventListener('fullscreenchange', this.detectFullScreen, {});
//   }

//   componentWillUnmount() {
//     fscreen.removeEventListener('fullscreenchange', this.detectFullScreen, {});
//   }

//   componentDidUpdate() {
//     this.handleProps(this.props);
//   }

//   handleProps(props: IFullScreenProps) {
//     const enabled = fscreen.fullscreenElement;
//     if (enabled && !props.enabled) {
//       this.leaveFullScreen();
//     } else if (!enabled && props.enabled) {
//       this.enterFullScreen();
//     }
//   }

//   detectFullScreen = () => {
//     if (this.props.onChange) {
//       this.props.onChange(!!fscreen.fullscreenElement);
//     }
//     if (this.props.onOpen && !!fscreen.fullscreenElement) {
//       this.props.onOpen();
//     }
//     if (this.props.onClose && !fscreen.fullscreenElement) {
//       this.props.onClose();
//     }
//   };

//   enterFullScreen = () => {
//     fscreen.requestFullscreen(this.node);
//   };

//   leaveFullScreen = () => {
//     fscreen.exitFullscreen();
//   };

//   render() {
//     return (
//       <div
//         className="FullScreen"
//         ref={(node) => (this.node = node)}
//         style={{ height: '100%', width: '100%' }}
//       >
//         {this.props.children}
//       </div>
//     );
//   }
// }

export function Fullscreen({
  children,
  isEnabled,
}: {
  children: React.ReactNode;
  isEnabled?: boolean;
}) {
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (node.current) {
      if (isEnabled) {
        node.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        document?.exitFullscreen();
      }
    }
  }, [node, isEnabled]);

  // useEffect(() => {
  //   document?.addEventListener('fullscreenchange', detectFullScreen);
  //   return () => {
  //     document?.removeEventListener('fullscreenchange', detectFullScreen);
  //   };
  // }, []);

  return (
    <div
      className="FullScreen"
      ref={node}
      style={{ height: '100%', width: '100%' }}
    >
      {children}
    </div>
  );
}
