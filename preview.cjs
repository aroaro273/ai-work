const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const server = http.createServer((req, res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + (name.endsWith('/') ? name + 'index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404).end(); return; } res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'}); res.end(data); });
});
const url = 'http://127.0.0.1:8000/';
function openPage() { if (process.argv.includes('--open')) require('child_process').execFile('rundll32.exe', ['url.dll,FileProtocolHandler', url]); }
server.on('error', err => { if (err.code === 'EADDRINUSE') { console.log(url); openPage(); } else { console.error(err.message); process.exitCode = 1; } });
server.listen(8000, '127.0.0.1', () => { console.log(url); openPage(); });
