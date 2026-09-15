const CACHE="offer-stash-v4-1";
const ASSETS=["./","./index.html","./styles.css","./app.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(e.request.method==="POST"&&u.pathname.endsWith("/share-target")){
  e.respondWith((async()=>{
   try{
    const fd=await e.request.formData(),title=fd.get("title")||"",text=fd.get("text")||"",url=fd.get("url")||"";
    let image=null;
    for(const [name,value] of fd.entries())if(name==="files"&&value instanceof File&&value.size){image={name:value.name,type:value.type,blob:value};break}
    await saveShared({id:crypto.randomUUID(),title,text,url,image,createdAt:Date.now()});
   }catch(err){console.error("Share Target error",err)}
   return Response.redirect(new URL("./?shared=1",u),303)
  })());return
 }
 if(e.request.method==="GET"&&["document","script","style","manifest"].includes(e.request.destination)){
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));return
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
});
function saveShared(item){return new Promise((resolve,reject)=>{
 const req=indexedDB.open("OfferStashShareInbox",1);
 req.onupgradeneeded=()=>req.result.createObjectStore("inbox",{keyPath:"id"});
 req.onsuccess=()=>{const db=req.result,tx=db.transaction("inbox","readwrite");tx.objectStore("inbox").put(item);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)};
 req.onerror=()=>reject(req.error)
})}