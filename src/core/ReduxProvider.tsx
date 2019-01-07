import * as React from 'react';
import { store } from 'src/core/Store';
import { Provider } from 'react-redux';

export const ReduxProvider: React.FunctionComponent = props => (
  <Provider store={store}>{props.children}</Provider>
);
