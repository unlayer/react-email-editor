import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import EmailEditor from '../src';

// Resolve the embed script synchronously and stub the editor instance so the
// mount effects run without hitting the network.
vi.mock('../src/loadScript', () => ({
  loadScript: (callback: Function) => callback(),
}));

// Raw react-dom (not @testing-library) is used here to control the SSR ->
// hydrate boundary, so opt in to act() support explicitly.
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  (globalThis as any).unlayer = {
    createEditor: vi.fn(() => ({
      addEventListener: vi.fn(),
      destroy: vi.fn(),
    })),
  };
});

const editorIdIn = (root: ParentNode) =>
  root.querySelector<HTMLElement>('[id^="editor-"]')?.id;

const parseId = (html: string) => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return editorIdIn(el);
};

it('derives the auto id from tree position, so repeat renders agree', () => {
  // The old module-level counter produced a different id on every render
  // (editor-1, editor-2, ...). Two independent renders of the same tree must
  // now produce the same id, which is what makes server and client agree.
  const first = renderToString(<EmailEditor />);
  const second = renderToString(<EmailEditor />);

  expect(parseId(first)).toBeTruthy();
  expect(parseId(first)).toBe(parseId(second));
});

it('hydrates a server-rendered editor without an id mismatch', () => {
  const serverHtml = renderToString(<EmailEditor />);
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.innerHTML = serverHtml;

  const serverId = editorIdIn(container);
  expect(serverId).toBeTruthy();

  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  act(() => {
    hydrateRoot(container, <EmailEditor />);
  });

  // Same id after hydration, and React logged no hydration-mismatch warning.
  expect(editorIdIn(container)).toBe(serverId);
  const hydrationWarning = errorSpy.mock.calls.some((args) =>
    args.some((a) => typeof a === 'string' && /hydrat|did not match/i.test(a))
  );
  expect(hydrationWarning).toBe(false);

  errorSpy.mockRestore();
  document.body.removeChild(container);
});
