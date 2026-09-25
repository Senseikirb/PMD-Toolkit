/* Application shell only. Never caches Program Backups or third-party URLs. */
'use strict';
const RELEASE='pmd-10.1.0-1';
const CACHE=RELEASE+':'+self.registration.scope;
const SHELL=['./','./index.html','./assets/app.css','./assets/app.js','./assets/companion.css','./assets/companion.js','./assets/device.js','./assets/pwa.js','./assets/security.js','./assets/handlers.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/icon.svg'];
const URLS=SHELL.map(path=>new URL(path,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  try{await cache.addAll(URLS.map(url=>new Request(url,{cache:'reload'})));}catch(error){await caches.delete(CACHE);throw error;}
  // No skipWaiting here: replacing an active session requires user intent.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('pmd-')&&n.endsWith(':'+self.registration.scope)&&n!==CACHE).map(n=>caches.delete(n)));await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);url.search='';url.hash='';
  if(!URLS.includes(url.href))return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(url.href);if(hit)return hit;return fetch(event.request);})());
});
self.addEventListener('message',event=>{
  if(event.data?.type!=='PMD_ACTIVATE')return;
  event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});const ours=windows.filter(w=>w.url.startsWith(self.registration.scope));if(ours.length>1){event.source?.postMessage({type:'PMD_UPDATE_BLOCKED'});return;}await self.skipWaiting();})());
});
