import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';

import pkg from '../package.json';
import { loadScript } from './loadScript';

let lastEditorId = 0;

const Editor = (props, ref) => {
  const { minHeight = 500, style = {} } = props;

  const isLoaded = useRef(false);

  const [editor, setEditor] = useState(null);

  const editorId = props.editorId || `editor-${++lastEditorId}`;

  function addEventListener(type, callback) {
    editor.addEventListener(type, callback);
  }

  function loadEditor() {
    const { onLoad, onReady } = props;

    if (isLoaded.current) return;

    isLoaded.current = true;

    const options = props.options || {};

    if (props.projectId) options.projectId = props.projectId;

    if (props.tools) options.tools = props.tools;

    if (props.appearance) options.appearance = props.appearance;

    if (props.locale) options.locale = props.locale;

    const _editor = unlayer.createEditor({
      ...options,
      id: editorId,
      displayMode: 'email',
      source: {
        name: pkg.name,
        version: pkg.version,
      },
    });

    setEditor(_editor);

    // All properties starting with on[Name] are registered as event listeners.
    for (const [key, value] of Object.entries(props)) {
      if (/^on/.test(key) && key !== 'onLoad' && key !== 'onReady') {
        addEventListener(key, value);
      }
    }

    // @deprecated
    onLoad && onLoad();

    if (onReady) _editor.addEventListener('editor:ready', onReady);
  }

  const registerCallback = useCallback(
    (type, callback) => {
      editor.registerCallback(type, callback);
    },
    [editor]
  );

  const loadDesign = useCallback(
    (design) => {
      editor.loadDesign(design);
    },
    [editor]
  );

  const saveDesign = useCallback(
    (callback) => {
      editor.saveDesign(callback);
    },
    [editor]
  );

  const exportHtml = useCallback(
    (callback) => {
      editor.exportHtml(callback);
    },
    [editor]
  );

  const setMergeTags = useCallback(
    (mergeTags) => {
      editor.setMergeTags(mergeTags);
    },
    [editor]
  );

  useEffect(() => {
    loadScript(loadEditor, props.scriptUrl);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      saveDesign,
      exportHtml,
      setMergeTags,
      editor,
      loadDesign,
      registerCallback,
    }),
    [editor]
  );

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        minHeight: minHeight,
      }}
    >
      <div id={editorId} style={{ ...style, flex: 1 }} />
    </div>
  );
};

export default React.forwardRef(Editor);
