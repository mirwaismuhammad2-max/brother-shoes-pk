/* Brother Shoes service worker: lets the app open with no internet.
   Change VERSION whenever you upload a new version of the app. */
const VERSION='bs-v1';
const CORE=['./','index.html','manifest.json','logo.png','icon-192.png','icon-512.png','intro.mp4',
 'firebase-app-compat.js','firebase-auth-compat.js','firebase-firestore-compat.js'];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(VERSION).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

async function ranged(req){
 const c=await caches.open(VERSION);
 let res=await c.match(req.url,{ignoreSearch:true});
 if(!res){try{const full=await fetch(req.url);if(full.ok){c.put(req.url,full.clone());res=full}else return full}catch(e){return new Response('',{status:503})}}
 const buf=await res.arrayBuffer(),m=/bytes=(\d*)-(\d*)/.exec(req.headers.get('range')||'');
 if(!m)return new Response(buf,{status:200,headers:{'Content-Type':res.headers.get('Content-Type')||'video/mp4'}});
 const s=m[1]?+m[1]:0,e=m[2]?Math.min(+m[2],buf.byteLength-1):buf.byteLength-1;
 return new Response(buf.slice(s,e+1),{status:206,headers:{'Content-Type':res.headers.get('Content-Type')||'video/mp4','Content-Range':`bytes ${s}-${e}/${buf.byteLength}`,'Content-Length':String(e-s+1),'Accept-Ranges':'bytes'}});
}

async function local(req){
 const c=await caches.open(VERSION);
 const hit=await c.match(req,{ignoreSearch:true});
 const net=fetch(req).then(r=>{if(r&&r.ok&&r.type==='basic')c.put(req,r.clone());return r}).catch(()=>null);
 if(hit){net.catch(()=>{});return hit}
 const r=await net;
 if(r)return r;
 if(req.mode==='navigate'){const i=await c.match('index.html')||await c.match('./');if(i)return i}
 return new Response('Offline',{status:503,statusText:'Offline'});
}

async function sdk(req){
 const c=await caches.open(VERSION);
 const hit=await c.match(req);
 if(hit)return hit;
 try{const r=await fetch(req);if(r&&(r.ok||r.type==='opaque'))c.put(req,r.clone());return r}catch(e){return new Response('',{status:503})}
}

self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const u=new URL(req.url);
 if(u.origin===location.origin){
  if(req.headers.has('range'))e.respondWith(ranged(req));else e.respondWith(local(req));
 }else if(/(^|\.)gstatic\.com$/.test(u.hostname)&&u.pathname.startsWith('/firebasejs/')){
  e.respondWith(sdk(req));
 }
});
