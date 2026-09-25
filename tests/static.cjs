const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('index.html'),manifest=JSON.parse(read('manifest.webmanifest')),sw=read('sw.js');
assert.match(html,/viewport-fit=cover/);assert.match(html,/script-src 'self'; script-src-attr 'none'/);assert.ok(!/script-src[^;]*unsafe-inline/.test(html));assert.match(html,/connect-src 'self'/);
assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');assert.equal(manifest.id,'./');
for(const icon of manifest.icons){assert.ok(fs.existsSync(path.join(root,icon.src)));const png=fs.readFileSync(path.join(root,icon.src));const size=Number(icon.sizes.split('x')[0]);assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);}
for(const [base,expected]of [['https://example.github.io/PMD-Toolkit/','/PMD-Toolkit/'],['https://example.org/','/']]){assert.equal(new URL(manifest.start_url,base).pathname,expected);for(const i of manifest.icons)assert.ok(new URL(i.src,base).pathname.startsWith(expected));}
for(const src of [...html.matchAll(/(?:src|href)="(assets\/[^"#]+|icons\/[^"#]+|manifest\.webmanifest)"/g)].map(m=>m[1]))assert.ok(fs.existsSync(path.join(root,src)),src);
for(const name of fs.readdirSync(path.join(root,'assets')).filter(n=>n.endsWith('.js')))new vm.Script(read('assets/'+name),{filename:name});new vm.Script(sw);
const shell=sw.match(/const SHELL=\[([\s\S]*?)\];/)[1];assert.ok(!/demo|export|backup|tests/i.test(shell));assert.ok(!/https?:/.test(shell));assert.match(sw,/No skipWaiting here/);assert.match(sw,/PMD_ACTIVATE/);
const app=read('assets/app.js')+read('assets/companion.js');assert.ok(!/\b(localStorage|sessionStorage|indexedDB)\s*[.(]/.test(app));assert.ok(!/\beval\s*\(|new\s+Function\s*\(/.test(app.replace(/\/\*[\s\S]*?\*\//g,'')));
assert.match(read('assets/companion.css'),/safe-area-inset-bottom/);assert.match(read('assets/companion.js'),/visualViewport/);assert.match(read('assets/device.js'),/indexedDB\.databases/);
assert.ok(!fs.existsSync(path.join(root,'LICENSE')),'A license must be chosen by the owner, not generated automatically.');
const sources=['index.html','manifest.webmanifest','sw.js',...fs.readdirSync(path.join(root,'assets')).filter(n=>/\.(js|css)$/.test(n)).map(n=>'assets/'+n)];
for(const file of sources){const text=read(file);assert.ok(!/C:\\Users\\|C:\/Users\/|gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text),'Private content pattern: '+file);}
console.log('PASS Static syntax, CSP, manifest/icons, project paths, shell allowlist, persistence boundary, secret-pattern scan, license decision');
