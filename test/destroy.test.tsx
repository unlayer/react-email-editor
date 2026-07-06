import React from 'react';
import { render } from '@testing-library/react';
import Editor from '../src';

jest.mock('../src/loadScript', () => ({
  loadScript: (callback: Function) => callback(),
}));

it('destroys the editor on unmount', () => {
  const destroy = jest.fn();
  (global as any).unlayer = {
    createEditor: jest.fn(() => ({
      destroy,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  };

  const { unmount } = render(<Editor editorId="destroy-test-editor" />);
  unmount();

  expect(destroy).toHaveBeenCalledTimes(1);
});
