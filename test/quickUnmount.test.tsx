import React from 'react';
import { render, act } from '@testing-library/react';
import Editor from '../src';

let scriptLoadedCallback: Function;
jest.mock('../src/loadScript', () => ({
  loadScript: (callback: Function) => {
    scriptLoadedCallback = callback;
  },
}));

it('does not create the editor when unmounted before the embed script loads', () => {
  const createEditor = jest.fn();
  (global as any).unlayer = { createEditor };

  const { unmount } = render(<Editor editorId="quick-unmount-editor" />);
  unmount();

  // Embed script finishes loading after the component is gone.
  act(() => {
    scriptLoadedCallback();
  });

  expect(createEditor).not.toHaveBeenCalled();
});
