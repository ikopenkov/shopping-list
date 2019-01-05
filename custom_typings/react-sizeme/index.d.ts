declare module 'react-sizeme' {
  import { InferableComponentEnhancerWithProps } from 'react-redux';

  function withSize<OwnProps = {}>(params: {
    monitorWidth?: boolean;
    monitorHeight?: boolean;
    refreshRate?: number;
    refreshMode?: 'throttle' | 'debounce';
    noPlaceholder?: boolean;
  }): InferableComponentEnhancerWithProps<
    {
      size: {
        width: number;
        height: number;
      };
    } & OwnProps,
    OwnProps
  >;

  export { withSize };
}
