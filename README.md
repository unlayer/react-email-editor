<h1 align="center">React Email Editor</h1>

<p align="center">
  Official React component for embedding <a href="https://unlayer.com/">Unlayer</a>’s drag-and-drop email editor in your app.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-email-editor"><img src="https://img.shields.io/npm/v/react-email-editor.svg" alt="npm version" /></a>
  <a href="https://github.com/unlayer/react-email-editor"><img src="https://img.shields.io/github/stars/unlayer/react-email-editor.svg?style=flat-square" alt="stars" /></a>
  <a href="https://github.com/unlayer/react-email-editor/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/react-email-editor.svg" alt="license" /></a>
  <a href="https://www.npmjs.com/package/react-email-editor"><img src="https://img.shields.io/npm/dm/react-email-editor.svg" alt="downloads" /></a>
  <a href="https://github.com/unlayer/react-email-editor/actions/workflows/ci.yml"><img src="https://github.com/unlayer/react-email-editor/actions/workflows/ci.yml/badge.svg" alt="CI status" /></a>
  <a href="https://codecov.io/gh/unlayer/react-email-editor"><img src="https://codecov.io/gh/unlayer/react-email-editor/branch/master/graph/badge.svg" alt="test coverage" /></a>
</p>

---

## Introduction

Add a production-ready, drag-and-drop email builder to your React app with a single component. react-email-editor lets developers embed Unlayer, load and save designs, listen to editor events, customize configuration, and export responsive HTML.

Use it when you need email template creation inside your app without building and maintaining a full visual editor from scratch.

|                                                     Video Overview                                                      |
| :---------------------------------------------------------------------------------------------------------------------: |
| [![React Email Editor](https://unlayer.com/images/editor-video-thumb.png)](https://www.youtube.com/watch?v=qp9t74G4VyM) |
|                                  _Watch video overview: https://youtu.be/qp9t74G4VyM_                                   |

## Live Demo

Check out the live demo here: https://react-email-editor-demo.netlify.app/ ([Source Code](https://github.com/unlayer/react-email-editor/tree/master/demo/src))

## Installation

The easiest way to use React Email Editor is to install it from NPM and include it in your own React build process.

```
npm install react-email-editor --save
```

### Upgrading from 1.x

Version 2.0 is a modernization release — the component API is unchanged, and most apps can upgrade without code changes. Requirements and packaging did change:

- **React >= 16.8** and **Node >= 18** are now required. (React 15–16.7 never worked with the hooks-based component in 1.7.x; 2.0 just enforces this at install time.)
- **Import only from the package root.** Deep imports like `react-email-editor/dist/...` are blocked by the new `exports` map.
- **The published code is ES2019.** If you support legacy browsers through an old toolchain that can't parse ES2019, stay on 1.x or transpile `node_modules`.
- **Editors are now destroyed on unmount** (a long-standing leak fix).

See the [CHANGELOG](CHANGELOG.md) for the full list.

## Usage

Require the EmailEditor component and render it with JSX:

```tsx
import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';

import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';

const App = (props) => {
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
    });
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    // or generated from React code with @unlayer/react-elements (renderToJson)
    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);
  };

  return (
    <div>
      <div>
        <button onClick={exportHtml}>Export HTML</button>
      </div>

      <EmailEditor ref={emailEditorRef} onReady={onReady} />
    </div>
  );
};

createRoot(document.getElementById('app')!).render(<App />);
```

See the [example source](https://github.com/unlayer/react-email-editor/blob/master/demo/src/example/index.tsx) for a reference implementation.

### Next.js / React Server Components

The editor renders into the DOM, so the component is client-only. The published bundle includes the `'use client'` directive, so with the Next.js App Router you can import it directly from any Client Component — no `next/dynamic` workaround required.

### Methods

All unlayer methods are available in the editor instance (`emailEditorRef.current.editor`). See the [Unlayer Docs](https://docs.unlayer.com/) for more information, or log the object in the console to explore it. Here are the most used ones:

| method         | params              | description                                             |
| -------------- | ------------------- | ------------------------------------------------------- |
| **loadDesign** | `Object data`       | Takes the design JSON and loads it in the editor        |
| **saveDesign** | `Function callback` | Returns the design JSON in a callback function          |
| **exportHtml** | `Function callback` | Returns the design HTML and JSON in a callback function |

### Properties

- `editorId` {`String`} HTML div id of the container where the editor will be embedded (optional)
- `minHeight` {`String`} minimum height to initialize the editor with (default 500px)
- `onLoad` {`Function`} called when the editor instance is created
- `onReady` {`Function`} called when the editor has finished loading
- `options` {`Object`} options passed to the Unlayer editor instance (default {})
  - See the [Unlayer Docs](https://docs.unlayer.com/builder/installation) for all available options.
- `style` {`Object`} style object for the editor container (default {})

## Support

The email editor output is tested using the most popular email clients.

| <img src="https://unlayer.com/icons/gmail-icon-square.png" width="48px" height="48px" alt="Gmail logo"> | <img src="https://unlayer.com/icons/apple-mail-icon-square.png" width="48px" height="48px" alt="Apple Mail"> | <img src="https://unlayer.com/icons/outlook-icon-square.png" width="48px" height="48px" alt="Outlook logo"> | <img src="https://unlayer.com/icons/yahoo-mail-icon-square.png" width="48px" height="48px" alt="Yahoo! Mail logo"> |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Gmail ✔                                                                                                 | Apple Mail ✔                                                                                                 | Outlook ✔                                                                                                   | Yahoo! Mail ✔                                                                                                      |

## AI Assistant

Add AI-powered content creation to your embedded email editor.

Unlayer’s [AI Assistant](https://unlayer.com/ai) helps users generate, rewrite, translate, and improve email content directly inside the editor. Developers can enable AI features through the editor configuration, giving users a faster way to create polished emails without leaving your app.

## Custom Tools

Custom tools can help you add your own content blocks to the editor. Every application is different and needs different tools to reach it's full potential. [Learn More](https://docs.unlayer.com/builder/tools/custom)

[![Custom Tools](https://unroll-assets.s3.amazonaws.com/custom_tools.png)](https://docs.unlayer.com/builder/tools/custom)

## Localization

You can submit new language translations by creating a PR on this GitHub repo: https://github.com/unlayer/translations. Translations managed by [PhraseApp](https://phraseapp.com)

## Related packages

- [`@unlayer/react-elements`](https://github.com/unlayer/elements): write templates in code as React components (`Email`, `Row`, `Column`, `Heading`, `Paragraph`, `Button`, …) and render them to email HTML, responsive web pages or print-ready HTML for PDFs. `renderToJson()` synchronously returns design JSON you can pass to `loadDesign`, so templates written in code (by developers, coding agents, or an LLM at runtime) stay editable in this editor.

### License

Copyright (c) 2026 Unlayer. [MIT](LICENSE) Licensed.
