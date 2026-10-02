/* Shared daily review and data-safety workflows. UI state stays in memory. */
'use strict';
const PMD_REVIEW={kind:'attention',owner:'',module:'',query:'',page:0,pageSize:30,returnTo:false};
const PMD_BACKUP_RECEIPT={requestedAt:null,requestedRevision:null,confirmedRevision:null};

function pmdRequestCloseSheet(){
  if(!PMD_COMPANION.formDirty){pmdCloseSheet();return;}
  if(document.getElementById('pcDiscard')){document.getElementById('pcKeepEditing').focus();return;}
  const el=document.createElement('div');el.id='pcDiscard';el.className='pc-discard';el.setAttribute('role','alert');
  el.innerHTML='<strong>You have unfinished changes.</strong><p>Keep editing or discard this form. Nothing has been saved from it yet.</p><div class="pc-two"><button class="btn btn-primary" id="pcKeepEditing">Keep editing</button><button class="btn" id="pcDiscardForm">Discard changes</button></div>';
  document.querySelector('#pcSheet .pc-sheet-body').prepend(el);
  document.getElementById('pcKeepEditing').onclick=()=>{el.remove();document.querySelector('#pcQuickTitle,#pcAppendNote')?.focus();};
  document.getElementById('pcDiscardForm').onclick=()=>{PMD_COMPANION.formDirty=false;pmdCloseSheet();};
  document.getElementById('pcKeepEditing').focus();
}
document.addEventListener('input',event=>{if(event.target.closest('#pcQuickForm')||event.target.id==='pcAppendNote')PMD_COMPANION.formDirty=true;});
document.addEventListener('change',event=>{if(event.target.closest('#pcQuickForm'))PMD_COMPANION.formDirty=true;});
window.addEventListener('beforeunload',event=>{if(PMD_COMPANION.formDirty&&!document.getElementById('pcSheet').hidden){event.preventDefault();event.returnValue='';}});

