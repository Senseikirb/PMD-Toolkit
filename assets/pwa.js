'use strict';
const pmdShell={ready:false,failed:false,registration:null,waiting:null};
function pmdOfferUpdate(worker){
  pmdShell.waiting=worker;let el=document.getElementById('pcUpdate');if(el)return;
  el=document.createElement('div');el.id='pcUpdate';el.className='pc-update';el.setAttribute('role','status');el.innerHTML='<p><strong>A PMD update is ready.</strong><br>Your current session will stay open until you choose to update.</p><div class="pc-two"><button class="btn" id="pcUpdateLater">Later</button><button class="btn btn-primary" id="pcUpdateReview">Review update</button></div>';document.body.append(el);
  document.getElementById('pcUpdateLater').onclick=()=>el.remove();document.getElementById('pcUpdateReview').onclick=pmdReviewUpdate;
}
function pmdReviewUpdate(){
  document.getElementById('pcUpdate')?.remove();
  pmdSheet('Update PMD','<p>Updating reloads the application. In Session Mode, reloading clears the current program. Download a backup and confirm that you have it before continuing.</p><p>Trusted Device Mode will finish a validated device save first. Close other PMD tabs or windows before applying an update.</p><button class="btn pc-wide" data-backup>Download Program Backup</button><label class="pc-check"><input type="checkbox" id="pcUpdateConsent"> I have a backup or accept clearing this session.</label><p id="pcUpdateError" role="alert"></p>','<button class="btn" data-close-sheet>Keep working</button><button class="btn btn-primary" id="pcApplyUpdate">Update & reload</button>');
  document.getElementById('pcApplyUpdate').onclick=async()=>{
    if(!document.getElementById('pcUpdateConsent').checked){document.getElementById('pcUpdateError').textContent='Confirm your backup before reloading.';return;}
    if(pmdDevice.enabled&&!await pmdSaveDevice()){document.getElementById('pcUpdateError').textContent='Device save failed. Export a backup and resolve the save error first.';return;}
    const worker=pmdShell.registration?.waiting||pmdShell.waiting;if(!worker){document.getElementById('pcUpdateError').textContent='No update is waiting. Check again from More.';return;}
    pmdShell.applyRequested=true;worker.postMessage({type:'PMD_ACTIVATE'});
  };
}
async function pmdCheckUpdate(){
  if(!pmdShell.registration){toast(location.protocol==='file:'?'Open the hosted application for install and update support.':'Offline support is unavailable in this browser.','info');return;}
  try{await pmdShell.registration.update();if(pmdShell.registration.waiting)pmdOfferUpdate(pmdShell.registration.waiting);else toast('Update check requested. PMD will show an offer when a new shell is ready.','info');}catch{toast('Cannot check for an update while offline. The cached application remains available.','info');}
}
async function pmdInitShell(){
  if(location.protocol==='file:'||!('serviceWorker'in navigator)){pmdStorageStatus();return;}
  try{
    const reg=pmdShell.registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
    if(reg.waiting)pmdOfferUpdate(reg.waiting);
    reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)pmdOfferUpdate(reg.waiting||worker);});});
    await navigator.serviceWorker.ready;pmdShell.ready=true;pmdStorageStatus();
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(pmdShell.applyRequested){_hasUnsavedChanges=false;location.reload();}});
    navigator.serviceWorker.addEventListener('message',event=>{if(event.data?.type==='PMD_UPDATE_BLOCKED'){pmdShell.applyRequested=false;const error=document.getElementById('pcUpdateError');if(error)error.textContent='Another PMD window is open. Close it and try again.';}});
  }catch{pmdShell.failed=true;pmdStorageStatus();}
}
pmdStorageStatus();pmdInitShell();
// Block editing only while reading a previously opted-in program, preventing a
// slow restore from overwriting input made during startup.
const pmdBoot=document.createElement('div');pmdBoot.className='pc-boot';pmdBoot.setAttribute('role','status');pmdBoot.textContent='Opening workspace…';document.body.append(pmdBoot);
const pmdBootSurfaces=['app','pcHeader','pcNav'].map(id=>document.getElementById(id));pmdBootSurfaces.forEach(el=>el.inert=true);
Promise.race([pmdInitDevice(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Device storage did not respond.')),8000))]).catch(e=>{pmdDevice.restoreCancelled=true;toast(e.message+' Reload before editing a saved device program.','error');}).finally(()=>{pmdBoot.remove();if(document.getElementById('pcSheet').hidden)pmdBootSurfaces.forEach(el=>el.inert=false);performance.mark('pmd-program-ready');});
