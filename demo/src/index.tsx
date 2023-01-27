import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Example from './example';
import Dashboard from './dashboard';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }

  #demo {
    height: 100%;
  }
`;

const Demo = () => {
  return (
    <Router>
      <GlobalStyle />

      <Switch>
        <Route path={`/`} exact={true}>
          <Example />
        </Route>

        <Route path={`/dashboard`}>
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Demo />, document.querySelector('#demo'));
