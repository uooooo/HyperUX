import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * The AppKit button web component. Registered globally by Reown AppKit.
       */
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export {};
