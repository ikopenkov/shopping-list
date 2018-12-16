import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppRouter } from './appRouter';
import { store } from 'src/store';
import { createGlobalStyle } from 'styled-components';

const reactContainer = document.createElement('div');
reactContainer.className = 'app';
document.body.appendChild(reactContainer);

const GlobalStyle = createGlobalStyle`
  body {
    font-size: 14px;
    font-family: Arial;
    margin: 0;
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <GlobalStyle />
      <AppRouter />
    </React.Fragment>
  </Provider>,
  reactContainer,
);
