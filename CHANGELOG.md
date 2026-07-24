# Changelog

## Unreleased

### Fixed

- **SSR/hydration:** auto-generated editor ids now use React's `useId` (React 18+) so the id is identical on the server render and during client hydration. Previously the id came from a module-level counter that diverges between server and client, causing a hydration mismatch and — because the editor then mounted against a stale server id — a silently blank editor under SSR (e.g. the Next.js App Router). React 16.8/17 keep the legacy counter fallback. Pass an explicit `editorId` to opt out. ([EmailEditor.tsx](src/EmailEditor.tsx))

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
