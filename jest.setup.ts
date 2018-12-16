import 'whatwg-fetch';
import * as fetchMock from 'jest-fetch-mock';
//@ts-ignore
global.fetch = (fetchMock as JFM);
