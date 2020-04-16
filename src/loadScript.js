const callbacks = [];

const runCallbacks = () => {
  let callback;

  while ((callback = callbacks.shift())) {
    callback();
  }
};

const registerCallback = (callback) => {
  callbacks.push(callback);
};

export const loadScript = (callback) => {
  const embedJs = '//editor.unlayer.com/embed.js?2';
  const scripts = document.querySelectorAll('script');
  let scriptLoaded = false;

  scripts.forEach((script) => {
    if (script.src.includes(embedJs)) {
      scriptLoaded = true;
    }
  });

  registerCallback(callback);

  if (!scriptLoaded) {
    const unlayerScript = document.createElement('script');
    unlayerScript.setAttribute('src', embedJs);
    unlayerScript.onload = () => {
      runCallbacks();
    };
    document.head.appendChild(unlayerScript);
  } else {
    runCallbacks();
  }
};
