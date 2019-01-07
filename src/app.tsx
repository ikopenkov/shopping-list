import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter } from './core/AppRouter';
import { ReduxProvider } from 'src/core/ReduxProvider';
import { MaterialProvider } from 'src/core/MaterialProvider';

const reactContainer = document.createElement('div');
reactContainer.className = 'app';
document.body.appendChild(reactContainer);

ReactDOM.render(
  <ReduxProvider>
    <MaterialProvider>
      <AppRouter />
    </MaterialProvider>
  </ReduxProvider>,
  reactContainer,
);
