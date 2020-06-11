import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

import Example from './example';

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

class Demo extends Component {
  render() {
    return (
      <React.Fragment>
        <GlobalStyle />

        <Example />
      </React.Fragment>
    );
  }
}

ReactDOM.render(<Demo />, document.querySelector('#demo'));
