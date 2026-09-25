/* PMD companion presentation. Uses the V10 model, validators, audit, undo and editors.
   No separate mobile dataset. All navigation and list limits are session UI state. */
'use strict';
const PMD_COMPANION = {
  query: '', page: 0, filters: {}, searchIndex: null, revision: 0,
  detail: null, lastFocus: null, desktopOnPhone: false, pageSize: 40
};
const PMD_QUICK = {
  actions: { title:'title', owner:'assignee', date:'due', status:'status', list:'actionStatuses', priority:'priority', priorities:'actionPriorities', notes:'description', edit:'openEditActionModal' },
  risks: { title:'title', owner:'owner', date:'due', status:'status', list:'riskStatuses', notes:'description', edit:'openEditRiskModal' },
  decisions: { title:'title', owner:'decisionMaker', date:'reviewDate', dateLabel:'Review date', status:'status', list:'decisionStatuses', notes:'description', edit:'openEditDecisionModal' },
  milestones: { title:'title', owner:'owner', date:'date', dateLabel:'Target date', status:'status', list:'milestoneStatuses', notes:'description', edit:'openEditMilestoneModal' },
  anomalies: { title:'title', owner:'reportedBy', status:'status', list:'anomalyStatuses', priority:'severity', priorities:'anomalySeverities', notes:'description', edit:'openAnomModal' },
  procurement: { title:'itemName', owner:'requester', date:'dateNeeded', dateLabel:'Date needed', status:'status', list:'procurementStatuses', notes:'notes', edit:'openPurchaseModal' },
  lessons: { title:'title', owner:'contributor', notes:'description', edit:'openEditLessonModal' },
  requirements: { title:'title', owner:'owner', status:'verStatus', list:'requirementStatuses', priority:'priority', priorities:'requirementPriorities', notes:'description', edit:'openEditReqModal', editOnly:true },
  tests: { title:'title', owner:'tester', date:'scheduledDate', dateLabel:'Scheduled date', status:'result', list:'testResults', notes:'notes', edit:'openEditTestModal', editOnly:true },
  inventory: { title:'itemName', status:'status', list:'invStatuses', notes:'notes', edit:'openEditInvModal', editOnly:true },
  boms: { title:'partName', status:'status', list:'bomStatuses', notes:'notes', edit:'openEditBomModal', editOnly:true },
  evm: { title:'name', owner:'owner', status:'status', list:'evmStatuses', notes:'description', edit:'openEditEvmModal', editOnly:true },
  changes: { title:'title', owner:'requestor', status:'status', list:'changeStatuses', priority:'priority', priorities:'changePriorities', notes:'description', edit:'openEditChangeModal', editOnly:true },
  costTracker: { title:'title', owner:'owner', notes:'notes', edit:'openCostModal', editOnly:true },
  tradeStudies: { title:'title', owner:'lead', date:'dueDate', status:'status', list:'tradeStatuses', notes:'notes', edit:'openTradeModal', editOnly:true }
};
const PMD_EDITORS = {
  assemblies:'openStructureEditor', costTracker:'openCostModal', requirements:'openEditReqModal', tests:'openEditTestModal', changes:'openEditChangeModal', boms:'openEditBomModal', inventory:'openEditInvModal', hwItems:'openEditHwModal', swItems:'openEditSwModal', evm:'openEditEvmModal', tradeStudies:'openTradeModal', actionPlan:'apOpenCardEdit'
};
// Mobile field metadata extends the existing import validator for the same model.
PMD_TEXT_FIELDS=[...new Set(PMD_TEXT_FIELDS.concat(Object.values(PMD_QUICK).flatMap(c=>['title','owner','date','status','priority'].map(k=>c[k]).filter(Boolean)),['swName','softwareName','docNumber']))];
const PMD_MOBILE_QUERY='(max-width: 700px), (max-width: 950px) and (max-height: 500px) and (pointer: coarse)';
function pmdPhone(){ return matchMedia(PMD_MOBILE_QUERY).matches && !PMD_COMPANION.desktopOnPhone; }
function pmdOwner(r){ return r.owner || r.assignee || r.requester || r.decisionMaker || r.tester || r.reportedBy || r.reporter || r.requestor || r.lead || r.contributor || ''; }
function pmdDate(r){ return r.due || r.dueDate || r.targetDate || r.dateNeeded || r.date || r.eta || r.scheduledDate || r.reviewDate || ''; }
function pmdStatus(r){ return r.status || r.result || r.verStatus || ''; }
function pmdInvalidate(){ PMD_COMPANION.revision++; PMD_COMPANION.searchIndex=null; }
function pmdEnabledModules(){return PMD_MODULES.filter(m=>pmdEnabled(m.key)).sort((a,b)=>appState.settings.modules[a.key].order-appState.settings.modules[b.key].order);}
function pmdMobileCollections(key){
  const m=pmdModule(key); if(!m?.array)return [];
  const arrays=[m.array]; if(key==='hwItems')arrays.push('swItems'); if(key==='links')arrays.push('specifications'); if(key==='actionPlan')arrays.push('actionPlanLanes');
  return arrays.flatMap(array=>(appState[array]||[]).map(record=>({array,record,module:key})));
}
function pmdCard(entry,reason){
  const r=entry.record, m=entry.module, a=entry.array;
  const status=pmdStatus(r),owner=pmdOwner(r),date=pmdDate(r);
  let meta=[status||'Status not set',r.priority||r.severity].filter(Boolean).join(' · ');
  if(m==='risks'){const c=pmdAssess(r);meta+=(c.hasAny?' · '+c.severity+' ('+c.sum+')':' · Unscored');}
  return '<button class="pc-record" data-open-array="'+a+'" data-open-id="'+r.id+'"><span class="pc-record-id">'+esc(pmdId(a,r.id))+' <span>'+esc(pmdName(m))+'</span></span><strong>'+esc(pmdTitle(r))+'</strong><span class="pc-record-meta">'+esc(reason||meta)+'</span><span class="pc-record-bottom">'+esc(owner||'Owner not set')+(date?'<span>'+esc(fmtDate(date))+'</span>':'')+'</span></button>';
}
function pmdMobileHome(){
  const area=document.getElementById('contentArea'), entries=pmdEnabledModules().flatMap(m=>pmdMobileCollections(m.key));
  const attention=pmdAttention(), upcoming=pmdUpcoming();
  const attentionKnown=entries.some(e=>pmdStatus(e.record)||pmdDate(e.record)||e.record.priority||(e.module==='risks'&&pmdAssess(e.record).hasAny));
  const upcomingKnown=entries.some(e=>['actions','milestones','procurement','tests','risks','changes'].includes(e.module)&&pmdDate(e.record));
  const section=(name,list,empty)=>'<section class="pc-section"><div class="pc-section-heading"><h2>'+name+'</h2><span>'+list.length+'</span></div>'+(list.length?list.slice(0,5).map(x=>{const m=pmdModule(x.module),r=pmdFind({module:m.array,id:x.id});return r?pmdCard({array:m.array,module:m.key,record:r},x.reason):'';}).join('')+(list.length>5?'<button class="btn pc-wide" data-queue="'+(name==='Needs attention'?'attention':'upcoming')+'">View all '+list.length+'</button>':''):'<p class="pc-empty-line">'+empty+'</p>')+'</section>';
  let html='<div class="pc-page-title"><p class="pmd-eyebrow">PROGRAM COMPANION</p><h1>'+esc(appState.settings.programName||'Your workspace')+'</h1><p class="pmd-muted">'+esc(appState.settings.subtitle||'A clear view. A quick next step.')+'</p></div>';
  if(!entries.length){
    html+='<section class="pc-welcome"><span class="pc-welcome-mark" aria-hidden="true">P</span><h2>Make room for your program.</h2><p>PMD starts blank. Add your first item, import a backup, or choose the modules that fit your work.</p><button class="btn btn-primary pc-wide" data-start-blank>Start Blank</button><div class="pc-two"><button class="btn" data-setup>Program setup</button><button class="btn" data-import>Import backup</button></div><p class="pmd-muted">Session Mode · Export a backup before leaving.</p></section>';
  }else{
    html+='<div class="pc-stats"><button data-queue="attention"><strong>'+(attentionKnown?attention.length:'—')+'</strong><span>Need attention</span></button><button data-queue="upcoming"><strong>'+(upcomingKnown?upcoming.length:'—')+'</strong><span>Coming up</span></button><button data-sheet="modules"><strong>'+entries.length+'</strong><span>Records</span></button></div>';
    if(appState.settings.dashboard.attention)html+=section('Needs attention',attention,'No attention items identified in the entered records.');
    if(appState.settings.dashboard.upcoming)html+=section('Coming up',upcoming,'No upcoming dates entered for the configured window.');
    if(appState.settings.dashboard.activity)html+='<details class="pc-section"><summary>Recent activity</summary>'+appState.activityLog.slice(0,8).map(x=>'<div class="pc-activity"><strong>'+esc(x.action)+'</strong> '+esc(x.desc)+'<small>'+esc(fmtDate(x.timestamp))+'</small></div>').join('')+(appState.activityLog.length?'':'<p>No recorded activity.</p>')+'</details>';
    if(appState.settings.dashboard.overview)html+='<details class="pc-section"><summary>Program contents</summary>'+pmdEnabledModules().filter(m=>m.array).map(m=>'<button class="pc-module" data-route="'+m.key+'"><span>'+esc(pmdName(m.key))+'</span><span>'+pmdMobileCollections(m.key).length+'</span></button>').join('')+'</details>';
  }
  area.innerHTML=html; pmdMobileContext();
}
function pmdMobileContext(){
  document.getElementById('pcProgram').textContent=appState.settings.programName||'PMD Toolkit';
  document.getElementById('pcContext').textContent=currentModule==='dashboard'?'Program companion':pmdName(currentModule);
  document.querySelectorAll('.pc-nav [data-route]').forEach(b=>b.setAttribute('aria-current',currentModule===b.dataset.route?'page':'false'));
  if(typeof pmdStorageStatus==='function')pmdStorageStatus();
}
function pmdFilteredEntries(){
  const f=PMD_COMPANION.filters,q=PMD_COMPANION.query.toLocaleLowerCase();
  const structureLinks=f.structure?new Set(pmdAllRelationships().flatMap(e=>{const node={module:'racks',id:Number(f.structure)};const other=pmdSame(e.from,node)?e.to:pmdSame(e.to,node)?e.from:null;return other?[other.module+':'+other.id]:[];})):null;
  return pmdMobileCollections(currentModule).filter(e=>{
    const r=e.record;
    if(q&&!([pmdTitle(r),pmdId(e.array,r.id),pmdOwner(r),r.partNumber,r.serialNumber,r.description].join(' ').toLocaleLowerCase().includes(q)))return false;
    if(f.open&&pmdClosed(currentModule,r))return false;
    if(f.owner&&pmdOwner(r)!==f.owner)return false;
    if(f.status&&pmdStatus(r)!==f.status)return false;
    if(f.priority&&(r.priority||r.severity)!==f.priority)return false;
    if(f.overdue&&(!pmdDate(r)||pmdDate(r)>=todayStr()||pmdClosed(currentModule,r)))return false;
    if(structureLinks&&!structureLinks.has(e.array+':'+r.id))return false;
    return true;
  }).sort((a,b)=>{
    if(f.sort==='date')return (pmdDate(a.record)||'9999').localeCompare(pmdDate(b.record)||'9999');
    if(f.sort==='title')return pmdTitle(a.record).localeCompare(pmdTitle(b.record));
    return b.record.id-a.record.id;
  });
}
function pmdMobileList(){
  const m=pmdModule(currentModule),area=document.getElementById('contentArea'),all=pmdMobileCollections(currentModule),rows=pmdFilteredEntries();
  const limit=PMD_COMPANION.pageSize,pages=Math.max(1,Math.ceil(rows.length/limit));PMD_COMPANION.page=Math.min(PMD_COMPANION.page,pages-1);
  const filters=Object.entries(PMD_COMPANION.filters).filter(([k,v])=>v&&k!=='sort').length;
  const specialized=['requirements','tests','evm','boms','tradeStudies','actionPlan'].includes(currentModule);
  area.innerHTML='<div class="pc-page-title"><p class="pmd-eyebrow">'+esc(appState.settings.modules[currentModule].group)+'</p><h1>'+esc(pmdName(currentModule))+'</h1></div><div class="pc-list-tools"><input type="search" id="pcListSearch" aria-label="Search this module" placeholder="Find in '+esc(pmdName(currentModule))+'" value="'+esc(PMD_COMPANION.query)+'"><button class="btn" data-sheet="filters">Filters'+(filters?' · '+filters:'')+'</button></div>'+(specialized?'<p class="pc-desktop-hint">Review records and make individual changes here. Full matrix and bulk editing are optimized for desktop.</p>':'')+'<div class="pc-list-summary"><span>'+rows.length+' of '+all.length+' records</span><button class="btn btn-sm" data-add-current>+ Add</button></div><div id="pcRecords">'+(rows.length?rows.slice(PMD_COMPANION.page*limit,(PMD_COMPANION.page+1)*limit).map(e=>pmdCard(e)).join(''):'<div class="pc-empty"><h2>'+esc(all.length?'No matching records.':pmdEmptyMessage(currentModule))+'</h2><p>'+ (all.length?'Adjust your filters or search.':'Add an item when you are ready.')+'</p></div>')+'</div>'+(pages>1?'<div class="pc-pagination"><button class="btn" data-page="-1" '+(!PMD_COMPANION.page?'disabled':'')+'>Previous</button><span>'+(PMD_COMPANION.page+1)+' / '+pages+'</span><button class="btn" data-page="1" '+(PMD_COMPANION.page===pages-1?'disabled':'')+'>Next</button></div>':'')+(currentModule==='strategy'?'<details class="pc-section"><summary>Strategy notes (SWOT)</summary>'+Object.entries(appState.swot).map(([k,v])=>'<h3>'+esc(k)+'</h3><ul>'+v.map(x=>'<li>'+esc(typeof x==='string'?x:x.text||x.title||JSON.stringify(x))+'</li>').join('')+'</ul>').join('')+'</details>':'')+'<button class="btn pc-wide pc-desktop-toggle" data-desktop-view>Open full desktop view</button>';
  pmdMobileContext();
}
function pmdSheet(title,body,footer){
  const focus=document.activeElement;
  if(!focus?.closest('#pcSheet')&&focus!==document.body)PMD_COMPANION.lastFocus=focus;
  pmdCloseSheet(false);
  const el=document.getElementById('pcSheet');el.setAttribute('aria-label',title);
  el.innerHTML='<div class="pc-sheet-surface"><header><h2>'+esc(title)+'</h2><button class="btn-icon" data-close-sheet aria-label="Close '+esc(title)+'">×</button></header><div class="pc-sheet-body">'+body+'</div>'+(footer?'<footer>'+footer+'</footer>':'')+'</div>';
  el.hidden=false;document.getElementById('app').inert=true;document.getElementById('pcHeader').inert=true;document.getElementById('pcNav').inert=true;
  const first=el.querySelector('[autofocus]')||el.querySelector('button,input,select');first?.focus();
}
function pmdCloseSheet(restore=true){
  const el=document.getElementById('pcSheet');if(!el||el.hidden)return;
  el.hidden=true;el.innerHTML='';document.getElementById('app').inert=false;document.getElementById('pcHeader').inert=false;document.getElementById('pcNav').inert=false;
  if(restore){if(PMD_COMPANION.lastFocus?.isConnected)PMD_COMPANION.lastFocus.focus();else document.querySelector('#pcNav button')?.focus();}
}
function pmdOpenModules(){pmdSheet('Modules','<p class="pmd-muted">Your enabled modules, in your configured order.</p>'+pmdEnabledModules().map(m=>'<button class="pc-module" data-route="'+m.key+'"><span><strong>'+esc(pmdName(m.key))+'</strong><small>'+esc(appState.settings.modules[m.key].group)+'</small></span><span>'+(m.array?pmdMobileCollections(m.key).length:'›')+'</span></button>').join('')+'<button class="btn pc-wide" data-settings="modules">Manage modules</button>');}
function pmdOpenNew(){
  const keys=Object.keys(PMD_QUICK).filter(k=>pmdEnabled(k)&&!PMD_QUICK[k].editOnly);if(keys.includes(currentModule))keys.unshift(...keys.splice(keys.indexOf(currentModule),1));
  pmdSheet('Quick Add','<p class="pmd-muted">Capture the essentials. Add deeper detail whenever you need it.</p>'+keys.map(k=>'<button class="pc-module" data-quick="'+k+'"><span>'+esc(pmdName(k))+'</span><span>＋</span></button>').join('')+'<p class="pmd-muted">Other record types are available from their module.</p>');
}
function pmdOpenFilters(){
  const f=PMD_COMPANION.filters,entries=pmdMobileCollections(currentModule),values=fn=>[...new Set(entries.map(e=>fn(e.record)).filter(Boolean))].sort();
  pmdSheet('Filter '+pmdName(currentModule),'<label class="pc-check"><input id="pcFilterOpen" type="checkbox" '+(f.open?'checked':'')+'> Open / active only</label><label class="pc-check"><input id="pcFilterOverdue" type="checkbox" '+(f.overdue?'checked':'')+'> Overdue only</label>'+pmdSelect('pcFilterOwner','Owner',[''].concat(values(pmdOwner)),f.owner||'')+pmdSelect('pcFilterStatus','Status',[''].concat(values(pmdStatus)),f.status||'')+pmdSelect('pcFilterPriority','Priority / severity',[''].concat(values(r=>r.priority||r.severity)),f.priority||'')+'<div class="form-group"><label for="pcFilterStructure">'+esc(appState.settings.terminology.structure)+'</label><select id="pcFilterStructure"><option value="">Any</option>'+appState.racks.map(r=>'<option value="'+r.id+'" '+(String(r.id)===f.structure?'selected':'')+'>'+esc(pmdTitle(r))+'</option>').join('')+'</select></div>'+pmdSelect('pcFilterSort','Sort',['newest','date','title'],f.sort||'newest'),'<button class="btn" data-clear-filters>Clear</button><button class="btn btn-primary" data-apply-filters>Apply filters</button>');
  document.querySelectorAll('#pcSheet option[value=""]').forEach(o=>o.textContent='Any');
}
function pmdApplyMobileFilters(){PMD_COMPANION.filters={open:document.getElementById('pcFilterOpen').checked,overdue:document.getElementById('pcFilterOverdue').checked,owner:pmdValue('pcFilterOwner'),status:pmdValue('pcFilterStatus'),priority:pmdValue('pcFilterPriority'),structure:pmdValue('pcFilterStructure'),sort:pmdValue('pcFilterSort')};PMD_COMPANION.page=0;pmdCloseSheet();renderContent();}
function pmdOpenQuick(key,id){
  const config=PMD_QUICK[key],m=pmdModule(key);if(!config||!pmdEnabled(key)||(!id&&config.editOnly))return;
  const record=id?pmdFind({module:m.array,id}):{};if(!record)return;
  const val=field=>record[config[field]]||'';
  const options=(list,value)=>[...new Set(['',...pmdList(list),value||''])];
  const body='<form id="pcQuickForm" data-module="'+key+'" data-id="'+(id||'')+'">'+pmdInput('pcQuickTitle','Title *',val('title'))+(config.owner?pmdInput('pcQuickOwner','Owner',val('owner')):'')+(config.date?pmdInput('pcQuickDate',config.dateLabel||'Due date',val('date'),'date'):'')+(config.status?pmdSelect('pcQuickStatus','Status',options(config.list,val('status')),val('status')):'')+(config.priority?pmdSelect('pcQuickPriority','Priority / severity',options(config.priorities,val('priority')),val('priority')):'')+pmdText('pcQuickNotes',config.notes==='description'?'Description / capture notes':'Notes',val('notes'))+(key==='risks'?'<p class="pmd-muted">Assessment scores are preserved. Use the full editor to assess or change the risk framework.</p>':'')+'<p class="pmd-muted">Additional fields remain available in the full editor after saving.</p><p id="pcQuickError" role="alert"></p></form>';
  pmdSheet((id?'Quick edit · ':'New · ')+pmdName(key),body,'<button class="btn" data-close-sheet>Cancel</button><button class="btn btn-primary" type="submit" form="pcQuickForm">Save '+(id?'changes':'item')+'</button>');
  const title=document.getElementById('pcQuickTitle');title.required=true;title.maxLength=500;title.focus();
  const owner=document.getElementById('pcQuickOwner');if(owner){owner.setAttribute('list','pcTeam');const dl=document.createElement('datalist');dl.id='pcTeam';appState.settings.team.forEach(v=>{const o=document.createElement('option');o.value=v;dl.appendChild(o);});owner.after(dl);}
}
function pmdSaveQuick(form){
  const key=form.dataset.module,m=pmdModule(key),config=PMD_QUICK[key],id=Number(form.dataset.id)||null;
  if(!pmdEnabled(key))return;
  const title=pmdValue('pcQuickTitle');if(!title){document.getElementById('pcQuickError').textContent='A title is required.';return;}
  const old=id?pmdFind({module:m.array,id}):null;if(id&&!old){document.getElementById('pcQuickError').textContent='This item no longer exists.';return;}
  const before=old?pmdClone(old):{};
  const next=old?pmdClone(old):{id:1,created:nowISO(),updated:todayStr()};
  for(const field of ['title','owner','date','status','priority','notes'])if(config[field])next[config[field]]=pmdValue('pcQuick'+field[0].toUpperCase()+field.slice(1));
  next.updated=todayStr();if('updatedDate'in next)next.updatedDate=todayStr();
  if(!old&&key==='risks'){next.rackIds=[];next._riskModel=pmdClone(appState.settings.riskModel);}
  if(!old&&key==='actions'){next.notes=[];next.completed=null;}
  const counter=PMD_COUNTERS[m.array];
  if(!id)next.id=SNAPSHOT_GLOBAL_COUNTERS[counter]?SNAPSHOT_GLOBAL_COUNTERS[counter].get():appState[counter];
  try{
    // Validate the same backup contract used by full imports before changing state.
    const trial=pmdBackup(),index=trial.state[m.array].findIndex(r=>r.id===id);
    if(index>=0)trial.state[m.array][index]=next;else trial.state[m.array].push(next);
    pmdBuildImport(trial);
    snapshotForUndo((id?'Quick edit ':'Quick add ')+pmdName(key));
    if(old)Object.assign(old,next);else{appState[m.array].push(next);if(SNAPSHOT_GLOBAL_COUNTERS[counter])SNAPSHOT_GLOBAL_COUNTERS[counter].set(next.id+1);else appState[counter]=next.id+1;}
    if(key==='actions'&&pmdClosed(key,next)){next.completed=next.completed||todayStr();if(old)old.completed=next.completed;}
    auditRecord(key,next.id,id?'updated':'created',auditDiff(before,next,['title','owner','date','status','priority','notes'].map(k=>config[k]).filter(Boolean).map(k=>({key:k,label:pmdReadableKey(k)}))),pmdTitle(next));
    logActivity(key,id?'Updated':'Created',pmdId(m.array,next.id),pmdTitle(next));markUnsaved();
    pmdCloseSheet(false);switchModule(key);if(pmdPhone())pmdOpenMobileRecord(m.array,next.id);toast('Item '+(id?'updated':'created'),'success');
  }catch(e){document.getElementById('pcQuickError').textContent=e.message;}
}
function pmdReadableKey(k){return k.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ').replace(/^./,x=>x.toUpperCase());}
function pmdValueHTML(value,depth=0){
  if(value===null||value===undefined||value==='')return '<span class="pmd-muted">Not set</span>';
  if(typeof value==='boolean')return value?'Yes':'No';
  if(typeof value!=='object')return esc(String(value));
  if(depth>3)return '<pre>'+esc(JSON.stringify(value,null,2))+'</pre>';
  if(Array.isArray(value))return value.length?'<ul>'+value.map(v=>'<li>'+pmdValueHTML(v,depth+1)+'</li>').join('')+'</ul>':'<span class="pmd-muted">None recorded</span>';
  return '<dl>'+Object.entries(value).map(([k,v])=>'<dt>'+esc(pmdReadableKey(k))+'</dt><dd>'+pmdValueHTML(v,depth+1)+'</dd>').join('')+'</dl>';
}
function pmdOpenMobileRecord(array,id){
  const record=pmdFind({module:array,id}),m=pmdModule(array)||pmdModule(array==='specifications'?'links':array==='actionPlanLanes'?'actionPlan':array);if(!record||!m)return;
  if(!pmdEnabled(m.key)){pmdSheet('Retained record','<p>'+esc(pmdTitle(record))+'</p><p>Enable '+esc(pmdName(m.key))+' in Settings to review and edit this retained record.</p>');return;}
  PMD_COMPANION.detail={array,id};
  const core=['status','result','verStatus','priority','severity','owner','assignee','requester','reporter','decisionMaker','due','date','dateNeeded','eta','description','notes'].filter(k=>record[k]!==undefined);
  const rest=Object.keys(record).filter(k=>!core.includes(k)&&k!=='id'&&k!==PMD_QUICK[m.key]?.title);
  const fields=keys=>keys.map(k=>'<div class="pc-detail-field"><dt>'+esc(pmdReadableKey(k))+'</dt><dd>'+pmdValueHTML(record[k])+'</dd></div>').join('');
  const related=pmdRelated(array,id).map(e=>{const other=pmdSame(e.from,{module:array,id})?e.to:e.from,r=pmdFind(other);return '<button class="pc-module" data-open-array="'+other.module+'" data-open-id="'+other.id+'"><span>'+esc(r?pmdTitle(r):'Missing record')+'<small>'+esc(e.type)+' · '+esc(pmdId(other.module,other.id))+(pmdEnabled(other.module)?'':' · module disabled')+'</small></span><span>›</span></button>';}).join('');
  let urls=[];if(record.url)urls.push({title:'Open link',url:record.url});if(Array.isArray(record.links))urls=urls.concat(record.links);
  const urlHTML=urls.map(x=>{const safe=sanitizeLinkUrl(x.url);return safe?'<a class="btn pc-wide" href="'+esc(safe)+'" target="_blank" rel="noopener noreferrer">'+esc(x.title||x.name||x.url)+'</a>':'<p class="pmd-muted">Unsupported link address.</p>';}).join('');
  pmdSheet(pmdId(array,id),'<p class="pmd-eyebrow">'+esc(pmdName(m.key))+'</p><h2 class="pc-record-title">'+esc(pmdTitle(record))+'</h2>'+urlHTML+'<dl class="pc-detail-fields">'+fields(core)+'</dl><details class="pc-section"><summary>All other fields ('+rest.length+')</summary><dl>'+fields(rest)+'</dl></details><section class="pc-section"><h3>Linked records</h3>'+(related||'<p>No intentional relationships recorded.</p>')+'<button class="btn pc-wide" data-link-record>Manage relationships</button></section>','<button class="btn" data-record-more>Full editor</button>'+(PMD_QUICK[m.key]?'<button class="btn btn-primary" data-quick="'+m.key+'" data-quick-id="'+id+'">Quick edit</button>':''));
  const note=document.createElement('button');note.className='btn pc-wide';note.dataset.addNote='';note.textContent='Add note';document.querySelector('#pcSheet .pc-detail-fields').after(note);
}
function pmdAddMobileNote(){
  const c=PMD_COMPANION.detail;if(!c)return;
  pmdSheet('Add note',pmdText('pcAppendNote','Note','')+'<p class="pmd-muted">This note is appended with today’s date. Existing notes are retained.</p>','<button class="btn" data-close-sheet>Cancel</button><button class="btn btn-primary" data-save-note>Add note</button>');
}
function pmdSaveMobileNote(){
  const text=pmdValue('pcAppendNote'),c=PMD_COMPANION.detail,r=pmdFind({module:c.array,id:c.id});if(!text||!r)return;
  snapshotForUndo('Add record note');const field=['actions','decisions','milestones'].includes(c.array)?'notes':'notesArray';r[field]=r[field]||[];r[field].push({date:todayStr(),text});r.updated=todayStr();auditRecord(pmdModule(c.array)?.key||c.array,r.id,'updated',[{field:'Note',oldVal:'',newVal:text}],pmdTitle(r));logActivity(c.array,'Note added',pmdId(c.array,r.id),pmdTitle(r));markUnsaved();pmdOpenMobileRecord(c.array,c.id);
}
function pmdOpenFullEditor(){
  const c=PMD_COMPANION.detail,m=pmdModule(c.array);if(!m)return;
  const edit=PMD_QUICK[m.key]?.edit||PMD_EDITORS[c.array]||PMD_EDITORS[m.key];pmdCloseSheet();
  if(edit&&typeof window[edit]==='function')window[edit](c.id);else{PMD_COMPANION.desktopOnPhone=true;switchModule(m.key);toast('Full module view opened. Use More to return to companion view.','info');}
}
function pmdSearchEntries(){
  if(PMD_COMPANION.searchIndex)return PMD_COMPANION.searchIndex;
  const rows=pmdEnabledModules().flatMap(m=>pmdMobileCollections(m.key));
  PMD_COMPANION.searchIndex=rows.map(e=>({...e,text:[pmdId(e.array,e.record.id),pmdName(e.module),JSON.stringify(e.record)].join(' ').toLocaleLowerCase()}));
  return PMD_COMPANION.searchIndex;
}
function pmdFindSearch(query){const words=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);if(!words.length)return [];return pmdSearchEntries().filter(e=>words.every(w=>e.text.includes(w)));}
function pmdOpenSearch(){pmdSheet('Search your program','<label class="sr-only" for="pcSearch">Search all enabled modules</label><input type="search" id="pcSearch" autofocus placeholder="Title, ID, owner, part number…" autocomplete="off"><p class="pmd-muted">Search enabled modules. Disabled records remain in your backup.</p><div id="pcSearchResults"><p>Type to find a record.</p></div>');}
function pmdSearchMobile(query){const found=pmdFindSearch(query);document.getElementById('pcSearchResults').innerHTML=query.trim()?'<p class="pmd-muted">'+found.length+' matches'+(found.length>40?' · first 40 shown, refine your search':'')+'</p>'+found.slice(0,40).map(e=>pmdCard(e)).join(''):'<p>Type to find a record.</p>';}
function pmdOpenQueue(kind){const list=kind==='attention'?pmdAttention():pmdUpcoming();pmdSheet(kind==='attention'?'Needs attention':'Coming up','<p class="pmd-muted">'+list.length+' items'+(list.length>100?' · first 100 shown; narrow in a module':'')+'</p>'+list.slice(0,100).map(x=>{const m=pmdModule(x.module),r=pmdFind({module:m.array,id:x.id});return r?pmdCard({array:m.array,module:m.key,record:r},x.reason):'';}).join(''));}
function pmdOpenMore(){
  pmdSheet('Workspace & backup','<div class="pc-status-card"><strong id="pcMoreMode">'+esc(typeof pmdDevice!=='undefined'&&pmdDevice.enabled?'Trusted Device Mode':'Session Mode')+'</strong><p>Program data stays on this device. There is no automatic cross-device synchronization.</p></div><button class="pc-module" data-backup>Download Program Backup <span>↓</span></button><button class="pc-module" data-share>Share Backup <span>↗</span></button><button class="pc-module" data-import>Import Program Backup <span>↑</span></button><button class="pc-module" data-device>Data mode & device storage <span>›</span></button><button class="pc-module" data-settings="program">Program Settings <span>›</span></button><div class="pc-two"><button class="btn" data-undo>Undo</button><button class="btn" data-redo>Redo</button></div><button class="pc-module" data-theme>Switch to '+(currentTheme==='dark'?'light':'dark')+' theme <span>◐</span></button><button class="pc-module" data-install>Install & offline help <span>›</span></button><button class="pc-module" data-check-update>Check for app update <span>↻</span></button>'+(PMD_COMPANION.desktopOnPhone?'<button class="btn pc-wide" data-companion-view>Return to companion view</button>':'')+'<p class="pmd-muted">PMD '+PMD_VERSION+' · Blank by default</p>');
}
function pmdInstallHelp(){pmdSheet('Install PMD','<h3>iPhone Home Screen</h3><ol><li>Open the hosted PMD page in Safari.</li><li>Open Share, then choose Add to Home Screen.</li><li>Open the PMD icon and wait for “Offline ready” once while connected.</li></ol><p>The offline shell contains the application only. Session Mode does not retain your program when the app closes. Import a backup or deliberately enable Trusted Device Mode.</p><p>Safari tabs and Home Screen apps may have separate storage. Use a JSON backup to move a program. Device storage can be cleared by the browser or operating system.</p><p>External specification websites need their own connection; PMD does not cache them.</p>');}

