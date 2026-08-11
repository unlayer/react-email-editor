# Changelog

## 2.1.1 (2026-08-11)

### Fixed

- **`loadScript` never invoked its callbacks when the embed script was already on the page.** If the Unlayer embed was preloaded in the HTML, injected by a parent app, or added by another component before `EmailEditor` mounted, the internal `loaded` flag stayed `false`, so queued callbacks never ran and the editor never initialized (and every later mount stayed broken too). Readiness is now derived from the global `unlayer` object, with a `load` listener attached to a still-loading pre-existing script (#496).

## 2.1.0 (2026-08-11)

### Added

- **Typings for forwarded Unlayer event handlers.** `EmailEditor` forwards any `on*` prop to the underlying editor via `addEventListener`, but `EmailEditorProps` previously declared only `onLoad`/`onReady`, so TypeScript users got errors on supported handlers. The common handlers (`onDesignLoad`, `onDesignUpdated`, `onImageUpload`) are now typed explicitly with their payloads, and an `on${string}` index signature covers the rest (#497).

### Changed

- Resolved all outstanding security advisories in the dev/build toolchain (`esbuild`, `postcss`, `nanoid`, `undici`) via `overrides`, and bumped the demo's `react-router-dom`. No runtime dependency of the published package was affected, so there is no consumer impact.

## 2.0.0 (2026-07-06)

Modernization release. The component API is unchanged — most apps on React 16.8+ with a current toolchain can upgrade without any code changes.

### Breaking changes

- **React >= 16.8 is now required** (peer dependency was `>=15`). The component has used hooks since v1.7.0, so React 15–16.7 never worked at runtime — npm now enforces this at install time.
- **Node >= 18** is declared in `engines` (was `>=10`).
- **Deep imports are no longer allowed.** The package now has an `exports` map; only the root import (`react-email-editor`) and `./package.json` are resolvable. Import paths like `react-email-editor/dist/...` must be replaced with the root import.
- **Published code is ES2019** (was ES5). Legacy build pipelines that cannot parse ES2019 (e.g. webpack 4 with uglify-js) should stay on 1.x or transpile `node_modules`.
- **Editors are destroyed on unmount.** A stale-closure bug previously prevented `editor.destroy()` from ever running when the component unmounted. If your app relied on the leaked instance surviving a remount, it no longer does.

### Added

- Native ESM build (`import`) alongside CJS (`require`), with correct per-format TypeScript declarations.
- `'use client'` directive in the published bundle — works out of the box with the Next.js App Router and other React Server Components environments.
- Event listeners passed as `on*` props re-register correctly when the set of props changes (previously keyed on array indices).

### Changed

- `@unlayer/types` is pinned to a version range instead of `latest` (#469).
- Build tooling migrated from tsdx to tsup; tests from Jest to Vitest.
- CI now tests React 16/17 (smoke) and React 18/19 (full suite) across Node 20/22/24, with enforced coverage thresholds.

## 1.7.11 and earlier

See the [commit history](https://github.com/unlayer/react-email-editor/commits/master).
