import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppRouter } from './appRouter';
import { store } from 'src/store';
import { createGlobalStyle } from 'styled-components';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { Colors } from 'src/constants/Colors';

const reactContainer = document.createElement('div');
reactContainer.className = 'app';
document.body.appendChild(reactContainer);

const GlobalStyle = createGlobalStyle`
  html {
     height: 100%;
  }

  body {
    font-size: 14px;
    margin: 0;
    height: 100%;
  }
  
  * {
    box-sizing: border-box;
    word-break: break-word;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  }
  
  .app {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const theme = createMuiTheme({
  palette: {
    primary: { main: Colors.primaryBg, contrastText: Colors.white },
    secondary: {
      main: Colors.dangerBgLight,
      contrastText: Colors.white
    },
    error: {
      main: Colors.dangerBg,
      contrastText: Colors.white
    },
    
  },
  typography: { useNextVariants: true },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <GlobalStyle />
      <AppRouter />
    </MuiThemeProvider>
  </Provider>,
  reactContainer,
);