// Wrap only shared boundaries; desktop register implementations remain intact.
const pmdDesktopRender=renderContent, pmdDesktopSwitch=switchModule, pmdDesktopNew=handleNewAction, pmdDesktopNavigate=navigateToItem, pmdPreviousMarkUnsaved=markUnsaved;
renderContent=function(){if(pmdPhone()){if(!pmdEnabled(currentModule))currentModule='dashboard';currentModule==='dashboard'?pmdMobileHome():pmdMobileList();buildNav();}else pmdDesktopRender();};
switchModule=function(key){pmdCloseSheet(false);if(key!==currentModule){PMD_COMPANION.query='';PMD_COMPANION.page=0;PMD_COMPANION.filters={};}pmdDesktopSwitch(key);pmdMobileContext();};
handleNewAction=function(){if(pmdPhone()){if(PMD_QUICK[currentModule]&&!PMD_QUICK[currentModule].editOnly)pmdOpenQuick(currentModule);else if(currentModule==='dashboard')pmdOpenNew();else pmdDesktopNew();}else pmdDesktopNew();};
navigateToItem=function(key,id){if(pmdPhone()){const m=pmdModule(key);if(m)pmdOpenMobileRecord(m.array,id);}else pmdDesktopNavigate(key,id);};
markUnsaved=function(){pmdPreviousMarkUnsaved();pmdInvalidate();if(typeof pmdScheduleSave==='function')pmdScheduleSave();};
const pmdPreviousApply=pmdApplyConfig;pmdApplyConfig=function(){pmdPreviousApply();pmdInvalidate();};
function pmdAccentContrast(){
  const color=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const hex=color.match(/^#([0-9a-f]{6})$/i);if(!hex)return;
  const rgb=[0,2,4].map(i=>parseInt(hex[1].slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
  const lum=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
  document.documentElement.style.setProperty('--on-accent',lum>.179?'#07111d':'#ffffff');
}
const pmdOldUpdateAccent=updateAccent;updateAccent=function(){pmdOldUpdateAccent();pmdAccentContrast();};
performGlobalSearch=function(query){
  const target=document.getElementById('globalSearchResults'),found=pmdFindSearch(query);target.innerHTML=found.slice(0,40).map(e=>'<button class="gs-result" data-open-array="'+e.array+'" data-open-id="'+e.record.id+'"><strong>'+esc(pmdTitle(e.record))+'</strong><small>'+esc(pmdName(e.module))+' · '+esc(pmdId(e.array,e.record.id))+'</small></button>').join('')||'<div class="gs-result">No matching records</div>';target.classList.add('open');target.style.display='block';
};

function pmdCompanionInit(){
  const header=document.createElement('header');header.id='pcHeader';header.className='pc-header';header.innerHTML='<button class="pc-brand" data-route="dashboard" aria-label="PMD Home">P</button><div><strong id="pcProgram">PMD Toolkit</strong><span id="pcContext">Program companion</span></div><button class="pc-save-status" data-device id="pcSaveState">Session</button>';document.body.prepend(header);
  const nav=document.createElement('nav');nav.id='pcNav';nav.className='pc-nav';nav.setAttribute('aria-label','Companion navigation');nav.innerHTML='<button data-route="dashboard"><span aria-hidden="true">⌂</span>Home</button><button data-sheet="search"><span aria-hidden="true">⌕</span>Search</button><button data-sheet="new" class="pc-new"><span aria-hidden="true">＋</span>New</button><button data-sheet="modules"><span aria-hidden="true">▦</span>Modules</button><button data-sheet="more"><span aria-hidden="true">•••</span>More</button>';document.body.append(nav);
  const sheet=document.createElement('div');sheet.id='pcSheet';sheet.className='pc-sheet';sheet.hidden=true;sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');document.body.append(sheet);
  const status=document.createElement('button');status.id='pmdConnection';status.className='pmd-connection';status.setAttribute('aria-label','Offline and save status');status.dataset.device='';status.textContent='Session Mode';document.querySelector('.sidebar-footer').prepend(status);
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a');if(!b)return;const d=b.dataset;
    if(d.route){switchModule(d.route);return;}
    if(d.sheet){({modules:pmdOpenModules,search:pmdOpenSearch,new:pmdOpenNew,more:pmdOpenMore,filters:pmdOpenFilters})[d.sheet]?.();return;}
    if('closeSheet'in d){pmdCloseSheet();return;}
    if(d.openArray){closeGlobalSearch();if(pmdPhone()||b.closest('#pcSheet')||!pmdModule(d.openArray))pmdOpenMobileRecord(d.openArray,Number(d.openId));else pmdDesktopNavigate(d.openArray,Number(d.openId));return;}
    if(d.quick){pmdOpenQuick(d.quick,Number(d.quickId)||undefined);return;}
    if(d.page){PMD_COMPANION.page+=Number(d.page);renderContent();document.getElementById('contentArea').scrollTop=0;return;}
    if(d.queue){pmdOpenQueue(d.queue);return;}
    if('applyFilters'in d){pmdApplyMobileFilters();return;}
    if('clearFilters'in d){PMD_COMPANION.filters={};PMD_COMPANION.page=0;pmdCloseSheet();renderContent();return;}
    if('startBlank'in d){pmdStartBlank();pmdOpenNew();return;}
    if('addCurrent'in d){handleNewAction();return;}
    if('setup'in d){pmdCloseSheet();pmdOpenSetup();return;}
    if('import'in d){pmdCloseSheet();triggerImport();return;}
    if('backup'in d){exportAllData();return;}
    if('share'in d){pmdShareBackup();return;}
    if('device'in d){pmdOpenDevice();return;}
    if('settings'in d){pmdCloseSheet();openSettings(d.settings);return;}
    if('theme'in d){toggleTheme();pmdOpenMore();return;}
    if('undo'in d){performUndo();pmdCloseSheet();return;}
    if('redo'in d){performRedo();pmdCloseSheet();return;}
    if('install'in d){pmdInstallHelp();return;}
    if('checkUpdate'in d){pmdCheckUpdate();return;}
    if('desktopView'in d){PMD_COMPANION.desktopOnPhone=true;renderContent();return;}
    if('companionView'in d){PMD_COMPANION.desktopOnPhone=false;pmdCloseSheet();renderContent();return;}
    if('recordMore'in d){pmdOpenFullEditor();return;}
    if('addNote'in d){pmdAddMobileNote();return;}
    if('saveNote'in d){pmdSaveMobileNote();return;}
    if('linkRecord'in d){const c=PMD_COMPANION.detail;pmdCloseSheet();pmdRelationshipEditor(c.array,c.id);}
  });
  let searchTimer,listTimer;
  document.addEventListener('input',e=>{
    if(e.target.id==='pcSearch'){clearTimeout(searchTimer);const q=e.target.value;searchTimer=setTimeout(()=>{if(document.getElementById('pcSearchResults'))pmdSearchMobile(q);},150);}
    if(e.target.id==='pcListSearch'){clearTimeout(listTimer);const q=e.target.value;listTimer=setTimeout(()=>{PMD_COMPANION.query=q;PMD_COMPANION.page=0;const pos=e.target.selectionStart;renderContent();const input=document.getElementById('pcListSearch');input?.focus();try{input?.setSelectionRange(pos,pos);}catch{}},150);}
  });
  document.addEventListener('submit',e=>{if(e.target.id==='pcQuickForm'){e.preventDefault();pmdSaveQuick(e.target);}});
  document.addEventListener('keydown',e=>{
    if(!sheet.hidden){
      if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();pmdCloseSheet();}
      if(e.key==='Tab'){const focus=[...sheet.querySelectorAll('button,a[href],input,select,textarea,summary')].filter(x=>!x.disabled&&x.getClientRects().length);const first=focus[0],last=focus.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    }else if(pmdPhone()&&((e.ctrlKey||e.metaKey)&&e.key==='k')){e.preventDefault();e.stopImmediatePropagation();pmdOpenSearch();}
  },true);
  sheet.addEventListener('click',e=>{if(e.target===sheet)pmdCloseSheet();});
  // Sheets adapt in place; rotating/resizing must never discard an unfinished edit.
  matchMedia(PMD_MOBILE_QUERY).addEventListener('change',()=>{renderContent();pmdMobileContext();});
  // VisualViewport follows the iPhone keyboard without guessing a keyboard height.
  function viewport(){document.documentElement.style.setProperty('--pc-viewport-height',(window.visualViewport?.height||innerHeight)+'px');document.documentElement.style.setProperty('--pc-viewport-top',(window.visualViewport?.offsetTop||0)+'px');}
  window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);viewport();
  pmdAccentContrast();renderContent();pmdMobileContext();performance.mark('pmd-ui-ready');
}
pmdCompanionInit();
