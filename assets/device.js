/* Opt-in device storage. This preference is deliberately outside Program Backups.
   One atomic IndexedDB record keeps current + previous validated backups. */
'use strict';
const pmdDevice={enabled:false,state:'Session Mode',db:null,revision:0,timer:null,chain:Promise.resolve(),generation:0,recovery:null,lastSaved:null};
const PMD_DEVICE_DB='pmd-trusted-device:'+new URL('.',location.href).pathname;
const PMD_DEVICE_STORE='program';
function pmdStorageStatus(){
  const offline=!navigator.onLine, shell=location.protocol==='file:'?'Local files':pmdShell.ready?'Offline ready':pmdShell.failed?'Offline shell unavailable':'Preparing offline shell';
  const state=pmdDevice.enabled?pmdDevice.state:'Session Mode';
  const mobile=document.getElementById('pcSaveState');if(mobile){mobile.textContent=(offline?'Offline · ':'')+state+'\n'+shell;mobile.title=shell+' · '+state;}
  const desktop=document.getElementById('pmdConnection');if(desktop)desktop.textContent=(offline?'Offline · ':'')+shell+' · '+state;
  const warning=document.querySelector('.data-warning');if(warning)warning.textContent=pmdDevice.enabled?'Trusted Device Mode · '+pmdDevice.state+' · Keep a separate Program Backup':'Session Mode · Data lives in memory — export a Program Backup before closing';
}
function pmdOpenDB(create){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(PMD_DEVICE_DB,1);
    request.onupgradeneeded=()=>{if(!create){request.transaction.abort();return;}request.result.createObjectStore(PMD_DEVICE_STORE);};
    request.onerror=()=>reject(request.error||Error('Device database unavailable.'));
    request.onblocked=()=>reject(Error('Close other PMD windows, then try again.'));
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();pmdDevice.db=null;pmdDevice.enabled=false;pmdDevice.state='Device storage changed';pmdStorageStatus();};resolve(db);};
  });
}
function pmdReadDevice(db){return new Promise((resolve,reject)=>{const tx=db.transaction(PMD_DEVICE_STORE,'readonly'),r=tx.objectStore(PMD_DEVICE_STORE).get('active');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
function pmdDeviceError(error){pmdDevice.state='Save failed — export now';pmdStorageStatus();toast('Device save failed. Your current program remains in memory. Export a backup. '+(error?.message||''),'error');}
function pmdScheduleSave(){
  if(!pmdDevice.enabled)return;pmdDevice.state='Changes not yet saved';pmdStorageStatus();clearTimeout(pmdDevice.timer);
  pmdDevice.timer=setTimeout(()=>pmdSaveDevice(),650);
}
function pmdSaveDevice(){
  clearTimeout(pmdDevice.timer);const generation=pmdDevice.generation;
  pmdDevice.chain=pmdDevice.chain.catch(()=>{}).then(async()=>{
    if(!pmdDevice.enabled||generation!==pmdDevice.generation)return false;
    try{
      pmdDevice.state='Saving on this device…';pmdStorageStatus();
      const backup=pmdBackup();pmdBuildImport(backup);const revision=PMD_COMPANION.revision;
      const db=pmdDevice.db||(pmdDevice.db=await pmdOpenDB(true));
      if(!pmdDevice.enabled||generation!==pmdDevice.generation)return false;
      await new Promise((resolve,reject)=>{
        const tx=db.transaction(PMD_DEVICE_STORE,'readwrite'),store=tx.objectStore(PMD_DEVICE_STORE),get=store.get('active');let conflict=false;
        get.onsuccess=()=>{
          const current=get.result;
          if((current?.revision||0)!==pmdDevice.revision){conflict=true;tx.abort();return;}
          let previous=null;
          // Recovery must not promote a corrupt current slot into the fallback.
          for(const candidate of [current?.current,current?.previous]){if(!candidate)continue;try{pmdBuildImport(candidate);previous=candidate;break;}catch{}}
          store.put({format:1,revision:pmdDevice.revision+1,savedAt:new Date().toISOString(),current:backup,previous},'active');
        };
        tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Unable to commit device save.'));tx.onabort=()=>reject(Error(conflict?'Another PMD window changed the saved program. Export this session, then reopen PMD.':'Device save was not committed.'));
      });
      pmdDevice.revision++;pmdDevice.lastSaved=new Date();pmdDevice.state='Saved on this device';pmdDevice.savedRevision=revision;pmdStorageStatus();
      if(PMD_COMPANION.revision!==revision)pmdScheduleSave();return true;
    }catch(e){pmdDeviceError(e);return false;}
  });return pmdDevice.chain;
}
function pmdOpenDevice(){
  const available=location.protocol!=='file:'&&!!window.indexedDB;
  pmdSheet('Data mode & device storage','<div class="pc-status-card"><strong>'+esc(pmdDevice.enabled?'Trusted Device Mode':'Session Mode')+'</strong><p>'+esc(pmdDevice.enabled?pmdDevice.state:'No automatic program storage. Export before closing this tab or app.')+'</p></div><h3>Session Mode</h3><p>Your program stays in memory. Program Backup files are saved only when you request them.</p><h3>Trusted Device Mode</h3><p>Opt in only on a device and browser you trust. PMD saves this program in this browser’s IndexedDB, with one previous save for recovery. No account, server storage, or synchronization.</p><p>Anyone with access to this browser profile may access the program. PMD does not encrypt it. The browser or operating system can clear stored data; device storage is not a substitute for a separate backup.</p>'+(available?'':'<p class="pmd-note">Device saving requires the hosted app or localhost. Session Mode remains available from local files.</p>')+(pmdDevice.lastSaved?'<p>Last device save: '+esc(pmdDevice.lastSaved.toLocaleString())+'</p>':'')+(pmdDevice.recovery?'<p class="pmd-note">A saved program needs recovery. It has not replaced this session.</p><button class="btn pc-wide" data-recover-device>Review saved program recovery</button>':'')+'<button class="btn pc-wide" data-backup>Download Program Backup</button>',pmdDevice.enabled?'<button class="btn btn-danger" data-disable-device>Disable & clear device copy…</button>':available?'<button class="btn btn-primary" data-enable-device>Enable on this trusted device…</button>':'');
}
async function pmdEnableDevice(){
  pmdSheet('Enable Trusted Device Mode','<p>PMD will automatically save the active program and one previous save in this browser. This is an explicit change from Session Mode.</p><label class="pc-check"><input type="checkbox" id="pcTrustConsent"> I trust this device and want it to retain this program.</label><p id="pcDeviceError" role="alert"></p>','<button class="btn" data-close-sheet>Cancel</button><button class="btn btn-primary" data-confirm-device>Enable device saving</button>');
}
async function pmdConfirmDevice(){
  if(!document.getElementById('pcTrustConsent')?.checked){document.getElementById('pcDeviceError').textContent='Confirm that you want this device to retain the program.';return;}
  try{
    const db=pmdDevice.db||(pmdDevice.db=await pmdOpenDB(true)),existing=await pmdReadDevice(db);
    if(existing){pmdDevice.recovery=existing;pmdRecoverDevice();return;}
    pmdDevice.enabled=true;pmdDevice.generation++;const saved=await pmdSaveDevice();
    if(saved){navigator.storage?.persist?.().catch(()=>{});pmdOpenDevice();}else pmdOpenDevice();
  }catch(e){pmdDeviceError(e);}
}
async function pmdDisableDevice(){
  pmdSheet('Clear the saved device copy','<p>This removes the current and previous saved program from this browser. The current in-memory session remains open. Other devices and downloaded backup files are unaffected.</p><p>Export a backup first if you need to keep this program.</p>','<button class="btn" data-close-sheet>Cancel</button><button class="btn btn-danger" data-confirm-clear-device>Clear saved program</button>');
}
async function pmdClearDevice(){
  const wasEnabled=pmdDevice.enabled;pmdDevice.enabled=false;pmdDevice.generation++;clearTimeout(pmdDevice.timer);await pmdDevice.chain.catch(()=>{});
  try{
    const db=pmdDevice.db||(pmdDevice.db=await pmdOpenDB(false));
    await new Promise((resolve,reject)=>{const tx=db.transaction(PMD_DEVICE_STORE,'readwrite');tx.objectStore(PMD_DEVICE_STORE).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
    pmdDevice.revision=0;pmdDevice.recovery=null;pmdDevice.lastSaved=null;pmdDevice.state='Session Mode';pmdStorageStatus();pmdOpenDevice();toast('Saved device program cleared. This session is still open.','success');
  }catch(e){pmdDevice.enabled=wasEnabled;pmdDeviceError(e);}
}
function pmdRecoverDevice(){
  const saved=pmdDevice.recovery;let current=null,previous=null;
  try{if(saved?.format!==1)throw Error('Unknown device format');current=pmdBuildImport(saved.current);}catch{}
  try{if(saved?.format!==1)throw Error('Unknown device format');previous=pmdBuildImport(saved.previous);}catch{}
  pmdSheet('Saved program recovery','<p>The saved program has not replaced your current session. Export this session before restoring if you need it.</p><p>'+ (current?'The current saved backup validates.': 'The current saved backup could not be validated.')+'</p><p>'+(previous?'A previous validated backup is available.':'No valid previous backup is available.')+'</p><p>Clearing removes both saved copies and keeps this session.</p>',(current?'<button class="btn btn-primary" data-restore-device="current">Restore saved program</button>':'')+(previous?'<button class="btn" data-restore-device="previous">Restore previous save</button>':'')+'<button class="btn btn-danger" data-disable-device>Clear device copy…</button>');
}
function pmdRestoreDevice(which){
  try{const saved=pmdDevice.recovery,prepared=pmdBuildImport(saved[which]);pmdDevice.revision=saved.revision||0;pmdDevice.enabled=false;pmdCommitImport(prepared);pmdDevice.enabled=true;pmdDevice.generation++;pmdDevice.recovery=null;pmdDevice.lastSaved=new Date(saved.savedAt);pmdDevice.savedRevision=PMD_COMPANION.revision;pmdDevice.state=which==='previous'?'Previous save restored':'Saved on this device';pmdCloseSheet();pmdStorageStatus();if(which==='previous')pmdScheduleSave();}
  catch(e){pmdDeviceError(e);}
}
async function pmdInitDevice(){
  // Merely opening a database can create storage. Do not do that on a fresh
  // Session Mode launch. Unsupported enumeration requires manual opt-in.
  if(location.protocol==='file:'||!window.indexedDB||!indexedDB.databases)return;
  try{
    const databases=await indexedDB.databases();if(!databases.some(x=>x.name===PMD_DEVICE_DB))return;
    const db=pmdDevice.db=await pmdOpenDB(false),saved=await pmdReadDevice(db);if(!saved)return;
    if(saved.format!==1||!Number.isSafeInteger(saved.revision)){pmdDevice.recovery=saved;pmdRecoverDevice();return;}
    let prepared;try{prepared=pmdBuildImport(saved.current);}catch{pmdDevice.recovery=saved;pmdRecoverDevice();return;}
    // Automatic restore is allowed only by the previous explicit opt-in.
    if(pmdDevice.restoreCancelled)return;
    pmdCommitImport(prepared);pmdDevice.enabled=true;pmdDevice.revision=saved.revision;pmdDevice.lastSaved=new Date(saved.savedAt);pmdDevice.savedRevision=PMD_COMPANION.revision;pmdDevice.state='Saved on this device';pmdStorageStatus();
  }catch(e){pmdDevice.state='Saved data could not be read';pmdStorageStatus();toast('Saved device data could not be opened. Session Mode is available. '+e.message,'error');}
}
async function pmdShareBackup(){
  try{const backup=pmdBackup();pmdBuildImport(backup);const file=new File([JSON.stringify(backup,null,2)],'PMD-Program-Backup-'+todayStr()+'.json',{type:'application/json'});
    if(navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({files:[file],title:'PMD Program Backup'});toast('Backup sent to the selected share destination.','success');}
    else exportAllData();
  }catch(e){if(e.name!=='AbortError')toast('Sharing unavailable. Use Download Program Backup.','error');}
}
document.addEventListener('click',e=>{
  const d=e.target.closest('button')?.dataset;if(!d)return;
  if('enableDevice'in d)pmdEnableDevice();if('confirmDevice'in d)pmdConfirmDevice();if('disableDevice'in d)pmdDisableDevice();if('confirmClearDevice'in d)pmdClearDevice();if('recoverDevice'in d)pmdRecoverDevice();if(d.restoreDevice)pmdRestoreDevice(d.restoreDevice);
});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&pmdDevice.enabled)pmdSaveDevice();});
window.addEventListener('pagehide',()=>{if(pmdDevice.enabled)pmdSaveDevice();});
window.addEventListener('online',pmdStorageStatus);window.addEventListener('offline',pmdStorageStatus);
// Start after pwa.js has established the shell status object.
