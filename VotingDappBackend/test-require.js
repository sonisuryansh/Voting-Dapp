const fs = require('fs');
console.log('debug.js exists:', fs.existsSync('node_modules/debug/src/debug.js'));
try {
  require('./node_modules/debug/src/node.js');
  console.log('required node.js OK');
} catch (e) {
  console.error('require error:', e && e.stack ? e.stack : e.message);
  process.exitCode = 1;
}
