import { loadScript } from '../src/loadScript';

const scriptUrl = 'https://example.com/test-embed.js';

const getScript = () =>
  document.querySelector(`script[src="${scriptUrl}"]`) as HTMLScriptElement | null;

it('removes a failed script tag so a later call can retry', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const callback = jest.fn();

  loadScript(callback, scriptUrl);
  const firstScript = getScript();
  expect(firstScript).toBeTruthy();

  // Simulate a network failure loading the embed script.
  firstScript!.dispatchEvent(new Event('error'));

  expect(getScript()).toBeNull();
  expect(callback).not.toHaveBeenCalled();

  // A subsequent call (e.g. a remount) injects the script again.
  loadScript(callback, scriptUrl);
  const secondScript = getScript();
  expect(secondScript).toBeTruthy();

  secondScript!.dispatchEvent(new Event('load'));

  // Both queued callbacks run once the script finally loads.
  expect(callback).toHaveBeenCalledTimes(2);
});
