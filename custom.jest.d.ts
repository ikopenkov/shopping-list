import * as mockFetch from 'jest-fetch-mock';
import { FetchMock } from 'jest-fetch-mock';

declare global {
  namespace NodeJS {
    interface Global {
      fetch: FetchMock;
    }
  }
  type JFM1 = typeof mockFetch;
  export interface JFM extends JFM1, jest.MockInstance<any> {}
}
