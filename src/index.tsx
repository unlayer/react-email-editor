import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';
import { Editor, EditorOptions, EditorRef } from 'types';

import pkg from '../package.json';
import { loadScript } from './loadScript';

type Props = {
  minHeight?: number;
  scriptUrl?: string;
  onReady?: Function;
  onLoad?: Function;
  editorId?: string;
  projectId?: number;
  options?: EditorOptions;
  tools?: object;
  locale?: string;
  appearance?: string;
  style?: React.CSSProperties;
};

let lastEditorId = 0;

const EmailEditor = (props: Props, ref: React.ForwardedRef<EditorRef>) => {
  const { onLoad, onReady, scriptUrl, minHeight = 500, style = {} } = props;

  const editorId = useRef(props.editorId || `editor-${++lastEditorId}`);
  const isLoadedRef = useRef(false);

  const [editor, setEditor] = useState<Editor | null>(null);

  const loadEditor = useCallback(() => {
    if (isLoadedRef.current) return;
    isLoadedRef.current = true;

    const options = props.options || {};

    if (props.projectId) options.projectId = props.projectId;
    if (props.tools) options.tools = props.tools;
    if (props.appearance) options.appearance = props.appearance;
    if (props.locale) options.locale = props.locale;

    setEditor(
      unlayer.createEditor({
        ...options,
        id: editorId.current,
        displayMode: 'email',
        source: {
          name: pkg.name,
          version: pkg.version,
        },
      })
    );
  }, [
    editorId.current,
    props.appearance,
    props.locale,
    props.options,
    props.projectId,
    props.tools,
  ]);

  const addEventListener = useCallback(
    (type: string, callback: Function) => {
      editor?.addEventListener(type, callback);
    },
    [editor]
  );

  const registerCallback = useCallback(
    (type: string, callback: Function) => {
      editor?.registerCallback(type, callback);
    },
    [editor]
  );

  const loadDesign = useCallback(
    (design: object) => {
      editor?.loadDesign(design);
    },
    [editor]
  );

  const saveDesign = useCallback(
    (callback: Function) => {
      editor?.saveDesign(callback);
    },
    [editor]
  );

  const exportHtml = useCallback(
    (callback: Function) => {
      editor?.exportHtml(callback);
    },
    [editor]
  );

  const setMergeTags = useCallback(
    (mergeTags: object) => {
      editor?.setMergeTags(mergeTags);
    },
    [editor]
  );

  useEffect(() => {
    loadScript(loadEditor, scriptUrl);
  }, [loadEditor, scriptUrl]);

  useEffect(() => {
    if (!editor) return;

    // All properties starting with on[Name] are registered as event listeners.
    for (const [key, value] of Object.entries(props)) {
      if (/^on/.test(key) && key !== 'onLoad' && key !== 'onReady') {
        addEventListener(key, value as Function);
      }
    }

    // @deprecated
    onLoad && onLoad();

    if (onReady) editor.addEventListener('editor:ready', onReady);
  }, [editor, addEventListener, onLoad, onReady, props]);

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
    [saveDesign, exportHtml, setMergeTags, editor, loadDesign, registerCallback]
  );

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        minHeight: minHeight,
      }}
    >
      <div id={editorId.current} style={{ ...style, flex: 1 }} />
    </div>
  );
};

export default React.forwardRef(EmailEditor);
