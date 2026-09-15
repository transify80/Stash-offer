const DB="OfferStashDB", STORE="items";let db,mode="offer",editId=null,imageData=null;
const $=id=>document.getElementById(id);
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random()}

function getShared(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open("OfferStashShareInbox",1);
    req.onupgradeneeded=()=>req.result.createObjectStore("inbox",{keyPath:"id"});
    req.onsuccess=()=>{
      const db=req.result;
      const q=db.transaction("inbox","readonly").objectStore("inbox").getAll();
      q.onsuccess=()=>resolve(q.result);
      q.onerror=()=>reject(q.error);
    };
    req.onerror=()=>reject(req.error);
  });
}
function deleteShared(id){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open("OfferStashShareInbox",1);
    req.onsuccess=()=>{
      const db=req.result;
      const q=db.transaction("inbox","readwrite").objectStore("inbox").delete(id);
      q.onsuccess=()=>resolve();
      q.onerror=()=>reject(q.error);
    };
    req.onerror=()=>reject(req.error);
  });
}
async function processShared(){
  if(!new URLSearchParams(location.search).has("shared")) return;
  try{
    const inbox=await getShared();
    if(!inbox.length) return;
    const x=inbox.sort((a,b)=>b.createdAt-a.createdAt)[0];

    editId=null; mode="offer";
    openForm({
      title:x.title||"Shared offer",
      source:"",
      offerText:[x.text,x.url].filter(Boolean).join("\n"),
      code:"",
      validTill:"",
      category:"Other",
      notes:"",
      imageData:null
    });

    if(x.image && x.image.blob){
      const reader=new FileReader();
      reader.onload=()=>{
        imageData=reader.result;
        $("preview").innerHTML=`<img src="${imageData}">`;
      };
      reader.readAsDataURL(x.image.blob);
    }
    await deleteShared(x.id);
    history.replaceState({},document.title,location.pathname);
    toast("Shared content loaded");
  }catch(err){
    console.error(err);
  }
}

