import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

const DesignList = () => {
  const match = useRouteMatch();

  return (
    <div>
      <h1>My Designs</h1>

      <p>
        <Link to={`${match.url}/new`}>New Design</Link>
      </p>
    </div>
  );
};

export default DesignList;
