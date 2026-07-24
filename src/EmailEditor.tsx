import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
} from 'react';
import type { DisplayMode, UnlayerEditor } from '@unlayer/types';

// Named imports so only these fields are inlined into the bundle.
import { name as pkgName, version as pkgVersion } from '../package.json';
import { EditorRef, EmailEditorProps } from './types';
import { loadScript } from './loadScript';

const win =
  typeof window === 'undefined' ? { __unlayer_lastEditorId: 0 } : window;
win.__unlayer_lastEditorId = win.__unlayer_lastEditorId || 0;

// Legacy fallback for React 16.8/17, which have no useId. Not hydration-safe,
// but those versions predate the modern SSR story. Exercised only by the React
// 16/17 smoke suite (npm run test:legacy), which runs without coverage.
/* v8 ignore start */
const useCounterEditorId = (): string =>
  useMemo(() => `editor-${++win.__unlayer_lastEditorId}`, []);
/* v8 ignore stop */

// React 18+ exposes useId, which returns an identifier that is identical on the
// server render and during client hydration — the correct fix for the id
// mismatch that otherwise leaves the editor mounting against a stale server id
// (blank editor) under SSR/Next.js. The implementation is picked once at module
// load (stable for the app's lifetime), so the same hook runs on every render.
const useGeneratedEditorId: () => string =
  typeof React.useId === 'function'
    ? // Strip ':' so the id is a valid CSS selector for unlayer.createEditor.
      () => `editor-${React.useId().replace(/:/g, '')}`
    : useCounterEditorId;

function EmailEditorInner<
  TDisplayMode extends DisplayMode | undefined = 'email',
>(
  props: EmailEditorProps<TDisplayMode>,
  ref: React.Ref<EditorRef<TDisplayMode>>
) {
  const { onLoad, onReady, scriptUrl, minHeight = 500, style = {} } = props;

  const [editor, setEditor] = useState<UnlayerEditor<TDisplayMode> | null>(
    null
  );

  const [hasLoadedEmbedScript, setHasLoadedEmbedScript] = useState(false);

  // Always call the hook (rules of hooks); the generated id is only used when
  // no explicit editorId prop is provided.
  const generatedId = useGeneratedEditorId();
  const editorId = props.editorId || generatedId;

  const options = {
    ...(props.options || {}),
    appearance: props.appearance ?? props.options?.appearance,
    displayMode:
      props?.displayMode || props.options?.displayMode || ('email' as const),
    locale: props.locale ?? props.options?.locale,
    projectId: props.projectId ?? props.options?.projectId,
    tools: props.tools ?? props.options?.tools,

    id: editorId,
    source: {
      name: pkgName,
      version: pkgVersion,
    },
  };

  useImperativeHandle(
    ref,
    () => ({
      editor,
    }),
    [editor]
  );

  // The unmount cleanup below runs once, so it reads the latest editor
  // instance from a ref instead of the (stale) first-render closure.
  const editorRef = useRef(editor);
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

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
  props: EmailEditorProps<TDisplayMode> &
    React.RefAttributes<EditorRef<TDisplayMode>>
) => React.ReactElement | null;
