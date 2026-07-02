// Cafe24 AI Space / Cafe24 Node.js Hosting Production Entrypoint
const cp = require('child_process');
const path = require('path');

const MEMORY_LIMIT = 300; // Force 300MB V8 Heap limit to prevent Cafe24 memory threshold crashes

const hasMaxOldSpace = process.execArgv.some(arg => arg.includes('--max-old-space-size'));

if (!hasMaxOldSpace) {
  console.log(`[Cafe24 Resource Guard] Respawning server with --max-old-space-size=${MEMORY_LIMIT} to prevent out of memory crash...`);
  const child = cp.spawn(
    process.execPath,
    [`--max-old-space-size=${MEMORY_LIMIT}`, path.join(__dirname, 'dist/server.cjs')],
    { stdio: 'inherit' }
  );
  child.on('exit', (code) => {
    process.exit(code !== null ? code : 1);
  });
} else {
  // If already run with the flag, load the main compiled server
  require('./dist/server.cjs');
}
