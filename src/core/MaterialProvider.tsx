import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { Colors } from 'src/constants/Colors';

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
      contrastText: Colors.white,
    },
    error: {
      main: Colors.dangerBg,
      contrastText: Colors.white,
    },
  },
  typography: { useNextVariants: true },
});

export const MaterialProvider: React.FunctionComponent = props => (
  <MuiThemeProvider theme={theme}>
    <GlobalStyle />
    {props.children}
  </MuiThemeProvider>
);
