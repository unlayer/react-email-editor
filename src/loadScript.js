const scriptUrl = '//editor.unlayer.com/embed.js?2';
const callbacks = [];
let loaded = false;

const isScriptInjected = () => {
  const scripts = document.querySelectorAll('script');
  let injected = false;

  scripts.forEach((script) => {
    if (script.src.includes(scriptUrl)) {
      injected = true;
    }
  });

  return injected;
};

const addCallback = (callback) => {
  callbacks.push(callback);
};

const runCallbacks = () => {
  if (loaded) {
    let callback;

    while ((callback = callbacks.shift())) {
      callback();
    }
  }
};

export const loadScript = (callback) => {
  addCallback(callback);

  if (!isScriptInjected()) {
    const embedScript = document.createElement('script');
    embedScript.setAttribute('src', scriptUrl);
    embedScript.onload = () => {
      loaded = true;
      runCallbacks();
    };
    document.head.appendChild(embedScript);
  } else {
    runCallbacks();
  }
};
