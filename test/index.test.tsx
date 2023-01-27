import React from 'react';
import { render } from '@testing-library/react';
import Editor from '../src';

it('should render editor without crashing', async () => {
  const ref = {
    current: null,
  };

  render(<Editor ref={ref} />);

  const container = document.querySelector('#editor-1');

  expect(container).toBeTruthy();
});
