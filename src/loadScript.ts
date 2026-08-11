const defaultScriptUrl = 'https://editor.unlayer.com/embed.js?2';
const callbacks: Function[] = [];
let loaded = false;

const findScript = (scriptUrl: string): HTMLScriptElement | null => {
  const scripts = document.querySelectorAll<HTMLScriptElement>('script');
  let found: HTMLScriptElement | null = null;

  scripts.forEach((script) => {
    if (script.src.includes(scriptUrl)) {
      found = script;
    }
  });

  return found;
};

// The embed is usable once the global `unlayer` object exists. This is a more
// reliable signal than our own onload handler, which never runs when the
// script was injected by something other than this module.
const isEmbedReady = () => loaded || typeof unlayer !== 'undefined';

const addCallback = (callback: Function) => {
  callbacks.push(callback);
};

const runCallbacks = () => {
  if (isEmbedReady()) {
    loaded = true;

    let callback;

    while ((callback = callbacks.shift())) {
      callback();
    }
  }
};

export const loadScript = (
  callback: Function,
  scriptUrl = defaultScriptUrl
) => {
  addCallback(callback);

  const existingScript = findScript(scriptUrl);

  if (!existingScript) {
    const embedScript = document.createElement('script');
    embedScript.setAttribute('src', scriptUrl);
    embedScript.onload = () => {
      loaded = true;
      runCallbacks();
    };
    document.head.appendChild(embedScript);
    return;
  }

  // The embed script tag is already on the page -- from a previous mount, a
  // preload in the HTML, or a parent application. If the embed has finished
  // initializing, run queued callbacks now; otherwise wait for the existing
  // element to finish loading (our own onload above never ran for it).
  if (isEmbedReady()) {
    runCallbacks();
  } else {
    existingScript.addEventListener('load', () => {
      loaded = true;
      runCallbacks();
    });
  }
};
