const { spawnSync } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..').replace(
  /^([a-z]):/i,
  (_match, drive) => `${drive.toUpperCase()}:`
);
const vitestCli = path.join(projectRoot, 'node_modules', 'vitest', 'vitest.mjs');
const result = spawnSync(
  process.execPath,
  [vitestCli, ...process.argv.slice(2)],
  {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
  }
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
