import React, { Component } from 'react';
import styled from 'styled-components';

import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';

import DesignList from './DesignList';
import DesignEdit from './DesignEdit';

const Dashboard = (props) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={match.path} exact={true}>
        <DesignList />
      </Route>
      <Route path={`${match.path}/new`} exact={true}>
        <DesignEdit />
      </Route>
      <Route path={`${match.path}/edit/:designId`} exact={true}>
        <DesignEdit />
      </Route>
    </Switch>
  );
};

export default Dashboard;
