import React from 'react';
import { Link } from 'react-router-dom';

const DesignList = () => {
  return (
    <div>
      <h1>My Designs</h1>

      <p>
        <Link to={`/dashboard/design/new`}>New Design</Link>
      </p>
    </div>
  );
};

export default DesignList;
