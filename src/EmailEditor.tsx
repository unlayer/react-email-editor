import React, {
  useEffect,
  useState,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import type { DisplayMode, UnlayerEditor } from '@unlayer/types';

import pkg from '../package.json';
import { EditorRef, EmailEditorProps } from './types';
import { loadScript } from './loadScript';

const win = typeof window === 'undefined' ? { __unlayer_lastEditorId: 0 } : window
win.__unlayer_lastEditorId = win.__unlayer_lastEditorId || 0;

function EmailEditorInner<TDisplayMode extends DisplayMode | undefined = 'email'>(
  props: EmailEditorProps<TDisplayMode>,
  ref: React.Ref<EditorRef<TDisplayMode>>,
) {
    const { onLoad, onReady, scriptUrl, minHeight = 500, style = {} } = props;

    const [editor, setEditor] = useState<UnlayerEditor<TDisplayMode> | null>(null);

    const [hasLoadedEmbedScript, setHasLoadedEmbedScript] = useState(false);

    const editorId = useMemo(
      () => props.editorId || `editor-${++win.__unlayer_lastEditorId}`,
      [props.editorId]
    );

    const options = {
      ...(props.options || {}),
      appearance: props.appearance ?? props.options?.appearance,
      displayMode: props?.displayMode || props.options?.displayMode || 'email' as const,
      locale: props.locale ?? props.options?.locale,
      projectId: props.projectId ?? props.options?.projectId,
      tools: props.tools ?? props.options?.tools,

      id: editorId,
      source: {
        name: pkg.name,
        version: pkg.version,
      },
    };

    useImperativeHandle(
      ref,
      () => ({
        editor,
      }),
      [editor]
    );

    // Keep a ref to the latest editor so the unmount cleanup below doesn't
    // capture the initial (null) state.
    const editorRef = useRef(editor);
    editorRef.current = editor;

    useEffect(() => {
      return () => {
        editorRef.current?.destroy();
      };
    }, []);

    useEffect(() => {
      setHasLoadedEmbedScript(false);
      loadScript(() => setHasLoadedEmbedScript(true), scriptUrl);
    }, [scriptUrl]);

    useEffect(() => {
      if (!hasLoadedEmbedScript) return;
      editor?.destroy();
      setEditor(unlayer.createEditor(options));
    }, [JSON.stringify(options), hasLoadedEmbedScript]);

    const methodProps = Object.keys(props).filter((propName) =>
      /^on/.test(propName)
    );
    useEffect(() => {
      if (!editor) return;

      onLoad?.(editor);

      // All properties starting with on[Name] are registered as event listeners.
      methodProps.forEach((methodProp) => {
        if (
          /^on/.test(methodProp) &&
          methodProp !== 'onLoad' &&
          methodProp !== 'onReady' &&
          typeof props[methodProp] === 'function'
        ) {
          editor.addEventListener(methodProp, props[methodProp]);
        }
      });

      if (onReady) {
        editor.addEventListener('editor:ready', () => {
          onReady(editor);
        });
      }
    }, [editor, methodProps.join(',')]);

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
}

export const EmailEditor = React.forwardRef(EmailEditorInner) as <
  TDisplayMode extends DisplayMode | undefined = 'email',
>(
  props: EmailEditorProps<TDisplayMode> & React.RefAttributes<EditorRef<TDisplayMode>>,
) => React.ReactElement | null;
