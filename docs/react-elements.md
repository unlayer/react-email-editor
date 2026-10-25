# Create React email templates that stay visually editable

Use **Unlayer Elements** (`@unlayer/react-elements`) to write templates in React, then use **React Email Editor** (`react-email-editor`) to let teammates edit them visually. This also gives coding agents a supported component structure for generating editable email templates.

Elements is optional. If users build everything visually, use React Email Editor alone. If your application only needs server-rendered email HTML, Elements can run without an embedded editor.

## Install

In a React 18+ application:

```bash
npm install react-email-editor @unlayer/react-elements react react-dom
```

The combined example requires React 18+ because Elements does; the editor wrapper alone supports React 16.8+. The checked-in demo uses React 19 and Elements 0.1.22. The visual editor runs in the browser and needs access to Unlayer's hosted editor. Local Elements rendering does not need an Unlayer account.

## Generate design JSON and load it after readiness

Save this complete component as `src/App.tsx` in your React TypeScript app. It generates an initial template and exposes the edited HTML and JSON:

<!-- check-docs -->

```tsx
import { useRef, useState } from 'react';
import EmailEditor, {
  type EditorRef,
  type EmailEditorProps,
} from 'react-email-editor';
import {
  Email,
  Row,
  Column,
  Heading,
  Paragraph,
  renderToJson,
} from '@unlayer/react-elements';

type EmailDesign = Parameters<
  NonNullable<EditorRef['editor']>['loadDesign']
>[0];

function createDesign() {
  return renderToJson(
    <Email contentWidth="600px">
      <Row>
        <Column>
          <Heading>Welcome to Acme</Heading>
          <Paragraph html="Your workspace is ready. Edit this message in the visual editor." />
        </Column>
      </Row>
    </Email>
  ) as EmailDesign; // Bridge Elements 0.1.22 design types to the editor.
}

export default function App() {
  const ref = useRef<EditorRef>(null);
  const [ready, setReady] = useState(false);
  const [html, setHtml] = useState('');
  const [json, setJson] = useState('');

  const onReady: EmailEditorProps['onReady'] = (editor) => {
    editor.addEventListener('design:loaded', () => setReady(true));
    editor.loadDesign(createDesign());
  };

  const exportEmail = () => {
    if (!ready) return;
    ref.current?.editor?.exportHtml(({ design, html }) => {
      setHtml(html);
      setJson(JSON.stringify(design, null, 2));
      // Store design in your backend and pass it to loadDesign() when reopening.
    });
  };

  return (
    <main>
      <button disabled={!ready} onClick={exportEmail}>
        Export edited email
      </button>
      <EmailEditor ref={ref} onReady={onReady} />
      <textarea aria-label="Exported HTML" readOnly value={html} />
      <textarea aria-label="Design JSON" readOnly value={json} />
    </main>
  );
}
```

Expected: an editable welcome email. After changing its text and clicking **Export edited email**, the HTML and JSON text areas contain the latest visual edits. `renderToJson()` returns a design object synchronously; `loadDesign()` accepts that object; `exportHtml()` returns both edited HTML and design JSON through its callback.

Elements 0.1.22 declares design values more broadly than the editor's types. The assertion above bridges those declarations for this supported template; it does not validate arbitrary JSON or HTML.

For Next.js App Router, put `'use client';` at the top of this component. For server-generated templates, call Elements' `renderToJson()` on the server and pass the serializable design object to the client component instead of generating it there.

## Run the complete save-and-reopen demo

From this repository's root, with Node.js 22.12+:

```bash
npm ci
npm --prefix demo ci
npm --prefix demo run dev
```

Open <http://localhost:3000/elements>. The [demo README](../demo/README.md#elements-to-visual-editor) describes the files and validation commands. The demo consumes the built local wrapper and the published Elements package.

1. Edit the welcome heading or paragraph in the visual editor.
2. Click **Save and export**. Inspect HTML or Design JSON, then copy or download it.
3. Reload the page. Your saved design is loaded instead of regenerating the React template.
4. Expand **View the React template** to compare the source with your editable result.

The demo stores the latest design in this browser's local storage. It is not a production persistence service or an autosave implementation. If storage is unavailable, the output remains downloadable and the page shows a warning. For production, save the design with authorization and versioning in your backend, handle save failures, and load the saved JSON in `onReady`. Use `saveDesign(callback)` when you need only JSON, or `exportHtml(callback)` when you also need HTML. Debounce `design:updated` events if implementing autosave.

## Constraints

- Use the structure `Email > Row > Column > content`. `renderToJson()` walks supported Elements nodes; it does not render arbitrary React component trees or run hooks. Fetch data before generating the design.
- Load the initial design after `onReady` and wait for `design:loaded` before enabling export. Changing editor configuration can recreate the editor; preserve unsaved work before doing so.
- Once someone edits the template, persist their edited design. Regenerating from the original React tree would replace those changes. JSON preserves design content and settings, not JSX, application logic, or event handlers.
- Use `editor.exportHtml()` for HTML from an edited design. Elements' `renderToHtml()` takes React elements, not saved JSON. Your email provider sends the exported HTML; keep any plain-text alternative in sync.
- Escape dynamic values interpolated into raw `html` props and validate links. Generated code should go through your normal review/build process before execution.
- Hosted editor project settings, custom tools, and feature availability are separate from the wrapper's MIT license. Use matching custom-tool registrations and the appropriate display mode. See [editor installation](https://docs.unlayer.com/builder/installation).

For component APIs, provider integrations, and sharing templates across email, web, and PDF, continue with the [Elements documentation](https://github.com/unlayer/elements/tree/main/packages/react/docs). Keep the editor integration here and the rendering/provider recipes in Elements.
