## Prerequisites

[Node.js](http://nodejs.org/) >= v10 must be installed.

## Installation

- Running `npm install` in the components's root directory will install everything you need for development.
- Running `npm install` in the `demo` directory will install everything you need to run a demo app locally.

## Demo Development Server

- `npm start` from `demo` directory will run the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Building

- `npm run build` will build the component for publishing to npm.
- `npm run build` in the `demo` directory will build the demo app.
