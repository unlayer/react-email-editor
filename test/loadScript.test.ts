import { loadScript } from '../src/loadScript';

// Note: loadScript keeps module-level state (callback queue, loaded flag),
// so these tests build on each other in order.

const embedScripts = () =>
  document.querySelectorAll<HTMLScriptElement>(
    'script[src*="editor.unlayer.com"]'
  );

it('injects the embed script once and queues callbacks until it loads', () => {
  const first = vi.fn();
  const second = vi.fn();

  loadScript(first);
  loadScript(second);

  expect(embedScripts().length).toBe(1);
  expect(first).not.toHaveBeenCalled();
  expect(second).not.toHaveBeenCalled();

  embedScripts()[0].onload!(new Event('load'));

  expect(first).toHaveBeenCalledTimes(1);
  expect(second).toHaveBeenCalledTimes(1);
});

it('runs the callback immediately once the script is already loaded', () => {
  const callback = vi.fn();

  loadScript(callback);

  expect(embedScripts().length).toBe(1);
  expect(callback).toHaveBeenCalledTimes(1);
});

it('injects a separate script tag for a custom scriptUrl', () => {
  loadScript(vi.fn(), 'https://example.com/custom-embed.js');

  expect(
    document.querySelectorAll('script[src*="example.com/custom-embed"]').length
  ).toBe(1);
});

// These build a fresh module (resetting the `loaded` flag and callback queue)
// so they can exercise the case where the embed script is already on the page
// but was NOT injected by loadScript -- so its onload handler was never ours.
describe('when the embed script is already present on the page', () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = '';
    delete (globalThis as any).unlayer;
  });

  afterEach(() => {
    delete (globalThis as any).unlayer;
  });

  it('runs queued callbacks once a pre-existing script finishes loading', async () => {
    const preloaded = document.createElement('script');
    preloaded.src = 'https://editor.unlayer.com/embed.js?2';
    document.head.appendChild(preloaded);

    const { loadScript: freshLoadScript } = await import('../src/loadScript');
    const callback = vi.fn();

    freshLoadScript(callback);

    // Embed not ready yet: global `unlayer` is undefined and the script we
    // did not inject has not loaded.
    expect(callback).not.toHaveBeenCalled();
    expect(embedScripts().length).toBe(1); // no duplicate script injected

    preloaded.dispatchEvent(new Event('load'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('runs callbacks immediately when the embed is already initialized', async () => {
    const preloaded = document.createElement('script');
    preloaded.src = 'https://editor.unlayer.com/embed.js?2';
    document.head.appendChild(preloaded);
    (globalThis as any).unlayer = {}; // embed already loaded before we mounted

    const { loadScript: freshLoadScript } = await import('../src/loadScript');
    const callback = vi.fn();

    freshLoadScript(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
