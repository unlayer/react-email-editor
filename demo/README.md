# React Email Editor demo

Run from the repository root with Node.js 22.12+:

```bash
npm ci
npm --prefix demo ci
npm --prefix demo run dev
```

Open <http://localhost:3000> for the basic editor. The editor is hosted by Unlayer and requires internet access. The basic demo loads its sample after `onReady`; its save/export actions log results to the console.

## Elements to visual editor

Open <http://localhost:3000/elements>, or follow **Try Elements** from the basic demo.

The welcome email is generated with `@unlayer/react-elements` and loaded into `react-email-editor`. Edit a block, click **Save and export**, inspect/copy/download the HTML or JSON, and reload to reopen your saved design. Expand **View the React template** to see the source. Only this browser's local storage is used for saving; no backend or email delivery is provided.

| File                       | Purpose                                                                |
| -------------------------- | ---------------------------------------------------------------------- |
| `src/elements/welcome.tsx` | React template and synchronous `renderToJson()` call                   |
| `src/elements/index.tsx`   | Editor readiness, saved-design loading, export UI, and template source |
| `src/elements/storage.ts`  | Versioned demo storage and basic saved-data checks                     |
| `test/elements.test.tsx`   | Readiness, export, reopening edits, and storage failures               |

Elements is a demo dependency, not a dependency of the editor wrapper. This route imports the built local `react-email-editor` package through `file:..`; run the root `npm start` watcher alongside the demo server when editing wrapper code (see [contributing](../CONTRIBUTING.md#demo-development-server)). All demo routes use the same local package.

Read the [complete integration guide](../docs/react-elements.md) for installing the two packages in your own React app and handling persistence in production.

## Checks

From the repository root, after installation and the root build:

```bash
npm --prefix demo run build
npm --prefix demo test
npm --prefix demo run test:docs
```

The demo tests use the real Elements renderer and a controlled hosted-editor boundary. They do not prove hosted-editor compatibility. The documentation check compiles complete TSX examples marked with `<!-- check-docs -->` in the README and integration guide. It uses strict TypeScript against the built wrapper and reports errors at their Markdown lines; unmarked explanatory fragments are ignored. A live smoke check should additionally edit a block, export it, reload, and verify the saved edit in the real editor.
