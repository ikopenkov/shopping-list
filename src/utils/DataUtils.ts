import * as RA from 'ramda-adjunct';

function cloneNotDeep<T>(some: T): T {
  switch (true) {
    case RA.isArray(some):
      // @ts-ignore
      return [...some];
    case RA.isObject(some):
      // @ts-ignore
      return { ...some };
    default:
      return some;
  }
}

export const DataUtils = {
  cloneNotDeep,
};
