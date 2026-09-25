const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.env.PMD_SERVE_ROOT||path.join(__dirname,'..')),port=Number(process.env.PORT||4173),prefix='/PMD-Toolkit/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');let pathname;
  try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400).end();return;}
  if(pathname==='/PMD-Toolkit'){res.writeHead(302,{Location:prefix}).end();return;}
  if(pathname.startsWith(prefix))pathname=pathname.slice(prefix.length)||'/';
  const file=path.resolve(root,'.'+(pathname.startsWith('/')?pathname:'/'+pathname)+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)||file.includes(path.sep+'.git'+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
});
if(require.main===module)server.listen(port,'127.0.0.1',()=>console.log('PMD preview: http://127.0.0.1:'+port+prefix));
module.exports=server;
