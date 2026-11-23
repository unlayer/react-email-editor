# AGENTS.md

Guidance for AI coding agents working with `react-email-editor`, either using it in an app or contributing to this repo.

## What this package is

`react-email-editor` is Unlayer's official React wrapper for the drag-and-drop email editor. It renders a `<div>`, lazy-loads the Unlayer embed script (`https://editor.unlayer.com/embed.js?2` by default, override with `scriptUrl`), calls `unlayer.createEditor(...)`, and exposes the resulting editor instance. It is client-only; the published bundle carries `'use client'`, so Next.js App Router Client Components can import it directly. Requires React >= 16.8 and Node >= 18.

Source layout: `src/EmailEditor.tsx` (component), `src/loadScript.ts` (embed loader), `src/types.ts` (props and `EditorRef`), `src/index.ts` (default and named export `EmailEditor`). Types come from `@unlayer/types`.

## Minimal working integration

```tsx
import { useRef } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';

export default function App() {
  const emailEditorRef = useRef<EditorRef>(null);

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // Safe to call editor methods here, e.g. unlayer.loadDesign(design)
  };

  const exportHtml = () => {
    emailEditorRef.current?.editor?.exportHtml(({ design, html }) => {
      console.log(design, html);
    });
  };

  return (
    <>
      <button onClick={exportHtml}>Export HTML</button>
      <EmailEditor
        ref={emailEditorRef}
        onReady={onReady}
        options={{ projectId: 1234 /* your Unlayer project ID */ }}
      />
    </>
  );
}
```

Props: `options` (passed to Unlayer, see https://docs.unlayer.com/builder/installation), `minHeight` (default 500), `style`, `editorId`, `scriptUrl`, `onLoad`, `onReady`. Any other prop starting with `on` (e.g. `onDesignLoad`, `onDesignUpdated`) is registered as an editor event listener. `appearance`, `displayMode`, `locale`, `projectId` and `tools` as top-level props are deprecated; put them in `options`.

## Loading and exporting designs

The editor instance is `ref.current.editor` (null until created). Same instance is passed to `onLoad` and `onReady`.

- Load: `unlayer.loadDesign(designJson)`. The demo does this in `onLoad` (`demo/src/example/index.tsx`); the README does it in `onReady`.
- Save JSON only: `unlayer.saveDesign((design) => ...)`.
- Export HTML plus JSON: `unlayer.exportHtml(({ design, html }) => ...)`. Persist `design` if the user must be able to edit again; `html` is the send-ready output.
- Methods use callbacks, not promises.
- Design JSON can also be generated in code with `@hyper-elements/react` (`renderToJson`).

## Common mistakes

- **Calling methods before the editor is ready.** `ref.current.editor` is `null` until the embed script loads and `createEditor` runs. Always use optional chaining, and do initial `loadDesign` inside `onLoad`/`onReady`, not in a mount effect or render.
- **Missing `projectId`.** Pass `options.projectId` (number) from your Unlayer project. The demo omits it, but real integrations need it for project features and for the editor to be tied to your account. Do not use the deprecated top-level `projectId` prop in new code.
- **Unstable `options`.** The editor is destroyed and recreated whenever `JSON.stringify(options)` changes. Do not put values that change every render (timestamps, random ids) in `options`.
- **Server rendering.** Do not call `unlayer` or touch `window` at module scope; the global only exists in the browser after the script loads.
- **Deep imports.** Import only from `react-email-editor`; the `exports` map blocks `react-email-editor/dist/...`.
- **Assuming `onReady` is the first callback.** `onLoad` fires when the instance is created, `onReady` on the later `editor:ready` event.

## Dev commands (contributors)

Use Node 22 (`.nvmrc`). Run `npm install` at the root, and again in `demo/` for the demo app.

- `npm start`: tsup watch build
- `npm run build`: build to `dist/` (also runs on `npm install` via `prepare`)
- `npm test`: Vitest, run once. `npm run test:coverage`, `npm run test:watch`, `npm run test:legacy` (React 16/17 smoke suite)
- `npm run typecheck`: `tsc --noEmit`
- `npm run lint` / `npm run format`: Prettier check / write
- `cd demo && npm start`: demo app via Vite at http://localhost:3000 (it imports `../../../src`, so edits hot reload)

Before opening a PR, run `npm run lint`, `npm run typecheck` and `npm test`. Tests live in `test/`.

## Official agent resources

- Skills: `npx skills add unlayer/unlayer-skills`
- MCP docs: https://docs.unlayer.com/ai/mcp
- Editor docs: https://docs.unlayer.com/
