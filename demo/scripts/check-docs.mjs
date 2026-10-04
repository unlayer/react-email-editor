import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const demo = fileURLToPath(new URL('..', import.meta.url));
const root = resolve(demo, '..');
const temporary = await mkdtemp(join(demo, 'node_modules', '.docs-check-'));
try {
  const examples = new Map();
  for (const source of ['README.md', 'docs/react-elements.md']) {
    const markdown = await readFile(join(root, source), 'utf8');
    const blocks = [
      ...markdown.matchAll(/<!-- check-docs -->\s*```tsx\r?\n([\s\S]*?)^```/gm),
    ];
    if (!blocks.length)
      throw new Error(
        `${source}: no TSX examples marked with <!-- check-docs -->`
      );
    for (const [index, block] of blocks.entries()) {
      if (!block[1].trim())
        throw new Error(`${source}: marked example ${index + 1} is empty`);
      const path = join(temporary, `${examples.size}.tsx`);
      const offset = block.index + block[0].indexOf(block[1]);
      examples.set(path, {
        source,
        line: markdown.slice(0, offset).split('\n').length,
      });
      await writeFile(path, block[1]);
    }
  }
  const program = ts.createProgram([...examples.keys()], {
    noEmit: true,
    strict: true,
    skipLibCheck: true,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    moduleDetection: ts.ModuleDetectionKind.Force,
    verbatimModuleSyntax: true,
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  for (const diagnostic of diagnostics) {
    let location = '';
    if (diagnostic.file && diagnostic.start !== undefined) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      const example = examples.get(diagnostic.file.fileName);
      location = `${example?.source ?? diagnostic.file.fileName}:${(example?.line ?? 1) + line}:${character + 1}: `;
    }
    console.error(
      `${location}TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`
    );
  }
  if (diagnostics.length) process.exitCode = 1;
  else
    console.log(
      `All ${examples.size} marked documentation examples pass strict TypeScript checks.`
    );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
