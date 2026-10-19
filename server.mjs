import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
http.createServer(async(req,res)=>{try{let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(url==='/')url='/garment_billing_demo.html';if(!/^\/(garment_billing_demo\.html|frontend\/[^/]+\.(js|css)|printing\/[^/]+\.js|vendor\/[^/]+\.js)$/.test(url))throw Error();const data=await readFile(path.join(root,url));res.writeHead(200,{'Content-Type':mime[path.extname(url)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(8080,'127.0.0.1',()=>console.log('Only Garments: http://127.0.0.1:8080'));
