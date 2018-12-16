import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {MainPage} from "containers/MainPage/MainPage";
import { ListsPage } from 'containers/ListsPage/ListsPage';
import { createGlobalStyle } from 'styled-components';

export const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/lists/">Lists</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={MainPage} />
      <Route path="/lists/" component={ListsPage} />
    </div>
  </Router>
);

