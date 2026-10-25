## Prerequisites

[Node.js](https://nodejs.org/) 22, matching `.nvmrc`, must be installed.

## Installation

From the repository root:

```bash
npm install
npm --prefix demo install
```

The root install builds the wrapper through its `prepare` script.

## Demo Development Server

The demo consumes the built wrapper through `file:..`. Run these commands in two terminals, both from the repository root:

```bash
npm start
```

```bash
npm --prefix demo run dev
```

`npm start` runs `tsup --watch` to rebuild wrapper changes. The demo server reloads those builds at [http://localhost:3000](http://localhost:3000); running only the demo server will not pick up wrapper source edits.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Building

- `npm run build` will build the component for publishing to npm.
- `npm run build` in the `demo` directory will build the demo app.
