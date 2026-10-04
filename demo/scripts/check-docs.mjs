import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const demo = fileURLToPath(new URL('..', import.meta.url));
const root = resolve(demo, '..');
const temporary = await mkdtemp(join(demo, 'node_modules', '.docs-check-'));
try {
  const paths = [];
  for (const [name, source] of [
    ['readme', 'README.md'],
    ['elements', 'docs/react-elements.md'],
  ]) {
    const markdown = await readFile(join(root, source), 'utf8');
    const blocks = [...markdown.matchAll(/```tsx\n([\s\S]*?)```/g)];
    if (blocks.length !== 1)
      throw new Error(`Expected one complete TSX example in ${source}`);
    const path = join(temporary, `${name}.tsx`);
    await writeFile(path, blocks[0][1]);
    paths.push(path);
  }
  const result = spawnSync(
    process.execPath,
    [
      join(demo, 'node_modules/typescript/bin/tsc'),
      '--ignoreConfig',
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--jsx',
      'react-jsx',
      '--target',
      'ES2020',
      '--module',
      'ESNext',
      '--moduleResolution',
      'bundler',
      '--verbatimModuleSyntax',
      ...paths,
    ],
    { stdio: 'inherit' }
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('Documentation typecheck failed');
  console.log('Both documentation examples pass strict TypeScript checks.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
