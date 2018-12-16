import { applyMiddleware, compose, createStore } from 'redux';
import { GlobalState, rootReducer } from 'reducers/rootReducer';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { Action } from 'redux-actions';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers =
  (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore<GlobalState, Action<any>, ThunkMiddleware, any>(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
