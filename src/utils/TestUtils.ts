import { applyMiddleware, compose, createStore } from 'redux';
import { GlobalState, rootReducer } from 'reducers/rootReducer';
import thunk from 'redux-thunk';
import { Action } from 'redux-actions';

export const mockStore = (initialState: GlobalState = { modules: {} }) => {
  const store = createStore<GlobalState, Action<any>, any, any>(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunk)),
  );
  return store;
};

const mockFetch = (
  response: Object | Object[],
  params: { status: number } = { status: 200 },
) => {
  if (Array.isArray(response)) {
    console.log(response);
    const responses = response.map(res => [JSON.stringify(res), params]);
    // @ts-ignore
    global.fetch.mockResponses(...responses);
  } else {
    global.fetch.once(JSON.stringify(response), params);
  }
};
export const TestUtils = {
  mockFetch,
  mockStore,
};
