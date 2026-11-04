#!/usr/bin/env node
/* Extract or re-embed the study page ("חומר לימוד"), which lives inside index.html
   as a base64 string (LEARN_B64) and is loaded into an <iframe srcdoc>.

   node scripts/learn.js extract   -> writes learn.html (edit it freely)
   node scripts/learn.js embed     -> reads learn.html, re-encodes it into index.html
*/
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const learnPath = path.join(root, 'learn.html');
const re = /(LEARN_B64\s*=\s*['"`])([^'"`]+)(['"`])/;

const html = fs.readFileSync(indexPath, 'utf8');
const m = html.match(re);
if (!m) { console.error('LEARN_B64 not found in index.html'); process.exit(1); }

const cmd = process.argv[2];
if (cmd === 'extract') {
  fs.writeFileSync(learnPath, Buffer.from(m[2], 'base64').toString('utf8'));
  console.log('wrote learn.html (do not commit it; run "embed" when done)');
} else if (cmd === 'embed') {
  if (!fs.existsSync(learnPath)) { console.error('learn.html not found; run extract first'); process.exit(1); }
  const b64 = Buffer.from(fs.readFileSync(learnPath, 'utf8'), 'utf8').toString('base64');
  fs.writeFileSync(indexPath, html.replace(m[0], m[1] + b64 + m[3]));
  console.log('embedded learn.html into index.html');
} else {
  console.log('usage: node scripts/learn.js extract|embed');
  process.exit(1);
}