function pmdReviewEntries(){
  let rows;
  if(PMD_REVIEW.kind==='attention'||PMD_REVIEW.kind==='upcoming')rows=(PMD_REVIEW.kind==='attention'?pmdAttention():pmdUpcoming()).flatMap(x=>{const m=pmdModule(x.module),record=pmdFind({module:m.array,id:x.id});return record?[{array:m.array,module:m.key,record,reason:x.reason}]:[];});
  else rows=pmdEnabledModules().flatMap(m=>pmdMobileCollections(m.key)).filter(e=>PMD_REVIEW.kind==='all'||!pmdClosed(e.module,e.record));
  const q=PMD_REVIEW.query.toLocaleLowerCase().trim();
  return rows.filter(e=>(!PMD_REVIEW.module||e.module===PMD_REVIEW.module)&&(!PMD_REVIEW.owner||pmdOwner(e.record)===PMD_REVIEW.owner)&&(!q||[pmdTitle(e.record),pmdId(e.array,e.record.id),pmdOwner(e.record),e.reason||''].join(' ').toLocaleLowerCase().includes(q)));
}
function pmdOpenQueue(kind){PMD_REVIEW.kind=kind;PMD_REVIEW.page=0;PMD_REVIEW.owner=PMD_REVIEW.module=PMD_REVIEW.query='';pmdOpenReview();}
function pmdOpenReview(){
  PMD_REVIEW.returnTo=true;
  const owners=[...new Set(pmdEnabledModules().flatMap(m=>pmdMobileCollections(m.key)).map(e=>pmdOwner(e.record)).filter(Boolean))].sort();
  const options=(entries,value)=>entries.map(([key,label])=>'<option value="'+esc(key)+'" '+(key===value?'selected':'')+'>'+esc(label)+'</option>').join('');
  pmdSheet('Review work','<p class="pmd-muted">Review attention items, upcoming work, or any record.</p><div class="pc-review-filters"><div class="form-group"><label for="pcReviewKind">View</label><select id="pcReviewKind">'+options([['attention','Needs attention'],['upcoming','Coming up'],['open','Open / active'],['all','All records']],PMD_REVIEW.kind)+'</select></div><div class="form-group"><label for="pcReviewModule">Module</label><select id="pcReviewModule">'+options([['','All enabled modules'],...pmdEnabledModules().filter(m=>m.array).map(m=>[m.key,pmdName(m.key)])],PMD_REVIEW.module)+'</select></div>'+pmdSelect('pcReviewOwner','Owner',['',...owners],PMD_REVIEW.owner)+'</div>'+pmdInput('pcReviewQuery','Find in this view',PMD_REVIEW.query,'search')+'<div id="pcReviewResults" aria-live="polite"></div>');
  document.querySelector('#pcReviewOwner option').textContent='Any owner';
  // Keep records above the fold on phones; desktop retains immediately visible filters.
  const filters=document.querySelector('.pc-review-filters'),kind=document.getElementById('pcReviewKind').closest('.form-group'),query=document.getElementById('pcReviewQuery').closest('.form-group');
  filters.before(kind);const drawer=document.createElement('details');drawer.id='pcReviewFilters';drawer.className='pc-review-filter-drawer';drawer.open=!pmdPhone()||!!(PMD_REVIEW.owner||PMD_REVIEW.module||PMD_REVIEW.query);
  const summary=document.createElement('summary');summary.textContent='Filters · '+(PMD_REVIEW.owner||'Any owner')+' · '+(PMD_REVIEW.module?pmdName(PMD_REVIEW.module):'All modules');drawer.append(summary);filters.before(drawer);drawer.append(filters,query);
  pmdRenderReviewResults();
}
function pmdRenderReviewResults(){
  const rows=pmdReviewEntries(),pages=Math.max(1,Math.ceil(rows.length/PMD_REVIEW.pageSize));PMD_REVIEW.page=Math.min(PMD_REVIEW.page,pages-1);
  document.getElementById('pcReviewResults').innerHTML='<div class="pc-list-summary"><strong>'+rows.length+' matching records</strong><span>Page '+(PMD_REVIEW.page+1)+' of '+pages+'</span></div><div class="pc-review-grid">'+rows.slice(PMD_REVIEW.page*PMD_REVIEW.pageSize,(PMD_REVIEW.page+1)*PMD_REVIEW.pageSize).map(e=>pmdCard(e,e.reason)).join('')+'</div>'+(!rows.length?'<p class="pc-empty">No records match this view. Missing dates or unconfigured statuses are not performance results.</p>':'')+'<div class="pc-pagination"><button class="btn" data-review-page="-1" '+(!PMD_REVIEW.page?'disabled':'')+'>Previous</button><button class="btn" data-review-page="1" '+(PMD_REVIEW.page>=pages-1?'disabled':'')+'>Next</button></div>';
}
function pmdBackupRequested(){PMD_BACKUP_RECEIPT.requestedAt=new Date();PMD_BACKUP_RECEIPT.requestedRevision=PMD_COMPANION.revision;}
function pmdOpenBackupCenter(){
  const receipt=PMD_BACKUP_RECEIPT,current=receipt.confirmedRevision===PMD_COMPANION.revision;
  pmdSheet('Backup & recovery','<div class="pc-status-card"><strong>'+esc(current?'Backup confirmed for current changes':receipt.requestedAt?'Download requested — verify your file':'No backup confirmed in this session')+'</strong><p>A download request cannot tell PMD whether the browser saved the file. Keep a separate copy even when device saving is enabled.</p></div><div class="pc-two"><button class="btn btn-primary" data-backup>Download backup</button><button class="btn" data-share>Share backup</button></div><p class="pmd-muted">Backups contain your complete program and retained history. Filenames omit the program name. Store them only in an appropriate location.</p><button class="btn pc-wide" id="pcConfirmBackup" '+(receipt.requestedRevision===null?'disabled':'')+'>I verified the downloaded file is saved</button><h3>Check a backup without replacing this program</h3><p>Validates the file and compares its program content with this workspace. Nothing is imported.</p><label for="pcVerifyBackup">Backup JSON to check</label><input type="file" id="pcVerifyBackup" accept=".json,application/json"><p id="pcVerifyResult" role="status"></p><div class="pc-two"><button class="btn" data-import>Import a backup…</button><button class="btn" data-device>Device storage & recovery</button></div><h3>Workspace checks</h3><p id="pcIntegritySummary"></p><button class="btn pc-wide" id="pcCheckIntegrity">Check structure and references</button>');
  document.getElementById('pcConfirmBackup').onclick=()=>{
    if(receipt.requestedRevision!==PMD_COMPANION.revision){toast('The program changed after that download. Download a fresh backup to cover these changes.','info');return;}
    receipt.confirmedRevision=PMD_COMPANION.revision;markSaved();pmdOpenBackupCenter();
  };
  document.getElementById('pcVerifyBackup').onchange=async event=>{
    const file=event.target.files[0],result=document.getElementById('pcVerifyResult');if(!file)return;
    try{if(file.size>50*1024*1024)throw Error('Backup exceeds 50 MB.');const data=JSON.parse(await file.text()),prepared=pmdBuildImport(data);const match=pmdStableProgram(data)===pmdStableProgram(pmdBackup());result.textContent='Valid backup · '+Object.keys(PMD_COUNTERS).reduce((n,k)=>n+prepared.state[k].length,0)+' records. '+(match?'Program content matches this workspace.':'Program content differs from this workspace.')+' Nothing was imported.';}catch{result.textContent='This file did not pass backup validation. Your workspace was not changed.';}
  };
  document.getElementById('pcCheckIntegrity').onclick=()=>{const issues=runFkIntegritySweep();for(const key of ['racks','boms'])try{pmdValidateHierarchy(appState[key],key,key==='racks'?8:100);}catch(e){issues.push(e.message);}document.getElementById('pcIntegritySummary').textContent=issues.length?issues.length+' issue(s). Open Home → Data integrity for details.':'No missing references or hierarchy cycles found. This does not assess program completeness.';};
}
function pmdStableProgram(backup){
  const sort=value=>Array.isArray(value)?value.map(sort):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,sort(value[k])])):value;
  return JSON.stringify(sort({state:backup.state,counters:backup.counters,auditTrail:backup.auditTrail,session:backup.session}));
}
function pmdImportPreview(prepared,count){
  const rows=Object.keys(PMD_COUNTERS).flatMap(array=>{
    const before=new Map(appState[array].map(r=>[r.id,r])),after=new Map(prepared.state[array].map(r=>[r.id,r]));
    if(!before.size&&!after.size)return [];
    let added=0,changed=0,removed=0;for(const [id,r] of after){if(!before.has(id))added++;else if(JSON.stringify(before.get(id))!==JSON.stringify(r))changed++;}for(const id of before.keys())if(!after.has(id))removed++;
    return ['<tr><td>'+esc(pmdModule(array)?pmdName(pmdModule(array).key):pmdReadableKey(array))+'</td><td>'+before.size+' → '+after.size+'</td><td>'+added+'</td><td>'+changed+'</td><td>'+removed+'</td></tr>'];
  });
  return '<p><strong>'+esc(prepared.state.settings.programName||'Unnamed program')+'</strong> · '+count+' records</p><p>This replaces program records, settings, relationships and retained history. Export first to keep a separate copy. Undo can restore the prior workspace during this session.</p>'+(typeof pmdDevice!=='undefined'&&pmdDevice.enabled?'<p class="pmd-note">Trusted Device Mode will save the imported program on this browser after replacement.</p>':'')+prepared.warnings.map(w=>'<p class="pmd-note">'+esc(w)+'</p>').join('')+'<details><summary>Review record changes</summary><p class="pmd-muted">Compared by collection and ID. This is a replacement preview, not a merge. Changed counts include any field difference.</p><div class="pmd-table-wrap"><table class="pmd-table"><thead><tr><th>Collection</th><th>Records</th><th>Added</th><th>Changed</th><th>Removed</th></tr></thead><tbody>'+rows.join('')+'</tbody></table></div></details>';
}
document.addEventListener('click',event=>{
  const d=event.target.closest('button')?.dataset;if(!d)return;
  if('reviewWork'in d)pmdOpenReview();
  if('backupCenter'in d)pmdOpenBackupCenter();
  if(d.reviewPage){PMD_REVIEW.page+=Number(d.reviewPage);pmdRenderReviewResults();document.querySelector('#pcSheet .pc-sheet-body').scrollTop=0;}
  if('backReview'in d)pmdOpenReview();
  if('backup'in d&&document.getElementById('pcConfirmBackup'))document.getElementById('pcConfirmBackup').disabled=false;
});
let reviewTimer;
document.addEventListener('input',event=>{if(event.target.id==='pcReviewQuery'){clearTimeout(reviewTimer);reviewTimer=setTimeout(()=>{if(!document.getElementById('pcReviewResults'))return;PMD_REVIEW.query=event.target.value;PMD_REVIEW.page=0;pmdRenderReviewResults();},150);}});
document.addEventListener('change',event=>{const key={pcReviewKind:'kind',pcReviewModule:'module',pcReviewOwner:'owner'}[event.target.id];if(key){PMD_REVIEW[key]=event.target.value;PMD_REVIEW.page=0;pmdRenderReviewResults();}});
// Reuse record detail and quick editors, including a route back to the filtered queue.
const pmdReviewDetail=pmdOpenMobileRecord;
pmdOpenMobileRecord=function(array,id){pmdReviewDetail(array,id);if(PMD_REVIEW.returnTo&&document.querySelector('#pcSheet .pc-sheet-body')){const back=document.createElement('button');back.className='btn pc-wide';back.dataset.backReview='';back.textContent='← Back to review';document.querySelector('#pcSheet .pc-sheet-body').prepend(back);}};
// Desktop shortcuts use the same sheets, without changing its dense registers.
const reviewBar=document.createElement('div');reviewBar.className='pc-workspace-tools';reviewBar.innerHTML='<button class="btn btn-sm" data-review-work>Review work</button><button class="btn btn-sm" data-backup-center>Backup & recovery</button>';document.querySelector('.sidebar-footer').prepend(reviewBar);
