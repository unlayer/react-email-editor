import React from 'react';
import { render } from '@testing-library/react';
import EmailEditor, { EditorRef } from '../src';

// Resolve the embed script immediately instead of hitting the network.
vi.mock('../src/loadScript', () => ({
  loadScript: (callback: Function) => callback(),
}));

let mockEditor: {
  addEventListener: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  mockEditor = {
    addEventListener: vi.fn(),
    destroy: vi.fn(),
  };
  (globalThis as any).unlayer = {
    createEditor: vi.fn(() => mockEditor),
  };
});

it('renders the editor container', () => {
  render(<EmailEditor editorId="test-editor" />);

  expect(document.querySelector('#test-editor')).toBeTruthy();
});

it('creates the editor once the embed script has loaded', () => {
  render(<EmailEditor editorId="test-editor" />);

  const createEditor = (globalThis as any).unlayer.createEditor;
  expect(createEditor).toHaveBeenCalledTimes(1);
  expect(createEditor).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'test-editor',
      displayMode: 'email',
      source: expect.objectContaining({ name: 'react-email-editor' }),
    })
  );
});

it('exposes the editor instance through the ref and calls onLoad', () => {
  const ref = React.createRef<EditorRef>();
  const onLoad = vi.fn();

  render(<EmailEditor ref={ref} editorId="test-editor" onLoad={onLoad} />);

  expect(ref.current?.editor).toBe(mockEditor);
  expect(onLoad).toHaveBeenCalledWith(mockEditor);
});

it('registers on* props as editor event listeners and onReady on editor:ready', () => {
  const onReady = vi.fn();
  const onDesignUpdated = vi.fn();

  render(
    <EmailEditor
      editorId="test-editor"
      onReady={onReady}
      onDesignUpdated={onDesignUpdated}
    />
  );

  expect(mockEditor.addEventListener).toHaveBeenCalledWith(
    'onDesignUpdated',
    onDesignUpdated
  );
  expect(mockEditor.addEventListener).toHaveBeenCalledWith(
    'editor:ready',
    expect.any(Function)
  );
});

it('destroys the editor on unmount', () => {
  const { unmount } = render(<EmailEditor editorId="test-editor" />);

  expect(mockEditor.destroy).not.toHaveBeenCalled();
  unmount();
  expect(mockEditor.destroy).toHaveBeenCalledTimes(1);
});
