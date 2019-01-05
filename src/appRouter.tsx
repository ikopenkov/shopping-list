import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {MainPage} from "containers/MainPage/MainPage";
import { ListsPage } from 'containers/ListsPage/ListsPage';
import { ListPage } from 'containers/ListPage/ListPage';

export const AppRouter = () => (
  <Router>
    <React.Fragment>
      <Route path="/" exact component={MainPage} />
      <Route path="/lists/:id" exact component={ListPage} />
      <Route path="/lists/" exact component={ListsPage} />
    </React.Fragment>
  </Router>
);

