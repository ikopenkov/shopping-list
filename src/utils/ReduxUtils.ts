import { createStore, Action, applyMiddleware, AnyAction } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import { InferableComponentEnhancerWithProps } from 'react-redux';

export type TypeOfConnect<T> = T extends InferableComponentEnhancerWithProps<
  infer Props,
  infer _
>
  ? Props
  : never;

export type CutMiddleFunction<T> = T extends (
  ...arg: infer Args
) => (...args: any[]) => infer R
  ? (...arg: Args) => R
  : never;

export type GetFunctionResult<T> = T extends (
  ...arg: infer Args
) => infer R
  ? R
  : never;

export const unboxThunk = <Args extends any[], R, S, E, A extends Action<any>>(
  thunkFn: (...args: Args) => ThunkAction<R, S, E, A>,
) => (thunkFn as any) as CutMiddleFunction<typeof thunkFn>;
