import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';

import {
  AddEventListener,
  Editor,
  EmailEditorProps,
  EditorRef,
  ExportHtml,
  LoadBlank,
  LoadDesign,
  RegisterCallback,
  SaveDesign,
  SetMergeTags,
  ExportImage,
  RemoveEventListener,
} from './types';

import pkg from '../package.json';
import { loadScript } from './loadScript';

let lastEditorId = 0;

export const EmailEditor = React.forwardRef<EditorRef, EmailEditorProps>(
  (props, ref) => {
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

    const addEventListener = useCallback<AddEventListener>(
      (type, callback) => {
        editor?.addEventListener(type, callback);
      },
      [editor]
    );

    const removeEventListener = useCallback<RemoveEventListener>(
      (type, callback) => {
        editor?.removeEventListener(type, callback);
      },
      [editor]
    );

    const registerCallback = useCallback<RegisterCallback>(
      (type, callback) => {
        editor?.registerCallback(type as any, callback as any);
      },
      [editor]
    );

    const loadDesign = useCallback<LoadDesign>(
      (design) => {
        editor?.loadDesign(design);
      },
      [editor]
    );

    const saveDesign = useCallback<SaveDesign>(
      (callback) => {
        editor?.saveDesign(callback);
      },
      [editor]
    );

    const exportHtml = useCallback<ExportHtml>(
      (callback, options) => {
        editor?.exportHtml(callback, options);
      },
      [editor]
    );

    const exportImage = useCallback<ExportImage>(
      (callback) => {
        editor?.exportImage(callback);
      },
      [editor]
    );

    const setMergeTags = useCallback<SetMergeTags>(
      (mergeTags) => {
        editor?.setMergeTags(mergeTags);
      },
      [editor]
    );

    const loadBlank = useCallback<LoadBlank>(
      (options) => {
        editor?.loadBlank(options);
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
          addEventListener(key, value);
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
        addEventListener,
        loadBlank,
        exportImage,
        removeEventListener,
      }),
      [
        saveDesign,
        exportHtml,
        setMergeTags,
        editor,
        loadDesign,
        registerCallback,
        addEventListener,
        loadBlank,
        exportImage,
        removeEventListener,
      ]
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
  }
);
