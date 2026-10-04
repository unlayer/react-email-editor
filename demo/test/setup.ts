import type {} from 'vitest/jsdom';

// Use browser storage from jsdom, not Node 25's native localStorage global.
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  writable: true,
  value: jsdom.window.localStorage,
});