function openDB(){return new Promise((res,rej)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:"id"});r.onsuccess=()=>{db=r.result;res()};r.onerror=()=>rej(r.error)})}
function all(){return new Promise((res,rej)=>{let q=db.transaction(STORE).objectStore(STORE).getAll();q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
function put(x){return new Promise((res,rej)=>{let q=db.transaction(STORE,"readwrite").objectStore(STORE).put(x);q.onsuccess=res;q.onerror=()=>rej(q.error)})}
function del(id){return new Promise((res,rej)=>{let q=db.transaction(STORE,"readwrite").objectStore(STORE).delete(id);q.onsuccess=res;q.onerror=()=>rej(q.error)})}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}
function esc(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
async function render(){let a=await all();$("stashCount").textContent=a.filter(x=>x.type==="offer").length;$("trackCount").textContent=a.filter(x=>x.type==="track").length;
let sq=($("searchStash").value||"").toLowerCase(), cq=$("categoryFilter").value;
$("stashList").innerHTML=a.filter(x=>x.type==="offer"&&(!sq||(x.title+" "+x.source+" "+x.offerText+" "+x.code).toLowerCase().includes(sq))&&(!cq||x.category===cq)).sort((a,b)=>b.updatedAt-a.updatedAt).map(card).join("")||empty("No offers yet");
let st=($("searchTrack").value||"").toLowerCase(), kq=$("kindFilter").value;
$("trackList").innerHTML=a.filter(x=>x.type==="track"&&(!st||(x.title+" "+x.notes).toLowerCase().includes(st))&&(!kq||x.kind===kq)).sort((a,b)=>b.updatedAt-a.updatedAt).map(card).join("")||empty("Nothing to track yet")}
function empty(t){return `<div class="card muted">${t}<br><br>Tap ＋ to add one.</div>`}
function card(x){let date=x.type==="offer"?x.validTill: x.nextDate;return `<div class="card">${x.imageData?`<img class="thumb" src="${x.imageData}">`:""}<div class="cardtop"><div class="title">${esc(x.title)}</div><button class="danger" onclick="removeItem('${x.id}')">×</button></div>${x.source?`<div class="muted">${esc(x.source)}</div>`:""}${x.offerText?`<div>${esc(x.offerText)}</div>`:""}${x.code?`<div class="code">${esc(x.code)}</div>`:""}${x.category?`<span class="pill">${esc(x.category)}</span>`:""}${x.kind?`<span class="pill">${esc(x.kind)}</span>`:""}${date?`<div class="muted" style="margin-top:9px">📅 ${esc(date)}</div>`:""}${x.notes?`<div class="muted" style="margin-top:7px">${esc(x.notes)}</div>`:""}<button style="margin-top:10px;border:0;background:none" onclick="editItem('${x.id}')">Edit</button></div>`}
async function removeItem(id){if(confirm("Delete this item?")){await del(id);render()}}
async function editItem(id){let x=(await all()).find(a=>a.id===id);if(!x)return;editId=id;mode=x.type;openForm(x)}
function openForm(x={}){$("modalTitle").textContent=mode==="offer"?(editId?"Edit Offer":"Add Offer"):(editId?"Edit Tracker":"Add Tracker");$("sourceLabel").classList.toggle("hidden",mode!=="offer");$("offerLabel").classList.toggle("hidden",mode!=="offer");$("codeLabel").classList.toggle("hidden",mode!=="offer");$("categoryLabel").classList.toggle("hidden",mode!=="offer");$("doneOnLabel").classList.toggle("hidden",mode!=="track");$("nextDateLabel").classList.toggle("hidden",mode!=="track");$("kindLabel").classList.toggle("hidden",mode!=="track");
$("title").value=x.title||"";$("source").value=x.source||"";$("offerText").value=x.offerText||"";$("code").value=x.code||"";$("validTill").value=x.validTill||"";$("category").value=x.category||"Flight";$("doneOn").value=x.doneOn||"";$("nextDate").value=x.nextDate||"";$("kind").value=x.kind||"Warranty";$("notes").value=x.notes||"";imageData=x.imageData||null;$("preview").innerHTML=imageData?`<img src="${imageData}">`:"";$("modal").classList.remove("hidden")}
$("addOffer").onclick=()=>{editId=null;mode="offer";openForm()};$("addTrack").onclick=()=>{editId=null;mode="track";openForm()};$("closeModal").onclick=()=>{$("modal").classList.add("hidden");imageData=null};
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(z=>z.classList.remove("active"));b.classList.add("active");$("stashPanel").classList.toggle("hidden",b.dataset.tab!=="stash");$("trackPanel").classList.toggle("hidden",b.dataset.tab!=="track")});
$("itemForm").onsubmit=async e=>{e.preventDefault();let old=editId?(await all()).find(x=>x.id===editId):null;let x={...(old||{}),id:editId||uid(),type:mode,title:$("title").value.trim(),source:$("source").value.trim(),offerText:$("offerText").value.trim(),code:$("code").value.trim(),validTill:$("validTill").value,category:$("category").value,doneOn:$("doneOn").value,nextDate:$("nextDate").value,kind:$("kind").value,notes:$("notes").value.trim(),imageData:imageData||null,updatedAt:Date.now()};await put(x);$("modal").classList.add("hidden");imageData=null;toast("Saved");render()};
async function handleImage(f){if(!f)return;let r=new FileReader();r.onload=()=>{imageData=r.result;$("preview").innerHTML=`<img src="${imageData}">`};r.readAsDataURL(f)}
$("cameraInput").onchange=e=>handleImage(e.target.files[0]);$("imageInput").onchange=e=>handleImage(e.target.files[0]);
$("pasteBtn").onclick=async()=>{try{let t=await navigator.clipboard.readText();$("offerText").value=t||$("offerText").value;toast(t?"Pasted":"Clipboard is empty")}catch{toast("Paste permission unavailable")}};
["searchStash","searchTrack","categoryFilter","kindFilter"].forEach(id=>$(id).oninput=render);

$("backupBtn").onclick=async()=>{let a=await all();let payload={format:"OfferStash",version:2,exportedAt:new Date().toISOString(),items:a};let blob=new Blob([JSON.stringify(payload)],{type:"application/json"});let url=URL.createObjectURL(blob),ael=document.createElement("a");ael.href=url;ael.download="OfferStash-"+new Date().toISOString().slice(0,10)+".osb";ael.click();URL.revokeObjectURL(url);toast("Backup created")};
document.body.insertAdjacentHTML("beforeend",`<input id="restoreInput" type="file" accept=".osb,.json,application/json" style="display:none">`);
$("backupBtn").addEventListener("dblclick",()=>$("restoreInput").click());
$("restoreInput").onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let p=JSON.parse(await f.text());if(!p.items)throw Error();let existing=await all(),m=new Map(existing.map(x=>[x.id,x]));for(let x of p.items){let old=m.get(x.id);if(!old||Number(x.updatedAt||0)>Number(old.updatedAt||0))await put(x)}toast("Restore merged");render()}catch{toast("Invalid backup file")}e.target.value=""};

openDB().then(async()=>{
  if("serviceWorker"in navigator){
    try{ await navigator.serviceWorker.register("./sw.js"); }catch(e){console.error(e)}
  }
  await render();
  setTimeout(processShared,250);
});
