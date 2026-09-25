

/* ═══════════════════════════════════════════════
   CENTRALIZED IN-MEMORY STATE
   ═══════════════════════════════════════════════ */
var appState = {
  settings: {
    toolTitle: 'Product Manager Dashboard',
    programName: '',
    preparerName: '',
    defaultIS: '',
    accent: '#58a6ff',
    moduleNames: {
      dashboard: 'Dashboard',
      assemblies: 'Assembly & Sub Mgmt',
      risks: 'Risk Register',
      actions: 'Action & Schedule Tracker',
      boms: 'BOM Manager',
      inventory: 'Inventory Tracker',
      hwItems: 'Security Review',
      decisions: 'Decision Log',
      milestones: 'Milestones',
      evm: 'EVM Tracker',
      changes: 'Change Control',
      tests: 'Test Matrix',
      lessons: 'Lessons Learned',
      requirements: 'Requirements',
      tradeStudies: 'Analysis and Trade Studies',
      anomalies: 'Anomaly Tracker',
      costTracker: 'Cost Tracker',
      procurement: 'Procurement',
      links: 'Links & Specs',
      actionPlan: 'Action Planning',
      strategy: 'Strategy Canvas'
    },
    dropdownLists: {
      riskCategories: ['Technical','Schedule','Cost','Performance','External','Safety','Programmatic'],
      riskStatuses: ['Open','Mitigating','Monitoring','Closed','Accepted'],
      actionStatuses: ['Open','In Progress','Complete','Deferred'],
      actionPriorities: ['P1 — Critical','P2 — High','P3 — Medium','P4 — Low'],
      actionCategories: ['Engineering','Test','Quality','Procurement','Documentation','Management'],
      actionTaskTypes: ['Internal Action','External Dependency','Milestone','Delivery/Receipt'],
      bomCategories: ['Electronic','Mechanical','COTS','Software','Fastener','Cable/Harness','Consumable'],
      bomStatuses: ['Approved','Pending Review','Obsolete','Replacement Needed','On Order'],
      equipmentTypes: ['Server','Workstation','Laptop','Switch','Router','Firewall','KVM','UPS','Monitor','Peripheral','Storage','Other'],
      operatingSystems: [],
      memoryTypes: ['DDR4','DDR5','ECC DDR4','ECC DDR5','N/A'],
      sanitizationMethods: [],
      classificationLevels: [],
      invStatuses: ['In Storage','Installed','Removed','In Transit','RMA'],
      invLocations: [],
      procurementStatuses: ['Needed','Requested','Ordered','Shipped','Received','Cancelled'],
      procurementCategories: ['Material','Equipment','Tool','Software','Service','Consumable','Other'],
      invConditions: ['New','Good','Fair','Needs Repair','Damaged','Decommissioned'],
      hwReviewStatuses: ['Pending Review','Approved','Needs Update','Flagged','Decommissioned'],
      swReviewStatuses: ['Pending Review','Approved','Needs Update','Flagged','Decommissioned']
    }
  },
  risks: [],
  racks: [],
  subs: [],
  actions: [],
  boms: [],
  inventory: [],
  hwItems: [],
  swItems: [],
  decisions: [],
  milestones: [],
  evmPackages: [],
  changes: [],
  tests: [],
  lessons: [],
  requirements: [],
  tradeStudies: [],
  anomalies: [],
  costItems: [],
  linkSections: [],
  specifications: [],
  purchases: [],
  actionPlanLanes: [],
  actionPlanCards: [],
  swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
  stakeholders: [],
  _linkSecNextId: 1,
  _linkNextId: 1,
  _specNextId: 1,
  _purchaseNextId: 1,
  _apLaneNextId: 1,
  _apCardNextId: 1,
  _stakeholderNextId: 1,
  activityLog: [],
  _evmNextId: 1,
  _chgNextId: 1,
  _testNextId: 1,
  _lesNextId: 1,
  _reqNextId: 1,
  _trdNextId: 1,
  _anomNextId: 1,
  _costNextId: 1,
  _riskNextId: 1,
  _rackNextId: 1,
  _subNextId: 1,
  _swNextId: 1,
  _decNextId: 1,
  _msNextId: 1
};
var lastFocusedElement = null;
var currentModule = 'dashboard';
var riskSubView = 'register'; // 'register' | 'riskDash' | 'rackMgmt'
var riskStatusFilter = 'all';
var riskRackFilter = 'all';
var riskSearchQuery = '';
var riskSortField = 'criticality';
var riskSortDir = -1;
var riskEditingId = null;
var riskCtxTargetId = null;
var actionSubView = 'table'; // 'table' | 'kanban' | 'timeline'
var actionStatusFilter = 'all';
var actionPriorityFilter = 'all';
var actionTaskTypeFilter = 'all';
var actionSearchQuery = '';
var actionSortField = 'id';
var actionSortDir = 1;
var actionEditingId = null;
var actionCtxTargetId = null;
var _actionNextId = 1;
var lastQuickSource = '';
var lastQuickAssignee = '';
var subEditingId = null;
var bomSearchQuery = '';
var bomSortField = 'id';
var bomSortDir = 1;
var bomEditingId = null;
var bomCtxTargetId = null;
var bomStatusFilter = 'all';
var bomCategoryFilter = 'all';
var _bomNextId = 1;
var invSearchQuery = '';
var invSortField = 'id';
var invSortDir = 1;
var invEditingId = null;
var invCtxTargetId = null;
var invStatusFilter = 'all';
var invLocationFilter = 'all';
var _invNextId = 1;
var hwSearchQuery = '';
var hwSortField = 'id';
var hwSortDir = 1;
var hwEditingId = null;
var hwCtxTargetId = null;
var hwStatusFilter = 'all';
var _hwNextId = 1;
var hwTempMemory = [];
var hwReportSelectedIds = [];
var hwReportHtml = '';
var swSearchQuery = '';
var swSortField = 'id';
var swSortDir = 1;
var swEditingId = null;
var swCtxTargetId = null;
var swStatusFilter = 'all';
var reportHtml = '';
var pendingConfirmCallback = null;
var debounceTimers = {};
var bomExpandedNodes = {};
var EXPORT_VERSION = '4.0.0';
/* ═══════════════════════════════════════════════
   TIER 2: UNDO/REDO STACK
   ═══════════════════════════════════════════════ */
var undoStack = [];
var redoStack = [];
var UNDO_MAX_DEPTH = 30;
/* ═══════════════════════════════════════════════
   TIER 2: PAGINATION
   ═══════════════════════════════════════════════ */
var paginationState = {};
var PAGE_SIZE = 50;
/* ═══════════════════════════════════════════════
   TIER 2: CRITICALITY CACHE
   ═══════════════════════════════════════════════ */
var critCache = new Map();
/* ═══════════════════════════════════════════════
   NAV CONFIG
   ═══════════════════════════════════════════════ */
var navConfig = [
  { key: 'dashboard', icon: '⊞', phase: 1 },
  { key: 'assemblies', icon: '⊟', phase: 3 },
  { key: 'risks', icon: '△', phase: 2 },
  { key: 'actions', icon: '☐', phase: 2 },
  { key: 'boms', icon: '⊕', phase: 3 },
  { key: 'inventory', icon: '▤', phase: 3 },
  { key: 'hwItems', icon: '⬡', phase: 4 },
  { key: 'decisions', icon: '◇', phase: 5 },
  { key: 'milestones', icon: '◆', phase: 5 },
  { key: 'evm', icon: '⊠', phase: 6 },
  { key: 'changes', icon: '⊗', phase: 6 },
  { key: 'tests', icon: '⊞', phase: 6 },
  { key: 'lessons', icon: '⊘', phase: 6 },
  { key: 'requirements', icon: '⊡', phase: 6 },
  { key: 'tradeStudies', icon: '⊟', phase: 6 },
  { key: 'anomalies', icon: '⊜', phase: 6 },
  { key: 'costTracker', icon: '⊕', phase: 6 },
  { key: 'procurement', icon: '⊓', phase: 6 },
  { key: 'links', icon: '↗', phase: 7 },
  { key: 'actionPlan', icon: '◫', phase: 7 },
  { key: 'strategy', icon: '▦', phase: 7 }
];
/* ═══════════════════════════════════════════════
   RISK FACTORS DEFINITION
   ═══════════════════════════════════════════════ */
var FACTORS = {
  quality: {label:'Quality',short:'Q',color:'var(--accent)',cssClass:'fd-q',scale:[{value:0,label:'N/A',desc:'Not assessed'},{value:1,label:'1 — None',desc:'No effect on product or process'},{value:2,label:'2 — Minor',desc:'Minor disruption; portion reworked in-station'},{value:3,label:'3 — Moderate',desc:'Process disruption; portion scrapped or sorted'},{value:4,label:'4 — High',desc:'Major disruption; loss of primary function likely'},{value:5,label:'5 — Hazardous',desc:'Endangers equipment or personnel'}]},
  cost: {label:'Cost',short:'C',color:'var(--yellow)',cssClass:'fd-c',scale:[{value:0,label:'N/A',desc:'Not assessed'},{value:1,label:'1 — <$5K',desc:'Minimal cost impact'},{value:2,label:'2 — $5K–$50K',desc:'Low to moderate cost'},{value:3,label:'3 — $50K–$250K',desc:'Significant cost impact'},{value:4,label:'4 — $250K–$1M',desc:'Major budget impact'},{value:5,label:'5 — >$1M',desc:'Severe budget impact'}]},
  schedule: {label:'Schedule',short:'S',color:'var(--orange)',cssClass:'fd-s',scale:[{value:0,label:'N/A',desc:'Not assessed'},{value:1,label:'1 — <1 day',desc:'Negligible schedule impact'},{value:2,label:'2 — 1–5 days',desc:'Minor delay, recoverable'},{value:3,label:'3 — 1–2 weeks',desc:'Moderate delay to subsystem'},{value:4,label:'4 — 2–4 weeks',desc:'Major delay, milestone at risk'},{value:5,label:'5 — >4 weeks',desc:'Severe delay, program-level impact'}]},
  reliability: {label:'Reliability',short:'R',color:'var(--purple)',cssClass:'fd-r',scale:[{value:0,label:'N/A',desc:'Not assessed'},{value:1,label:'1 — Isolated',desc:'One-time, no repeat history'},{value:2,label:'2 — Rare',desc:'No recurrence in 6 months'},{value:3,label:'3 — Occasional',desc:'No recurrence in 1–3 months'},{value:4,label:'4 — Repeat',desc:'2+ failures in last 6 months'},{value:5,label:'5 — Chronic',desc:'Recurring on custom / single-source parts'}]}
};
var FK = ['quality','cost','schedule','reliability'];
/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */





function fmtRelative(iso) { if (!iso) return ''; var diff = Date.now() - new Date(iso).getTime(); var mins = Math.floor(diff/60000); if (mins < 1) return 'Just now'; if (mins < 60) return mins+'m ago'; var hrs = Math.floor(mins/60); if (hrs < 24) return hrs+'h ago'; var days = Math.floor(hrs/24); if (days < 7) return days+'d ago'; return fmtDate(iso); }
function nowISO() { return new Date().toISOString(); }
function debounce(key, fn, delay) { if (debounceTimers[key]) clearTimeout(debounceTimers[key]); debounceTimers[key] = setTimeout(fn, delay || 300); }
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
/* ── Risk criticality helpers ── */




function getRackIds(r) { return r.rackIds || []; }
function subsForRack(rId) { return appState.subs.filter(function(s){return s.rackId===rId;}); }
function riskFmtId(id) { return 'R-'+String(id).padStart(3,'0'); }
/* ═══════════════════════════════════════════════
   ACTIVITY LOG
   ═══════════════════════════════════════════════ */
var _hasUnsavedChanges = false;
function markUnsaved() {
  _hasUnsavedChanges = true;
  var dot = document.getElementById('unsavedDot');
  if (dot) dot.classList.add('active');
}
function markSaved() {
  _hasUnsavedChanges = false;
  var dot = document.getElementById('unsavedDot');
  if (dot) dot.classList.remove('active');
}
function logActivity(module, action, itemId, desc) {
  appState.activityLog.unshift({ id: generateId(), timestamp: nowISO(), module: module, action: action, itemId: itemId || null, desc: desc });
  if (appState.activityLog.length > 200) appState.activityLog = appState.activityLog.slice(0,200);
  markUnsaved();
}
/* ═══════════════════════════════════════════════
   TIER 2: UNDO/REDO FUNCTIONS  (V9.2 — data-driven snapshot)
   ═══════════════════════════════════════════════ */
var SNAPSHOT_STATE_KEYS = [
  'risks','racks','subs','actions','boms','inventory','hwItems','swItems',
  'decisions','milestones','evmPackages','changes','tests','lessons',
  'requirements','tradeStudies','anomalies','costItems',
  'linkSections','specifications','purchases',
  'actionPlanLanes','actionPlanCards',
  'swot','stakeholders',
  'activityLog'
];
var SNAPSHOT_APPSTATE_COUNTERS = [
  '_riskNextId','_rackNextId','_subNextId',
  '_swNextId','_decNextId','_msNextId',
  '_evmNextId','_chgNextId','_testNextId','_lesNextId','_reqNextId',
  '_trdNextId','_anomNextId','_costNextId',
  '_linkSecNextId','_linkNextId','_specNextId','_purchaseNextId',
  '_apLaneNextId','_apCardNextId','_stakeholderNextId'
];
// File-scope counter globals — kept here until they migrate onto appState.
var SNAPSHOT_GLOBAL_COUNTERS = {
  _actionNextId: { get: function(){return _actionNextId;}, set: function(v){_actionNextId = v;} },
  _bomNextId:    { get: function(){return _bomNextId;},    set: function(v){_bomNextId    = v;} },
  _invNextId:    { get: function(){return _invNextId;},    set: function(v){_invNextId    = v;} },
  _hwNextId:     { get: function(){return _hwNextId;},     set: function(v){_hwNextId     = v;} }
};

function snapshotForUndo(actionDesc) {
  undoStack.push(_captureSnapshot(actionDesc));
  if (undoStack.length > UNDO_MAX_DEPTH) undoStack.shift();
  redoStack = [];
}
function performUndo() {
  if (undoStack.length === 0) { toast('Nothing to undo', 'info'); return; }
  var snapshot = undoStack.pop();
  redoStack.push(_captureSnapshot(snapshot.desc));
  restoreSnapshot(snapshot);
  toast('Undone: ' + snapshot.desc, 'info');
}
function performRedo() {
  if (redoStack.length === 0) { toast('Nothing to redo', 'info'); return; }
  var snapshot = redoStack.pop();
  undoStack.push(_captureSnapshot(snapshot.desc));
  restoreSnapshot(snapshot);
  toast('Redone: ' + snapshot.desc, 'info');
}
function v95_restoreSnapshot(snapshot) {
  for (var i = 0; i < SNAPSHOT_STATE_KEYS.length; i++) {
    var k = SNAPSHOT_STATE_KEYS[i];
    if (snapshot.state[k] !== undefined) appState[k] = snapshot.state[k];
  }
  for (var j = 0; j < SNAPSHOT_APPSTATE_COUNTERS.length; j++) {
    var c = SNAPSHOT_APPSTATE_COUNTERS[j];
    if (snapshot.counters[c] !== undefined) appState[c] = snapshot.counters[c];
  }
  for (var g in SNAPSHOT_GLOBAL_COUNTERS) {
    if (SNAPSHOT_GLOBAL_COUNTERS.hasOwnProperty(g) && snapshot.globals[g] !== undefined) {
      SNAPSHOT_GLOBAL_COUNTERS[g].set(snapshot.globals[g]);
    }
  }
  critCache.clear();
  buildNav();
  renderContent();
}
/* ═══════════════════════════════════════════════
   TOAST SYSTEM
   ═══════════════════════════════════════════════ */
/* ── Accessible sort helpers ── */
function ariaSort(field, currentField, currentDir) {
  if (field !== currentField) return '';
  return ' aria-sort="' + (currentDir === 1 ? 'ascending' : 'descending') + '"';
}
function sortArrow(field, currentField, currentDir) {
  if (field !== currentField) return '';
  return '<span class="sort-indicator">' + (currentDir === 1 ? ' \u25B2' : ' \u25BC') + '</span>';
}
function announce(msg) {
  var el = document.getElementById('liveAnnouncer');
  if (el) { el.textContent = ''; setTimeout(function(){ el.textContent = msg; }, 50); }
}
function toast(message, type) {
  type = type || 'info';
  var icons = { success:'✓', error:'✕', info:'ℹ', warning:'⚠' };
  var container = document.getElementById('toastContainer');
  var el = document.createElement('div');
  el.className = 'toast ' + type;
  el.setAttribute('role','status');
  el.innerHTML = '<span>'+(icons[type]||'')+'</span><span>'+esc(message)+'</span>';
  container.appendChild(el);
  var announcer = document.getElementById('liveAnnouncer');
  if (announcer) announcer.textContent = message;
  setTimeout(function(){ el.style.animation='toastOut .3s ease forwards'; setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },300); },3500);
}
/* ═══════════════════════════════════════════════
   TIER 2: PAGINATION FUNCTIONS
   ═══════════════════════════════════════════════ */
function getPaginationInfo(moduleKey, totalItems) {
  if (!paginationState[moduleKey]) paginationState[moduleKey] = { page: 1 };
  var info = paginationState[moduleKey];
  var totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  if (info.page > totalPages) info.page = totalPages;
  var start = (info.page - 1) * PAGE_SIZE;
  var end = Math.min(start + PAGE_SIZE, totalItems);
  return { page: info.page, totalPages: totalPages, start: start, end: end, total: totalItems };
}
function paginateItems(items, moduleKey) {
  if (items.length <= PAGE_SIZE) return items;
  var info = getPaginationInfo(moduleKey, items.length);
  return items.slice(info.start, info.end);
}
function renderPagination(moduleKey, totalItems) {
  if (totalItems <= PAGE_SIZE) return '';
  var info = getPaginationInfo(moduleKey, totalItems);
  var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid var(--border);font-size:12px;color:var(--text-secondary)">';
  html += '<span>Showing ' + (info.start + 1) + '–' + info.end + ' of ' + info.total + '</span>';
  html += '<div style="display:flex;align-items:center;gap:8px">';
  html += '<button class="btn btn-sm" onclick="changePage(\'' + moduleKey + '\',-1)"' + (info.page <= 1 ? ' disabled style="opacity:.4;cursor:default"' : '') + '>← Previous</button>';
  html += '<span style="font-family:var(--font-mono)">Page ' + info.page + ' / ' + info.totalPages + '</span>';
  html += '<button class="btn btn-sm" onclick="changePage(\'' + moduleKey + '\',1)"' + (info.page >= info.totalPages ? ' disabled style="opacity:.4;cursor:default"' : '') + '>Next →</button>';
  html += '</div></div>';
  return html;
}
function changePage(moduleKey, delta) {
  if (!paginationState[moduleKey]) paginationState[moduleKey] = { page: 1 };
  paginationState[moduleKey].page += delta;
  renderContent();
}
/* ═══════════════════════════════════════════════
   MODAL SYSTEM
   ═══════════════════════════════════════════════ */
function v95_openModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  lastFocusedElement = document.activeElement;
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  var fi = el.querySelector('input:not([type="hidden"]):not([type="color"]),select,textarea,button');
  if (fi) setTimeout(function(){ fi.focus(); }, 100);
  el._trapFocus = function(e) {
    if (e.key !== 'Tab') return;
    var focusable = el.querySelectorAll('button,input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
  };
  el.addEventListener('keydown', el._trapFocus);
}
function closeModal(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    if (el._trapFocus) { el.removeEventListener('keydown', el._trapFocus); el._trapFocus = null; }
  }
  if (id === 'riskModal') riskEditingId = null;
  if (id === 'subModal') subEditingId = null;
  if (id === 'actionModal') actionEditingId = null;
  if (id === 'bomModal') bomEditingId = null;
  if (id === 'invModal') invEditingId = null;
  if (id === 'hwModal') hwEditingId = null;
  if (lastFocusedElement && lastFocusedElement.focus) { lastFocusedElement.focus(); lastFocusedElement = null; }
}
/* ═══════════════════════════════════════════════
   CONFIRM DIALOG
   ═══════════════════════════════════════════════ */

function closeConfirm() { var o=document.getElementById('confirmOverlay'); o.classList.remove('open'); o.setAttribute('aria-hidden','true'); pendingConfirmCallback=null; document.getElementById('confirmBtn').style.display=''; document.getElementById('confirmMsg').innerHTML=''; document.body.style.overflow=''; }
document.getElementById('confirmBtn').addEventListener('click', function(){ if(pendingConfirmCallback) pendingConfirmCallback(); closeConfirm(); });
document.getElementById('confirmCancel').addEventListener('click', closeConfirm);
function saveAppState() { }
/* ═══════════════════════════════════════════════
   CONTEXT MENU
   ═══════════════════════════════════════════════ */
function showContextMenu(x, y, items) {
  var menu=document.getElementById('contextMenu'); var frag=document.createDocumentFragment();
  items.forEach(function(item){ if(item.separator){var sep=document.createElement('div');sep.className='ctx-sep';frag.appendChild(sep);} else {var btn=document.createElement('button');btn.className='ctx-item'+(item.danger?' danger':'');btn.setAttribute('role','menuitem');btn.innerHTML='<span class="ctx-icon">'+(item.icon||'')+'</span>'+esc(item.label);btn.addEventListener('click',function(){hideContextMenu();if(item.action)item.action();});frag.appendChild(btn);} });
  menu.innerHTML='';menu.appendChild(frag);
  menu.style.left=Math.max(4,Math.min(x,window.innerWidth-180))+'px'; menu.style.top=Math.max(4,Math.min(y,window.innerHeight-items.length*36))+'px';
  menu.classList.add('open'); menu.setAttribute('aria-hidden','false');
}
function hideContextMenu() { var m=document.getElementById('contextMenu'); m.classList.remove('open'); m.setAttribute('aria-hidden','true'); }
function closeContextMenu() { hideContextMenu(); }
document.addEventListener('click', function(e){ if(!e.target.closest('.context-menu')) hideContextMenu(); });
/* ═══════════════════════════════════════════════
   DETAIL PANEL
   ═══════════════════════════════════════════════ */
function closeDetailPanel() { document.getElementById('detailPanel').classList.remove('open'); }
function v95_openDetailPanel(title, bodyHtml, editFn) {
  document.getElementById('detailPanelTitle').textContent = title;
  document.getElementById('detailPanelBody').innerHTML = bodyHtml;
  document.getElementById('detailEditBtn').onclick = editFn || null;
  document.getElementById('detailEditBtn').style.display = editFn ? '' : 'none';
  document.getElementById('detailPanel').classList.add('open');
}
/* ═══════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════ */

function buildRiskSidebarFilters() {
  var el = document.getElementById('riskSidebarFilters');
  if (currentModule !== 'risks') { el.innerHTML = ''; return; }
  var risks = appState.risks;
  var html = '<div class="sidebar-section"><div class="sidebar-label">Filter by Status</div>';
  var statusFilters = [
    {key:'all',icon:'○',label:'All Risks',count:risks.length},
    {key:'Open',icon:'●',label:'Open',style:'color:var(--red)',count:risks.filter(function(r){return r.status==='Open';}).length},
    {key:'Mitigating',icon:'●',label:'Mitigating',style:'color:var(--yellow)',count:risks.filter(function(r){return r.status==='Mitigating';}).length},
    {key:'Monitoring',icon:'●',label:'Monitoring',style:'color:var(--accent)',count:risks.filter(function(r){return r.status==='Monitoring';}).length},
    {key:'Closed',icon:'●',label:'Closed',style:'color:var(--green)',count:risks.filter(function(r){return r.status==='Closed';}).length},
    {key:'Accepted',icon:'●',label:'Accepted',style:'color:var(--text-muted)',count:risks.filter(function(r){return r.status==='Accepted';}).length},
    {key:'Overdue',icon:'●',label:'Overdue',style:'color:var(--red)',count:risks.filter(function(r){return r.due&&r.due<todayStr()&&r.status!=='Closed';}).length},
    {key:'FormalAction',icon:'⚠',label:'Formal Action',style:'color:var(--red)',count:risks.filter(function(r){return r.status!=='Closed'&&needsFA(getCrit(r));}).length}
  ];
  statusFilters.forEach(function(sf){
    var active = riskStatusFilter===sf.key && riskSubView==='register';
    html += '<button class="nav-item'+(active?' active':'')+'" onclick="riskFilterByStatus(\''+sf.key+'\')"><span class="nav-icon"'+(sf.style?' style="'+sf.style+'"':'')+'>'+sf.icon+'</span> '+sf.label+'<span class="nav-badge">'+sf.count+'</span></button>';
  });
  html += '</div>';
  // Assembly filter
  html += '<div class="sidebar-section"><div class="sidebar-label">Filter by Assembly</div>';
  html += '<button class="nav-item'+(riskRackFilter==='all'?' active':'')+'" onclick="riskSetRackFilter(\'all\')"><span class="nav-icon">○</span> All Assemblies</button>';
  appState.racks.forEach(function(rk){
    var cnt = risks.filter(function(r){var ids=getRackIds(r);return ids.includes(rk.id)||ids.includes('all');}).length;
    html += '<button class="nav-item'+(riskRackFilter===rk.id?' active':'')+'" onclick="riskSetRackFilter('+rk.id+')"><span class="nav-icon" style="color:var(--purple)">■</span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0">'+esc(rk.name)+'</span><span class="nav-badge">'+cnt+'</span></button>';
  });
  html += '</div>';
  // Stats
  var active = risks.filter(function(r){return r.status!=='Closed';});
  var avgC = active.length > 0 ? (active.reduce(function(s,r){return s+getCrit(r).sum;},0)/active.length).toFixed(1) : '—';
  var highC = active.length > 0 ? Math.max.apply(null,active.map(function(r){return getCrit(r).sum;})) : '—';
  html += '<div style="padding:12px 20px;border-top:1px solid var(--border);font-size:12px"><div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:var(--text-muted)">Avg Criticality</span><span style="font-family:var(--font-mono);font-weight:600">'+avgC+'</span></div><div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:var(--text-muted)">Highest</span><span style="font-family:var(--font-mono);font-weight:600;color:var(--red)">'+highC+'</span></div></div>';
  el.innerHTML = html;
}

function riskFilterByStatus(s) { riskStatusFilter=s; riskSubView='register'; currentModule='risks'; buildNav(); renderContent(); }
function riskSetRackFilter(id) { riskRackFilter=id; if(riskSubView==='rackMgmt') riskSubView='register'; currentModule='risks'; buildNav(); renderContent(); }
/* ═══════════════════════════════════════════════
   CONTENT ROUTER
   ═══════════════════════════════════════════════ */
function v95_renderContent() {
  critCache.clear();
  var area=document.getElementById('contentArea');
  var breadcrumb = currentModule !== 'dashboard' ? buildBreadcrumb() : '';
  try {
    switch(currentModule) {
      case 'dashboard': renderDashboard(area); break;
      case 'assemblies': renderAssemblyModule(area); break;
      case 'risks': renderRiskModule(area); break;
      case 'actions': renderActionModule(area); break;
      case 'boms': renderBomModule(area); break;
      case 'inventory': renderInventoryModule(area); break;
      case 'hwItems': renderHwModule(area); break;
      case 'decisions': renderDecisionModule(area); break;
      case 'milestones': renderMilestoneModule(area); break;
      case 'evm': renderEvmModule(area); break;
      case 'changes': renderChangesModule(area); break;
      case 'tests': renderTestsModule(area); break;
      case 'lessons': renderLessonsModule(area); break;
      case 'requirements': renderRequirementsModule(area); break;
      case 'tradeStudies': renderTradeStudiesModule(area); break;
      case 'anomalies': renderAnomaliesModule(area); break;
      case 'costTracker': renderCostTrackerModule(area); break;
      case 'procurement': renderProcurementModule(area); break;
      case 'links': renderLinksModule(area); break;
      case 'actionPlan': renderActionPlanModule(area); break;
      case 'strategy': renderStrategyModule(area); break;
    }
  } catch(err) {
    area.innerHTML = '<div class="empty-state"><div class="es-icon">⚠</div><h3>Render Error</h3><p style="color:var(--red)">'+esc(err.message)+'</p><p>Try switching to another module or refreshing the page.</p><button class="btn btn-sm" onclick="switchModule(\'dashboard\')">Go to Dashboard</button></div>';
  }
  if (breadcrumb) area.insertAdjacentHTML('afterbegin',breadcrumb);
  setupRowTooltips(area);
  updateNotificationBadge();
}
function renderPlaceholder(area, icon, name, desc, phase) {
  var displayName=appState.settings.moduleNames[currentModule]||name;
  area.innerHTML='<div class="module-placeholder"><div class="mp-icon">'+icon+'</div><h2>'+esc(displayName)+'</h2><p>'+esc(desc)+'</p><div class="pill pill-blue">Coming in Phase '+phase+'</div></div>';
}
/* ═══════════════════════════════════════════════
   DASHBOARD (HOME)
   ═══════════════════════════════════════════════ */

function statCard(icon,label,value,sub,color,navKey) {
  var cls=navKey?' clickable':''; var nav=navKey?' data-nav="'+navKey+'"':'';
  var colors={red:'var(--red)',orange:'var(--orange)',yellow:'var(--yellow)',green:'var(--green)',blue:'var(--accent)',purple:'var(--purple)',teal:'var(--teal)'};
  var cs=colors[color]?' style="color:'+colors[color]+'"':'';
  return '<div class="stat-card'+cls+'"'+nav+' tabindex="'+(navKey?'0':'-1')+'" role="'+(navKey?'button':'status')+'" aria-label="'+esc(label)+': '+value+'"><div class="sc-icon">'+icon+'</div><div class="sc-label">'+esc(label)+'</div><div class="sc-value"'+cs+'>'+value+'</div><div class="sc-sub">'+esc(sub)+'</div></div>';
}
function buildModuleOverviewChart() {
  var modules=[
    {key:'risks',label:appState.settings.moduleNames.risks,count:appState.risks.length,color:'var(--red)'},
    {key:'actions',label:appState.settings.moduleNames.actions,count:appState.actions.length,color:'var(--accent)'},
    {key:'boms',label:appState.settings.moduleNames.boms,count:appState.boms.length,color:'var(--orange)'},
    {key:'inventory',label:appState.settings.moduleNames.inventory,count:appState.inventory.length,color:'var(--teal)'},
    {key:'hwItems',label:appState.settings.moduleNames.hwItems,count:appState.hwItems.length,color:'var(--purple)'},
    {key:'evm',label:'EVM',count:(appState.evmPackages||[]).length,color:'var(--green)'},
    {key:'changes',label:'Changes',count:(appState.changes||[]).length,color:'var(--yellow)'},
    {key:'tests',label:'Tests',count:(appState.tests||[]).length,color:'var(--blue)'},
    {key:'requirements',label:'Requirements',count:(appState.requirements||[]).length,color:'var(--cyan)'},
    {key:'anomalies',label:'Anomalies',count:(appState.anomalies||[]).length,color:'var(--red)'},
    {key:'tradeStudies',label:'Analysis/Trade Studies',count:(appState.tradeStudies||[]).length,color:'var(--indigo)'},
    {key:'procurement',label:appState.settings.moduleNames.procurement||'Procurement',count:(appState.purchases||[]).length,color:'var(--teal)'}
  ];
  var maxC=Math.max.apply(null,modules.map(function(m){return m.count;})); if(maxC<1)maxC=1;
  var bars=''; modules.forEach(function(m){ var pct=Math.max((m.count/maxC)*100,0); bars+='<div class="hm-bar-section"><div class="hm-bar-label"><span>'+esc(m.label)+'</span><span style="font-family:var(--font-mono);font-weight:600">'+m.count+'</span></div><div class="hm-bar-track"><div class="hm-bar-seg" style="width:'+pct+'%;background:'+m.color+';min-width:'+(m.count>0?'28px':'0')+'">'+(m.count>0?m.count:'')+'</div></div></div>'; });
  return '<div class="chart-section"><h3>Module Overview</h3><div class="chart-sub">Items per module</div>'+bars+'</div>';
}
function buildCrossRefSummary() {
  var linkedActions = appState.actions.filter(function(a){ return a.linkedRiskId; });
  var bomWithInv = 0;
  appState.boms.forEach(function(b) {
    if (b.partNumber && appState.inventory.some(function(i){ return pmdAreRelated('boms',b.id,'inventory',i.id); })) bomWithInv++;
  });
  var orphanBoms = appState.boms.length - bomWithInv;
  var risksWithActions = new Set();
  linkedActions.forEach(function(a){ risksWithActions.add(a.linkedRiskId); });
  var unlinkedRisks = appState.risks.filter(function(r){ return r.status !== 'Closed' && !risksWithActions.has(r.id); }).length;

  var html = '<div class="chart-section" style="margin-top:20px"><h3>Cross-Module Linkage</h3><div class="chart-sub">How modules connect to each other</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">';
  html += '<div style="background:var(--bg-primary);border-radius:var(--radius);padding:12px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">Risk \u2194 Action</div>';
  html += '<div style="font-size:20px;font-weight:700;font-family:var(--font-mono)">'+linkedActions.length+'</div>';
  html += '<div style="font-size:11px;color:var(--text-secondary)">linked actions across '+risksWithActions.size+' risks</div>';
  if (unlinkedRisks > 0) html += '<div style="font-size:11px;color:var(--yellow);margin-top:4px">'+unlinkedRisks+' open risks have no linked actions</div>';
  html += '</div>';
  html += '<div style="background:var(--bg-primary);border-radius:var(--radius);padding:12px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">BOM \u2194 Inventory</div>';
  html += '<div style="font-size:20px;font-weight:700;font-family:var(--font-mono)">'+bomWithInv+'</div>';
  html += '<div style="font-size:11px;color:var(--text-secondary)">BOM items with matching inventory</div>';
  if (orphanBoms > 0) html += '<div style="font-size:11px;color:var(--yellow);margin-top:4px">'+orphanBoms+' BOM items without inventory tracking</div>';
  html += '</div>';
  html += '<div style="background:var(--bg-primary);border-radius:var(--radius);padding:12px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">HW \u2194 Assembly</div>';
  var hwWithAssembly = appState.hwItems.filter(function(h){ return h.assemblyId; }).length;
  html += '<div style="font-size:20px;font-weight:700;font-family:var(--font-mono)">'+hwWithAssembly+'</div>';
  html += '<div style="font-size:11px;color:var(--text-secondary)">of '+appState.hwItems.length+' HW items linked to assemblies</div>';
  html += '</div>';
  // Req <-> Test linkage
  var reqTests=(appState.tests||[]).filter(function(t){return t.reqId;}).length;
  html += '<div style="background:var(--bg-primary);border-radius:var(--radius);padding:12px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">Req \u2194 Test</div>';
  html += '<div style="font-size:20px;font-weight:700;font-family:var(--font-mono)">'+reqTests+'</div>';
  html += '<div style="font-size:11px;color:var(--text-secondary)">test cases linked to requirements</div></div>';
  // Anomaly <-> Action linkage
  var anomLinked=(appState.anomalies||[]).filter(function(a){return a.linkedAction;}).length;
  html += '<div style="background:var(--bg-primary);border-radius:var(--radius);padding:12px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">Anomaly \u2194 Action</div>';
  html += '<div style="font-size:20px;font-weight:700;font-family:var(--font-mono)">'+anomLinked+'</div>';
  html += '<div style="font-size:11px;color:var(--text-secondary)">anomalies with corrective actions</div></div>';
  // Change <-> Risk linkage
  var chgLinked=(appState.changes||[]).filter(function(c){return c.linkedRisk;}).length;
  html += '<div style="background:var(--bg-primary);border-radius:var(--radius);padding:12px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">Change \u2194 Risk</div>';
  html += '<div style="font-size:20px;font-weight:700;font-family:var(--font-mono)">'+chgLinked+'</div>';
  html += '<div style="font-size:11px;color:var(--text-secondary)">change requests linked to risks</div></div>';
  html += '</div></div>';
  return html;
}
function buildActivityFeed() {
  var log=appState.activityLog.slice(0,30); var items='';
  if(log.length===0){ items='<div class="empty-state" style="padding:30px"><div class="es-icon">●</div><h3>No Activity Yet</h3><p>Actions will appear here as you create and modify items across modules.</p></div>'; }
  else { items='<div class="activity-feed">'; log.forEach(function(entry){ items+='<div class="activity-item"><div class="activity-dot mod-'+esc(entry.module)+'"></div><div class="activity-text"><strong>'+esc(entry.action)+'</strong> '+esc(entry.desc)+'</div><div class="activity-time">'+fmtRelative(entry.timestamp)+'</div></div>'; }); items+='</div>'; }
  return '<div class="chart-section"><h3>Recent Activity</h3><div class="chart-sub">Latest actions across all modules</div>'+items+'</div>';
}

function buildDependencyGraph() {
  // Find actions with blockedBy relationships
  var deps = [];
  appState.actions.forEach(function(a) {
    if (!a.blockedBy) return;
    var blockerIds = a.blockedBy.split(',').map(function(s){return s.trim().replace(/^A-/i,'');}).filter(function(s){return s;});
    blockerIds.forEach(function(bid) {
      var blockerId = parseInt(bid);
      var blocker = appState.actions.find(function(x){return x.id===blockerId;});
      if (blocker) deps.push({from: blocker, to: a});
    });
  });
  if (deps.length === 0) return '';

  // Build unique nodes
  var nodeMap = {};
  deps.forEach(function(d) {
    nodeMap[d.from.id] = d.from;
    nodeMap[d.to.id] = d.to;
  });
  var nodes = Object.keys(nodeMap).map(function(k){return nodeMap[k];});

  // Topological layers
  var layers = {};
  var visited = {};
  function getLayer(a, depth) {
    if (visited[a.id]) return layers[a.id] || 0;
    visited[a.id] = true;
    var maxParent = 0;
    deps.forEach(function(d) {
      if (d.to.id === a.id) maxParent = Math.max(maxParent, getLayer(d.from, depth+1) + 1);
    });
    layers[a.id] = maxParent;
    return maxParent;
  }
  nodes.forEach(function(n) { getLayer(n, 0); });

  // Group by layer
  var layerGroups = {};
  var maxLayer = 0;
  nodes.forEach(function(n) {
    var l = layers[n.id] || 0;
    if (l > maxLayer) maxLayer = l;
    if (!layerGroups[l]) layerGroups[l] = [];
    layerGroups[l].push(n);
  });

  var html = '<div class="chart-section"><h3>Action Dependencies</h3><div class="chart-sub">Blocking relationships between actions</div>';
  html += '<div class="dep-graph">';

  for (var l = 0; l <= Math.min(maxLayer, 5); l++) {
    var group = layerGroups[l] || [];
    html += '<div class="dep-layer">';
    if (l > 0) html += '<div class="dep-arrow-col">→</div>';
    html += '<div class="dep-nodes">';
    group.slice(0, 6).forEach(function(a) {
      var statusCls = a.status === 'Complete' ? 'dep-complete' : (a.due && a.due < todayStr() ? 'dep-overdue' : 'dep-open');
      html += '<div class="dep-node '+statusCls+'" title="'+esc(a.title)+'">';
      html += '<div class="dep-node-id">'+actionFmtId(a.id)+'</div>';
      html += '<div class="dep-node-title">'+esc(a.title.substring(0,20))+'</div>';
      html += '<div class="dep-node-status">'+esc(a.status)+'</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  html += '</div>';
  html += '<div style="font-size:11px;color:var(--text-muted);margin-top:6px">Arrows show blocking direction (left blocks right). '+deps.length+' dependencies across '+nodes.length+' actions.</div>';
  html += '</div>';
  return html;
}

function buildKpiTrends() {
  // Weekly trend data for last 4 weeks
  var now = new Date();
  var weeks = [];
  for (var w = 3; w >= 0; w--) {
    var weekEnd = new Date(now.getTime() - w * 7 * 86400000);
    var weekStart = new Date(weekEnd.getTime() - 7 * 86400000);
    var endStr = weekEnd.toISOString().substring(0,10);
    var startStr = weekStart.toISOString().substring(0,10);
    var created = appState.actions.filter(function(a) {
      return a.created && a.created.substring(0,10) >= startStr && a.created.substring(0,10) <= endStr;
    }).length;
    var completed = appState.actions.filter(function(a) {
      return a.completed && a.completed.substring(0,10) >= startStr && a.completed.substring(0,10) <= endStr;
    }).length;
    var risksAdded = appState.risks.filter(function(r) {
      return r.created && r.created.substring(0,10) >= startStr && r.created.substring(0,10) <= endStr;
    }).length;
    weeks.push({ created: created, completed: completed, risks: risksAdded });
  }

  // Build sparkline bars
  function sparkline(data, color) {
    var max = Math.max.apply(null, data.concat([1]));
    var html = '<div class="kpi-spark">';
    data.forEach(function(v) {
      var h = Math.max(2, Math.round((v / max) * 20));
      html += '<div class="kpi-spark-bar" style="height:'+h+'px;background:'+color+'" title="'+v+'"></div>';
    });
    html += '</div>';
    return html;
  }

  function trendArrow(data) {
    if (data.length < 2) return '';
    var last = data[data.length-1];
    var prev = data[data.length-2];
    if (last > prev) return '<span class="kpi-trend kpi-trend-up">▲</span>';
    if (last < prev) return '<span class="kpi-trend kpi-trend-down">▼</span>';
    return '<span class="kpi-trend kpi-trend-flat">—</span>';
  }

  var createdData = weeks.map(function(w){return w.created;});
  var completedData = weeks.map(function(w){return w.completed;});
  var riskData = weeks.map(function(w){return w.risks;});
  var totalCreated = createdData.reduce(function(a,b){return a+b;},0);
  var totalCompleted = completedData.reduce(function(a,b){return a+b;},0);
  var totalRisks = riskData.reduce(function(a,b){return a+b;},0);

  var html = '<div class="chart-section"><h3>4-Week Trends</h3><div class="chart-sub">Weekly KPI trends with sparklines</div>';
  html += '<div class="kpi-grid">';

  html += '<div class="kpi-card"><div class="kpi-header">Actions Created'+trendArrow(createdData)+'</div>';
  html += '<div class="kpi-value">'+totalCreated+'</div>';
  html += sparkline(createdData, 'var(--accent)');
  html += '</div>';

  html += '<div class="kpi-card"><div class="kpi-header">Actions Completed'+trendArrow(completedData)+'</div>';
  html += '<div class="kpi-value" style="color:var(--green)">'+totalCompleted+'</div>';
  html += sparkline(completedData, 'var(--green)');
  html += '</div>';

  html += '<div class="kpi-card"><div class="kpi-header">Risks Identified'+trendArrow(riskData)+'</div>';
  html += '<div class="kpi-value" style="color:var(--red)">'+totalRisks+'</div>';
  html += sparkline(riskData, 'var(--red)');
  html += '</div>';

  // Velocity: completed/created ratio
  var velocity = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0;
  var velColor = velocity >= 80 ? 'var(--green)' : velocity >= 50 ? 'var(--yellow)' : 'var(--red)';
  html += '<div class="kpi-card"><div class="kpi-header">Velocity</div>';
  html += '<div class="kpi-value" style="color:'+velColor+'">'+velocity+'%</div>';
  html += '<div style="font-size:10px;color:var(--text-muted)">Completed / Created ratio</div>';
  html += '</div>';

  html += '</div></div>';
  return html;
}

/* ═══════════════════════════════════════════════
   ASSEMBLY & SUBASSEMBLY MANAGEMENT MODULE
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   RISK REGISTER MODULE
   ═══════════════════════════════════════════════ */

/* ── Filtered & sorted risks ── */

/* ── Risk Register Table ── */


function riskSortBy(f) { if(riskSortField===f)riskSortDir*=-1;else{riskSortField=f;riskSortDir=f==='criticality'?-1:1;} announce('Sorted by '+f+', '+(riskSortDir===1?'ascending':'descending')); renderContent(); }
function riskClearSearch() { riskSearchQuery=''; renderContent(); }
function riskSwitchSubView(v) { riskSubView=v; saveSubView('risks',v); renderContent(); }
/* ── Risk Dashboard ── */

/* ── Rack & Sub Management (legacy, now redirects to Assembly module) ── */


function saveEditAssembly(rId) {
  var rk=appState.racks.find(function(r){return r.id===rId;});if(!rk)return;
  var name=(document.getElementById('asmEditName')||{}).value;
  var desc=(document.getElementById('asmEditDesc')||{}).value;
  if(!name||!name.trim()){toast('Name is required','error');return;}
  var changes=[];
  if(rk.name!==name.trim())changes.push('name: '+rk.name+' -> '+name.trim());
  if((rk.description||'')!==desc.trim())changes.push('description updated');
  rk.name=name.trim();rk.description=desc.trim();
  if(changes.length>0){logActivity('assemblies','Updated','Assembly #'+rId,changes.join(', '));toast('Assembly updated','success');}
  closeConfirm();buildNav();renderContent();
}


/* ── Sub Modal ── */
function openAddSub(){subEditingId=null;document.getElementById('subModalTitle').textContent='New Subassembly';document.getElementById('subSaveBtn').textContent='Add';renderSubModalBody({name:'',partNumber:'',serialNumber:'',description:'',rackId:null});openModal('subModal');}
function openEditSub(id){var s=appState.subs.find(function(x){return x.id===id;});if(!s)return;subEditingId=id;document.getElementById('subModalTitle').textContent='Edit Subassembly';document.getElementById('subSaveBtn').textContent='Save';renderSubModalBody(s);openModal('subModal');}
function renderSubModalBody(s){
  document.getElementById('subModalBody').innerHTML='<div class="form-group"><label for="sName">Name *</label><input type="text" id="sName" value="'+esc(s.name)+'"></div><div class="form-row"><div class="form-group"><label for="sPN">Part Number</label><input type="text" id="sPN" value="'+esc(s.partNumber||'')+'"></div><div class="form-group"><label for="sSN">Serial Number</label><input type="text" id="sSN" value="'+esc(s.serialNumber||'')+'"></div></div><div class="form-group"><label for="sRack">Rack Assignment</label><select id="sRack"><option value="">Unassigned</option>'+appState.racks.map(function(rk){return '<option value="'+rk.id+'"'+(s.rackId===rk.id?' selected':'')+'>'+esc(rk.name)+'</option>';}).join('')+'</select></div><div class="form-group"><label for="sDesc">Description</label><textarea id="sDesc">'+esc(s.description||'')+'</textarea></div>';
}
function saveSub(){
  var name=document.getElementById('sName').value.trim();if(!name){toast('Name is required','error');return;}
  var data={name:name,partNumber:document.getElementById('sPN').value.trim(),serialNumber:document.getElementById('sSN').value.trim(),description:document.getElementById('sDesc').value.trim(),rackId:document.getElementById('sRack').value?parseInt(document.getElementById('sRack').value):null};
  if(subEditingId){var s=appState.subs.find(function(x){return x.id===subEditingId;});if(s)Object.assign(s,data);toast('Subassembly updated','success');}
  else{data.id=appState._subNextId++;appState.subs.push(data);logActivity('risks','Added Sub',null,data.name);toast('Subassembly added','success');}
  closeModal('subModal');renderContent();
}
function deleteSub(id){
  var s=appState.subs.find(function(x){return x.id===id;});
  if(!s) return;
  showConfirm('Delete Subassembly','Delete subassembly "'+esc(s.name||'(unnamed)')+'"?','Delete',function(){
    snapshotForUndo('Delete subassembly');
    appState.subs=appState.subs.filter(function(x){return x.id!==id;});
    logActivity('risks','Deleted Sub',null,'Sub: '+(s.name||''));
    markUnsaved();
    toast('Subassembly deleted','success');
    renderContent();
  });
}
/* ═══════════════════════════════════════════════
   RISK MODAL (Add / Edit)
   ═══════════════════════════════════════════════ */


function renderRiskModalBody(r){
  var rIds=getRackIds(r),isAll=rIds.includes('all');
  var cats=appState.settings.dropdownLists.riskCategories;
  var statuses=appState.settings.dropdownLists.riskStatuses;
  var html='<div class="form-group"><label for="fTitle">Risk Title *</label><input type="text" id="fTitle" value="'+esc(r.title)+'"></div>';
  html+='<div class="form-group"><label for="fDesc">Description</label><textarea id="fDesc">'+esc(r.description||'')+'</textarea></div>';
  html+='<div class="form-row"><div class="form-group"><label>Category</label><select id="fCategory">'+cats.map(function(c){return '<option'+(r.category===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></div><div class="form-group"><label>Status</label><select id="fStatus">'+statuses.map(function(s){return '<option'+(r.status===s?' selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></div></div>';
  html+='<div class="form-group"><label>Assigned Rack(s)</label><div class="rack-checks"><label class="rack-check all-check'+(isAll?' checked':'')+'" onclick="event.preventDefault();toggleRackAll(this)"><input type="checkbox"'+(isAll?' checked':'')+' value="all"> All Racks</label>'+appState.racks.map(function(rk){var ch=!isAll&&rIds.includes(rk.id);return '<label class="rack-check'+(ch?' checked':'')+'" onclick="event.preventDefault();toggleRackCheck(this)"><input type="checkbox"'+(ch?' checked':'')+' value="'+rk.id+'"> '+esc(rk.name)+'</label>';}).join('')+'</div></div>';
  html+='<div class="factor-group"><h4>Criticality Factors <span style="font-weight:400;color:var(--text-muted);font-size:12px">· select N/A if unknown</span></h4><div class="form-row-4">'+FK.map(function(k){var f=FACTORS[k],val=r[k]!==undefined&&r[k]!==null?r[k]:0;var di=f.scale.find(function(s){return s.value===val;});return '<div class="factor-item"><label style="color:'+f.color+'">'+f.label+'</label><select id="f_'+k+'" onchange="updateCritPreview()">'+f.scale.map(function(s){return '<option value="'+s.value+'"'+(val===s.value?' selected':'')+'>'+esc(s.label)+'</option>';}).join('')+'</select><div class="factor-desc" id="fdesc_'+k+'">'+(di?di.desc:'')+'</div></div>';}).join('')+'</div><div class="crit-preview"><div class="cp-label">Criticality Score</div><div class="cp-score" id="critPreview">—</div><div class="cp-max" id="critMax"></div><div class="cp-alert" id="critAlert"></div></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Owner</label><input type="text" id="fOwner" value="'+esc(r.owner||'')+'"></div><div class="form-group"><label>Due Date</label><input type="date" id="fDue" value="'+(r.due||'')+'"></div></div>';
  html+='<div class="form-group"><label>Mitigation Plan</label><textarea id="fMitigation">'+esc(r.mitigation||'')+'</textarea></div>';
  document.getElementById('riskModalBody').innerHTML=html;
  updateCritPreview();
}
function toggleRackAll(label){var cb=label.querySelector('input');cb.checked=!cb.checked;label.classList.toggle('checked',cb.checked);if(cb.checked)label.parentElement.querySelectorAll('.rack-check:not(.all-check)').forEach(function(l){l.querySelector('input').checked=false;l.classList.remove('checked');});}
function toggleRackCheck(label){var cb=label.querySelector('input');cb.checked=!cb.checked;label.classList.toggle('checked',cb.checked);var allCb=label.parentElement.querySelector('.all-check input');if(cb.checked&&allCb&&allCb.checked){allCb.checked=false;label.parentElement.querySelector('.all-check').classList.remove('checked');}}


/* ═══════════════════════════════════════════════
   RISK DETAIL PANEL
   ═══════════════════════════════════════════════ */

function addRiskNote(riskId){
  var input=document.getElementById('detailNoteInput');if(!input)return;
  var note=input.value.trim();if(!note){toast('Note cannot be empty','error');return;}
  var r=appState.risks.find(function(x){return x.id===riskId;});if(!r)return;
  r.history=r.history||[];r.history.push({date:todayStr(),text:note});r.updated=todayStr();
  logActivity('risks','Note Added',riskFmtId(riskId),note.substring(0,60));
  toast('Note added','success');buildNav();renderContent();openRiskDetail(riskId);
}
/* ── Risk Context Menu ── */

/* ═══════════════════════════════════════════════
   REPORT GENERATOR
   ═══════════════════════════════════════════════ */

function openReportModal(){reportHtml=generateReportHtml();document.getElementById('reportBody').innerHTML='<div class="report-preview">'+reportHtml+'</div>';document.getElementById('copyStatus').textContent='';openModal('reportModal');}
function copyReport(){try{var blob=new Blob([reportHtml],{type:'text/html'});var item=new ClipboardItem({'text/html':blob,'text/plain':new Blob([document.querySelector('.report-preview').innerText],{type:'text/plain'})});navigator.clipboard.write([item]).then(function(){document.getElementById('copyStatus').textContent='✔ Copied! Paste into your email client.';setTimeout(function(){var el=document.getElementById('copyStatus');if(el)el.textContent='';},4000);});}catch(e){var range=document.createRange();range.selectNodeContents(document.querySelector('.report-preview'));var sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);document.getElementById('copyStatus').textContent='Text selected — press Ctrl+C to copy.';}}
function openReportTab(){var w=window.open('','_blank');if(w){w.document.write(pmdSanitizeHTML('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Report</title></head><body style="margin:0;padding:0;background:#fff">'+reportHtml+'</body></html>'));w.document.close();}else toast('Popup blocked','error');}
/* ═══════════════════════════════════════════════
   HEADER / ACCENT UPDATES
   ═══════════════════════════════════════════════ */

function updateAccent(){document.documentElement.style.setProperty('--accent',appState.settings.accent);var h=appState.settings.accent,r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);document.documentElement.style.setProperty('--accent-dim','rgba('+r+','+g+','+b+',0.15)');}
/* ═══════════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════════ */

function switchSettingsTab(tab,btn){document.querySelectorAll('.settings-tab').forEach(function(t){t.classList.remove('active');t.setAttribute('aria-selected','false');});document.querySelectorAll('.settings-section').forEach(function(s){s.classList.remove('active');});if(btn){btn.classList.add('active');btn.setAttribute('aria-selected','true');}var section={general:'settingsGeneral',modules:'settingsModules',dropdowns:'settingsDropdowns',reference:'settingsReference'}[tab];if(section)document.getElementById(section).classList.add('active');}

function buildModuleNameEditors(){var c=document.getElementById('moduleNameEditors');var html='';navConfig.forEach(function(nav){if(nav.key==='dashboard')return;html+='<div class="form-group"><label for="modName_'+nav.key+'">'+nav.icon+' '+nav.key.charAt(0).toUpperCase()+nav.key.slice(1)+' Module</label><input type="text" id="modName_'+nav.key+'" value="'+esc(appState.settings.moduleNames[nav.key]||'')+'"></div>';});c.innerHTML=html;}
function buildDropdownEditors(){var c=document.getElementById('dropdownEditors');var html='';var lists=appState.settings.dropdownLists;var labels={riskCategories:'Risk Categories',riskStatuses:'Risk Statuses',actionStatuses:'Action Statuses',actionPriorities:'Action Priorities',actionCategories:'Action Categories',bomCategories:'BOM Categories',bomStatuses:'BOM Statuses',equipmentTypes:'Equipment Types',operatingSystems:'Operating Systems',memoryTypes:'Memory Types',sanitizationMethods:'Sanitization Methods',classificationLevels:'Classification Levels',invStatuses:'Inventory Statuses',invLocations:'Inventory Locations',invConditions:'Inventory Conditions',hwReviewStatuses:'Security Review Statuses',swReviewStatuses:'Software Review Statuses',procurementStatuses:'Procurement Statuses',procurementCategories:'Procurement Categories'};
  Object.keys(lists).forEach(function(key){var items=lists[key];var chips=items.map(function(item,idx){return '<span class="dle-chip">'+esc(item)+'<button class="dle-chip-remove" data-list="'+key+'" data-idx="'+idx+'" aria-label="Remove '+esc(item)+'">✕</button></span>';}).join('');html+='<div class="dropdown-list-editor" data-listkey="'+key+'"><div class="dle-header"><label>'+(labels[key]||key)+'</label></div><div class="dle-items">'+chips+'</div><div class="dle-add-row"><input type="text" placeholder="Add item..." data-addlist="'+key+'"><button class="btn btn-sm" data-addlistbtn="'+key+'">Add</button></div></div>';});c.innerHTML=html;
  c.addEventListener('click',function(e){var rb=e.target.closest('.dle-chip-remove');if(rb){appState.settings.dropdownLists[rb.getAttribute('data-list')].splice(parseInt(rb.getAttribute('data-idx')),1);buildDropdownEditors();return;}var ab=e.target.closest('[data-addlistbtn]');if(ab){var lk=ab.getAttribute('data-addlistbtn');var input=c.querySelector('[data-addlist="'+lk+'"]');var val=input.value.trim();if(val&&appState.settings.dropdownLists[lk].indexOf(val)===-1){appState.settings.dropdownLists[lk].push(val);buildDropdownEditors();}}});
  c.addEventListener('keydown',function(e){if(e.key==='Enter'){var input=e.target.closest('[data-addlist]');if(input){var lk=input.getAttribute('data-addlist');var val=input.value.trim();if(val&&appState.settings.dropdownLists[lk].indexOf(val)===-1){appState.settings.dropdownLists[lk].push(val);buildDropdownEditors();}}}});
}

/* ═══════════════════════════════════════════════
   EXPORT / IMPORT
   ═══════════════════════════════════════════════ */








function triggerImport(){document.getElementById('importFileInput').click();}
document.getElementById('importFileInput').addEventListener('change',function(e){var file=e.target.files[0];if(!file)return;processImportFile(file);e.target.value='';});


function mergeDeep(target,source){var result={};Object.keys(target).forEach(function(k){result[k]=target[k];});Object.keys(source).forEach(function(k){if(source[k]&&typeof source[k]==='object'&&!Array.isArray(source[k])&&target[k]&&typeof target[k]==='object'&&!Array.isArray(target[k])){result[k]=mergeDeep(target[k],source[k]);}else{result[k]=source[k];}});return result;}
/* ═══════════════════════════════════════════════
   DRAG & DROP IMPORT
   ═══════════════════════════════════════════════ */
var dragCounter=0;
document.addEventListener('dragenter',function(e){e.preventDefault();dragCounter++;document.getElementById('dropZone').classList.add('active');});
document.addEventListener('dragleave',function(e){e.preventDefault();dragCounter--;if(dragCounter<=0){dragCounter=0;document.getElementById('dropZone').classList.remove('active');}});
document.addEventListener('dragover',function(e){e.preventDefault();});
document.addEventListener('drop',function(e){e.preventDefault();dragCounter=0;document.getElementById('dropZone').classList.remove('active');if(e.dataTransfer.files.length>0)processImportFile(e.dataTransfer.files[0]);});
/* ═══════════════════════════════════════════════
   + NEW BUTTON (contextual)
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   GLOBAL SEARCH
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   KEYBOARD SHORTCUTS
   ═══════════════════════════════════════════════ */
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(document.getElementById('confirmOverlay').classList.contains('open'))closeConfirm();else if(document.getElementById('bomModal').classList.contains('open'))closeModal('bomModal');else if(document.getElementById('invModal').classList.contains('open'))closeModal('invModal');else if(document.getElementById('actionModal').classList.contains('open'))closeModal('actionModal');else if(document.getElementById('riskModal').classList.contains('open'))closeModal('riskModal');else if(document.getElementById('subModal').classList.contains('open'))closeModal('subModal');else if(document.getElementById('reportModal').classList.contains('open'))closeModal('reportModal');else if(document.getElementById('settingsModal').classList.contains('open'))closeModal('settingsModal');else{closeDetailPanel();hideContextMenu();}}
  if((e.ctrlKey||e.metaKey)&&e.key==='e'){e.preventDefault();exportAllData();}
  if((e.ctrlKey||e.metaKey)&&e.key===','){e.preventDefault();openSettings();}
  /* V9.5: Ctrl+I = trigger import file picker */
  if((e.ctrlKey||e.metaKey)&&e.key==='i'){
    var tg=(document.activeElement||{}).tagName;
    if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;
    e.preventDefault();
    if(typeof triggerImport==='function')triggerImport();
  }
  /* V9.5: Ctrl+K = focus global search */
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){
    e.preventDefault();
    var gs=document.getElementById('globalSearchInput');
    if(gs){gs.focus();gs.select();}
  }
  /* V9.5: ? = show keyboard shortcuts overlay (when not typing) */
  if(e.key==='?'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
    var tg2=(document.activeElement||{}).tagName;
    if(tg2==='INPUT'||tg2==='TEXTAREA'||tg2==='SELECT')return;
    if(document.querySelector('.modal-overlay.open'))return;
    e.preventDefault();
    if(typeof openKbOverlay==='function')openKbOverlay();
  }
  // 'n' key to add new item (when not in input)
  if(e.key==='n'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){var a=document.activeElement;if(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.tagName==='SELECT')return;if(document.querySelector('.modal-overlay.open'))return;if(currentModule==='risks'){e.preventDefault();openAddRiskModal();}else if(currentModule==='actions'){e.preventDefault();openAddActionModal();}else if(currentModule==='boms'){e.preventDefault();openAddBomModal();}else if(currentModule==='inventory'){e.preventDefault();openAddInvModal();}}
});
/* ═══════════════════════════════════════════════
   TIER 2: UNDO/REDO KEYBOARD SHORTCUTS
   ═══════════════════════════════════════════════ */
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    var tag = (document.activeElement || {}).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    e.preventDefault();
    performUndo();
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    var tag2 = (document.activeElement || {}).tagName;
    if (tag2 === 'INPUT' || tag2 === 'TEXTAREA' || tag2 === 'SELECT') return;
    e.preventDefault();
    performRedo();
  }
});
/* ═══════════════════════════════════════════════
   SECURITY REVIEW MODULE
   ═══════════════════════════════════════════════ */
function hwFmtId(id) { return 'HW-'+String(id).padStart(3,'0'); }
function hwGetStatusClass(s) {
  if(!s) return '';
  var k=s.toLowerCase().replace(/\s+/g,'');
  if(k==='pendingreview') return 'hw-status-pending';
  if(k==='approved') return 'hw-status-approved';
  if(k==='needsupdate') return 'hw-status-needsupdate';
  if(k==='flagged') return 'hw-status-flagged';
  if(k==='decommissioned') return 'hw-status-decommissioned';
  return 'pill-muted';
}
function hwGetClassClass(c) {
  if(!c) return '';
  var k=c.toLowerCase().replace(/[^a-z]/g,'');
  if(k.indexOf('secret')>=0 && k.indexOf('top')<0) return 'hw-class-secret';
  if(k.indexOf('tssci')>=0 || k.indexOf('topsecret')>=0) return 'hw-class-tssci';
  if(k==='unclassified') return 'hw-class-unclassified';
  if(k==='cui') return 'hw-class-cui';
  return 'pill-muted';
}
function swFmtId(id) { return 'SW-'+String(id).padStart(3,'0'); }
function swGetStatusClass(s) {
  if(!s) return '';
  var k=s.toLowerCase().replace(/\s+/g,'');
  if(k==='pendingreview') return 'sw-status-pending';
  if(k==='approved') return 'sw-status-approved';
  if(k==='needsupdate') return 'sw-status-needsupdate';
  if(k==='flagged') return 'sw-status-flagged';
  if(k==='decommissioned') return 'sw-status-decommissioned';
  return 'pill-muted';
}
function getFilteredSwItems() {
  var list = appState.swItems.slice();
  if(swStatusFilter!=='all') list=list.filter(function(s){return s.status===swStatusFilter;});
  if(swSearchQuery){var q=swSearchQuery.toLowerCase();list=list.filter(function(s){return (s.swName||'').toLowerCase().includes(q)||(s.version||'').toLowerCase().includes(q)||(s.vendor||'').toLowerCase().includes(q)||(s.licenseType||'').toLowerCase().includes(q)||swFmtId(s.id).toLowerCase().includes(q);});}
  list.sort(function(a,b){var av,bv;switch(swSortField){case'id':av=a.id;bv=b.id;break;case'swName':av=(a.swName||'').toLowerCase();bv=(b.swName||'').toLowerCase();break;case'version':av=(a.version||'').toLowerCase();bv=(b.version||'').toLowerCase();break;case'vendor':av=(a.vendor||'').toLowerCase();bv=(b.vendor||'').toLowerCase();break;case'classification':av=(a.classification||'').toLowerCase();bv=(b.classification||'').toLowerCase();break;case'status':av=(a.status||'').toLowerCase();bv=(b.status||'').toLowerCase();break;default:av=a.id;bv=b.id;}if(typeof av==='string')return swSortDir*av.localeCompare(bv);return swSortDir*(av-bv);});
  return list;
}
function getFilteredHwItems() {
  var list = appState.hwItems.slice();
  if(hwStatusFilter!=='all') list=list.filter(function(h){return h.status===hwStatusFilter;});
  if(hwSearchQuery){var q=hwSearchQuery.toLowerCase();list=list.filter(function(h){return (h.nodeName||'').toLowerCase().includes(q)||(h.equipType||'').toLowerCase().includes(q)||(h.vendor||'').toLowerCase().includes(q)||(h.model||'').toLowerCase().includes(q)||(h.serialNumber||'').toLowerCase().includes(q)||(h.tagNumber||'').toLowerCase().includes(q)||hwFmtId(h.id).toLowerCase().includes(q);});}
  list.sort(function(a,b){var av,bv;switch(hwSortField){case'id':av=a.id;bv=b.id;break;case'nodeName':av=(a.nodeName||'').toLowerCase();bv=(b.nodeName||'').toLowerCase();break;case'equipType':av=(a.equipType||'').toLowerCase();bv=(b.equipType||'').toLowerCase();break;case'vendor':av=(a.vendor||'').toLowerCase();bv=(b.vendor||'').toLowerCase();break;case'classification':av=(a.classification||'').toLowerCase();bv=(b.classification||'').toLowerCase();break;case'status':av=(a.status||'').toLowerCase();bv=(b.status||'').toLowerCase();break;default:av=a.id;bv=b.id;}if(typeof av==='string')return hwSortDir*av.localeCompare(bv);return hwSortDir*(av-bv);});
  return list;
}
function renderHwModule(area) {
  var filtered=getFilteredHwItems();
  var arrow=function(f){return hwSortField===f?(hwSortDir===1?' ▲':' ▼'):'';};
  var title=hwStatusFilter==='all'?'All Equipment':hwStatusFilter+' Equipment';
  var toolbarHTML='<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap"><button class="btn btn-sm btn-primary" onclick="openAddHwModal()">+ Add Equipment</button><button class="btn btn-sm" onclick="openHwReportModal()">Generate Hardware Report</button><button class="btn btn-sm" style="margin-left:auto" onclick="exportModuleCsv(\'hwItems\')">⬇ CSV</button></div>';
  var tableHTML='<div class="table-container"><div class="table-header"><h3>'+esc(title)+' ('+filtered.length+')</h3><div class="table-filters"><input class="filter-input" type="text" id="hwSearchInput" placeholder="Search equipment..." value="'+esc(hwSearchQuery)+'" aria-label="Search equipment">'+(hwSearchQuery?'<button class="btn btn-sm" onclick="hwClearSearch()">✕</button>':'')+'</div></div>';
  if(filtered.length>0){
    tableHTML+='<div class="table-scroll"><table class="rtable"><thead><tr><th scope="col" onclick="hwSortBy(\'id\')">ID'+arrow('id')+'</th><th scope="col" onclick="hwSortBy(\'nodeName\')">Node/System'+arrow('nodeName')+'</th><th scope="col" onclick="hwSortBy(\'equipType\')">Type'+arrow('equipType')+'</th><th scope="col" onclick="hwSortBy(\'vendor\')">Vendor'+arrow('vendor')+'</th><th scope="col">Model</th><th scope="col">Serial #</th><th scope="col">Tag #</th><th scope="col" onclick="hwSortBy(\'classification\')">Classification'+arrow('classification')+'</th><th scope="col">Memory</th><th scope="col">Docs</th><th scope="col" onclick="hwSortBy(\'status\')">Status'+arrow('status')+'</th><th scope="col" class="no-sort"></th></tr></thead><tbody>';
    var pageItems = paginateItems(filtered, 'hwItems');
    pageItems.forEach(function(h){
      var memSummary=hwMemorySummary(h);
      var docCount=hwDocCount(h);
      tableHTML+='<tr onclick="openHwDetail('+h.id+')" data-hw-id="'+h.id+'"><td class="risk-id">'+hwFmtId(h.id)+'</td><td class="risk-title-cell"><span class="risk-title-text" title="'+esc(h.nodeName||'')+'">'+esc(h.nodeName||'—')+'</span></td><td style="font-size:12px">'+esc(h.equipType||'—')+'</td><td style="font-size:12px">'+esc(h.vendor||'—')+'</td><td style="font-size:12px">'+esc(h.model||'—')+'</td><td style="font-family:var(--font-mono);font-size:11px">'+esc(h.serialNumber||'—')+'</td><td style="font-family:var(--font-mono);font-size:11px">'+esc(h.tagNumber||'—')+'</td><td><span class="badge-pill '+hwGetClassClass(h.classification)+'">'+esc(h.classification||'—')+'</span></td><td style="font-size:11px;color:var(--text-muted)">'+esc(memSummary)+'</td><td style="font-size:11px"><span style="color:'+(docCount.total===docCount.checked?'var(--green)':'var(--yellow)')+'">'+docCount.checked+'/'+docCount.total+'</span></td><td><span class="badge-pill '+hwGetStatusClass(h.status)+'">'+esc(h.status||'—')+'</span></td><td><button class="action-dots" onclick="event.stopPropagation();hwShowCtx(event,'+h.id+')">⋮</button></td></tr>';
    });
    tableHTML+='</tbody></table></div>';
    tableHTML+=renderPagination('hwItems', filtered.length);
  } else {
    tableHTML+='<div class="empty-state"><div class="es-icon">⬡</div><h3>No equipment found</h3><p>'+(hwSearchQuery?'No results for "'+esc(hwSearchQuery)+'".':'Add equipment or adjust filters.')+'</p></div>';
  }
  tableHTML+='</div>';
  // Software section
  var filteredSw=getFilteredSwItems();
  var swArrow=function(f){return swSortField===f?(swSortDir===1?' ▲':' ▼'):'';};
  var swTitle=swStatusFilter==='all'?'All Software':swStatusFilter+' Software';
  var swTableHTML='<div class="table-container" style="margin-top:24px"><div class="table-header"><h3>'+esc(swTitle)+' ('+filteredSw.length+')</h3><div class="table-filters"><input class="filter-input" type="text" id="swSearchInput" placeholder="Search software..." value="'+esc(swSearchQuery)+'" aria-label="Search software">'+(swSearchQuery?'<button class="btn btn-sm" onclick="swClearSearch()">✕</button>':'')+'<button class="btn btn-sm btn-primary" style="margin-left:8px" onclick="openAddSwModal()">+ Add Software</button></div></div>';
  if(filteredSw.length>0){
    swTableHTML+='<div class="table-scroll"><table class="rtable"><thead><tr><th scope="col" onclick="swSortBy(\'id\')">ID'+swArrow('id')+'</th><th scope="col" onclick="swSortBy(\'swName\')">Software Name'+swArrow('swName')+'</th><th scope="col" onclick="swSortBy(\'version\')">Version'+swArrow('version')+'</th><th scope="col" onclick="swSortBy(\'vendor\')">Vendor'+swArrow('vendor')+'</th><th scope="col">License</th><th scope="col" onclick="swSortBy(\'classification\')">Classification'+swArrow('classification')+'</th><th scope="col">STIG</th><th scope="col" onclick="swSortBy(\'status\')">Status'+swArrow('status')+'</th><th scope="col" class="no-sort"></th></tr></thead><tbody>';
    var pageItemsSw = paginateItems(filteredSw, 'swItems');
    pageItemsSw.forEach(function(s){
      swTableHTML+='<tr onclick="openSwDetail('+s.id+')" data-sw-id="'+s.id+'"><td class="risk-id">'+swFmtId(s.id)+'</td><td class="risk-title-cell"><span class="risk-title-text" title="'+esc(s.swName||'')+'">'+esc(s.swName||'—')+'</span></td><td style="font-size:12px">'+esc(s.version||'—')+'</td><td style="font-size:12px">'+esc(s.vendor||'—')+'</td><td style="font-size:12px">'+esc(s.licenseType||'—')+'</td><td><span class="badge-pill pill-muted">'+esc(s.classification||'—')+'</span></td><td style="font-size:12px">'+esc(s.stigCompliance||'—')+'</td><td><span class="badge-pill '+swGetStatusClass(s.status)+'">'+esc(s.status||'—')+'</span></td><td><button class="action-dots" onclick="event.stopPropagation();swShowCtx(event,'+s.id+')">⋮</button></td></tr>';
    });
    swTableHTML+='</tbody></table></div>';
    swTableHTML+=renderPagination('swItems', filteredSw.length);
  } else {
    swTableHTML+='<div class="empty-state"><div class="es-icon">⬡</div><h3>No software found</h3><p>'+(swSearchQuery?'No results for "'+esc(swSearchQuery)+'".':'Add software items or adjust filters.')+'</p></div>';
  }
  swTableHTML+='</div>';
  area.innerHTML=toolbarHTML+tableHTML+swTableHTML;
  var si=document.getElementById('hwSearchInput');
  if(si) si.addEventListener('input',function(){var self=this;debounce('hwSearch',function(){hwSearchQuery=self.value;renderContent();var inp=document.getElementById('hwSearchInput');if(inp){inp.focus();inp.setSelectionRange(hwSearchQuery.length,hwSearchQuery.length);}},150);});
  var swi=document.getElementById('swSearchInput');
  if(swi) swi.addEventListener('input',function(){var self=this;debounce('swSearch',function(){swSearchQuery=self.value;renderContent();var inp=document.getElementById('swSearchInput');if(inp){inp.focus();inp.setSelectionRange(swSearchQuery.length,swSearchQuery.length);}},150);});
}
function hwMemorySummary(h) {
  if(!h.memory||h.memory.length===0) return '—';
  var total=0;
  h.memory.forEach(function(m){
    var sz=parseFloat(m.size)||0;
    if((m.unit||'').toUpperCase()==='TB') sz*=1024;
    total+=sz;
  });
  if(total>=1024) return (total/1024).toFixed(1)+' TB';
  return total+' GB';
}
function hwDocCount(h) {
  var total=3, checked=0;
  if(h.docLov) checked++;
  if(h.docSanProc) checked++;
  if(h.docHwReport) checked++;
  return {total:total,checked:checked};
}
function hwSortBy(f){if(hwSortField===f)hwSortDir*=-1;else{hwSortField=f;hwSortDir=1;}announce('Sorted by '+f+', '+(hwSortDir===1?'ascending':'descending'));renderContent();}
function hwClearSearch(){hwSearchQuery='';renderContent();}
/* ── HW Modal ── */
function openAddHwModal(){
  hwEditingId=null;
  document.getElementById('hwModalTitle').textContent='New Equipment';
  document.getElementById('hwSaveBtn').textContent='Add Equipment';
  hwTempMemory=[{size:'',unit:'GB',type:'RAM',classification:''}];
  renderHwModalBody({equipType:'',vendor:'',model:'',serialNumber:'',tagNumber:'',nodeName:'',os:'',biosVersion:'',biosCompliant:'No',memory:[],isMobile:'No',mobileLocation:'',mobileSendDate:'',mobileExpReturn:'',mobileActReturn:'',mobileRecertDate:'',archivedHD:'No',building:'',floor:'',colRoom:'',office:'',classification:'',accountability:'',uid:'',ca:'',sanitization:'',docLov:false,docSanProc:false,docHwReport:false,hwReportAction:'',hwReportDest:'',assemblyId:null,notes:'',status:'Pending Review'});
  openModal('hwModal');
}
function openEditHwModal(id){
  var h=appState.hwItems.find(function(x){return x.id===id;});if(!h)return;
  hwEditingId=id;
  document.getElementById('hwModalTitle').textContent='Edit '+hwFmtId(id);
  document.getElementById('hwSaveBtn').textContent='Save Changes';
  hwTempMemory=JSON.parse(JSON.stringify(h.memory||[]));
  if(hwTempMemory.length===0) hwTempMemory=[{size:'',unit:'GB',type:'RAM',classification:''}];
  renderHwModalBody(h);
  openModal('hwModal');
}
function renderHwModalBody(h){
  var equipTypes=appState.settings.dropdownLists.equipmentTypes||[];
  var osList=appState.settings.dropdownLists.operatingSystems||[];
  var classLevels=appState.settings.dropdownLists.classificationLevels||[];
  var sanMethods=appState.settings.dropdownLists.sanitizationMethods||[];
  var racks=appState.racks||[];
  var html='<div class="form-row"><div class="form-group"><label>Equipment Type *</label><select id="hwEquipType">'+equipTypes.map(function(t){return '<option'+(h.equipType===t?' selected':'')+'>'+esc(t)+'</option>';}).join('')+'</select></div>';
  html+='<div class="form-group"><label>Classification *</label><select id="hwClassification">'+classLevels.map(function(c){return '<option'+(h.classification===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Vendor</label><input type="text" id="hwVendor" value="'+esc(h.vendor||'')+'"></div>';
  html+='<div class="form-group"><label>Accountability</label><input type="text" id="hwAccountability" value="'+esc(h.accountability||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Model</label><input type="text" id="hwModel" value="'+esc(h.model||'')+'"></div>';
  html+='<div class="form-group"><label>UID</label><input type="text" id="hwUID" value="'+esc(h.uid||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Serial Number *</label><input type="text" id="hwSerial" value="'+esc(h.serialNumber||'')+'"></div>';
  html+='<div class="form-group"><label>Tag Number</label><input type="text" id="hwTag" value="'+esc(h.tagNumber||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Node/System Name *</label><input type="text" id="hwNodeName" value="'+esc(h.nodeName||'')+'"></div>';
  html+='<div class="form-group"><label>CA</label><input type="text" id="hwCA" value="'+esc(h.ca||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>OS</label><select id="hwOS"><option value="">—</option>'+osList.map(function(o){return '<option'+(h.os===o?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select></div>';
  html+='<div class="form-group"><label>Sanitization</label><select id="hwSanitization"><option value="">—</option>'+sanMethods.map(function(s){return '<option'+((h.sanitization||'')===s?' selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>BIOS Version</label><input type="text" id="hwBiosVer" value="'+esc(h.biosVersion||'')+'"></div>';
  html+='<div class="form-group"><label>BIOS Compliant</label><select id="hwBiosCompl"><option'+(h.biosCompliant==='Yes'?' selected':'')+'>Yes</option><option'+(h.biosCompliant!=='Yes'?' selected':'')+'>No</option></select></div></div>';
  // Location
  html+='<div class="form-row-4"><div class="form-group"><label>Building</label><input type="text" id="hwBldg" value="'+esc(h.building||'')+'"></div>';
  html+='<div class="form-group"><label>Floor</label><input type="text" id="hwFloor" value="'+esc(h.floor||'')+'"></div>';
  html+='<div class="form-group"><label>Col/Room</label><input type="text" id="hwColRoom" value="'+esc(h.colRoom||'')+'"></div>';
  html+='<div class="form-group"><label>Office</label><input type="text" id="hwOffice" value="'+esc(h.office||'')+'"></div></div>';
  // Assembly link
  html+='<div class="form-group"><label>Assigned Assembly</label><select id="hwAssemblyId"><option value="">— None —</option>'+racks.map(function(rk){return '<option value="'+rk.id+'"'+((h.assemblyId||'')==rk.id?' selected':'')+'>'+esc(rk.name)+'</option>';}).join('')+'</select></div>';
  // Memory sub-table
  html+='<div class="form-group"><label>Memory <button class="btn btn-sm" style="margin-left:8px;padding:2px 8px;font-size:11px" onclick="hwAddMemRow()">+ Add Row</button></label>';
  html+='<table class="hw-mem-table" id="hwMemTable"><thead><tr><th scope="col">Size</th><th scope="col">Unit</th><th scope="col">Type</th><th scope="col">Classification</th><th scope="col"></th></tr></thead><tbody>';
  hwTempMemory.forEach(function(m,i){
    html+='<tr><td><input type="number" value="'+(m.size||'')+'" data-mem-idx="'+i+'" data-mem-field="size" min="0" step="1"></td>';
    html+='<td><select data-mem-idx="'+i+'" data-mem-field="unit"><option'+(m.unit==='GB'?' selected':'')+'>GB</option><option'+(m.unit==='TB'?' selected':'')+'>TB</option></select></td>';
    html+='<td><select data-mem-idx="'+i+'" data-mem-field="type"><option'+(m.type==='RAM'?' selected':'')+'>RAM</option><option'+(m.type==='EEPROM'?' selected':'')+'>EEPROM</option><option'+(m.type==='Flash'?' selected':'')+'>Flash</option><option'+(m.type==='SSD'?' selected':'')+'>SSD</option><option'+(m.type==='HDD'?' selected':'')+'>HDD</option></select></td>';
    html+='<td><select data-mem-idx="'+i+'" data-mem-field="classification">'+classLevels.map(function(c){return '<option'+((m.classification||'Unclassified')===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></td>';
    html+='<td><button class="mem-remove" onclick="hwRemoveMemRow('+i+')">✕</button></td></tr>';
  });
  html+='</tbody></table></div>';
  // Mobile System
  html+='<div class="form-group"><label>Mobile System</label><select id="hwIsMobile" onchange="hwToggleMobile()"><option'+(h.isMobile==='Yes'?' selected':'')+'>Yes</option><option'+(h.isMobile!=='Yes'?' selected':'')+'>No</option></select></div>';
  html+='<div id="hwMobileFields" class="hw-mobile-section" style="display:'+(h.isMobile==='Yes'?'block':'none')+'">';
  html+='<div class="form-row"><div class="form-group"><label>Mobile Location</label><input type="text" id="hwMobileLoc" value="'+esc(h.mobileLocation||'')+'"></div>';
  html+='<div class="form-group"><label>Send Date</label><input type="date" id="hwMobileSend" value="'+esc(h.mobileSendDate||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Expected Return</label><input type="date" id="hwMobileExpRet" value="'+esc(h.mobileExpReturn||'')+'"></div>';
  html+='<div class="form-group"><label>Actual Return</label><input type="date" id="hwMobileActRet" value="'+esc(h.mobileActReturn||'')+'"></div></div>';
  html+='<div class="form-group"><label>Recertified Date</label><input type="date" id="hwMobileRecert" value="'+esc(h.mobileRecertDate||'')+'"></div>';
  html+='</div>';
  // Archived HD
  html+='<div class="form-group"><label>Archived HD</label><select id="hwArchivedHD"><option'+(h.archivedHD==='Yes'?' selected':'')+'>Yes</option><option'+(h.archivedHD!=='Yes'?' selected':'')+'>No</option></select></div>';
  // Document tracking
  html+='<div class="form-group"><label>Document Tracking</label><div class="hw-doc-checks">';
  html+='<div class="hw-doc-check"><input type="checkbox" id="hwDocLov"'+(h.docLov?' checked':'')+'><label for="hwDocLov">Letter of Volatility — on file</label></div>';
  html+='<div class="hw-doc-check"><input type="checkbox" id="hwDocSanProc"'+(h.docSanProc?' checked':'')+'><label for="hwDocSanProc">Sanitization Procedure — on file</label></div>';
  html+='<div class="hw-doc-check"><input type="checkbox" id="hwDocHwReport"'+(h.docHwReport?' checked':'')+' onchange="hwToggleReportAction()"><label for="hwDocHwReport">Security Report completed</label></div>';
  html+='<div id="hwReportActionFields" style="display:'+(h.docHwReport?'block':'none')+';margin-left:24px;margin-top:6px">';
  html+='<div class="form-row"><div class="form-group"><label>Action</label><select id="hwReportAction"><option value="">—</option><option'+(h.hwReportAction==='Addition'?' selected':'')+'>Addition</option><option'+(h.hwReportAction==='Removal'?' selected':'')+'>Removal</option><option'+(h.hwReportAction==='Downgrade'?' selected':'')+'>Downgrade</option><option'+(h.hwReportAction==='Maintenance'?' selected':'')+'>Maintenance</option><option'+(h.hwReportAction==='Archive'?' selected':'')+'>Archive</option><option'+(h.hwReportAction==='Move'?' selected':'')+'>Move</option></select></div>';
  html+='<div class="form-group"><label>Destination</label><input type="text" id="hwReportDest" value="'+esc(h.hwReportDest||'')+'"></div></div></div>';
  html+='</div></div>';
  // Status
  html+='<div class="form-row"><div class="form-group"><label>Review Status</label><select id="hwStatus">'+appState.settings.dropdownLists.hwReviewStatuses.map(function(s){return '<option'+(h.status===s?' selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></div>';
  html+='<div class="form-group"><label>&nbsp;</label></div></div>';
  // Notes
  html+='<div class="form-group"><label>Notes</label><textarea id="hwNotes" rows="3">'+esc(h.notes||'')+'</textarea></div>';
  document.getElementById('hwModalBody').innerHTML=html;
  // Wire memory table change events
  var memTable=document.getElementById('hwMemTable');
  if(memTable) memTable.addEventListener('change',function(e){
    var idx=e.target.getAttribute('data-mem-idx');
    var field=e.target.getAttribute('data-mem-field');
    if(idx!==null&&field){hwTempMemory[parseInt(idx)][field]=e.target.value;}
  });
}
function hwToggleMobile(){
  var v=document.getElementById('hwIsMobile').value;
  document.getElementById('hwMobileFields').style.display=v==='Yes'?'block':'none';
}
function hwToggleReportAction(){
  var checked=document.getElementById('hwDocHwReport').checked;
  document.getElementById('hwReportActionFields').style.display=checked?'block':'none';
}
function hwAddMemRow(){
  hwTempMemory.push({size:'',unit:'GB',type:'RAM',classification:''});
  hwSyncMemFromDOM();
  var h=hwReadFormData();
  renderHwModalBody(h);
}
function hwRemoveMemRow(idx){
  hwSyncMemFromDOM();
  hwTempMemory.splice(idx,1);
  if(hwTempMemory.length===0) hwTempMemory=[{size:'',unit:'GB',type:'RAM',classification:''}];
  var h=hwReadFormData();
  renderHwModalBody(h);
}
function hwSyncMemFromDOM(){
  var rows=document.querySelectorAll('#hwMemTable tbody tr');
  rows.forEach(function(row,i){
    if(hwTempMemory[i]){
      var sizeInput=row.querySelector('[data-mem-field="size"]');
      var unitSelect=row.querySelector('[data-mem-field="unit"]');
      var typeSelect=row.querySelector('[data-mem-field="type"]');
      var classSelect=row.querySelector('[data-mem-field="classification"]');
      if(sizeInput)hwTempMemory[i].size=sizeInput.value;
      if(unitSelect)hwTempMemory[i].unit=unitSelect.value;
      if(typeSelect)hwTempMemory[i].type=typeSelect.value;
      if(classSelect)hwTempMemory[i].classification=classSelect.value;
    }
  });
}
function hwReadFormData(){
  return {
    equipType:(document.getElementById('hwEquipType')||{}).value||'',
    vendor:(document.getElementById('hwVendor')||{}).value||'',
    model:(document.getElementById('hwModel')||{}).value||'',
    serialNumber:(document.getElementById('hwSerial')||{}).value||'',
    tagNumber:(document.getElementById('hwTag')||{}).value||'',
    nodeName:(document.getElementById('hwNodeName')||{}).value||'',
    os:(document.getElementById('hwOS')||{}).value||'',
    biosVersion:(document.getElementById('hwBiosVer')||{}).value||'',
    biosCompliant:(document.getElementById('hwBiosCompl')||{}).value||'No',
    isMobile:(document.getElementById('hwIsMobile')||{}).value||'No',
    mobileLocation:(document.getElementById('hwMobileLoc')||{}).value||'',
    mobileSendDate:(document.getElementById('hwMobileSend')||{}).value||'',
    mobileExpReturn:(document.getElementById('hwMobileExpRet')||{}).value||'',
    mobileActReturn:(document.getElementById('hwMobileActRet')||{}).value||'',
    mobileRecertDate:(document.getElementById('hwMobileRecert')||{}).value||'',
    archivedHD:(document.getElementById('hwArchivedHD')||{}).value||'No',
    building:(document.getElementById('hwBldg')||{}).value||'',
    floor:(document.getElementById('hwFloor')||{}).value||'',
    colRoom:(document.getElementById('hwColRoom')||{}).value||'',
    office:(document.getElementById('hwOffice')||{}).value||'',
    classification:(document.getElementById('hwClassification')||{}).value||'',
    accountability:(document.getElementById('hwAccountability')||{}).value||'',
    uid:(document.getElementById('hwUID')||{}).value||'',
    ca:(document.getElementById('hwCA')||{}).value||'',
    sanitization:(document.getElementById('hwSanitization')||{}).value||'',
    docLov:!!(document.getElementById('hwDocLov')||{}).checked,
    docSanProc:!!(document.getElementById('hwDocSanProc')||{}).checked,
    docHwReport:!!(document.getElementById('hwDocHwReport')||{}).checked,
    hwReportAction:(document.getElementById('hwReportAction')||{}).value||'',
    hwReportDest:(document.getElementById('hwReportDest')||{}).value||'',
    assemblyId:parseInt((document.getElementById('hwAssemblyId')||{}).value)||null,
    status:(document.getElementById('hwStatus')||{}).value||'Pending Review',
    notes:(document.getElementById('hwNotes')||{}).value||'',
    memory:JSON.parse(JSON.stringify(hwTempMemory))
  };
}
function saveHwItem(){
  hwSyncMemFromDOM();
  var data=hwReadFormData();
  if(!data.nodeName&&!data.serialNumber){toast('Node/System Name or Serial Number required','error');return;}
  data.updated=todayStr();
  data.memory=hwTempMemory.filter(function(m){return m.size||m.type!=='RAM'||m.unit!=='GB';});
  snapshotForUndo(hwEditingId ? 'Edit equipment' : 'Add equipment');
  if(hwEditingId){
    var item=appState.hwItems.find(function(x){return x.id===hwEditingId;});
    if(item){
      var ch=[];
      if(item.status!==data.status)ch.push('Status: '+item.status+' → '+data.status);
      if(item.classification!==data.classification)ch.push('Classification: '+(item.classification||'—')+' → '+data.classification);
      Object.assign(item,data);
      if(ch.length>0){item.history=item.history||[];item.history.push({date:todayStr(),text:ch.join('. ')});}
      logActivity('hwItems','Updated',hwFmtId(hwEditingId),item.nodeName||item.equipType);
      toast(hwFmtId(hwEditingId)+' updated','success');
    }
  } else {
    data.id=_hwNextId++;data.created=todayStr();data.history=[{date:todayStr(),text:'Equipment added for review.'}];
    appState.hwItems.push(data);
    logActivity('hwItems','Created',hwFmtId(data.id),data.nodeName||data.equipType);
    toast(hwFmtId(data.id)+' added','success');
  }
  closeModal('hwModal');buildNav();renderContent();
}
/* ── HW Detail Panel ── */
function v95_openHwDetail(id){
  var h=appState.hwItems.find(function(x){return x.id===id;});if(!h)return;
  var panel=document.getElementById('detailPanel');
  document.getElementById('detailPanelTitle').textContent=hwFmtId(h.id)+'  '+(h.nodeName||h.equipType||'Equipment');
  document.getElementById('detailEditBtn').onclick=function(){closeDetailPanel();openEditHwModal(id);};
  var html='<div class="detail-section"><h4>Equipment Details</h4>';
  html+='<div class="detail-field"><span class="field-label">Type</span><span class="field-value">'+esc(h.equipType||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Classification</span><span class="badge-pill '+hwGetClassClass(h.classification)+'">'+esc(h.classification||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Status</span><span class="badge-pill '+hwGetStatusClass(h.status)+'">'+esc(h.status||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Vendor</span><span class="field-value">'+esc(h.vendor||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Model</span><span class="field-value">'+esc(h.model||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Serial #</span><span class="field-value" style="font-family:var(--font-mono)">'+esc(h.serialNumber||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Tag #</span><span class="field-value" style="font-family:var(--font-mono)">'+esc(h.tagNumber||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Node/System</span><span class="field-value">'+esc(h.nodeName||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">OS</span><span class="field-value">'+esc(h.os||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">BIOS</span><span class="field-value">'+esc(h.biosVersion||'—')+' ('+(h.biosCompliant==='Yes'?'<span style="color:var(--green)">Compliant</span>':'<span style="color:var(--red)">Non-compliant</span>')+')</span></div>';
  html+='<div class="detail-field"><span class="field-label">Accountability</span><span class="field-value">'+esc(h.accountability||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">UID</span><span class="field-value">'+esc(h.uid||'—')+'</span></div>';
  if(h.assemblyId){var rk=appState.racks.find(function(r){return r.id===h.assemblyId;});html+='<div class="detail-field"><span class="field-label">Assembly</span><span class="field-value inv-link" onclick="openAssemblyFromHw('+h.assemblyId+')">'+esc(rk?rk.name:'Assembly '+h.assemblyId)+'</span></div>';}
  html+='</div>';
  // Location
  if(h.building||h.floor||h.colRoom||h.office){
    html+='<div class="detail-section"><h4>Location</h4>';
    html+='<div class="detail-field"><span class="field-label">Building</span><span class="field-value">'+esc(h.building||'—')+'</span></div>';
    html+='<div class="detail-field"><span class="field-label">Floor</span><span class="field-value">'+esc(h.floor||'—')+'</span></div>';
    html+='<div class="detail-field"><span class="field-label">Col/Room</span><span class="field-value">'+esc(h.colRoom||'—')+'</span></div>';
    html+='<div class="detail-field"><span class="field-label">Office</span><span class="field-value">'+esc(h.office||'—')+'</span></div>';
    html+='</div>';
  }
  // Memory
  if(h.memory&&h.memory.length>0){
    html+='<div class="detail-section"><h4>Memory</h4>';
    h.memory.forEach(function(m){html+='<div class="detail-field"><span class="field-label">'+esc(m.type||'—')+'</span><span class="field-value">'+esc(m.size||'—')+' '+esc(m.unit||'')+(m.classification&&m.classification!=='Unclassified'?' — <span class="badge-pill '+hwGetClassClass(m.classification)+'">'+esc(m.classification)+'</span>':'')+'</span></div>';});
    html+='</div>';
  }
  // Documents
  html+='<div class="detail-section"><h4>Documents</h4>';
  html+='<div class="detail-field"><span class="field-label">Letter of Volatility</span><span style="color:'+(h.docLov?'var(--green)':'var(--text-muted)')+'">'+( h.docLov?'✓ On file':'✕ Missing')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Sanitization Proc.</span><span style="color:'+(h.docSanProc?'var(--green)':'var(--text-muted)')+'">'+( h.docSanProc?'✓ On file':'✕ Missing')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Security Report</span><span style="color:'+(h.docHwReport?'var(--green)':'var(--text-muted)')+'">'+( h.docHwReport?'✓ Completed'+(h.hwReportAction?' — '+esc(h.hwReportAction):''):'✕ Not completed')+'</span></div>';
  html+='</div>';
  // Mobile
  if(h.isMobile==='Yes'){
    html+='<div class="detail-section"><h4>Mobile System</h4>';
    html+='<div class="detail-field"><span class="field-label">Location</span><span class="field-value">'+esc(h.mobileLocation||'—')+'</span></div>';
    html+='<div class="detail-field"><span class="field-label">Send Date</span><span class="field-value">'+fmtDate(h.mobileSendDate)+'</span></div>';
    html+='<div class="detail-field"><span class="field-label">Expected Return</span><span class="field-value">'+fmtDate(h.mobileExpReturn)+'</span></div>';
    html+='<div class="detail-field"><span class="field-label">Actual Return</span><span class="field-value">'+fmtDate(h.mobileActReturn)+'</span></div>';
    html+='<div class="detail-field"><span class="field-label">Recertified</span><span class="field-value">'+fmtDate(h.mobileRecertDate)+'</span></div>';
    html+='</div>';
  }
  // Notes section
  var notesArr = h.notesArray || [];
  html+='<div class="detail-section"><h4>Notes ('+ notesArr.length+')</h4>';
  if(notesArr.length > 0) {
    notesArr.forEach(function(n){
      html+='<div style="padding:8px;background:var(--bg-tertiary);border-radius:var(--radius);margin-top:4px;font-size:12px"><div style="color:var(--text-secondary);font-size:11px">'+fmtDate(n.date)+'</div><div style="margin-top:2px">'+esc(n.text)+'</div></div>';
    });
  }
  html+='<div style="margin-top:8px"><textarea id="hwNoteText" placeholder="Add a note..." style="width:100%;padding:6px 10px;border-radius:var(--radius);border:1px solid var(--border);background:var(--bg-primary);color:var(--text-primary);font-size:12px;min-height:40px;font-family:var(--font-body)"></textarea><button class="btn btn-sm btn-primary" style="margin-top:6px" onclick="addHwNote('+h.id+')">Add Note</button></div></div>';
  // History
  if(h.history&&h.history.length>0){
    html+='<div class="detail-section"><h4>History</h4>';
    h.history.forEach(function(e){html+='<div class="history-item"><div class="history-date">'+esc(e.date)+'</div><div class="history-text">'+esc(e.text)+'</div></div>';});
    html+='</div>';
  }
  document.getElementById('detailPanelBody').innerHTML=html;
  panel.classList.add('open');
}
/* ── HW Context Menu ── */
function hwShowCtx(e,id){
  hwCtxTargetId=id;
  showContextMenu(e.clientX,e.clientY,[
    {icon:'✎',label:'Edit',action:function(){openEditHwModal(id);}},
    {icon:'⎘',label:'Duplicate',action:function(){hwDuplicate(id);}},
    {separator:true},
    {icon:'✕',label:'Delete',danger:true,action:function(){hwDelete(id);}}
  ]);
}
function addHwNote(id) {
  var text = document.getElementById('hwNoteText').value.trim();
  if(!text) { toast('Note cannot be empty', 'error'); return; }
  var h = appState.hwItems.find(function(x){ return x.id === id; });
  if(h) {
    h.notesArray = h.notesArray || [];
    h.notesArray.push({ date: todayStr(), text: text });
    logActivity('hwItems', 'Added Note', hwFmtId(id), text.substring(0,50));
    toast('Note added', 'success');
    openHwDetail(id);
  }
}
function hwDuplicate(id){
  var h=appState.hwItems.find(function(x){return x.id===id;});if(!h)return;
  var d=JSON.parse(JSON.stringify(h));d.id=_hwNextId++;d.nodeName=(h.nodeName||'')+' (copy)';d.created=todayStr();d.updated=todayStr();d.history=[{date:todayStr(),text:'Duplicated from '+hwFmtId(id)+'.'}];
  appState.hwItems.push(d);logActivity('hwItems','Created',hwFmtId(d.id),'Duplicated from '+hwFmtId(id));toast(hwFmtId(d.id)+' created (duplicate)','success');buildNav();renderContent();
}
function hwDelete(id){
  showConfirm('Delete Equipment','Delete '+hwFmtId(id)+'? This cannot be undone.','Delete',function(){
    snapshotForUndo('Delete equipment');
    appState.hwItems=appState.hwItems.filter(function(x){return x.id!==id;});
    logActivity('hwItems','Deleted',hwFmtId(id),'Equipment removed');toast(hwFmtId(id)+' deleted','success');closeDetailPanel();buildNav();renderContent();
  });
}
/* ── HW Sidebar Filters ── */
function buildHwSidebarFilters(){
  var el=document.getElementById('hwSidebarFilters');
  if(!el)return;
  if(currentModule!=='hwItems'){el.innerHTML='';return;}
  var items=appState.hwItems;
  var html='<div class="sidebar-section"><div class="sidebar-label">Filter by Status</div>';
  var filters=[
    {key:'all',label:'All Equipment',count:items.length},
    {key:'Pending Review',label:'Pending Review',count:items.filter(function(h){return h.status==='Pending Review';}).length},
    {key:'Approved',label:'Approved',count:items.filter(function(h){return h.status==='Approved';}).length},
    {key:'Needs Update',label:'Needs Update',count:items.filter(function(h){return h.status==='Needs Update';}).length},
    {key:'Flagged',label:'Flagged',count:items.filter(function(h){return h.status==='Flagged';}).length},
    {key:'Decommissioned',label:'Decommissioned',count:items.filter(function(h){return h.status==='Decommissioned';}).length}
  ];
  filters.forEach(function(f){
    var active=hwStatusFilter===f.key;
    html+='<button class="nav-item'+(active?' active':'')+'" onclick="hwSetStatusFilter(\''+f.key+'\')"><span class="nav-icon">'+(f.key==='all'?'○':'●')+'</span> '+esc(f.label)+'<span class="nav-badge">'+f.count+'</span></button>';
  });
  html+='</div>';
  el.innerHTML=html;
}
function hwSetStatusFilter(s){hwStatusFilter=s;buildNav();renderContent();}
/* ═══════════════════════════════════════════════
   SECURITY REPORT GENERATOR
   ═══════════════════════════════════════════════ */
function openHwReportModal(){
  hwReportSelectedIds=[];
  var body=document.getElementById('hwReportBody');
  var html='<p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Select up to 4 equipment items to include in the Security Report (matches template columns A–D).</p>';
  html+='<div class="hw-select-items" id="hwSelectItems">';
  appState.hwItems.forEach(function(h){
    html+='<div class="hw-select-item" data-hw-sel="'+h.id+'" onclick="hwToggleReportItem('+h.id+',this)"><input type="checkbox"><strong>'+hwFmtId(h.id)+'</strong> '+esc(h.nodeName||h.equipType||'—')+'</div>';
  });
  html+='</div>';
  html+='<button class="btn btn-sm btn-primary" onclick="hwGenerateReport()" style="margin-bottom:16px">Generate Preview</button>';
  html+='<div id="hwReportPreview"></div>';
  body.innerHTML=html;
  openModal('hwReportModal');
}
function hwToggleReportItem(id,el){
  var idx=hwReportSelectedIds.indexOf(id);
  if(idx>=0){hwReportSelectedIds.splice(idx,1);el.classList.remove('selected');}
  else{if(hwReportSelectedIds.length>=4){toast('Maximum 4 items per report','warning');return;}hwReportSelectedIds.push(id);el.classList.add('selected');}
}
function hwGenerateReport(){
  if(hwReportSelectedIds.length===0){toast('Select at least one item','error');return;}
  var items=hwReportSelectedIds.map(function(id){return appState.hwItems.find(function(x){return x.id===id;});}).filter(Boolean);
  var cols=['A','B','C','D'];
  // Build report HTML
  var html='<div style="background:#fff;color:#1a1a1a;padding:20px;border-radius:var(--radius);overflow-x:auto" id="hwReportContent">';
  html+='<div class="hw-report-header"><h2>HARDWARE REPORT</h2><p>This form is used to document all moves, upgrades, removals, reconfiguration (connects/disconnects), and maintenance actions to hardware approved to process classified information.</p>';
  html+='<div class="report-meta"><span>Date: '+todayStr()+'</span><span>IS#: '+esc(appState.settings.defaultIS||'—')+'</span><span>Name: '+esc(appState.settings.preparerName||'—')+'</span></div></div>';
  // Main table
  html+='<table class="hw-report-table"><thead><tr><th class="row-label"></th>';
  for(var ci=0;ci<items.length;ci++) html+='<th style="text-align:center">'+cols[ci]+'</th>';
  html+='</tr></thead><tbody>';
  var rows=[
    {label:'Node/System Name',field:'nodeName',hint:'e.g. DAL1M9999, Snowbird'},
    {label:'Hardware Type',field:'equipType',hint:'e.g. CPU, monitor, printer'},
    {label:'Vendor',field:'vendor',hint:'e.g. Dell, Samsung, Agilent'},
    {label:'Model',field:'model'},
    {label:'Serial #',field:'serialNumber'},
    {label:'***Tag #',field:'tagNumber'},
    {label:'Memory Size',field:function(h){return hwMemorySummary(h);},hint:'e.g. GB, TB'},
    {label:'Memory Type',field:function(h){if(!h.memory||h.memory.length===0)return '—';return h.memory.map(function(m){return m.type;}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(', ');},hint:'e.g. EEPROM, RAM'},
    {label:'***Tracking #',field:'accountability',hint:'e.g. VCS/SPAC'},
    {label:'***OS or Data Drive',field:'os',hint:'e.g. Windows XP, SuSe 9.x, Data Drive'}
  ];
  rows.forEach(function(row){
    html+='<tr><td class="row-label">'+row.label+(row.hint?' <span style="font-weight:normal;font-size:10px;color:#777">('+row.hint+')</span>':'')+'</td>';
    items.forEach(function(h){
      var val=typeof row.field==='function'?row.field(h):(h[row.field]||'—');
      html+='<td>'+esc(val)+'</td>';
    });
    html+='</tr>';
  });
  html+='</tbody></table>';
  // Action section
  html+='<div class="hw-report-action"><h4>ACTION</h4><div class="action-grid">';
  var actions=[
    {name:'Addition',desc:'(New equipment) Add to hardware baseline. *CSSA approval required'},
    {name:'Removal',desc:'(Remove equipment from hardware baseline) *Attach sanitization procedure — CSSA approval required'},
    {name:'Downgrade',desc:'(lower level or unclassified) *Attach sanitization procedure'},
    {name:'Maintenance',desc:'(calibration/repairs) *Attach sanitization procedure'},
    {name:'Archive',desc:'(temporary hard drive storage) Reference Archiving Hard Drive Procedure'},
    {name:'Move',desc:''}
  ];
  actions.forEach(function(a){
    html+='<div class="action-item" style="margin-bottom:6px"><span style="font-weight:bold">☐ '+a.name+'</span> <span style="font-size:10px;color:#555">'+a.desc+'</span></div>';
  });
  html+='<div style="margin-top:8px;font-size:11px"><strong>Move From:</strong> _________________________ <strong style="margin-left:20px">Move To:</strong> _________________________</div>';
  html+='</div></div>';
  // Comments
  html+='<div style="margin-top:12px;background:#fff;color:#1a1a1a;border:1px solid #999;padding:8px"><strong style="background:#f5f0d0;padding:2px 6px">Comments:</strong><div style="min-height:50px;border-top:1px solid #ccc;margin-top:6px;padding-top:6px"></div></div>';
  // Signatures
  html+='<div class="hw-report-sigs"><div class="sig-line"><span class="sig-label" style="color:var(--red);font-size:11px">NON ISSO Signature:</span><div class="sig-blank"></div><span class="sig-date">Date:</span><div class="sig-date-blank"></div></div>';
  html+='<div class="sig-line"><span class="sig-label" style="font-size:12px"><strong>ISSO Signature:</strong></span><div class="sig-blank"></div><span class="sig-date">Date:</span><div class="sig-date-blank"></div></div></div>';
  html+='</div>';
  hwReportHtml=html;
  document.getElementById('hwReportPreview').innerHTML=html;
}
function hwReportCopyTSV(){
  var items=hwReportSelectedIds.map(function(id){return appState.hwItems.find(function(x){return x.id===id;});}).filter(Boolean);
  if(items.length===0){toast('Generate report first','error');return;}
  var cols=['A','B','C','D'];
  var header='HARDWARE REPORT\nDate: '+todayStr()+'\tIS#: '+(appState.settings.defaultIS||'')+'\tName: '+(appState.settings.preparerName||'')+'\n\n';
  var tsv=header+'Field';
  for(var i=0;i<items.length;i++) tsv+='\t'+cols[i];
  tsv+='\n';
  var fields=[
    ['Node/System Name','nodeName'],
    ['Hardware Type','equipType'],
    ['Vendor','vendor'],
    ['Model','model'],
    ['Serial #','serialNumber'],
    ['Tag #','tagNumber'],
    ['Memory Size',function(h){return hwMemorySummary(h);}],
    ['Memory Type',function(h){if(!h.memory||h.memory.length===0)return '';return h.memory.map(function(m){return m.type;}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(', ');}],
    ['Tracking #','accountability'],
    ['OS / Data Drive','os']
  ];
  fields.forEach(function(f){
    tsv+=f[0];
    items.forEach(function(h){
      var val=typeof f[1]==='function'?f[1](h):(h[f[1]]||'');
      tsv+='\t'+val;
    });
    tsv+='\n';
  });
  // Action row
  tsv+='\nACTION';
  items.forEach(function(h){tsv+='\t'+(h.hwReportAction||'');});
  tsv+='\n';
  // Copy to clipboard
  var ta=document.createElement('textarea');
  ta.value=tsv;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  document.getElementById('hwCopyStatus').textContent='✓ Copied to clipboard!';
  setTimeout(function(){document.getElementById('hwCopyStatus').textContent='';},3000);
  toast('Tab-separated data copied — paste into Excel','success');
}
function hwReportDownloadCSV(){
  var items=hwReportSelectedIds.map(function(id){return appState.hwItems.find(function(x){return x.id===id;});}).filter(Boolean);
  if(items.length===0){toast('Generate report first','error');return;}
  var cols=['A','B','C','D'];
  var csv='Field';
  for(var i=0;i<items.length;i++) csv+=','+cols[i];
  csv+='\n';
  var fields=[
    ['Node/System Name','nodeName'],['Hardware Type','equipType'],['Vendor','vendor'],['Model','model'],
    ['Serial #','serialNumber'],['Tag #','tagNumber'],
    ['Memory Size',function(h){return hwMemorySummary(h);}],
    ['Memory Type',function(h){if(!h.memory||h.memory.length===0)return '';return h.memory.map(function(m){return m.type;}).filter(function(v,i,a){return a.indexOf(v)===i;}).join('/');}],
    ['Tracking #','accountability'],['OS / Data Drive','os']
  ];
  fields.forEach(function(f){
    csv+='"'+f[0]+'"';
    items.forEach(function(h){
      var val=typeof f[1]==='function'?f[1](h):(h[f[1]]||'');
      csv+=',"'+val.replace(/"/g,'""')+'"';
    });
    csv+='\n';
  });
  var blob=new Blob([csv],{type:'text/csv'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');a.href=url;a.download='hw-report-'+todayStr()+'.csv';
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  toast('CSV downloaded','success');
}
function hwReportOpenTab(){
  if(!hwReportHtml){toast('Generate report first','error');return;}
  var printHtml='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Hardware Report — '+todayStr()+'</title><style>body{font-family:Arial,sans-serif;padding:20px;margin:0;color:#1a1a1a}table{width:100%;border-collapse:collapse}th,td{border:1px solid #999;padding:6px 8px;text-align:left;vertical-align:top;font-size:11px}th{background:#f5f0d0;font-weight:bold}.row-label{background:#f5f0d0;font-weight:bold;width:180px;font-size:11px}h2{text-align:center;margin-bottom:4px;font-size:16px}.report-meta{display:flex;justify-content:space-between;font-size:12px;font-weight:bold;margin-top:8px}.hw-report-header{text-align:center;margin-bottom:16px}.hw-report-header p{font-size:10px;color:#555;margin:4px 0 8px;line-height:1.4}.hw-report-action{margin-top:12px;border:1px solid #999;padding:8px}.hw-report-action h4{text-align:center;font-size:13px;font-weight:bold;margin-bottom:8px;text-decoration:underline}.action-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-size:11px}.action-item{margin-bottom:6px}.sig-line{display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:12px}.sig-label{font-weight:bold;min-width:120px}.sig-blank{flex:1;border-bottom:1px solid #000;min-height:20px}.sig-date{font-weight:bold;margin-left:20px}.sig-date-blank{width:120px;border-bottom:1px solid #000;min-height:20px}.hw-report-sigs{margin-top:16px}@media print{body{padding:10px}}</style></head><body>'+hwReportHtml.replace(/<div style="background:#fff;color:#1a1a1a;padding:20px;border-radius:var\(--radius\);overflow-x:auto" id="hwReportContent">/,'<div>')+'</body></html>';
  var win=window.open('','_blank');
  if(win){win.document.write(pmdSanitizeHTML(printHtml));win.document.close();}
  else{toast('Pop-up blocked — allow pop-ups for this page','error');}
}
/* ═══════════════════════════════════════════════
   SOFTWARE REVIEW MODULE
   ═══════════════════════════════════════════════ */
function openAddSwModal(){
  swEditingId=null;
  document.getElementById('swModalTitle').textContent='New Software';
  document.getElementById('swSaveBtn').textContent='Add Software';
  renderSwModalBody({swName:'',version:'',vendor:'',licenseType:'',licenseKey:'',classification:'',installLocation:'',system:'',assemblyId:null,approvalAuth:'',approvalDate:'',expirationDate:'',stigCompliance:'No',scapScanned:'No',status:'Pending Review',notes:''});
  openModal('swModal');
}
function openEditSwModal(id){
  var s=appState.swItems.find(function(x){return x.id===id;});if(!s)return;
  swEditingId=id;
  document.getElementById('swModalTitle').textContent='Edit '+swFmtId(id);
  document.getElementById('swSaveBtn').textContent='Save Changes';
  renderSwModalBody(s);
  openModal('swModal');
}
function renderSwModalBody(s){
  var classLevels=appState.settings.dropdownLists.classificationLevels||[];
  var swStatuses=appState.settings.dropdownLists.swReviewStatuses||[];
  var racks=appState.racks||[];
  var licenseTypes=pmdList('softwareTypes');
  var html='<div class="form-row"><div class="form-group"><label>Software Name *</label><input type="text" id="swName" value="'+esc(s.swName||'')+'"></div>';
  html+='<div class="form-group"><label>Version</label><input type="text" id="swVersion" value="'+esc(s.version||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Vendor/Publisher</label><input type="text" id="swVendor" value="'+esc(s.vendor||'')+'"></div>';
  html+='<div class="form-group"><label>License Type</label><select id="swLicenseType">'+licenseTypes.map(function(t){return '<option'+(s.licenseType===t?' selected':'')+'>'+esc(t)+'</option>';}).join('')+'</select></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>License Key/ID</label><input type="text" id="swLicenseKey" value="'+esc(s.licenseKey||'')+'"></div>';
  html+='<div class="form-group"><label>Classification *</label><select id="swClassification">'+classLevels.map(function(c){return '<option'+(s.classification===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Install Location</label><input type="text" id="swInstallLoc" value="'+esc(s.installLocation||'')+'"></div>';
  html+='<div class="form-group"><label>System/Node</label><input type="text" id="swSystem" value="'+esc(s.system||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Assigned Assembly</label><select id="swAssemblyId"><option value="">— None —</option>'+racks.map(function(rk){return '<option value="'+rk.id+'"'+((s.assemblyId||'')==rk.id?' selected':'')+'>'+esc(rk.name)+'</option>';}).join('')+'</select></div>';
  html+='<div class="form-group"><label>Approval Authority</label><input type="text" id="swApprovalAuth" value="'+esc(s.approvalAuth||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Approval Date</label><input type="date" id="swApprovalDate" value="'+(s.approvalDate||'')+'"></div>';
  html+='<div class="form-group"><label>Expiration Date</label><input type="date" id="swExpirationDate" value="'+(s.expirationDate||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>STIG Compliance</label><select id="swStigCompliance"><option'+(s.stigCompliance==='Yes'?' selected':'')+'>Yes</option><option'+(s.stigCompliance!=='Yes'?' selected':'')+'>No</option></select></div>';
  html+='<div class="form-group"><label>SCAP Scanned</label><select id="swScapScanned"><option'+(s.scapScanned==='Yes'?' selected':'')+'>Yes</option><option'+(s.scapScanned!=='Yes'?' selected':'')+'>No</option></select></div></div>';
  html+='<div class="form-group"><label>Review Status</label><select id="swStatus">'+swStatuses.map(function(st){return '<option'+(s.status===st?' selected':'')+'>'+esc(st)+'</option>';}).join('')+'</select></div>';
  html+='<div class="form-group"><label>Notes</label><textarea id="swNotes" rows="3">'+esc(s.notes||'')+'</textarea></div>';
  document.getElementById('swModalBody').innerHTML=html;
}
function saveSwItem(){
  var swName=document.getElementById('swName').value.trim();
  if(!swName){toast('Software Name is required','error');return;}
  var newItem={id:swEditingId||appState._swNextId,swName:swName,version:document.getElementById('swVersion').value.trim(),vendor:document.getElementById('swVendor').value.trim(),licenseType:document.getElementById('swLicenseType').value,licenseKey:document.getElementById('swLicenseKey').value.trim(),classification:document.getElementById('swClassification').value,installLocation:document.getElementById('swInstallLoc').value.trim(),system:document.getElementById('swSystem').value.trim(),assemblyId:document.getElementById('swAssemblyId').value||null,approvalAuth:document.getElementById('swApprovalAuth').value.trim(),approvalDate:document.getElementById('swApprovalDate').value,expirationDate:document.getElementById('swExpirationDate').value,stigCompliance:document.getElementById('swStigCompliance').value,scapScanned:document.getElementById('swScapScanned').value,status:document.getElementById('swStatus').value,notes:document.getElementById('swNotes').value.trim()};
  if(swEditingId){
    var idx=appState.swItems.findIndex(function(x){return x.id===swEditingId;});
    if(idx>=0){appState.swItems[idx]=newItem;logActivity('swItems','Updated',swFmtId(newItem.id),newItem.swName);}
  }else{
    appState.swItems.push(newItem);
    appState._swNextId++;
    logActivity('swItems','Created',swFmtId(newItem.id),newItem.swName);
  }
  closeModal('swModal');
  saveAppState();
  renderContent();
}
function v95_openSwDetail(id){
  var s=appState.swItems.find(function(x){return x.id===id;});if(!s)return;
  var html='<div class="detail-section"><h4>Software Information</h4>';
  html+='<div class="detail-field"><span class="field-label">Software Name</span><span class="field-value">'+esc(s.swName||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Version</span><span class="field-value">'+esc(s.version||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Vendor</span><span class="field-value">'+esc(s.vendor||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">License Type</span><span class="field-value">'+esc(s.licenseType||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">License Key</span><span class="field-value">'+esc(s.licenseKey||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Classification</span><span class="badge-pill pill-muted">'+esc(s.classification||'—')+'</span></div>';
  html+='</div>';
  html+='<div class="detail-section"><h4>Deployment</h4>';
  html+='<div class="detail-field"><span class="field-label">Install Location</span><span class="field-value">'+esc(s.installLocation||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">System/Node</span><span class="field-value">'+esc(s.system||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Assigned Assembly</span><span class="field-value">'+(s.assemblyId?esc(getRackLabel(s.assemblyId)):'—')+'</span></div>';
  html+='</div>';
  html+='<div class="detail-section"><h4>Approval & Compliance</h4>';
  html+='<div class="detail-field"><span class="field-label">Approval Authority</span><span class="field-value">'+esc(s.approvalAuth||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Approval Date</span><span class="field-value">'+fmtDate(s.approvalDate)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Expiration Date</span><span class="field-value">'+fmtDate(s.expirationDate)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">STIG Compliance</span><span class="field-value">'+esc(s.stigCompliance||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">SCAP Scanned</span><span class="field-value">'+esc(s.scapScanned||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Review Status</span><span class="badge-pill '+swGetStatusClass(s.status)+'">'+esc(s.status||'—')+'</span></div>';
  html+='</div>';
  if(s.notes){html+='<div class="detail-section"><h4>Notes</h4><p style="white-space:pre-wrap;word-wrap:break-word">'+esc(s.notes)+'</p></div>';}
  document.getElementById('detailPanelTitle').textContent=swFmtId(id)+' — '+esc(s.swName);
  document.getElementById('detailPanelBody').innerHTML=html;
  document.getElementById('detailEditBtn').onclick=function(){openEditSwModal(id);};
  document.getElementById('detailPanel').style.display='flex';
}
function swShowCtx(e,id){
  e.stopPropagation();
  var menu='<button class="ctx-item" onclick="openEditSwModal('+id+');closeContextMenu()">Edit</button>';
  menu+='<button class="ctx-item" onclick="swDuplicate('+id+');closeContextMenu()">Duplicate</button>';
  menu+='<button class="ctx-item ctx-danger" onclick="swDelete('+id+');closeContextMenu()">Delete</button>';
  showContextMenu(e,menu);
}
function swDuplicate(id){
  var s=appState.swItems.find(function(x){return x.id===id;});if(!s)return;
  var newItem=JSON.parse(JSON.stringify(s));
  newItem.id=appState._swNextId++;
  appState.swItems.push(newItem);
  logActivity('swItems','Created',swFmtId(newItem.id),newItem.swName);
  saveAppState();
  renderContent();
  toast('Software item duplicated','success');
}
function swDelete(id){
  if(!confirm('Delete this software item?'))return;
  var idx=appState.swItems.findIndex(function(x){return x.id===id;});
  if(idx>=0){
    var item=appState.swItems[idx];
    appState.swItems.splice(idx,1);
    logActivity('swItems','Deleted',swFmtId(id),item.swName);
    saveAppState();
    renderContent();
    toast('Software item deleted','success');
  }
}
function swSortBy(f){if(swSortField===f)swSortDir*=-1;else{swSortField=f;swSortDir=1;}renderContent();}
function swClearSearch(){swSearchQuery='';renderContent();}
function swSetStatusFilter(s){swStatusFilter=s;buildNav();renderContent();}
/* ═══════════════════════════════════════════════
   SEED SAMPLE DATA
   ═══════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════
   ACTION TRACKER FUNCTIONS
   ═══════════════════════════════════════════════ */
function actionFmtId(id) { return 'AI-'+String(id).padStart(3,'0'); }

function isActionDueSoon(a) {
  if(!a.due) return false;
  if(a.status==='Complete'||a.status==='Deferred') return false;
  var today = todayStr();
  if(a.due < today) return false;
  var dueDate = new Date(a.due+'T12:00:00');
  var now = new Date(today+'T12:00:00');
  var diff = (dueDate - now) / 86400000;
  return diff <= 7;
}
function actionOverdueDays(a) {
  if(!a.due) return 0;
  var due = new Date(a.due+'T12:00:00');
  var today = new Date(todayStr()+'T12:00:00');
  var diff = today - due;
  return Math.ceil(diff / (1000*60*60*24));
}
function getFilteredActions() {
  var filtered = appState.actions.slice();

  if(actionStatusFilter!=='all') {
    if(actionStatusFilter==='Overdue') {
      filtered = filtered.filter(function(a){ return isActionOverdue(a); });
    } else {
      filtered = filtered.filter(function(a){ return a.status === actionStatusFilter; });
    }
  }

  if(actionPriorityFilter!=='all') {
    filtered = filtered.filter(function(a){ return a.priority === actionPriorityFilter; });
  }

  if(actionTaskTypeFilter!=='all') {
    filtered = filtered.filter(function(a){ return (a.taskType||'Internal Action') === actionTaskTypeFilter; });
  }

  if(actionSearchQuery) {
    var q = actionSearchQuery.toLowerCase();
    filtered = filtered.filter(function(a){
      return (a.title||'').toLowerCase().indexOf(q)>=0 || (a.description||'').toLowerCase().indexOf(q)>=0 || (a.assignee||'').toLowerCase().indexOf(q)>=0;
    });
  }

  // Sort
  filtered.sort(function(a,b){
    var aVal = a[actionSortField];
    var bVal = b[actionSortField];
    if(actionSortField==='due') {
      aVal = aVal || '9999-12-31';
      bVal = bVal || '9999-12-31';
    }
    if(aVal < bVal) return -actionSortDir;
    if(aVal > bVal) return actionSortDir;
    return 0;
  });

  return filtered;
}
function v95_renderActionModule(area) {
  buildActionSidebarFilters();
  if(actionSubView==='kanban') {
    renderActionKanban(area);
  } else if(actionSubView==='timeline') {
    renderActionTimeline(area);
  } else {
    renderActionTable(area);
  }
}
function renderActionTable(area) {
  var filtered = getFilteredActions();
  var arrow = function(f){ return actionSortField===f ? (actionSortDir===1 ? ' ▲' : ' ▼') : ''; };

  var title = actionStatusFilter==='all' ? 'All Actions' : (actionStatusFilter==='Overdue' ? 'Overdue Actions' : actionStatusFilter+' Actions');
  var filterPresets = renderFilterPresetsBar('actions');
  var viewBtns = '<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap"><button class="btn btn-sm '+(actionSubView==='table'?' btn-primary':'')+'" onclick="actionSwitchSubView(\'table\')">Table</button><button class="btn btn-sm'+(actionSubView==='kanban'?' btn-primary':'')+'" onclick="actionSwitchSubView(\'kanban\')">Kanban</button><button class="btn btn-sm'+(actionSubView==='timeline'?' btn-primary':'')+'" onclick="actionSwitchSubView(\'timeline\')">Timeline</button>'+filterPresets+'<button class="btn btn-sm" style="margin-left:auto" onclick="openQuickEntry(\'actions\')">⚡ Quick Entry</button><button class="btn btn-sm" onclick="openPasteImport(\'actions\')">⎗ Paste Import</button><button class="btn btn-sm" onclick="exportModuleCsv(\'actions\')">⬇ CSV</button></div>';
  
  var quickAddHTML = '<div class="quick-add"><div class="qa-title"><input type="text" id="qaTitle" placeholder="Quick add action..." maxlength="100"></div><div class="qa-source"><input type="text" id="qaSource" placeholder="Source" value="'+esc(lastQuickSource)+'" style="width:100px"></div><div class="qa-assignee"><input type="text" id="qaAssignee" placeholder="Assignee" value="'+esc(lastQuickAssignee)+'" style="width:100px"></div><div class="qa-priority"><select id="qaPriority" style="width:100px"><option value="P4 — Low">P4 — Low</option><option value="P3 — Medium">P3 — Medium</option><option value="P2 — High" selected>P2 — High</option><option value="P1 — Critical">P1 — Critical</option></select></div><div class="qa-due"><input type="date" id="qaDue" style="width:120px"></div><button class="qa-btn" onclick="actionQuickAdd()">+ Add</button></div>';
  
  var tableHTML = '<div class="table-container"><div class="table-header"><h3>'+esc(title)+' ('+filtered.length+')</h3><div class="table-filters"><input class="filter-input" type="text" id="actionSearchInput" placeholder="Search actions..." value="'+esc(actionSearchQuery)+'" aria-label="Search actions">'+(actionSearchQuery?'<button class="btn btn-sm" onclick="actionClearSearch()">✕</button>':'')+'</div></div>';
  
  if(filtered.length > 0) {
    tableHTML += '<div class="table-scroll"><table class="rtable"><thead><tr><th scope="col" onclick="actionSortBy(\'id\')">ID'+arrow('id')+'</th><th scope="col" onclick="actionSortBy(\'title\')">Title'+arrow('title')+'</th><th scope="col">Type</th><th scope="col" onclick="actionSortBy(\'priority\')">Priority'+arrow('priority')+'</th><th scope="col" onclick="actionSortBy(\'assignee\')">Assignee'+arrow('assignee')+'</th><th scope="col" onclick="actionSortBy(\'category\')">Category'+arrow('category')+'</th><th scope="col" onclick="actionSortBy(\'status\')">Status'+arrow('status')+'</th><th scope="col" onclick="actionSortBy(\'due\')">Due'+arrow('due')+'</th><th scope="col" class="no-sort"></th></tr></thead><tbody>';
    var pageItems = paginateItems(filtered, 'actions');
    pageItems.forEach(function(a){
      var overdue = isActionOverdue(a);
      var dueSoon = !overdue && isActionDueSoon(a);
      var dateStyle = overdue ? ' style="color:var(--red);font-weight:600"' : (dueSoon ? ' style="color:var(--yellow);font-weight:600"' : '');
      var dateIcon = overdue ? ' ⚠' : (dueSoon ? ' △' : '');
      var rowBg = overdue ? 'background:rgba(248,81,73,.08);' : (dueSoon ? 'background:rgba(227,179,65,.06);' : '');
      var ttClass = 'tt-'+(a.taskType||'Internal Action').toLowerCase().replace(/[^a-z]/g,'');
      var blockedInd = (a.blockedBy&&a.blockedBy.trim())?'<span class="blocked-indicator">⊕</span>':'';
      tableHTML += '<tr data-action-id="'+a.id+'" style="'+rowBg+'"><td class="action-id">'+actionFmtId(a.id)+'</td><td class="action-title-cell"><span title="'+esc(a.title)+'">'+esc(a.title)+'</span></td><td><span class="'+ttClass+'">'+esc((a.taskType||'Internal Action').substring(0,8))+'</span>'+blockedInd+'</td><td><span class="badge-pill priority-'+(a.priority||'').substring(0,2).toLowerCase()+'">'+esc((a.priority||'').substring(0,2))+'</span></td><td style="font-size:12px">'+esc(a.assignee||'—')+'</td><td><span class="badge-pill acat-'+(a.category||'').toLowerCase()+'">'+esc(a.category)+'</span></td><td><span class="status-badge status-'+(a.status||'').toLowerCase().replace(/\s/g,'')+'">'+esc(a.status)+'</span></td><td'+dateStyle+'>'+fmtDateShort(a.due)+dateIcon+'</td><td><button class="action-dots" onclick="event.stopPropagation();actionShowCtx(event,'+a.id+')">⋮</button></td></tr>';
    });
    tableHTML += '</tbody></table></div>';
    tableHTML += renderPagination('actions', filtered.length);
  } else {
    tableHTML += '<div class="empty-state"><div class="es-icon">☐</div><h3>No actions found</h3><p>'+(actionSearchQuery?'No results for "'+esc(actionSearchQuery)+'"':'Get started by adding an action using the quick-add bar above, or use <strong>Paste Import</strong> to bulk import from a spreadsheet.')+'</p>'+(actionSearchQuery?'':'<button class="btn btn-sm btn-primary" style="margin-top:8px" onclick="openPasteImport(\'actions\')">⎗ Paste Import</button>')+'</div>';
  }
  tableHTML += '</div>';
  
  area.innerHTML = viewBtns + quickAddHTML + tableHTML;
  
  // Wire search input
  var si = document.getElementById('actionSearchInput');
  if(si) si.addEventListener('input', function(){
    var self = this;
    debounce('actionSearch', function(){
      actionSearchQuery = self.value;
      renderContent();
      var inp = document.getElementById('actionSearchInput');
      if(inp) inp.focus();
    }, 150);
  });
  
  // Replace the root handler on render so a row opens exactly once.
  area.onclick = function(e){
    if(e.target.closest('.action-dots')) return;
    var tr = e.target.closest('.rtable tbody tr');
    if(tr && tr.dataset.actionId) openActionDetail(parseInt(tr.dataset.actionId));
  };
}
function actionQuickAdd() {
  var title = document.getElementById('qaTitle').value.trim();
  if(!title) { toast('Title is required', 'error'); return; }
  var source = document.getElementById('qaSource').value.trim();
  var assignee = document.getElementById('qaAssignee').value.trim();
  var priority = document.getElementById('qaPriority').value;
  var due = document.getElementById('qaDue').value;

  lastQuickSource = source;
  lastQuickAssignee = assignee;

  var action = {
    id: _actionNextId++,
    title: title,
    description: '',
    source: source,
    assignee: assignee,
    priority: priority,
    status: 'Open',
    category: 'Engineering',
    taskType: 'Internal Action',
    blockedBy: '',
    startDate: '',
    due: due,
    linkedRiskId: null,
    notes: [],
    created: nowISO(),
    updated: todayStr(),
    completed: null
  };

  appState.actions.push(action);
  logActivity('actions', 'Created', actionFmtId(action.id), title);
  toast('Action added', 'success');
  document.getElementById('qaTitle').value = '';
  document.getElementById('qaDue').value = '';
  renderContent();
}
function actionSortBy(f) {
  if(actionSortField === f) actionSortDir *= -1;
  else { actionSortField = f; actionSortDir = 1; }
  announce('Sorted by '+f+', '+(actionSortDir===1?'ascending':'descending'));
  renderContent();
}
function actionClearSearch() {
  actionSearchQuery = '';
  renderContent();
}
function actionSwitchSubView(v) {
  actionSubView = v;
  saveSubView('actions', v);
  renderContent();
}
function renderActionKanban(area) {
  var statuses=Array.from(new Set(pmdList('actionStatuses').concat(appState.actions.map(function(a){return a.status||'';}))));
  var cards = {};
  statuses.forEach(function(s){ cards[s] = []; });

  getFilteredActions().forEach(function(a){
    if(actionStatusFilter==='Overdue' && !isActionOverdue(a)) return;
    cards[a.status] = cards[a.status] || [];
    cards[a.status].push(a);
  });

  var kanbanHTML = '<div style="display:flex;gap:6px;margin-bottom:16px"><button class="btn btn-sm" onclick="actionSwitchSubView(\'table\')">Table</button><button class="btn btn-sm btn-primary" onclick="actionSwitchSubView(\'kanban\')">Kanban</button><button class="btn btn-sm" onclick="actionSwitchSubView(\'timeline\')">Timeline</button><span style="font-size:11px;color:var(--text-muted);align-self:center;margin-left:8px">Drag cards between columns to change status</span></div>';
  kanbanHTML += '<div class="kanban-board">';

  statuses.forEach(function(s){
    var count = cards[s].length;
    kanbanHTML += '<div class="kanban-column" data-kanban-status="'+esc(s)+'" ondragover="kanbanDragOver(event)" ondrop="kanbanDrop(event,\''+esc(s)+'\')" ondragenter="kanbanDragEnter(event)" ondragleave="kanbanDragLeave(event)"><div class="kanban-col-header">'+s+' ('+count+')</div>';
    cards[s].forEach(function(a){
      var overdue = isActionOverdue(a);
      kanbanHTML += '<div class="kanban-card" draggable="true" data-action-id="'+a.id+'" ondragstart="kanbanDragStart(event,'+a.id+')" onclick="openActionDetail('+a.id+')" style="'+(overdue?'border-left:3px solid var(--red);':'')+'"><div style="font-weight:600;margin-bottom:4px">'+esc(a.title.substring(0,30))+'</div><div style="display:flex;gap:4px;margin-bottom:4px;flex-wrap:wrap"><span class="badge-pill priority-'+(a.priority||'').substring(0,2).toLowerCase()+'">'+esc((a.priority||'').substring(0,2))+'</span><span class="badge-pill acat-'+(a.category||'').toLowerCase()+'">'+esc(a.category.substring(0,3))+'</span></div><div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">'+esc(a.assignee||'—')+'</div><div style="font-size:11px;font-family:var(--font-mono);'+(overdue?'color:var(--red);font-weight:600;':'color:var(--text-muted);')+'">'+fmtDateShort(a.due)+(overdue?' ⚠':'')+'</div></div>';
    });
    kanbanHTML += '</div>';
  });

  kanbanHTML += '</div>';
  area.innerHTML = kanbanHTML;
}
/* Kanban drag-and-drop handlers */
var _kanbanDragId = null;
function kanbanDragStart(e, actionId) {
  _kanbanDragId = actionId;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(actionId));
  var card = e.target.closest('.kanban-card');
  if (card) setTimeout(function(){ card.style.opacity = '0.4'; }, 0);
}
function kanbanDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
function kanbanDragEnter(e) {
  e.preventDefault();
  var col = e.target.closest('.kanban-column');
  if (col) col.classList.add('kanban-drop-target');
}
function kanbanDragLeave(e) {
  var col = e.target.closest('.kanban-column');
  if (col && !col.contains(e.relatedTarget)) col.classList.remove('kanban-drop-target');
}
function kanbanDrop(e, newStatus) {
  e.preventDefault();
  var col = e.target.closest('.kanban-column');
  if (col) col.classList.remove('kanban-drop-target');
  if (_kanbanDragId === null) return;
  var action = appState.actions.find(function(a){ return a.id === _kanbanDragId; });
  if (!action) return;
  if (action.status === newStatus) { _kanbanDragId = null; renderContent(); return; }
  var oldStatus = action.status;
  snapshotForUndo('Move action to ' + newStatus);
  action.status = newStatus;
  action.updated = todayStr();
  if (newStatus === 'Complete' && oldStatus !== 'Complete') {
    action.completed = todayStr();
    action.notes = action.notes || [];
    action.notes.push({ date: todayStr(), text: 'Moved to Complete via Kanban.' });
  }
  logActivity('actions', 'Status Changed', actionFmtId(action.id), oldStatus + ' → ' + newStatus);
  toast(actionFmtId(action.id) + ' moved to ' + newStatus, 'success');
  _kanbanDragId = null;
  renderContent();
}
function renderActionTimeline(area) {
  var filtered = getFilteredActions();
  var viewBtns = '<div style="display:flex;gap:6px;margin-bottom:16px"><button class="btn btn-sm" onclick="actionSwitchSubView(\'table\')">Table</button><button class="btn btn-sm" onclick="actionSwitchSubView(\'kanban\')">Kanban</button><button class="btn btn-sm btn-primary" onclick="actionSwitchSubView(\'timeline\')">Timeline</button><button class="btn btn-sm" style="margin-left:auto" onclick="exportModuleCsv(\'actions\')">⬇ CSV</button></div>';

  if(filtered.length === 0) {
    area.innerHTML = viewBtns + '<div class="empty-state"><div class="es-icon">☐</div><h3>No actions to display</h3><p>Add actions or adjust filters to see timeline.</p></div>';
    return;
  }

  var today = todayStr();
  var todayDate = new Date(today + 'T12:00:00');
  var minDate = today;
  var maxDate = today;

  filtered.forEach(function(a){
    var d1 = a.startDate || a.created.split('T')[0];
    var d2 = a.due || '9999-12-31';
    if(d1 < minDate) minDate = d1;
    if(d2 > maxDate) maxDate = d2;
  });

  var monthsArr = [];
  var currentMonth = new Date(minDate + 'T12:00:00');
  var endMonth = new Date(maxDate + 'T12:00:00');
  endMonth.setMonth(endMonth.getMonth() + 1);

  while(currentMonth < endMonth) {
    var yr = currentMonth.getFullYear();
    var mo = String(currentMonth.getMonth() + 1).padStart(2, '0');
    monthsArr.push(yr + '-' + mo);
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  var html = viewBtns;
  html += '<div class="gantt-container"><div class="gantt-timeline"><div class="gantt-sidebar"></div><div class="gantt-chart">';
  html += '<div class="gantt-header"><div class="gantt-header-sidebar">Action</div><div class="gantt-months">';

  monthsArr.forEach(function(m){
    var p = m.split('-');
    var d = new Date(parseInt(p[0]), parseInt(p[1]) - 1, 1);
    html += '<div class="gantt-month">' + d.toLocaleDateString('en-US', {month:'short',year:'2-digit'}) + '</div>';
  });

  html += '</div></div><div class="gantt-rows">';

  filtered.forEach(function(a){
    var taskStart = a.startDate || a.created.split('T')[0];
    var taskEnd = a.due || maxDate;
    var minDateObj = new Date(minDate + 'T12:00:00');
    var maxDateObj = new Date(maxDate + 'T12:00:00');
    var startDateObj = new Date(taskStart + 'T12:00:00');
    var endDateObj = new Date(taskEnd + 'T12:00:00');

    var totalDays = (maxDateObj - minDateObj) / (1000 * 60 * 60 * 24);
    var startOffset = (startDateObj - minDateObj) / (1000 * 60 * 60 * 24);
    var duration = Math.max(1, (endDateObj - startDateObj) / (1000 * 60 * 60 * 24));

    var startPct = (startOffset / totalDays) * 100;
    var widthPct = (duration / totalDays) * 100;

    var prioClass = 'gantt-bar-' + (a.priority||'P4').substring(0,2).toLowerCase();
    var extClass = (a.taskType === 'External Dependency') ? ' gantt-bar-external' : '';
    var milestoneMark = (a.taskType === 'Milestone') ? '◆' : '';
    var barContent = milestoneMark || esc(a.title.substring(0,20));

    html += '<div class="gantt-row" onclick="openActionDetail(' + a.id + ')"><div class="gantt-row-label" title="' + esc(a.title) + '">' + esc(a.title.substring(0,20)) + '</div><div class="gantt-row-bars">';
    html += '<div class="gantt-bar ' + prioClass + extClass + '" style="left:' + startPct + '%;width:' + widthPct + '%">' + barContent + '</div>';

    if(todayDate >= startDateObj && todayDate <= endDateObj) {
      var todayOffset = (todayDate - minDateObj) / (1000 * 60 * 60 * 24);
      var todayPct = (todayOffset / totalDays) * 100;
      html += '<div class="gantt-today" style="left:' + todayPct + '%"></div>';
    }

    html += '</div></div>';
  });

  html += '</div></div></div></div>';
  area.innerHTML = html;
}
function openAddActionModal() {
  actionEditingId = null;
  document.getElementById('actionModalTitle').textContent = 'New Action';
  document.getElementById('actionSaveBtn').textContent = 'Add Action';
  renderActionModalBody({
    title: '',
    description: '',
    source: lastQuickSource,
    assignee: lastQuickAssignee,
    priority: 'P2 — High',
    status: 'Open',
    category: 'Engineering',
    taskType: 'Internal Action',
    blockedBy: '',
    startDate: '',
    due: '',
    linkedRiskId: null,
    notes: []
  });
  openModal('actionModal');
}
function openEditActionModal(id) {
  var a = appState.actions.find(function(x){ return x.id === id; });
  if(!a) return;
  actionEditingId = id;
  document.getElementById('actionModalTitle').textContent = 'Edit '+actionFmtId(id);
  document.getElementById('actionSaveBtn').textContent = 'Save Changes';
  renderActionModalBody(a);
  openModal('actionModal');
}
function renderActionModalBody(a) {
  var statuses = appState.settings.dropdownLists.actionStatuses;
  var priorities = appState.settings.dropdownLists.actionPriorities;
  var categories = appState.settings.dropdownLists.actionCategories;
  var taskTypes = appState.settings.dropdownLists.actionTaskTypes;

  var html = '<div class="form-group"><label for="aTitle">Title *</label><input type="text" id="aTitle" value="'+esc(a.title)+'"></div>';
  html += '<div class="form-group"><label for="aDesc">Description</label><textarea id="aDesc">'+esc(a.description||'')+'</textarea></div>';
  html += '<div class="form-row"><div class="form-group"><label for="aSource">Source</label><input type="text" id="aSource" value="'+esc(a.source||'')+'"></div><div class="form-group"><label for="aAssignee">Assignee</label><input type="text" id="aAssignee" value="'+esc(a.assignee||'')+'"></div></div>';
  html += '<div class="form-row"><div class="form-group"><label for="aPriority">Priority</label><select id="aPriority">'+priorities.map(function(p){ return '<option'+(a.priority===p?' selected':'')+'>'+esc(p)+'</option>'; }).join('')+'</select></div><div class="form-group"><label for="aStatus">Status</label><select id="aStatus">'+statuses.map(function(s){ return '<option'+(a.status===s?' selected':'')+'>'+esc(s)+'</option>'; }).join('')+'</select></div></div>';
  html += '<div class="form-row"><div class="form-group"><label for="aCategory">Category</label><select id="aCategory">'+categories.map(function(c){ return '<option'+(a.category===c?' selected':'')+'>'+esc(c)+'</option>'; }).join('')+'</select></div><div class="form-group"><label for="aTaskType">Task Type</label><select id="aTaskType">'+taskTypes.map(function(t){ return '<option'+(a.taskType===t?' selected':'')+'>'+esc(t)+'</option>'; }).join('')+'</select></div></div>';
  html += '<div class="form-row"><div class="form-group"><label for="aStartDate">Start Date</label><input type="date" id="aStartDate" value="'+(a.startDate||'')+'"></div><div class="form-group"><label for="aDue">Due Date</label><input type="date" id="aDue" value="'+(a.due||'')+'"></div></div>';
  html += '<div class="form-group"><label for="aBlockedBy">Blocked By (comma-separated action IDs, e.g., AI-001, AI-003)</label><input type="text" id="aBlockedBy" value="'+esc(a.blockedBy||'')+'"></div>';
  html += '<div class="form-group"><label for="aLinkedRisk">Linked Risk ID (e.g., R-001)</label><input type="text" id="aLinkedRisk" value="'+esc(a.linkedRiskId||'')+'"></div>';

  document.getElementById('actionModalBody').innerHTML = html;
}
function saveAction() {
  var title = document.getElementById('aTitle').value.trim();
  if(!title) { toast('Title is required', 'error'); return; }

  var data = {
    title: title,
    description: document.getElementById('aDesc').value.trim(),
    source: document.getElementById('aSource').value.trim(),
    assignee: document.getElementById('aAssignee').value.trim(),
    priority: document.getElementById('aPriority').value,
    status: document.getElementById('aStatus').value,
    category: document.getElementById('aCategory').value,
    taskType: document.getElementById('aTaskType').value,
    blockedBy: document.getElementById('aBlockedBy').value.trim(),
    startDate: document.getElementById('aStartDate').value,
    due: document.getElementById('aDue').value,
    linkedRiskId: document.getElementById('aLinkedRisk').value.trim() || null,
    updated: todayStr()
  };

  snapshotForUndo(actionEditingId ? 'Edit action' : 'Add action');
  if(actionEditingId) {
    var a = appState.actions.find(function(x){ return x.id === actionEditingId; });
    if(a) {
      var wasComplete = a.status === 'Complete';
      var actAudit=auditDiff(a,data,[{key:'title',label:'Title'},{key:'status',label:'Status'},{key:'priority',label:'Priority'},{key:'assignee',label:'Assignee'},{key:'due',label:'Due Date'},{key:'taskType',label:'Type'},{key:'category',label:'Category'}]);
      Object.assign(a, data);
      if(data.status === 'Complete' && !wasComplete) {
        a.completed = todayStr();
        a.notes = a.notes || [];
        a.notes.push({ date: todayStr(), text: 'Action marked complete.' });
      }
      if(actAudit.length>0)auditRecord('actions',a.id,a.status!==data.status?'status_change':'updated',actAudit,a.title);
      logActivity('actions', 'Updated', actionFmtId(actionEditingId), a.title);
      toast(actionFmtId(actionEditingId)+' updated', 'success');
    }
  } else {
    data.id = _actionNextId++;
    data.notes = [];
    data.created = nowISO();
    data.completed = null;
    appState.actions.push(data);
    auditRecord('actions',data.id,'created',[{field:'Title',oldVal:'',newVal:data.title}],data.title);
    logActivity('actions', 'Created', actionFmtId(data.id), data.title);
    toast('Action added', 'success');
  }
  
  closeModal('actionModal');
  renderContent();
}
function v95_openActionDetail(id) {
  var a = appState.actions.find(function(x){ return x.id === id; });
  if(!a) return;

  var html = '<div style="margin-bottom:16px"><div class="detail-field"><div class="detail-label">ID</div><div>'+actionFmtId(id)+'</div></div>';
  html += '<div class="detail-field"><div class="detail-label">Title</div><div style="font-weight:600">'+esc(a.title)+'</div></div>';
  html += '<div class="detail-field"><div class="detail-label">Status</div><div><span class="status-badge status-'+(a.status||'').toLowerCase().replace(/\s/g,'')+'">'+esc(a.status)+'</span></div></div>';
  html += '<div class="detail-field"><div class="detail-label">Priority</div><div><span class="badge-pill priority-'+(a.priority||'').substring(0,2).toLowerCase()+'">'+esc(a.priority)+'</span></div></div>';
  html += '<div class="detail-field"><div class="detail-label">Type</div><div><span class="tt-'+(a.taskType||'Internal Action').toLowerCase().replace(/[^a-z]/g,'')+'">'+esc(a.taskType||'Internal Action')+'</span></div></div>';
  html += '<div class="detail-field"><div class="detail-label">Category</div><div><span class="badge-pill acat-'+(a.category||'').toLowerCase()+'">'+esc(a.category)+'</span></div></div>';
  html += '<div class="detail-field"><div class="detail-label">Assignee</div><div>'+esc(a.assignee||'—')+'</div></div>';
  html += '<div class="detail-field"><div class="detail-label">Source</div><div>'+esc(a.source||'—')+'</div></div>';
  html += '<div class="detail-field"><div class="detail-label">Start Date</div><div>'+(a.startDate?fmtDateShort(a.startDate):'—')+'</div></div>';
  html += '<div class="detail-field"><div class="detail-label">Due Date</div><div'+(isActionOverdue(a)?'style="color:var(--red);font-weight:600"':'')+'>'+(a.due?fmtDateShort(a.due)+(isActionOverdue(a)?' ⚠':''):'—')+'</div></div>';

  if(a.blockedBy && a.blockedBy.trim()) {
    html += '<div class="detail-field"><div class="detail-label">Blocked By</div><div style="font-size:12px;color:var(--orange);font-weight:600">'+esc(a.blockedBy)+'</div></div>';
  }

  if(a.linkedRiskId) {
    var riskId = a.linkedRiskId.replace('R-','').replace('r-','');
    if(!isNaN(riskId)) riskId = parseInt(riskId);
    html += '<div class="detail-field"><div class="detail-label">Linked Risk</div><div><a href="#" onclick="event.preventDefault();switchModule(\'risks\');openRiskDetail('+riskId+');closeDetailPanel();" style="color:var(--accent);text-decoration:underline">'+esc(a.linkedRiskId)+'</a></div></div>';
  }

  html += '<div class="detail-field"><div class="detail-label">Description</div><div>'+esc(a.description||'—')+'</div></div>';
  html += '<div class="detail-field"><div class="detail-label">Created</div><div style="font-size:12px;color:var(--text-secondary)">'+fmtDate(a.created)+'</div></div>';
  if(a.completed) html += '<div class="detail-field"><div class="detail-label">Completed</div><div style="font-size:12px;color:var(--green)">'+fmtDate(a.completed)+'</div></div>';

  if(a.notes && a.notes.length > 0) {
    html += '<div class="detail-field"><div class="detail-label">Notes ('+ a.notes.length+')</div>';
    a.notes.forEach(function(n){
      html += '<div style="padding:8px;background:var(--bg-tertiary);border-radius:var(--radius);margin-top:4px;font-size:12px"><div style="color:var(--text-secondary);font-size:11px">'+fmtDate(n.date)+'</div><div style="margin-top:2px">'+esc(n.text)+'</div></div>';
    });
    html += '</div>';
  }

  // Cross-module links
  var actionGraph = buildLinkGraph('action', id);
  var actionLinkCount = countGraphLinks(actionGraph);
  if (actionLinkCount > 0) {
    html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)"><div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px">Cross-Module Links ('+actionLinkCount+')</div>'+renderLinkGraphHTML(actionGraph,'action')+'</div>';
  }
  html += '</div><div class="detail-section"><h4>Audit History</h4>'+renderAuditHistoryHTML('actions',id)+'</div>';
  html += '<div style="display:flex;gap:6px;margin-top:16px"><button class="btn btn-sm" onclick="actionShowCtx(null,'+id+')">⋮ More</button><button class="btn btn-sm" onclick="openImpactAnalysis(\'action\','+id+')">◆ Impact Analysis</button></div>';

  document.getElementById('detailPanelTitle').textContent = actionFmtId(id)+' — '+a.title;
  document.getElementById('detailPanelBody').innerHTML = html;
  document.getElementById('detailEditBtn').onclick = function(){ openEditActionModal(id); };
  document.getElementById('detailPanel').classList.add('open');
}
function addActionNote(id) {
  var text = prompt('Add a note:');
  if(!text) return;
  var a = appState.actions.find(function(x){ return x.id === id; });
  if(a) {
    a.notes = a.notes || [];
    a.notes.push({ date: todayStr(), text: text });
    logActivity('actions', 'Added Note', actionFmtId(id), text.substring(0,50));
    toast('Note added', 'success');
    openActionDetail(id);
  }
}
function actionShowCtx(e, id) {
  if(e) e.stopPropagation();
  var a = appState.actions.find(function(x){ return x.id === id; });
  if(!a) return;
  
  var items = [
    {label:'Edit',icon:'✎',action:function(){ openEditActionModal(id); }},
    {label:'Duplicate',icon:'⎘',action:function(){ duplicateAction(id); }},
    {label:'Add Note',icon:'●',action:function(){ addActionNote(id); }},
    {label:'Mark Complete',icon:'✓',action:function(){ markActionComplete(id); }},
    {label:'Delete',icon:'✕',action:function(){ deleteAction(id); }}
  ];
  
  if(e){showContextMenu(e.clientX,e.clientY,items);}else{var btn=document.querySelector('[onclick*="actionShowCtx(null,'+id+')"]');if(btn){var rect=btn.getBoundingClientRect();showContextMenu(rect.left,rect.bottom,items);}else{showContextMenu(200,200,items);}}
}
function markActionComplete(id) {
  var a = appState.actions.find(function(x){ return x.id === id; });
  if(a) {
    a.status = 'Complete';
    a.completed = todayStr();
    a.notes = a.notes || [];
    a.notes.push({ date: todayStr(), text: 'Action completed.' });
    logActivity('actions', 'Completed', actionFmtId(id), a.title);
    toast(actionFmtId(id)+' completed', 'success');
    renderContent();
  }
}
function duplicateAction(id) {
  var a = appState.actions.find(function(x){ return x.id === id; });
  if(!a) return;
  
  var dup = {
    id: _actionNextId++,
    title: a.title + ' [copy]',
    description: a.description,
    source: a.source,
    assignee: a.assignee,
    priority: a.priority,
    status: 'Open',
    category: a.category,
    due: '',
    linkedRiskId: a.linkedRiskId,
    notes: [],
    created: nowISO(),
    updated: todayStr(),
    completed: null
  };
  
  appState.actions.push(dup);
  logActivity('actions', 'Duplicated', actionFmtId(dup.id), dup.title);
  toast(actionFmtId(dup.id)+' created', 'success');
  renderContent();
}
function deleteAction(id) {
  var a = appState.actions.find(function(x){ return x.id === id; });
  if(!a) return;
  
  showConfirm('Delete Action', 'Delete "'+a.title+'"? This cannot be undone.', 'Delete', function(){
    snapshotForUndo('Delete action');
    appState.actions = appState.actions.filter(function(x){ return x.id !== id; });
    logActivity('actions', 'Deleted', actionFmtId(id), a.title);
    toast(actionFmtId(id)+' deleted', 'success');
    closeDetailPanel();
    renderContent();
  });
}
function buildActionSidebarFilters() {
  if(currentModule !== 'actions') return;

  var sidebar = document.getElementById('actionSidebarFilters');
  if(!sidebar) return;

  var statusGroups = [
    { label: 'All', value: 'all', count: appState.actions.length },
    { label: 'Open', value: 'Open', count: appState.actions.filter(function(a){ return a.status==='Open'; }).length },
    { label: 'In Progress', value: 'In Progress', count: appState.actions.filter(function(a){ return a.status==='In Progress'; }).length },
    { label: 'Complete', value: 'Complete', count: appState.actions.filter(function(a){ return a.status==='Complete'; }).length },
    { label: 'Deferred', value: 'Deferred', count: appState.actions.filter(function(a){ return a.status==='Deferred'; }).length },
    { label: 'Overdue', value: 'Overdue', count: appState.actions.filter(function(a){ return isActionOverdue(a); }).length }
  ];

  var priorities = [
    { label: 'P1 — Critical', value: 'P1 — Critical', count: appState.actions.filter(function(a){ return a.priority==='P1 — Critical'; }).length },
    { label: 'P2 — High', value: 'P2 — High', count: appState.actions.filter(function(a){ return a.priority==='P2 — High'; }).length },
    { label: 'P3 — Medium', value: 'P3 — Medium', count: appState.actions.filter(function(a){ return a.priority==='P3 — Medium'; }).length },
    { label: 'P4 — Low', value: 'P4 — Low', count: appState.actions.filter(function(a){ return a.priority==='P4 — Low'; }).length }
  ];

  var taskTypes = [
    { label: 'All', value: 'all', count: appState.actions.length },
    { label: 'Internal Action', value: 'Internal Action', count: appState.actions.filter(function(a){ return (a.taskType||'Internal Action')==='Internal Action'; }).length },
    { label: 'External Dependency', value: 'External Dependency', count: appState.actions.filter(function(a){ return (a.taskType||'Internal Action')==='External Dependency'; }).length },
    { label: 'Milestone', value: 'Milestone', count: appState.actions.filter(function(a){ return (a.taskType||'Internal Action')==='Milestone'; }).length },
    { label: 'Delivery/Receipt', value: 'Delivery/Receipt', count: appState.actions.filter(function(a){ return (a.taskType||'Internal Action')==='Delivery/Receipt'; }).length }
  ];

  var filterHTML = '<div style="padding:12px;border-bottom:1px solid var(--border)"><div style="font-weight:600;margin-bottom:8px">Status</div>';
  statusGroups.forEach(function(g){
    filterHTML += '<label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer"><input type="radio" name="actionStatusFilter" value="'+g.value+'" '+(actionStatusFilter===g.value?'checked':'')+'><span>'+g.label+' <span style="font-size:11px;color:var(--text-secondary)">('+g.count+')</span></span></label>';
  });
  filterHTML += '</div><div style="padding:12px;border-bottom:1px solid var(--border)"><div style="font-weight:600;margin-bottom:8px">Priority</div>';
  priorities.forEach(function(p){
    filterHTML += '<label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer"><input type="radio" name="actionPriorityFilter" value="'+p.value+'" '+(actionPriorityFilter===p.value?'checked':'')+'><span>'+p.label+' <span style="font-size:11px;color:var(--text-secondary)">('+p.count+')</span></span></label>';
  });
  filterHTML += '</div><div style="padding:12px"><div style="font-weight:600;margin-bottom:8px">Task Type</div>';
  taskTypes.forEach(function(t){
    filterHTML += '<label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer"><input type="radio" name="actionTaskTypeFilter" value="'+t.value+'" '+(actionTaskTypeFilter===t.value?'checked':'')+'><span>'+t.label+' <span style="font-size:11px;color:var(--text-secondary)">('+t.count+')</span></span></label>';
  });
  filterHTML += '</div>';

  sidebar.innerHTML = filterHTML;

  sidebar.addEventListener('change', function(e){
    if(e.target.name === 'actionStatusFilter') {
      actionStatusFilter = e.target.value;
      renderContent();
    } else if(e.target.name === 'actionPriorityFilter') {
      actionPriorityFilter = e.target.value;
      renderContent();
    } else if(e.target.name === 'actionTaskTypeFilter') {
      actionTaskTypeFilter = e.target.value;
      renderContent();
    }
  });
}
/* ═══════════════════════════════════════════════
   BOM MANAGER MODULE
   ═══════════════════════════════════════════════ */
function bomFmtId(id) { return 'BOM-'+String(id).padStart(3,'0'); }
function bomGetStatusClass(s) { var m={'Approved':'bom-status-approved','Pending Review':'bom-status-pending','Obsolete':'bom-status-obsolete','Replacement Needed':'bom-status-replacement','On Order':'bom-status-onorder'}; return m[s]||'pill-muted'; }


function getFilteredBoms() {
  var list=appState.boms.slice();
  if(bomStatusFilter!=='all') list=list.filter(function(b){return b.status===bomStatusFilter;});
  if(bomCategoryFilter!=='all') list=list.filter(function(b){return b.category===bomCategoryFilter;});
  if(bomSearchQuery){var q=bomSearchQuery.toLowerCase();list=list.filter(function(b){return (b.partNumber||'').toLowerCase().indexOf(q)!==-1||(b.partName||'').toLowerCase().indexOf(q)!==-1||(b.description||'').toLowerCase().indexOf(q)!==-1||(b.vendor||'').toLowerCase().indexOf(q)!==-1||bomFmtId(b.id).toLowerCase().indexOf(q)!==-1||(b.systemNode||'').toLowerCase().indexOf(q)!==-1;});}
  list.sort(function(a,b){var av,bv;switch(bomSortField){case'id':av=a.id;bv=b.id;break;case'partNumber':av=(a.partNumber||'').toLowerCase();bv=(b.partNumber||'').toLowerCase();break;case'partName':av=(a.partName||'').toLowerCase();bv=(b.partName||'').toLowerCase();break;case'category':av=(a.category||'');bv=(b.category||'');break;case'qtyRequired':av=a.qtyRequired||0;bv=b.qtyRequired||0;break;case'unitCost':av=a.unitCost||0;bv=b.unitCost||0;break;case'totalCost':av=pmdMultiply(a.unitCost,a.qtyRequired);bv=pmdMultiply(b.unitCost,b.qtyRequired);break;case'status':av=a.status;bv=b.status;break;case'vendor':av=(a.vendor||'').toLowerCase();bv=(b.vendor||'').toLowerCase();break;default:av=a.id;bv=b.id;}if(typeof av==='string')return bomSortDir*av.localeCompare(bv);return bomSortDir*(av-bv);});
  return list;
}
function v95_renderBomModule(area) {
  var filtered=getFilteredBoms();
  var arrow=function(f){return bomSortField===f?(bomSortDir===1?' ▲':' ▼'):'';};
  var title=bomStatusFilter==='all'&&bomCategoryFilter==='all'?'All BOM Items':(bomStatusFilter!=='all'?bomStatusFilter+' Items':'')+(bomCategoryFilter!=='all'?(bomStatusFilter!=='all'?' · ':'')+bomCategoryFilter:'');
  /* BOM Summary Cards */
  var allBoms=appState.boms;
  var bomGrandTotal=0,bomShortfalls=0,bomUniqueVendors={},bomPendingCount=0;
  allBoms.forEach(function(b){bomGrandTotal+=pmdMultiply(b.unitCost,b.qtyRequired);if(bomIsShortfall(b))bomShortfalls++;if(b.vendor)bomUniqueVendors[b.vendor]=1;if(b.status==='Pending Review'||b.status==='On Order')bomPendingCount++;});
  var vendorCount=Object.keys(bomUniqueVendors).length;
  var summaryHTML='<div class="stats-grid" style="margin-bottom:16px">';
  summaryHTML+=statCard('⊕','Total Items',allBoms.length,bomShortfalls>0?bomShortfalls+' shortfalls':'All stocked','blue',null);
  summaryHTML+=statCard('$','Total Cost',fmtCurrency(bomGrandTotal),'Across all items','yellow',null);
  summaryHTML+=statCard('⚠','Shortfalls',bomShortfalls,bomShortfalls>0?'Require attention':'Fully stocked',bomShortfalls>0?'red':'green',null);
  summaryHTML+=statCard('◆','Vendors',vendorCount,bomPendingCount+' items pending/on order','purple',null);
  summaryHTML+='</div>';
  var tableHTML=summaryHTML+'<div class="table-container"><div class="table-header"><h3>'+esc(title)+' ('+filtered.length+')</h3><div class="table-filters"><input class="filter-input" type="text" id="bomSearchInput" placeholder="Search BOM..." value="'+esc(bomSearchQuery)+'" aria-label="Search BOM">'+(bomSearchQuery?'<button class="btn btn-sm" onclick="bomClearSearch()">✕</button>':'')+'<button class="btn btn-sm" style="margin-left:auto" onclick="openQuickEntry(\'boms\')">⚡ Quick Entry</button><button class="btn btn-sm" onclick="openPasteImport(\'boms\')">⎗ Paste Import</button><button class="btn btn-sm" onclick="openCostRollup()">⊕ Cost Rollup</button><button class="btn btn-sm" onclick="exportModuleCsv(\'boms\')">⬇ CSV</button></div></div>';
  if(filtered.length>0){
    tableHTML+='<div class="table-scroll"><table class="rtable"><thead><tr><th scope="col" onclick="bomSortBy(\'id\')">ID'+arrow('id')+'</th><th scope="col" onclick="bomSortBy(\'partNumber\')">Part #'+arrow('partNumber')+'</th><th scope="col" onclick="bomSortBy(\'partName\')">Part Name'+arrow('partName')+'</th><th scope="col" onclick="bomSortBy(\'category\')">Category'+arrow('category')+'</th><th scope="col" onclick="bomSortBy(\'qtyRequired\')">Req'+arrow('qtyRequired')+'</th><th scope="col">On-Hand</th><th scope="col" onclick="bomSortBy(\'unitCost\')">Unit Cost'+arrow('unitCost')+'</th><th scope="col" onclick="bomSortBy(\'totalCost\')">Total'+arrow('totalCost')+'</th><th scope="col" onclick="bomSortBy(\'vendor\')">Vendor'+arrow('vendor')+'</th><th scope="col">Lead</th><th scope="col" onclick="bomSortBy(\'status\')">Status'+arrow('status')+'</th><th scope="col">System</th><th scope="col" class="no-sort"></th></tr></thead><tbody>';
    var pageItems = paginateItems(filtered, 'boms');
    var catTotals={},grandTotal=0;
    pageItems.forEach(function(b){
      var tc=pmdMultiply(b.unitCost,b.qtyRequired);
      var sf=bomIsShortfall(b);
      var cat=b.category||'Uncategorized';
      if(!catTotals[cat])catTotals[cat]={total:0,count:0};
      catTotals[cat].total+=tc;catTotals[cat].count++;grandTotal+=tc;
      var indent=(b.level||0)*20;
      var hasChildren=appState.boms.some(function(x){return x.parentId===b.id;});
      var isExpanded=bomExpandedNodes[b.id]!==false;
      var expandToggle=hasChildren?'<button class="btn-icon" style="padding:4px 6px" onclick="event.stopPropagation();bomToggleNode('+b.id+');">'+(isExpanded?'▼':'▶')+'</button>':'<span style="width:24px"></span>';
      tableHTML+='<tr class="'+(sf?'bom-shortfall':'')+'" data-bom-id="'+b.id+'" data-bom-parent-id="'+b.parentId+'" style="'+(b.parentId&&!isParentExpanded(b.parentId)?'display:none;':'')+'" onclick="openBomDetail('+b.id+')"><td class="risk-id" style="padding-left:'+(4+indent)+'px">'+expandToggle+''+bomFmtId(b.id)+'</td><td style="font-family:var(--font-mono);font-size:12px">'+esc(b.partNumber||'—')+'</td><td class="risk-title-cell"><span class="risk-title-text" title="'+esc(b.partName||'')+'">'+esc(b.partName||'—')+'</span></td><td><span class="pill-cat cat-'+((b.category||'').toLowerCase().replace(/[^a-z]/g,''))+'">'+esc(b.category||'—')+'</span></td><td style="font-family:var(--font-mono);text-align:center">'+pmdDisplayNumber(b.qtyRequired)+'</td><td style="font-family:var(--font-mono);text-align:center;'+(sf?'color:var(--red);font-weight:700':'')+'">'+pmdDisplayNumber(b.qtyOnHand)+(sf?' <span class="shortfall-pill">LOW</span>':'')+'</td><td class="bom-cost">'+fmtCurrency(b.unitCost)+'</td><td class="bom-cost" style="font-weight:600">'+fmtCurrency(tc)+'</td><td style="font-size:12px">'+esc(b.vendor||'—')+'</td><td style="font-size:11px;color:var(--text-muted)">'+esc(b.leadTime||'—')+'</td><td><span class="badge-pill '+bomGetStatusClass(b.status)+'">'+esc(b.status||'—')+'</span></td><td style="font-size:11px;color:var(--text-muted)">'+esc(b.systemNode||'—')+'</td><td><button class="action-dots" onclick="event.stopPropagation();bomShowCtx(event,'+b.id+')">⋮</button></td></tr>';
    });
    tableHTML+='</tbody>';
    // Grand total row
    tableHTML+='<tfoot><tr class="bom-totals-row"><td colspan="7" style="text-align:right;padding-right:16px">Grand Total</td><td class="bom-cost">'+fmtCurrency(grandTotal)+'</td><td colspan="5"></td></tr></tfoot>';
    tableHTML+='</table></div>';
    tableHTML+=renderPagination('boms', filtered.length);
  } else {
    tableHTML+='<div class="empty-state"><div class="es-icon">⊕</div><h3>No BOM items found</h3><p>'+(bomSearchQuery?'No results for "'+esc(bomSearchQuery)+'".':'Get started by adding a BOM item, or use <strong>Paste Import</strong> to bulk import from Excel.')+'</p>'+(bomSearchQuery?'':'<div style="display:flex;gap:8px;justify-content:center;margin-top:8px"><button class="btn btn-sm btn-primary" onclick="openAddBomModal()">+ Add Item</button><button class="btn btn-sm" onclick="openPasteImport(\'boms\')">⎗ Paste Import</button></div>')+'</div>';
  }
  tableHTML+='</div>';
  area.innerHTML=tableHTML;
  // Wire search
  var si=document.getElementById('bomSearchInput');
  if(si) si.addEventListener('input',function(){var self=this;debounce('bomSearch',function(){bomSearchQuery=self.value;renderContent();var inp=document.getElementById('bomSearchInput');if(inp){inp.focus();inp.setSelectionRange(bomSearchQuery.length,bomSearchQuery.length);}},150);});
}
function isParentExpanded(parentId, _visited) {
  /* V9.4.1 — cycle-safe: bail out if we see the same parent twice.
     Handles malformed/imported data where A.parentId=B and B.parentId=A. */
  _visited = _visited || {};
  if(_visited[parentId]) return true;
  _visited[parentId] = true;
  var p=appState.boms.find(function(x){return x.id===parentId;});
  if(!p) return true;
  if(bomExpandedNodes[parentId]===false) return false;
  if(p.parentId) return isParentExpanded(p.parentId, _visited);
  return true;
}
function bomToggleNode(id) {
  bomExpandedNodes[id]=!bomExpandedNodes[id];
  renderContent();
}
function bomSortBy(f){if(bomSortField===f)bomSortDir*=-1;else{bomSortField=f;bomSortDir=1;}announce('Sorted by '+f+', '+(bomSortDir===1?'ascending':'descending'));renderContent();}
function bomClearSearch(){bomSearchQuery='';renderContent();}
/* ── BOM Modal ── */
function openAddBomModal(){
  bomEditingId=null;
  document.getElementById('bomModalTitle').textContent='New BOM Item';
  document.getElementById('bomSaveBtn').textContent='Add Item';
  renderBomModalBody({partNumber:'',partName:'',description:'',category:'Electronic',qtyRequired:1,qtyOnHand:0,unitCost:0,vendor:'',leadTime:'',status:'Pending Review',systemNode:'',notes:''});
  openModal('bomModal');
}
function openEditBomModal(id){
  var b=appState.boms.find(function(x){return x.id===id;});if(!b)return;
  bomEditingId=id;
  document.getElementById('bomModalTitle').textContent='Edit '+bomFmtId(id);
  document.getElementById('bomSaveBtn').textContent='Save Changes';
  renderBomModalBody(b);
  openModal('bomModal');
}
function renderBomModalBody(b){
  var cats=appState.settings.dropdownLists.bomCategories;
  var stats=appState.settings.dropdownLists.bomStatuses;
  var html='<div class="form-row"><div class="form-group"><label>Part Number *</label><input type="text" id="bPartNumber" value="'+esc(b.partNumber||'')+'"></div><div class="form-group"><label>Part Name *</label><input type="text" id="bPartName" value="'+esc(b.partName||'')+'"></div></div>';
  html+='<div class="form-group"><label>Description</label><textarea id="bDesc">'+esc(b.description||'')+'</textarea></div>';
  html+='<div class="form-row-3"><div class="form-group"><label>Category</label><select id="bCategory">'+cats.map(function(c){return '<option'+(b.category===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></div><div class="form-group"><label>Status</label><select id="bStatus">'+stats.map(function(s){return '<option'+(b.status===s?' selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></div><div class="form-group"><label>Vendor</label><input type="text" id="bVendor" value="'+esc(b.vendor||'')+'"></div></div>';
  html+='<div class="form-row-4"><div class="form-group"><label>Qty Required</label><input type="number" id="bQtyReq" min="0" value="'+pmdDisplayNumber(b.qtyRequired)+'" onchange="bomPreviewCost()" oninput="bomPreviewCost()"></div><div class="form-group"><label>Qty On-Hand</label><input type="number" id="bQtyHand" min="0" value="'+pmdDisplayNumber(b.qtyOnHand)+'"></div><div class="form-group"><label>Unit Cost ($)</label><input type="number" id="bUnitCost" min="0" step="0.01" value="'+(b.unitCost||0)+'" onchange="bomPreviewCost()" oninput="bomPreviewCost()"></div><div class="form-group"><label>Lead Time</label><input type="text" id="bLeadTime" value="'+esc(b.leadTime||'')+'" placeholder="e.g. 6 weeks"></div></div>';
  html+='<div class="crit-preview" style="margin-top:8px"><div class="cp-label">Total Cost</div><div class="cp-score" id="bomCostPreview" style="color:var(--accent)">'+fmtCurrency(pmdMultiply(b.unitCost,b.qtyRequired))+'</div></div>';
  // Assembly linkage dropdown
  var asmOpts = '<option value="">(None)</option>';
  appState.racks.forEach(function(rk){ asmOpts += '<option value="'+rk.id+'"'+((b.assemblyId||'')==rk.id?' selected':'')+'>'+esc(rk.name)+'</option>'; });
  html+='<div class="form-row" style="margin-top:14px"><div class="form-group"><label>Parent Assembly</label><select id="bAssemblyId">'+asmOpts+'</select></div><div class="form-group"><label>Associated System/Node</label><input type="text" id="bSystemNode" value="'+esc(b.systemNode||'')+'" placeholder="e.g. Node A, Rack 1"></div></div>';
  html+='<hr style="margin:16px 0;border:none;border-top:1px solid var(--border)">';
  html+='<h4 style="margin:8px 0;font-size:13px;color:var(--text-secondary)">Build BOM Tracking</h4>';
  html+='<div class="form-group"><label>Test Procedure Reference</label><input type="text" id="bTestProc" value="'+esc(b.testProcedure||'')+'" placeholder="e.g. MIL-810-G Method 500"></div>';
  html+='<div class="form-row-3"><div class="form-group"><label>Install Status</label><select id="bInstallStatus"><option'+(b.installStatus==='Not Started'?' selected':'')+'>Not Started</option><option'+(b.installStatus==='In Progress'?' selected':'')+'>In Progress</option><option'+(b.installStatus==='Installed'?' selected':'')+'>Installed</option><option'+(b.installStatus==='Verified'?' selected':'')+'>Verified</option></select></div><div class="form-group"><label>Storage Qty</label><input type="number" id="bStorageQty" min="0" value="'+pmdDisplayNumber(b.storageQty)+'"></div><div class="form-group"><label>Next Higher Assembly (NHA) Qty</label><input type="number" id="bNhaQty" min="1" value="'+(b.nhaQty||1)+'"></div></div>';
  html+='<div class="form-group"><label>Storage Location</label><input type="text" id="bStorageLoc" value="'+esc(b.storageLocation||'')+'" placeholder="e.g. Bin A-15, Shelf 3"></div>';
  html+='<div class="form-group"><label>Notes</label><textarea id="bNotes">'+esc(b.notes||'')+'</textarea></div>';
  document.getElementById('bomModalBody').innerHTML=html;
}
function bomPreviewCost(){var qty=pmdNumber('bQtyReq');var uc=pmdNumber('bUnitCost');var el=document.getElementById('bomCostPreview');if(el)el.textContent=fmtCurrency(qty*uc);}
function saveBom(){
  var pn=document.getElementById('bPartNumber').value.trim();
  var pname=document.getElementById('bPartName').value.trim();
  if(!pn&&!pname){toast('Part Number or Part Name required','error');return;}
  var asmSel=document.getElementById('bAssemblyId');
  var data={partNumber:pn,partName:pname,description:document.getElementById('bDesc').value.trim(),category:document.getElementById('bCategory').value,qtyRequired:pmdNumber('bQtyReq'),qtyOnHand:pmdNumber('bQtyHand'),unitCost:pmdNumber('bUnitCost'),vendor:document.getElementById('bVendor').value.trim(),leadTime:document.getElementById('bLeadTime').value.trim(),status:document.getElementById('bStatus').value,assemblyId:asmSel?parseInt(asmSel.value)||null:null,systemNode:document.getElementById('bSystemNode').value.trim(),testProcedure:document.getElementById('bTestProc').value.trim(),installStatus:document.getElementById('bInstallStatus').value||'Not Started',storageQty:pmdNumber('bStorageQty'),storageLocation:document.getElementById('bStorageLoc').value.trim(),nhaQty:parseInt(document.getElementById('bNhaQty').value)||1,notes:document.getElementById('bNotes').value.trim(),updated:todayStr()};
  snapshotForUndo(bomEditingId ? 'Edit BOM item' : 'Add BOM item');
  if(bomEditingId){
    var b=appState.boms.find(function(x){return x.id===bomEditingId;});
    if(b){
      var ch=[];
      if(b.partNumber!==data.partNumber)ch.push('Part# changed');
      if(b.status!==data.status)ch.push('Status: '+b.status+' → '+data.status);
      if(b.qtyOnHand!==data.qtyOnHand)ch.push('On-Hand: '+b.qtyOnHand+' → '+data.qtyOnHand);
      if(b.qtyRequired!==data.qtyRequired)ch.push('Qty Req: '+b.qtyRequired+' → '+data.qtyRequired);
      var bomAudit=auditDiff(b,data,[{key:'partNumber',label:'Part#'},{key:'partName',label:'Name'},{key:'status',label:'Status'},{key:'qtyRequired',label:'Qty Req'},{key:'qtyOnHand',label:'On-Hand'},{key:'unitCost',label:'Unit Cost'},{key:'vendor',label:'Vendor'}]);
      Object.assign(b,data);
      if(ch.length>0){b.history=b.history||[];b.history.push({date:todayStr(),text:ch.join('. ')});}
      if(bomAudit.length>0)auditRecord('boms',b.id,'updated',bomAudit,b.partName||b.partNumber);
      logActivity('boms','Updated',bomFmtId(bomEditingId),b.partName||b.partNumber);
      toast(bomFmtId(bomEditingId)+' updated','success');
    }
  } else {
    data.id=_bomNextId++;data.created=todayStr();data.history=[{date:todayStr(),text:'BOM item created.'}];
    appState.boms.push(data);
    auditRecord('boms',data.id,'created',[{field:'Part#',oldVal:'',newVal:data.partNumber}],data.partName||data.partNumber);
    logActivity('boms','Created',bomFmtId(data.id),data.partName||data.partNumber);
    toast(bomFmtId(data.id)+' added','success');
  }
  closeModal('bomModal');buildNav();renderContent();
}
/* ── BOM Detail Panel ── */
function v95_openBomDetail(id){
  var b=appState.boms.find(function(x){return x.id===id;});if(!b)return;
  var panel=document.getElementById('detailPanel');
  document.getElementById('detailPanelTitle').textContent=bomFmtId(b.id)+'  '+(b.partName||b.partNumber);
  document.getElementById('detailEditBtn').onclick=function(){closeDetailPanel();openEditBomModal(id);};
  var tc=pmdMultiply(b.unitCost,b.qtyRequired);
  var sf=bomIsShortfall(b);
  var html='<div class="detail-section"><h4>BOM Details</h4>';
  html+='<div class="detail-field"><span class="field-label">Part Number</span><span class="field-value" style="font-family:var(--font-mono)">'+esc(b.partNumber||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Part Name</span><span class="field-value">'+esc(b.partName||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Category</span><span class="pill-cat cat-'+((b.category||'').toLowerCase().replace(/[^a-z]/g,''))+'">'+esc(b.category||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Status</span><span class="badge-pill '+bomGetStatusClass(b.status)+'">'+esc(b.status||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Qty Required</span><span class="field-value" style="font-family:var(--font-mono)">'+pmdDisplayNumber(b.qtyRequired)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Qty On-Hand</span><span class="field-value" style="font-family:var(--font-mono);'+(sf?'color:var(--red);font-weight:700':'')+'">'+pmdDisplayNumber(b.qtyOnHand)+(sf?' ⚠ SHORTFALL':'')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Unit Cost</span><span class="field-value bom-cost">'+fmtCurrency(b.unitCost)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Total Cost</span><span class="field-value bom-cost" style="font-weight:700">'+fmtCurrency(tc)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Vendor</span><span class="field-value">'+esc(b.vendor||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Lead Time</span><span class="field-value">'+esc(b.leadTime||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">System/Node</span><span class="field-value">'+esc(b.systemNode||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Created</span><span class="field-value">'+fmtDateShort(b.created)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Updated</span><span class="field-value">'+fmtDateShort(b.updated)+'</span></div></div>';
  html+='<div class="detail-section"><h4>Build BOM Tracking</h4>';
  html+='<div class="detail-field"><span class="field-label">Test Procedure</span><span class="field-value">'+esc(b.testProcedure||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Install Status</span><span class="field-value">'+esc(b.installStatus||'Not Started')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Storage Qty</span><span class="field-value" style="font-family:var(--font-mono)">'+pmdDisplayNumber(b.storageQty)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Storage Location</span><span class="field-value">'+esc(b.storageLocation||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Next Higher Assembly (NHA) Qty</span><span class="field-value" style="font-family:var(--font-mono)">'+(b.nhaQty||1)+'</span></div></div>';
  if(b.description) html+='<div class="detail-section"><h4>Description</h4><div class="detail-description">'+esc(b.description)+'</div></div>';
  // Notes section
  var notesArr = b.notesArray || [];
  html+='<div class="detail-section"><h4>Notes ('+ notesArr.length+')</h4>';
  if(notesArr.length > 0) {
    notesArr.forEach(function(n){
      html+='<div style="padding:8px;background:var(--bg-tertiary);border-radius:var(--radius);margin-top:4px;font-size:12px"><div style="color:var(--text-secondary);font-size:11px">'+fmtDate(n.date)+'</div><div style="margin-top:2px">'+esc(n.text)+'</div></div>';
    });
  }
  html+='<div style="margin-top:8px"><textarea id="bomNoteText" placeholder="Add a note..." style="width:100%;padding:6px 10px;border-radius:var(--radius);border:1px solid var(--border);background:var(--bg-primary);color:var(--text-primary);font-size:12px;min-height:40px;font-family:var(--font-body)"></textarea><button class="btn btn-sm btn-primary" style="margin-top:6px" onclick="addBomNote('+b.id+')">Add Note</button></div></div>';
  // Linked inventory items
  var linkedInv=appState.inventory.filter(function(i){return pmdAreRelated('boms',b.id,'inventory',i.id);});
  if(linkedInv.length>0){
    html+='<div class="detail-section"><h4>Linked Inventory ('+linkedInv.length+')</h4>';
    linkedInv.forEach(function(i){html+='<div style="padding:4px 0;border-bottom:1px solid var(--border);font-size:12px"><a class="inv-link" onclick="switchModule(\'inventory\');setTimeout(function(){openInvDetail('+i.id+')},100)">'+esc(invFmtId(i.id))+'</a> — '+esc(i.itemName||'')+' ('+esc(i.status||'')+')</div>';});
    html+='</div>';
  }
  if(b.history&&b.history.length>0){html+='<div class="detail-section"><h4>History ('+b.history.length+')</h4>';b.history.slice().reverse().forEach(function(h){html+='<div class="history-item"><div class="history-date">'+fmtDateShort(h.date)+'</div><div class="history-text">'+esc(h.text)+'</div></div>';});html+='</div>';}
  // Cross-module links
  var bomGraph = buildLinkGraph('bom', b.id);
  var bomLinkCount = countGraphLinks(bomGraph);
  if (bomLinkCount > 0) {
    html+='<div class="detail-section"><h4>Cross-Module Links ('+bomLinkCount+')</h4>'+renderLinkGraphHTML(bomGraph,'bom')+'</div>';
  }
  html+='<div class="detail-section"><h4>Audit History</h4>'+renderAuditHistoryHTML('boms',b.id)+'</div>';
  html+='<div style="margin-top:12px"><button class="btn btn-sm" onclick="openImpactAnalysis(\'bom\','+b.id+')">◆ Impact Analysis</button></div>';
  document.getElementById('detailPanelBody').innerHTML=html;
  panel.classList.add('open');
}
/* ── BOM Context Menu ── */
function bomShowCtx(e,id){
  e.preventDefault();e.stopPropagation();bomCtxTargetId=id;
  showContextMenu(e.clientX,e.clientY,[
    {icon:'✎',label:'Edit',action:function(){openEditBomModal(bomCtxTargetId);}},
    {icon:'⎘',label:'Duplicate',action:function(){
      var b=appState.boms.find(function(x){return x.id===bomCtxTargetId;});if(!b)return;
      var d=JSON.parse(JSON.stringify(b));d.id=_bomNextId++;d.partName=(b.partName||'')+ ' (copy)';d.created=todayStr();d.updated=todayStr();d.history=[{date:todayStr(),text:'Duplicated from '+bomFmtId(b.id)+'.'}];
      appState.boms.push(d);logActivity('boms','Duplicated',bomFmtId(d.id),'from '+bomFmtId(b.id));toast('Duplicated as '+bomFmtId(d.id),'success');buildNav();renderContent();
    }},
    {separator:true},
    {icon:'✖',label:'Delete',danger:true,action:function(){
      showConfirm('Delete BOM Item','Delete '+bomFmtId(bomCtxTargetId)+'? This cannot be undone.','Delete',function(){
        snapshotForUndo('Delete BOM item');
        appState.boms=appState.boms.filter(function(x){return x.id!==bomCtxTargetId;});
        closeDetailPanel();logActivity('boms','Deleted',bomFmtId(bomCtxTargetId),'BOM item removed');toast('BOM item deleted','success');buildNav();renderContent();
      });
    }}
  ]);
}
function addBomNote(id) {
  var text = document.getElementById('bomNoteText').value.trim();
  if(!text) { toast('Note cannot be empty', 'error'); return; }
  var b = appState.boms.find(function(x){ return x.id === id; });
  if(b) {
    b.notesArray = b.notesArray || [];
    b.notesArray.push({ date: todayStr(), text: text });
    logActivity('boms', 'Added Note', bomFmtId(id), text.substring(0,50));
    toast('Note added', 'success');
    openBomDetail(id);
  }
}
/* ── BOM Sidebar Filters ── */
function buildBomSidebarFilters(){
  var el=document.getElementById('bomSidebarFilters');
  if(currentModule!=='boms'){el.innerHTML='';return;}
  var boms=appState.boms;
  var html='<div class="sidebar-section"><div class="sidebar-label">Status</div>';
  var statuses=['all'].concat(appState.settings.dropdownLists.bomStatuses);
  statuses.forEach(function(s){
    var cnt=s==='all'?boms.length:boms.filter(function(b){return b.status===s;}).length;
    if(s!=='all'&&cnt===0)return;
    var active=bomStatusFilter===s;
    var label=s==='all'?'All Items':s;
    html+='<button class="nav-item'+(active?' active':'')+'" onclick="bomSetStatusFilter(\''+esc(s)+'\')"><span class="nav-icon">'+(s==='all'?'○':'●')+'</span> '+esc(label)+'<span class="nav-badge">'+cnt+'</span></button>';
  });
  html+='</div>';
  // Category filter
  html+='<div class="sidebar-section"><div class="sidebar-label">Category</div>';
  var cats=['all'].concat(appState.settings.dropdownLists.bomCategories);
  cats.forEach(function(c){
    var cnt=c==='all'?boms.length:boms.filter(function(b){return b.category===c;}).length;
    if(c!=='all'&&cnt===0)return;
    var active=bomCategoryFilter===c;
    html+='<button class="nav-item'+(active?' active':'')+'" onclick="bomSetCategoryFilter(\''+esc(c)+'\')"><span class="nav-icon">'+(c==='all'?'○':'◆')+'</span> '+esc(c==='all'?'All Categories':c)+'<span class="nav-badge">'+cnt+'</span></button>';
  });
  html+='</div>';
  // Stats
  var shortfalls=boms.filter(bomIsShortfall).length;
  var totalCost=boms.reduce(function(s,b){return s+pmdMultiply(b.unitCost,b.qtyRequired);},0);
  html+='<div style="padding:12px 20px;border-top:1px solid var(--border);font-size:12px"><div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:var(--text-muted)">Shortfalls</span><span style="font-family:var(--font-mono);font-weight:600;color:'+(shortfalls>0?'var(--red)':'var(--green)')+'">'+shortfalls+'</span></div><div style="display:flex;justify-content:space-between;padding:3px 0"><span style="color:var(--text-muted)">Total Cost</span><span style="font-family:var(--font-mono);font-weight:600">'+fmtCurrency(totalCost)+'</span></div></div>';
  el.innerHTML=html;
}
function bomSetStatusFilter(s){bomStatusFilter=s;renderContent();buildBomSidebarFilters();}
function bomSetCategoryFilter(c){bomCategoryFilter=c;renderContent();buildBomSidebarFilters();}
/* ═══════════════════════════════════════════════
   INVENTORY & INSTALLATION TRACKER MODULE
   ═══════════════════════════════════════════════ */
function invFmtId(id) { return 'INV-'+String(id).padStart(3,'0'); }
function invGetStatusClass(s) { var m={'Installed':'inv-status-installed','In Storage':'inv-status-storage','Removed':'inv-status-removed','In Transit':'inv-status-transit','RMA':'inv-status-rma'}; return m[s]||'pill-muted'; }
function getFilteredInventory() {
  var list=appState.inventory.slice();
  if(invStatusFilter!=='all') list=list.filter(function(i){return i.status===invStatusFilter;});
  if(invLocationFilter!=='all') list=list.filter(function(i){return i.location===invLocationFilter;});
  if(invSearchQuery){var q=invSearchQuery.toLowerCase();list=list.filter(function(i){return (i.itemName||'').toLowerCase().indexOf(q)!==-1||(i.serialNumber||'').toLowerCase().indexOf(q)!==-1||(i.partNumber||'').toLowerCase().indexOf(q)!==-1||(i.location||'').toLowerCase().indexOf(q)!==-1||(i.systemNode||'').toLowerCase().indexOf(q)!==-1||invFmtId(i.id).toLowerCase().indexOf(q)!==-1;});}
  list.sort(function(a,b){var av,bv;switch(invSortField){case'id':av=a.id;bv=b.id;break;case'itemName':av=(a.itemName||'').toLowerCase();bv=(b.itemName||'').toLowerCase();break;case'serialNumber':av=(a.serialNumber||'').toLowerCase();bv=(b.serialNumber||'').toLowerCase();break;case'location':av=(a.location||'').toLowerCase();bv=(b.location||'').toLowerCase();break;case'status':av=a.status;bv=b.status;break;case'installDate':av=a.installDate||'9999';bv=b.installDate||'9999';break;case'condition':av=(a.condition||'');bv=(b.condition||'');break;default:av=a.id;bv=b.id;}if(typeof av==='string')return invSortDir*av.localeCompare(bv);return invSortDir*(av-bv);});
  return list;
}
function renderInventoryModule(area) {
  var filtered=getFilteredInventory();
  var arrow=function(f){return invSortField===f?(invSortDir===1?' ▲':' ▼'):'';};
  var title=invStatusFilter==='all'&&invLocationFilter==='all'?'All Inventory':(invStatusFilter!=='all'?invStatusFilter:'')+(invLocationFilter!=='all'?(invStatusFilter!=='all'?' · ':'')+invLocationFilter:'');
  /* Inventory Summary Cards */
  var allInv=appState.inventory;
  var installedCount=allInv.filter(function(i){return i.status==='Installed';}).length;
  var rmaCount=allInv.filter(function(i){return i.status==='RMA';}).length;
  var locs={};allInv.forEach(function(i){if(i.location)locs[i.location]=1;});
  var summaryHTML='<div class="stats-grid" style="margin-bottom:16px">';
  summaryHTML+=statCard('▤','Total Assets',allInv.length,installedCount+' installed','teal',null);
  summaryHTML+=statCard('●','Installed',installedCount,allInv.length>0?Math.round(installedCount/allInv.length*100)+'% of total':'No assets','green',null);
  summaryHTML+=statCard('⚠','RMA / Repair',rmaCount,rmaCount>0?'Require attention':'None pending',rmaCount>0?'red':'green',null);
  summaryHTML+=statCard('◆','Locations',Object.keys(locs).length,'Across all assets','purple',null);
  summaryHTML+='</div>';
  var tableHTML=summaryHTML+'<div class="table-container"><div class="table-header"><h3>'+esc(title)+' ('+filtered.length+')</h3><div class="table-filters"><input class="filter-input" type="text" id="invSearchInput" placeholder="Search inventory..." value="'+esc(invSearchQuery)+'" aria-label="Search inventory">'+(invSearchQuery?'<button class="btn btn-sm" onclick="invClearSearch()">✕</button>':'')+'<button class="btn btn-sm" style="margin-left:auto" onclick="openQuickEntry(\'inventory\')">⚡ Quick Entry</button><button class="btn btn-sm" onclick="openPasteImport(\'inventory\')">⎗ Paste Import</button><button class="btn btn-sm" onclick="exportModuleCsv(\'inventory\')">⬇ CSV</button></div></div>';
  if(filtered.length>0){
    tableHTML+='<div class="table-scroll"><table class="rtable"><thead><tr><th scope="col" onclick="invSortBy(\'id\')">Asset ID'+arrow('id')+'</th><th scope="col" onclick="invSortBy(\'itemName\')">Item Name'+arrow('itemName')+'</th><th scope="col" onclick="invSortBy(\'serialNumber\')">Serial #'+arrow('serialNumber')+'</th><th scope="col">Part #</th><th scope="col" onclick="invSortBy(\'location\')">Location'+arrow('location')+'</th><th scope="col">System/Node</th><th scope="col" onclick="invSortBy(\'installDate\')">Install Date'+arrow('installDate')+'</th><th scope="col">Installed By</th><th scope="col" onclick="invSortBy(\'status\')">Status'+arrow('status')+'</th><th scope="col" onclick="invSortBy(\'condition\')">Condition'+arrow('condition')+'</th><th scope="col" class="no-sort"></th></tr></thead><tbody>';
    var pageItems = paginateItems(filtered, 'inventory');
    pageItems.forEach(function(i){
      var hasBom=i.partNumber&&appState.boms.find(function(b){return pmdAreRelated('boms',b.id,'inventory',i.id);});
      tableHTML+='<tr data-inv-id="'+i.id+'" onclick="openInvDetail('+i.id+')"><td class="risk-id">'+invFmtId(i.id)+'</td><td class="risk-title-cell"><span class="risk-title-text" title="'+esc(i.itemName||'')+'">'+esc(i.itemName||'—')+'</span></td><td style="font-family:var(--font-mono);font-size:12px">'+esc(i.serialNumber||'—')+'</td><td>'+(hasBom?'<a class="inv-link" onclick="event.stopPropagation();openBomDetailByPN(\''+esc(i.partNumber)+'\')">'+esc(i.partNumber)+'</a>':'<span style="font-family:var(--font-mono);font-size:12px">'+esc(i.partNumber||'—')+'</span>')+'</td><td style="font-size:12px">'+esc(i.location||'—')+'</td><td style="font-size:11px;color:var(--text-muted)">'+esc(i.systemNode||'—')+'</td><td style="font-family:var(--font-mono);font-size:12px">'+fmtDateShort(i.installDate)+'</td><td style="font-size:12px">'+esc(i.installedBy||'—')+'</td><td><span class="badge-pill '+invGetStatusClass(i.status)+'">'+esc(i.status||'—')+'</span></td><td style="font-size:12px">'+esc(i.condition||'—')+'</td><td><button class="action-dots" onclick="event.stopPropagation();invShowCtx(event,'+i.id+')">⋮</button></td></tr>';
    });
    tableHTML+='</tbody></table></div>';
    tableHTML+=renderPagination('inventory', filtered.length);
  } else {
    tableHTML+='<div class="empty-state"><div class="es-icon">▤</div><h3>No inventory items found</h3><p>'+(invSearchQuery?'No results for "'+esc(invSearchQuery)+'".':'Track your equipment by adding inventory items, or use <strong>Paste Import</strong> from a spreadsheet.')+'</p>'+(invSearchQuery?'':'<div style="display:flex;gap:8px;justify-content:center;margin-top:8px"><button class="btn btn-sm btn-primary" onclick="openAddInvModal()">+ Add Item</button><button class="btn btn-sm" onclick="openPasteImport(\'inventory\')">⎗ Paste Import</button></div>')+'</div>';
  }
  tableHTML+='</div>';
  area.innerHTML=tableHTML;
  var si=document.getElementById('invSearchInput');
  if(si) si.addEventListener('input',function(){var self=this;debounce('invSearch',function(){invSearchQuery=self.value;renderContent();var inp=document.getElementById('invSearchInput');if(inp){inp.focus();inp.setSelectionRange(invSearchQuery.length,invSearchQuery.length);}},150);});
}
function invSortBy(f){if(invSortField===f)invSortDir*=-1;else{invSortField=f;invSortDir=1;}announce('Sorted by '+f+', '+(invSortDir===1?'ascending':'descending'));renderContent();}
function invClearSearch(){invSearchQuery='';renderContent();}
function openBomDetailByPN(pn){
  var b=appState.boms.find(function(x){return x.partNumber===pn;});
  if(b){switchModule('boms');setTimeout(function(){openBomDetail(b.id);},100);}
}
/* ── Inventory Modal ── */
function openAddInvModal(){
  invEditingId=null;
  document.getElementById('invModalTitle').textContent='New Inventory Item';
  document.getElementById('invSaveBtn').textContent='Add Item';
  renderInvModalBody({itemName:'',serialNumber:'',partNumber:'',location:'',systemNode:'',installDate:'',installedBy:'',status:'In Storage',condition:'New',notes:''});
  openModal('invModal');
}
function openEditInvModal(id){
  var i=appState.inventory.find(function(x){return x.id===id;});if(!i)return;
  invEditingId=id;
  document.getElementById('invModalTitle').textContent='Edit '+invFmtId(id);
  document.getElementById('invSaveBtn').textContent='Save Changes';
  renderInvModalBody(i);
  openModal('invModal');
}
function renderInvModalBody(item){
  var locs=appState.settings.dropdownLists.invLocations;
  var stats=appState.settings.dropdownLists.invStatuses;
  var conds=appState.settings.dropdownLists.invConditions;
  // Build part# options from BOM
  var bomParts=appState.boms.map(function(b){return b.partNumber;}).filter(function(p){return p;});
  var html='<div class="form-row"><div class="form-group"><label>Item Name *</label><input type="text" id="iItemName" value="'+esc(item.itemName||'')+'"></div><div class="form-group"><label>Serial Number</label><input type="text" id="iSerial" value="'+esc(item.serialNumber||'')+'"></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Part Number (link to BOM)</label><input type="text" id="iPartNumber" list="bomPartList" value="'+esc(item.partNumber||'')+'"><datalist id="bomPartList">'+bomParts.map(function(p){return '<option value="'+esc(p)+'">';}).join('')+'</datalist></div><div class="form-group"><label>Location</label><select id="iLocation"><option value="">— Select —</option>'+locs.map(function(l){return '<option'+(item.location===l?' selected':'')+'>'+esc(l)+'</option>';}).join('')+'</select></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>System/Node</label><input type="text" id="iSystemNode" value="'+esc(item.systemNode||'')+'" placeholder="e.g. Rack A, Node 3"></div><div class="form-group"><label>Status</label><select id="iStatus">'+stats.map(function(s){return '<option'+(item.status===s?' selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></div></div>';
  html+='<div class="form-row"><div class="form-group"><label>Installation Date</label><input type="date" id="iInstallDate" value="'+(item.installDate||'')+'"></div><div class="form-group"><label>Installed By</label><input type="text" id="iInstalledBy" value="'+esc(item.installedBy||'')+'"></div></div>';
  html+='<div class="form-group"><label>Condition</label><select id="iCondition">'+conds.map(function(c){return '<option'+(item.condition===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></div>';
  html+='<div class="form-group"><label>Notes</label><textarea id="iNotes">'+esc(item.notes||'')+'</textarea></div>';
  document.getElementById('invModalBody').innerHTML=html;
}
function saveInventory(){
  var name=document.getElementById('iItemName').value.trim();
  if(!name){toast('Item Name is required','error');return;}
  var newStatus=document.getElementById('iStatus').value;
  var data={itemName:name,serialNumber:document.getElementById('iSerial').value.trim(),partNumber:document.getElementById('iPartNumber').value.trim(),location:document.getElementById('iLocation').value,systemNode:document.getElementById('iSystemNode').value.trim(),installDate:document.getElementById('iInstallDate').value,installedBy:document.getElementById('iInstalledBy').value.trim(),status:newStatus,condition:document.getElementById('iCondition').value,notes:document.getElementById('iNotes').value.trim(),updated:todayStr()};
  snapshotForUndo(invEditingId ? 'Edit inventory' : 'Add inventory');
  if(invEditingId){
    var item=appState.inventory.find(function(x){return x.id===invEditingId;});
    if(item){
      var ch=[];
      if(item.status!==data.status)ch.push('Status: '+item.status+' → '+data.status);
      if(item.location!==data.location)ch.push('Location: '+(item.location||'—')+' → '+(data.location||'—'));
      if(item.condition!==data.condition)ch.push('Condition: '+(item.condition||'—')+' → '+(data.condition||'—'));
      // Auto-prompt system/node if changing to Installed
      if(data.status==='Installed'&&item.status!=='Installed'){
        if(!data.systemNode) data.systemNode=item.systemNode||'';
        if(!data.installDate) data.installDate=todayStr();
        ch.push('Installed on '+fmtDateShort(data.installDate));
      }
      Object.assign(item,data);
      if(ch.length>0){item.history=item.history||[];item.history.push({date:todayStr(),text:ch.join('. ')});}
      logActivity('inventory','Updated',invFmtId(invEditingId),item.itemName);
      toast(invFmtId(invEditingId)+' updated','success');
    }
  } else {
    data.id=_invNextId++;data.created=todayStr();data.history=[{date:todayStr(),text:'Item added to inventory.'}];
    if(data.status==='Installed'&&!data.installDate) data.installDate=todayStr();
    appState.inventory.push(data);
    logActivity('inventory','Created',invFmtId(data.id),data.itemName);
    toast(invFmtId(data.id)+' added','success');
  }
  closeModal('invModal');buildNav();renderContent();
}
/* ── Inventory Detail Panel ── */
function v95_openInvDetail(id){
  var item=appState.inventory.find(function(x){return x.id===id;});if(!item)return;
  var panel=document.getElementById('detailPanel');
  document.getElementById('detailPanelTitle').textContent=invFmtId(item.id)+'  '+item.itemName;
  document.getElementById('detailEditBtn').onclick=function(){closeDetailPanel();openEditInvModal(id);};
  var hasBom=item.partNumber&&appState.boms.find(function(b){return pmdAreRelated('boms',b.id,'inventory',item.id);});
  var html='<div class="detail-section"><h4>Inventory Details</h4>';
  html+='<div class="detail-field"><span class="field-label">Item Name</span><span class="field-value">'+esc(item.itemName||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Serial Number</span><span class="field-value" style="font-family:var(--font-mono)">'+esc(item.serialNumber||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Part Number</span><span class="field-value">'+(hasBom?'<a class="inv-link" onclick="openBomDetailByPN(\''+esc(item.partNumber)+'\')">'+esc(item.partNumber)+'</a>':'<span style="font-family:var(--font-mono)">'+esc(item.partNumber||'—')+'</span>')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Location</span><span class="field-value">'+esc(item.location||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">System/Node</span><span class="field-value">'+esc(item.systemNode||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Status</span><span class="badge-pill '+invGetStatusClass(item.status)+'">'+esc(item.status||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Condition</span><span class="field-value">'+esc(item.condition||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Install Date</span><span class="field-value">'+fmtDateShort(item.installDate)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Installed By</span><span class="field-value">'+esc(item.installedBy||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Created</span><span class="field-value">'+fmtDateShort(item.created)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Updated</span><span class="field-value">'+fmtDateShort(item.updated)+'</span></div></div>';
  // Notes section
  var notesArr = item.notesArray || [];
  html+='<div class="detail-section"><h4>Notes ('+ notesArr.length+')</h4>';
  if(notesArr.length > 0) {
    notesArr.forEach(function(n){
      html+='<div style="padding:8px;background:var(--bg-tertiary);border-radius:var(--radius);margin-top:4px;font-size:12px"><div style="color:var(--text-secondary);font-size:11px">'+fmtDate(n.date)+'</div><div style="margin-top:2px">'+esc(n.text)+'</div></div>';
    });
  }
  html+='<div style="margin-top:8px"><textarea id="invNoteText" placeholder="Add a note..." style="width:100%;padding:6px 10px;border-radius:var(--radius);border:1px solid var(--border);background:var(--bg-primary);color:var(--text-primary);font-size:12px;min-height:40px;font-family:var(--font-body)"></textarea><button class="btn btn-sm btn-primary" style="margin-top:6px" onclick="addInvNote('+item.id+')">Add Note</button></div></div>';
  if(item.history&&item.history.length>0){html+='<div class="detail-section"><h4>History ('+item.history.length+')</h4>';item.history.slice().reverse().forEach(function(h){html+='<div class="history-item"><div class="history-date">'+fmtDateShort(h.date)+'</div><div class="history-text">'+esc(h.text)+'</div></div>';});html+='</div>';}
  document.getElementById('detailPanelBody').innerHTML=html;
  panel.classList.add('open');
}
function addInvNote(id){
  var text = document.getElementById('invNoteText').value.trim();
  if(!text) { toast('Note cannot be empty', 'error'); return; }
  var item = appState.inventory.find(function(x){ return x.id === id; });
  if(item) {
    item.notesArray = item.notesArray || [];
    item.notesArray.push({ date: todayStr(), text: text });
    item.updated = todayStr();
    logActivity('inventory', 'Added Note', invFmtId(id), text.substring(0,50));
    toast('Note added', 'success');
    openInvDetail(id);
  }
}
/* ── Inventory Context Menu ── */
function invShowCtx(e,id){
  e.preventDefault();e.stopPropagation();invCtxTargetId=id;
  var item=appState.inventory.find(function(x){return x.id===id;});
  var menuItems=[
    {icon:'✎',label:'Edit',action:function(){openEditInvModal(invCtxTargetId);}},
    {icon:'⎘',label:'Duplicate',action:function(){
      var i=appState.inventory.find(function(x){return x.id===invCtxTargetId;});if(!i)return;
      var d=JSON.parse(JSON.stringify(i));d.id=_invNextId++;d.itemName=(i.itemName||'')+ ' (copy)';d.serialNumber='';d.created=todayStr();d.updated=todayStr();d.history=[{date:todayStr(),text:'Duplicated from '+invFmtId(i.id)+'.'}];
      appState.inventory.push(d);logActivity('inventory','Duplicated',invFmtId(d.id),'from '+invFmtId(i.id));toast('Duplicated as '+invFmtId(d.id),'success');buildNav();renderContent();
    }}
  ];
  if(item&&item.status!=='Installed'){
    menuItems.push({icon:'✓',label:'Mark Installed',action:function(){
      var i=appState.inventory.find(function(x){return x.id===invCtxTargetId;});if(!i)return;
      var old=i.status;i.status='Installed';i.installDate=i.installDate||todayStr();i.updated=todayStr();
      i.history=i.history||[];i.history.push({date:todayStr(),text:'Status: '+old+' → Installed'});
      logActivity('inventory','Installed',invFmtId(i.id),i.itemName);toast(invFmtId(i.id)+' marked Installed','success');buildNav();renderContent();
    }});
  }
  menuItems.push({separator:true});
  menuItems.push({icon:'✖',label:'Delete',danger:true,action:function(){
    showConfirm('Delete Inventory Item','Delete '+invFmtId(invCtxTargetId)+'? This cannot be undone.','Delete',function(){
      snapshotForUndo('Delete inventory');
      appState.inventory=appState.inventory.filter(function(x){return x.id!==invCtxTargetId;});
      closeDetailPanel();logActivity('inventory','Deleted',invFmtId(invCtxTargetId),'Inventory item removed');toast('Item deleted','success');buildNav();renderContent();
    });
  }});
  showContextMenu(e.clientX,e.clientY,menuItems);
}
/* ── Inventory Sidebar Filters ── */
function buildInvSidebarFilters(){
  var el=document.getElementById('invSidebarFilters');
  if(currentModule!=='inventory'){el.innerHTML='';return;}
  var inv=appState.inventory;
  var html='<div class="sidebar-section"><div class="sidebar-label">Status</div>';
  var statuses=['all'].concat(appState.settings.dropdownLists.invStatuses);
  statuses.forEach(function(s){
    var cnt=s==='all'?inv.length:inv.filter(function(i){return i.status===s;}).length;
    if(s!=='all'&&cnt===0)return;
    var active=invStatusFilter===s;
    html+='<button class="nav-item'+(active?' active':'')+'" onclick="invSetStatusFilter(\''+esc(s)+'\')"><span class="nav-icon">'+(s==='all'?'○':'●')+'</span> '+esc(s==='all'?'All Items':s)+'<span class="nav-badge">'+cnt+'</span></button>';
  });
  html+='</div>';
  // Location filter
  html+='<div class="sidebar-section"><div class="sidebar-label">Location</div>';
  var locs=['all'].concat(appState.settings.dropdownLists.invLocations);
  locs.forEach(function(l){
    var cnt=l==='all'?inv.length:inv.filter(function(i){return i.location===l;}).length;
    if(l!=='all'&&cnt===0)return;
    var active=invLocationFilter===l;
    html+='<button class="nav-item'+(active?' active':'')+'" onclick="invSetLocationFilter(\''+esc(l)+'\')"><span class="nav-icon">'+(l==='all'?'○':'◈')+'</span> '+esc(l==='all'?'All Locations':l)+'<span class="nav-badge">'+cnt+'</span></button>';
  });
  html+='</div>';
  el.innerHTML=html;
}
function invSetStatusFilter(s){invStatusFilter=s;renderContent();buildInvSidebarFilters();}
function invSetLocationFilter(l){invLocationFilter=l;renderContent();buildInvSidebarFilters();}

/* ═══════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════ */
// ═══════════════════════════════════════════════
// PHASE 5: GLOBAL SEARCH IMPLEMENTATION
// ═══════════════════════════════════════════════
var globalSearchDebounceTimer = null;



document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeGlobalSearch();
  }
});
document.addEventListener('click', function(e) {
  var searchContainer = document.querySelector('.global-search');
  var resultsDiv = document.getElementById('globalSearchResults');
  if (searchContainer && !searchContainer.contains(e.target)) {
    resultsDiv.classList.remove('visible');
  }
});
// ═══════════════════════════════════════════════
// PHASE 5: BULK ACTIONS
// ═══════════════════════════════════════════════
var riskSelectedIds = new Set();
var actionSelectedIds = new Set();
var bomSelectedIds = new Set();
var invSelectedIds = new Set();
var hwSelectedIds = new Set();
function toggleBulkSelect(moduleKey, itemId) {
  var selSet = moduleKey === 'risks' ? riskSelectedIds : 
               moduleKey === 'actions' ? actionSelectedIds :
               moduleKey === 'boms' ? bomSelectedIds :
               moduleKey === 'inventory' ? invSelectedIds :
               moduleKey === 'hwItems' ? hwSelectedIds : null;
  
  if (!selSet) return;
  
  if (selSet.has(itemId)) {
    selSet.delete(itemId);
  } else {
    selSet.add(itemId);
  }
  
  updateBulkBar();
  renderContent();
}
function selectAllBulk(moduleKey, checked) {
  var selSet = moduleKey === 'risks' ? riskSelectedIds : 
               moduleKey === 'actions' ? actionSelectedIds :
               moduleKey === 'boms' ? bomSelectedIds :
               moduleKey === 'inventory' ? invSelectedIds :
               moduleKey === 'hwItems' ? hwSelectedIds : null;
  
  if (!selSet) return;
  
  var data = moduleKey === 'risks' ? appState.risks :
             moduleKey === 'actions' ? appState.actions :
             moduleKey === 'boms' ? appState.boms :
             moduleKey === 'inventory' ? appState.inventory :
             moduleKey === 'hwItems' ? appState.hwItems : [];
  
  selSet.clear();
  if (checked) {
    data.forEach(function(item) { selSet.add(item.id); });
  }
  
  updateBulkBar();
  renderContent();
}
function updateBulkBar() {
  var selSet = currentModule === 'risks' ? riskSelectedIds :
               currentModule === 'actions' ? actionSelectedIds :
               currentModule === 'boms' ? bomSelectedIds :
               currentModule === 'inventory' ? invSelectedIds :
               currentModule === 'hwItems' ? hwSelectedIds : null;
  
  var bulkBar = document.getElementById('bulkActionBar');
  if (!bulkBar) {
    var contentArea = document.getElementById('contentArea');
    bulkBar = document.createElement('div');
    bulkBar.id = 'bulkActionBar';
    bulkBar.className = 'bulk-action-bar';
    bulkBar.style.display = 'none';
    contentArea.parentNode.insertBefore(bulkBar, contentArea.nextSibling);
  }
  
  if (!selSet || selSet.size === 0) {
    bulkBar.style.display = 'none';
  } else {
    var count = selSet.size;
    bulkBar.innerHTML = '<span class="bulk-bar-info">' + count + ' selected</span>' +
      '<div class="bulk-bar-actions">' +
      '<button class="btn btn-sm" onclick="deleteBulkSelected()">Delete Selected</button>' +
      '<button class="btn btn-sm" onclick="showBulkStatusChange()">⋯ Change Status</button>' +
      '<button class="btn btn-sm" onclick="exportBulkSelected()">⬇ Export CSV</button>' +
      '</div>';
    bulkBar.style.display = 'flex';
  }
}
function deleteBulkSelected() {
  var selSet = currentModule === 'risks' ? riskSelectedIds :
               currentModule === 'actions' ? actionSelectedIds :
               currentModule === 'boms' ? bomSelectedIds :
               currentModule === 'inventory' ? invSelectedIds :
               currentModule === 'hwItems' ? hwSelectedIds : null;
  
  if (!selSet || selSet.size === 0) return;
  
  showConfirm('Delete Selected Items?', 'This will delete ' + selSet.size + ' items. Use Ctrl+Z to undo.', 'Delete', function() {
    snapshotForUndo('Bulk delete ' + selSet.size + ' ' + currentModule);
    var ids = Array.from(selSet);
    if (currentModule === 'risks') {
      appState.risks = appState.risks.filter(function(r) { return !ids.includes(r.id); });
    } else if (currentModule === 'actions') {
      appState.actions = appState.actions.filter(function(a) { return !ids.includes(a.id); });
    } else if (currentModule === 'boms') {
      appState.boms = appState.boms.filter(function(b) { return !ids.includes(b.id); });
    } else if (currentModule === 'inventory') {
      appState.inventory = appState.inventory.filter(function(inv) { return !ids.includes(inv.id); });
    } else if (currentModule === 'hwItems') {
      appState.hwItems = appState.hwItems.filter(function(hw) { return !ids.includes(hw.id); });
    }
    selSet.clear();
    logActivity(currentModule, 'Deleted', 'bulk', 'Deleted ' + ids.length + ' items');
    markUnsaved();
    renderContent();
  });
}
function showBulkStatusChange() {
  var selSet = currentModule === 'risks' ? riskSelectedIds :
               currentModule === 'actions' ? actionSelectedIds :
               currentModule === 'boms' ? bomSelectedIds :
               currentModule === 'inventory' ? invSelectedIds :
               currentModule === 'hwItems' ? hwSelectedIds : null;
  
  if (!selSet || selSet.size === 0) return;
  
  var statuses = currentModule === 'risks' ? appState.settings.dropdownLists.riskStatuses :
                 currentModule === 'actions' ? appState.settings.dropdownLists.actionStatuses :
                 currentModule === 'boms' ? appState.settings.dropdownLists.bomStatuses :
                 currentModule === 'inventory' ? appState.settings.dropdownLists.invStatuses :
                 currentModule === 'hwItems' ? appState.settings.dropdownLists.hwReviewStatuses : [];
  
  var html = '<label for="bulkStatusSelect">New Status:</label><select id="bulkStatusSelect" style="padding:6px;border:1px solid var(--border);background:var(--bg-tertiary);color:var(--text-primary);border-radius:4px"><option value="">— Select —</option>';
  statuses.forEach(function(s) { html += '<option value="' + esc(s) + '">' + esc(s) + '</option>'; });
  html += '</select>';
  
  showConfirm('Change Status for ' + selSet.size + ' Items', html, 'Change Status', function() {
    var newStatus = document.getElementById('bulkStatusSelect').value;
    if (!newStatus) return;
    
    var ids = Array.from(selSet);
    if (currentModule === 'risks') {
      appState.risks.forEach(function(r) { if (ids.includes(r.id)) r.status = newStatus; });
    } else if (currentModule === 'actions') {
      appState.actions.forEach(function(a) { if (ids.includes(a.id)) a.status = newStatus; });
    } else if (currentModule === 'boms') {
      appState.boms.forEach(function(b) { if (ids.includes(b.id)) b.status = newStatus; });
    } else if (currentModule === 'inventory') {
      appState.inventory.forEach(function(inv) { if (ids.includes(inv.id)) inv.status = newStatus; });
    } else if (currentModule === 'hwItems') {
      appState.hwItems.forEach(function(hw) { if (ids.includes(hw.id)) hw.status = newStatus; });
    }
    selSet.clear();
    logActivity(currentModule, 'Updated', 'bulk', 'Status changed for ' + ids.length + ' items');
    renderContent();
  });
}
function exportBulkSelected() {
  var selSet = currentModule === 'risks' ? riskSelectedIds :
               currentModule === 'actions' ? actionSelectedIds :
               currentModule === 'boms' ? bomSelectedIds :
               currentModule === 'inventory' ? invSelectedIds :
               currentModule === 'hwItems' ? hwSelectedIds : null;
  
  if (!selSet || selSet.size === 0) return;
  
  var ids = Array.from(selSet);
  var data = currentModule === 'risks' ? appState.risks :
             currentModule === 'actions' ? appState.actions :
             currentModule === 'boms' ? appState.boms :
             currentModule === 'inventory' ? appState.inventory :
             currentModule === 'hwItems' ? appState.hwItems : [];
  
  var selected = data.filter(function(item) { return ids.includes(item.id); });
  
  var csv = '';
  if (selected.length > 0) {
    var keys = Object.keys(selected[0]);
    csv = keys.map(function(k) { return '"' + k + '"'; }).join(',') + '\n';
    selected.forEach(function(item) {
      csv += keys.map(function(k) {
        var val = item[k];
        if (typeof val === 'object') val = JSON.stringify(val);
        return '"' + (val || '').toString().replace(/"/g, '""') + '"';
      }).join(',') + '\n';
    });
  }
  
  var blob = new Blob([csv], {type: 'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = currentModule + '_export_' + todayStr() + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function clearBulkSelection() {
  riskSelectedIds.clear();
  actionSelectedIds.clear();
  bomSelectedIds.clear();
  invSelectedIds.clear();
  hwSelectedIds.clear();
  updateBulkBar();
}
// ═══════════════════════════════════════════════
// PHASE 5: DASHBOARD ENHANCEMENTS
// ═══════════════════════════════════════════════
function getActualShortfallCount() {
  return appState.boms.filter(function(item) {
    return item.qtyRequired > item.qtyOnHand && item.qtyOnHand > 0;
  }).length;
}
// ═══════════════════════════════════════════════
// PHASE 5: CROSS-MODULE LINKS
// ═══════════════════════════════════════════════
function openRisksFromAction(riskId) {
  switchModule('risks');
  openRisksDetail(riskId);
}
function openActionsFromRisk(riskId) {
  switchModule('actions');
  var linkedActions = appState.actions.filter(function(a) { return a.linkedRiskId === 'R-' + riskId; });
  if (linkedActions.length > 0) {
    openActionsDetail(linkedActions[0].id);
  }
}
function openInventoryFromBom(partNumber) {
  switchModule('inventory');
  var items = appState.inventory.filter(function(inv) { return inv.partNumber === partNumber; });
  if (items.length > 0) {
    openInvDetail(items[0].id);
  }
}
function openBomFromInventory(partNumber) {
  switchModule('boms');
  var items = appState.boms.filter(function(b) { return b.partNumber === partNumber; });
  if (items.length > 0) {
    openBomDetail(items[0].id);
  }
}
function openAssemblyFromHw(assemblyId) {
  switchModule('assemblies');
  openRackEdit(assemblyId);
}

// Alias functions for opening details - these are called by global search
function openRisksDetail(id) { return openRiskDetail(id); }
function openActionsDetail(id) { return openActionDetail(id); }
function openBomsDetail(id) { return openBomDetail(id); }
function openInventoryDetail(id) { return openInvDetail(id); }
function openHwItemsDetail(id) { return openHwDetail(id); }
function openDecisionsDetail(id) { return openDecisionDetail(id); }
function openMilestonesDetail(id) { return openMilestoneDetail(id); }

/* ═══════════════════════════════════════════════
   CROSS-MODULE LINK GRAPH ENGINE
   Builds a comprehensive bidirectional map of all
   relationships between items across all modules.
   ═══════════════════════════════════════════════ */






/* ═══════════════════════════════════════════════
   IMPACT ANALYSIS MODAL
   Shows everything connected to a selected item
   ═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   NOTIFICATION CENTER — Overdue items, warnings
   ═══════════════════════════════════════════════ */
var _notifDismissed = {};
function v95_getNotifications() {
  var notifs = [];
  var today = todayStr();
  // Overdue actions
  appState.actions.forEach(function(a) {
    if (a.status === 'Complete' || a.status === 'Deferred') return;
    if (a.due && a.due < today) {
      notifs.push({ type: 'overdue', severity: 'high', module: 'actions', id: a.id,
        title: actionFmtId(a.id) + ': ' + a.title, detail: 'Due ' + fmtDate(a.due),
        action: function(){ switchModule('actions'); openActionDetail(a.id); } });
    } else if (a.due) {
      var diff = (new Date(a.due+'T12:00:00') - new Date(today+'T12:00:00')) / (1000*60*60*24);
      if (diff <= 7 && diff > 0) {
        notifs.push({ type: 'due-soon', severity: 'medium', module: 'actions', id: a.id,
          title: actionFmtId(a.id) + ': ' + a.title, detail: 'Due in ' + Math.ceil(diff) + ' day' + (Math.ceil(diff)!==1?'s':''),
          action: function(){ switchModule('actions'); openActionDetail(a.id); } });
      }
    }
  });
  // Overdue risks
  appState.risks.forEach(function(r) {
    if (r.status === 'Closed') return;
    if (r.due && r.due < today) {
      notifs.push({ type: 'overdue', severity: 'high', module: 'risks', id: r.id,
        title: riskFmtId(r.id) + ': ' + r.title, detail: 'Due ' + fmtDate(r.due),
        action: function(){ switchModule('risks'); openRiskDetail(r.id); } });
    }
  });
  // BOM shortfalls
  appState.boms.forEach(function(b) {
    if (bomIsShortfall(b)) {
      notifs.push({ type: 'shortfall', severity: 'medium', module: 'boms', id: b.id,
        title: bomFmtId(b.id) + ': ' + (b.partName||b.partNumber||'?'), detail: 'Qty ' + (b.qtyOnHand||0) + ' / ' + (b.qtyRequired||0) + ' required',
        action: function(){ switchModule('boms'); openBomDetail(b.id); } });
    }
  });
  // Flagged HW items
  appState.hwItems.forEach(function(h) {
    if (h.status === 'Flagged') {
      notifs.push({ type: 'flagged', severity: 'high', module: 'hwItems', id: h.id,
        title: (h.name||h.hostname||'HW-'+h.id), detail: 'Security review flagged',
        action: function(){ switchModule('hwItems'); openHwDetail(h.id); } });
    }
  });
  // Formal action risks
  appState.risks.forEach(function(r) {
    if (r.status === 'Closed') return;
    var c = getCrit(r);
    if (needsFA(c)) {
      notifs.push({ type: 'formal-action', severity: 'high', module: 'risks', id: r.id,
        title: riskFmtId(r.id) + ': ' + r.title, detail: 'Criticality ' + c.sum + ' — Formal action required',
        action: function(){ switchModule('risks'); openRiskDetail(r.id); } });
    }
  });
  // Filter dismissed
  return notifs.filter(function(n) {
    return !_notifDismissed[n.module + '-' + n.id + '-' + n.type];
  });
}

function dismissNotification(module, id, type) {
  _notifDismissed[module + '-' + id + '-' + type] = true;
  openNotificationCenter();
}

var _notifItems = [];
function openNotificationCenter() {
  var notifs = getNotifications();
  _notifItems = notifs;
  var html = '<div style="max-height:450px;overflow-y:auto" id="notifList">';
  if (notifs.length === 0) {
    html += '<div style="text-align:center;padding:30px;color:var(--text-muted)"><div style="font-size:32px;margin-bottom:8px">✓</div><div>All clear — no alerts or warnings</div></div>';
  } else {
    var severityOrder = { high: 0, medium: 1, low: 2 };
    notifs.sort(function(a,b){ return (severityOrder[a.severity]||2) - (severityOrder[b.severity]||2); });
    var sevColors = { high: 'var(--red)', medium: 'var(--yellow)', low: 'var(--text-muted)' };
    var typeIcons = { overdue: '⚠', 'due-soon': '△', shortfall: '▼', flagged: '⊘', 'formal-action': '◆' };
    notifs.forEach(function(n, idx) {
      html += '<div class="notif-item" data-notif-idx="'+idx+'" style="padding:10px 12px;margin-bottom:6px;background:var(--bg-primary);border-radius:var(--radius);border-left:3px solid ' + (sevColors[n.severity]||'var(--border)') + ';display:flex;align-items:flex-start;gap:8px;cursor:pointer">';
      html += '<span style="color:' + (sevColors[n.severity]||'var(--text-muted)') + ';font-size:14px;flex-shrink:0">' + (typeIcons[n.type]||'●') + '</span>';
      html += '<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(n.title) + '</div>';
      html += '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px">' + esc(n.detail) + '</div></div>';
      html += '<button class="notif-dismiss btn-icon" data-dismiss-module="'+esc(n.module)+'" data-dismiss-id="'+n.id+'" data-dismiss-type="'+esc(n.type)+'" style="flex-shrink:0;font-size:10px" title="Dismiss">✕</button>';
      html += '</div>';
    });
  }
  html += '</div>';

  document.getElementById('confirmTitle').textContent = 'Notifications (' + notifs.length + ')';
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').textContent = 'Close';
  pendingConfirmCallback = function(){};
  var overlay = document.getElementById('confirmOverlay');
  overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false');

  // Wire click delegation
  var list = document.getElementById('notifList');
  if (list) list.addEventListener('click', function(e) {
    var dismissBtn = e.target.closest('.notif-dismiss');
    if (dismissBtn) {
      e.stopPropagation();
      dismissNotification(dismissBtn.dataset.dismissModule, parseInt(dismissBtn.dataset.dismissId), dismissBtn.dataset.dismissType);
      return;
    }
    var item = e.target.closest('.notif-item');
    if (item) {
      var idx = parseInt(item.dataset.notifIdx);
      if (_notifItems[idx] && _notifItems[idx].action) {
        closeConfirm();
        _notifItems[idx].action();
      }
    }
  });
}

function getNotificationCount() {
  return getNotifications().length;
}

function updateNotificationBadge() {
  var badge = document.getElementById('notifBadge');
  if (!badge) return;
  var count = getNotificationCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}
//
/* ═══════════════════════════════════════════════
   BOM COST ROLLUP CALCULATOR
   ═══════════════════════════════════════════════ */
function calcBomCostRollup() {
  var results = [];
  // Cost by assembly
  appState.racks.forEach(function(rk) {
    var asmBoms = appState.boms.filter(function(b){ return b.assemblyId === rk.id; });
    var totalCost = 0, itemCount = asmBoms.length, shortfalls = 0;
    asmBoms.forEach(function(b) {
      totalCost += pmdMultiply(b.unitCost,b.qtyRequired);
      if (bomIsShortfall(b)) shortfalls++;
    });
    results.push({ name: rk.name, id: rk.id, items: itemCount, cost: totalCost, shortfalls: shortfalls });
  });
  // Unassigned BOM items
  var unassigned = appState.boms.filter(function(b){ return !b.assemblyId; });
  if (unassigned.length > 0) {
    var uCost = 0, uSF = 0;
    unassigned.forEach(function(b) {
      uCost += pmdMultiply(b.unitCost,b.qtyRequired);
      if (bomIsShortfall(b)) uSF++;
    });
    results.push({ name: '(Unassigned)', id: null, items: unassigned.length, cost: uCost, shortfalls: uSF });
  }
  return results;
}

function openCostRollup() {
  var rollup = calcBomCostRollup();
  var grandTotal = rollup.reduce(function(s,r){ return s + r.cost; }, 0);
  var totalItems = rollup.reduce(function(s,r){ return s + r.items; }, 0);
  var totalSF = rollup.reduce(function(s,r){ return s + r.shortfalls; }, 0);

  var html = '<div style="margin-bottom:16px"><div style="display:flex;gap:24px;margin-bottom:12px">';
  html += '<div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase">Grand Total</div><div style="font-size:24px;font-weight:700;font-family:var(--font-mono);color:var(--accent)">'+fmtCurrency(grandTotal)+'</div></div>';
  html += '<div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase">Total Items</div><div style="font-size:24px;font-weight:700;font-family:var(--font-mono)">'+totalItems+'</div></div>';
  html += '<div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase">Shortfalls</div><div style="font-size:24px;font-weight:700;font-family:var(--font-mono);color:'+(totalSF>0?'var(--red)':'var(--green)')+'">'+totalSF+'</div></div>';
  html += '</div></div>';

  if (rollup.length > 0) {
    var maxCost = Math.max.apply(null, rollup.map(function(r){ return r.cost; }));
    if (maxCost < 1) maxCost = 1;
    html += '<div style="max-height:350px;overflow-y:auto">';
    rollup.forEach(function(r) {
      var pct = (r.cost / maxCost) * 100;
      html += '<div style="padding:10px 12px;margin-bottom:6px;background:var(--bg-primary);border-radius:var(--radius);border-left:3px solid '+(r.shortfalls>0?'var(--yellow)':'var(--green)')+'">';
      html += '<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-weight:600">'+esc(r.name)+'</span><span style="font-family:var(--font-mono);font-weight:700">'+fmtCurrency(r.cost)+'</span></div>';
      html += '<div style="height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--accent);border-radius:3px"></div></div>';
      html += '<div style="display:flex;gap:12px;margin-top:4px;font-size:11px;color:var(--text-secondary)"><span>'+r.items+' item'+(r.items!==1?'s':'')+'</span>'+(r.shortfalls>0?'<span style="color:var(--yellow)">'+r.shortfalls+' shortfall'+(r.shortfalls!==1?'s':'')+'</span>':'')+'</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  document.getElementById('confirmTitle').textContent = 'BOM Cost Rollup by Assembly';
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').textContent = 'Close';
  pendingConfirmCallback = function(){};
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

/* ═══════════════════════════════════════════════
   TRACEABILITY MATRIX
   Shows cross-module relationships in a grid view
   ═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   CALENDAR WIDGET — MONTHLY VIEW
   ═══════════════════════════════════════════════ */
var _calYear = new Date().getFullYear();
var _calMonth = new Date().getMonth(); // 0-based

function openCalendarView() {
  var html = buildCalendarHTML(_calYear, _calMonth);
  document.getElementById('confirmTitle').textContent = 'Calendar — Schedule Overview';
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').textContent = 'Close';
  pendingConfirmCallback = function(){};
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function calNav(delta) {
  _calMonth += delta;
  if (_calMonth > 11) { _calMonth = 0; _calYear++; }
  if (_calMonth < 0) { _calMonth = 11; _calYear--; }
  var container = document.querySelector('.cal-container');
  if (container) container.outerHTML = buildCalendarHTML(_calYear, _calMonth);
}

function buildCalendarHTML(year, month) {
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var todayDate = todayStr();

  // Collect events for this month
  var events = {};
  function addEvent(dateStr, label, type, color) {
    if (!dateStr) return;
    var d = dateStr.substring(0,10);
    var m = parseInt(d.substring(5,7)) - 1;
    var y = parseInt(d.substring(0,4));
    if (m !== month || y !== year) return;
    var day = parseInt(d.substring(8,10));
    if (!events[day]) events[day] = [];
    if (events[day].length < 3) events[day].push({label: label.substring(0,18), type: type, color: color});
  }

  appState.actions.forEach(function(a) {
    if (a.status === 'Complete') return;
    var overdue = a.due && a.due < todayDate;
    addEvent(a.due, a.title, 'action', overdue ? 'var(--red)' : 'var(--accent)');
  });
  appState.milestones.forEach(function(m) {
    if (m.status === 'Complete') return;
    addEvent(m.targetDate, m.title, 'milestone', 'var(--purple)');
  });
  appState.risks.forEach(function(r) {
    if (r.status === 'Closed') return;
    addEvent(r.due, r.title, 'risk', 'var(--yellow)');
  });

  var html = '<div class="cal-container">';
  html += '<div class="cal-nav"><button class="btn btn-sm" onclick="calNav(-1)">◀ Prev</button>';
  html += '<span class="cal-title">'+monthNames[month]+' '+year+'</span>';
  html += '<button class="btn btn-sm" onclick="calNav(1)">Next ▶</button></div>';
  html += '<div class="cal-grid">';

  // Day headers
  dayNames.forEach(function(d) {
    html += '<div class="cal-header">'+d+'</div>';
  });

  // Empty cells before first day
  for (var e = 0; e < firstDay; e++) {
    html += '<div class="cal-cell cal-empty"></div>';
  }

  // Day cells
  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = year+'-'+(month+1<10?'0':'')+(month+1)+'-'+(d<10?'0':'')+d;
    var isToday = dateStr === todayDate;
    var dayEvents = events[d] || [];
    html += '<div class="cal-cell'+(isToday ? ' cal-today' : '')+'">';
    html += '<div class="cal-day'+(isToday ? ' cal-day-today' : '')+'">'+d+'</div>';
    dayEvents.forEach(function(ev) {
      html += '<div class="cal-event" style="background:'+ev.color+';color:#fff" title="'+esc(ev.label)+'">'+esc(ev.label)+'</div>';
    });
    html += '</div>';
  }

  // Fill remaining cells
  var totalCells = firstDay + daysInMonth;
  var remainder = totalCells % 7;
  if (remainder > 0) {
    for (var f = 0; f < 7 - remainder; f++) {
      html += '<div class="cal-cell cal-empty"></div>';
    }
  }

  html += '</div>';
  // Legend
  html += '<div class="cal-legend"><span style="color:var(--accent)">● Actions</span> <span style="color:var(--purple)">● Milestones</span> <span style="color:var(--yellow)">● Risk Due Dates</span> <span style="color:var(--red)">● Overdue</span></div>';
  html += '</div>';
  return html;
}

/* ═══════════════════════════════════════════════
   RACI MATRIX — RESPONSIBILITY ASSIGNMENT
   ═══════════════════════════════════════════════ */
var _raciData = {}; // key: 'itemType-itemId-person' => 'R'|'A'|'C'|'I'

function openRaciMatrix() {
  // Gather all unique people from actions+risks
  var peopleSet = {};
  appState.actions.forEach(function(a) {
    if (a.assignee) peopleSet[a.assignee] = true;
    if (a.owner) peopleSet[a.owner] = true;
    if (a.source) peopleSet[a.source] = true;
  });
  appState.risks.forEach(function(r) {
    if (r.owner) peopleSet[r.owner] = true;
  });
  appState.decisions.forEach(function(d) {
    if (d.decisionMaker) peopleSet[d.decisionMaker] = true;
    if (d.stakeholders) d.stakeholders.split(',').forEach(function(s) { if (s.trim()) peopleSet[s.trim()] = true; });
  });
  var people = Object.keys(peopleSet).sort();

  if (people.length === 0) {
    showConfirm('RACI Matrix', 'No team members found. Add owners/assignees to actions, risks, or decisions first.', 'OK', function(){});
    return;
  }

  // Gather work items (open actions + active risks)
  var items = [];
  appState.actions.filter(function(a) { return a.status !== 'Complete'; }).slice(0, 30).forEach(function(a) {
    items.push({ type: 'action', id: a.id, label: actionFmtId(a.id)+' '+a.title.substring(0,25), assignee: a.assignee || a.owner });
  });
  appState.risks.filter(function(r) { return r.status !== 'Closed'; }).slice(0, 20).forEach(function(r) {
    items.push({ type: 'risk', id: r.id, label: riskFmtId(r.id)+' '+r.title.substring(0,25), assignee: r.owner });
  });

  var html = '<div style="max-height:65vh;overflow:auto">';
  html += '<div style="margin-bottom:8px;font-size:12px;color:var(--text-muted)">Click cells to cycle: — → R → A → C → I → —. Changes are saved in-session.</div>';
  html += '<table class="raci-table"><thead><tr><th class="raci-item-col">Item</th>';
  people.forEach(function(p) {
    html += '<th class="raci-person-col" title="'+esc(p)+'">'+esc(p.substring(0,10))+'</th>';
  });
  html += '</tr></thead><tbody>';

  items.forEach(function(item) {
    html += '<tr><td class="raci-item-cell" title="'+esc(item.label)+'">'+esc(item.label)+'</td>';
    people.forEach(function(p) {
      var key = item.type+'-'+item.id+'-'+p;
      var val = _raciData[key] || '';
      // Auto-assign R to the item's assignee/owner
      if (!val && p === item.assignee) val = 'R';
      var cls = val ? 'raci-'+val.toLowerCase() : '';
      html += '<td class="raci-cell '+cls+'" data-raci-key="'+esc(key)+'" onclick="cycleRaci(this,\''+esc(key)+'\')">'+(val || '—')+'</td>';
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  if (items.length === 0) html += '<p style="color:var(--text-muted)">No open actions or active risks to display.</p>';
  html += '</div>';

  document.getElementById('confirmTitle').textContent = 'RACI Matrix — Responsibility Assignment';
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').textContent = 'Close';
  pendingConfirmCallback = function(){};
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function cycleRaci(cell, key) {
  var order = ['', 'R', 'A', 'C', 'I'];
  var current = _raciData[key] || '';
  var idx = order.indexOf(current);
  var next = order[(idx + 1) % order.length];
  _raciData[key] = next;
  cell.textContent = next || '—';
  cell.className = 'raci-cell' + (next ? ' raci-' + next.toLowerCase() : '');
}

/* ═══════════════════════════════════════════════
   AUDIT TRAIL — FIELD-LEVEL CHANGE TRACKING
   ═══════════════════════════════════════════════ */
var _auditLog = [];
var _auditMaxEntries = 500;

function auditRecord(moduleKey, itemId, action, fieldChanges, itemTitle) {
  var entry = {
    id: generateId(),
    timestamp: nowISO(),
    module: moduleKey,
    itemId: itemId,
    itemTitle: itemTitle || '',
    action: action, // 'created','updated','deleted','status_change'
    changes: fieldChanges || [] // [{field, oldVal, newVal}]
  };
  _auditLog.unshift(entry);
  if (_auditLog.length > _auditMaxEntries) _auditLog = _auditLog.slice(0, _auditMaxEntries);
}

function auditDiff(oldObj, newObj, fields) {
  var changes = [];
  fields.forEach(function(f) {
    var label = f.label || f.key;
    var ov = oldObj[f.key] != null ? String(oldObj[f.key]) : '';
    var nv = newObj[f.key] != null ? String(newObj[f.key]) : '';
    if (ov !== nv) changes.push({ field: label, oldVal: ov, newVal: nv });
  });
  return changes;
}

function getItemAuditHistory(moduleKey, itemId) {
  return _auditLog.filter(function(e) { return e.module === moduleKey && e.itemId === itemId; });
}

function renderAuditHistoryHTML(moduleKey, itemId) {
  var entries = getItemAuditHistory(moduleKey, itemId);
  if (entries.length === 0) return '<div style="color:var(--text-muted);font-size:12px;padding:8px 0">No change history recorded for this item.</div>';
  var html = '<div class="audit-history-list">';
  entries.forEach(function(e) {
    var ts = fmtDateLong(e.timestamp.substring(0,10));
    var time = e.timestamp.substring(11,16);
    html += '<div class="audit-entry">';
    html += '<div class="audit-entry-head"><span class="audit-action audit-action-'+e.action+'">'+esc(e.action.replace(/_/g,' '))+'</span><span class="audit-ts">'+ts+' '+time+'</span></div>';
    if (e.changes && e.changes.length > 0) {
      html += '<div class="audit-changes">';
      e.changes.forEach(function(c) {
        html += '<div class="audit-change-row"><span class="audit-field">'+esc(c.field)+':</span> ';
        if (c.oldVal && c.newVal) {
          html += '<span class="audit-old">'+esc(c.oldVal.substring(0,50))+'</span> → <span class="audit-new">'+esc(c.newVal.substring(0,50))+'</span>';
        } else if (c.newVal) {
          html += '<span class="audit-new">'+esc(c.newVal.substring(0,50))+'</span>';
        } else {
          html += '<span class="audit-old">(cleared)</span>';
        }
        html += '</div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function openAuditTrailViewer() {
  var html = '<div style="max-height:60vh;overflow-y:auto">';
  if (_auditLog.length === 0) {
    html += '<p style="color:var(--text-muted)">No audit entries yet. Changes will be tracked as you create and edit items.</p>';
  } else {
    html += '<div style="margin-bottom:8px;font-size:12px;color:var(--text-muted)">Showing '+_auditLog.length+' entries (most recent first)</div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr>';
    html += '<th style="text-align:left;padding:4px 6px;border-bottom:2px solid var(--border)">Time</th>';
    html += '<th style="text-align:left;padding:4px 6px;border-bottom:2px solid var(--border)">Module</th>';
    html += '<th style="text-align:left;padding:4px 6px;border-bottom:2px solid var(--border)">Item</th>';
    html += '<th style="text-align:left;padding:4px 6px;border-bottom:2px solid var(--border)">Action</th>';
    html += '<th style="text-align:left;padding:4px 6px;border-bottom:2px solid var(--border)">Details</th>';
    html += '</tr></thead><tbody>';
    var shown = _auditLog.slice(0, 100);
    shown.forEach(function(e) {
      var ts = e.timestamp.substring(5,16).replace('T',' ');
      var details = '';
      if (e.changes && e.changes.length > 0) {
        details = e.changes.map(function(c) { return c.field; }).join(', ');
      }
      html += '<tr style="border-bottom:1px solid var(--border)">';
      html += '<td style="padding:3px 6px;white-space:nowrap">'+esc(ts)+'</td>';
      html += '<td style="padding:3px 6px">'+esc(e.module)+'</td>';
      html += '<td style="padding:3px 6px">'+esc(e.itemTitle.substring(0,20))+'</td>';
      html += '<td style="padding:3px 6px"><span class="audit-action audit-action-'+e.action+'">'+esc(e.action.replace(/_/g,' '))+'</span></td>';
      html += '<td style="padding:3px 6px;color:var(--text-muted)">'+esc(details.substring(0,40))+'</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    if (_auditLog.length > 100) html += '<div style="margin-top:8px;font-size:11px;color:var(--text-muted)">Showing 100 of '+_auditLog.length+' entries.</div>';
  }
  html += '</div>';
  document.getElementById('confirmTitle').textContent = 'Audit Trail — Change History';
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').textContent = 'Close';
  pendingConfirmCallback = function(){};
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

/* ═══════════════════════════════════════════════
   QUICK-ENTRY MODE — RAPID KEYBOARD-DRIVEN INPUT
   ═══════════════════════════════════════════════ */
var _quickEntryModule = null;
var _quickEntryCount = 0;

function v95_openQuickEntry(moduleKey) {
  _quickEntryModule = moduleKey;
  _quickEntryCount = 0;
  var html = '<div class="quick-entry-container">';
  html += '<div class="qe-header"><span class="qe-badge">Quick Entry</span> <span style="font-weight:600">'+esc(moduleNames[moduleKey] || moduleKey)+'</span>';
  html += '<span class="qe-count" id="qeCount">0 items added</span></div>';
  html += '<div class="qe-hint">Fill fields and press Enter or click Add. Tab between fields. Press Escape to close.</div>';
  html += '<div class="qe-form" id="qeForm">';
  html += buildQuickEntryFields(moduleKey);
  html += '</div>';
  html += '<div class="qe-actions">';
  html += '<button class="btn btn-primary" onclick="submitQuickEntry()">Add & Next (Enter)</button>';
  html += '<button class="btn btn-sm" onclick="closeQuickEntry()">Done (Esc)</button>';
  html += '</div></div>';
  document.getElementById('confirmTitle').textContent = 'Quick Entry — '+esc(moduleNames[moduleKey] || moduleKey);
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').style.display = 'none';
  pendingConfirmCallback = null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
  setTimeout(function() {
    var firstInput = document.querySelector('#qeForm input, #qeForm select, #qeForm textarea');
    if (firstInput) firstInput.focus();
  }, 100);
  // Keyboard handler
  document.getElementById('confirmOverlay').addEventListener('keydown', _qeKeyHandler);
}

function _qeKeyHandler(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submitQuickEntry();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closeQuickEntry();
  }
}

function closeQuickEntry() {
  document.getElementById('confirmOverlay').removeEventListener('keydown', _qeKeyHandler);
  document.getElementById('confirmBtn').style.display = '';
  document.getElementById('confirmOverlay').classList.remove('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','true');
  if (_quickEntryCount > 0) {
    toast(_quickEntryCount+' item(s) added via Quick Entry','success');
    renderContent();
  }
  _quickEntryModule = null;
}

function buildQuickEntryFields(moduleKey) {
  var html = '';
  var inp = 'class="form-control qe-input" style="margin-bottom:6px"';
  if (moduleKey === 'risks') {
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF1" placeholder="Risk title">';
    html += '<label class="qe-label">Description</label><input '+inp+' id="qeF2" placeholder="Brief description">';
    html += '<label class="qe-label">Category</label><select '+inp+' id="qeF3"><option value="">—</option>';
    (appState.settings.riskCategories||['Technical','Schedule','Cost','Performance']).forEach(function(c){html+='<option>'+esc(c)+'</option>';});
    html += '</select>';
    html += '<label class="qe-label">Owner</label><input '+inp+' id="qeF4" placeholder="Owner name">';
  } else if (moduleKey === 'actions') {
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF1" placeholder="Action title">';
    html += '<label class="qe-label">Description</label><input '+inp+' id="qeF2" placeholder="Brief description">';
    html += '<label class="qe-label">Priority</label><select '+inp+' id="qeF3"><option value="Medium">Medium</option><option value="Critical">Critical</option><option value="High">High</option><option value="Low">Low</option></select>';
    html += '<label class="qe-label">Owner</label><input '+inp+' id="qeF4" placeholder="Owner name">';
    html += '<label class="qe-label">Due Date</label><input '+inp+' id="qeF5" type="date">';
  } else if (moduleKey === 'boms') {
    html += '<label class="qe-label">Part Number *</label><input '+inp+' id="qeF1" placeholder="Part number">';
    html += '<label class="qe-label">Part Name *</label><input '+inp+' id="qeF2" placeholder="Part name">';
    html += '<label class="qe-label">Category</label><input '+inp+' id="qeF3" placeholder="Category">';
    html += '<label class="qe-label">Qty Required</label><input '+inp+' id="qeF4" type="number" value="1" min="1">';
    html += '<label class="qe-label">Unit Cost</label><input '+inp+' id="qeF5" type="number" step="0.01" placeholder="0.00">';
    html += '<label class="qe-label">Vendor</label><input '+inp+' id="qeF6" placeholder="Vendor name">';
  } else if (moduleKey === 'inventory') {
    html += '<label class="qe-label">Asset Name *</label><input '+inp+' id="qeF1" placeholder="Asset name">';
    html += '<label class="qe-label">Serial Number</label><input '+inp+' id="qeF2" placeholder="Serial number">';
    html += '<label class="qe-label">Location</label><input '+inp+' id="qeF3" placeholder="Location">';
    html += '<label class="qe-label">Status</label><select '+inp+' id="qeF4"><option value="In Stock">In Stock</option><option value="Installed">Installed</option><option value="On Order">On Order</option><option value="RMA/Repair">RMA/Repair</option></select>';
  } else if (moduleKey === 'decisions') {
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF1" placeholder="Decision title">';
    html += '<label class="qe-label">Description</label><input '+inp+' id="qeF2" placeholder="Brief description">';
    html += '<label class="qe-label">Category</label><select '+inp+' id="qeF3"><option value="Technical">Technical</option><option value="Schedule">Schedule</option><option value="Cost">Cost</option><option value="Scope">Scope</option><option value="Resource">Resource</option><option value="Process">Process</option></select>';
    html += '<label class="qe-label">Decision Maker</label><input '+inp+' id="qeF4" placeholder="Decision maker">';
  } else if (moduleKey === 'evm') {
    html += '<label class="qe-label">WBS Code</label><input '+inp+' id="qeF1" placeholder="1.2.3">';
    html += '<label class="qe-label">Name *</label><input '+inp+' id="qeF2" placeholder="Work package name">';
    html += '<label class="qe-label">BAC ($)</label><input '+inp+' id="qeF3" type="number" step="0.01" placeholder="0.00">';
    html += '<label class="qe-label">Owner</label><input '+inp+' id="qeF4" placeholder="Owner">';
  } else if (moduleKey === 'tests') {
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF1" placeholder="Test case title">';
    html += '<label class="qe-label">Requirement ID</label><input '+inp+' id="qeF2" placeholder="REQ-001">';
    html += '<label class="qe-label">Category</label><select '+inp+' id="qeF3"><option>Functional</option><option>Performance</option><option>Integration</option><option>Regression</option><option>Acceptance</option></select>';
    html += '<label class="qe-label">Method</label><select '+inp+' id="qeF4"><option>Test</option><option>Demonstration</option><option>Inspection</option><option>Analysis</option></select>';
  } else if (moduleKey === 'changes') {
    html += '<label class="qe-label">ECP # *</label><input '+inp+' id="qeF1" placeholder="ECP-001">';
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF2" placeholder="Change title">';
    html += '<label class="qe-label">Classification</label><select '+inp+' id="qeF3"><option>Class I</option><option>Class II</option></select>';
    html += '<label class="qe-label">Priority</label><select '+inp+' id="qeF4"><option>Routine</option><option>Urgent</option><option>Emergency</option></select>';
  } else if (moduleKey === 'lessons') {
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF1" placeholder="Lesson title">';
    html += '<label class="qe-label">Category</label><select '+inp+' id="qeF2"><option>Technical</option><option>Process</option><option>Management</option><option>Communication</option><option>Testing</option><option>Design</option><option>Integration</option><option>Logistics</option><option>Safety</option><option>Quality</option></select>';
    html += '<label class="qe-label">Sentiment</label><select '+inp+' id="qeF3"><option>Positive</option><option>Negative</option><option>Neutral</option></select>';
    html += '<label class="qe-label">Phase</label><select '+inp+' id="qeF4"><option>Concept</option><option>Design</option><option>Development</option><option>Test</option><option>Production</option><option>Deployment</option><option>Sustainment</option></select>';
  } else if (moduleKey === 'requirements') {
    html += '<label class="qe-label">Req ID *</label><input '+inp+' id="qeF1" placeholder="REQ-001">';
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF2" placeholder="Requirement title">';
    html += '<label class="qe-label">Type</label><select '+inp+' id="qeF3"><option>Functional</option><option>Performance</option><option>Interface</option><option>Environmental</option><option>Safety</option><option>Reliability</option><option>Maintainability</option></select>';
    html += '<label class="qe-label">Priority</label><select '+inp+' id="qeF4"><option>Must Have</option><option>Should Have</option><option>Could Have</option><option>Won\'t Have</option></select>';
  } else if (moduleKey === 'tradeStudies') {
    html += '<label class="qe-label">Study ID</label><input '+inp+' id="qeF1" placeholder="TS-001">';
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF2" placeholder="Study title">';
    html += '<label class="qe-label">Category</label><select '+inp+' id="qeF3"><option>Technical</option><option>Cost</option><option>Schedule</option><option>Performance</option><option>Risk</option><option>Weight</option><option>Power</option><option>Reliability</option></select>';
    html += '<label class="qe-label">Lead</label><input '+inp+' id="qeF4" placeholder="Lead engineer">';
  } else if (moduleKey === 'anomalies') {
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF1" placeholder="Anomaly title">';
    html += '<label class="qe-label">System</label><input '+inp+' id="qeF2" placeholder="Affected system">';
    html += '<label class="qe-label">Severity</label><select '+inp+' id="qeF3"><option>Critical</option><option>Major</option><option>Minor</option><option>Cosmetic</option></select>';
    html += '<label class="qe-label">Category</label><select '+inp+' id="qeF4"><option>Hardware</option><option>Software</option><option>Firmware</option><option>Mechanical</option><option>Electrical</option><option>Thermal</option><option>EMI/EMC</option><option>Environmental</option><option>Procedural</option><option>Design</option></select>';
  } else if (moduleKey === 'costTracker') {
    html += '<label class="qe-label">Work / WBS code (optional)</label><input '+inp+' id="qeF1" placeholder="1.2.3">';
    html += '<label class="qe-label">Title *</label><input '+inp+' id="qeF2" placeholder="Cost item title">';
    html += '<label class="qe-label">Category</label><select '+inp+' id="qeF3"><option>Labor</option><option>Material</option><option>Subcontract</option><option>Travel</option><option>ODC</option><option>Facilities</option><option>Equipment</option><option>Contingency</option></select>';
    html += '<label class="qe-label">Budget ($)</label><input '+inp+' id="qeF4" type="number" step="0.01" placeholder="0.00">';
  }
  return html;
}

function submitQuickEntry() {
  var m = _quickEntryModule;
  if (!m) return;
  var f1 = document.getElementById('qeF1');
  if (!f1 || !f1.value.trim()) { toast('Required field is empty','error'); if(f1) f1.focus(); return; }

  if (m === 'risks') {
    var r = {
      id: appState._riskNextId++,
      title: f1.value.trim(),
      description: (document.getElementById('qeF2')||{}).value||'',
      category: (document.getElementById('qeF3')||{}).value||'',
      owner: (document.getElementById('qeF4')||{}).value||'',
      status: 'Open',
      rackId: null,
      quality: 1, complexity: 1, schedule: 1, requirements: 1,
      likelihood: 1,
      mitigationPlan: '', mitigationStatus: 'Not Started',
      createdDate: todayStr(), updatedDate: todayStr(),
      history: ['['+todayStr()+'] Risk created via Quick Entry']
    };
    appState.risks.push(r);
    auditRecord('risks', r.id, 'created', [{field:'Title',oldVal:'',newVal:r.title}], r.title);
    logActivity('Risks','Created',riskFmtId(r.id),'Quick Entry: '+r.title);
  } else if (m === 'actions') {
    var a = {
      id: _actionNextId++,
      title: f1.value.trim(),
      description: (document.getElementById('qeF2')||{}).value||'',
      priority: (document.getElementById('qeF3')||{}).value||'Medium',
      owner: (document.getElementById('qeF4')||{}).value||'',
      dueDate: (document.getElementById('qeF5')||{}).value||'',
      status: 'Open',
      taskType: 'Task',
      linkedRiskId: '',
      completedDate: '',
      createdDate: todayStr(),
      history: ['['+todayStr()+'] Action created via Quick Entry']
    };
    appState.actions.push(a);
    auditRecord('actions', a.id, 'created', [{field:'Title',oldVal:'',newVal:a.title}], a.title);
    logActivity('Actions','Created','A-'+a.id,'Quick Entry: '+a.title);
  } else if (m === 'boms') {
    var b = {
      id: _bomNextId++,
      partNumber: f1.value.trim(),
      partName: (document.getElementById('qeF2')||{}).value||'',
      category: (document.getElementById('qeF3')||{}).value||'',
      qtyRequired: parseInt((document.getElementById('qeF4')||{}).value)||1,
      qtyOnHand: 0,
      unitCost: pmdNumber('qeF5'),
      totalCost: 0,
      vendor: (document.getElementById('qeF6')||{}).value||'',
      leadTimeDays: 0,
      status: 'Pending',
      subsystem: '',
      assemblyId: '',
      notes: '',
      createdDate: todayStr()
    };
    b.totalCost = b.qtyRequired * b.unitCost;
    appState.boms.push(b);
    auditRecord('boms', b.id, 'created', [{field:'Part#',oldVal:'',newVal:b.partNumber}], b.partNumber+' '+b.partName);
    logActivity('BOM','Created','B-'+b.id,'Quick Entry: '+b.partNumber);
  } else if (m === 'inventory') {
    var inv = {
      id: _invNextId++,
      assetName: f1.value.trim(),
      serialNumber: (document.getElementById('qeF2')||{}).value||'',
      location: (document.getElementById('qeF3')||{}).value||'',
      status: (document.getElementById('qeF4')||{}).value||'In Stock',
      condition: 'New',
      bomItemId: '',
      assignedTo: '',
      notes: '',
      createdDate: todayStr()
    };
    appState.inventory.push(inv);
    auditRecord('inventory', inv.id, 'created', [{field:'Asset',oldVal:'',newVal:inv.assetName}], inv.assetName);
    logActivity('Inventory','Created','I-'+inv.id,'Quick Entry: '+inv.assetName);
  } else if (m === 'decisions') {
    var dec = {
      id: appState._decNextId++,
      title: f1.value.trim(),
      description: (document.getElementById('qeF2')||{}).value||'',
      category: (document.getElementById('qeF3')||{}).value||'Technical',
      status: 'Proposed',
      impact: 'Medium',
      decisionMaker: (document.getElementById('qeF4')||{}).value||'',
      stakeholders: '',
      rationale: '',
      alternatives: '',
      linkedRiskId: '',
      reviewDate: '',
      date: todayStr(),
      updated: todayStr(),
      createdDate: todayStr(),
      updatedDate: todayStr()
    };
    appState.decisions.push(dec);
    auditRecord('decisions', dec.id, 'created', [{field:'Title',oldVal:'',newVal:dec.title}], dec.title);
    logActivity('Decisions','Created','D-'+dec.id,'Quick Entry: '+dec.title);
  } else if (m === 'evm') {
    var wp = {
      id: appState._evmNextId++,
      wbsCode: f1.value.trim(),
      name: (document.getElementById('qeF2')||{}).value||'Work Package',
      description: '',
      bac: pmdNumber('qeF3'),
      pv: 0, ev: 0, ac: 0,
      status: 'Not Started',
      owner: (document.getElementById('qeF4')||{}).value||'',
      startDate: '', endDate: '',
      pctComplete: 0,
      linkedActions: '',
      createdDate: todayStr(), updatedDate: todayStr()
    };
    appState.evmPackages.push(wp);
    auditRecord('evm', wp.id, 'created', [{field:'Name',oldVal:'',newVal:wp.name}], wp.name);
    logActivity('EVM','Created',evmFmtId(wp.id),'Quick Entry: '+wp.name);
  } else if (m === 'tests') {
    var tc = {
      id: appState._testNextId++,
      title: f1.value.trim(),
      reqId: (document.getElementById('qeF2')||{}).value||'',
      category: (document.getElementById('qeF3')||{}).value||'Functional',
      verMethod: (document.getElementById('qeF4')||{}).value||'Test',
      result: 'Not Run',
      tester: '', testDate: '',
      linkedActionId: '', procedure: '', notes: '',
      createdDate: todayStr(), updatedDate: todayStr()
    };
    appState.tests.push(tc);
    auditRecord('tests', tc.id, 'created', [{field:'Title',oldVal:'',newVal:tc.title}], tc.title);
    logActivity('Tests','Created',testFmtId(tc.id),'Quick Entry: '+tc.title);
  } else if (m === 'changes') {
    var ch = {
      id: appState._chgNextId++,
      ecpNumber: f1.value.trim(),
      title: (document.getElementById('qeF2')||{}).value||'Untitled Change',
      classification: (document.getElementById('qeF3')||{}).value||'Class I',
      priority: (document.getElementById('qeF4')||{}).value||'Routine',
      status: 'Submitted',
      requestor: '', description: '', justification: '',
      affectedCIs: '', linkedRiskId: '',
      costImpact: '', scheduleImpact: '',
      submitDate: todayStr(), decisionDate: '',
      createdDate: todayStr(), updatedDate: todayStr()
    };
    appState.changes.push(ch);
    auditRecord('changes', ch.id, 'created', [{field:'ECP',oldVal:'',newVal:ch.ecpNumber}], ch.ecpNumber);
    logActivity('Changes','Created',chgFmtId(ch.id),'Quick Entry: '+ch.ecpNumber+' - '+ch.title);
  } else if (m === 'lessons') {
    var le = {
      id: appState._lesNextId++,
      title: f1.value.trim(),
      category: (document.getElementById('qeF2')||{}).value||'Technical',
      sentiment: (document.getElementById('qeF3')||{}).value||'Neutral',
      phase: (document.getElementById('qeF4')||{}).value||'Design',
      impact: 'Medium',
      description: '', recommendation: '',
      contributor: '', linkedRiskId: '',
      createdDate: todayStr(), updatedDate: todayStr()
    };
    appState.lessons.push(le);
    auditRecord('lessons', le.id, 'created', [{field:'Title',oldVal:'',newVal:le.title}], le.title);
    logActivity('Lessons','Created',lesFmtId(le.id),'Quick Entry: '+le.title);
  } else if (m === 'requirements') {
    var rq = {
      id: appState._reqNextId++,
      reqId: f1.value.trim(),
      title: (document.getElementById('qeF2')||{}).value||'Untitled Requirement',
      description: '',
      type: (document.getElementById('qeF3')||{}).value||'Functional',
      priority: (document.getElementById('qeF4')||{}).value||'Must Have',
      verMethod: 'Test',
      verStatus: 'Not Verified',
      source: '', rationale: '',
      linkedTestId: '', linkedActionId: '', linkedRiskId: '',
      owner: '', allocation: '',
      createdDate: todayStr(), updatedDate: todayStr()
    };
    appState.requirements.push(rq);
    auditRecord('requirements', rq.id, 'created', [{field:'Req ID',oldVal:'',newVal:rq.reqId}], rq.reqId);
    logActivity('Requirements','Created',reqFmtId(rq.id),'Quick Entry: '+rq.reqId+' - '+rq.title);
  } else if (m === 'tradeStudies') {
    var ts = {
      id: appState._trdNextId++,
      studyId: f1.value.trim(),
      title: (document.getElementById('qeF2')||{}).value||'Untitled Study',
      category: (document.getElementById('qeF3')||{}).value||'Technical',
      status: 'Open',
      lead: (document.getElementById('qeF4')||{}).value||'',
      dueDate: '', alternatives: '', criteria: '', decision: '', rationale: '',
      linkedReq: '', linkedRisk: '', notes: '',
      createdDate: todayStr(), updatedDate: todayStr()
    };
    appState.tradeStudies.push(ts);
    auditRecord('tradeStudies', ts.id, 'created', [{field:'Title',oldVal:'',newVal:ts.title}], ts.title);
    logActivity('Analysis/Trade Studies','Created',trdFmtId(ts.id),'Quick Entry: '+ts.title);
  } else if (m === 'anomalies') {
    var an = {
      id: appState._anomNextId++,
      anomalyId: '',
      title: f1.value.trim(),
      system: (document.getElementById('qeF2')||{}).value||'',
      severity: (document.getElementById('qeF3')||{}).value||'Major',
      category: (document.getElementById('qeF4')||{}).value||'Hardware',
      status: 'Open',
      reportedBy: '', reportDate: todayStr(),
      description: '', stepsToReproduce: '', rootCause: '',
      correctiveAction: '', preventiveAction: '',
      linkedAction: '', linkedRisk: '', resolutionDate: '', notes: '',
      createdDate: todayStr(), updatedDate: todayStr()
    };
    appState.anomalies.push(an);
    auditRecord('anomalies', an.id, 'created', [{field:'Title',oldVal:'',newVal:an.title}], an.title);
    logActivity('Anomalies','Created',anomFmtId(an.id),'Quick Entry: '+an.title);
  } else if (m === 'costTracker') {
    var ci = {
      id: appState._costNextId++,
      wbsCode: f1.value.trim(),
      title: (document.getElementById('qeF2')||{}).value||'Untitled',
      category: (document.getElementById('qeF3')||{}).value||'Labor',
      budget: pmdNumber('qeF4'),
      actual: 0, committed: 0, etc: 0,
      owner: '', period: '', linkedEvm: '', notes: '',
      createdDate: todayStr(), updatedDate: todayStr()
    };
    appState.costItems.push(ci);
    auditRecord('costTracker', ci.id, 'created', [{field:'Title',oldVal:'',newVal:ci.title}], ci.title);
    logActivity('Cost','Created',costFmtId(ci.id),'Quick Entry: '+ci.wbsCode+' - '+ci.title);
  }

  _quickEntryCount++;
  var countEl = document.getElementById('qeCount');
  if (countEl) countEl.textContent = _quickEntryCount + ' item(s) added';
  markUnsaved();

  // Clear fields for next entry
  ['qeF1','qeF2','qeF3','qeF4','qeF5','qeF6'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else if (el.type === 'number') el.value = el.getAttribute('value') || '';
    else el.value = '';
  });
  if (f1) f1.focus();
  toast('Item added — ready for next','info');
}

/* ═══════════════════════════════════════════════
   SAVED FILTER PRESETS
   ═══════════════════════════════════════════════ */
var savedFilters = {
  risks: [],
  actions: [],
  boms: [],
  inventory: []
};

function getCurrentFilterState(moduleKey) {
  if (moduleKey === 'risks') return { status: riskStatusFilter, rack: riskRackFilter, search: riskSearchQuery };
  if (moduleKey === 'actions') return { status: actionStatusFilter, priority: actionPriorityFilter, taskType: actionTaskTypeFilter, search: actionSearchQuery };
  if (moduleKey === 'boms') return { status: bomStatusFilter, category: bomCategoryFilter, search: bomSearchQuery };
  if (moduleKey === 'inventory') return { status: invStatusFilter, location: invLocationFilter, search: invSearchQuery };
  return {};
}

function applyFilterPreset(moduleKey, idx) {
  var preset = savedFilters[moduleKey][idx];
  if (!preset) return;
  if (moduleKey === 'risks') {
    riskStatusFilter = preset.filters.status || 'all';
    riskRackFilter = preset.filters.rack || 'all';
    riskSearchQuery = preset.filters.search || '';
  } else if (moduleKey === 'actions') {
    actionStatusFilter = preset.filters.status || 'all';
    actionPriorityFilter = preset.filters.priority || 'all';
    actionTaskTypeFilter = preset.filters.taskType || 'all';
    actionSearchQuery = preset.filters.search || '';
  } else if (moduleKey === 'boms') {
    bomStatusFilter = preset.filters.status || 'all';
    bomCategoryFilter = preset.filters.category || 'all';
    bomSearchQuery = preset.filters.search || '';
  } else if (moduleKey === 'inventory') {
    invStatusFilter = preset.filters.status || 'all';
    invLocationFilter = preset.filters.location || 'all';
    invSearchQuery = preset.filters.search || '';
  }
  toast('Filter "' + preset.name + '" applied', 'info');
  buildNav(); renderContent();
}

function saveCurrentFilter(moduleKey) {
  var name = prompt('Name this filter preset:');
  if (!name || !name.trim()) return;
  var state = getCurrentFilterState(moduleKey);
  savedFilters[moduleKey].push({ name: name.trim(), filters: state, created: todayStr() });
  toast('Filter "' + name.trim() + '" saved', 'success');
  renderContent();
}

function deleteFilterPreset(moduleKey, idx) {
  savedFilters[moduleKey].splice(idx, 1);
  toast('Filter deleted', 'info');
  renderContent();
}

function renderFilterPresetsBar(moduleKey) {
  var presets = savedFilters[moduleKey];
  if (!presets || presets.length === 0) {
    return '<button class="btn btn-sm" onclick="saveCurrentFilter(\'' + moduleKey + '\')" title="Save current filters as a preset" style="font-size:11px">⊕ Save Filter</button>';
  }
  var html = '<div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">';
  html += '<span style="font-size:10px;color:var(--text-muted);text-transform:uppercase;margin-right:4px">Presets:</span>';
  presets.forEach(function(p, idx) {
    html += '<button class="btn btn-sm" onclick="applyFilterPreset(\'' + moduleKey + '\',' + idx + ')" style="font-size:11px" title="Apply filter: ' + esc(p.name) + '">' + esc(p.name) + '<span onclick="event.stopPropagation();deleteFilterPreset(\'' + moduleKey + '\',' + idx + ')" style="margin-left:4px;color:var(--text-muted);cursor:pointer" title="Delete preset">✕</span></button>';
  });
  html += '<button class="btn btn-sm" onclick="saveCurrentFilter(\'' + moduleKey + '\')" title="Save current filters" style="font-size:11px">⊕ Save</button>';
  html += '</div>';
  return html;
}

/* ═══════════════════════════════════════════════
   BURNDOWN / BURNUP CHARTS (pure CSS bars)
   ═══════════════════════════════════════════════ */
function buildBurndownChart() {
  // Group actions by week, showing cumulative created vs completed
  var actions = appState.actions.slice();
  if (actions.length === 0) return '';

  // Find date range
  var dates = [];
  actions.forEach(function(a) {
    var d = a.created ? a.created.split('T')[0] : todayStr();
    dates.push(d);
    if (a.completed) dates.push(a.completed);
  });
  dates.sort();
  var minDate = dates[0];
  var maxDate = todayStr();

  // Build weekly buckets
  var startD = new Date(minDate + 'T12:00:00');
  var endD = new Date(maxDate + 'T12:00:00');
  // Snap to week start (Monday)
  startD.setDate(startD.getDate() - startD.getDay() + 1);

  var weeks = [];
  var cursor = new Date(startD);
  while (cursor <= endD) {
    var weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weeks.push({
      start: cursor.toISOString().split('T')[0],
      end: weekEnd.toISOString().split('T')[0],
      label: (cursor.getMonth()+1) + '/' + cursor.getDate()
    });
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() + 7);
    if (weeks.length >= 16) break; // max 16 weeks
  }

  // Count cumulative created and completed per week
  var cumCreated = 0, cumCompleted = 0;
  var chartData = [];
  weeks.forEach(function(w) {
    actions.forEach(function(a) {
      var cd = a.created ? a.created.split('T')[0] : '';
      if (cd >= w.start && cd <= w.end) cumCreated++;
      if (a.completed && a.completed >= w.start && a.completed <= w.end) cumCompleted++;
    });
    chartData.push({ label: w.label, created: cumCreated, completed: cumCompleted, remaining: cumCreated - cumCompleted });
  });

  var maxVal = Math.max.apply(null, chartData.map(function(d){ return d.created; }));
  if (maxVal < 1) maxVal = 1;

  var html = '<div class="chart-section"><h3>Action Burndown</h3><div class="chart-sub">Cumulative created vs completed over time</div>';
  html += '<div class="burndown-chart">';
  chartData.forEach(function(d) {
    var createdPct = (d.created / maxVal) * 100;
    var completedPct = (d.completed / maxVal) * 100;
    html += '<div class="bd-col">';
    html += '<div class="bd-bars">';
    html += '<div class="bd-bar bd-bar-created" style="height:'+createdPct+'%" title="Created: '+d.created+'"></div>';
    html += '<div class="bd-bar bd-bar-completed" style="height:'+completedPct+'%" title="Completed: '+d.completed+'"></div>';
    html += '</div>';
    html += '<div class="bd-label">'+d.label+'</div>';
    html += '</div>';
  });
  html += '</div>';
  html += '<div class="bd-legend"><span class="bd-leg-item"><span class="bd-leg-sw" style="background:var(--accent)"></span>Created</span><span class="bd-leg-item"><span class="bd-leg-sw" style="background:var(--green)"></span>Completed</span><span class="bd-leg-item"><span class="bd-leg-sw" style="background:var(--orange)"></span>Remaining: '+(chartData.length>0?chartData[chartData.length-1].remaining:0)+'</span></div>';
  html += '</div>';
  return html;
}

/* ═══════════════════════════════════════════════
   ASSEMBLY READINESS SCORECARD
   ═══════════════════════════════════════════════ */
function buildAssemblyScorecard() {
  if (appState.racks.length === 0) return '';
  var html = '<div class="chart-section"><h3>Assembly Readiness</h3><div class="chart-sub">Completion status per assembly across modules</div>';
  html += '<div class="asm-scorecard">';

  appState.racks.forEach(function(rk) {
    var rackId = rk.id;
    // BOM items linked to this assembly
    var bomItems = appState.boms.filter(function(b){ return b.assemblyId === rackId; });
    var bomComplete = bomItems.filter(function(b){ return b.installStatus === 'Installed' || b.installStatus === 'Verified'; }).length;
    var bomPct = bomItems.length > 0 ? Math.round((bomComplete / bomItems.length) * 100) : 0;

    // Risks assigned to this rack
    var riskItems = appState.risks.filter(function(r) {
      var rids = getRackIds(r);
      return rids.includes('all') || rids.indexOf(rackId) >= 0;
    });
    var openRisks = riskItems.filter(function(r){ return r.status !== 'Closed'; }).length;

    // HW items in this assembly
    var hwItems = appState.hwItems.filter(function(h){ return h.assemblyId === rackId; });
    var hwApproved = hwItems.filter(function(h){ return h.status === 'Approved'; }).length;
    var hwPct = hwItems.length > 0 ? Math.round((hwApproved / hwItems.length) * 100) : 0;

    // Inventory for BOM items in this assembly
    var invCount = 0;
    bomItems.forEach(function(b) {
      if (b.partNumber && appState.inventory.some(function(i){ return pmdAreRelated('boms',b.id,'inventory',i.id) && i.status === 'Installed'; })) invCount++;
    });
    var invPct = bomItems.length > 0 ? Math.round((invCount / bomItems.length) * 100) : 0;

    // Overall readiness
    var overallPct = Math.round((bomPct + hwPct + invPct) / 3);
    var overallColor = overallPct >= 80 ? 'var(--green)' : overallPct >= 50 ? 'var(--yellow)' : 'var(--red)';

    html += '<div class="asm-card">';
    html += '<div class="asm-card-header"><span class="asm-card-name">'+esc(rk.name)+'</span><span class="asm-card-score" style="color:'+overallColor+'">'+overallPct+'%</span></div>';
    html += '<div class="asm-card-bars">';
    html += '<div class="asm-bar-row"><span class="asm-bar-label">BOM Install</span><div class="asm-bar-track"><div class="asm-bar-fill" style="width:'+bomPct+'%;background:var(--accent)"></div></div><span class="asm-bar-val">'+bomComplete+'/'+bomItems.length+'</span></div>';
    html += '<div class="asm-bar-row"><span class="asm-bar-label">HW Approved</span><div class="asm-bar-track"><div class="asm-bar-fill" style="width:'+hwPct+'%;background:var(--purple)"></div></div><span class="asm-bar-val">'+hwApproved+'/'+hwItems.length+'</span></div>';
    html += '<div class="asm-bar-row"><span class="asm-bar-label">Inventory</span><div class="asm-bar-track"><div class="asm-bar-fill" style="width:'+invPct+'%;background:var(--teal)"></div></div><span class="asm-bar-val">'+invCount+'/'+bomItems.length+'</span></div>';
    if (openRisks > 0) html += '<div style="font-size:11px;color:var(--yellow);margin-top:4px">⚠ '+openRisks+' open risk'+(openRisks!==1?'s':'')+'</div>';
    html += '</div></div>';
  });

  html += '</div></div>';
  return html;
}

/* ═══════════════════════════════════════════════
   DECISION LOG MODULE
   ═══════════════════════════════════════════════ */
var decSearchQuery = '';
var decSortField = 'id';
var decSortDir = -1;
var decEditingId = null;
var decStatusFilter = 'all';
var decCategories = ['Technical','Schedule','Cost','Scope','Resource','Process','Vendor','Other'];
var decStatuses = ['Proposed','Approved','Deferred','Superseded','Rejected'];

function decFmtId(id) { return 'DEC-' + String(id).padStart(3,'0'); }

function getFilteredDecisions() {
  var list = appState.decisions.slice();
  if (decStatusFilter !== 'all') list = list.filter(function(d){ return d.status === decStatusFilter; });
  if (decSearchQuery) {
    var q = decSearchQuery.toLowerCase();
    list = list.filter(function(d) {
      return (d.title||'').toLowerCase().indexOf(q) >= 0 ||
             (d.description||'').toLowerCase().indexOf(q) >= 0 ||
             (d.rationale||'').toLowerCase().indexOf(q) >= 0 ||
             (d.decisionMaker||'').toLowerCase().indexOf(q) >= 0 ||
             decFmtId(d.id).toLowerCase().indexOf(q) >= 0;
    });
  }
  list.sort(function(a,b) {
    var av = a[decSortField], bv = b[decSortField];
    if (decSortField === 'id') return (a.id - b.id) * decSortDir;
    if (decSortField === 'date') return ((a.date||'') < (b.date||'') ? -1 : 1) * decSortDir;
    return String(av||'').localeCompare(String(bv||'')) * decSortDir;
  });
  return list;
}

function v95_renderDecisionModule(area) {
  var filtered = getFilteredDecisions();
  var arrow = function(f){ return decSortField===f ? (decSortDir===1 ? ' ▲' : ' ▼') : ''; };

  var filterBtns = '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">';
  filterBtns += '<button class="btn btn-sm'+(decStatusFilter==='all'?' btn-primary':'')+'" onclick="decSetFilter(\'all\')">All ('+appState.decisions.length+')</button>';
  decStatuses.forEach(function(s) {
    var cnt = appState.decisions.filter(function(d){return d.status===s;}).length;
    if (cnt > 0 || s === 'Proposed' || s === 'Approved') filterBtns += '<button class="btn btn-sm'+(decStatusFilter===s?' btn-primary':'')+'" onclick="decSetFilter(\''+s+'\')">'+s+' ('+cnt+')</button>';
  });
  filterBtns += '<button class="btn btn-sm btn-primary" style="margin-left:auto" onclick="openAddDecisionModal()">+ New Decision</button>';
  filterBtns += '<button class="btn btn-sm" onclick="exportModuleCsv(\'decisions\')">⬇ CSV</button></div>';

  var searchHTML = '<div style="margin-bottom:12px"><input class="filter-input" type="text" id="decSearchInput" placeholder="Search decisions..." value="'+esc(decSearchQuery)+'" style="width:100%;max-width:340px">'+(decSearchQuery?'<button class="btn btn-sm" onclick="decSearchQuery=\'\';renderContent();" style="margin-left:6px">✕</button>':'')+'</div>';

  var tableHTML = '';
  if (filtered.length > 0) {
    tableHTML = '<div class="table-container"><div class="table-scroll"><table class="rtable"><thead><tr>';
    tableHTML += '<th scope="col" onclick="decSortBy(\'id\')">ID'+arrow('id')+'</th>';
    tableHTML += '<th scope="col" onclick="decSortBy(\'title\')">Decision'+arrow('title')+'</th>';
    tableHTML += '<th scope="col" onclick="decSortBy(\'category\')">Category'+arrow('category')+'</th>';
    tableHTML += '<th scope="col" onclick="decSortBy(\'status\')">Status'+arrow('status')+'</th>';
    tableHTML += '<th scope="col" onclick="decSortBy(\'decisionMaker\')">Decision Maker'+arrow('decisionMaker')+'</th>';
    tableHTML += '<th scope="col" onclick="decSortBy(\'date\')">Date'+arrow('date')+'</th>';
    tableHTML += '<th scope="col" class="no-sort">Impact</th>';
    tableHTML += '<th scope="col" class="no-sort"></th>';
    tableHTML += '</tr></thead><tbody>';
    filtered.forEach(function(d) {
      var stCls = 'status-' + (d.status||'').toLowerCase().replace(/\s/g,'');
      var impactColor = d.impact === 'High' ? 'var(--red)' : d.impact === 'Medium' ? 'var(--yellow)' : 'var(--green)';
      tableHTML += '<tr data-dec-id="'+d.id+'" onclick="openDecisionDetail('+d.id+')">';
      tableHTML += '<td style="font-family:var(--font-mono);font-size:12px">'+decFmtId(d.id)+'</td>';
      tableHTML += '<td style="font-weight:500;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(d.title)+'</td>';
      tableHTML += '<td><span class="badge-pill acat-'+(d.category||'other').toLowerCase()+'">'+esc(d.category||'—')+'</span></td>';
      tableHTML += '<td><span class="status-badge '+stCls+'">'+esc(d.status)+'</span></td>';
      tableHTML += '<td style="font-size:12px">'+esc(d.decisionMaker||'—')+'</td>';
      tableHTML += '<td style="font-size:12px;font-family:var(--font-mono)">'+fmtDateShort(d.date)+'</td>';
      tableHTML += '<td><span style="color:'+impactColor+';font-weight:600;font-size:12px">'+esc(d.impact||'—')+'</span></td>';
      tableHTML += '<td><button class="action-dots" onclick="event.stopPropagation();decShowCtx(event,'+d.id+')">⋮</button></td>';
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table></div></div>';
  } else {
    tableHTML = '<div class="empty-state"><div class="es-icon">◇</div><h3>No decisions found</h3><p>'+(decSearchQuery?'No results for "'+esc(decSearchQuery)+'"':'Track key project decisions, their rationale, and alternatives considered.')+'</p><button class="btn btn-sm btn-primary" style="margin-top:8px" onclick="openAddDecisionModal()">+ Add First Decision</button></div>';
  }

  area.innerHTML = filterBtns + searchHTML + tableHTML;

  var si = document.getElementById('decSearchInput');
  if (si) si.addEventListener('input', function() {
    var self = this;
    debounce('decSearch', function(){ decSearchQuery = self.value; renderContent(); }, 150);
  });
}

function decSortBy(f) { if(decSortField===f) decSortDir*=-1; else { decSortField=f; decSortDir=1; } renderContent(); }
function decSetFilter(s) { decStatusFilter=s; renderContent(); }

function openAddDecisionModal() {
  decEditingId = null;
  document.getElementById('decisionModalTitle').textContent = 'New Decision';
  document.getElementById('decisionSaveBtn').textContent = 'Add Decision';
  renderDecisionModalBody({ title:'', description:'', category:'Technical', status:'Proposed', impact:'Medium', decisionMaker:'', stakeholders:'', rationale:'', alternatives:'', date:todayStr(), reviewDate:'' });
  openModal('decisionModal');
}
function openEditDecisionModal(id) {
  var d = appState.decisions.find(function(x){return x.id===id;});
  if (!d) return;
  decEditingId = id;
  document.getElementById('decisionModalTitle').textContent = 'Edit ' + decFmtId(id);
  document.getElementById('decisionSaveBtn').textContent = 'Save Changes';
  renderDecisionModalBody(d);
  openModal('decisionModal');
}
function renderDecisionModalBody(d) {
  var html = '<div class="form-group"><label>Decision Title *</label><input type="text" id="decTitle" value="'+esc(d.title)+'"></div>';
  html += '<div class="form-group"><label>Description / Decision Statement</label><textarea id="decDesc" rows="3">'+esc(d.description||'')+'</textarea></div>';
  html += '<div class="form-row"><div class="form-group"><label>Category</label><select id="decCategory">'+decCategories.map(function(c){return '<option'+(d.category===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></div><div class="form-group"><label>Status</label><select id="decStatus">'+decStatuses.map(function(s){return '<option'+(d.status===s?' selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></div><div class="form-group"><label>Impact Level</label><select id="decImpact"><option'+(d.impact==='Low'?' selected':'')+'>Low</option><option'+(d.impact==='Medium'?' selected':'')+'>Medium</option><option'+(d.impact==='High'?' selected':'')+'>High</option></select></div></div>';
  html += '<div class="form-row"><div class="form-group"><label>Decision Maker</label><input type="text" id="decMaker" value="'+esc(d.decisionMaker||'')+'"></div><div class="form-group"><label>Stakeholders Impacted</label><input type="text" id="decStakeholders" value="'+esc(d.stakeholders||'')+'"></div></div>';
  html += '<div class="form-row"><div class="form-group"><label>Decision Date</label><input type="date" id="decDate" value="'+(d.date||todayStr())+'"></div><div class="form-group"><label>Review Date</label><input type="date" id="decReviewDate" value="'+(d.reviewDate||'')+'"></div></div>';
  html += '<div class="form-group"><label>Rationale (why this option was chosen)</label><textarea id="decRationale" rows="3">'+esc(d.rationale||'')+'</textarea></div>';
  html += '<div class="form-group"><label>Alternatives Considered</label><textarea id="decAlternatives" rows="2" placeholder="List other options that were considered...">'+esc(d.alternatives||'')+'</textarea></div>';
  html += '<div class="form-group"><label>Linked Risk ID (optional, e.g. R-001)</label><input type="text" id="decLinkedRisk" value="'+esc(d.linkedRiskId||'')+'"></div>';
  document.getElementById('decisionModalBody').innerHTML = html;
}
function saveDecision() {
  var title = document.getElementById('decTitle').value.trim();
  if (!title) { toast('Decision title is required','error'); return; }
  var data = {
    title: title,
    description: document.getElementById('decDesc').value.trim(),
    category: document.getElementById('decCategory').value,
    status: document.getElementById('decStatus').value,
    impact: document.getElementById('decImpact').value,
    decisionMaker: document.getElementById('decMaker').value.trim(),
    stakeholders: document.getElementById('decStakeholders').value.trim(),
    date: document.getElementById('decDate').value,
    reviewDate: document.getElementById('decReviewDate').value,
    rationale: document.getElementById('decRationale').value.trim(),
    alternatives: document.getElementById('decAlternatives').value.trim(),
    linkedRiskId: document.getElementById('decLinkedRisk').value.trim() || null,
    updated: todayStr()
  };
  snapshotForUndo(decEditingId ? 'Edit decision' : 'Add decision');
  if (decEditingId) {
    var d = appState.decisions.find(function(x){return x.id===decEditingId;});
    if (d) { Object.assign(d, data); logActivity('decisions','Updated',decFmtId(decEditingId),d.title); toast(decFmtId(decEditingId)+' updated','success'); }
  } else {
    data.id = appState._decNextId++;
    data.created = todayStr();
    data.notes = [];
    appState.decisions.push(data);
    logActivity('decisions','Created',decFmtId(data.id),data.title);
    toast(decFmtId(data.id)+' added','success');
  }
  closeModal('decisionModal'); renderContent();
}
function v95_openDecisionDetail(id) {
  var d = appState.decisions.find(function(x){return x.id===id;});
  if (!d) return;
  var html = '<div class="detail-section"><h4>Decision Details</h4>';
  html += '<div class="detail-field"><span class="field-label">ID</span><span class="field-value" style="font-family:var(--font-mono)">'+decFmtId(d.id)+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Title</span><span class="field-value" style="font-weight:600">'+esc(d.title)+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Category</span><span class="badge-pill acat-'+(d.category||'other').toLowerCase()+'">'+esc(d.category)+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Status</span><span class="status-badge status-'+(d.status||'').toLowerCase().replace(/\s/g,'')+'">'+esc(d.status)+'</span></div>';
  var impClr = d.impact==='High'?'var(--red)':d.impact==='Medium'?'var(--yellow)':'var(--green)';
  html += '<div class="detail-field"><span class="field-label">Impact</span><span style="color:'+impClr+';font-weight:600">'+esc(d.impact||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Decision Maker</span><span class="field-value">'+esc(d.decisionMaker||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Stakeholders</span><span class="field-value">'+esc(d.stakeholders||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Date</span><span class="field-value">'+fmtDateShort(d.date)+'</span></div>';
  if (d.reviewDate) html += '<div class="detail-field"><span class="field-label">Review Date</span><span class="field-value">'+fmtDateShort(d.reviewDate)+'</span></div>';
  html += '</div>';
  if (d.description) html += '<div class="detail-section"><h4>Decision Statement</h4><div class="detail-description">'+esc(d.description)+'</div></div>';
  if (d.rationale) html += '<div class="detail-section"><h4>Rationale</h4><div class="detail-description">'+esc(d.rationale)+'</div></div>';
  if (d.alternatives) html += '<div class="detail-section"><h4>Alternatives Considered</h4><div class="detail-description">'+esc(d.alternatives)+'</div></div>';
  if (d.linkedRiskId) {
    var rid = String(d.linkedRiskId).replace(/^R-/i,'');
    html += '<div class="detail-section"><h4>Linked Risk</h4><a href="#" onclick="event.preventDefault();closeDetailPanel();switchModule(\'risks\');openRiskDetail('+parseInt(rid)+');" style="color:var(--accent)">'+esc(d.linkedRiskId)+'</a></div>';
  }
  if (d.notes && d.notes.length > 0) {
    html += '<div class="detail-section"><h4>Notes ('+d.notes.length+')</h4>';
    d.notes.forEach(function(n){ html += '<div style="padding:8px;background:var(--bg-tertiary);border-radius:var(--radius);margin-top:4px;font-size:12px"><div style="color:var(--text-secondary);font-size:11px">'+fmtDate(n.date)+'</div><div style="margin-top:2px">'+esc(n.text)+'</div></div>'; });
    html += '</div>';
  }
  html += '<div style="margin-top:12px;display:flex;gap:6px"><button class="btn btn-sm" onclick="openEditDecisionModal('+d.id+')">✎ Edit</button><button class="btn btn-sm" onclick="deleteDecision('+d.id+')">✕ Delete</button></div>';
  document.getElementById('detailPanelTitle').textContent = decFmtId(d.id) + ' — ' + d.title;
  document.getElementById('detailEditBtn').onclick = function(){ openEditDecisionModal(id); };
  document.getElementById('detailPanelBody').innerHTML = html;
  document.getElementById('detailPanel').classList.add('open');
}

function decShowCtx(e, id) {
  e.preventDefault(); e.stopPropagation();
  showContextMenu(e.clientX, e.clientY, [
    { icon:'✎', label:'Edit', action:function(){ openEditDecisionModal(id); } },
    { icon:'⎘', label:'Duplicate', action:function(){
      var d = appState.decisions.find(function(x){return x.id===id;});
      if (!d) return;
      var copy = JSON.parse(JSON.stringify(d));
      copy.id = appState._decNextId++; copy.title += ' (copy)'; copy.created = todayStr();
      appState.decisions.push(copy); logActivity('decisions','Duplicated',decFmtId(copy.id),''); toast('Duplicated','success'); renderContent();
    }},
    { separator:true },
    { icon:'✕', label:'Delete', danger:true, action:function(){ deleteDecision(id); } }
  ]);
}

/* ═══════════════════════════════════════════════
   MILESTONE TRACKER MODULE
   ═══════════════════════════════════════════════ */
var msEditingId = null;
var msSortField = 'date';
var msSortDir = 1;
var msStatusFilter = 'all';
var msStatuses = ['Not Started','In Progress','Complete','At Risk','Missed'];

function msFmtId(id) { return 'MS-' + String(id).padStart(3,'0'); }

function v95_renderMilestoneModule(area) {
  var milestones = appState.milestones.slice();
  if (msStatusFilter !== 'all') milestones = milestones.filter(function(m){ return m.status === msStatusFilter; });
  milestones.sort(function(a,b) {
    if (msSortField === 'date') return ((a.date||'9999') < (b.date||'9999') ? -1 : 1) * msSortDir;
    if (msSortField === 'id') return (a.id - b.id) * msSortDir;
    return String(a[msSortField]||'').localeCompare(String(b[msSortField]||'')) * msSortDir;
  });

  var arrow = function(f){ return msSortField===f ? (msSortDir===1 ? ' ▲' : ' ▼') : ''; };
  var today = todayStr();

  // Filter buttons
  var filterBtns = '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">';
  filterBtns += '<button class="btn btn-sm'+(msStatusFilter==='all'?' btn-primary':'')+'" onclick="msSetFilter(\'all\')">All ('+appState.milestones.length+')</button>';
  msStatuses.forEach(function(s) {
    var cnt = appState.milestones.filter(function(m){return m.status===s;}).length;
    if (cnt > 0) filterBtns += '<button class="btn btn-sm'+(msStatusFilter===s?' btn-primary':'')+'" onclick="msSetFilter(\''+s+'\')">'+s+' ('+cnt+')</button>';
  });
  filterBtns += '<button class="btn btn-sm btn-primary" style="margin-left:auto" onclick="openAddMilestoneModal()">+ New Milestone</button></div>';

  // Timeline visualization
  var timelineHTML = '';
  if (milestones.length > 0) {
    timelineHTML = '<div class="ms-timeline">';
    milestones.forEach(function(m) {
      var isPast = m.date && m.date < today;
      var isToday = m.date === today;
      var statusCls = m.status === 'Complete' ? 'ms-complete' : m.status === 'At Risk' ? 'ms-atrisk' : m.status === 'Missed' ? 'ms-missed' : isPast && m.status !== 'Complete' ? 'ms-overdue' : 'ms-upcoming';
      var icon = m.status === 'Complete' ? '✓' : m.status === 'Missed' ? '✕' : m.status === 'At Risk' ? '⚠' : '◆';
      timelineHTML += '<div class="ms-item '+statusCls+'" onclick="openMilestoneDetail('+m.id+')">';
      timelineHTML += '<div class="ms-marker">'+icon+'</div>';
      timelineHTML += '<div class="ms-content">';
      timelineHTML += '<div class="ms-title">'+esc(m.title)+'</div>';
      timelineHTML += '<div class="ms-date">'+fmtDate(m.date)+(isToday?' (Today)':'')+'</div>';
      if (m.owner) timelineHTML += '<div class="ms-owner">'+esc(m.owner)+'</div>';
      timelineHTML += '<span class="status-badge status-'+(m.status||'').toLowerCase().replace(/\s/g,'')+'">'+esc(m.status)+'</span>';
      timelineHTML += '</div></div>';
    });
    timelineHTML += '</div>';
  }

  // Table
  var tableHTML = '';
  if (milestones.length > 0) {
    tableHTML = '<div class="table-container" style="margin-top:16px"><div class="table-scroll"><table class="rtable"><thead><tr>';
    tableHTML += '<th scope="col" onclick="msSortBy(\'id\')">ID'+arrow('id')+'</th>';
    tableHTML += '<th scope="col" onclick="msSortBy(\'title\')">Milestone'+arrow('title')+'</th>';
    tableHTML += '<th scope="col" onclick="msSortBy(\'date\')">Target Date'+arrow('date')+'</th>';
    tableHTML += '<th scope="col" onclick="msSortBy(\'status\')">Status'+arrow('status')+'</th>';
    tableHTML += '<th scope="col" onclick="msSortBy(\'owner\')">Owner'+arrow('owner')+'</th>';
    tableHTML += '<th scope="col" class="no-sort">Dependencies</th>';
    tableHTML += '<th scope="col" class="no-sort"></th></tr></thead><tbody>';
    milestones.forEach(function(m) {
      var overdue = m.date && m.date < today && m.status !== 'Complete' && m.status !== 'Missed';
      var dateStyle = overdue ? ' style="color:var(--red);font-weight:600"' : '';
      tableHTML += '<tr data-ms-id="'+m.id+'" onclick="openMilestoneDetail('+m.id+')">';
      tableHTML += '<td style="font-family:var(--font-mono);font-size:12px">'+msFmtId(m.id)+'</td>';
      tableHTML += '<td style="font-weight:500">'+esc(m.title)+'</td>';
      tableHTML += '<td'+dateStyle+'>'+fmtDateShort(m.date)+(overdue?' ⚠':'')+'</td>';
      tableHTML += '<td><span class="status-badge status-'+(m.status||'').toLowerCase().replace(/\s/g,'')+'">'+esc(m.status)+'</span></td>';
      tableHTML += '<td style="font-size:12px">'+esc(m.owner||'—')+'</td>';
      tableHTML += '<td style="font-size:11px;color:var(--text-secondary)">'+esc(m.dependencies||'—')+'</td>';
      tableHTML += '<td><button class="action-dots" onclick="event.stopPropagation();msShowCtx(event,'+m.id+')">⋮</button></td>';
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table></div></div>';
  } else {
    tableHTML = '<div class="empty-state"><div class="es-icon">◆</div><h3>No milestones yet</h3><p>Track key program milestones, gate reviews, and delivery dates.</p><button class="btn btn-sm btn-primary" style="margin-top:8px" onclick="openAddMilestoneModal()">+ Add First Milestone</button></div>';
  }

  area.innerHTML = filterBtns + timelineHTML + tableHTML;
}

function msSortBy(f) { if(msSortField===f) msSortDir*=-1; else { msSortField=f; msSortDir=1; } renderContent(); }
function msSetFilter(s) { msStatusFilter=s; renderContent(); }

function openAddMilestoneModal() {
  msEditingId = null;
  document.getElementById('milestoneModalTitle').textContent = 'New Milestone';
  document.getElementById('milestoneSaveBtn').textContent = 'Add Milestone';
  renderMilestoneModalBody({ title:'', description:'', date:'', status:'Not Started', owner:'', dependencies:'', category:'Program', linkedActionIds:'' });
  openModal('milestoneModal');
}
function openEditMilestoneModal(id) {
  var m = appState.milestones.find(function(x){return x.id===id;});
  if (!m) return;
  msEditingId = id;
  document.getElementById('milestoneModalTitle').textContent = 'Edit ' + msFmtId(id);
  document.getElementById('milestoneSaveBtn').textContent = 'Save Changes';
  renderMilestoneModalBody(m);
  openModal('milestoneModal');
}
function renderMilestoneModalBody(m) {
  var msCategories = pmdList('milestoneCategories');
  var html = '<div class="form-group"><label>Milestone Title *</label><input type="text" id="msTitle" value="'+esc(m.title)+'"></div>';
  html += '<div class="form-group"><label>Description</label><textarea id="msDesc" rows="2">'+esc(m.description||'')+'</textarea></div>';
  html += '<div class="form-row"><div class="form-group"><label>Target Date *</label><input type="date" id="msDate" value="'+(m.date||'')+'"></div><div class="form-group"><label>Status</label><select id="msStatus">'+msStatuses.map(function(s){return '<option'+(m.status===s?' selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></div></div>';
  html += '<div class="form-row"><div class="form-group"><label>Owner</label><input type="text" id="msOwner" value="'+esc(m.owner||'')+'"></div><div class="form-group"><label>Category</label><select id="msCategory">'+msCategories.map(function(c){return '<option'+((m.category||'Program')===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></div></div>';
  html += '<div class="form-group"><label>Dependencies (other milestone IDs or descriptions)</label><input type="text" id="msDeps" value="'+esc(m.dependencies||'')+'" placeholder="e.g. MS-001, Vendor delivery"></div>';
  html += '<div class="form-group"><label>Linked Action IDs (comma-separated)</label><input type="text" id="msLinkedActions" value="'+esc(m.linkedActionIds||'')+'" placeholder="e.g. AI-001, AI-005"></div>';
  document.getElementById('milestoneModalBody').innerHTML = html;
}
function saveMilestone() {
  var title = document.getElementById('msTitle').value.trim();
  if (!title) { toast('Title is required','error'); return; }
  var data = {
    title: title,
    description: document.getElementById('msDesc').value.trim(),
    date: document.getElementById('msDate').value,
    status: document.getElementById('msStatus').value,
    owner: document.getElementById('msOwner').value.trim(),
    category: document.getElementById('msCategory').value,
    dependencies: document.getElementById('msDeps').value.trim(),
    linkedActionIds: document.getElementById('msLinkedActions').value.trim(),
    updated: todayStr()
  };
  snapshotForUndo(msEditingId ? 'Edit milestone' : 'Add milestone');
  if (msEditingId) {
    var m = appState.milestones.find(function(x){return x.id===msEditingId;});
    if (m) { Object.assign(m, data); logActivity('milestones','Updated',msFmtId(msEditingId),m.title); toast(msFmtId(msEditingId)+' updated','success'); }
  } else {
    data.id = appState._msNextId++;
    data.created = todayStr();
    data.notes = [];
    appState.milestones.push(data);
    logActivity('milestones','Created',msFmtId(data.id),data.title);
    toast(msFmtId(data.id)+' added','success');
  }
  closeModal('milestoneModal'); renderContent();
}
function v95_openMilestoneDetail(id) {
  var m = appState.milestones.find(function(x){return x.id===id;});
  if (!m) return;
  var today = todayStr();
  var overdue = m.date && m.date < today && m.status !== 'Complete' && m.status !== 'Missed';
  var html = '<div class="detail-section"><h4>Milestone Details</h4>';
  html += '<div class="detail-field"><span class="field-label">ID</span><span class="field-value" style="font-family:var(--font-mono)">'+msFmtId(m.id)+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Title</span><span class="field-value" style="font-weight:600">'+esc(m.title)+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Target Date</span><span class="field-value"'+(overdue?' style="color:var(--red);font-weight:600"':'')+'>'+fmtDate(m.date)+(overdue?' ⚠ OVERDUE':'')+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Status</span><span class="status-badge status-'+(m.status||'').toLowerCase().replace(/\s/g,'')+'">'+esc(m.status)+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Owner</span><span class="field-value">'+esc(m.owner||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="field-label">Category</span><span class="field-value">'+esc(m.category||'—')+'</span></div>';
  if (m.dependencies) html += '<div class="detail-field"><span class="field-label">Dependencies</span><span class="field-value">'+esc(m.dependencies)+'</span></div>';
  html += '</div>';
  if (m.description) html += '<div class="detail-section"><h4>Description</h4><div class="detail-description">'+esc(m.description)+'</div></div>';
  // Linked actions
  if (m.linkedActionIds) {
    html += '<div class="detail-section"><h4>Linked Actions</h4>';
    m.linkedActionIds.split(',').forEach(function(ref) {
      ref = ref.trim().replace(/^AI-/i,'');
      var aid = parseInt(ref);
      if (isNaN(aid)) return;
      var a = appState.actions.find(function(x){return x.id===aid;});
      if (a) {
        html += '<div style="padding:4px 8px;margin:2px 0;background:var(--bg-primary);border-radius:var(--radius);font-size:12px;cursor:pointer" onclick="closeDetailPanel();switchModule(\'actions\');setTimeout(function(){openActionDetail('+a.id+')},100)">';
        html += '<span style="font-family:var(--font-mono);color:var(--accent)">'+actionFmtId(a.id)+'</span> '+esc(a.title)+' <span class="status-badge status-'+(a.status||'').toLowerCase().replace(/\s/g,'')+'" style="font-size:10px">'+esc(a.status)+'</span></div>';
      }
    });
    html += '</div>';
  }
  html += '<div style="margin-top:12px;display:flex;gap:6px"><button class="btn btn-sm" onclick="openEditMilestoneModal('+m.id+')">✎ Edit</button><button class="btn btn-sm" onclick="deleteMilestone('+m.id+')">✕ Delete</button></div>';
  document.getElementById('detailPanelTitle').textContent = msFmtId(m.id) + ' — ' + m.title;
  document.getElementById('detailEditBtn').onclick = function(){ openEditMilestoneModal(id); };
  document.getElementById('detailPanelBody').innerHTML = html;
  document.getElementById('detailPanel').classList.add('open');
}

function msShowCtx(e, id) {
  e.preventDefault(); e.stopPropagation();
  showContextMenu(e.clientX, e.clientY, [
    { icon:'✎', label:'Edit', action:function(){ openEditMilestoneModal(id); } },
    { separator:true },
    { icon:'✕', label:'Delete', danger:true, action:function(){ deleteMilestone(id); } }
  ]);
}
/* ═══════════════════════════════════════════════
   EVM TRACKER MODULE
   ═══════════════════════════════════════════════ */
var evmSortField='id',evmSortDir=1,evmSearchQuery='';

function evmFmtId(id){return 'WP-'+String(id).padStart(3,'0');}



function evmSort(f){if(evmSortField===f)evmSortDir*=-1;else{evmSortField=f;evmSortDir=1;}renderContent();}

function openAddEvmModal(){openEvmModal(null);}
function openEditEvmModal(id){openEvmModal(id);}





function v95_openEvmDetail(id){
  var p=appState.evmPackages.find(function(x){return x.id===id;});if(!p)return;
  var pCpi=p.ac>0?(p.ev/p.ac):0;
  var pSpi=p.pv>0?(p.ev/p.pv):0;
  var pEac=pCpi>0?(p.bac/pCpi):p.bac;
  var pCv=p.ev-p.ac;
  var pSv=p.ev-p.pv;
  var html='<div class="detail-section"><h4>EVM Metrics</h4>';
  html+='<div class="detail-field"><span class="field-label">WBS Code</span><span class="field-value" style="font-family:var(--font-mono)">'+esc(p.wbsCode||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Status</span><span class="badge-pill '+(p.status==='Complete'?'status-complete':p.status==='In Progress'?'status-inprogress':'status-open')+'">'+p.status+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">% Complete</span><span class="field-value">'+(p.pctComplete||0)+'%</span></div>';
  html+='<div class="detail-field"><span class="field-label">Owner</span><span class="field-value">'+esc(p.owner||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">BAC</span><span class="field-value bom-cost">'+fmtCurrency(p.bac)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">PV</span><span class="field-value bom-cost">'+fmtCurrency(p.pv)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">EV</span><span class="field-value bom-cost" style="color:var(--green)">'+fmtCurrency(p.ev)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">AC</span><span class="field-value bom-cost" style="color:var(--orange)">'+fmtCurrency(p.ac)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">CPI</span><span class="field-value" style="color:'+(pCpi>=1?'var(--green)':pCpi>=0.9?'var(--yellow)':'var(--red)')+'">'+pCpi.toFixed(2)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">SPI</span><span class="field-value" style="color:'+(pSpi>=1?'var(--green)':pSpi>=0.9?'var(--yellow)':'var(--red)')+'">'+pSpi.toFixed(2)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">CV</span><span class="field-value" style="color:'+(pCv>=0?'var(--green)':'var(--red)')+'">'+fmtCurrency(pCv)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">SV</span><span class="field-value" style="color:'+(pSv>=0?'var(--green)':'var(--red)')+'">'+fmtCurrency(pSv)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">EAC</span><span class="field-value bom-cost">'+fmtCurrency(pEac)+'</span></div>';
  html+='</div>';
  if(p.description)html+='<div class="detail-section"><h4>Description</h4><div class="detail-description">'+esc(p.description)+'</div></div>';
  if(p.startDate||p.endDate){html+='<div class="detail-section"><h4>Schedule</h4><div class="detail-field"><span class="field-label">Start</span><span class="field-value">'+fmtDateShort(p.startDate)+'</span></div><div class="detail-field"><span class="field-label">End</span><span class="field-value">'+fmtDateShort(p.endDate)+'</span></div></div>';}
  // Progress bar
  html+='<div class="detail-section"><h4>Progress</h4><div class="asm-bar-row"><div class="asm-bar-track"><div class="asm-bar-fill" style="width:'+Math.min(100,p.pctComplete||0)+'%;background:'+(p.pctComplete>=80?'var(--green)':p.pctComplete>=50?'var(--yellow)':'var(--red)')+'"></div></div><span style="font-size:11px;font-weight:600">'+(p.pctComplete||0)+'%</span></div></div>';
  html+='<div class="detail-section"><h4>Audit History</h4>'+renderAuditHistoryHTML('evm',id)+'</div>';
  html+='<div style="margin-top:12px;display:flex;gap:6px"><button class="btn btn-sm" onclick="openEditEvmModal('+id+')">✎ Edit</button><button class="btn btn-sm" onclick="deleteEvmPackage('+id+')">✕ Delete</button></div>';
  document.getElementById('detailPanelTitle').textContent=evmFmtId(p.id)+' — '+p.name;
  document.getElementById('detailEditBtn').onclick=function(){openEditEvmModal(id);};
  document.getElementById('detailPanelBody').innerHTML=html;
  document.getElementById('detailPanel').classList.add('open');
}



/* ═══════════════════════════════════════════════
   CHANGE CONTROL / CCB MODULE
   ═══════════════════════════════════════════════ */
var chgSortField='id',chgSortDir=-1,chgSearchQuery='',chgStatusFilter='all';

function chgFmtId(id){return 'CR-'+String(id).padStart(3,'0');}

function v95_renderChangesModule(area) {
  var items=appState.changes.slice();
  if(chgSearchQuery){var q=chgSearchQuery.toLowerCase();items=items.filter(function(c){return(c.title||'').toLowerCase().indexOf(q)>=0||(c.requestor||'').toLowerCase().indexOf(q)>=0||(c.ecpNumber||'').toLowerCase().indexOf(q)>=0;});}
  if(chgStatusFilter!=='all')items=items.filter(function(c){return c.status===chgStatusFilter;});
  items.sort(function(a,b){var av=a[chgSortField],bv=b[chgSortField];if(typeof av==='string')return chgSortDir*(av||'').localeCompare(bv||'');return chgSortDir*((av||0)-(bv||0));});

  var arrow=function(f){return chgSortField===f?(chgSortDir===1?' ▲':' ▼'):'';};

  // Summary cards
  var open=appState.changes.filter(function(c){return c.status==='Submitted'||c.status==='Under Review';}).length;
  var approved=appState.changes.filter(function(c){return c.status==='Approved';}).length;
  var rejected=appState.changes.filter(function(c){return c.status==='Rejected';}).length;
  var implemented=appState.changes.filter(function(c){return c.status==='Implemented';}).length;

  var html='<div class="stat-cards-row">';
  html+=statCard('⊗','Open CRs',open,'Submitted + Under Review','orange',null);
  html+=statCard('⊗','Approved',approved,'Pending implementation','green',null);
  html+=statCard('⊗','Rejected',rejected,'Not approved','red',null);
  html+=statCard('⊗','Implemented',implemented,'Changes deployed','blue',null);
  html+='</div>';

  // Filter bar
  html+='<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;align-items:center">';
  html+='<select class="form-control" style="width:auto;font-size:12px" onchange="chgStatusFilter=this.value;renderContent()">';
  html+='<option value="all"'+(chgStatusFilter==='all'?' selected':'')+'>All Statuses</option>';
  pmdList('changeStatuses').forEach(function(s){
    html+='<option'+(chgStatusFilter===s?' selected':'')+'>'+esc(s)+'</option>';
  });
  html+='</select>';
  html+='<button class="btn btn-sm btn-primary" style="margin-left:auto" onclick="openAddChangeModal()">+ New Change Request</button>';
  html+='</div>';

  // Table
  html+='<div class="table-container"><div class="table-header"><h3>Change Requests ('+items.length+')</h3><div class="table-filters">';
  html+='<input class="filter-input" type="text" id="chgSearchInput" placeholder="Search..." value="'+esc(chgSearchQuery)+'">';
  html+=(chgSearchQuery?'<button class="btn btn-sm" onclick="chgSearchQuery=\'\';renderContent()">✕</button>':'');
  html+='</div></div>';

  if(items.length>0){
    html+='<div class="table-scroll"><table class="rtable"><thead><tr>';
    html+='<th onclick="chgSort(\'id\')">CR ID'+arrow('id')+'</th>';
    html+='<th onclick="chgSort(\'ecpNumber\')">ECP#'+arrow('ecpNumber')+'</th>';
    html+='<th onclick="chgSort(\'title\')">Title'+arrow('title')+'</th>';
    html+='<th onclick="chgSort(\'classification\')">Class'+arrow('classification')+'</th>';
    html+='<th onclick="chgSort(\'priority\')">Priority'+arrow('priority')+'</th>';
    html+='<th onclick="chgSort(\'status\')">Status'+arrow('status')+'</th>';
    html+='<th onclick="chgSort(\'requestor\')">Requestor'+arrow('requestor')+'</th>';
    html+='<th onclick="chgSort(\'submitDate\')">Submitted'+arrow('submitDate')+'</th>';
    html+='<th>Impact</th>';
    html+='<th class="no-sort"></th>';
    html+='</tr></thead><tbody>';
    items.forEach(function(c){
      var impactBadge=c.costImpact||c.scheduleImpact?'<span style="color:var(--red);font-weight:600">$'+((c.costImpact||'')+(c.scheduleImpact?' +'+c.scheduleImpact+'d':''))+'</span>':'<span style="color:var(--text-muted)">None</span>';
      html+='<tr onclick="openChangeDetail('+c.id+')" style="cursor:pointer">';
      html+='<td style="font-family:var(--font-mono)">'+chgFmtId(c.id)+'</td>';
      html+='<td style="font-family:var(--font-mono)">'+esc(c.ecpNumber||'—')+'</td>';
      html+='<td>'+esc(c.title)+'</td>';
      html+='<td><span class="badge-pill '+(c.classification==='Class I'?'status-open':'status-inprogress')+'">'+esc(c.classification||'—')+'</span></td>';
      html+='<td>'+esc(c.priority||'—')+'</td>';
      html+='<td><span class="badge-pill status-'+((c.status||'').toLowerCase().replace(/\s/g,''))+'">'+esc(c.status)+'</span></td>';
      html+='<td>'+esc(c.requestor||'—')+'</td>';
      html+='<td>'+fmtDateShort(c.submitDate)+'</td>';
      html+='<td>'+impactBadge+'</td>';
      html+='<td><button class="btn-icon" onclick="event.stopPropagation();openEditChangeModal('+c.id+')">✎</button></td>';
      html+='</tr>';
    });
    html+='</tbody></table></div>';
  } else {
    html+='<div class="empty-state"><div class="es-icon">⊗</div><h3>No Change Requests</h3><p>Create a change request to track engineering changes through the CCB process.</p><button class="btn btn-primary" style="margin-top:8px" onclick="openAddChangeModal()">+ New Change Request</button></div>';
  }
  html+='</div>';
  area.innerHTML=html;
  var si=document.getElementById('chgSearchInput');
  if(si)si.addEventListener('input',function(){chgSearchQuery=si.value;renderContent();});
}

function chgSort(f){if(chgSortField===f)chgSortDir*=-1;else{chgSortField=f;chgSortDir=1;}renderContent();}
function openAddChangeModal(){openChangeModal(null);}
function openEditChangeModal(id){openChangeModal(id);}

function openChangeModal(editId){
  var c=editId?appState.changes.find(function(x){return x.id===editId;}):null;
  var html='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
  html+='<div><label class="form-label">ECP Number</label><input class="form-control" id="chgEcp" value="'+esc(c?c.ecpNumber:'')+'"></div>';
  html+='<div><label class="form-label">Title *</label><input class="form-control" id="chgTitle" value="'+esc(c?c.title:'')+'"></div>';
  html+='<div><label class="form-label">Classification</label><select class="form-control" id="chgClass"><option'+(c&&c.classification==='Class I'?' selected':'')+'>Class I</option><option'+(c&&c.classification==='Class II'?' selected':'')+'>Class II</option></select></div>';
  html+='<div><label class="form-label">Priority</label><select class="form-control" id="chgPriority"><option'+(c&&c.priority==='Emergency'?' selected':'')+'>Emergency</option><option'+(c&&c.priority==='Urgent'?' selected':'')+'>Urgent</option><option'+((!c||c.priority==='Routine')?' selected':'')+'>Routine</option></select></div>';
  html+='<div><label class="form-label">Status</label><select class="form-control" id="chgStatus">';
  pmdList('changeStatuses').forEach(function(s){html+='<option'+(c&&c.status===s?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Requestor</label><input class="form-control" id="chgRequestor" value="'+esc(c?c.requestor:'')+'"></div>';
  html+='<div style="grid-column:1/-1"><label class="form-label">Description</label><textarea class="form-control" id="chgDesc" rows="2">'+esc(c?c.description:'')+'</textarea></div>';
  html+='<div style="grid-column:1/-1"><label class="form-label">Justification</label><textarea class="form-control" id="chgJust" rows="2">'+esc(c?c.justification:'')+'</textarea></div>';
  html+='<div><label class="form-label">Affected CIs</label><input class="form-control" id="chgCIs" placeholder="Configuration items" value="'+esc(c?c.affectedCIs:'')+'"></div>';
  html+='<div><label class="form-label">Linked Risk ID</label><input class="form-control" id="chgRisk" placeholder="R-001" value="'+esc(c?c.linkedRiskId:'')+'"></div>';
  html+='<div><label class="form-label">Cost Impact ($)</label><input class="form-control" type="number" id="chgCost" step="0.01" value="'+(c?c.costImpact||'':'')+'"></div>';
  html+='<div><label class="form-label">Schedule Impact (days)</label><input class="form-control" type="number" id="chgSched" value="'+(c?c.scheduleImpact||'':'')+'"></div>';
  html+='<div><label class="form-label">Submit Date</label><input class="form-control" type="date" id="chgSubmitDate" value="'+(c?c.submitDate:todayStr())+'"></div>';
  html+='<div><label class="form-label">CCB Decision Date</label><input class="form-control" type="date" id="chgDecDate" value="'+(c?c.decisionDate:'')+'"></div>';
  html+='</div>';
  html+='<div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" onclick="closeConfirm()">Cancel</button><button class="btn btn-primary" onclick="saveChange('+(editId||'null')+')">Save</button></div>';
  document.getElementById('confirmTitle').textContent=(c?'Edit':'New')+' Change Request';
  document.getElementById('confirmMsg').innerHTML=html;
  document.getElementById('confirmBtn').style.display='none';
  pendingConfirmCallback=null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function saveChange(editId){
  var title=document.getElementById('chgTitle').value.trim();
  if(!title){toast('Title is required','error');return;}
  var data={
    ecpNumber:document.getElementById('chgEcp').value.trim(),
    title:title,
    classification:document.getElementById('chgClass').value,
    priority:document.getElementById('chgPriority').value,
    status:document.getElementById('chgStatus').value,
    requestor:document.getElementById('chgRequestor').value.trim(),
    description:document.getElementById('chgDesc').value.trim(),
    justification:document.getElementById('chgJust').value.trim(),
    affectedCIs:document.getElementById('chgCIs').value.trim(),
    linkedRiskId:document.getElementById('chgRisk').value.trim(),
    costImpact:pmdNumber('chgCost'),
    scheduleImpact:pmdNumber('chgSched'),
    submitDate:document.getElementById('chgSubmitDate').value,
    decisionDate:document.getElementById('chgDecDate').value,
    updatedDate:todayStr()
  };
  snapshotForUndo(editId?'Edit change request':'Add change request');
  if(editId){
    var c=appState.changes.find(function(x){return x.id===editId;});
    if(c){
      var ac=auditDiff(c,data,[{key:'title',label:'Title'},{key:'status',label:'Status'},{key:'classification',label:'Class'},{key:'priority',label:'Priority'}]);
      Object.assign(c,data);
      if(ac.length>0)auditRecord('changes',c.id,'updated',ac,c.title);
      logActivity('changes','Updated',chgFmtId(editId),c.title);
      toast(chgFmtId(editId)+' updated','success');
    }
  } else {
    data.id=appState._chgNextId++;
    data.createdDate=todayStr();
    appState.changes.push(data);
    auditRecord('changes',data.id,'created',[{field:'Title',oldVal:'',newVal:data.title}],data.title);
    logActivity('changes','Created',chgFmtId(data.id),data.title);
    toast(chgFmtId(data.id)+' created','success');
  }
  document.getElementById('confirmBtn').style.display='';
  closeConfirm();markUnsaved();renderContent();
}

function v95_openChangeDetail(id){
  var c=appState.changes.find(function(x){return x.id===id;});if(!c)return;
  var html='<div class="detail-section"><h4>Change Request Details</h4>';
  html+='<div class="detail-field"><span class="field-label">ECP Number</span><span class="field-value" style="font-family:var(--font-mono)">'+esc(c.ecpNumber||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Classification</span><span class="badge-pill '+(c.classification==='Class I'?'status-open':'status-inprogress')+'">'+esc(c.classification)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Priority</span><span class="field-value">'+esc(c.priority||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Status</span><span class="badge-pill status-'+((c.status||'').toLowerCase().replace(/\s/g,''))+'">'+esc(c.status)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Requestor</span><span class="field-value">'+esc(c.requestor||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Submitted</span><span class="field-value">'+fmtDateShort(c.submitDate)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">CCB Decision</span><span class="field-value">'+fmtDateShort(c.decisionDate)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Cost Impact</span><span class="field-value bom-cost" style="color:'+(c.costImpact>0?'var(--red)':'var(--text-primary)')+'">'+fmtCurrency(c.costImpact)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Schedule Impact</span><span class="field-value">'+(c.scheduleImpact?c.scheduleImpact+' days':'None')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Affected CIs</span><span class="field-value">'+esc(c.affectedCIs||'—')+'</span></div>';
  html+='</div>';
  if(c.description)html+='<div class="detail-section"><h4>Description</h4><div class="detail-description">'+esc(c.description)+'</div></div>';
  if(c.justification)html+='<div class="detail-section"><h4>Justification</h4><div class="detail-description">'+esc(c.justification)+'</div></div>';
  html+='<div class="detail-section"><h4>Audit History</h4>'+renderAuditHistoryHTML('changes',id)+'</div>';
  html+='<div style="margin-top:12px;display:flex;gap:6px"><button class="btn btn-sm" onclick="openEditChangeModal('+id+')">✎ Edit</button><button class="btn btn-sm" onclick="deleteChange('+id+')">✕ Delete</button></div>';
  document.getElementById('detailPanelTitle').textContent=chgFmtId(c.id)+' — '+c.title;
  document.getElementById('detailEditBtn').onclick=function(){openEditChangeModal(id);};
  document.getElementById('detailPanelBody').innerHTML=html;
  document.getElementById('detailPanel').classList.add('open');
}



/* ═══════════════════════════════════════════════
   TEST MATRIX MODULE
   ═══════════════════════════════════════════════ */
var testSortField='id',testSortDir=1,testSearchQuery='',testStatusFilter='all';

function testFmtId(id){return 'TC-'+String(id).padStart(3,'0');}

function v95_renderTestsModule(area) {
  var items=appState.tests.slice();
  if(testSearchQuery){var q=testSearchQuery.toLowerCase();items=items.filter(function(t){return(t.title||'').toLowerCase().indexOf(q)>=0||(t.reqId||'').toLowerCase().indexOf(q)>=0;});}
  if(testStatusFilter!=='all')items=items.filter(function(t){return t.result===testStatusFilter;});
  items.sort(function(a,b){var av=a[testSortField],bv=b[testSortField];if(typeof av==='string')return testSortDir*(av||'').localeCompare(bv||'');return testSortDir*((av||0)-(bv||0));});

  var arrow=function(f){return testSortField===f?(testSortDir===1?' ▲':' ▼'):'';};

  // Coverage summary
  var total=appState.tests.length;
  var passed=appState.tests.filter(function(t){return t.result==='Pass';}).length;
  var failed=appState.tests.filter(function(t){return t.result==='Fail';}).length;
  var blocked=appState.tests.filter(function(t){return t.result==='Blocked';}).length;
  var notRun=appState.tests.filter(function(t){return t.result==='Not Run';}).length;
  var pctPass=total>0?Math.round((passed/total)*100):0;

  var html='<div class="stat-cards-row">';
  html+=statCard('⊞','Total Tests',total,'Test cases defined','blue',null);
  html+=statCard('⊞','Passed',passed,pctPass+'% pass rate','green',null);
  html+=statCard('⊞','Failed',failed,'Require investigation','red',null);
  html+=statCard('⊞','Blocked',blocked,'Awaiting resolution','orange',null);
  html+=statCard('⊞','Not Run',notRun,'Pending execution','purple',null);
  html+='</div>';

  // Coverage bar
  if(total>0){
    html+='<div style="margin:12px 0"><div style="font-size:12px;font-weight:600;margin-bottom:4px">Test Coverage: '+pctPass+'% passed</div>';
    html+='<div style="display:flex;height:20px;border-radius:4px;overflow:hidden;border:1px solid var(--border)">';
    if(passed>0)html+='<div style="width:'+(passed/total*100)+'%;background:var(--green)" title="Pass: '+passed+'"></div>';
    if(failed>0)html+='<div style="width:'+(failed/total*100)+'%;background:var(--red)" title="Fail: '+failed+'"></div>';
    if(blocked>0)html+='<div style="width:'+(blocked/total*100)+'%;background:var(--orange)" title="Blocked: '+blocked+'"></div>';
    if(notRun>0)html+='<div style="width:'+(notRun/total*100)+'%;background:var(--bg-secondary)" title="Not Run: '+notRun+'"></div>';
    html+='</div></div>';
  }

  // Filter + buttons
  html+='<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;align-items:center">';
  html+='<select class="form-control" style="width:auto;font-size:12px" onchange="testStatusFilter=this.value;renderContent()">';
  html+='<option value="all"'+(testStatusFilter==='all'?' selected':'')+'>All Results</option>';
  pmdList('testResults').forEach(function(s){html+='<option'+(testStatusFilter===s?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select>';
  html+='<button class="btn btn-sm btn-primary" style="margin-left:auto" onclick="openAddTestModal()">+ Add Test Case</button>';
  html+='<button class="btn btn-sm" onclick="openQuickEntry(\'tests\')">⚡ Quick Entry</button>';
  html+='</div>';

  // Table
  html+='<div class="table-container"><div class="table-header"><h3>Test Cases ('+items.length+')</h3><div class="table-filters">';
  html+='<input class="filter-input" type="text" id="testSearchInput" placeholder="Search..." value="'+esc(testSearchQuery)+'">';
  html+=(testSearchQuery?'<button class="btn btn-sm" onclick="testSearchQuery=\'\';renderContent()">✕</button>':'');
  html+='</div></div>';

  if(items.length>0){
    html+='<div class="table-scroll"><table class="rtable"><thead><tr>';
    html+='<th onclick="testSort(\'id\')">TC ID'+arrow('id')+'</th>';
    html+='<th onclick="testSort(\'title\')">Title'+arrow('title')+'</th>';
    html+='<th onclick="testSort(\'category\')">Category'+arrow('category')+'</th>';
    html+='<th onclick="testSort(\'reqId\')">Req ID'+arrow('reqId')+'</th>';
    html+='<th onclick="testSort(\'verMethod\')">Method'+arrow('verMethod')+'</th>';
    html+='<th onclick="testSort(\'result\')">Result'+arrow('result')+'</th>';
    html+='<th onclick="testSort(\'tester\')">Tester'+arrow('tester')+'</th>';
    html+='<th onclick="testSort(\'testDate\')">Date'+arrow('testDate')+'</th>';
    html+='<th class="no-sort"></th>';
    html+='</tr></thead><tbody>';
    items.forEach(function(t){
      var rCls=t.result==='Pass'?'status-complete':t.result==='Fail'?'status-overdue':t.result==='Blocked'?'status-inprogress':'status-open';
      html+='<tr onclick="openTestDetail('+t.id+')" style="cursor:pointer">';
      html+='<td style="font-family:var(--font-mono)">'+testFmtId(t.id)+'</td>';
      html+='<td>'+esc(t.title)+'</td>';
      html+='<td>'+esc(t.category||'—')+'</td>';
      html+='<td style="font-family:var(--font-mono)">'+esc(t.reqId||'—')+'</td>';
      html+='<td>'+esc(t.verMethod||'—')+'</td>';
      html+='<td><span class="badge-pill '+rCls+'">'+esc(t.result)+'</span></td>';
      html+='<td>'+esc(t.tester||'—')+'</td>';
      html+='<td>'+fmtDateShort(t.testDate)+'</td>';
      html+='<td><button class="btn-icon" onclick="event.stopPropagation();openEditTestModal('+t.id+')">✎</button></td>';
      html+='</tr>';
    });
    html+='</tbody></table></div>';
  } else {
    html+='<div class="empty-state"><div class="es-icon">⊞</div><h3>No Test Cases</h3><p>Add test cases to track verification and validation.</p><button class="btn btn-primary" style="margin-top:8px" onclick="openAddTestModal()">+ Add Test Case</button></div>';
  }
  html+='</div>';
  area.innerHTML=html;
  var si=document.getElementById('testSearchInput');
  if(si)si.addEventListener('input',function(){testSearchQuery=si.value;renderContent();});
}

function testSort(f){if(testSortField===f)testSortDir*=-1;else{testSortField=f;testSortDir=1;}renderContent();}
function openAddTestModal(){openTestModal(null);}
function openEditTestModal(id){openTestModal(id);}

function openTestModal(editId){
  var t=editId?appState.tests.find(function(x){return x.id===editId;}):null;
  var html='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
  html+='<div><label class="form-label">Title *</label><input class="form-control" id="testTitle" value="'+esc(t?t.title:'')+'"></div>';
  html+='<div><label class="form-label">Category</label><select class="form-control" id="testCat">';
  pmdList('testCategories').forEach(function(c){html+='<option'+(t&&t.category===c?' selected':'')+'>'+esc(c)+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Requirement ID</label><input class="form-control" id="testReqId" placeholder="REQ-001" value="'+esc(t?t.reqId:'')+'"></div>';
  html+='<div><label class="form-label">Verification Method</label><select class="form-control" id="testMethod">';
  pmdList('verificationMethods').forEach(function(m){html+='<option'+(t&&t.verMethod===m?' selected':'')+'>'+m+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Result</label><select class="form-control" id="testResult">';
  pmdList('testResults').forEach(function(r){html+='<option'+(t&&t.result===r?' selected':'')+'>'+r+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Tester</label><input class="form-control" id="testTester" value="'+esc(t?t.tester:'')+'"></div>';
  html+='<div><label class="form-label">Test Date</label><input class="form-control" type="date" id="testDate" value="'+(t?t.testDate:'')+'"></div>';
  html+='<div><label class="form-label">Linked Action ID</label><input class="form-control" id="testAction" placeholder="A-001" value="'+esc(t?t.linkedActionId:'')+'"></div>';
  html+='<div style="grid-column:1/-1"><label class="form-label">Procedure</label><textarea class="form-control" id="testProc" rows="2" placeholder="Test steps...">'+esc(t?t.procedure:'')+'</textarea></div>';
  html+='<div style="grid-column:1/-1"><label class="form-label">Notes / Observations</label><textarea class="form-control" id="testNotes" rows="2">'+esc(t?t.notes:'')+'</textarea></div>';
  html+='</div>';
  html+='<div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" onclick="closeConfirm()">Cancel</button><button class="btn btn-primary" onclick="saveTest('+(editId||'null')+')">Save</button></div>';
  document.getElementById('confirmTitle').textContent=(t?'Edit':'Add')+' Test Case';
  document.getElementById('confirmMsg').innerHTML=html;
  document.getElementById('confirmBtn').style.display='none';
  pendingConfirmCallback=null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function saveTest(editId){
  var title=document.getElementById('testTitle').value.trim();
  if(!title){toast('Title is required','error');return;}
  var data={
    title:title,
    category:document.getElementById('testCat').value,
    reqId:document.getElementById('testReqId').value.trim(),
    verMethod:document.getElementById('testMethod').value,
    result:document.getElementById('testResult').value,
    tester:document.getElementById('testTester').value.trim(),
    testDate:document.getElementById('testDate').value,
    linkedActionId:document.getElementById('testAction').value.trim(),
    procedure:document.getElementById('testProc').value.trim(),
    notes:document.getElementById('testNotes').value.trim(),
    updatedDate:todayStr()
  };
  snapshotForUndo(editId?'Edit test case':'Add test case');
  if(editId){
    var t=appState.tests.find(function(x){return x.id===editId;});
    if(t){
      var ac=auditDiff(t,data,[{key:'title',label:'Title'},{key:'result',label:'Result'},{key:'category',label:'Category'},{key:'tester',label:'Tester'}]);
      Object.assign(t,data);
      if(ac.length>0)auditRecord('tests',t.id,'updated',ac,t.title);
      logActivity('tests','Updated',testFmtId(editId),t.title);
      toast(testFmtId(editId)+' updated','success');
    }
  } else {
    data.id=appState._testNextId++;
    data.createdDate=todayStr();
    appState.tests.push(data);
    auditRecord('tests',data.id,'created',[{field:'Title',oldVal:'',newVal:data.title}],data.title);
    logActivity('tests','Created',testFmtId(data.id),data.title);
    toast(testFmtId(data.id)+' added','success');
  }
  document.getElementById('confirmBtn').style.display='';
  closeConfirm();markUnsaved();renderContent();
}

function v95_openTestDetail(id){
  var t=appState.tests.find(function(x){return x.id===id;});if(!t)return;
  var rCls=t.result==='Pass'?'status-complete':t.result==='Fail'?'status-overdue':t.result==='Blocked'?'status-inprogress':'status-open';
  var html='<div class="detail-section"><h4>Test Case Details</h4>';
  html+='<div class="detail-field"><span class="field-label">Category</span><span class="field-value">'+esc(t.category||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Requirement</span><span class="field-value" style="font-family:var(--font-mono)">'+esc(t.reqId||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Verification Method</span><span class="field-value">'+esc(t.verMethod||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Result</span><span class="badge-pill '+rCls+'">'+esc(t.result)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Tester</span><span class="field-value">'+esc(t.tester||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Test Date</span><span class="field-value">'+fmtDateShort(t.testDate)+'</span></div>';
  html+='</div>';
  if(t.procedure)html+='<div class="detail-section"><h4>Procedure</h4><div class="detail-description" style="white-space:pre-wrap">'+esc(t.procedure)+'</div></div>';
  if(t.notes)html+='<div class="detail-section"><h4>Notes / Observations</h4><div class="detail-description">'+esc(t.notes)+'</div></div>';
  html+='<div class="detail-section"><h4>Audit History</h4>'+renderAuditHistoryHTML('tests',id)+'</div>';
  html+='<div style="margin-top:12px;display:flex;gap:6px"><button class="btn btn-sm" onclick="openEditTestModal('+id+')">✎ Edit</button><button class="btn btn-sm" onclick="deleteTest('+id+')">✕ Delete</button></div>';
  document.getElementById('detailPanelTitle').textContent=testFmtId(t.id)+' — '+t.title;
  document.getElementById('detailEditBtn').onclick=function(){openEditTestModal(id);};
  document.getElementById('detailPanelBody').innerHTML=html;
  document.getElementById('detailPanel').classList.add('open');
}



/* ═══════════════════════════════════════════════
   LESSONS LEARNED MODULE
   ═══════════════════════════════════════════════ */
var lesSortField='id',lesSortDir=-1,lesSearchQuery='';

function lesFmtId(id){return 'LL-'+String(id).padStart(3,'0');}

function renderLessonsModule(area) {
  var items=appState.lessons.slice();
  if(lesSearchQuery){var q=lesSearchQuery.toLowerCase();items=items.filter(function(l){return(l.title||'').toLowerCase().indexOf(q)>=0||(l.category||'').toLowerCase().indexOf(q)>=0;});}
  items.sort(function(a,b){var av=a[lesSortField],bv=b[lesSortField];if(typeof av==='string')return lesSortDir*(av||'').localeCompare(bv||'');return lesSortDir*((av||0)-(bv||0));});
  var arrow=function(f){return lesSortField===f?(lesSortDir===1?' ▲':' ▼'):'';};

  // Category breakdown
  var cats={};
  appState.lessons.forEach(function(l){var c=l.category||'Other';cats[c]=(cats[c]||0)+1;});

  var html='<div class="stat-cards-row">';
  html+=statCard('⊘','Total Lessons',appState.lessons.length,'Captured knowledge','blue',null);
  var posCount=appState.lessons.filter(function(l){return l.sentiment==='Positive';}).length;
  var negCount=appState.lessons.filter(function(l){return l.sentiment==='Negative';}).length;
  html+=statCard('⊘','Positive',posCount,'What went well','green',null);
  html+=statCard('⊘','Negative',negCount,'Areas for improvement','red',null);
  html+=statCard('⊘','Categories',Object.keys(cats).length,'Topics covered','purple',null);
  html+='</div>';

  html+='<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">';
  html+='<button class="btn btn-sm btn-primary" style="margin-left:auto" onclick="openAddLessonModal()">+ Add Lesson</button>';
  html+='</div>';

  html+='<div class="table-container"><div class="table-header"><h3>Lessons ('+items.length+')</h3><div class="table-filters">';
  html+='<input class="filter-input" type="text" id="lesSearchInput" placeholder="Search..." value="'+esc(lesSearchQuery)+'">';
  html+=(lesSearchQuery?'<button class="btn btn-sm" onclick="lesSearchQuery=\'\';renderContent()">✕</button>':'');
  html+='</div></div>';

  if(items.length>0){
    html+='<div class="table-scroll"><table class="rtable"><thead><tr>';
    html+='<th onclick="lesSort(\'id\')">ID'+arrow('id')+'</th>';
    html+='<th onclick="lesSort(\'title\')">Title'+arrow('title')+'</th>';
    html+='<th onclick="lesSort(\'category\')">Category'+arrow('category')+'</th>';
    html+='<th onclick="lesSort(\'sentiment\')">Type'+arrow('sentiment')+'</th>';
    html+='<th onclick="lesSort(\'phase\')">Phase'+arrow('phase')+'</th>';
    html+='<th onclick="lesSort(\'impact\')">Impact'+arrow('impact')+'</th>';
    html+='<th onclick="lesSort(\'createdDate\')">Date'+arrow('createdDate')+'</th>';
    html+='<th class="no-sort"></th>';
    html+='</tr></thead><tbody>';
    items.forEach(function(l){
      var sCls=l.sentiment==='Positive'?'status-complete':l.sentiment==='Negative'?'status-overdue':'status-open';
      html+='<tr onclick="openLessonDetail('+l.id+')" style="cursor:pointer">';
      html+='<td style="font-family:var(--font-mono)">'+lesFmtId(l.id)+'</td>';
      html+='<td>'+esc(l.title)+'</td>';
      html+='<td>'+esc(l.category||'—')+'</td>';
      html+='<td><span class="badge-pill '+sCls+'">'+esc(l.sentiment||'Neutral')+'</span></td>';
      html+='<td>'+esc(l.phase||'—')+'</td>';
      html+='<td>'+esc(l.impact||'—')+'</td>';
      html+='<td>'+fmtDateShort(l.createdDate)+'</td>';
      html+='<td><button class="btn-icon" onclick="event.stopPropagation();openEditLessonModal('+l.id+')">✎</button></td>';
      html+='</tr>';
    });
    html+='</tbody></table></div>';
  } else {
    html+='<div class="empty-state"><div class="es-icon">⊘</div><h3>No Lessons Learned</h3><p>Capture knowledge from successes and challenges to improve future programs.</p><button class="btn btn-primary" style="margin-top:8px" onclick="openAddLessonModal()">+ Add Lesson</button></div>';
  }
  html+='</div>';
  area.innerHTML=html;
  var si=document.getElementById('lesSearchInput');
  if(si)si.addEventListener('input',function(){lesSearchQuery=si.value;renderContent();});
}

function lesSort(f){if(lesSortField===f)lesSortDir*=-1;else{lesSortField=f;lesSortDir=1;}renderContent();}
function openAddLessonModal(){openLessonModal(null);}
function openEditLessonModal(id){openLessonModal(id);}

function openLessonModal(editId){
  var l=editId?appState.lessons.find(function(x){return x.id===editId;}):null;
  var html='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
  html+='<div style="grid-column:1/-1"><label class="form-label">Title *</label><input class="form-control" id="lesTitle" value="'+esc(l?l.title:'')+'"></div>';
  html+='<div><label class="form-label">Category</label><select class="form-control" id="lesCat">';
  pmdList('lessonCategories').forEach(function(c){html+='<option'+(l&&l.category===c?' selected':'')+'>'+esc(c)+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Sentiment</label><select class="form-control" id="lesSentiment"><option'+(l&&l.sentiment==='Positive'?' selected':'')+'>Positive</option><option'+(l&&l.sentiment==='Negative'?' selected':'')+'>Negative</option><option'+((!l||l.sentiment==='Neutral')?' selected':'')+'>Neutral</option></select></div>';
  html+='<div><label class="form-label">Program Phase</label><select class="form-control" id="lesPhase">';
  pmdList('lifecyclePhases').forEach(function(p){html+='<option'+(l&&l.phase===p?' selected':'')+'>'+p+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Impact Level</label><select class="form-control" id="lesImpact"><option'+(l&&l.impact==='High'?' selected':'')+'>High</option><option'+((!l||l.impact==='Medium')?' selected':'')+'>Medium</option><option'+(l&&l.impact==='Low'?' selected':'')+'>Low</option></select></div>';
  html+='<div style="grid-column:1/-1"><label class="form-label">Description</label><textarea class="form-control" id="lesDesc" rows="3" placeholder="What happened?">'+esc(l?l.description:'')+'</textarea></div>';
  html+='<div style="grid-column:1/-1"><label class="form-label">Recommendation</label><textarea class="form-control" id="lesRec" rows="2" placeholder="What should be done differently?">'+esc(l?l.recommendation:'')+'</textarea></div>';
  html+='<div><label class="form-label">Contributor</label><input class="form-control" id="lesContrib" value="'+esc(l?l.contributor:'')+'"></div>';
  html+='<div><label class="form-label">Linked Risk ID</label><input class="form-control" id="lesRisk" placeholder="R-001" value="'+esc(l?l.linkedRiskId:'')+'"></div>';
  html+='</div>';
  html+='<div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" onclick="closeConfirm()">Cancel</button><button class="btn btn-primary" onclick="saveLesson('+(editId||'null')+')">Save</button></div>';
  document.getElementById('confirmTitle').textContent=(l?'Edit':'Add')+' Lesson Learned';
  document.getElementById('confirmMsg').innerHTML=html;
  document.getElementById('confirmBtn').style.display='none';
  pendingConfirmCallback=null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function saveLesson(editId){
  var title=document.getElementById('lesTitle').value.trim();
  if(!title){toast('Title is required','error');return;}
  var data={
    title:title,
    category:document.getElementById('lesCat').value,
    sentiment:document.getElementById('lesSentiment').value,
    phase:document.getElementById('lesPhase').value,
    impact:document.getElementById('lesImpact').value,
    description:document.getElementById('lesDesc').value.trim(),
    recommendation:document.getElementById('lesRec').value.trim(),
    contributor:document.getElementById('lesContrib').value.trim(),
    linkedRiskId:document.getElementById('lesRisk').value.trim(),
    updatedDate:todayStr()
  };
  snapshotForUndo(editId?'Edit lesson':'Add lesson');
  if(editId){
    var l=appState.lessons.find(function(x){return x.id===editId;});
    if(l){
      var ac=auditDiff(l,data,[{key:'title',label:'Title'},{key:'category',label:'Category'},{key:'sentiment',label:'Type'},{key:'impact',label:'Impact'}]);
      Object.assign(l,data);
      if(ac.length>0)auditRecord('lessons',l.id,'updated',ac,l.title);
      logActivity('lessons','Updated',lesFmtId(editId),l.title);
      toast(lesFmtId(editId)+' updated','success');
    }
  } else {
    data.id=appState._lesNextId++;
    data.createdDate=todayStr();
    appState.lessons.push(data);
    auditRecord('lessons',data.id,'created',[{field:'Title',oldVal:'',newVal:data.title}],data.title);
    logActivity('lessons','Created',lesFmtId(data.id),data.title);
    toast(lesFmtId(data.id)+' added','success');
  }
  document.getElementById('confirmBtn').style.display='';
  closeConfirm();markUnsaved();renderContent();
}

function v95_openLessonDetail(id){
  var l=appState.lessons.find(function(x){return x.id===id;});if(!l)return;
  var sCls=l.sentiment==='Positive'?'status-complete':l.sentiment==='Negative'?'status-overdue':'status-open';
  var html='<div class="detail-section"><h4>Lesson Details</h4>';
  html+='<div class="detail-field"><span class="field-label">Category</span><span class="field-value">'+esc(l.category||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Type</span><span class="badge-pill '+sCls+'">'+esc(l.sentiment||'Neutral')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Phase</span><span class="field-value">'+esc(l.phase||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Impact</span><span class="field-value">'+esc(l.impact||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Contributor</span><span class="field-value">'+esc(l.contributor||'—')+'</span></div>';
  html+='</div>';
  if(l.description)html+='<div class="detail-section"><h4>Description</h4><div class="detail-description">'+esc(l.description)+'</div></div>';
  if(l.recommendation)html+='<div class="detail-section"><h4>Recommendation</h4><div class="detail-description">'+esc(l.recommendation)+'</div></div>';
  html+='<div class="detail-section"><h4>Audit History</h4>'+renderAuditHistoryHTML('lessons',id)+'</div>';
  html+='<div style="margin-top:12px;display:flex;gap:6px"><button class="btn btn-sm" onclick="openEditLessonModal('+id+')">✎ Edit</button><button class="btn btn-sm" onclick="deleteLesson('+id+')">✕ Delete</button></div>';
  document.getElementById('detailPanelTitle').textContent=lesFmtId(l.id)+' — '+l.title;
  document.getElementById('detailEditBtn').onclick=function(){openEditLessonModal(id);};
  document.getElementById('detailPanelBody').innerHTML=html;
  document.getElementById('detailPanel').classList.add('open');
}



/* ═══════════════════════════════════════════════
   REQUIREMENTS TRACEABILITY MODULE
   ═══════════════════════════════════════════════ */
var reqSortField='id',reqSortDir=1,reqSearchQuery='',reqStatusFilter='all';

function reqFmtId(id){return 'REQ-'+String(id).padStart(3,'0');}

function v95_renderRequirementsModule(area) {
  var items=appState.requirements.slice();
  if(reqSearchQuery){var q=reqSearchQuery.toLowerCase();items=items.filter(function(r){return(r.title||'').toLowerCase().indexOf(q)>=0||(r.reqId||'').toLowerCase().indexOf(q)>=0||(r.source||'').toLowerCase().indexOf(q)>=0;});}
  if(reqStatusFilter!=='all')items=items.filter(function(r){return r.verStatus===reqStatusFilter;});
  items.sort(function(a,b){var av=a[reqSortField],bv=b[reqSortField];if(typeof av==='string')return reqSortDir*(av||'').localeCompare(bv||'');return reqSortDir*((av||0)-(bv||0));});
  var arrow=function(f){return reqSortField===f?(reqSortDir===1?' ▲':' ▼'):'';};

  // Traceability summary
  var total=appState.requirements.length;
  var verified=appState.requirements.filter(function(r){return r.verStatus==='Verified';}).length;
  var partial=appState.requirements.filter(function(r){return r.verStatus==='Partial';}).length;
  var unverified=appState.requirements.filter(function(r){return r.verStatus==='Not Verified';}).length;
  var linked=appState.requirements.filter(function(r){return r.linkedTestId||r.linkedActionId;}).length;
  var pctVer=total>0?Math.round((verified/total)*100):0;

  var html='<div class="stat-cards-row">';
  html+=statCard('⊡','Total Reqs',total,'Requirements defined','blue',null);
  html+=statCard('⊡','Verified',verified,pctVer+'% verified','green',null);
  html+=statCard('⊡','Partial',partial,'In progress','yellow',null);
  html+=statCard('⊡','Unverified',unverified,'Awaiting verification','red',null);
  html+=statCard('⊡','Traced',linked,'Linked to tests/actions','purple',null);
  html+='</div>';

  // Coverage bar
  if(total>0){
    html+='<div style="margin:12px 0"><div style="font-size:12px;font-weight:600;margin-bottom:4px">Verification Coverage: '+pctVer+'%</div>';
    html+='<div style="display:flex;height:20px;border-radius:4px;overflow:hidden;border:1px solid var(--border)">';
    if(verified>0)html+='<div style="width:'+(verified/total*100)+'%;background:var(--green)" title="Verified: '+verified+'"></div>';
    if(partial>0)html+='<div style="width:'+(partial/total*100)+'%;background:var(--yellow)" title="Partial: '+partial+'"></div>';
    if(unverified>0)html+='<div style="width:'+(unverified/total*100)+'%;background:var(--red)" title="Not Verified: '+unverified+'"></div>';
    html+='</div></div>';
  }

  // Filters + buttons
  html+='<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;align-items:center">';
  html+='<select class="form-control" style="width:auto;font-size:12px" onchange="reqStatusFilter=this.value;renderContent()">';
  html+='<option value="all"'+(reqStatusFilter==='all'?' selected':'')+'>All Statuses</option>';
  pmdList('requirementStatuses').forEach(function(s){html+='<option'+(reqStatusFilter===s?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select>';
  html+='<button class="btn btn-sm btn-primary" style="margin-left:auto" onclick="openAddReqModal()">+ Add Requirement</button>';
  html+='<button class="btn btn-sm" onclick="openQuickEntry(\'requirements\')">⚡ Quick Entry</button>';
  html+='<button class="btn btn-sm" onclick="openReqTraceMatrix()">⊡ Trace Matrix</button>';
  html+='</div>';

  // Table
  html+='<div class="table-container"><div class="table-header"><h3>Requirements ('+items.length+')</h3><div class="table-filters">';
  html+='<input class="filter-input" type="text" id="reqSearchInput" placeholder="Search..." value="'+esc(reqSearchQuery)+'">';
  html+=(reqSearchQuery?'<button class="btn btn-sm" onclick="reqSearchQuery=\'\';renderContent()">✕</button>':'');
  html+='</div></div>';

  if(items.length>0){
    html+='<div class="table-scroll"><table class="rtable"><thead><tr>';
    html+='<th onclick="reqSort(\'id\')">ID'+arrow('id')+'</th>';
    html+='<th onclick="reqSort(\'reqId\')">Req ID'+arrow('reqId')+'</th>';
    html+='<th onclick="reqSort(\'title\')">Title'+arrow('title')+'</th>';
    html+='<th onclick="reqSort(\'type\')">Type'+arrow('type')+'</th>';
    html+='<th onclick="reqSort(\'priority\')">Priority'+arrow('priority')+'</th>';
    html+='<th onclick="reqSort(\'verMethod\')">Method'+arrow('verMethod')+'</th>';
    html+='<th onclick="reqSort(\'verStatus\')">Status'+arrow('verStatus')+'</th>';
    html+='<th>Test</th><th>Action</th>';
    html+='<th class="no-sort"></th>';
    html+='</tr></thead><tbody>';
    items.forEach(function(r){
      var vCls=r.verStatus==='Verified'?'status-complete':r.verStatus==='Partial'?'status-inprogress':r.verStatus==='Not Verified'?'status-overdue':'status-open';
      html+='<tr onclick="openReqDetail('+r.id+')" style="cursor:pointer">';
      html+='<td style="font-family:var(--font-mono)">'+reqFmtId(r.id)+'</td>';
      html+='<td style="font-family:var(--font-mono)">'+esc(r.reqId||'—')+'</td>';
      html+='<td>'+esc(r.title)+'</td>';
      html+='<td>'+esc(r.type||'—')+'</td>';
      html+='<td>'+esc(r.priority||'—')+'</td>';
      html+='<td>'+esc(r.verMethod||'—')+'</td>';
      html+='<td><span class="badge-pill '+vCls+'">'+esc(r.verStatus)+'</span></td>';
      html+='<td style="font-family:var(--font-mono);font-size:11px">'+esc(r.linkedTestId||'—')+'</td>';
      html+='<td style="font-family:var(--font-mono);font-size:11px">'+esc(r.linkedActionId||'—')+'</td>';
      html+='<td><button class="btn-icon" onclick="event.stopPropagation();openEditReqModal('+r.id+')">✎</button></td>';
      html+='</tr>';
    });
    html+='</tbody></table></div>';
  } else {
    html+='<div class="empty-state"><div class="es-icon">⊡</div><h3>No Requirements</h3><p>Add requirements to build your traceability matrix.</p><button class="btn btn-primary" style="margin-top:8px" onclick="openAddReqModal()">+ Add Requirement</button></div>';
  }
  html+='</div>';
  area.innerHTML=html;
  var si=document.getElementById('reqSearchInput');
  if(si)si.addEventListener('input',function(){reqSearchQuery=si.value;renderContent();});
}

function reqSort(f){if(reqSortField===f)reqSortDir*=-1;else{reqSortField=f;reqSortDir=1;}renderContent();}
function openAddReqModal(){openReqModal(null);}
function openEditReqModal(id){openReqModal(id);}

function openReqModal(editId){
  var r=editId?appState.requirements.find(function(x){return x.id===editId;}):null;
  var html='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
  html+='<div><label class="form-label">Requirement ID</label><input class="form-control" id="reqReqId" placeholder="SYS-001" value="'+esc(r?r.reqId:'')+'"></div>';
  html+='<div><label class="form-label">Title *</label><input class="form-control" id="reqTitle" value="'+esc(r?r.title:'')+'"></div>';
  html+='<div><label class="form-label">Type</label><select class="form-control" id="reqType">';
  pmdList('requirementCategories').forEach(function(t){html+='<option'+(r&&r.type===t?' selected':'')+'>'+t+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Priority</label><select class="form-control" id="reqPriority"><option'+(r&&r.priority==='Shall'?' selected':'')+'>Shall</option><option'+(r&&r.priority==='Should'?' selected':'')+'>Should</option><option'+(r&&r.priority==='May'?' selected':'')+'>May</option></select></div>';
  html+='<div><label class="form-label">Verification Method</label><select class="form-control" id="reqMethod">';
  pmdList('verificationMethods').forEach(function(m){html+='<option'+(r&&r.verMethod===m?' selected':'')+'>'+m+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Verification Status</label><select class="form-control" id="reqVerStatus">';
  pmdList('requirementStatuses').forEach(function(s){html+='<option'+(r&&r.verStatus===s?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select></div>';
  html+='<div><label class="form-label">Source / Parent</label><input class="form-control" id="reqSource" placeholder="Spec or parent req" value="'+esc(r?r.source:'')+'"></div>';
  html+='<div><label class="form-label">Owner</label><input class="form-control" id="reqOwner" value="'+esc(r?r.owner:'')+'"></div>';
  html+='<div><label class="form-label">Linked Test (TC-xxx)</label><input class="form-control" id="reqTest" placeholder="TC-001" value="'+esc(r?r.linkedTestId:'')+'"></div>';
  html+='<div><label class="form-label">Linked Action (A-xxx)</label><input class="form-control" id="reqAction" placeholder="A-001" value="'+esc(r?r.linkedActionId:'')+'"></div>';
  html+='<div><label class="form-label">Linked Risk (R-xxx)</label><input class="form-control" id="reqRisk" placeholder="R-001" value="'+esc(r?r.linkedRiskId:'')+'"></div>';
  html+='<div><label class="form-label">Allocation</label><input class="form-control" id="reqAlloc" placeholder="HW/SW/System" value="'+esc(r?r.allocation:'')+'"></div>';
  html+='<div style="grid-column:1/-1"><label class="form-label">Description</label><textarea class="form-control" id="reqDesc" rows="2">'+esc(r?r.description:'')+'</textarea></div>';
  html+='<div style="grid-column:1/-1"><label class="form-label">Rationale</label><textarea class="form-control" id="reqRationale" rows="2">'+esc(r?r.rationale:'')+'</textarea></div>';
  html+='</div>';
  html+='<div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" onclick="closeConfirm()">Cancel</button><button class="btn btn-primary" onclick="saveReq('+(editId||'null')+')">Save</button></div>';
  document.getElementById('confirmTitle').textContent=(r?'Edit':'Add')+' Requirement';
  document.getElementById('confirmMsg').innerHTML=html;
  document.getElementById('confirmBtn').style.display='none';
  pendingConfirmCallback=null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function saveReq(editId){
  var title=document.getElementById('reqTitle').value.trim();
  if(!title){toast('Title is required','error');return;}
  var data={
    reqId:document.getElementById('reqReqId').value.trim(),
    title:title,
    type:document.getElementById('reqType').value,
    priority:document.getElementById('reqPriority').value,
    verMethod:document.getElementById('reqMethod').value,
    verStatus:document.getElementById('reqVerStatus').value,
    source:document.getElementById('reqSource').value.trim(),
    owner:document.getElementById('reqOwner').value.trim(),
    linkedTestId:document.getElementById('reqTest').value.trim(),
    linkedActionId:document.getElementById('reqAction').value.trim(),
    linkedRiskId:document.getElementById('reqRisk').value.trim(),
    allocation:document.getElementById('reqAlloc').value.trim(),
    description:document.getElementById('reqDesc').value.trim(),
    rationale:document.getElementById('reqRationale').value.trim(),
    updatedDate:todayStr()
  };
  snapshotForUndo(editId?'Edit requirement':'Add requirement');
  if(editId){
    var r=appState.requirements.find(function(x){return x.id===editId;});
    if(r){
      var ac=auditDiff(r,data,[{key:'title',label:'Title'},{key:'verStatus',label:'Status'},{key:'type',label:'Type'},{key:'priority',label:'Priority'}]);
      Object.assign(r,data);
      if(ac.length>0)auditRecord('requirements',r.id,'updated',ac,r.title);
      logActivity('requirements','Updated',reqFmtId(editId),r.title);
      toast(reqFmtId(editId)+' updated','success');
    }
  } else {
    data.id=appState._reqNextId++;
    data.createdDate=todayStr();
    appState.requirements.push(data);
    auditRecord('requirements',data.id,'created',[{field:'Title',oldVal:'',newVal:data.title}],data.title);
    logActivity('requirements','Created',reqFmtId(data.id),data.title);
    toast(reqFmtId(data.id)+' added','success');
  }
  document.getElementById('confirmBtn').style.display='';
  closeConfirm();markUnsaved();renderContent();
}

function v95_openReqDetail(id){
  var r=appState.requirements.find(function(x){return x.id===id;});if(!r)return;
  var vCls=r.verStatus==='Verified'?'status-complete':r.verStatus==='Partial'?'status-inprogress':r.verStatus==='Not Verified'?'status-overdue':'status-open';
  var html='<div class="detail-section"><h4>Requirement Details</h4>';
  html+='<div class="detail-field"><span class="field-label">Req ID</span><span class="field-value" style="font-family:var(--font-mono)">'+esc(r.reqId||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Type</span><span class="field-value">'+esc(r.type||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Priority</span><span class="field-value">'+esc(r.priority||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Verification Method</span><span class="field-value">'+esc(r.verMethod||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Verification Status</span><span class="badge-pill '+vCls+'">'+esc(r.verStatus)+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Source / Parent</span><span class="field-value">'+esc(r.source||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Allocation</span><span class="field-value">'+esc(r.allocation||'—')+'</span></div>';
  html+='<div class="detail-field"><span class="field-label">Owner</span><span class="field-value">'+esc(r.owner||'—')+'</span></div>';
  html+='</div>';
  // Linked items
  var links=[];
  if(r.linkedTestId){var tid=r.linkedTestId.replace(/^TC-/i,'');var tc=appState.tests.find(function(t){return t.id===parseInt(tid);});if(tc)links.push({label:testFmtId(tc.id)+' '+tc.title,mod:'tests',id:tc.id});}
  if(r.linkedActionId){var aid=r.linkedActionId.replace(/^A-/i,'');var ac=appState.actions.find(function(a){return a.id===parseInt(aid);});if(ac)links.push({label:actionFmtId(ac.id)+' '+ac.title,mod:'actions',id:ac.id});}
  if(r.linkedRiskId){var rid=r.linkedRiskId.replace(/^R-/i,'');var rk=appState.risks.find(function(x){return x.id===parseInt(rid);});if(rk)links.push({label:riskFmtId(rk.id)+' '+rk.title,mod:'risks',id:rk.id});}
  if(links.length>0){
    html+='<div class="detail-section"><h4>Linked Items</h4>';
    links.forEach(function(lk){
      html+='<div style="padding:4px 8px;margin:2px 0;background:var(--bg-primary);border-radius:var(--radius);font-size:12px;cursor:pointer" onclick="closeDetailPanel();switchModule(\''+lk.mod+'\')"><span style="font-family:var(--font-mono);color:var(--accent)">'+esc(lk.label)+'</span></div>';
    });
    html+='</div>';
  }
  if(r.description)html+='<div class="detail-section"><h4>Description</h4><div class="detail-description">'+esc(r.description)+'</div></div>';
  if(r.rationale)html+='<div class="detail-section"><h4>Rationale</h4><div class="detail-description">'+esc(r.rationale)+'</div></div>';
  html+='<div class="detail-section"><h4>Audit History</h4>'+renderAuditHistoryHTML('requirements',id)+'</div>';
  html+='<div style="margin-top:12px;display:flex;gap:6px"><button class="btn btn-sm" onclick="openEditReqModal('+id+')">✎ Edit</button><button class="btn btn-sm" onclick="deleteReq('+id+')">✕ Delete</button></div>';
  document.getElementById('detailPanelTitle').textContent=reqFmtId(r.id)+' — '+r.title;
  document.getElementById('detailEditBtn').onclick=function(){openEditReqModal(id);};
  document.getElementById('detailPanelBody').innerHTML=html;
  document.getElementById('detailPanel').classList.add('open');
}





/* ═══════════════════════════════════════════════
   VIRTUAL SCROLL + DRY TABLE UTILITIES
   ═══════════════════════════════════════════════ */
var VIRTUAL_SCROLL_THRESHOLD=100; // Only virtualize tables with 100+ rows
var _vsState={};

function buildSortableTable(opts){
  // DRY table builder: opts = {columns:[{k,l,fmt}], rows:[], sortField, sortDir, sortFn, emptyMsg, rowBuilder}
  var html='<div class="table-wrapper"><table class="data-table"><thead><tr>';
  opts.columns.forEach(function(c){
    if(c.sortable===false){html+='<th>'+c.l+'</th>';return;}
    html+='<th class="sortable" onclick="'+opts.sortFn+'(\''+c.k+'\')">'+c.l+((opts.sortField===c.k)?(opts.sortDir==='asc'?' ^':' v'):'')+'</th>';
  });
  html+='</tr></thead><tbody>';
  var rows=opts.rows;
  if(rows.length===0){
    html+='<tr><td colspan="'+opts.columns.length+'" style="text-align:center;padding:2rem;color:var(--text-muted)">'+(opts.emptyMsg||'No items found')+'</td></tr>';
  } else if(rows.length>VIRTUAL_SCROLL_THRESHOLD){
    // Virtual scroll: render only first 50, add load-more button
    var visible=Math.min(rows.length,opts._vsLimit||50);
    for(var i=0;i<visible;i++){html+=opts.rowBuilder(rows[i]);}
    if(visible<rows.length){
      html+='<tr><td colspan="'+opts.columns.length+'" style="text-align:center;padding:12px"><button class="btn btn-sm" onclick="this.closest(\'tbody\').parentElement.setAttribute(\'data-show-all\',\'1\');renderContent();">Show all '+rows.length+' rows ('+( rows.length-visible)+' more)</button></td></tr>';
    }
  } else {
    rows.forEach(function(r){html+=opts.rowBuilder(r);});
  }
  html+='</tbody></table></div>';
  return html;
}

function buildFilterBar(opts){
  // DRY filter bar: opts = {searchVal, searchPlaceholder, onSearch, filters:[{value, options:[], onChange, label}]}
  var html='<div class="filter-bar"><input type="text" class="search-input" placeholder="'+(opts.searchPlaceholder||'Search...')+'" value="'+esc(opts.searchVal||'')+'" oninput="'+opts.onSearch+'">';
  (opts.filters||[]).forEach(function(f){
    html+='<select class="filter-select" onchange="'+f.onChange+'"><option value="">'+(f.label||'All')+'</option>';
    f.options.forEach(function(o){html+='<option value="'+o+'"'+(o===f.value?' selected':'')+'>'+o+'</option>';});
    html+='</select>';
  });
  html+='</div>';
  return html;
}

function buildKpiRow(cards){
  // DRY KPI row: cards = [{value, label, color, style}]
  var html='<div class="kpi-row">';
  cards.forEach(function(c){
    var s=c.color?'color:'+c.color:'';
    if(c.style)s+=(s?';':'')+c.style;
    html+='<div class="kpi-card"><div class="kpi-value"'+(s?' style="'+s+'"':'')+'>'+c.value+'</div><div class="kpi-label">'+c.label+'</div></div>';
  });
  html+='</div>';
  return html;
}

/* ═══════════════════════════════════════════════
   CROSS-MODULE DEEP LINKING
   ═══════════════════════════════════════════════ */




function renderLinkedRef(refStr){
  var parsed=parseLinkedId(refStr);
  if(!parsed)return esc(refStr||'--');
  return '<a href="#" onclick="navigateToItem(\''+parsed.module+'\','+parsed.id+');return false;" style="text-decoration:underline;cursor:pointer">'+esc(refStr)+'</a>';
}

/* ═══════════════════════════════════════════════
   TPM (TECHNICAL PERFORMANCE MEASURES)
   ═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   CASCADE ANALYSIS & HEALTH SCORE
   ═══════════════════════════════════════════════ */




/* ═══════════════════════════════════════════════
   COST TRACKER MODULE (WBS-based)
   ═══════════════════════════════════════════════ */
var _costSortField='wbsCode',_costSortDir='asc',_costSearch='',_costCatFilter='';
function costFmtId(id){return 'CST-'+String(id).padStart(3,'0');}

function v95_renderCostTrackerModule(area){
  var items=appState.costItems||[];
  var filtered=items.filter(function(c){
    if(_costCatFilter&&c.category!==_costCatFilter)return false;
    if(_costSearch){var q=_costSearch.toLowerCase();return (c.title||'').toLowerCase().indexOf(q)>=0||(c.wbsCode||'').toLowerCase().indexOf(q)>=0||(c.owner||'').toLowerCase().indexOf(q)>=0;}
    return true;
  });
  filtered.sort(function(a,b){var av=a[_costSortField],bv=b[_costSortField];if(typeof av==='number'&&typeof bv==='number')return _costSortDir==='asc'?av-bv:bv-av;if(typeof av==='string')av=av.toLowerCase();if(typeof bv==='string')bv=bv.toLowerCase();if(av<bv)return _costSortDir==='asc'?-1:1;if(av>bv)return _costSortDir==='asc'?1:-1;return 0;});

  var categories=pmdList('costCategories');
  var totalBudget=0,totalActual=0,totalCommitted=0,totalETC=0;
  items.forEach(function(c){totalBudget+=c.budget||0;totalActual+=c.actual||0;totalCommitted+=c.committed||0;totalETC+=c.etc||0;});
  var variance=totalBudget-totalActual-totalCommitted;
  var pctSpent=totalBudget>0?Math.round((totalActual/totalBudget)*100):0;

  var html='<div class="module-header"><h2>Cost Tracker</h2><button class="btn btn-primary" onclick="openCostModal()">+ New Cost Item</button></div>';
  html+='<div class="kpi-row"><div class="kpi-card"><div class="kpi-value">$'+fmtCost(totalBudget)+'</div><div class="kpi-label">Total Budget</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--warning)">$'+fmtCost(totalActual)+'</div><div class="kpi-label">Actual ('+pctSpent+'%)</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--info)">$'+fmtCost(totalCommitted)+'</div><div class="kpi-label">Committed</div></div>';
  var vc=variance>=0?'var(--success)':'var(--danger)';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:'+vc+'">$'+fmtCost(Math.abs(variance))+'</div><div class="kpi-label">Variance '+(variance>=0?'(Under)':'(Over)')+'</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value">$'+fmtCost(totalETC)+'</div><div class="kpi-label">ETC</div></div></div>';

  // Cost breakdown by category bar chart
  html+='<div style="background:var(--bg-secondary);border-radius:var(--radius);padding:12px;margin-bottom:16px"><div style="font-weight:600;margin-bottom:8px">Budget by Category</div>';
  var catTotals={};categories.forEach(function(cat){catTotals[cat]=0;});
  items.forEach(function(c){if(catTotals[c.category]!==undefined)catTotals[c.category]+=c.budget||0;});
  var maxCat=0;categories.forEach(function(cat){if(catTotals[cat]>maxCat)maxCat=catTotals[cat];});
  if(maxCat<1)maxCat=1;
  categories.forEach(function(cat){
    if(catTotals[cat]===0)return;
    var pct=Math.max((catTotals[cat]/maxCat)*100,2);
    html+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:12px"><span style="width:90px;text-align:right">'+cat+'</span><div style="flex:1;background:var(--bg-primary);border-radius:4px;height:16px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--accent);border-radius:4px;display:flex;align-items:center;padding-left:4px;color:#fff;font-size:10px;min-width:40px">$'+fmtCost(catTotals[cat])+'</div></div></div>';
  });
  html+='</div>';

  html+='<div class="filter-bar"><input type="text" class="search-input" placeholder="Search cost items..." value="'+esc(_costSearch)+'" oninput="_costSearch=this.value;renderContent();">';
  html+='<select class="filter-select" onchange="_costCatFilter=this.value;renderContent();"><option value="">All Categories</option>';
  categories.forEach(function(c){html+='<option value="'+c+'"'+(c===_costCatFilter?' selected':'')+'>'+esc(c)+'</option>';});
  html+='</select></div>';

  html+='<div class="table-wrapper"><table class="data-table"><thead><tr>';
  var cols=[{k:'wbsCode',l:'WBS'},{k:'title',l:'Title'},{k:'category',l:'Category'},{k:'budget',l:'Budget'},{k:'actual',l:'Actual'},{k:'committed',l:'Committed'},{k:'etc',l:'ETC'},{k:'owner',l:'Owner'}];
  cols.forEach(function(c){html+='<th class="sortable" onclick="costSort(\''+c.k+'\')">'+c.l+((_costSortField===c.k)?(_costSortDir==='asc'?' ^':' v'):'')+'</th>';});
  html+='<th>Var</th><th>Actions</th></tr></thead><tbody>';

  if(filtered.length===0){html+='<tr><td colspan="10" style="text-align:center;padding:2rem;color:var(--text-muted)">No cost items found</td></tr>';}
  filtered.forEach(function(c){
    var v=(c.budget||0)-(c.actual||0)-(c.committed||0);
    var vc2=v>=0?'color:var(--success)':'color:var(--danger);font-weight:700';
    html+='<tr><td style="font-family:var(--font-mono)">'+esc(c.wbsCode||'')+'</td>';
    html+='<td><a href="#" onclick="openCostDetail('+c.id+');return false;">'+esc(c.title)+'</a></td>';
    html+='<td>'+esc(c.category||'')+'</td>';
    html+='<td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(c.budget||0)+'</td>';
    html+='<td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(c.actual||0)+'</td>';
    html+='<td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(c.committed||0)+'</td>';
    html+='<td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(c.etc||0)+'</td>';
    html+='<td>'+esc(c.owner||'')+'</td>';
    html+='<td style="text-align:right;font-family:var(--font-mono);'+vc2+'">'+( v>=0?'+':'')+fmtCost(v)+'</td>';
    html+='<td><button class="btn btn-sm" onclick="openCostModal('+c.id+')">Edit</button> <button class="btn btn-sm btn-danger" onclick="deleteCost('+c.id+')">Del</button></td></tr>';
  });
  html+='</tbody></table></div>';

  // WBS rollup summary
  if(items.length>1){
    html+='<div style="background:var(--bg-secondary);border-radius:var(--radius);padding:12px;margin-top:16px"><div style="font-weight:600;margin-bottom:8px">WBS Rollup Summary</div>';
    var wbsMap={};
    items.forEach(function(c){
      var parts=(c.wbsCode||'').split('.');
      var top=parts[0]||(c.wbsCode||'Unassigned');
      if(!wbsMap[top])wbsMap[top]={budget:0,actual:0,committed:0,count:0};
      wbsMap[top].budget+=c.budget||0;wbsMap[top].actual+=c.actual||0;wbsMap[top].committed+=c.committed||0;wbsMap[top].count++;
    });
    html+='<table class="data-table" style="font-size:12px"><thead><tr><th>WBS L1</th><th style="text-align:right">Budget</th><th style="text-align:right">Actual</th><th style="text-align:right">Committed</th><th style="text-align:right">Variance</th><th>Items</th></tr></thead><tbody>';
    Object.keys(wbsMap).sort().forEach(function(k){
      var w=wbsMap[k];var v2=w.budget-w.actual-w.committed;var vc3=v2>=0?'color:var(--success)':'color:var(--danger)';
      html+='<tr><td style="font-family:var(--font-mono);font-weight:600">'+esc(k)+'</td><td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(w.budget)+'</td><td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(w.actual)+'</td><td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(w.committed)+'</td><td style="text-align:right;font-family:var(--font-mono);'+vc3+'">'+(v2>=0?'+':'')+fmtCost(v2)+'</td><td>'+w.count+'</td></tr>';
    });
    html+='</tbody></table></div>';
  }
  area.innerHTML=html;
}



function costSort(field){if(_costSortField===field)_costSortDir=_costSortDir==='asc'?'desc':'asc';else{_costSortField=field;_costSortDir='asc';}renderContent();}

function openCostModal(editId){
  var c=editId?appState.costItems.find(function(x){return x.id===editId;}):null;
  var title=c?'Edit Cost Item':'New Cost Item';
  var categories=pmdList('costCategories');

  var html='<div style="max-height:60vh;overflow-y:auto;padding:0.5rem;">';
  html+='<label>Work / WBS code (optional)</label><input id="costWbs" class="form-input" value="'+esc(c?c.wbsCode:'')+'" placeholder="1.2.3">';
  html+='<label>Title *</label><input id="costTitle" class="form-input" value="'+esc(c?c.title:'')+'">';
  html+='<label>Category</label><select id="costCategory" class="form-input">';
  categories.forEach(function(cat){html+='<option'+(c&&c.category===cat?' selected':'')+'>'+esc(cat)+'</option>';});
  html+='</select>';
  html+='<label>Budget ($)</label><input id="costBudget" class="form-input" type="number" step="0.01" value="'+(c?c.budget||0:0)+'">';
  html+='<label>Actual ($)</label><input id="costActual" class="form-input" type="number" step="0.01" value="'+(c?c.actual||0:0)+'">';
  html+='<label>Committed ($)</label><input id="costCommitted" class="form-input" type="number" step="0.01" value="'+(c?c.committed||0:0)+'">';
  html+='<label>ETC ($)</label><input id="costETC" class="form-input" type="number" step="0.01" value="'+(c?c.etc||0:0)+'">';
  html+='<label>Owner</label><input id="costOwner" class="form-input" value="'+esc(c?c.owner:'')+'">';
  html+='<label>Period</label><input id="costPeriod" class="form-input" value="'+esc(c?c.period:'')+'" placeholder="Optional reporting period">';
  html+='<label>Linked EVM Package</label><input id="costLinkedEvm" class="form-input" value="'+esc(c?c.linkedEvm:'')+'" placeholder="WP-001">';
  html+='<label>Notes</label><textarea id="costNotes" class="form-input" rows="2">'+esc(c?c.notes:'')+'</textarea>';
  html+='<div style="margin-top:1rem;text-align:right;"><button class="btn btn-primary" onclick="saveCost('+(c?c.id:'null')+')">Save</button> <button class="btn" onclick="closeConfirm()">Cancel</button></div></div>';

  document.getElementById('confirmTitle').textContent=title;
  document.getElementById('confirmMsg').innerHTML=html;
  document.getElementById('confirmBtn').style.display='none';
  pendingConfirmCallback=null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function saveCost(editId){
  var wbs=(document.getElementById('costWbs')||{}).value||'';
  var titleVal=(document.getElementById('costTitle')||{}).value||'';
  if(!titleVal.trim()){toast('Title is required','error');return;}
  var data={
    wbsCode:wbs.trim(),
    title:titleVal.trim(),
    category:(document.getElementById('costCategory')||{}).value||'Labor',
    budget:pmdNumber('costBudget'),
    actual:pmdNumber('costActual'),
    committed:pmdNumber('costCommitted'),
    etc:pmdNumber('costETC'),
    owner:(document.getElementById('costOwner')||{}).value||'',
    period:(document.getElementById('costPeriod')||{}).value||'',
    linkedEvm:(document.getElementById('costLinkedEvm')||{}).value||'',
    notes:(document.getElementById('costNotes')||{}).value||''
  };
  if(editId!==null){
    var c=appState.costItems.find(function(x){return x.id===editId;});
    if(!c){toast('Cost item not found','error');return;}
    var diffs=[];
    Object.keys(data).forEach(function(k){if(String(c[k]||'')!==String(data[k]||''))diffs.push({field:k,oldVal:String(c[k]||''),newVal:String(data[k])});});
    Object.keys(data).forEach(function(k){c[k]=data[k];});
    c.updatedDate=todayStr();
    auditRecord('costTracker',c.id,'edited',diffs,c.title);
    logActivity('Cost','Updated',costFmtId(c.id),c.title);
    toast('Cost item updated','success');
  }else{
    data.id=appState._costNextId++;
    data.createdDate=todayStr();data.updatedDate=todayStr();
    appState.costItems.push(data);
    auditRecord('costTracker',data.id,'created',[{field:'Title',oldVal:'',newVal:data.title}],data.title);
    logActivity('Cost','Created',costFmtId(data.id),data.title);
    toast('Cost item created','success');
  }
  markUnsaved();closeConfirm();renderContent();
}

function v95_openCostDetail(id){
  var c=appState.costItems.find(function(x){return x.id===id;});
  if(!c)return;
  var v=(c.budget||0)-(c.actual||0)-(c.committed||0);
  var vc=v>=0?'color:var(--success)':'color:var(--danger)';
  var html='<div class="detail-grid">';
  html+='<div class="detail-field"><span class="detail-label">ID</span><span>'+costFmtId(c.id)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">WBS</span><span style="font-family:var(--font-mono)">'+esc(c.wbsCode)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Title</span><span>'+esc(c.title)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Category</span><span>'+esc(c.category||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Budget</span><span style="font-family:var(--font-mono)">$'+fmtCost(c.budget||0)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Actual</span><span style="font-family:var(--font-mono)">$'+fmtCost(c.actual||0)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Committed</span><span style="font-family:var(--font-mono)">$'+fmtCost(c.committed||0)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">ETC</span><span style="font-family:var(--font-mono)">$'+fmtCost(c.etc||0)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Variance</span><span style="font-family:var(--font-mono);'+vc+'">'+(v>=0?'+$':'-$')+fmtCost(Math.abs(v))+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Owner</span><span>'+esc(c.owner||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Period</span><span>'+esc(c.period||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Linked EVM</span><span>'+renderLinkedRef(c.linkedEvm)+'</span></div>';
  html+='</div>';
  if(c.notes){html+='<div style="margin-top:1rem;"><strong>Notes:</strong><p style="margin:0.25rem 0">'+esc(c.notes)+'</p></div>';}
  html+=renderAuditHistoryHTML('costTracker',c.id);
  openDetailPanel(c.title+' ('+costFmtId(c.id)+')',html,function(){closeDetailPanel();openCostModal(id);});
}



/* ═══════════════════════════════════════════════
   ANALYSIS AND TRADE STUDIES MODULE
   ═══════════════════════════════════════════════ */
var _trdSortField='id',_trdSortDir='asc',_trdSearch='',_trdStatusFilter='';
function trdFmtId(id){return 'TRD-'+String(id).padStart(3,'0');}

function renderTradeStudiesModule(area){
  var items=appState.tradeStudies||[];
  var filtered=items.filter(function(t){
    if(_trdStatusFilter&&t.status!==_trdStatusFilter)return false;
    if(_trdSearch){var q=_trdSearch.toLowerCase();return (t.title||'').toLowerCase().indexOf(q)>=0||(t.studyId||'').toLowerCase().indexOf(q)>=0||(t.lead||'').toLowerCase().indexOf(q)>=0;}
    return true;
  });
  filtered.sort(function(a,b){var av=a[_trdSortField],bv=b[_trdSortField];if(typeof av==='string')av=av.toLowerCase();if(typeof bv==='string')bv=bv.toLowerCase();if(av<bv)return _trdSortDir==='asc'?-1:1;if(av>bv)return _trdSortDir==='asc'?1:-1;return 0;});

  var statuses=pmdList('tradeStatuses');
  var total=items.length,open=0,inProg=0,completed=0;
  items.forEach(function(t){if(t.status==='Open')open++;else if(t.status==='In Progress')inProg++;else if(t.status==='Completed')completed++;});

  var html='<div class="module-header"><h2>Analysis and Trade Studies</h2><button class="btn btn-primary" onclick="openTradeModal()">+ New Study</button></div>';
  html+='<div class="kpi-row"><div class="kpi-card"><div class="kpi-value">'+total+'</div><div class="kpi-label">Total Studies</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--info)">'+open+'</div><div class="kpi-label">Open</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--warning)">'+inProg+'</div><div class="kpi-label">In Progress</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--success)">'+completed+'</div><div class="kpi-label">Completed</div></div></div>';

  html+='<div class="filter-bar"><input type="text" class="search-input" placeholder="Search studies..." value="'+esc(_trdSearch)+'" oninput="_trdSearch=this.value;renderContent();">';
  html+='<select class="filter-select" onchange="_trdStatusFilter=this.value;renderContent();"><option value="">All Statuses</option>';
  statuses.forEach(function(s){html+='<option value="'+s+'"'+(s===_trdStatusFilter?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select></div>';

  html+='<div class="table-wrapper"><table class="data-table"><thead><tr>';
  var cols=[{k:'id',l:'ID'},{k:'studyId',l:'Study #'},{k:'title',l:'Title'},{k:'category',l:'Category'},{k:'status',l:'Status'},{k:'lead',l:'Lead'},{k:'decision',l:'Decision'},{k:'dueDate',l:'Due Date'}];
  cols.forEach(function(c){html+='<th class="sortable" onclick="trdSort(\''+c.k+'\')">'+c.l+((_trdSortField===c.k)?(_trdSortDir==='asc'?' ^':' v'):'')+'</th>';});
  html+='<th>Actions</th></tr></thead><tbody>';

  if(filtered.length===0){html+='<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-muted)">No analysis/trade studies found</td></tr>';}
  filtered.forEach(function(t){
    var sc=t.status==='Completed'?'color:var(--success)':t.status==='In Progress'?'color:var(--warning)':t.status==='Cancelled'?'color:var(--danger)':'';
    html+='<tr><td>'+trdFmtId(t.id)+'</td><td>'+esc(t.studyId||'')+'</td><td><a href="#" onclick="openTradeDetail('+t.id+');return false;">'+esc(t.title)+'</a></td>';
    html+='<td>'+esc(t.category||'')+'</td><td><span style="'+sc+'">'+esc(t.status)+'</span></td>';
    html+='<td>'+esc(t.lead||'')+'</td><td>'+esc(t.decision||'--')+'</td><td>'+esc(t.dueDate||'--')+'</td>';
    html+='<td><button class="btn btn-sm" onclick="openTradeModal('+t.id+')">Edit</button> <button class="btn btn-sm btn-danger" onclick="deleteTrade('+t.id+')">Del</button></td></tr>';
  });
  html+='</tbody></table></div>';
  area.innerHTML=html;
}

function trdSort(field){if(_trdSortField===field)_trdSortDir=_trdSortDir==='asc'?'desc':'asc';else{_trdSortField=field;_trdSortDir='asc';}renderContent();}

function openTradeModal(editId){
  var t=editId?appState.tradeStudies.find(function(x){return x.id===editId;}):null;
  var title=t?'Edit Analysis/Trade Study':'New Analysis/Trade Study';
  var categories=pmdList('tradeCategories');
  var statuses=pmdList('tradeStatuses');

  var html='<div style="max-height:60vh;overflow-y:auto;padding:0.5rem;">';
  html+='<label>Study ID</label><input id="trdStudyId" class="form-input" value="'+esc(t?t.studyId:'')+'" placeholder="TS-001">';
  html+='<label>Title *</label><input id="trdTitle" class="form-input" value="'+esc(t?t.title:'')+'">';
  html+='<label>Category</label><select id="trdCategory" class="form-input">';
  categories.forEach(function(c){html+='<option'+(t&&t.category===c?' selected':'')+'>'+esc(c)+'</option>';});
  html+='</select>';
  html+='<label>Status</label><select id="trdStatus" class="form-input">';
  statuses.forEach(function(s){html+='<option'+(t&&t.status===s?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select>';
  html+='<label>Lead</label><input id="trdLead" class="form-input" value="'+esc(t?t.lead:'')+'">';
  html+='<label>Due Date</label><input id="trdDue" class="form-input" type="date" value="'+esc(t?t.dueDate:'')+'">';
  html+='<label>Alternatives (one per line)</label><textarea id="trdAlternatives" class="form-input" rows="4" placeholder="Option A: ...\nOption B: ...\nOption C: ...">'+esc(t?t.alternatives:'')+'</textarea>';
  html+='<label>Evaluation Criteria</label><textarea id="trdCriteria" class="form-input" rows="3" placeholder="Weight, cost, reliability, etc.">'+esc(t?t.criteria:'')+'</textarea>';
  html+='<label>Decision / Recommendation</label><textarea id="trdDecision" class="form-input" rows="3">'+esc(t?t.decision:'')+'</textarea>';
  html+='<label>Rationale</label><textarea id="trdRationale" class="form-input" rows="3">'+esc(t?t.rationale:'')+'</textarea>';
  html+='<label>Linked Requirement</label><input id="trdLinkedReq" class="form-input" value="'+esc(t?t.linkedReq:'')+'" placeholder="REQ-001">';
  html+='<label>Linked Risk</label><input id="trdLinkedRisk" class="form-input" value="'+esc(t?t.linkedRisk:'')+'" placeholder="RSK-001">';
  html+='<label>Notes</label><textarea id="trdNotes" class="form-input" rows="2">'+esc(t?t.notes:'')+'</textarea>';
  html+='<div style="margin-top:1rem;text-align:right;"><button class="btn btn-primary" onclick="saveTrade('+( t?t.id:'null')+')">Save</button> <button class="btn" onclick="closeConfirm()">Cancel</button></div></div>';

  document.getElementById('confirmTitle').textContent=title;
  document.getElementById('confirmMsg').innerHTML=html;
  document.getElementById('confirmBtn').style.display='none';
  pendingConfirmCallback=null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function saveTrade(editId){
  var titleVal=(document.getElementById('trdTitle')||{}).value||'';
  if(!titleVal.trim()){toast('Title is required','error');return;}
  var data={
    studyId:(document.getElementById('trdStudyId')||{}).value||'',
    title:titleVal.trim(),
    category:(document.getElementById('trdCategory')||{}).value||'Technical',
    status:(document.getElementById('trdStatus')||{}).value||'Open',
    lead:(document.getElementById('trdLead')||{}).value||'',
    dueDate:(document.getElementById('trdDue')||{}).value||'',
    alternatives:(document.getElementById('trdAlternatives')||{}).value||'',
    criteria:(document.getElementById('trdCriteria')||{}).value||'',
    decision:(document.getElementById('trdDecision')||{}).value||'',
    rationale:(document.getElementById('trdRationale')||{}).value||'',
    linkedReq:(document.getElementById('trdLinkedReq')||{}).value||'',
    linkedRisk:(document.getElementById('trdLinkedRisk')||{}).value||'',
    notes:(document.getElementById('trdNotes')||{}).value||''
  };
  if(editId!==null){
    var t=appState.tradeStudies.find(function(x){return x.id===editId;});
    if(!t){toast('Study not found','error');return;}
    var diffs=[];
    Object.keys(data).forEach(function(k){if((t[k]||'')!==(data[k]||''))diffs.push({field:k,oldVal:t[k]||'',newVal:data[k]});});
    Object.keys(data).forEach(function(k){t[k]=data[k];});
    t.updatedDate=todayStr();
    auditRecord('tradeStudies',t.id,'edited',diffs,t.title);
    logActivity('Analysis/Trade Studies','Updated',trdFmtId(t.id),t.title);
    toast('Analysis/trade study updated','success');
  }else{
    data.id=appState._trdNextId++;
    data.createdDate=todayStr();data.updatedDate=todayStr();
    appState.tradeStudies.push(data);
    auditRecord('tradeStudies',data.id,'created',[{field:'Title',oldVal:'',newVal:data.title}],data.title);
    logActivity('Analysis/Trade Studies','Created',trdFmtId(data.id),data.title);
    toast('Analysis/trade study created','success');
  }
  markUnsaved();closeConfirm();renderContent();
}

function v95_openTradeDetail(id){
  var t=appState.tradeStudies.find(function(x){return x.id===id;});
  if(!t)return;
  var html='<div class="detail-grid">';
  html+='<div class="detail-field"><span class="detail-label">ID</span><span>'+trdFmtId(t.id)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Study #</span><span>'+esc(t.studyId||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Title</span><span>'+esc(t.title)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Category</span><span>'+esc(t.category||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Status</span><span>'+esc(t.status)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Lead</span><span>'+esc(t.lead||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Due Date</span><span>'+esc(t.dueDate||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Linked Req</span><span>'+renderLinkedRef(t.linkedReq)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Linked Risk</span><span>'+renderLinkedRef(t.linkedRisk)+'</span></div>';
  html+='</div>';
  if(t.alternatives){html+='<div style="margin-top:1rem;"><strong>Alternatives:</strong><pre style="white-space:pre-wrap;background:var(--bg-secondary);padding:0.5rem;border-radius:4px;margin-top:0.25rem;">'+esc(t.alternatives)+'</pre></div>';}
  if(t.criteria){html+='<div style="margin-top:0.75rem;"><strong>Evaluation Criteria:</strong><pre style="white-space:pre-wrap;background:var(--bg-secondary);padding:0.5rem;border-radius:4px;margin-top:0.25rem;">'+esc(t.criteria)+'</pre></div>';}
  if(t.decision){html+='<div style="margin-top:0.75rem;"><strong>Decision:</strong><p style="margin:0.25rem 0">'+esc(t.decision)+'</p></div>';}
  if(t.rationale){html+='<div style="margin-top:0.75rem;"><strong>Rationale:</strong><p style="margin:0.25rem 0">'+esc(t.rationale)+'</p></div>';}
  if(t.notes){html+='<div style="margin-top:0.75rem;"><strong>Notes:</strong><p style="margin:0.25rem 0">'+esc(t.notes)+'</p></div>';}
  html+=renderAuditHistoryHTML('tradeStudies',t.id);
  openDetailPanel(t.title+' ('+trdFmtId(t.id)+')',html,function(){closeDetailPanel();openTradeModal(id);});
}



/* ═══════════════════════════════════════════════
   ANOMALY TRACKER MODULE
   ═══════════════════════════════════════════════ */
var _anomSortField='id',_anomSortDir='asc',_anomSearch='',_anomStatusFilter='';
function anomFmtId(id){return 'ANOM-'+String(id).padStart(3,'0');}

function v95_renderAnomaliesModule(area){
  var items=appState.anomalies||[];
  var filtered=items.filter(function(a){
    if(_anomStatusFilter&&a.status!==_anomStatusFilter)return false;
    if(_anomSearch){var q=_anomSearch.toLowerCase();return (a.title||'').toLowerCase().indexOf(q)>=0||(a.anomalyId||'').toLowerCase().indexOf(q)>=0||(a.reportedBy||'').toLowerCase().indexOf(q)>=0||(a.system||'').toLowerCase().indexOf(q)>=0;}
    return true;
  });
  filtered.sort(function(a,b){var av=a[_anomSortField],bv=b[_anomSortField];if(typeof av==='string')av=av.toLowerCase();if(typeof bv==='string')bv=bv.toLowerCase();if(av<bv)return _anomSortDir==='asc'?-1:1;if(av>bv)return _anomSortDir==='asc'?1:-1;return 0;});

  var total=items.length,open=0,investigating=0,resolved=0,critical=0;
  items.forEach(function(a){if(a.status==='Open')open++;else if(a.status==='Investigating')investigating++;else if(a.status==='Resolved'||a.status==='Closed')resolved++;if(a.severity==='Critical')critical++;});

  var html='<div class="module-header"><h2>Anomaly Tracker</h2><button class="btn btn-primary" onclick="openAnomModal()">+ Report Anomaly</button></div>';
  html+='<div class="kpi-row"><div class="kpi-card"><div class="kpi-value">'+total+'</div><div class="kpi-label">Total Anomalies</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--danger)">'+open+'</div><div class="kpi-label">Open</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--warning)">'+investigating+'</div><div class="kpi-label">Investigating</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--success)">'+resolved+'</div><div class="kpi-label">Resolved</div></div>';
  html+='<div class="kpi-card"><div class="kpi-value" style="color:var(--danger);font-weight:700">'+critical+'</div><div class="kpi-label">Critical</div></div></div>';

  html+='<div class="filter-bar"><input type="text" class="search-input" placeholder="Search anomalies..." value="'+esc(_anomSearch)+'" oninput="_anomSearch=this.value;renderContent();">';
  var statuses=pmdList('anomalyStatuses');
  html+='<select class="filter-select" onchange="_anomStatusFilter=this.value;renderContent();"><option value="">All Statuses</option>';
  statuses.forEach(function(s){html+='<option value="'+s+'"'+(s===_anomStatusFilter?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select></div>';

  html+='<div class="table-wrapper"><table class="data-table"><thead><tr>';
  var cols=[{k:'id',l:'ID'},{k:'anomalyId',l:'Anomaly #'},{k:'title',l:'Title'},{k:'system',l:'System'},{k:'severity',l:'Severity'},{k:'status',l:'Status'},{k:'reportedBy',l:'Reported By'},{k:'reportDate',l:'Report Date'}];
  cols.forEach(function(c){html+='<th class="sortable" onclick="anomSort(\''+c.k+'\')">'+c.l+((_anomSortField===c.k)?(_anomSortDir==='asc'?' ^':' v'):'')+'</th>';});
  html+='<th>Actions</th></tr></thead><tbody>';

  if(filtered.length===0){html+='<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-muted)">No anomalies found</td></tr>';}
  filtered.forEach(function(a){
    var sevColor=a.severity==='Critical'?'color:var(--danger);font-weight:700':a.severity==='Major'?'color:var(--warning)':a.severity==='Minor'?'color:var(--info)':'';
    var stColor=a.status==='Open'?'color:var(--danger)':a.status==='Investigating'?'color:var(--warning)':a.status==='Resolved'||a.status==='Closed'?'color:var(--success)':'';
    html+='<tr><td>'+anomFmtId(a.id)+'</td><td>'+esc(a.anomalyId||'')+'</td><td><a href="#" onclick="openAnomDetail('+a.id+');return false;">'+esc(a.title)+'</a></td>';
    html+='<td>'+esc(a.system||'')+'</td><td><span style="'+sevColor+'">'+esc(a.severity||'')+'</span></td>';
    html+='<td><span style="'+stColor+'">'+esc(a.status)+'</span></td>';
    html+='<td>'+esc(a.reportedBy||'')+'</td><td>'+esc(a.reportDate||'--')+'</td>';
    html+='<td><button class="btn btn-sm" onclick="openAnomModal('+a.id+')">Edit</button> <button class="btn btn-sm btn-danger" onclick="deleteAnom('+a.id+')">Del</button></td></tr>';
  });
  html+='</tbody></table></div>';
  area.innerHTML=html;
}

function anomSort(field){if(_anomSortField===field)_anomSortDir=_anomSortDir==='asc'?'desc':'asc';else{_anomSortField=field;_anomSortDir='asc';}renderContent();}

function openAnomModal(editId){
  var a=editId?appState.anomalies.find(function(x){return x.id===editId;}):null;
  var title=a?'Edit Anomaly':'Report Anomaly';
  var severities=pmdList('anomalySeverities');
  var statuses=pmdList('anomalyStatuses');
  var categories=pmdList('anomalyCategories');

  var html='<div style="max-height:60vh;overflow-y:auto;padding:0.5rem;">';
  html+='<label>Anomaly ID</label><input id="anomAnomId" class="form-input" value="'+esc(a?a.anomalyId:'')+'" placeholder="AR-001">';
  html+='<label>Title *</label><input id="anomTitle" class="form-input" value="'+esc(a?a.title:'')+'">';
  html+='<label>System / Subsystem</label><input id="anomSystem" class="form-input" value="'+esc(a?a.system:'')+'" placeholder="Power Supply Unit">';
  html+='<label>Category</label><select id="anomCategory" class="form-input">';
  categories.forEach(function(c){html+='<option'+(a&&a.category===c?' selected':'')+'>'+esc(c)+'</option>';});
  html+='</select>';
  html+='<label>Severity</label><select id="anomSeverity" class="form-input">';
  severities.forEach(function(s){html+='<option'+(a&&a.severity===s?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select>';
  html+='<label>Status</label><select id="anomStatus" class="form-input">';
  statuses.forEach(function(s){html+='<option'+(a&&a.status===s?' selected':'')+'>'+esc(s)+'</option>';});
  html+='</select>';
  html+='<label>Reported By</label><input id="anomReporter" class="form-input" value="'+esc(a?a.reportedBy:'')+'">';
  html+='<label>Report Date</label><input id="anomReportDate" class="form-input" type="date" value="'+esc(a?a.reportDate:'')+'">';
  html+='<label>Description</label><textarea id="anomDesc" class="form-input" rows="3">'+esc(a?a.description:'')+'</textarea>';
  html+='<label>Steps to Reproduce</label><textarea id="anomSteps" class="form-input" rows="3">'+esc(a?a.stepsToReproduce:'')+'</textarea>';
  html+='<label>Root Cause</label><textarea id="anomRootCause" class="form-input" rows="2">'+esc(a?a.rootCause:'')+'</textarea>';
  html+='<label>Corrective Action</label><textarea id="anomCorrective" class="form-input" rows="2">'+esc(a?a.correctiveAction:'')+'</textarea>';
  html+='<label>Preventive Action</label><textarea id="anomPreventive" class="form-input" rows="2">'+esc(a?a.preventiveAction:'')+'</textarea>';
  html+='<label>Linked Action</label><input id="anomLinkedAction" class="form-input" value="'+esc(a?a.linkedAction:'')+'" placeholder="ACT-001">';
  html+='<label>Linked Risk</label><input id="anomLinkedRisk" class="form-input" value="'+esc(a?a.linkedRisk:'')+'" placeholder="RSK-001">';
  html+='<label>Resolution Date</label><input id="anomResDate" class="form-input" type="date" value="'+esc(a?a.resolutionDate:'')+'">';
  html+='<label>Notes</label><textarea id="anomNotes" class="form-input" rows="2">'+esc(a?a.notes:'')+'</textarea>';
  html+='<div style="margin-top:1rem;text-align:right;"><button class="btn btn-primary" onclick="saveAnom('+(a?a.id:'null')+')">Save</button> <button class="btn" onclick="closeConfirm()">Cancel</button></div></div>';

  document.getElementById('confirmTitle').textContent=title;
  document.getElementById('confirmMsg').innerHTML=html;
  document.getElementById('confirmBtn').style.display='none';
  pendingConfirmCallback=null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function saveAnom(editId){
  var titleVal=(document.getElementById('anomTitle')||{}).value||'';
  if(!titleVal.trim()){toast('Title is required','error');return;}
  var data={
    anomalyId:(document.getElementById('anomAnomId')||{}).value||'',
    title:titleVal.trim(),
    system:(document.getElementById('anomSystem')||{}).value||'',
    category:(document.getElementById('anomCategory')||{}).value||'Hardware',
    severity:(document.getElementById('anomSeverity')||{}).value||'Major',
    status:(document.getElementById('anomStatus')||{}).value||'Open',
    reportedBy:(document.getElementById('anomReporter')||{}).value||'',
    reportDate:(document.getElementById('anomReportDate')||{}).value||'',
    description:(document.getElementById('anomDesc')||{}).value||'',
    stepsToReproduce:(document.getElementById('anomSteps')||{}).value||'',
    rootCause:(document.getElementById('anomRootCause')||{}).value||'',
    correctiveAction:(document.getElementById('anomCorrective')||{}).value||'',
    preventiveAction:(document.getElementById('anomPreventive')||{}).value||'',
    linkedAction:(document.getElementById('anomLinkedAction')||{}).value||'',
    linkedRisk:(document.getElementById('anomLinkedRisk')||{}).value||'',
    resolutionDate:(document.getElementById('anomResDate')||{}).value||'',
    notes:(document.getElementById('anomNotes')||{}).value||''
  };
  if(editId!==null){
    var a=appState.anomalies.find(function(x){return x.id===editId;});
    if(!a){toast('Anomaly not found','error');return;}
    var diffs=[];
    Object.keys(data).forEach(function(k){if((a[k]||'')!==(data[k]||''))diffs.push({field:k,oldVal:a[k]||'',newVal:data[k]});});
    Object.keys(data).forEach(function(k){a[k]=data[k];});
    a.updatedDate=todayStr();
    auditRecord('anomalies',a.id,'edited',diffs,a.title);
    logActivity('Anomalies','Updated',anomFmtId(a.id),a.title);
    toast('Anomaly updated','success');
  }else{
    data.id=appState._anomNextId++;
    data.createdDate=todayStr();data.updatedDate=todayStr();
    appState.anomalies.push(data);
    auditRecord('anomalies',data.id,'created',[{field:'Title',oldVal:'',newVal:data.title}],data.title);
    logActivity('Anomalies','Created',anomFmtId(data.id),data.title);
    toast('Anomaly reported','success');
  }
  markUnsaved();closeConfirm();renderContent();
}

function v95_openAnomDetail(id){
  var a=appState.anomalies.find(function(x){return x.id===id;});
  if(!a)return;
  var sevColor=a.severity==='Critical'?'color:var(--danger);font-weight:700':a.severity==='Major'?'color:var(--warning)':'';
  var html='<div class="detail-grid">';
  html+='<div class="detail-field"><span class="detail-label">ID</span><span>'+anomFmtId(a.id)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Anomaly #</span><span>'+esc(a.anomalyId||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Title</span><span>'+esc(a.title)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">System</span><span>'+esc(a.system||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Category</span><span>'+esc(a.category||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Severity</span><span style="'+sevColor+'">'+esc(a.severity||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Status</span><span>'+esc(a.status)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Reported By</span><span>'+esc(a.reportedBy||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Report Date</span><span>'+esc(a.reportDate||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Resolution Date</span><span>'+esc(a.resolutionDate||'--')+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Linked Action</span><span>'+renderLinkedRef(a.linkedAction)+'</span></div>';
  html+='<div class="detail-field"><span class="detail-label">Linked Risk</span><span>'+renderLinkedRef(a.linkedRisk)+'</span></div>';
  html+='</div>';
  if(a.description){html+='<div style="margin-top:1rem;"><strong>Description:</strong><p style="margin:0.25rem 0">'+esc(a.description)+'</p></div>';}
  if(a.stepsToReproduce){html+='<div style="margin-top:0.75rem;"><strong>Steps to Reproduce:</strong><pre style="white-space:pre-wrap;background:var(--bg-secondary);padding:0.5rem;border-radius:4px;margin-top:0.25rem;">'+esc(a.stepsToReproduce)+'</pre></div>';}
  if(a.rootCause){html+='<div style="margin-top:0.75rem;"><strong>Root Cause:</strong><p style="margin:0.25rem 0">'+esc(a.rootCause)+'</p></div>';}
  if(a.correctiveAction){html+='<div style="margin-top:0.75rem;"><strong>Corrective Action:</strong><p style="margin:0.25rem 0">'+esc(a.correctiveAction)+'</p></div>';}
  if(a.preventiveAction){html+='<div style="margin-top:0.75rem;"><strong>Preventive Action:</strong><p style="margin:0.25rem 0">'+esc(a.preventiveAction)+'</p></div>';}
  if(a.notes){html+='<div style="margin-top:0.75rem;"><strong>Notes:</strong><p style="margin:0.25rem 0">'+esc(a.notes)+'</p></div>';}
  html+=renderAuditHistoryHTML('anomalies',a.id);
  openDetailPanel(a.title+' ('+anomFmtId(a.id)+')',html,function(){closeDetailPanel();openAnomModal(id);});
}



/* ═══════════════════════════════════════════════
   TEMPLATE STARTER PACKS
   ═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   PASTE IMPORT FROM SPREADSHEET
   ═══════════════════════════════════════════════ */
var _pasteTarget = 'actions';
var _pasteColumnMaps = {
  actions: {columns:['title','source','assignee','priority','status','category','due','description'],required:['title']},
  boms: {columns:['partNumber','partName','category','qtyRequired','qtyOnHand','unitCost','vendor','leadTime','status'],required:['partNumber']},
  inventory: {columns:['name','partNumber','serialNumber','status','location','condition','notes'],required:['name']},
  risks: {columns:['title','category','status','owner','description'],required:['title']}
};
function openPasteImport(target) {
  _pasteTarget = target || currentModule;
  if(!_pasteColumnMaps[_pasteTarget]) { toast('Paste import not available for this module','error'); return; }
  var map = _pasteColumnMaps[_pasteTarget];
  var modName = appState.settings.moduleNames[_pasteTarget] || _pasteTarget;
  var colList = map.columns.map(function(c,i){ return '<span class="kb-key">' + esc(c) + (map.required.indexOf(c)>=0 ? ' *' : '') + '</span>'; }).join(' ');
  var html = '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Paste tab-delimited data from Excel or Google Sheets into <strong>' + esc(modName) + '</strong>. One row per item, columns separated by tabs.</p>';
  html += '<div style="margin-bottom:12px"><div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">Expected columns (in order):</div><div style="display:flex;flex-wrap:wrap;gap:4px">' + colList + '</div></div>';
  html += '<div class="form-group"><label>Paste data below</label><textarea id="pasteData" rows="12" style="font-family:var(--font-mono);font-size:12px;tab-size:16" placeholder="Paste from Excel here...\nRow 1 col1&#9;col2&#9;col3\nRow 2 col1&#9;col2&#9;col3"></textarea></div>';
  html += '<div style="font-size:11px;color:var(--text-muted)">Tip: Copy rows from Excel (without the header row), then paste here. Required fields marked with *.</div>';
  document.getElementById('pasteModalBody').innerHTML = html;
  document.getElementById('pasteStatus').textContent = '';
  openModal('pasteModal');
  setTimeout(function(){ var ta = document.getElementById('pasteData'); if(ta) ta.focus(); }, 150);
}
function executePasteImport() {
  var raw = document.getElementById('pasteData').value.trim();
  if(!raw) { toast('No data to import','error'); return; }
  var map = _pasteColumnMaps[_pasteTarget];
  if(!map) return;
  var lines = raw.split(/\r?\n/).filter(function(l){ return l.trim(); });
  if(lines.length === 0) { toast('No rows found','error'); return; }
  snapshotForUndo('Paste import ' + lines.length + ' rows into ' + _pasteTarget);
  var imported = 0, skipped = 0;
  lines.forEach(function(line) {
    var cells = line.split('\t');
    var obj = {};
    map.columns.forEach(function(col, i) { obj[col] = (cells[i] || '').trim(); });
    /* Check required */
    var valid = map.required.every(function(r){ return obj[r] && obj[r].length > 0; });
    if(!valid) { skipped++; return; }
    if(_pasteTarget === 'actions') {
      appState.actions.push({
        id: _actionNextId++, title: obj.title, source: obj.source||'', assignee: obj.assignee||'',
        priority: obj.priority||'P3 \u2014 Medium', status: obj.status||'Open', category: obj.category||'Engineering',
        taskType: 'Internal Action', blockedBy: '', startDate: '', due: obj.due||'',
        description: obj.description||'', linkedRiskId: null, notes: [], created: nowISO(), updated: todayStr(), completed: null
      });
    } else if(_pasteTarget === 'boms') {
      appState.boms.push({
        id: _bomNextId++, partNumber: obj.partNumber, partName: obj.partName||'', category: obj.category||'Electronic',
        qtyRequired: parseInt(obj.qtyRequired)||1, qtyOnHand: parseInt(obj.qtyOnHand)||0,
        unitCost: parseFloat(obj.unitCost)||0, vendor: obj.vendor||'', leadTime: obj.leadTime||'',
        status: obj.status||'Pending Review', systemNode:'', description:'', notes:[], history:[],
        created: todayStr(), updated: todayStr()
      });
    } else if(_pasteTarget === 'inventory') {
      appState.inventory.push({
        id: _invNextId++, name: obj.name, partNumber: obj.partNumber||'', serialNumber: obj.serialNumber||'',
        status: obj.status||'In Storage', location: obj.location||'', condition: obj.condition||'New',
        notes: obj.notes||'', history:[], created: todayStr(), updated: todayStr()
      });
    } else if(_pasteTarget === 'risks') {
      appState.risks.push({
        id: appState._riskNextId++, title: obj.title, category: obj.category||'Technical',
        status: obj.status||'Open', owner: obj.owner||'', description: obj.description||'',
        quality:0, cost:0, schedule:0, reliability:0, rackIds:[],
        notes:[], history:[{date:todayStr(),text:'Created via paste import'}],
        created: todayStr(), updated: todayStr()
      });
    }
    imported++;
  });
  logActivity(_pasteTarget, 'Paste Import', null, imported + ' items imported');
  toast(imported + ' items imported' + (skipped > 0 ? ', ' + skipped + ' skipped' : ''), imported > 0 ? 'success' : 'warning');
  closeModal('pasteModal');
  buildNav();
  renderContent();
}
/* ═══════════════════════════════════════════════
   TAB MEMORY — remembers last sub-view per module
   ═══════════════════════════════════════════════ */
var moduleSubViews = {};
function saveSubView(moduleKey, view) { moduleSubViews[moduleKey] = view; }
function getSubView(moduleKey, defaultView) { return moduleSubViews[moduleKey] || defaultView; }
/* ═══════════════════════════════════════════════
   BREADCRUMB NAVIGATION
   ═══════════════════════════════════════════════ */
function buildBreadcrumb() {
  var name = appState.settings.moduleNames[currentModule] || currentModule;
  var parts = [{label:'Home',action:'dashboard'}];
  if (currentModule !== 'dashboard') {
    parts.push({label:name,action:currentModule});
  }
  var subLabel = null;
  if (currentModule === 'risks') {
    if (riskSubView === 'riskDash') subLabel = 'Dashboard';
    else if (riskSubView === 'rackMgmt') subLabel = 'Rack Management';
    else subLabel = 'Register';
  } else if (currentModule === 'actions') {
    if (actionSubView === 'kanban') subLabel = 'Kanban';
    else if (actionSubView === 'timeline') subLabel = 'Timeline';
    else subLabel = 'Table';
  }
  var html = '';
  parts.forEach(function(p, i) {
    if (i > 0) html += '<span class="breadcrumb-sep">▸</span>';
    if (i === parts.length - 1 && !subLabel) {
      html += '<span class="breadcrumb-current">' + esc(p.label) + '</span>';
    } else {
      html += '<span class="breadcrumb-item" onclick="switchModule(\'' + p.action + '\')">' + esc(p.label) + '</span>';
    }
  });
  if (subLabel) {
    html += '<span class="breadcrumb-sep">▸</span><span class="breadcrumb-current">' + esc(subLabel) + '</span>';
  }
  return '<nav class="breadcrumb" aria-label="Breadcrumb">' + html + '</nav>';
}
/* ═══════════════════════════════════════════════
   ROW HOVER TOOLTIPS
   ═══════════════════════════════════════════════ */
var _tooltipTimer = null;
function setupRowTooltips(area) {
  var tooltip = document.getElementById('rowTooltip');
  if (!tooltip) return;
  area.addEventListener('mouseover', function(e) {
    var tr = e.target.closest('.rtable tbody tr');
    if (!tr) return;
    clearTimeout(_tooltipTimer);
    _tooltipTimer = setTimeout(function() {
      var html = getRowTooltipContent(tr);
      if (!html) return;
      tooltip.innerHTML = html;
      var rect = tr.getBoundingClientRect();
      tooltip.style.left = Math.min(rect.left + 40, window.innerWidth - 340) + 'px';
      tooltip.style.top = Math.max(rect.bottom + 6, 10) + 'px';
      if (rect.bottom + 200 > window.innerHeight) {
        tooltip.style.top = Math.max(rect.top - tooltip.offsetHeight - 6, 10) + 'px';
      }
      tooltip.classList.add('visible');
    }, 450);
  });
  area.addEventListener('mouseout', function(e) {
    var tr = e.target.closest('.rtable tbody tr');
    if (tr) { clearTimeout(_tooltipTimer); document.getElementById('rowTooltip').classList.remove('visible'); }
  });
}
function getRowTooltipContent(tr) {
  if (currentModule === 'risks' && tr.dataset.riskId) {
    var r = appState.risks.find(function(x){ return x.id == tr.dataset.riskId; });
    if (!r) return '';
    var c = getCrit(r);
    return '<div class="tt-title">' + esc(r.title) + '</div><div class="tt-field"><strong>Status:</strong> ' + esc(r.status) + '</div><div class="tt-field"><strong>Owner:</strong> ' + esc(r.owner || 'Unassigned') + '</div><div class="tt-field"><strong>Criticality:</strong> ' + c.sum + '/' + c.maxP + '</div>' + (r.description ? '<div class="tt-field" style="margin-top:4px;font-style:italic">' + esc(r.description.substring(0, 120)) + (r.description.length > 120 ? '...' : '') + '</div>' : '');
  }
  if (currentModule === 'actions' && tr.dataset.actionId) {
    var a = appState.actions.find(function(x){ return x.id == tr.dataset.actionId; });
    if (!a) return '';
    return '<div class="tt-title">' + esc(a.title) + '</div><div class="tt-field"><strong>Assignee:</strong> ' + esc(a.assignee || 'Unassigned') + '</div><div class="tt-field"><strong>Due:</strong> ' + fmtDate(a.due) + '</div><div class="tt-field"><strong>Priority:</strong> ' + esc(a.priority) + '</div>' + (a.description ? '<div class="tt-field" style="margin-top:4px;font-style:italic">' + esc(a.description.substring(0, 120)) + (a.description.length > 120 ? '...' : '') + '</div>' : '');
  }
  if (currentModule === 'boms' && tr.dataset.bomId) {
    var b = appState.boms.find(function(x){ return x.id == tr.dataset.bomId; });
    if (!b) return '';
    return '<div class="tt-title">' + esc(b.partName || b.partNumber) + '</div><div class="tt-field"><strong>Part #:</strong> ' + esc(b.partNumber || '—') + '</div><div class="tt-field"><strong>Vendor:</strong> ' + esc(b.vendor || '—') + '</div><div class="tt-field"><strong>Cost:</strong> ' + fmtCurrency(pmdMultiply(b.unitCost,b.qtyRequired)) + '</div>';
  }
  return '';
}
/* ═══════════════════════════════════════════════
   DATA INTEGRITY CHECK
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   SMART FEATURES (V9.4)
   ─ F1: FK integrity sweep
   ─ F2: vendor lead-time learning
   ─ F3: procurement→BOM/Cost loop closure
   ─ F4: by-owner cross-module dashboard
   ═══════════════════════════════════════════════ */

/* F1 — FK schema: declares every cross-module reference field.
   Adding a new linked field anywhere = add one row here. */
var FK_SCHEMA = [
  // {sourceArr, sourceLabel, sourceFmt, field, targetArr, targetFmt, prefix}
  {sourceArr:'actions',      sourceFmt:actionFmtId, field:'linkedRiskId',  targetArr:'risks',        targetFmt:riskFmtId,   prefix:'R'},
  {sourceArr:'requirements', sourceFmt:reqFmtId,    field:'linkedTestId',  targetArr:'tests',        targetFmt:testFmtId,   prefix:'TC'},
  {sourceArr:'requirements', sourceFmt:reqFmtId,    field:'linkedActionId',targetArr:'actions',      targetFmt:actionFmtId, prefix:'AI'},
  {sourceArr:'requirements', sourceFmt:reqFmtId,    field:'linkedRiskId',  targetArr:'risks',        targetFmt:riskFmtId,   prefix:'R'},
  {sourceArr:'tests',        sourceFmt:testFmtId,   field:'linkedActionId',targetArr:'actions',      targetFmt:actionFmtId, prefix:'AI'},
  {sourceArr:'lessons',      sourceFmt:lesFmtId,    field:'linkedRiskId',  targetArr:'risks',        targetFmt:riskFmtId,   prefix:'R'},
  {sourceArr:'changes',      sourceFmt:chgFmtId,    field:'linkedRiskId',  targetArr:'risks',        targetFmt:riskFmtId,   prefix:'R'},
  {sourceArr:'tradeStudies', sourceFmt:trdFmtId,    field:'linkedRisk',    targetArr:'risks',        targetFmt:riskFmtId,   prefix:'R'},
  {sourceArr:'tradeStudies', sourceFmt:trdFmtId,    field:'linkedReq',     targetArr:'requirements', targetFmt:reqFmtId,    prefix:'REQ'},
  {sourceArr:'anomalies',    sourceFmt:anomFmtId,   field:'linkedRisk',    targetArr:'risks',        targetFmt:riskFmtId,   prefix:'R'},
  {sourceArr:'anomalies',    sourceFmt:anomFmtId,   field:'linkedAction',  targetArr:'actions',      targetFmt:actionFmtId, prefix:'AI'},
  {sourceArr:'decisions',    sourceFmt:decFmtId,    field:'linkedRiskId',  targetArr:'risks',        targetFmt:riskFmtId,   prefix:'R'},
  {sourceArr:'purchases',    sourceFmt:procFmtId,   field:'linkedBomId',   targetArr:'boms',         targetFmt:bomFmtId,    prefix:'BOM'},
  {sourceArr:'purchases',    sourceFmt:procFmtId,   field:'linkedCostId',  targetArr:'costItems',    targetFmt:costFmtId,   prefix:'CST'},
  {sourceArr:'costItems',    sourceFmt:costFmtId,   field:'linkedEvm',     targetArr:'evmPackages',  targetFmt:evmFmtId,    prefix:'WP'}
];

/* Build a dual-format lookup set for a target collection.
   Set contains both the integer id AND the formatted prefix string,
   so we can match either "BOM-0042" or 42. */
function _buildIdSet(arr, fmtFn) {
  var set = {};
  (arr || []).forEach(function(item){
    set[item.id] = true;
    set[fmtFn(item.id)] = true;
  });
  return set;
}

/* F1 — Run FK integrity sweep. Returns array of orphan-reference issues. */


/* F2 — Vendor lead-time learning.
   Given a vendor name, returns {n, medianDays, minDays, maxDays} from prior
   completed purchases (status Received with both dateOrdered + dateReceived).
   Returns null if no usable history. */
function getVendorLeadTimeStats(vendorName) {
  if (!vendorName) return null;
  var v = vendorName.trim().toLowerCase();
  if (!v) return null;
  var deltas = [];
  (appState.purchases || []).forEach(function(p){
    if (!p.dateOrdered || !p.dateReceived) return;
    if ((p.vendor||'').trim().toLowerCase() !== v) return;
    var d1 = new Date(p.dateOrdered + 'T12:00:00');
    var d2 = new Date(p.dateReceived + 'T12:00:00');
    if (isNaN(d1) || isNaN(d2) || d2 < d1) return;
    deltas.push(Math.round((d2 - d1) / 86400000));
  });
  if (deltas.length === 0) return null;
  deltas.sort(function(a,b){return a-b;});
  var mid = Math.floor(deltas.length / 2);
  var median = deltas.length % 2 === 0
    ? Math.round((deltas[mid-1] + deltas[mid]) / 2)
    : deltas[mid];
  return {
    n: deltas.length,
    medianDays: median,
    minDays: deltas[0],
    maxDays: deltas[deltas.length - 1]
  };
}

/* F2 helper — render the lead-time hint for the vendor field. Reads the live
   vendor input on each call so the hint updates as the user types. */
function refreshVendorLeadTimeHint() {
  var input = document.getElementById('purVendor');
  var hint = document.getElementById('purVendorHint');
  if (!input || !hint) return;
  var stats = getVendorLeadTimeStats(input.value);
  if (!stats) {
    hint.textContent = '';
    hint.style.display = 'none';
    return;
  }
  var rangeStr = stats.minDays === stats.maxDays
    ? stats.medianDays + ' days'
    : stats.medianDays + ' days median (range ' + stats.minDays + '–' + stats.maxDays + ')';
  hint.textContent = '↳ Past ' + stats.n + ' order' + (stats.n>1?'s':'') + ' from this vendor: ' + rangeStr;
  hint.style.display = 'block';
}

/* F3 — Procurement loop closure.
   Called when a purchase advances to "Received". Looks up linked BOM and
   Cost items and offers a one-click confirm to:
   - increment BOM qtyOnHand by purchase qty
   - append (qty * unitCost) to Cost actual
   No-op if no links or already processed. */


/* F4 — By-owner cross-module dashboard.
   Aggregates everything assigned to one person across modules where the
   owner field exists. Click into any item to navigate. */
function openByOwnerView() {
  // Collect every distinct owner/assignee/etc string in the database
  var owners = {};
  function track(name){ if (name && name.trim()) owners[name.trim()] = true; }
  (appState.risks||[]).forEach(function(r){track(r.owner);});
  (appState.actions||[]).forEach(function(a){track(a.assignee);});
  (appState.anomalies||[]).forEach(function(a){track(a.reportedBy);});
  (appState.tests||[]).forEach(function(t){track(t.tester);});
  (appState.decisions||[]).forEach(function(d){track(d.decisionMaker);});
  (appState.requirements||[]).forEach(function(r){track(r.owner);});
  (appState.evmPackages||[]).forEach(function(e){track(e.owner);});
  (appState.tradeStudies||[]).forEach(function(t){track(t.lead);});
  (appState.changes||[]).forEach(function(c){track(c.requestor);});
  (appState.lessons||[]).forEach(function(l){track(l.contributor);});
  (appState.purchases||[]).forEach(function(p){track(p.requester);});
  (appState.milestones||[]).forEach(function(m){track(m.owner);});
  (appState.costItems||[]).forEach(function(c){track(c.owner);});
  var ownerList = Object.keys(owners).sort();

  if (ownerList.length === 0) {
    showConfirm('By-Owner View','No items have an owner assigned yet. Assign owners to risks, actions, etc., then come back.','OK',function(){});
    document.getElementById('confirmCancel').style.display = 'none';
    return;
  }

  var current = window._byOwnerSelection || ownerList[0];
  if (ownerList.indexOf(current) < 0) current = ownerList[0];
  window._byOwnerSelection = current;

  var html = '<div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">';
  html += '<label style="font-size:12px;color:var(--text-muted)">Owner:</label>';
  html += '<select id="byOwnerSel" class="form-input" style="flex:1" onchange="window._byOwnerSelection=this.value;openByOwnerView();">';
  ownerList.forEach(function(o){
    html += '<option value="' + esc(o) + '"' + (o===current?' selected':'') + '>' + esc(o) + '</option>';
  });
  html += '</select></div>';

  // Collect items for this owner across modules
  function rowsFor(arr, ownerField, fmtFn, moduleKey, statusField, titleField) {
    var rows = [];
    (arr||[]).forEach(function(item){
      if ((item[ownerField]||'').trim() === current) {
        rows.push({
          id: item.id,
          label: fmtFn(item.id),
          title: item[titleField] || item.title || '(untitled)',
          status: item[statusField] || '',
          module: moduleKey
        });
      }
    });
    return rows;
  }

  var sections = [
    {title:'Risks',          rows: rowsFor(appState.risks,         'owner',         riskFmtId,   'risks',         'status', 'title')},
    {title:'Actions',        rows: rowsFor(appState.actions,       'assignee',      actionFmtId, 'actions',       'status', 'title')},
    {title:'Anomalies',      rows: rowsFor(appState.anomalies,     'reportedBy',    anomFmtId,   'anomalies',     'status', 'title')},
    {title:'Tests',          rows: rowsFor(appState.tests,         'tester',        testFmtId,   'tests',         'result', 'title')},
    {title:'Decisions',      rows: rowsFor(appState.decisions,     'decisionMaker', decFmtId,    'decisions',     'status', 'title')},
    {title:'Requirements',   rows: rowsFor(appState.requirements,  'owner',         reqFmtId,    'requirements',  'verStatus', 'title')},
    {title:'EVM Packages',   rows: rowsFor(appState.evmPackages,   'owner',         evmFmtId,    'evm',           'status', 'name')},
    {title:'Trade Studies',  rows: rowsFor(appState.tradeStudies,  'lead',          trdFmtId,    'tradeStudies',  'status', 'title')},
    {title:'Changes',        rows: rowsFor(appState.changes,       'requestor',     chgFmtId,    'changes',       'status', 'title')},
    {title:'Lessons',        rows: rowsFor(appState.lessons,       'contributor',   lesFmtId,    'lessons',       'sentiment', 'title')},
    {title:'Purchases',      rows: rowsFor(appState.purchases,     'requester',     procFmtId,   'procurement',   'status', 'itemName')},
    {title:'Milestones',     rows: rowsFor(appState.milestones,    'owner',         msFmtId,     'milestones',    'status', 'title')},
    {title:'Cost Items',     rows: rowsFor(appState.costItems,     'owner',         costFmtId,   'costTracker',   '',       'title')}
  ];

  var totalRows = sections.reduce(function(s,sec){return s+sec.rows.length;},0);
  html += '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px"><strong>'+esc(current)+'</strong> has '+totalRows+' item'+(totalRows!==1?'s':'')+' across '+sections.filter(function(s){return s.rows.length>0;}).length+' module'+(sections.filter(function(s){return s.rows.length>0;}).length!==1?'s':'')+'.</div>';

  html += '<div style="max-height:55vh;overflow-y:auto">';
  var anyShown = false;
  sections.forEach(function(sec){
    if (sec.rows.length === 0) return;
    anyShown = true;
    html += '<div style="margin-bottom:14px"><div style="font-weight:600;font-size:13px;margin-bottom:6px;color:var(--accent)">'+esc(sec.title)+' ('+sec.rows.length+')</div>';
    html += '<table class="data-table" style="font-size:12px;width:100%"><tbody>';
    sec.rows.forEach(function(r){
      html += '<tr style="cursor:pointer" onclick="closeConfirm();navigateToItem(\''+esc(sec.rows[0].module)+'\','+r.id+')">';
      html += '<td style="font-family:var(--font-mono);width:80px;color:var(--accent)">'+esc(r.label)+'</td>';
      html += '<td>'+esc(r.title)+'</td>';
      html += '<td style="width:100px;color:var(--text-muted);text-align:right">'+esc(r.status)+'</td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  });
  if (!anyShown) html += '<div style="color:var(--text-muted);text-align:center;padding:20px">Nothing assigned to this person.</div>';
  html += '</div>';

  document.getElementById('confirmTitle').textContent = 'By-Owner View';
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').style.display = 'none';
  document.getElementById('confirmCancel').textContent = 'Close';
  pendingConfirmCallback = null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}

function v95_runDataIntegrityCheck() {
  var issues = [];
  /* Risks with no title */
  appState.risks.forEach(function(r) { if (!r.title || !r.title.trim()) issues.push('Risk ' + riskFmtId(r.id) + ' has no title'); });
  /* Actions with no title or invalid dates */
  var _riskIdSet = {};
  appState.risks.forEach(function(r) {
    _riskIdSet['R-' + String(r.id).padStart(3,'0')] = true;
    _riskIdSet[r.id] = true;
  });
  appState.actions.forEach(function(a) {
    if (!a.title || !a.title.trim()) issues.push('Action ' + actionFmtId(a.id) + ' has no title');
    if (a.due && a.startDate && a.due < a.startDate) issues.push('Action ' + actionFmtId(a.id) + ': due date before start date');
    if (a.linkedRiskId && !_riskIdSet[a.linkedRiskId]) issues.push('Action ' + actionFmtId(a.id) + ': linked risk ' + a.linkedRiskId + ' not found');
  });
  /* BOM shortfalls */
  appState.boms.forEach(function(b) {
    if (bomIsShortfall(b)) issues.push('BOM ' + bomFmtId(b.id) + ' (' + (b.partNumber||'?') + '): qty on-hand below required');
    if (!b.partNumber && !b.partName) issues.push('BOM ' + bomFmtId(b.id) + ': missing part number and name');
  });
  /* Inventory without matching BOM */
  appState.inventory.forEach(function(inv) {
    if (inv.partNumber) {
      var hasBom = appState.boms.some(function(b){ return b.partNumber === inv.partNumber; });
      if (!hasBom) issues.push('Inventory ' + invFmtId(inv.id) + ' (' + inv.partNumber + '): no matching BOM entry');
    }
  });
  /* HW items pending review */
  appState.hwItems.forEach(function(h) {
    if (h.status === 'Flagged') issues.push('HW ' + (h.name||h.id) + ' is flagged for issues');
  });
  /* EVM packages with negative variance */
  (appState.evmPackages||[]).forEach(function(w) {
    if (w.ac > 0 && w.ev > 0 && w.ev / w.ac < 0.8) issues.push('EVM ' + evmFmtId(w.id) + ': CPI below 0.80 (' + (w.ev/w.ac).toFixed(2) + ')');
    if (w.pv > 0 && w.ev > 0 && w.ev / w.pv < 0.8) issues.push('EVM ' + evmFmtId(w.id) + ': SPI below 0.80 (' + (w.ev/w.pv).toFixed(2) + ')');
  });
  /* Critical anomalies still open */
  (appState.anomalies||[]).forEach(function(a) {
    if (a.severity === 'Critical' && a.status !== 'Resolved' && a.status !== 'Closed') issues.push('Anomaly ' + anomFmtId(a.id) + ': CRITICAL and still ' + a.status);
  });
  /* Requirements not verified */
  (appState.requirements||[]).forEach(function(r) {
    if (r.verStatus !== 'Verified' && r.verStatus !== 'N/A' && !r.linkedTestId) issues.push('Requirement ' + (r.reqId||reqFmtId(r.id)) + ': not verified and no linked test');
  });
  /* Cost overruns */
  (appState.costItems||[]).forEach(function(c) {
    var v = (c.budget||0) - (c.actual||0) - (c.committed||0);
    if (v < 0) issues.push('Cost ' + costFmtId(c.id) + ' (' + c.wbsCode + '): over budget by $' + fmtCost(Math.abs(v)));
  });
  /* F1: Cross-module FK integrity (V9.4) */
  var fkIssues = runFkIntegritySweep();
  fkIssues.forEach(function(i){ issues.push(i); });
  /* Tests failing */
  (appState.tests||[]).forEach(function(t) {
    if (t.result === 'Fail') issues.push('Test ' + testFmtId(t.id) + ': FAILED — ' + (t.title||'Untitled'));
  });
  /* Report results */
  if (issues.length === 0) {
    toast('Data integrity check passed — no issues found', 'success');
  } else {
    var msg = '<div style="max-height:400px;overflow-y:auto"><h4 style="margin-bottom:12px;color:var(--yellow)">Found ' + issues.length + ' issue' + (issues.length > 1 ? 's' : '') + '</h4><ul style="font-size:12px;color:var(--text-secondary);padding-left:20px;line-height:1.8">';
    issues.forEach(function(i) { msg += '<li>' + esc(i) + '</li>'; });
    msg += '</ul></div>';
    document.getElementById('confirmTitle').textContent = 'Data Integrity Report';
    document.getElementById('confirmMsg').innerHTML = msg;
    document.getElementById('confirmBtn').textContent = 'OK';
    pendingConfirmCallback = function(){};
    var overlay = document.getElementById('confirmOverlay');
    overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false');
  }
}
/* ═══════════════════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════════════════ */
var currentTheme = 'dark';
function v95_toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  var btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = currentTheme === 'dark' ? '\u263D' : '\u2600';
  toast('Switched to ' + currentTheme + ' theme', 'info');
}
/* ═══════════════════════════════════════════════
   KEYBOARD SHORTCUTS OVERLAY
   ═══════════════════════════════════════════════ */
function openKbOverlay() {
  var el = document.getElementById('kbOverlay');
  if (el) { el.classList.add('open'); el.setAttribute('aria-hidden','false'); }
}
function closeKbOverlay() {
  var el = document.getElementById('kbOverlay');
  if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
}
var _kbPending = null;
var _kbTimer = null;
function _kbHandleChord(second) {
  var map = { d:'dashboard', r:'risks', a:'actions', b:'boms', i:'inventory', h:'hwItems', s:'assemblies' };
  if (map[second]) { switchModule(map[second]); toast('Go to ' + (appState.settings.moduleNames[map[second]] || map[second]), 'info'); }
  _kbPending = null;
}
document.addEventListener('keydown', function(e) {
  var tag = (e.target.tagName || '').toLowerCase();
  var isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
  /* Escape always works */
  if (e.key === 'Escape') {
    var kb = document.getElementById('kbOverlay');
    if (kb && kb.classList.contains('open')) { closeKbOverlay(); e.preventDefault(); return; }
    closeDetailPanel();
    return;
  }
  /* Ctrl shortcuts work even in inputs */
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' || e.key === 'Z') { if (!isInput) { e.preventDefault(); performUndo(); } return; }
    if (e.key === 'y' || e.key === 'Y') { if (!isInput) { e.preventDefault(); performRedo(); } return; }
    if (e.key === 'e' || e.key === 'E') { if (!isInput) { e.preventDefault(); openExportMenu(); } return; }
    return;
  }
  if (isInput) return;
  /* G chord for navigation */
  if (_kbPending === 'g') {
    clearTimeout(_kbTimer);
    _kbHandleChord(e.key.toLowerCase());
    e.preventDefault();
    return;
  }
  if (e.key === 'g') {
    _kbPending = 'g';
    _kbTimer = setTimeout(function() { _kbPending = null; }, 800);
    return;
  }
  if (e.key === '?' || (e.shiftKey && e.key === '/')) { openKbOverlay(); e.preventDefault(); return; }
  if (e.key === '/') { var si = document.getElementById('globalSearchInput'); if (si) { e.preventDefault(); si.focus(); } return; }
  if (e.key === 'N' && e.shiftKey) { var qeMods = {risks:'risks',actions:'actions',boms:'boms',inventory:'inventory',decisions:'decisions'}; if(qeMods[currentModule]){e.preventDefault();openQuickEntry(qeMods[currentModule]);} return; }
  if (e.key === 'n') { handleNewAction(); return; }
  if (e.key === 't' || e.key === 'T') { toggleTheme(); return; }
});
// Keyboard accessibility for sortable table headers
document.addEventListener('keydown', function(e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('sortable')) {
    e.preventDefault(); e.target.click();
  }
});
// Add tabindex to sortable headers via MutationObserver
var _a11yObserver = new MutationObserver(function() {
  var headers = document.querySelectorAll('th.sortable:not([tabindex])');
  for (var i = 0; i < headers.length; i++) {
    headers[i].setAttribute('tabindex', '0');
    headers[i].setAttribute('role', 'button');
  }
});
_a11yObserver.observe(document.body, {childList: true, subtree: true});
/* ═══════════════════════════════════════════════
   WHAT'S NEW — VERSION CHANGELOG VIEWER
   ═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   SESSION TIMER
   ═══════════════════════════════════════════════ */
var _sessionStart = Date.now();
var _lastExportAt = 0; /* V9.5: timestamp of last successful export, 0 = never */
var _warnedAt = {}; /* V9.5: progressive warning thresholds already fired this session */
function updateSessionTimer() {
  var el = document.getElementById('sessionTimer');
  if (!el) return;
  var now = Date.now();
  var elapsed = Math.floor((now - _sessionStart) / 1000);
  var mins = Math.floor(elapsed / 60);
  var secs = elapsed % 60;
  var hrs = Math.floor(mins / 60);
  mins = mins % 60;
  var display = hrs > 0 ? hrs + ':' + String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0') : mins + ':' + String(secs).padStart(2,'0');
  el.textContent = display;
  /* V9.5: update last-export label too */
  var etsEl = document.getElementById('lastExportTs');
  if (etsEl) {
    if (_lastExportAt === 0) {
      if (_hasUnsavedChanges) {
        etsEl.textContent = 'Never exported';
        etsEl.style.color = 'var(--red)';
        etsEl.style.display = '';
      } else {
        etsEl.style.display = 'none';
      }
    } else {
      var mSinceExp = Math.floor((now - _lastExportAt) / 60000);
      etsEl.textContent = mSinceExp < 1 ? 'Just exported' : 'Exported ' + mSinceExp + 'm ago';
      etsEl.style.color = _hasUnsavedChanges && mSinceExp >= 10 ? 'var(--red)' : _hasUnsavedChanges ? 'var(--yellow)' : 'var(--text-muted)';
      etsEl.style.display = '';
    }
  }
  /* V9.5: progressive unsaved-changes warnings based on time since last export.
     Fires once per threshold per session to avoid spam. Only when unsaved changes exist. */
  if (_hasUnsavedChanges) {
    var sinceExport = _lastExportAt === 0 ? elapsed : Math.floor((now - _lastExportAt) / 1000);
    var thresholds = [
      {sec: 600,  key: 't10', msg: 'You have unsaved changes from the last 10+ minutes. Consider exporting.', level: 'info'},
      {sec: 1800, key: 't30', msg: '30 minutes of unsaved work. Export your data (Ctrl+E).',                    level: 'warning'},
      {sec: 3600, key: 't60', msg: '⚠ 1 hour of unsaved work. Please export now (Ctrl+E) — no auto-save.',      level: 'warning'}
    ];
    thresholds.forEach(function(t){
      if (sinceExport >= t.sec && !_warnedAt[t.key]) {
        _warnedAt[t.key] = true;
        toast(t.msg, t.level);
      }
    });
    /* Flash the unsaved dot past 30 min so it's visible peripherally */
    var dot = document.getElementById('unsavedDot');
    if (dot) {
      if (sinceExport >= 1800) dot.classList.add('flashing');
      else dot.classList.remove('flashing');
    }
  } else {
    var dot = document.getElementById('unsavedDot');
    if (dot) dot.classList.remove('flashing');
  }
}
setInterval(updateSessionTimer, 1000);
/* V9.5: Stronger beforeunload — offer the export when there are unsaved changes.
   Can't programmatically trigger download in beforeunload handler (browsers block it
   during page teardown), but we CAN show a more informative prompt. */
window.addEventListener('beforeunload', function(e) {
  if (_hasUnsavedChanges) {
    var sinceExport = _lastExportAt === 0 ? (Date.now() - _sessionStart) : (Date.now() - _lastExportAt);
    var mins = Math.floor(sinceExport / 60000);
    /* Most browsers ignore custom text in modern versions and show their own,
       but we set it anyway for older environments. */
    var msg = mins >= 1
      ? 'You have ' + mins + ' min of unsaved work. Close anyway?'
      : 'You have unsaved changes. Close anyway?';
    e.preventDefault();
    e.returnValue = msg;
    return msg;
  }
});


/* ═══════════════════════════════════════════════
   TESTING CHECKLIST — Phase 5
   ═══════════════════════════════════════════════
   
   DASHBOARD
   [ ] All stat cards show correct live counts
   [ ] Clicking each stat card navigates to correct module
   [ ] Activity feed shows entries from all modules
   [ ] Module overview chart reflects actual counts
   
   GLOBAL SEARCH
   [ ] Typing in search bar shows dropdown results
   [ ] Results include items from all 6 modules
   [ ] Clicking a result navigates to module and opens detail
   [ ] Escape key closes search results
   [ ] Click outside closes search results
   [ ] Debounce works (no flicker on fast typing)
   
   ASSEMBLY & SUBASSEMBLY
   [ ] Add/edit/delete assemblies works
   [ ] Add/edit/delete subassemblies works
   [ ] Rack assignment dropdown populates correctly
   
   RISK REGISTER
   [ ] All CRUD operations work (add, edit, delete, duplicate)
   [ ] Criticality scoring calculates correctly (Q+C+S+R)
   [ ] Formal Action flag triggers at factor≥5 or sum≥16
   [ ] Status/rack filters work in sidebar
   [ ] Search filters risks by title/description/owner/ID
   [ ] Sort by any column works both directions
   [ ] Detail panel shows all fields correctly
   [ ] History tracking records changes
   [ ] Report generation works (copy, new tab)
   [ ] Cross-link: linked actions shown in detail panel
   
   ACTION TRACKER
   [ ] Quick-add bar creates actions correctly
   [ ] Table view: sort, filter, search all work
   [ ] Kanban view: cards appear in correct columns
   [ ] Edit modal populates correctly
   [ ] Due date overdue highlighting works
   [ ] Cross-link: linked risk shown in detail panel
   
   BOM MANAGER
   [ ] Hierarchical tree expand/collapse works
   [ ] Add/edit items at any level
   [ ] Cost calculations (unitCost × qtyRequired)
   [ ] Shortfall detection (qtyRequired > qtyOnHand with qtyOnHand > 0)
   [ ] Category and status filters work
   [ ] Cross-link: linked inventory items shown in detail
   
   INVENTORY TRACKER
   [ ] CRUD operations work
   [ ] Status/location filters work
   [ ] Part# links to BOM (clickable)
   [ ] Search works across all fields
   
   SECURITY HW REVIEW
   [ ] Add/edit/delete equipment works
   [ ] Dynamic memory table (add/remove rows)
   [ ] Mobile system conditional fields show/hide
   [ ] Document compliance checkboxes work
   [ ] Classification color-coding displays correctly
   [ ] HW Report Generator: select up to 4 items
   [ ] Report: Copy TSV, Download CSV, Print View all work
   [ ] Cross-link: assembly link shown in detail
   
   BULK ACTIONS
   [ ] Checkbox column appears in all tables
   [ ] Select all checkbox works
   [ ] Bulk bar appears when items selected
   [ ] Delete selected works with confirmation
   [ ] Change status works
   [ ] Export selected CSV downloads correctly
   [ ] Selection clears on module switch
   
   CROSS-MODULE LINKS
   [ ] Risk detail → linked actions (clickable)
   [ ] Action detail → linked risk (clickable)
   [ ] BOM detail → linked inventory (clickable)
   [ ] Inventory detail → linked BOM (clickable)
   [ ] HW detail → linked assembly (clickable)
   
   PRINT
   [ ] @media print hides nav, sidebar, buttons, modals
   [ ] Tables print with borders and readable text
   [ ] Page breaks don't split chart sections
   
   SETTINGS
   [ ] Tool title updates header
   [ ] Module names update nav and everywhere
   [ ] Dropdown list editing works (add/remove items)
   [ ] Accent color changes propagate
   
   EXPORT / IMPORT
   [ ] Export creates valid JSON with all data
   [ ] Import restores all data correctly
   [ ] Import with bad data shows error gracefully
   [ ] Drag-and-drop import works
   
   CONSTRAINTS
   [ ] No external network requests (works offline)
   [ ] No localStorage/sessionStorage usage
   [ ] No eval() or Function() calls
   [ ] File opens via file:// protocol
   [ ] Single file, all CSS in <style>, all JS in <script>
═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   LINKS MODULE
   ═══════════════════════════════════════════════ */
function sanitizeLinkUrl(url){
  if(!url)return '#';
  var s=String(url).trim();
  if(/[\u0000-\u0020\u007f]/.test(s))return '#';
  if(s.startsWith('#'))return s;
  if(!/^[a-z][a-z0-9+.-]*:/i.test(s)&&!s.startsWith('/'))s='https://'+s;
  try{var parsed=new URL(s,location.href);return ['http:','https:','mailto:','tel:'].includes(parsed.protocol)?parsed.href:'#';}catch(e){return '#';}
}
function renderLinksModule(area){
  var sections = appState.linkSections || [];
  var specs = appState.specifications || [];
  var modName = esc(appState.settings.moduleNames.links||'Links & Specs');
  var html = '<div class="module-header"><h2>'+modName+'</h2>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
  html += '<button class="btn btn-primary" onclick="addLinkSection()">+ New Section</button>';
  html += '<button class="btn btn-sm" onclick="toggleSpecsSidebar()" id="linksSpecsToggleBtn" title="Show/Hide Specs sidebar">☰ Toggle Specs</button>';
  html += '</div></div>';
  html += '<div class="links-layout" id="linksLayout">';
  // LEFT: link sections column
  html += '<div class="links-main" id="linksMainCol">';
  if(sections.length===0){
    html += '<div class="empty-state"><div class="es-icon">&#8599;</div><h3>No link sections yet</h3><p>Create a section to organize bookmarks, references, and external resources.</p><button class="btn btn-primary" onclick="addLinkSection()" style="margin-top:12px">+ Create First Section</button></div>';
  } else {
    html += renderLinkSectionsHtml(sections);
  }
  html += '</div>';
  // RIGHT: specs sidebar
  html += renderSpecsSidebarHtml(specs);
  html += '</div>';
  area.innerHTML = html;
}
function renderLinkSectionsHtml(sections){
  var html = '';
  sections.forEach(function(sec){
    html += '<div class="link-section" data-sec="'+sec.id+'" style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:16px">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;border-bottom:1px solid var(--border);padding-bottom:10px;flex-wrap:wrap">';
    html += '<input type="text" value="'+esc(sec.name||'')+'" placeholder="Section name" onchange="updateLinkSectionName('+sec.id+',this.value)" aria-label="Section name" style="flex:1;min-width:200px;background:transparent;border:1px solid transparent;color:var(--text-primary);font-size:16px;font-weight:600;padding:4px 6px;border-radius:4px" onfocus="this.style.border=\'1px solid var(--accent)\';this.style.background=\'var(--bg-primary)\'" onblur="this.style.border=\'1px solid transparent\';this.style.background=\'transparent\'">';
    html += '<button class="btn btn-sm" onclick="addLinkInSection('+sec.id+')">+ Add Link</button>';
    html += '<button class="btn btn-sm btn-danger" onclick="deleteLinkSection('+sec.id+')">Delete Section</button>';
    html += '</div>';
    var links = sec.links || [];
    if(links.length===0){
      html += '<div style="color:var(--text-muted);text-align:center;padding:18px;font-size:13px">No links yet &mdash; click "+ Add Link" to get started.</div>';
    } else {
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">';
      links.forEach(function(lk){
        var safeUrl = sanitizeLinkUrl(lk.url);
        var hoverDesc = lk.description || lk.url || '';
        html += '<div class="link-card" data-link="'+lk.id+'" style="background:var(--bg-tertiary);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:var(--radius);padding:10px;position:relative">';
        html += '<div class="link-view">';
        html += '<a href="'+esc(safeUrl)+'" target="_blank" rel="noopener noreferrer" title="'+esc(hoverDesc)+'" style="color:var(--accent);font-weight:600;text-decoration:none;display:block;word-break:break-word;padding-right:48px">'+esc(lk.label||lk.url||'(unnamed link)')+'</a>';
        if(lk.description){
          html += '<div style="color:var(--text-muted);font-size:11px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+esc(lk.description)+'">'+esc(lk.description)+'</div>';
        }
        html += '<div style="position:absolute;top:6px;right:6px;display:flex;gap:2px">';
        html += '<button class="btn btn-sm" aria-label="Edit link" title="Edit" onclick="toggleLinkEdit('+sec.id+','+lk.id+')" style="padding:2px 7px;font-size:11px">Edit</button>';
        html += '<button class="btn btn-sm btn-danger" aria-label="Delete link" title="Delete" onclick="deleteLinkInSection('+sec.id+','+lk.id+')" style="padding:2px 7px;font-size:11px">X</button>';
        html += '</div>';
        html += '</div>';
        html += '<div class="link-edit" style="display:none">';
        html += '<input type="text" value="'+esc(lk.label||'')+'" placeholder="Label" aria-label="Link label" oninput="updateLink('+sec.id+','+lk.id+',\'label\',this.value)" style="width:100%;background:var(--bg-primary);border:1px solid var(--border);color:var(--text-primary);padding:4px 6px;border-radius:4px;font-size:12px;margin-bottom:4px;box-sizing:border-box">';
        html += '<input type="text" value="'+esc(lk.url||'')+'" placeholder="https://..." aria-label="Link URL" oninput="updateLink('+sec.id+','+lk.id+',\'url\',this.value)" style="width:100%;background:var(--bg-primary);border:1px solid var(--border);color:var(--text-primary);padding:4px 6px;border-radius:4px;font-size:12px;margin-bottom:4px;font-family:var(--font-mono);box-sizing:border-box">';
        html += '<textarea placeholder="Description (shown on hover)" aria-label="Link description" oninput="updateLink('+sec.id+','+lk.id+',\'description\',this.value)" rows="2" style="width:100%;background:var(--bg-primary);border:1px solid var(--border);color:var(--text-primary);padding:4px 6px;border-radius:4px;font-size:11px;margin-bottom:4px;resize:vertical;box-sizing:border-box;font-family:inherit">'+esc(lk.description||'')+'</textarea>';
        html += '<button class="btn btn-sm btn-primary" onclick="toggleLinkEdit('+sec.id+','+lk.id+')" style="font-size:11px">Done</button>';
        html += '</div>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  return html;
}
function renderSpecsSidebarHtml(specs){
  var html = '<aside class="specs-sidebar" id="specsSidebar">';
  html += '<div class="specs-sidebar-header">';
  html += '<h3 style="margin:0;font-size:14px">Specifications</h3>';
  html += '<button class="btn btn-sm btn-primary" onclick="addSpecification()" title="Add specification" style="padding:2px 8px;font-size:11px">+ Add</button>';
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">Document #'+String.fromCharCode(160)+'&amp; description memory (MIL-SPEC, SOPs, drawing #s, etc.)</div>';
  // Search
  html += '<input type="text" id="specsSearchInput" class="search-input" placeholder="Filter specs..." oninput="specsSearchInput(this)" value="'+esc(_specsSearch||'')+'" aria-label="Search specifications" style="width:100%;margin-bottom:8px;box-sizing:border-box">';
  var filtered = specs;
  if(_specsSearch){
    var q=_specsSearch.toLowerCase();
    filtered = specs.filter(function(s){
      return (s.docNumber||'').toLowerCase().indexOf(q)>=0 || (s.description||'').toLowerCase().indexOf(q)>=0;
    });
  }
  if(specs.length === 0){
    html += '<div style="color:var(--text-muted);font-size:12px;padding:14px 8px;text-align:center;border:1px dashed var(--border);border-radius:6px">No specs saved yet. Click <b>+ Add</b> to start.</div>';
  } else {
    html += '<div class="table-wrapper" style="margin:0"><table class="data-table specs-table"><thead><tr>';
    html += '<th style="width:38%">Doc #</th><th>Description</th><th style="width:46px"></th>';
    html += '</tr></thead><tbody>';
    if(filtered.length === 0){
      html += '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:10px;font-size:12px">No specs match filter.</td></tr>';
    }
    filtered.forEach(function(sp){
      html += '<tr data-spec="'+sp.id+'">';
      html += '<td><input type="text" value="'+esc(sp.docNumber||'')+'" oninput="updateSpec('+sp.id+',\'docNumber\',this.value)" placeholder="e.g. MIL-STD-461" aria-label="Document number" style="width:100%;background:transparent;border:1px solid transparent;color:var(--text-primary);padding:3px 4px;border-radius:4px;font-family:var(--font-mono);font-size:12px;box-sizing:border-box" onfocus="this.style.border=\'1px solid var(--accent)\';this.style.background=\'var(--bg-primary)\'" onblur="this.style.border=\'1px solid transparent\';this.style.background=\'transparent\'"></td>';
      html += '<td><input type="text" value="'+esc(sp.description||'')+'" oninput="updateSpec('+sp.id+',\'description\',this.value)" placeholder="Short description" aria-label="Description" style="width:100%;background:transparent;border:1px solid transparent;color:var(--text-primary);padding:3px 4px;border-radius:4px;font-size:12px;box-sizing:border-box" onfocus="this.style.border=\'1px solid var(--accent)\';this.style.background=\'var(--bg-primary)\'" onblur="this.style.border=\'1px solid transparent\';this.style.background=\'transparent\'"></td>';
      html += '<td style="text-align:center"><button class="btn btn-sm btn-danger" title="Delete spec" aria-label="Delete spec" onclick="deleteSpecification('+sp.id+')" style="padding:2px 6px;font-size:11px">X</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    html += '<div style="font-size:11px;color:var(--text-muted);margin-top:8px;text-align:right">'+specs.length+' spec'+(specs.length===1?'':'s')+' saved</div>';
  }
  html += '</aside>';
  return html;
}
var _specsSearch = '';
var _specsSidebarVisible = true;
function specsSearchInput(el){
  _specsSearch = el.value;
  debounce('specsSearch', function(){
    var caret = document.activeElement === el ? el.selectionStart : null;
    renderContent();
    var restored = document.getElementById('specsSearchInput');
    if(restored){ restored.focus(); if(caret!=null){ try{ restored.setSelectionRange(caret,caret); }catch(e){} } }
  }, 180);
}
function toggleSpecsSidebar(){
  _specsSidebarVisible = !_specsSidebarVisible;
  var sb = document.getElementById('specsSidebar');
  var layout = document.getElementById('linksLayout');
  if(sb && layout){
    if(_specsSidebarVisible){
      sb.style.display='';
      layout.classList.remove('specs-hidden');
    } else {
      sb.style.display='none';
      layout.classList.add('specs-hidden');
    }
  }
}
function addSpecification(){
  snapshotForUndo('Add specification');
  if(!Array.isArray(appState.specifications)) appState.specifications = [];
  var sp = { id: appState._specNextId++, docNumber: '', description: '', createdDate: todayStr() };
  appState.specifications.push(sp);
  logActivity('links','Created','SPEC-'+sp.id,'New specification');
  markUnsaved();
  renderContent();
  // focus the new row's doc# input
  setTimeout(function(){
    var row = document.querySelector('.specs-table tr[data-spec="'+sp.id+'"] input');
    if(row) row.focus();
  }, 50);
}
function updateSpec(id, field, value){
  if(!Array.isArray(appState.specifications)) return;
  var sp = appState.specifications.find(function(x){return x.id===id;});
  if(!sp) return;
  if(sp[field] === value) return;
  var maxLen = field==='docNumber' ? 120 : 400;
  sp[field] = String(value||'').substring(0, maxLen);
  sp.updatedDate = todayStr();
  markUnsaved();
}
function deleteSpecification(id){
  if(!Array.isArray(appState.specifications)) return;
  var sp = appState.specifications.find(function(x){return x.id===id;});
  if(!sp) return;
  var label = sp.docNumber || sp.description || 'Spec SPEC-'+id;
  showConfirm('Delete Specification','Delete "'+esc(label)+'"? This cannot be undone.','Delete',function(){
    snapshotForUndo('Delete specification');
    appState.specifications = appState.specifications.filter(function(x){return x.id!==id;});
    logActivity('links','Deleted','SPEC-'+id,'Removed: '+label);
    markUnsaved();
    renderContent();
    toast('Specification deleted','success');
  });
}
function addLinkSection(){
  snapshotForUndo('Add link section');
  var sec = { id: appState._linkSecNextId++, name: 'New Section', links: [] };
  appState.linkSections.push(sec);
  logActivity('links','Created','SEC-'+sec.id,'New link section');
  markUnsaved();
  renderContent();
  buildNav();
}
function deleteLinkSection(secId){
  var sec = appState.linkSections.find(function(s){return s.id===secId;});
  if(!sec) return;
  var nm = sec.name || '(unnamed section)';
  var cnt = (sec.links||[]).length;
  showConfirm('Delete Section','Delete section "'+esc(nm)+'" and all '+cnt+' link'+(cnt===1?'':'s')+'?','Delete',function(){
    snapshotForUndo('Delete link section');
    appState.linkSections = appState.linkSections.filter(function(s){return s.id!==secId;});
    logActivity('links','Deleted','SEC-'+secId,'Section: '+nm);
    markUnsaved();
    renderContent();
    buildNav();
    toast('Section deleted','success');
  });
}
function updateLinkSectionName(secId, name){
  var sec = appState.linkSections.find(function(s){return s.id===secId;});
  if(!sec) return;
  if(sec.name === name) return;
  snapshotForUndo('Rename link section');
  sec.name = String(name||'').substring(0,200);
  markUnsaved();
}
function addLinkInSection(secId){
  var sec = appState.linkSections.find(function(s){return s.id===secId;});
  if(!sec) return;
  snapshotForUndo('Add link');
  if(!Array.isArray(sec.links)) sec.links = [];
  var lk = { id: appState._linkNextId++, label: 'New link', url: '', description: '' };
  sec.links.push(lk);
  logActivity('links','Created','LK-'+lk.id,'New link in '+(sec.name||'section'));
  markUnsaved();
  renderContent();
  buildNav();
}
function deleteLinkInSection(secId, linkId){
  var sec = appState.linkSections.find(function(s){return s.id===secId;});
  if(!sec || !Array.isArray(sec.links)) return;
  var lk = sec.links.find(function(x){return x.id===linkId;});
  if(!lk) return;
  snapshotForUndo('Delete link');
  sec.links = sec.links.filter(function(x){return x.id!==linkId;});
  logActivity('links','Deleted','LK-'+linkId,'Removed: '+(lk.label||lk.url||'link'));
  markUnsaved();
  renderContent();
  buildNav();
}
function updateLink(secId, linkId, field, value){
  var sec = appState.linkSections.find(function(s){return s.id===secId;});
  if(!sec || !Array.isArray(sec.links)) return;
  var lk = sec.links.find(function(x){return x.id===linkId;});
  if(!lk) return;
  if(lk[field] === value) return;
  var maxLen = field==='url' ? 2000 : (field==='description' ? 500 : 200);
  lk[field] = String(value||'').substring(0,maxLen);
  markUnsaved();
}
function toggleLinkEdit(secId, linkId){
  var card = document.querySelector('.link-section[data-sec="'+secId+'"] .link-card[data-link="'+linkId+'"]');
  if(!card) return;
  var view = card.querySelector('.link-view');
  var edit = card.querySelector('.link-edit');
  if(!view || !edit) return;
  if(edit.style.display === 'none'){
    view.style.display = 'none';
    edit.style.display = 'block';
    var firstInput = edit.querySelector('input');
    if(firstInput) firstInput.focus();
  } else {
    view.style.display = 'block';
    edit.style.display = 'none';
    renderContent();
  }
}

/* ═══════════════════════════════════════════════
   PROCUREMENT MODULE (Purchase + Delivery Tracker)
   ═══════════════════════════════════════════════ */
var PROC_STATUSES = ['Needed','Requested','Ordered','Shipped','Received','Cancelled'];
var PROC_CATEGORIES = ['Material','Equipment','Tool','Software','Service','Consumable','Other'];
var procSubView = 'toPurchase'; // 'toPurchase' | 'inTransit' | 'received' | 'all'
var _procSearch = '';
var _procStatusFilter = '';
var _procCatFilter = '';
var _procSortField = 'dateNeeded';
var _procSortDir = 'asc';
function procFmtId(id){return 'PO-'+String(id).padStart(4,'0');}
function procStatusPill(status){
  var map = {'Needed':'proc-status-needed','Requested':'proc-status-requested','Ordered':'proc-status-ordered','Shipped':'proc-status-shipped','Received':'proc-status-received','Cancelled':'proc-status-cancelled'};
  var cls = map[status] || 'proc-status-needed';
  return '<span class="proc-status-pill '+cls+'">'+esc(status||'Needed')+'</span>';
}
function procIsOverdue(p){
  if(p.status==='Received'||p.status==='Cancelled') return false;
  // overdue if ETA or dateNeeded is in the past
  var today = todayStr();
  if(p.eta && p.eta < today) return true;
  if(!p.eta && p.dateNeeded && p.dateNeeded < today) return true;
  return false;
}
function procSubViewFilter(p, view){
  if(view === 'all') return true;
  if(view === 'toPurchase') return p.status === 'Needed' || p.status === 'Requested';
  if(view === 'inTransit') return p.status === 'Ordered' || p.status === 'Shipped';
  if(view === 'received') return p.status === 'Received' || p.status === 'Cancelled';
  return true;
}
function v95_renderProcurementModule(area){
  if(!Array.isArray(appState.purchases)) appState.purchases = [];
  var items = appState.purchases;
  var byView = {
    toPurchase: items.filter(function(p){return procSubViewFilter(p,'toPurchase');}),
    inTransit: items.filter(function(p){return procSubViewFilter(p,'inTransit');}),
    received: items.filter(function(p){return procSubViewFilter(p,'received');}),
    all: items
  };
  var counts = { toPurchase: byView.toPurchase.length, inTransit: byView.inTransit.length, received: byView.received.length, all: items.length };
  var filtered = byView[procSubView] || items;
  // Apply search + status + category filters
  filtered = filtered.filter(function(p){
    if(_procStatusFilter && p.status !== _procStatusFilter) return false;
    if(_procCatFilter && p.category !== _procCatFilter) return false;
    if(_procSearch){
      var q = _procSearch.toLowerCase();
      return (p.itemName||'').toLowerCase().indexOf(q)>=0
        || (p.vendor||'').toLowerCase().indexOf(q)>=0
        || (p.partNumber||'').toLowerCase().indexOf(q)>=0
        || (p.poNumber||'').toLowerCase().indexOf(q)>=0
        || (p.requester||'').toLowerCase().indexOf(q)>=0
        || (p.trackingNumber||'').toLowerCase().indexOf(q)>=0;
    }
    return true;
  });
  // Sort
  filtered.sort(function(a,b){
    var av=a[_procSortField], bv=b[_procSortField];
    if(av==null) av = '';
    if(bv==null) bv = '';
    if(typeof av==='number'&&typeof bv==='number') return _procSortDir==='asc'?av-bv:bv-av;
    av = String(av).toLowerCase(); bv = String(bv).toLowerCase();
    if(av<bv) return _procSortDir==='asc'?-1:1;
    if(av>bv) return _procSortDir==='asc'?1:-1;
    return 0;
  });

  // KPIs
  var totalValue = 0, openValue = 0, receivedValue = 0, overdueCount = 0;
  items.forEach(function(p){
    var lineTotal = pmdMultiply(p.qty,p.unitCost);
    totalValue += lineTotal;
    if(p.status==='Received') receivedValue += lineTotal;
    else if(p.status!=='Cancelled') openValue += lineTotal;
    if(procIsOverdue(p)) overdueCount++;
  });

  var html = '<div class="module-header"><h2>'+esc(appState.settings.moduleNames.procurement||'Procurement')+'</h2><button class="btn btn-primary" onclick="openPurchaseModal()">+ New Purchase Item</button></div>';

  // KPI row
  html += '<div class="kpi-row">';
  html += '<div class="kpi-card"><div class="kpi-value">'+items.length+'</div><div class="kpi-label">Total Items</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:var(--warning)">'+counts.toPurchase+'</div><div class="kpi-label">To Purchase</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:var(--info)">'+counts.inTransit+'</div><div class="kpi-label">In Transit</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:var(--success)">'+counts.received+'</div><div class="kpi-label">Received/Closed</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:'+(overdueCount>0?'var(--danger)':'var(--text-muted)')+'">'+overdueCount+'</div><div class="kpi-label">Overdue</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="font-size:17px">$'+fmtCost(openValue)+'</div><div class="kpi-label">Open Value</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="font-size:17px">$'+fmtCost(totalValue)+'</div><div class="kpi-label">Total Value</div></div>';
  html += '</div>';

  // Sub-view tabs
  var tabs = [
    {k:'toPurchase', l:'To Purchase ('+counts.toPurchase+')'},
    {k:'inTransit', l:'Ordered / In Transit ('+counts.inTransit+')'},
    {k:'received', l:'Received / Closed ('+counts.received+')'},
    {k:'all', l:'All ('+counts.all+')'}
  ];
  html += '<div class="proc-subview-bar">';
  tabs.forEach(function(t){
    html += '<button class="btn btn-sm'+(procSubView===t.k?' active':'')+'" onclick="setProcSubView(\''+t.k+'\')">'+esc(t.l)+'</button>';
  });
  html += '</div>';

  // Filter bar
  html += '<div class="filter-bar">';
  html += '<input type="text" class="search-input" id="procSearchInput" placeholder="Search items, vendor, part #, PO #, tracking..." value="'+esc(_procSearch)+'" oninput="procSearchInput(this)">';
  html += '<select class="filter-select" onchange="_procStatusFilter=this.value;renderContent();"><option value="">All Statuses</option>';
  PROC_STATUSES.forEach(function(s){html += '<option value="'+s+'"'+(s===_procStatusFilter?' selected':'')+'>'+esc(s)+'</option>';});
  html += '</select>';
  html += '<select class="filter-select" onchange="_procCatFilter=this.value;renderContent();"><option value="">All Categories</option>';
  PROC_CATEGORIES.forEach(function(c){html += '<option value="'+c+'"'+(c===_procCatFilter?' selected':'')+'>'+esc(c)+'</option>';});
  html += '</select>';
  html += '</div>';

  // Table
  html += '<div class="table-wrapper"><table class="data-table"><thead><tr>';
  var cols = [
    {k:'itemName', l:'Item'},
    {k:'vendor', l:'Vendor'},
    {k:'partNumber', l:'Part #'},
    {k:'qty', l:'Qty'},
    {k:'unitCost', l:'Unit $'},
    {k:'status', l:'Status'},
    {k:'poNumber', l:'PO #'},
    {k:'dateNeeded', l:'Needed'},
    {k:'eta', l:'ETA'},
    {k:'dateReceived', l:'Received'}
  ];
  cols.forEach(function(c){html += '<th class="sortable" onclick="procSort(\''+c.k+'\')">'+c.l+(_procSortField===c.k?(_procSortDir==='asc'?' ^':' v'):'')+'</th>';});
  html += '<th>Total</th><th>Actions</th></tr></thead><tbody>';

  if(filtered.length === 0){
    html += '<tr><td colspan="'+(cols.length+2)+'" style="text-align:center;padding:2rem;color:var(--text-muted)">No purchase items '+(items.length===0?'yet — click "+ New Purchase Item" to add something that needs to be bought.':'match the current filters.')+'</td></tr>';
  }
  filtered.forEach(function(p){
    var total = pmdMultiply(p.qty,p.unitCost);
    var overdue = procIsOverdue(p);
    html += '<tr>';
    html += '<td><a href="#" onclick="openPurchaseDetail('+p.id+');return false;">'+esc(p.itemName||'(unnamed)')+'</a></td>';
    html += '<td>'+esc(p.vendor||'—')+'</td>';
    html += '<td style="font-family:var(--font-mono);font-size:12px">'+esc(p.partNumber||'—')+'</td>';
    html += '<td style="text-align:right;font-family:var(--font-mono)">'+esc(String(p.qty||0))+'</td>';
    html += '<td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(p.unitCost)+'</td>';
    html += '<td>'+procStatusPill(p.status||'Needed')+'</td>';
    html += '<td style="font-family:var(--font-mono);font-size:12px">'+esc(p.poNumber||'—')+'</td>';
    html += '<td'+(overdue?' class="proc-overdue"':'')+'>'+esc(p.dateNeeded ? fmtDateShort(p.dateNeeded) : '—')+'</td>';
    html += '<td'+(overdue?' class="proc-overdue"':'')+'>'+esc(p.eta ? fmtDateShort(p.eta) : '—')+'</td>';
    html += '<td>'+esc(p.dateReceived ? fmtDateShort(p.dateReceived) : '—')+'</td>';
    html += '<td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(total)+'</td>';
    html += '<td>';
    // Status advance quick buttons
    var next = procNextStatus(p.status||'Needed');
    if(next){
      html += '<button class="btn btn-sm" title="Advance to '+next+'" onclick="advancePurchaseStatus('+p.id+')" style="padding:2px 6px;font-size:11px">→ '+esc(next)+'</button> ';
    }
    html += '<button class="btn btn-sm" onclick="openPurchaseModal('+p.id+')">Edit</button> ';
    html += '<button class="btn btn-sm btn-danger" onclick="deletePurchase('+p.id+')">Del</button>';
    html += '</td></tr>';
  });
  html += '</tbody></table></div>';

  // Vendor rollup (only if ≥2 vendors)
  if(items.length >= 2){
    var vendorMap = {};
    items.forEach(function(p){
      var v = (p.vendor||'(No vendor)');
      if(!vendorMap[v]) vendorMap[v] = { count:0, open:0, total:0 };
      vendorMap[v].count++;
      var t = pmdMultiply(p.qty,p.unitCost);
      vendorMap[v].total += t;
      if(p.status!=='Received'&&p.status!=='Cancelled') vendorMap[v].open += t;
    });
    var vendorKeys = Object.keys(vendorMap).sort();
    if(vendorKeys.length > 1){
      html += '<div style="background:var(--bg-secondary);border-radius:var(--radius);padding:12px;margin-top:16px"><div style="font-weight:600;margin-bottom:8px">Vendor Rollup</div>';
      html += '<table class="data-table" style="font-size:12px"><thead><tr><th>Vendor</th><th>Items</th><th style="text-align:right">Open $</th><th style="text-align:right">Total $</th></tr></thead><tbody>';
      vendorKeys.forEach(function(k){
        var v = vendorMap[k];
        html += '<tr><td>'+esc(k)+'</td><td>'+v.count+'</td><td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(v.open)+'</td><td style="text-align:right;font-family:var(--font-mono)">$'+fmtCost(v.total)+'</td></tr>';
      });
      html += '</tbody></table></div>';
    }
  }

  area.innerHTML = html;
}
function procSearchInput(el){
  _procSearch = el.value;
  debounce('procSearch', function(){
    var caret = document.activeElement === el ? el.selectionStart : null;
    renderContent();
    var restored = document.getElementById('procSearchInput');
    if(restored){ restored.focus(); if(caret!=null){ try{ restored.setSelectionRange(caret,caret); }catch(e){} } }
  }, 180);
}
function setProcSubView(v){ procSubView = v; renderContent(); }
function procSort(field){
  if(_procSortField === field) _procSortDir = _procSortDir==='asc'?'desc':'asc';
  else { _procSortField = field; _procSortDir = 'asc'; }
  renderContent();
}


function openPurchaseModal(editId){
  var p = editId ? appState.purchases.find(function(x){return x.id===editId;}) : null;
  var title = p ? 'Edit Purchase Item' : 'New Purchase Item';

  var html = '<div style="max-height:65vh;overflow-y:auto;padding:0.5rem;">';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 12px;">';
  html += '<div style="grid-column:span 2"><label>Item Name *</label><input id="purItemName" class="form-input" value="'+esc(p?p.itemName||'':'')+'" placeholder="What are you buying?" required></div>';
  html += '<div><label>Vendor</label><input id="purVendor" class="form-input" value="'+esc(p?p.vendor||'':'')+'" placeholder="Supplier name" oninput="refreshVendorLeadTimeHint()"><div id="purVendorHint" style="display:none;font-size:11px;color:var(--accent);margin-top:2px"></div></div>';
  html += '<div><label>Part / Model #</label><input id="purPartNumber" class="form-input" value="'+esc(p?p.partNumber||'':'')+'" placeholder="MFG part number"></div>';
  html += '<div><label>Category</label><select id="purCategory" class="form-input">';
  PROC_CATEGORIES.forEach(function(c){html += '<option'+(p&&p.category===c?' selected':'')+'>'+esc(c)+'</option>';});
  html += '</select></div>';
  html += '<div><label>Status</label><select id="purStatus" class="form-input">';
  PROC_STATUSES.forEach(function(s){html += '<option'+(p&&p.status===s?' selected':(!p&&s==='Needed'?' selected':''))+'>'+esc(s)+'</option>';});
  html += '</select></div>';
  html += '<div><label>Qty</label><input id="purQty" class="form-input" type="number" step="1" min="0" value="'+(p?p.qty||1:1)+'"></div>';
  html += '<div><label>Unit Cost ($)</label><input id="purUnitCost" class="form-input" type="number" step="0.01" min="0" value="'+(p?p.unitCost||0:0)+'"></div>';
  html += '<div><label>Requester</label><input id="purRequester" class="form-input" value="'+esc(p?p.requester||'':'')+'" placeholder="Who needs it"></div>';
  html += '<div><label>PO #</label><input id="purPoNumber" class="form-input" value="'+esc(p?p.poNumber||'':'')+'" placeholder="Purchase order #"></div>';
  html += '<div><label>Date Needed</label><input id="purDateNeeded" class="form-input" type="date" value="'+esc(p?p.dateNeeded||'':'')+'"></div>';
  html += '<div><label>Date Ordered</label><input id="purDateOrdered" class="form-input" type="date" value="'+esc(p?p.dateOrdered||'':'')+'"></div>';
  html += '<div><label>ETA</label><input id="purEta" class="form-input" type="date" value="'+esc(p?p.eta||'':'')+'"></div>';
  html += '<div><label>Date Received</label><input id="purDateReceived" class="form-input" type="date" value="'+esc(p?p.dateReceived||'':'')+'"></div>';
  html += '<div style="grid-column:span 2"><label>Tracking #</label><input id="purTrackingNumber" class="form-input" value="'+esc(p?p.trackingNumber||'':'')+'" placeholder="Shipper tracking"></div>';
  html += '<div><label>Linked BOM ID</label><input id="purLinkedBom" class="form-input" value="'+esc(p?p.linkedBomId||'':'')+'" placeholder="e.g. BOM-0012"></div>';
  html += '<div><label>Linked Cost ID</label><input id="purLinkedCost" class="form-input" value="'+esc(p?p.linkedCostId||'':'')+'" placeholder="e.g. COST-003"></div>';
  html += '<div style="grid-column:span 2"><label>Notes</label><textarea id="purNotes" class="form-input" rows="3">'+esc(p?p.notes||'':'')+'</textarea></div>';
  html += '</div>';
  html += '<div style="margin-top:1rem;text-align:right;"><button class="btn btn-primary" onclick="savePurchase('+(p?p.id:'null')+')">Save</button> <button class="btn" onclick="closeConfirm()">Cancel</button></div>';
  html += '</div>';

  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').style.display = 'none';
  pendingConfirmCallback = null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
  setTimeout(refreshVendorLeadTimeHint, 50); /* F2: refresh on open for edit case */
}
function savePurchase(editId){
  var itemName = ((document.getElementById('purItemName')||{}).value||'').trim();
  if(!itemName){ toast('Item Name is required','error'); return; }
  var data = {
    itemName: itemName,
    vendor: (document.getElementById('purVendor')||{}).value||'',
    partNumber: (document.getElementById('purPartNumber')||{}).value||'',
    category: (document.getElementById('purCategory')||{}).value||'Material',
    status: (document.getElementById('purStatus')||{}).value||'Needed',
    qty: pmdNumber('purQty'),
    unitCost: pmdNumber('purUnitCost'),
    requester: (document.getElementById('purRequester')||{}).value||'',
    poNumber: (document.getElementById('purPoNumber')||{}).value||'',
    dateNeeded: (document.getElementById('purDateNeeded')||{}).value||'',
    dateOrdered: (document.getElementById('purDateOrdered')||{}).value||'',
    eta: (document.getElementById('purEta')||{}).value||'',
    dateReceived: (document.getElementById('purDateReceived')||{}).value||'',
    trackingNumber: (document.getElementById('purTrackingNumber')||{}).value||'',
    linkedBomId: (document.getElementById('purLinkedBom')||{}).value||'',
    linkedCostId: (document.getElementById('purLinkedCost')||{}).value||'',
    notes: (document.getElementById('purNotes')||{}).value||''
  };
  if(editId!==null){
    var p = appState.purchases.find(function(x){return x.id===editId;});
    if(!p){ toast('Purchase item not found','error'); return; }
    var diffs = [];
    Object.keys(data).forEach(function(k){
      if(String(p[k]||'') !== String(data[k]||'')) diffs.push({field:k, oldVal:String(p[k]||''), newVal:String(data[k])});
    });
    Object.keys(data).forEach(function(k){ p[k] = data[k]; });
    p.updatedDate = todayStr();
    auditRecord('procurement', p.id, 'edited', diffs, p.itemName);
    logActivity('Procurement','Updated',procFmtId(p.id), p.itemName);
    toast('Purchase item updated','success');
  } else {
    snapshotForUndo('Create purchase item');
    data.id = appState._purchaseNextId++;
    data.createdDate = todayStr();
    data.updatedDate = todayStr();
    appState.purchases.push(data);
    auditRecord('procurement', data.id, 'created', [{field:'Item', oldVal:'', newVal:data.itemName}], data.itemName);
    logActivity('Procurement','Created',procFmtId(data.id), data.itemName);
    toast('Purchase item created','success');
  }
  markUnsaved();
  closeConfirm();
  renderContent();
}
function v95_openPurchaseDetail(id){
  var p = appState.purchases.find(function(x){return x.id===id;});
  if(!p) return;
  var total = pmdMultiply(p.qty,p.unitCost);
  var overdue = procIsOverdue(p);
  var html = '<div class="detail-grid">';
  html += '<div class="detail-field"><span class="detail-label">ID</span><span>'+procFmtId(p.id)+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Item</span><span>'+esc(p.itemName||'')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Status</span><span>'+procStatusPill(p.status||'Needed')+(overdue?' <span style="color:var(--red);font-size:11px">OVERDUE</span>':'')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Category</span><span>'+esc(p.category||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Vendor</span><span>'+esc(p.vendor||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Part / Model #</span><span style="font-family:var(--font-mono)">'+esc(p.partNumber||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Qty</span><span style="font-family:var(--font-mono)">'+esc(String(p.qty||0))+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Unit Cost</span><span style="font-family:var(--font-mono)">$'+fmtCost(p.unitCost)+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Line Total</span><span style="font-family:var(--font-mono);font-weight:700">$'+fmtCost(total)+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">PO #</span><span style="font-family:var(--font-mono)">'+esc(p.poNumber||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Requester</span><span>'+esc(p.requester||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Date Needed</span><span>'+esc(p.dateNeeded?fmtDate(p.dateNeeded):'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Date Ordered</span><span>'+esc(p.dateOrdered?fmtDate(p.dateOrdered):'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">ETA</span><span'+(overdue?' style="color:var(--red);font-weight:700"':'')+'>'+esc(p.eta?fmtDate(p.eta):'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Date Received</span><span>'+esc(p.dateReceived?fmtDate(p.dateReceived):'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Tracking #</span><span style="font-family:var(--font-mono)">'+esc(p.trackingNumber||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Linked BOM</span><span>'+esc(p.linkedBomId||'—')+'</span></div>';
  html += '<div class="detail-field"><span class="detail-label">Linked Cost</span><span>'+esc(p.linkedCostId||'—')+'</span></div>';
  html += '</div>';
  if(p.notes){ html += '<div style="margin-top:1rem"><strong>Notes:</strong><p style="margin:0.25rem 0;white-space:pre-wrap">'+esc(p.notes)+'</p></div>'; }
  if(typeof buildAuditHistoryHTML === 'function') html += renderAuditHistoryHTML('procurement', p.id);
  openDetailPanel(p.itemName+' ('+procFmtId(p.id)+')', html, function(){ closeDetailPanel(); openPurchaseModal(id); });
}


/* ═══════════════════════════════════════════════
   ACTION PLANNING MODULE
   ═══════════════════════════════════════════════ */
var AP_STATUSES = ['Not Started','In Progress','Blocked','Complete'];
var AP_STATUS_COLORS = {
  'Not Started': 'var(--text-muted)',
  'In Progress': 'var(--accent)',
  'Blocked': 'var(--red)',
  'Complete': 'var(--green)'
};
var _apDraggedCardId = null;
function apParseNumber(s){
  s = String(s||'');
  return s.split('.').map(function(seg){
    var m = /^(\d*)([a-zA-Z]*)(.*)$/.exec(seg) || [seg, '0', '', ''];
    return [parseInt(m[1],10)||0, (m[2]||'').toLowerCase(), m[3]||''];
  });
}
function apCompareNumber(a, b){
  var pa = apParseNumber(a), pb = apParseNumber(b);
  var n = Math.max(pa.length, pb.length);
  for(var i=0;i<n;i++){
    var sa = pa[i]||[0,'',''], sb = pb[i]||[0,'',''];
    if(sa[0]!==sb[0]) return sa[0]-sb[0];
    if(sa[1]!==sb[1]) return sa[1]<sb[1]?-1:1;
    if(sa[2]!==sb[2]) return sa[2]<sb[2]?-1:1;
  }
  return 0;
}
function apCardsInLane(laneId){
  var cards = (appState.actionPlanCards||[]).filter(function(c){return c.laneId===laneId;});
  cards.sort(function(a,b){return apCompareNumber(a.number, b.number);});
  return cards;
}
function apLaneById(laneId){
  return (appState.actionPlanLanes||[]).find(function(l){return l.id===laneId;});
}
function apCardById(cardId){
  return (appState.actionPlanCards||[]).find(function(c){return c.id===cardId;});
}
function apIncompleteDeps(card){
  if(!Array.isArray(card.dependsOn)) return [];
  return card.dependsOn.filter(function(depId){
    var dep = apCardById(depId);
    return dep && dep.status !== 'Complete';
  });
}
function apBlockingCards(cardId){
  return (appState.actionPlanCards||[]).filter(function(c){
    return Array.isArray(c.dependsOn) && c.dependsOn.indexOf(cardId)>=0;
  });
}
function renderActionPlanModule(area){
  var lanes = (appState.actionPlanLanes||[]).slice().sort(function(a,b){return (a.order||0)-(b.order||0);});
  var html = '<div class="module-header"><h2>'+esc(appState.settings.moduleNames.actionPlan||'Action Planning')+'</h2><div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="apAddLane()">+ New Lane</button></div></div>';
  if(lanes.length===0){
    html += '<div class="empty-state"><div class="es-icon">[ ]</div><h3>No lanes yet</h3><p>Create your first swim lane to start planning. Drag cards between lanes to track progress.</p><button class="btn btn-primary" onclick="apAddLane()" style="margin-top:12px">+ Create First Lane</button></div>';
    area.innerHTML = html;
    return;
  }
  var totalCards = (appState.actionPlanCards||[]).length;
  var byStatus = {'Not Started':0,'In Progress':0,'Blocked':0,'Complete':0};
  (appState.actionPlanCards||[]).forEach(function(c){if(byStatus[c.status]!==undefined)byStatus[c.status]++;});
  html += '<div class="kpi-row" style="margin-bottom:14px">';
  html += '<div class="kpi-card"><div class="kpi-value">'+totalCards+'</div><div class="kpi-label">Total Cards</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:var(--text-muted)">'+byStatus['Not Started']+'</div><div class="kpi-label">Not Started</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:var(--accent)">'+byStatus['In Progress']+'</div><div class="kpi-label">In Progress</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:var(--red)">'+byStatus['Blocked']+'</div><div class="kpi-label">Blocked</div></div>';
  html += '<div class="kpi-card"><div class="kpi-value" style="color:var(--green)">'+byStatus['Complete']+'</div><div class="kpi-label">Complete</div></div>';
  html += '</div>';
  html += '<div class="ap-board" style="display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;padding-bottom:12px;align-items:flex-start;min-height:60vh">';
  lanes.forEach(function(lane){
    var laneCards = apCardsInLane(lane.id);
    html += '<div class="ap-lane" data-lane="'+lane.id+'" ondragover="apDragOver(event)" ondragleave="apDragLeave(event)" ondrop="apDrop(event,'+lane.id+')" style="flex:0 0 280px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:10px;display:flex;flex-direction:column;max-height:80vh">';
    html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:8px">';
    html += '<input type="text" value="'+esc(lane.name||'')+'" placeholder="Lane name" onchange="apRenameLane('+lane.id+',this.value)" aria-label="Lane name" style="flex:1;background:transparent;border:1px solid transparent;color:var(--text-primary);font-size:14px;font-weight:600;padding:3px 5px;border-radius:4px" onfocus="this.style.border=\'1px solid var(--accent)\';this.style.background=\'var(--bg-primary)\'" onblur="this.style.border=\'1px solid transparent\';this.style.background=\'transparent\'">';
    html += '<span style="color:var(--text-muted);font-size:11px;font-family:var(--font-mono)">'+laneCards.length+'</span>';
    html += '</div>';
    html += '<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap">';
    html += '<button class="btn btn-sm" onclick="apAddCard('+lane.id+')" style="font-size:11px;padding:3px 8px">+ Card</button>';
    html += '<button class="btn btn-sm" onclick="apRenumberLane('+lane.id+')" title="Renumber cards 1, 2, 3, ..." style="font-size:11px;padding:3px 8px">Renumber</button>';
    html += '<button class="btn btn-sm btn-danger" onclick="apDeleteLane('+lane.id+')" style="font-size:11px;padding:3px 8px">Delete</button>';
    html += '</div>';
    html += '<div class="ap-lane-cards" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;min-height:80px">';
    if(laneCards.length===0){
      html += '<div style="color:var(--text-muted);text-align:center;padding:14px;font-size:11px;font-style:italic;border:1px dashed var(--border);border-radius:var(--radius)">Drop cards here</div>';
    }
    laneCards.forEach(function(card){
      var incompleteDeps = apIncompleteDeps(card);
      var hasIncomplete = incompleteDeps.length > 0;
      var statusColor = AP_STATUS_COLORS[card.status] || 'var(--text-muted)';
      var borderStyle = hasIncomplete ? 'border:2px solid var(--red)' : 'border:1px solid var(--border)';
      html += '<div class="ap-card" data-card="'+card.id+'" draggable="true" ondragstart="apDragStart(event,'+card.id+')" ondragend="apDragEnd(event)" onclick="apOpenCardEdit('+card.id+')" style="background:var(--bg-tertiary);'+borderStyle+';border-left:3px solid '+statusColor+';border-radius:var(--radius);padding:8px;cursor:grab;font-size:12px">';
      html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
      html += '<span style="font-family:var(--font-mono);font-weight:700;color:var(--accent);font-size:11px">'+esc(card.number||'?')+'</span>';
      if(hasIncomplete){
        html += '<span title="'+incompleteDeps.length+' incomplete dependency" style="color:var(--red);font-size:11px;font-weight:700">! '+incompleteDeps.length+'</span>';
      }
      html += '<span style="margin-left:auto;font-size:10px;color:'+statusColor+';font-weight:600">&#9679;</span>';
      html += '</div>';
      html += '<div style="font-weight:600;margin-bottom:4px;word-break:break-word;line-height:1.3">'+esc(card.title||'(untitled)')+'</div>';
      if(card.owner){
        html += '<div style="color:var(--text-muted);font-size:10px;margin-bottom:2px">'+esc(card.owner)+'</div>';
      }
      html += '<div style="color:'+statusColor+';font-size:10px;font-weight:600">'+esc(card.status||'Not Started')+'</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  area.innerHTML = html;
}
function apAddLane(){
  snapshotForUndo('Add lane');
  var maxOrder = 0;
  (appState.actionPlanLanes||[]).forEach(function(l){if((l.order||0)>maxOrder)maxOrder=l.order||0;});
  var lane = { id: appState._apLaneNextId++, name: 'New Lane', color: '', order: maxOrder+1 };
  appState.actionPlanLanes.push(lane);
  logActivity('actionPlan','Created','LANE-'+lane.id,'New lane');
  markUnsaved();
  renderContent();
  buildNav();
}
function apDeleteLane(laneId){
  var lane = apLaneById(laneId);
  if(!lane) return;
  var cards = apCardsInLane(laneId);
  var msg = cards.length>0
    ? 'Delete lane "'+esc(lane.name||'(unnamed)')+'" and all '+cards.length+' card'+(cards.length===1?'':'s')+' inside?'
    : 'Delete lane "'+esc(lane.name||'(unnamed)')+'"?';
  showConfirm('Delete Lane', msg, 'Delete', function(){
    snapshotForUndo('Delete lane');
    var deletedCardIds = cards.map(function(c){return c.id;});
    appState.actionPlanLanes = appState.actionPlanLanes.filter(function(l){return l.id!==laneId;});
    appState.actionPlanCards = appState.actionPlanCards.filter(function(c){return c.laneId!==laneId;});
    appState.actionPlanCards.forEach(function(c){
      if(Array.isArray(c.dependsOn)){
        c.dependsOn = c.dependsOn.filter(function(d){return deletedCardIds.indexOf(d)<0;});
      }
    });
    logActivity('actionPlan','Deleted','LANE-'+laneId,'Lane: '+(lane.name||''));
    markUnsaved();
    renderContent();
    buildNav();
    toast('Lane deleted','success');
  });
}
function apRenameLane(laneId, name){
  var lane = apLaneById(laneId);
  if(!lane || lane.name===name) return;
  snapshotForUndo('Rename lane');
  lane.name = String(name||'').substring(0,120);
  markUnsaved();
}
function apRenumberLane(laneId){
  var lane = apLaneById(laneId);
  if(!lane) return;
  var cards = apCardsInLane(laneId);
  if(cards.length===0){toast('No cards to renumber','info');return;}
  showConfirm('Renumber Lane','Renumber all '+cards.length+' cards in "'+esc(lane.name||'')+'" sequentially as 1, 2, 3, ...?','Renumber',function(){
    snapshotForUndo('Renumber lane');
    cards.forEach(function(c, idx){ c.number = String(idx+1); });
    logActivity('actionPlan','Updated','LANE-'+laneId,'Renumbered '+cards.length+' cards');
    markUnsaved();
    renderContent();
    toast('Renumbered '+cards.length+' cards','success');
  });
}
function apAddCard(laneId){
  var lane = apLaneById(laneId);
  if(!lane) return;
  snapshotForUndo('Add card');
  var existing = apCardsInLane(laneId);
  var maxNum = 0;
  existing.forEach(function(c){
    var m = /^(\d+)/.exec(String(c.number||''));
    if(m){var v = parseInt(m[1],10); if(v>maxNum) maxNum = v;}
  });
  var card = {
    id: appState._apCardNextId++,
    number: String(maxNum+1),
    laneId: laneId,
    title: 'New card',
    description: '',
    owner: '',
    status: 'Not Started',
    dependsOn: []
  };
  appState.actionPlanCards.push(card);
  logActivity('actionPlan','Created','CARD-'+card.id,'New card in '+(lane.name||'lane'));
  markUnsaved();
  renderContent();
  buildNav();
  setTimeout(function(){apOpenCardEdit(card.id);}, 50);
}
function apDeleteCard(cardId){
  var card = apCardById(cardId);
  if(!card) return;
  var blockers = apBlockingCards(cardId);
  var warnMsg = blockers.length>0
    ? '<div style="color:var(--yellow);margin-bottom:8px">Warning: '+blockers.length+' other card'+(blockers.length===1?'':'s')+' depend'+(blockers.length===1?'s':'')+' on this. Those dependencies will be removed.</div>'
    : '';
  showConfirm('Delete Card', warnMsg+'Delete card '+esc(card.number||'')+' "'+esc(card.title||'')+'"?', 'Delete', function(){
    snapshotForUndo('Delete card');
    appState.actionPlanCards = appState.actionPlanCards.filter(function(c){return c.id!==cardId;});
    appState.actionPlanCards.forEach(function(c){
      if(Array.isArray(c.dependsOn)){
        c.dependsOn = c.dependsOn.filter(function(d){return d!==cardId;});
      }
    });
    logActivity('actionPlan','Deleted','CARD-'+cardId,'Card: '+(card.title||''));
    markUnsaved();
    closeConfirm();
    renderContent();
    buildNav();
    toast('Card deleted','success');
  });
}
function apOpenCardEdit(cardId){
  var card = apCardById(cardId);
  if(!card) return;
  var lanes = (appState.actionPlanLanes||[]).slice().sort(function(a,b){return (a.order||0)-(b.order||0);});
  var otherCards = (appState.actionPlanCards||[]).filter(function(c){return c.id!==cardId;});
  otherCards.sort(function(a,b){return apCompareNumber(a.number,b.number);});
  var blockers = apBlockingCards(cardId);
  var html = '<div style="max-height:65vh;overflow-y:auto;padding:0.5rem">';
  html += '<label>Number</label><input id="apCardNumber" class="form-input" value="'+esc(card.number||'')+'" placeholder="1, 1a, 4a.2">';
  html += '<label>Title *</label><input id="apCardTitle" class="form-input" value="'+esc(card.title||'')+'">';
  html += '<label>Description</label><textarea id="apCardDescription" class="form-input" rows="3">'+esc(card.description||'')+'</textarea>';
  html += '<label>Owner</label><input id="apCardOwner" class="form-input" value="'+esc(card.owner||'')+'">';
  html += '<label>Lane</label><select id="apCardLane" class="form-input">';
  lanes.forEach(function(l){
    html += '<option value="'+l.id+'"'+(l.id===card.laneId?' selected':'')+'>'+esc(l.name||'(unnamed)')+'</option>';
  });
  html += '</select>';
  html += '<label>Status</label><select id="apCardStatus" class="form-input">';
  AP_STATUSES.forEach(function(s){
    html += '<option'+(s===card.status?' selected':'')+'>'+esc(s)+'</option>';
  });
  html += '</select>';
  html += '<label>Depends On</label>';
  if(otherCards.length===0){
    html += '<div style="color:var(--text-muted);font-size:12px;padding:6px">No other cards available.</div>';
  } else {
    html += '<div id="apCardDepsList" style="max-height:160px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius);padding:6px;background:var(--bg-primary)">';
    otherCards.forEach(function(o){
      var checked = Array.isArray(card.dependsOn) && card.dependsOn.indexOf(o.id)>=0;
      var laneName = (apLaneById(o.laneId)||{}).name||'';
      var oStatusColor = AP_STATUS_COLORS[o.status] || 'var(--text-muted)';
      html += '<label style="display:flex;align-items:center;gap:6px;padding:3px 4px;font-size:12px;cursor:pointer">';
      html += '<input type="checkbox" data-cardid="'+o.id+'"'+(checked?' checked':'')+'>';
      html += '<span style="font-family:var(--font-mono);color:var(--accent);font-weight:600;min-width:36px">'+esc(o.number||'?')+'</span>';
      html += '<span style="flex:1">'+esc(o.title||'(untitled)')+'</span>';
      html += '<span style="color:var(--text-muted);font-size:10px">'+esc(laneName)+'</span>';
      html += '<span style="color:'+oStatusColor+';font-size:10px">&#9679;</span>';
      html += '</label>';
    });
    html += '</div>';
  }
  html += '<label style="margin-top:10px">Blocks (cards depending on this)</label>';
  if(blockers.length===0){
    html += '<div style="color:var(--text-muted);font-size:12px;padding:6px">No cards depend on this one.</div>';
  } else {
    html += '<div style="border:1px solid var(--border);border-radius:var(--radius);padding:6px;background:var(--bg-primary);font-size:12px">';
    blockers.forEach(function(b){
      var lane = apLaneById(b.laneId);
      var bStatusColor = AP_STATUS_COLORS[b.status] || 'var(--text-muted)';
      html += '<div style="display:flex;align-items:center;gap:6px;padding:3px 4px"><span style="font-family:var(--font-mono);color:var(--accent);font-weight:600;min-width:36px">'+esc(b.number||'?')+'</span><span style="flex:1">'+esc(b.title||'(untitled)')+'</span><span style="color:var(--text-muted);font-size:10px">'+esc((lane||{}).name||'')+'</span><span style="color:'+bStatusColor+';font-size:10px">&#9679;</span></div>';
    });
    html += '</div>';
  }
  html += '<div style="margin-top:1rem;display:flex;justify-content:space-between;gap:8px">';
  html += '<button class="btn btn-danger" onclick="apDeleteCard('+cardId+')">Delete Card</button>';
  html += '<div><button class="btn btn-primary" onclick="apSaveCardEdit('+cardId+')">Save</button> <button class="btn" onclick="closeConfirm()">Cancel</button></div>';
  html += '</div></div>';
  document.getElementById('confirmTitle').textContent = 'Edit Card';
  document.getElementById('confirmMsg').innerHTML = html;
  document.getElementById('confirmBtn').style.display = 'none';
  pendingConfirmCallback = null;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOverlay').setAttribute('aria-hidden','false');
}
function apSaveCardEdit(cardId){
  var card = apCardById(cardId);
  if(!card) return;
  var titleVal = (document.getElementById('apCardTitle')||{}).value || '';
  if(!titleVal.trim()){toast('Title is required','error');return;}
  snapshotForUndo('Edit card');
  card.number = String((document.getElementById('apCardNumber')||{}).value || '').substring(0,32);
  card.title = String(titleVal).substring(0,200);
  card.description = String((document.getElementById('apCardDescription')||{}).value || '').substring(0,2000);
  card.owner = String((document.getElementById('apCardOwner')||{}).value || '').substring(0,100);
  var laneSel = document.getElementById('apCardLane');
  if(laneSel) card.laneId = parseInt(laneSel.value,10);
  var statusSel = document.getElementById('apCardStatus');
  if(statusSel) card.status = statusSel.value;
  var newDeps = [];
  var depsList = document.getElementById('apCardDepsList');
  if(depsList){
    var boxes = depsList.querySelectorAll('input[type="checkbox"]');
    for(var i=0;i<boxes.length;i++){
      if(boxes[i].checked){
        var depId = parseInt(boxes[i].getAttribute('data-cardid'),10);
        if(!isNaN(depId) && depId !== cardId) newDeps.push(depId);
      }
    }
  }
  card.dependsOn = newDeps;
  logActivity('actionPlan','Updated','CARD-'+cardId,'Card: '+card.title);
  markUnsaved();
  closeConfirm();
  renderContent();
  toast('Card saved','success');
}
function apDragStart(e, cardId){
  _apDraggedCardId = cardId;
  if(e.dataTransfer){
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', String(cardId)); } catch(err){}
  }
  var el = e.currentTarget || e.target;
  if(el && el.style) el.style.opacity = '0.4';
}
function apDragEnd(e){
  var el = e.currentTarget || e.target;
  if(el && el.style) el.style.opacity = '';
}
function apDragOver(e){
  e.preventDefault();
  if(e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  var lane = e.currentTarget;
  if(lane && lane.style) lane.style.outline = '2px dashed var(--accent)';
}
function apDragLeave(e){
  var lane = e.currentTarget;
  if(lane && lane.style) lane.style.outline = '';
}
function apDrop(e, laneId){
  e.preventDefault();
  var lane = e.currentTarget;
  if(lane && lane.style) lane.style.outline = '';
  if(_apDraggedCardId == null) return;
  var card = apCardById(_apDraggedCardId);
  if(card && card.laneId !== laneId){
    snapshotForUndo('Move card');
    card.laneId = laneId;
    var newLane = apLaneById(laneId);
    logActivity('actionPlan','Updated','CARD-'+card.id,'Moved to '+(newLane?newLane.name:'lane'));
    markUnsaved();
    renderContent();
    buildNav();
  }
  _apDraggedCardId = null;
}

/* ===============================================
   STRATEGY CANVAS MODULE (SWOT + Stakeholder Map)
   =============================================== */
var SWOT_QUADRANTS = [
  { key: 'strengths',     label: 'Strengths',     color: 'var(--green)',  hint: 'Internal capabilities and advantages' },
  { key: 'weaknesses',    label: 'Weaknesses',    color: 'var(--red)',    hint: 'Internal limitations or gaps' },
  { key: 'opportunities', label: 'Opportunities', color: 'var(--accent)', hint: 'External factors to exploit' },
  { key: 'threats',       label: 'Threats',       color: 'var(--orange)', hint: 'External risks or obstacles' }
];
var STAKEHOLDER_QUADRANTS = [
  { key: 'manage',  label: 'Manage Closely', sub: 'High Power / High Interest', color: 'var(--red)' },
  { key: 'satisfy', label: 'Keep Satisfied', sub: 'High Power / Low Interest',  color: 'var(--orange)' },
  { key: 'inform',  label: 'Keep Informed',  sub: 'Low Power / High Interest',  color: 'var(--accent)' },
  { key: 'monitor', label: 'Monitor',        sub: 'Low Power / Low Interest',   color: 'var(--text-muted)' }
];
function _ensureSwot(){
  if(!appState.swot || typeof appState.swot !== 'object'){
    appState.swot = { strengths:[], weaknesses:[], opportunities:[], threats:[] };
  }
  ['strengths','weaknesses','opportunities','threats'].forEach(function(k){
    if(!Array.isArray(appState.swot[k])) appState.swot[k] = [];
  });
}
function renderStrategyModule(area){
  _ensureSwot();
  var html = '<div class="module-header"><h2>'+esc(appState.settings.moduleNames.strategy||'Strategy Canvas')+'</h2></div>';
  html += '<div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:18px">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid var(--border);padding-bottom:10px"><h3 style="margin:0;font-size:16px">SWOT Analysis</h3><span style="color:var(--text-muted);font-size:11px">Strengths / Weaknesses / Opportunities / Threats</span></div>';
  html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">';
  SWOT_QUADRANTS.forEach(function(q){
    var items = appState.swot[q.key] || [];
    html += '<div style="background:var(--bg-tertiary);border:1px solid var(--border);border-left:4px solid '+q.color+';border-radius:var(--radius);padding:10px">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">';
    html += '<div><div style="font-weight:700;color:'+q.color+';font-size:14px">'+q.label+'</div><div style="color:var(--text-muted);font-size:11px">'+esc(q.hint)+'</div></div>';
    html += '<button class="btn btn-sm" onclick="swotAddItem(\''+q.key+'\')" style="font-size:11px;padding:3px 8px">+ Add</button>';
    html += '</div>';
    if(items.length===0){
      html += '<div style="color:var(--text-muted);font-size:12px;font-style:italic;padding:8px 4px">No items yet.</div>';
    } else {
      html += '<div style="display:flex;flex-direction:column;gap:4px">';
      items.forEach(function(item, idx){
        html += '<div data-swot="'+q.key+'" data-idx="'+idx+'" style="display:flex;align-items:flex-start;gap:6px;background:var(--bg-primary);border:1px solid var(--border);border-radius:4px;padding:6px 8px">';
        html += '<textarea rows="1" oninput="swotUpdateItem(\''+q.key+'\','+idx+',this.value);this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'" aria-label="'+esc(q.label)+' item" style="flex:1;background:transparent;border:none;color:var(--text-primary);font-size:12px;resize:none;outline:none;font-family:inherit;line-height:1.4;min-height:18px;padding:0">'+esc(item)+'</textarea>';
        html += '<button class="btn btn-sm btn-danger" aria-label="Delete item" title="Delete" onclick="swotDeleteItem(\''+q.key+'\','+idx+')" style="padding:1px 6px;font-size:10px;flex-shrink:0">X</button>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  html += '</div>';
  var stakeholders = appState.stakeholders || [];
  html += '<div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:14px">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid var(--border);padding-bottom:10px"><h3 style="margin:0;font-size:16px">Stakeholder Map</h3><div style="display:flex;gap:8px;align-items:center"><span style="color:var(--text-muted);font-size:11px">Power / Interest</span><button class="btn btn-sm btn-primary" onclick="stakeholderAdd()">+ Add Stakeholder</button></div></div>';
  if(stakeholders.length===0){
    html += '<div style="color:var(--text-muted);text-align:center;padding:24px;font-size:13px">No stakeholders yet &mdash; click "+ Add Stakeholder" to populate the grid.</div>';
  }
  html += '<div style="display:grid;grid-template-columns:60px 1fr 1fr;gap:8px;align-items:stretch">';
  html += '<div></div>';
  html += '<div style="text-align:center;font-size:11px;color:var(--text-muted);font-weight:600;padding:4px">HIGH INTEREST</div>';
  html += '<div style="text-align:center;font-size:11px;color:var(--text-muted);font-weight:600;padding:4px">LOW INTEREST</div>';
  html += '<div style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center;font-size:11px;color:var(--text-muted);font-weight:600;padding:4px;display:flex;align-items:center;justify-content:center">HIGH POWER</div>';
  html += _buildStakeholderQuadrant('manage');
  html += _buildStakeholderQuadrant('satisfy');
  html += '<div style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center;font-size:11px;color:var(--text-muted);font-weight:600;padding:4px;display:flex;align-items:center;justify-content:center">LOW POWER</div>';
  html += _buildStakeholderQuadrant('inform');
  html += _buildStakeholderQuadrant('monitor');
  html += '</div>';
  html += '</div>';
  area.innerHTML = html;
}
function _buildStakeholderQuadrant(quadKey){
  var quad = STAKEHOLDER_QUADRANTS.find(function(q){return q.key===quadKey;});
  var items = (appState.stakeholders||[]).filter(function(s){return s.quadrant===quadKey;});
  var html = '<div style="background:var(--bg-tertiary);border:1px solid var(--border);border-top:4px solid '+quad.color+';border-radius:var(--radius);padding:10px;min-height:160px">';
  html += '<div style="margin-bottom:8px"><div style="font-weight:700;color:'+quad.color+';font-size:13px">'+esc(quad.label)+'</div><div style="color:var(--text-muted);font-size:10px">'+esc(quad.sub)+'</div></div>';
  if(items.length===0){
    html += '<div style="color:var(--text-muted);font-size:11px;font-style:italic;padding:4px">No stakeholders.</div>';
  } else {
    html += '<div style="display:flex;flex-direction:column;gap:6px">';
    items.forEach(function(s){
      html += '<div data-stakeholder="'+s.id+'" style="background:var(--bg-primary);border:1px solid var(--border);border-radius:4px;padding:6px 8px;font-size:12px">';
      html += '<div style="display:flex;align-items:center;gap:4px;margin-bottom:3px">';
      html += '<input type="text" value="'+esc(s.name||'')+'" placeholder="Name" oninput="stakeholderUpdate('+s.id+',\'name\',this.value)" aria-label="Stakeholder name" style="flex:1;background:transparent;border:1px solid transparent;color:var(--text-primary);font-weight:600;font-size:12px;padding:1px 3px;border-radius:3px" onfocus="this.style.border=\'1px solid var(--accent)\';this.style.background=\'var(--bg-secondary)\'" onblur="this.style.border=\'1px solid transparent\';this.style.background=\'transparent\'">';
      html += '<button class="btn btn-sm btn-danger" aria-label="Delete stakeholder" title="Delete" onclick="stakeholderDelete('+s.id+')" style="padding:1px 5px;font-size:10px">X</button>';
      html += '</div>';
      html += '<select onchange="stakeholderUpdate('+s.id+',\'quadrant\',this.value)" aria-label="Stakeholder quadrant" style="width:100%;background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);font-size:10px;padding:2px 4px;border-radius:3px;margin-bottom:3px">';
      STAKEHOLDER_QUADRANTS.forEach(function(q){
        html += '<option value="'+q.key+'"'+(q.key===s.quadrant?' selected':'')+'>'+esc(q.label)+'</option>';
      });
      html += '</select>';
      html += '<textarea rows="1" placeholder="Notes" oninput="stakeholderUpdate('+s.id+',\'notes\',this.value);this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'" aria-label="Stakeholder notes" style="width:100%;background:transparent;border:1px solid transparent;color:var(--text-muted);font-size:11px;padding:2px 4px;border-radius:3px;resize:none;font-family:inherit;line-height:1.3;box-sizing:border-box" onfocus="this.style.border=\'1px solid var(--accent)\';this.style.background=\'var(--bg-secondary)\';this.style.color=\'var(--text-primary)\'" onblur="this.style.border=\'1px solid transparent\';this.style.background=\'transparent\';this.style.color=\'var(--text-muted)\'">'+esc(s.notes||'')+'</textarea>';
      html += '</div>';
    });
    html += '</div>';
  }
  html += '</div>';
  return html;
}
function swotAddItem(quadKey){
  _ensureSwot();
  if(!appState.swot[quadKey]) return;
  snapshotForUndo('Add SWOT item');
  appState.swot[quadKey].push('');
  logActivity('strategy','Created','SWOT-'+quadKey,'New '+quadKey+' item');
  markUnsaved();
  renderContent();
  setTimeout(function(){
    var rows = document.querySelectorAll('[data-swot="'+quadKey+'"]');
    if(rows.length>0){
      var ta = rows[rows.length-1].querySelector('textarea');
      if(ta) ta.focus();
    }
  }, 50);
}
function swotUpdateItem(quadKey, idx, value){
  _ensureSwot();
  if(!appState.swot[quadKey] || idx<0 || idx>=appState.swot[quadKey].length) return;
  if(appState.swot[quadKey][idx] === value) return;
  appState.swot[quadKey][idx] = String(value||'').substring(0,500);
  markUnsaved();
}
function swotDeleteItem(quadKey, idx){
  _ensureSwot();
  if(!appState.swot[quadKey] || idx<0 || idx>=appState.swot[quadKey].length) return;
  snapshotForUndo('Delete SWOT item');
  appState.swot[quadKey].splice(idx, 1);
  logActivity('strategy','Deleted','SWOT-'+quadKey,'Removed '+quadKey+' item');
  markUnsaved();
  renderContent();
}
function stakeholderAdd(){
  if(!Array.isArray(appState.stakeholders)) appState.stakeholders = [];
  snapshotForUndo('Add stakeholder');
  var s = { id: appState._stakeholderNextId++, name: 'New stakeholder', quadrant: 'monitor', notes: '' };
  appState.stakeholders.push(s);
  logActivity('strategy','Created','SH-'+s.id,'New stakeholder');
  markUnsaved();
  renderContent();
  buildNav();
}
function stakeholderDelete(id){
  var s = (appState.stakeholders||[]).find(function(x){return x.id===id;});
  if(!s) return;
  showConfirm('Delete Stakeholder', 'Delete stakeholder "'+esc(s.name||'(unnamed)')+'"?', 'Delete', function(){
    snapshotForUndo('Delete stakeholder');
    appState.stakeholders = appState.stakeholders.filter(function(x){return x.id!==id;});
    logActivity('strategy','Deleted','SH-'+id,'Stakeholder: '+(s.name||''));
    markUnsaved();
    renderContent();
    buildNav();
    toast('Stakeholder deleted','success');
  });
}
function stakeholderUpdate(id, field, value){
  var s = (appState.stakeholders||[]).find(function(x){return x.id===id;});
  if(!s) return;
  if(s[field] === value) return;
  if(field === 'quadrant'){
    snapshotForUndo('Move stakeholder');
    s.quadrant = value;
    markUnsaved();
    renderContent();
    return;
  }
  var maxLen = field==='notes' ? 1000 : 200;
  s[field] = String(value||'').substring(0,maxLen);
  markUnsaved();
}

var PMD_EXTRA_LISTS={"decisionCategories":["Technical","Schedule","Cost","Scope","Resource","Process","Vendor","Other"],"decisionStatuses":["Proposed","Approved","Deferred","Superseded","Rejected"],"milestoneStatuses":["Not Started","In Progress","Complete","At Risk","Missed"],"milestoneCategories":["Program","Technical","Contract","Delivery","Review/Gate","Test","Certification"],"changeStatuses":["Submitted","Under Review","Approved","Rejected","Deferred","Implemented"],"testCategories":["Functional","Performance","Integration","Regression","Acceptance","Environmental","Safety","Security"],"verificationMethods":["Test","Demonstration","Inspection","Analysis","Simulation"],"testResults":["Not Run","Pass","Fail","Blocked","Skipped"],"lessonCategories":["Technical","Process","Communication","Schedule","Cost","Quality","Risk Management","Testing","Integration","Other"],"lifecyclePhases":["Planning","Design","Development","Test","Production","Deployment","Sustainment"],"requirementCategories":["Functional","Performance","Interface","Environmental","Safety","Security","Reliability","Maintainability","Constraint"],"requirementStatuses":["Not Verified","Partial","Verified","Deferred","N/A"],"costCategories":["Labor","Material","Subcontract","Travel","ODC","Facilities","Equipment","Contingency"],"tradeStatuses":["Open","In Progress","Completed","Cancelled"],"tradeCategories":["Technical","Cost","Schedule","Performance","Risk","Weight","Power","Reliability"],"anomalyStatuses":["Open","Investigating","Root Cause Identified","Resolved","Closed","Deferred"],"anomalySeverities":["Critical","Major","Minor","Cosmetic"],"anomalyCategories":["Hardware","Software","Firmware","Mechanical","Electrical","Thermal","EMI/EMC","Environmental","Procedural","Design"],"softwareTypes":["COTS","GOTS","Open Source","Custom","N/A"],"actionPlanStatuses":["Not Started","In Progress","Blocked","Complete"]};
/* ============================================================================
 PMD 10.0 — Programless engine/configuration boundary.
 The V9.5 module implementations above remain the specialist editors. This section
 owns program context, navigation, scoring, relationships, and the backup schema.
 Session data model. Optional device persistence and shell fetching are isolated in device.js / pwa.js. Configuration presets add no data.
 ============================================================================ */
var PMD_VERSION='10.1.0',PMD_SCHEMA='pmd.program-backup',PMD_SCHEMA_VERSION=1;
var PMD_LEGACY_FACTORS=JSON.parse(JSON.stringify(FACTORS));
var PMD_ORIGINAL=JSON.parse(JSON.stringify(appState));
var PMD_MODULES=[
 ['dashboard','Home','Overview','Universal',null,null,null],
 ['assemblies','Program Structure','Plan','Configurable','racks','openStructureEditor','openStructureDetail'],
 ['risks','Risks','Plan','Configurable','risks','openAddRiskModal','openRiskDetail'],
 ['actions','Actions','Execute','Universal','actions','openAddActionModal','openActionDetail'],
 ['milestones','Milestones','Plan','Universal','milestones','openAddMilestoneModal','openMilestoneDetail'],
 ['decisions','Decisions','Plan','Universal','decisions','openAddDecisionModal','openDecisionDetail'],
 ['costTracker','Costs','Execute','Configurable','costItems','openCostModal','openCostDetail'],
 ['requirements','Requirements','Engineering','Specialized','requirements','openAddReqModal','openReqDetail'],
 ['tests','Verification & Tests','Engineering','Specialized','tests','openAddTestModal','openTestDetail'],
 ['anomalies','Anomalies','Engineering','Configurable','anomalies','openAnomModal','openAnomDetail'],
 ['changes','Change Control','Engineering','Specialized','changes','openAddChangeModal','openChangeDetail'],
 ['boms','Bill of Materials','Resources','Specialized','boms','openAddBomModal','openBomDetail'],
 ['inventory','Inventory','Resources','Specialized','inventory','openAddInvModal','openInvDetail'],
 ['procurement','Procurement','Resources','Configurable','purchases','openPurchaseModal','openPurchaseDetail'],
 ['hwItems','Hardware Security Review','Engineering','Specialized','hwItems','openAddHwModal','openHwDetail'],
 ['evm','Earned Value','Analysis','Specialized','evmPackages','openAddEvmModal','openEvmDetail'],
 ['tradeStudies','Trade Studies','Analysis','Configurable','tradeStudies','openTradeModal','openTradeDetail'],
 ['lessons','Lessons Learned','Knowledge','Universal','lessons','openAddLessonModal','openLessonDetail'],
 ['links','Links & Specifications','Knowledge','Universal','linkSections','addLinkSection',null],
 ['actionPlan','Action Planning','Execute','Configurable','actionPlanCards','apAddLane','apOpenCardEdit'],
 ['strategy','Strategy & Stakeholders','Plan','Configurable','stakeholders','stakeholderAdd',null]
].map(function(m){return {key:m[0],name:m[1],group:m[2],kind:m[3],array:m[4],add:m[5],detail:m[6]};});
var PMD_COUNTERS={risks:'_riskNextId',racks:'_rackNextId',subs:'_subNextId',actions:'_actionNextId',boms:'_bomNextId',inventory:'_invNextId',hwItems:'_hwNextId',swItems:'_swNextId',decisions:'_decNextId',milestones:'_msNextId',evmPackages:'_evmNextId',changes:'_chgNextId',tests:'_testNextId',lessons:'_lesNextId',requirements:'_reqNextId',tradeStudies:'_trdNextId',anomalies:'_anomNextId',costItems:'_costNextId',linkSections:'_linkSecNextId',specifications:'_specNextId',purchases:'_purchaseNextId',actionPlanLanes:'_apLaneNextId',actionPlanCards:'_apCardNextId',stakeholders:'_stakeholderNextId'};
var PMD_PREFIXES={risks:'R',racks:'STR',subs:'SUB',actions:'AI',boms:'BOM',inventory:'INV',hwItems:'HW',swItems:'SW',decisions:'DEC',milestones:'MS',evmPackages:'WP',changes:'CR',tests:'TC',lessons:'LL',requirements:'REQ',tradeStudies:'TRD',anomalies:'ANOM',costItems:'CST',purchases:'PO',actionPlanCards:'AP',stakeholders:'STK',linkSections:'LINK',specifications:'SPEC',actionPlanLanes:'LANE'};
var PMD_DEFAULT_ENABLED=['dashboard','assemblies','risks','actions','milestones','decisions','costTracker','lessons','links','strategy'];
var pmdDraft=null,pmdSettingsPage='program',pmdStructureSort='name',pmdStructureQuery='',pmdDetailContext=null;
function pmdClone(x){return JSON.parse(JSON.stringify(x));}
function esc(s){return String(s===null||s===undefined?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function pmdNumber(id){var v=document.getElementById(id).value.trim();return v===''?null:Number(v);}
function pmdHasNumber(x){return typeof x==='number'&&Number.isFinite(x);}
function pmdMultiply(a,b){return pmdHasNumber(a)&&pmdHasNumber(b)?a*b:null;}
function pmdDisplayNumber(v){return pmdHasNumber(v)?v:'—';}
function fmtCost(v){return pmdHasNumber(v)?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';}
function pmdList(k){return (appState.settings.dropdownLists[k]||[]).slice();}
function pmdModule(k){return PMD_MODULES.find(function(m){return m.key===k||m.array===k;})||(k==='swItems'?{key:'hwItems',name:'Software Review',array:'swItems',detail:'openSwDetail'}:null);}
function pmdEnabled(k){var m=pmdModule(k);return !!(m&&appState.settings.modules[m.key]&&appState.settings.modules[m.key].enabled);}
function pmdName(k){var m=pmdModule(k);return appState.settings.moduleNames[m?m.key:k]||(m?m.name:k);}
function pmdRecords(k){var m=pmdModule(k);return m&&m.array?(appState[m.array]||[]):[];}
function pmdTitle(r){return r.title||r.name||r.partName||r.itemName||r.nodeName||r.softwareName||r.swName||r.description||r.partNumber||'Untitled';}
function pmdId(arr,id){return (appState.settings.prefixes[arr]||PMD_PREFIXES[arr]||'ITEM')+'-'+String(id).padStart(3,'0');}
function pmdEmptyMessage(k){return {risks:'No risks have been added.',assemblies:'Create a structure to begin.',milestones:'No program milestones configured.',evm:'Add work packages to enable EVM metrics.',actions:'No actions have been added.',boms:'No bill of materials configured.',inventory:'No inventory records have been added.',tests:'No tests have been added.',requirements:'No requirements have been added.'}[k]||'No records have been added.';}
function pmdDefaults(){
 var s=pmdClone(PMD_ORIGINAL.settings);s.toolTitle='PMD Toolkit';s.programName='';s.subtitle='';s.programType='';s.setupComplete=false;s.currency='';s.dateFormat='iso';s.defaultUnits='';s.reportHeading='Program Report';s.theme='dark';s.terminology={structure:'Structure',node:'Item',child:'Child item'};s.team=[];s.prefixes=pmdClone(PMD_PREFIXES);s.prefixHistory={};s.modules={};s.dashboard={attention:true,upcoming:true,activity:true,dependencies:true,overview:true};s.thresholds={upcomingDays:30,evmWarning:null,evmCritical:null,costVariancePercent:null};s.riskModel=null;
 Object.assign(s.dropdownLists,pmdClone(PMD_EXTRA_LISTS));
 ['invLocations','classificationLevels','operatingSystems','memoryTypes','sanitizationMethods'].forEach(function(k){s.dropdownLists[k]=[];});
 s.dropdownLists.riskCategories=['Technical','Schedule','Cost','Scope','Resource','External','Other'];s.dropdownLists.bomCategories=['Component','Assembly','Material','Software','Other'];
 s.dropdownLists.softwareTypes=['Commercial','Open Source','Custom','Other'];s.dropdownLists.milestoneCategories=['Deliverable','Review','Release','Checkpoint','Other'];s.dropdownLists.evmStatuses=['Not Started','In Progress','Complete'];s.dropdownLists.changeClasses=[];s.dropdownLists.changePriorities=['Routine','Urgent','Emergency'];s.dropdownLists.requirementPriorities=['High','Medium','Low'];s.dropdownLists.decisionImpacts=['High','Medium','Low'];s.dropdownLists.lessonImpacts=['High','Medium','Low'];s.dropdownLists.lessonSentiments=['Positive','Negative','Neutral'];s.dropdownLists.installStatuses=['Not Started','In Progress','Installed','Verified'];
 s.dropdownLists.costCategories=['Labor','Material','Service','Equipment','Travel','Other'];s.dropdownLists.relationshipTypes=['relates to','mitigates','verifies','depends on','affects','fulfills'];s.dropdownLists.structureTypes=['Workstream','Deliverable','Team','Product','System','Subsystem','Assembly','Component'];
 s.statusRules={risks:{closed:['Closed','Accepted'],blocked:[]},actions:{closed:['Complete'],blocked:['Blocked']},milestones:{closed:['Complete'],blocked:['At Risk','Missed']},decisions:{closed:['Approved','Rejected','Superseded'],blocked:[]},requirements:{closed:['Verified','N/A'],blocked:[],success:['Verified'],failure:['Partial','Not Verified']},tests:{closed:['Pass','Skipped'],blocked:['Fail','Blocked'],success:['Pass'],failure:['Fail']},changes:{closed:['Implemented','Rejected'],blocked:[]},anomalies:{closed:['Closed','Resolved'],blocked:[]},procurement:{closed:['Received','Cancelled'],blocked:[]},actionPlan:{closed:['Complete'],blocked:['Blocked']},tradeStudies:{closed:['Completed','Cancelled'],blocked:[]}};
 PMD_MODULES.forEach(function(m,i){s.moduleNames[m.key]=m.name;s.modules[m.key]={enabled:PMD_DEFAULT_ENABLED.includes(m.key),order:i,group:m.group};});var order=['dashboard','assemblies','risks','milestones','decisions','strategy','actions','costTracker','actionPlan','requirements','tests','anomalies','changes','hwItems','boms','inventory','procurement','evm','tradeStudies','lessons','links'];order.forEach(function(k,i){s.modules[k].order=i;});return s;
}
function pmdBlankState(){var state=pmdClone(PMD_ORIGINAL);Object.keys(state).forEach(function(k){if(Array.isArray(state[k]))state[k]=[];if(k.endsWith('NextId'))state[k]=1;});state.settings=pmdDefaults();state.relationships=[];state.swot={strengths:[],weaknesses:[],opportunities:[],threats:[]};state._extensions={};return state;}
function pmdApplyConfig(){
 var s=appState.settings;decCategories=pmdList('decisionCategories');decStatuses=pmdList('decisionStatuses');msStatuses=pmdList('milestoneStatuses');PROC_STATUSES=pmdList('procurementStatuses');PROC_CATEGORIES=pmdList('procurementCategories');AP_STATUSES=pmdList('actionPlanStatuses');
 var model=s.riskModel;FK=model?model.dimensions.map(function(d){return d.key;}):[];FACTORS={};if(model)model.dimensions.forEach(function(d,i){FACTORS[d.key]={label:d.label,short:d.label.substring(0,1),cssClass:'fd-q',color:'var(--accent)',scale:[{value:0,label:'Not assessed',desc:''}].concat(Array.from({length:d.max-d.min+1},function(_,i){return {value:d.min+i,label:String(d.min+i),desc:(d.labels||{})[d.min+i]||''};}))};});
 document.documentElement.setAttribute('data-theme',s.theme||'dark');currentTheme=s.theme||'dark';document.getElementById('themeToggle').textContent=currentTheme==='dark'?'☽':'☀';critCache.clear();
}
function todayStr(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function fmtDate(value){if(!value)return '—';var iso=String(value).slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return esc(value);var p=iso.split('-');var format=appState.settings.dateFormat;return format==='mdy'?p[1]+'/'+p[2]+'/'+p[0]:format==='dmy'?p[2]+'/'+p[1]+'/'+p[0]:iso;}
function fmtDateLong(d){return fmtDate(d);}function fmtDateShort(d){return fmtDate(d);}
function fmtCurrency(n){if(!pmdHasNumber(n))return '—';var cur=appState.settings.currency;return (cur?cur+' ':'')+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function updateHeader(){document.getElementById('headerTitle').textContent=appState.settings.programName||'PMD Toolkit';document.getElementById('headerSubtitle').textContent=appState.settings.subtitle||(appState.settings.setupComplete?'Program execution workspace':'No program configured');document.getElementById('logoIcon').textContent='P';document.title=(appState.settings.programName?appState.settings.programName+' · ':'')+'PMD 10.1';}
function toggleTheme(){snapshotForUndo('Change theme');v95_toggleTheme();appState.settings.theme=currentTheme;markUnsaved();}
function buildNav(){var c=document.getElementById('navItems');c.innerHTML='';var last='';PMD_MODULES.slice().sort(function(a,b){return appState.settings.modules[a.key].order-appState.settings.modules[b.key].order;}).forEach(function(m){if(!pmdEnabled(m.key))return;var cfg=appState.settings.modules[m.key];if(cfg.group!==last){var g=document.createElement('div');g.className='pmd-nav-group';g.textContent=cfg.group;g.setAttribute('role','presentation');c.appendChild(g);last=cfg.group;}var b=document.createElement('button');b.className='nav-item'+(currentModule===m.key?' active':'');b.setAttribute('role','tab');b.setAttribute('aria-selected',String(currentModule===m.key));b.dataset.module=m.key;b.textContent=pmdName(m.key);b.onclick=function(){switchModule(m.key);};c.appendChild(b);});['riskSidebarFilters','actionSidebarFilters','bomSidebarFilters','invSidebarFilters','hwSidebarFilters'].forEach(function(id){document.getElementById(id).innerHTML='';});}
function switchModule(key){var m=pmdModule(key);if(!m||!pmdEnabled(key)){toast('This module is disabled. Enable it in Settings → Modules.','info');return;}currentModule=m.key;closeDetailPanel();clearBulkSelection();buildNav();renderContent();var area=document.getElementById('contentArea');area.classList.remove('fading');area.scrollTop=0;announce(pmdName(key));}
function handleNewAction(){var m=pmdModule(currentModule);if(m&&m.add&&pmdEnabled(m.key))window[m.add](null);else pmdOpenSetup();}
function pmdHeading(k,extra){return '<div class="pmd-module-heading"><h1>'+esc(pmdName(k))+'</h1><div class="pmd-actions" style="margin:0">'+(extra||'')+(pmdModule(k)?.add?'<button class="btn btn-primary" onclick="handleNewAction()">+ Add item</button>':'')+'</div></div>';}
function pmdEmpty(k){return '<div class="pmd-empty"><div class="pmd-eyebrow">Ready for your program</div><h2>'+esc(pmdEmptyMessage(k))+'</h2><p class="pmd-muted">Your workspace is empty because you have not added data yet.</p><div class="pmd-actions"><button class="btn btn-primary" onclick="handleNewAction()">+ Add first item</button><button class="btn" onclick="openSettings()">Configure program</button></div></div>';}
function renderContent(){
 var focused=document.activeElement,focusId=focused?.id,selection=focused&&'selectionStart' in focused?focused.selectionStart:null;
 if(!pmdEnabled(currentModule))currentModule='dashboard';
 v95_renderContent();var a=document.getElementById('contentArea');
 // Empty datasets never pass through calculated health dashboards.
 var m=pmdModule(currentModule),has=m&&m.array&&pmdRecords(currentModule).length;
 if(currentModule==='hwItems')has=has||appState.swItems.length;
 if(currentModule==='strategy')has=has||Object.values(appState.swot).some(function(x){return x.length;});
 if(currentModule==='links')has=has||appState.specifications.length;
 if(currentModule==='actionPlan')has=has||appState.actionPlanLanes.length;
 if(currentModule!=='dashboard'&&m&&m.array&&!has)a.innerHTML=pmdHeading(currentModule)+pmdEmpty(currentModule);
 if(currentModule!=='dashboard'&&!a.querySelector('.pmd-module-heading'))a.insertAdjacentHTML('afterbegin',pmdHeading(currentModule,'<button class="btn btn-sm" onclick="pmdOpenRelationshipIndex()">Relationships</button>'));
 pmdAdaptTerminology(a);pmdLabelControls(a);a.querySelectorAll('th[onclick],th[data-pmd-event-click]').forEach(function(th){th.tabIndex=0;th.setAttribute('role','button');th.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();th.click();}};});buildNav();if(focusId&&focused?.closest('#contentArea')){var replacement=document.getElementById(focusId);if(replacement){replacement.focus();if(selection!==null&&replacement.setSelectionRange)try{replacement.setSelectionRange(selection,selection);}catch(e){}}}
}
function pmdAdaptTerminology(root){var terms=appState.settings.terminology;var walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);var n;while(n=walk.nextNode()){if(['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(n.parentElement.tagName))continue;n.nodeValue=n.nodeValue.replace(/Subassemblies/g,terms.child+'s').replace(/Subassembly/g,terms.child).replace(/Assemblies/g,terms.structure).replace(/Assembly/g,terms.node).replace(/Racks/g,terms.structure).replace(/Rack/g,terms.node);}}
function pmdLabelControls(root){root.querySelectorAll('input,select,textarea').forEach(function(el,i){if(el.hasAttribute('aria-label')||el.hasAttribute('aria-labelledby'))return;var lab=el.id&&root.querySelector('label[for="'+el.id+'"]');if(!lab)lab=el.closest('.form-group')?.querySelector('label');if(lab)el.setAttribute('aria-label',lab.textContent.trim());else if(el.placeholder)el.setAttribute('aria-label',el.placeholder);else el.setAttribute('aria-label',el.id||'Field '+(i+1));});}
function pmdDialog(title,body,footer){var el=document.getElementById('pmdDialog');if(!el){el=document.createElement('div');el.id='pmdDialog';el.className='modal-overlay pmd-dialog';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');document.body.appendChild(el);}el.setAttribute('aria-label',title);el.innerHTML='<div class="modal modal-wide"><div class="modal-header"><h2>'+esc(title)+'</h2><button class="modal-close" onclick="closeModal(\'pmdDialog\')" aria-label="Close dialog">×</button></div><div class="modal-body">'+body+'</div><div class="modal-footer"><button class="btn" onclick="closeModal(\'pmdDialog\')">Close</button>'+(footer||'')+'</div></div>';openModal('pmdDialog');}
function openModal(id){var existing=document.getElementById(id);if(existing?._trapFocus)existing.removeEventListener('keydown',existing._trapFocus);v95_openModal(id);var el=document.getElementById(id);pmdAdaptTerminology(el);pmdLabelControls(el);el.querySelectorAll('input[type=number]').forEach(function(x){x.removeAttribute('required');});}
function openDetailPanel(title,body,editFn){if(typeof editFn==='string'){var match=editFn.match(/^(\w+)\((\d+)\)$/);editFn=match&&typeof window[match[1]]==='function'?function(){window[match[1]](Number(match[2]));}:null;}v95_openDetailPanel(title,body,editFn);pmdAdaptTerminology(document.getElementById('detailPanel'));}
function pmdInput(id,label,value,type){return '<div class="form-group"><label for="'+id+'">'+esc(label)+'</label><input id="'+id+'" type="'+(type||'text')+'" value="'+esc(value)+'"></div>';}
function pmdSelect(id,label,values,value){return '<div class="form-group"><label for="'+id+'">'+esc(label)+'</label><select id="'+id+'">'+values.map(function(v){return '<option value="'+esc(v)+'"'+(v===value?' selected':'')+'>'+esc(v||'Not configured')+'</option>';}).join('')+'</select></div>';}
function pmdText(id,label,value){return '<div class="form-group"><label for="'+id+'">'+esc(label)+'</label><textarea id="'+id+'">'+esc(value)+'</textarea></div>';}
function pmdValue(id){return document.getElementById(id)?.value.trim()||'';}
function pmdCsvList(text){return [...new Set(text.split(/[\n,]/).map(function(v){return v.trim();}).filter(Boolean))];}

/* One staged settings draft. Cancel discards every edit, including dropdowns. */
function openSettings(page){pmdDraft=pmdClone(appState.settings);pmdSettingsPage=typeof page==='string'?page:'program';pmdShowSettings();}
function pmdShowSettings(){var tabs={program:'Program',modules:'Modules',lists:'Dropdowns',risk:'Risk framework',rules:'Workflow & metrics',display:'Format & reports',help:'Help & tools'};var body='<div class="pmd-settings"><nav class="pmd-settings-nav" aria-label="Settings sections">'+Object.keys(tabs).map(function(k){return '<button class="btn '+(pmdSettingsPage===k?'btn-primary':'')+'" onclick="pmdSettingsTab(\''+k+'\')">'+tabs[k]+'</button>';}).join('')+'</nav><div class="pmd-settings-panel">'+pmdSettingsBody()+'</div></div>';pmdDialog('Program Settings',body,'<button class="btn btn-primary" onclick="saveSettings()">Save settings</button>');}
function pmdSettingsTab(key){pmdReadSettings();pmdSettingsPage=key;pmdShowSettings();}
function pmdSettingsBody(){var s=pmdDraft;
 if(pmdSettingsPage==='program')return '<h3>Adapt PMD to your program</h3><p>Everything is optional. You can begin with an unnamed workspace.</p><div class="pmd-form-grid">'+pmdInput('pcName','Program / Project Name',s.programName)+pmdInput('pcSubtitle','Subtitle',s.subtitle)+pmdInput('pcType','Program type',s.programType)+pmdInput('pcPreparer','Report preparer',s.preparerName)+pmdInput('pcStructure','Structure label',s.terminology.structure)+pmdInput('pcNode','Structural item label',s.terminology.node)+pmdInput('pcChild','Child item label',s.terminology.child)+'</div>'+pmdText('pcTeam','Team members — one name per line',s.team.join('\n'))+'<div class="pmd-note">Team names are suggestions for owner fields. Add structure items from '+esc(pmdName('assemblies'))+'.</div><button class="btn" onclick="pmdOpenSetup()">Configuration presets & setup</button>';
 if(pmdSettingsPage==='modules')return '<h3>Module Manager</h3><p>Disabling hides navigation and home widgets; all records and relationships remain in your backup. Classification describes applicability.</p><div class="pmd-mod-row"><span>Use</span><span>Name</span><span>Group</span><span>Order</span><span>Applicability</span></div>'+PMD_MODULES.slice().sort(function(a,b){return s.modules[a.key].order-s.modules[b.key].order;}).map(function(m){return '<div class="pmd-mod-row"><input aria-label="Enable '+esc(m.name)+'" type="checkbox" data-mod="'+m.key+'" '+(s.modules[m.key].enabled?'checked ':'')+(m.key==='dashboard'?'disabled':'')+'><input aria-label="Name for '+esc(m.name)+'" data-modname="'+m.key+'" value="'+esc(s.moduleNames[m.key])+'"><input aria-label="Group for '+esc(m.name)+'" data-modgroup="'+m.key+'" value="'+esc(s.modules[m.key].group)+'"><span class="pmd-order"><button class="btn btn-sm" aria-label="Move '+esc(m.name)+' up" onclick="pmdMoveModule(\''+m.key+'\',-1)">↑</button><button class="btn btn-sm" aria-label="Move '+esc(m.name)+' down" onclick="pmdMoveModule(\''+m.key+'\',1)">↓</button></span><small>'+m.kind+'</small></div>';}).join('')+'<div class="pmd-actions"><button class="btn" onclick="pmdRestoreModuleNames()">Restore default names</button></div>';
 if(pmdSettingsPage==='lists')return '<h3>Program dropdowns</h3><p>One value per line. Empty lists mean not configured. Existing record values are preserved when lists change. Configure status meanings under Workflow & metrics.</p>'+Object.keys(s.dropdownLists).sort().map(function(k){return '<div class="pmd-list-editor"><label for="pl_'+k+'">'+esc(k.replace(/([A-Z])/g,' $1').replace(/^./,function(c){return c.toUpperCase();}))+'</label><textarea id="pl_'+k+'" data-listkey="'+k+'">'+esc(s.dropdownLists[k].join('\n'))+'</textarea></div>';}).join('');
 if(pmdSettingsPage==='risk')return pmdRiskSettingsBody();
 if(pmdSettingsPage==='rules')return '<h3>Workflow meanings</h3><p>These mappings drive Home, notifications, and relationship blockers. Use your exact status names, separated by commas. No aggregate program health grade is inferred.</p>'+Object.keys(s.statusRules).map(function(k){return '<div class="pmd-card"><strong>'+esc(s.moduleNames[k]||k)+'</strong><div class="pmd-form-grid">'+pmdInput('closed_'+k,'Complete / inactive statuses',s.statusRules[k].closed.join(', '))+pmdInput('blocked_'+k,'Blocked / needs-attention statuses',s.statusRules[k].blocked.join(', '))+(s.statusRules[k].success?pmdInput('success_'+k,'Successful outcome values',s.statusRules[k].success.join(', '))+pmdInput('failure_'+k,'Unsuccessful / partial outcome values',s.statusRules[k].failure.join(', ')):'')+'</div></div>';}).join('')+'<h3 style="margin-top:20px">Metric thresholds</h3>'+pmdInput('ptUpcoming','Upcoming window (days)',s.thresholds.upcomingDays,'number')+pmdInput('ptWarn','EVM warning below ratio (optional)',s.thresholds.evmWarning,'number')+pmdInput('ptCritical','EVM critical below ratio (optional)',s.thresholds.evmCritical,'number')+pmdInput('ptCost','Cost variance attention above % (optional)',s.thresholds.costVariancePercent,'number');
 if(pmdSettingsPage==='display')return '<h3>Formatting and identifiers</h3><div class="pmd-form-grid">'+pmdInput('pcCurrency','Currency code / symbol (blank = unspecified)',s.currency)+pmdSelect('pcDate','Date display',['iso','mdy','dmy'],s.dateFormat)+pmdInput('pcUnits','Default units',s.defaultUnits)+pmdInput('pcReport','Report heading',s.reportHeading)+'</div><h3>Dashboard sections</h3>'+Object.keys(s.dashboard).map(function(k){return '<label style="display:block;padding:7px"><input type="checkbox" data-widget="'+k+'" '+(s.dashboard[k]?'checked':'')+'> '+esc(k)+'</label>';}).join('')+'<h3 style="margin-top:16px">Identifier prefixes</h3><p>Prefixes are display labels; stable numeric IDs and existing references are retained.</p><div class="pmd-form-grid">'+Object.keys(s.prefixes).map(function(k){return pmdInput('prefix_'+k,pmdModule(k)?.name||k,s.prefixes[k]);}).join('')+'</div>';
 return '<h3>PMD 10.1 · Offline program toolkit</h3><p>Session Mode keeps work in memory. Trusted Device Mode is an explicit opt-in on this browser. Export a Program Backup to retain records, configuration, relationships, counters, audit history, and saved filters. A fresh installation always starts blank.</p><div class="pmd-note">Start Blank configures nothing. Presets configure modules and terminology only. Import is validated before replacement and can be undone in this session.</div><div class="pmd-actions"><button class="btn" onclick="exportAllData()">Program Backup</button><button class="btn" onclick="triggerImport()">Import backup</button><button class="btn" onclick="openAuditTrailViewer()">Audit trail</button><button class="btn" onclick="runDataIntegrityCheck()">Data integrity</button><button class="btn" onclick="pmdOpenRelationshipIndex()">Relationships</button><button class="btn" onclick="pmdProgramReport()">Program report</button><button class="btn" onclick="openCalendarView()">Calendar</button><button class="btn" onclick="openByOwnerView()">Owner view</button><button class="btn" onclick="openRaciMatrix()">RACI</button><button class="btn" onclick="openCascadeAnalysis()">Cascade analysis</button><button class="btn" onclick="openTPMDashboard()">Metrics</button><button class="btn" onclick="openKbOverlay()">Keyboard shortcuts</button></div><p>Disabled modules are retained in backups and relationship inspection, but excluded from Home and search.</p><button class="btn btn-danger" onclick="pmdResetProgram()">New blank program…</button>';
}
function pmdReadSettings(){if(!pmdDraft)return;var s=pmdDraft;
 if(pmdSettingsPage==='program'){s.programName=pmdValue('pcName');s.subtitle=pmdValue('pcSubtitle');s.programType=pmdValue('pcType');s.preparerName=pmdValue('pcPreparer');s.terminology={structure:pmdValue('pcStructure')||'Structure',node:pmdValue('pcNode')||'Item',child:pmdValue('pcChild')||'Child item'};s.team=pmdCsvList(pmdValue('pcTeam'));}
 if(pmdSettingsPage==='modules'){document.querySelectorAll('[data-mod]').forEach(function(x){s.modules[x.dataset.mod].enabled=x.checked;});document.querySelectorAll('[data-modname]').forEach(function(x){s.moduleNames[x.dataset.modname]=x.value.trim()||pmdModule(x.dataset.modname).name;});document.querySelectorAll('[data-modgroup]').forEach(function(x){s.modules[x.dataset.modgroup].group=x.value.trim();});}
 if(pmdSettingsPage==='lists')document.querySelectorAll('textarea[data-listkey]').forEach(function(x){s.dropdownLists[x.dataset.listkey]=[...new Set(x.value.split('\n').map(function(v){return v.trim();}).filter(Boolean))];});
 if(pmdSettingsPage==='risk')pmdReadRiskSettings();
 if(pmdSettingsPage==='rules'){Object.keys(s.statusRules).forEach(function(k){var previous=s.statusRules[k];s.statusRules[k]={closed:pmdCsvList(pmdValue('closed_'+k)),blocked:pmdCsvList(pmdValue('blocked_'+k))};if(previous.success){s.statusRules[k].success=pmdCsvList(pmdValue('success_'+k));s.statusRules[k].failure=pmdCsvList(pmdValue('failure_'+k));}});s.thresholds={upcomingDays:pmdNumber('ptUpcoming'),evmWarning:pmdNumber('ptWarn'),evmCritical:pmdNumber('ptCritical'),costVariancePercent:pmdNumber('ptCost')};}
 if(pmdSettingsPage==='display'){s.currency=pmdValue('pcCurrency');s.dateFormat=pmdValue('pcDate');s.defaultUnits=pmdValue('pcUnits');s.reportHeading=pmdValue('pcReport');document.querySelectorAll('[data-widget]').forEach(function(x){s.dashboard[x.dataset.widget]=x.checked;});Object.keys(s.prefixes).forEach(function(k){s.prefixes[k]=pmdValue('prefix_'+k)||PMD_PREFIXES[k];});}
}
function pmdMoveModule(key,delta){pmdReadSettings();var list=PMD_MODULES.slice().sort(function(a,b){return pmdDraft.modules[a.key].order-pmdDraft.modules[b.key].order;});var idx=list.findIndex(function(m){return m.key===key;}),to=idx+delta;if(to<0||to>=list.length)return;var m=list.splice(idx,1)[0];list.splice(to,0,m);list.forEach(function(m,i){pmdDraft.modules[m.key].order=i;});pmdShowSettings();}
function pmdRestoreModuleNames(){pmdReadSettings();PMD_MODULES.forEach(function(m){pmdDraft.moduleNames[m.key]=m.name;});pmdShowSettings();}
function saveSettings(){try{pmdReadSettings();pmdValidateSettings(pmdDraft);Object.keys(pmdDraft.prefixes).forEach(function(k){if(pmdDraft.prefixes[k]!==appState.settings.prefixes[k]){pmdDraft.prefixHistory=pmdDraft.prefixHistory||{};pmdDraft.prefixHistory[k]=[...new Set((pmdDraft.prefixHistory[k]||[]).concat(appState.settings.prefixes[k]))];}});snapshotForUndo('Update program settings');appState.settings=pmdClone(pmdDraft);pmdApplyConfig();updateHeader();closeModal('pmdDialog');logActivity('settings','Updated',null,'Program configuration saved');auditRecord('settings',null,'updated',[],'Program configuration');buildNav();renderContent();toast('Settings saved','success');}catch(e){toast(e.message,'error');}}
function pmdResetProgram(){showConfirm('Start a new blank program','Export a Program Backup first if you want to retain this program. The current workspace will be replaced. You can undo this during the current session.','Start blank',function(){snapshotForUndo('New blank program');appState=pmdBlankState();Object.keys(SNAPSHOT_GLOBAL_COUNTERS).forEach(function(k){SNAPSHOT_GLOBAL_COUNTERS[k].set(1);});_auditLog=[];_raciData={};savedFilters={};pmdApplyConfig();currentModule='dashboard';closeModal('pmdDialog');updateHeader();buildNav();renderContent();markUnsaved();});}

function pmdPreset(key,s){s=s||pmdDefaults();var base=['dashboard','assemblies','risks','actions','milestones','decisions','costTracker','lessons','links','strategy'];var sets={general:base,software:base.concat(['requirements','tests','anomalies','changes','tradeStudies','actionPlan']),hardware:base.concat(['requirements','tests','anomalies','changes','boms','inventory','procurement','tradeStudies']),integration:base.concat(['requirements','tests','anomalies','changes','boms','inventory','procurement','actionPlan']),product:base.concat(['requirements','tests','changes','boms','procurement','tradeStudies'])};PMD_MODULES.forEach(function(m){s.modules[m.key].enabled=(sets[key]||base).includes(m.key);});s.programType={general:'General Project',software:'Software Development',hardware:'Hardware Development',integration:'Systems Integration',product:'Product Development'}[key]||'';s.terminology=key==='hardware'?{structure:'Product structure',node:'Assembly',child:'Component'}:{structure:'Work breakdown',node:'Workstream',child:'Deliverable'};if(key==='software'){s.dropdownLists.actionCategories=['Development','Testing','Documentation','Operations','Management'];s.dropdownLists.structureTypes=['Workstream','Team','Service','Deliverable'];}return s;}
function pmdOpenSetup(){pmdDialog('New Program Setup','<p class="pmd-muted">Begin with only what you need. Presets configure the toolkit and never insert sample records.</p>'+pmdSelect('setupPreset','Configuration preset',['Start Blank','General Project','Hardware Development','Software Development','Systems Integration','Product Development'],'Start Blank')+'<div class="pmd-form-grid">'+pmdInput('setupName','Program / Project Name (optional)',appState.settings.programName)+pmdInput('setupSub','Subtitle (optional)',appState.settings.subtitle)+'</div>'+pmdText('setupNodes','Initial structures / workstreams — optional, one per line','')+pmdText('setupTeam','Initial team members — optional, one per line',appState.settings.team.join('\n'))+'<div class="pmd-form-grid">'+pmdSelect('setupRisk','Risk framework',['Not configured','Likelihood × Impact','Multi-factor sum'],'Not configured')+'</div><details style="margin:16px 0"><summary>Optional capabilities</summary>'+['risks','costTracker','evm','requirements','tests'].map(function(k){return pmdSelect('setupMod_'+k,pmdName(k),['Preset defaults','Enabled','Disabled'],'Preset defaults');}).join('')+'</details><p class="pmd-muted">Modules, wording, scales, and thresholds remain editable in Settings. EVM and Hardware Security Review are opt-in through the Module Manager.</p>','<button class="btn btn-primary" onclick="pmdCompleteSetup()">Start workspace</button>');}
function pmdStartBlank(){snapshotForUndo('Start blank workspace');appState.settings.setupComplete=true;markUnsaved();renderContent();}
function pmdCompleteSetup(){snapshotForUndo('Configure program');var choice=pmdValue('setupPreset'),map={'General Project':'general','Hardware Development':'hardware','Software Development':'software','Systems Integration':'integration','Product Development':'product'};if(map[choice])appState.settings=pmdPreset(map[choice],appState.settings);appState.settings.programName=pmdValue('setupName');appState.settings.subtitle=pmdValue('setupSub');appState.settings.team=pmdCsvList(pmdValue('setupTeam'));var r=pmdValue('setupRisk');if(r!=='Not configured')appState.settings.riskModel=pmdRiskPreset(r==='Likelihood × Impact'?'product':'sum');pmdValue('setupNodes').split('\n').map(function(v){return v.trim();}).filter(Boolean).forEach(function(name){appState.racks.push({id:appState._rackNextId++,name:name,parentId:null,type:appState.settings.terminology.node,identifier:'',description:'',owner:''});});['risks','costTracker','evm','requirements','tests'].forEach(function(k){var choice=pmdValue('setupMod_'+k);if(choice==='Enabled'||choice==='Disabled')appState.settings.modules[k].enabled=choice==='Enabled';});appState.settings.setupComplete=true;pmdApplyConfig();closeModal('pmdDialog');updateHeader();buildNav();renderContent();logActivity('settings','Configured',null,'Program setup completed');}
function applyTemplate(key){pmdOpenSetup();}

/* Scoring contracts are saved on each scored record. Changing the default never
 reinterprets an existing assessment, including imported V9.5 Q/C/S/R scores. */
function pmdRiskPreset(kind){
 if(kind==='legacy')return {id:'legacy-v95',name:'V9.5 Q/C/S/R (preserved)',formula:'sum',dimensions:Object.keys(PMD_LEGACY_FACTORS).map(function(k){return {key:k,label:PMD_LEGACY_FACTORS[k].label,min:1,max:5,labels:Object.fromEntries(PMD_LEGACY_FACTORS[k].scale.filter(function(v){return v.value;}).map(function(v){return [v.value,v.label+' — '+v.desc];}))};}),thresholds:{medium:6,high:11,critical:16,maxHigh:4,maxCritical:5},allowPartial:true};
 var product=kind==='product';return {id:generateId(),name:product?'Likelihood × Impact':'Multi-factor sum',formula:product?'product':'sum',dimensions:(product?['Likelihood','Impact']:['Quality','Cost','Schedule','Reliability']).map(function(label,i){return {key:product?['likelihood','impact'][i]:['quality','cost','schedule','reliability'][i],label:label,min:1,max:5,labels:{}};}),thresholds:product?{medium:5,high:10,critical:20,maxHigh:null,maxCritical:null}:{medium:6,high:11,critical:16,maxHigh:null,maxCritical:null},allowPartial:false};
}
function pmdRiskSettingsBody(){var m=pmdDraft.riskModel;var html='<h3>Risk framework</h3><p>Choose a default for new assessments. Existing records retain their recorded methodology and scores. Preset scales and thresholds are editable starting points.</p><div class="pmd-actions"><button class="btn" onclick="pmdSetRiskPreset(\'none\')">Unconfigured</button><button class="btn" onclick="pmdSetRiskPreset(\'product\')">Likelihood × Impact</button><button class="btn" onclick="pmdSetRiskPreset(\'sum\')">Multi-factor sum</button><button class="btn" onclick="pmdSetRiskPreset(\'legacy\')">V9.5 methodology</button></div>';
 if(!m)return html+'<div class="pmd-note">Not configured. Risks can still be recorded without a score.</div>';
 html+='<div class="pmd-form-grid" style="margin-top:20px">'+pmdInput('rmName','Framework name',m.name)+pmdSelect('rmFormula','Calculation',['sum','product','max'],m.formula)+'</div><p class="pmd-muted">All dimensions must be assessed before calculating a result. Scales use whole numbers; blank means not assessed.</p><div class="pmd-score-row"><span>Dimension</span><span>Min</span><span>Max</span><span></span></div>';
 m.dimensions.forEach(function(d,i){html+='<div class="pmd-score-row"><input aria-label="Dimension '+(i+1)+' label" id="rdLabel_'+i+'" value="'+esc(d.label)+'"><input aria-label="Dimension '+(i+1)+' minimum" type="number" id="rdMin_'+i+'" value="'+d.min+'"><input aria-label="Dimension '+(i+1)+' maximum" type="number" id="rdMax_'+i+'" value="'+d.max+'"><button class="btn btn-sm" onclick="pmdRemoveDimension('+i+')">Remove</button></div>'+pmdText('rdLabels_'+i,'Scale descriptions (one per line: number = description)',Object.entries(d.labels||{}).map(function(x){return x[0]+' = '+x[1];}).join('\n'));});
 return html+'<button class="btn" onclick="pmdAddDimension()">+ Dimension</button><h3 style="margin-top:20px">Criticality thresholds</h3><div class="pmd-form-grid">'+pmdInput('rmMedium','Medium score ≥',m.thresholds.medium,'number')+pmdInput('rmHigh','High score ≥',m.thresholds.high,'number')+pmdInput('rmCritical','Critical score ≥',m.thresholds.critical,'number')+pmdInput('rmMaxHigh','Any dimension high ≥ (optional)',m.thresholds.maxHigh,'number')+pmdInput('rmMaxCritical','Any dimension critical ≥ (optional)',m.thresholds.maxCritical,'number')+'</div><div class="pmd-note">Critical items are highlighted for attention. PMD does not prescribe a formal corrective-action process. Imported V9.5 rules remain available.</div>';
}
function pmdReadRiskSettings(){var m=pmdDraft.riskModel;if(!m||!document.getElementById('rmName'))return;m.name=pmdValue('rmName');m.formula=pmdValue('rmFormula');m.dimensions.forEach(function(d,i){d.label=pmdValue('rdLabel_'+i);d.min=pmdNumber('rdMin_'+i);d.max=pmdNumber('rdMax_'+i);d.labels={};pmdValue('rdLabels_'+i).split('\n').forEach(function(line){var match=line.match(/^\s*(\d+)\s*=\s*(.*)$/);if(match)d.labels[Number(match[1])]=match[2];});});m.thresholds={medium:pmdNumber('rmMedium'),high:pmdNumber('rmHigh'),critical:pmdNumber('rmCritical'),maxHigh:pmdNumber('rmMaxHigh'),maxCritical:pmdNumber('rmMaxCritical')};m.id=generateId();}
function pmdSetRiskPreset(kind){pmdDraft.riskModel=kind==='none'?null:pmdRiskPreset(kind);pmdShowSettings();}
function pmdAddDimension(){pmdReadRiskSettings();if(pmdDraft.riskModel.dimensions.length>=8){toast('Use up to eight risk dimensions.','info');return;}pmdDraft.riskModel.dimensions.push({key:'dimension_'+generateId(),label:'Dimension',min:1,max:5,labels:{}});pmdShowSettings();}
function pmdRemoveDimension(i){pmdReadRiskSettings();pmdDraft.riskModel.dimensions.splice(i,1);pmdShowSettings();}
function pmdAssess(r){var model=r._riskModel||appState.settings.riskModel;if(!model)return {sum:null,max:0,count:0,maxP:0,hasAny:false,complete:false,severity:'Not configured',className:'cs-na',model:null};var values=model.dimensions.map(function(d){return r[d.key];}),valid=values.map(function(v,i){return pmdHasNumber(v)&&v>=model.dimensions[i].min&&v<=model.dimensions[i].max;});var count=valid.filter(Boolean).length,complete=count===values.length,usable=complete||(model.allowPartial&&count>0),rated=values.filter(function(v,i){return valid[i];});var sum=usable?(model.formula==='product'?rated.reduce(function(a,b){return a*b;},1):model.formula==='max'?Math.max.apply(null,rated):rated.reduce(function(a,b){return a+b;},0)):null,max=count?Math.max.apply(null,rated):0,t=model.thresholds;var severity=!usable?'Not assessed':sum>=t.critical||(t.maxCritical!==null&&max>=t.maxCritical)?'Critical':sum>=t.high||(t.maxHigh!==null&&max>=t.maxHigh)?'High':sum>=t.medium?'Medium':'Low';return {sum:sum,max:max,count:count,hasAny:usable,complete:complete,maxP:model.formula==='product'?model.dimensions.reduce(function(a,d){return a*d.max;},1):model.formula==='max'?Math.max.apply(null,model.dimensions.map(function(d){return d.max;})):model.dimensions.reduce(function(a,d){return a+d.max;},0),severity:severity,className:{Critical:'cs-crit',High:'cs-high',Medium:'cs-med',Low:'cs-low'}[severity]||'cs-na',model:model};}
function getCrit(r){return pmdAssess(r);}
function getCritClass(sum,max){if(sum===null||sum===undefined)return 'cs-na';var t=appState.settings.riskModel?.thresholds;if(!t)return 'cs-na';return sum>=t.critical||(t.maxCritical!==null&&max>=t.maxCritical)?'cs-crit':sum>=t.high||(t.maxHigh!==null&&max>=t.maxHigh)?'cs-high':sum>=t.medium?'cs-med':'cs-low';}
function needsFA(c){return c.severity==='Critical';}
var pmdRiskEditingModel=null;
function openAddRiskModal(){riskEditingId=null;pmdRiskEditor({});}
function openEditRiskModal(id){var r=appState.risks.find(function(x){return x.id===id;});if(!r)return;riskEditingId=id;pmdRiskEditor(r);}
function pmdRiskEditor(r){pmdRiskEditingModel=pmdClone(r._riskModel||appState.settings.riskModel);var model=pmdRiskEditingModel;var body='<div class="pmd-form-grid"><div class="full">'+pmdInput('fTitle','Risk title *',r.title)+'</div><div class="full">'+pmdText('fDesc','Description',r.description)+'</div>'+pmdSelect('fCategory','Category',[''].concat(pmdList('riskCategories'),r.category||'').filter(function(v,i,a){return a.indexOf(v)===i;}),r.category||'')+pmdSelect('fStatus','Status',[''].concat(pmdList('riskStatuses'),r.status||'').filter(function(v,i,a){return a.indexOf(v)===i;}),r.status||'')+pmdInput('fOwner','Owner',r.owner)+pmdInput('fDue','Due date',r.due,'date')+'<div class="full">'+pmdText('fMitigation','Response / mitigation',r.mitigation)+'</div></div>';
 body+='<h3>Assessment</h3>'+(model?'<div class="pmd-note">'+esc(model.name)+' · '+esc(model.formula)+' · Saved with this record. '+(r._riskModel?'Editing retains this methodology.':'')+'</div>':'<div class="pmd-note">Risk framework not configured. Save the risk without a score, or configure a methodology in Settings.</div>');
 if(model)model.dimensions.forEach(function(d){body+=pmdSelect('rf_'+d.key,d.label,[''].concat(Array.from({length:d.max-d.min+1},function(_,i){return String(i+d.min);})),pmdHasNumber(r[d.key])&&r[d.key]>=d.min?String(r[d.key]):'');if(Object.keys(d.labels||{}).length)body+='<p class="pmd-muted">'+esc(Object.entries(d.labels).map(function(x){return x[0]+': '+x[1];}).join(' · '))+'</p>';});
 body+='<h3>'+esc(pmdName('assemblies'))+'</h3><div class="pmd-actions">'+appState.racks.map(function(n){return '<label><input type="checkbox" data-risk-node="'+n.id+'" '+((r.rackIds||[]).includes(n.id)?'checked':'')+'> '+esc(n.name)+'</label>';}).join('')+'</div><div id="pmdRiskPreview" class="pmd-note"></div>';
 pmdDialog(r.id?'Edit '+pmdId('risks',r.id):'New risk',body,'<button class="btn btn-primary" onclick="saveRisk()">Save risk</button>');document.querySelectorAll('[id^="rf_"]').forEach(function(el){el.onchange=updateCritPreview;});updateCritPreview();}
function updateCritPreview(){var el=document.getElementById('pmdRiskPreview');if(!el)return;var r={_riskModel:pmdRiskEditingModel};if(pmdRiskEditingModel)pmdRiskEditingModel.dimensions.forEach(function(d){var value=pmdValue('rf_'+d.key);r[d.key]=value===''?null:Number(value);});var a=pmdAssess(r);el.textContent=a.hasAny?'Score: '+a.sum+' · '+a.severity:a.severity+' — complete the configured dimensions to calculate a score.';}
function saveRisk(){var title=pmdValue('fTitle');if(!title){toast('Risk title is required.','error');return;}snapshotForUndo(riskEditingId?'Edit risk':'Add risk');var existing=appState.risks.find(function(r){return r.id===riskEditingId;}),data={title:title,description:pmdValue('fDesc'),category:pmdValue('fCategory'),status:pmdValue('fStatus'),owner:pmdValue('fOwner'),due:pmdValue('fDue'),mitigation:pmdValue('fMitigation'),rackIds:Array.from(document.querySelectorAll('[data-risk-node]:checked')).map(function(x){return Number(x.dataset.riskNode);}),_riskModel:pmdClone(pmdRiskEditingModel),updated:todayStr()};if(pmdRiskEditingModel)pmdRiskEditingModel.dimensions.forEach(function(d){var v=pmdValue('rf_'+d.key);data[d.key]=v===''?null:Number(v);});
 if(existing){var changes=auditDiff(existing,data,Object.keys(data).map(function(k){return {key:k,label:k};}));Object.assign(existing,data);existing.history=existing.history||[];existing.history.push({date:todayStr(),text:'Risk updated; assessment methodology retained.'});auditRecord('risks',existing.id,'updated',changes,title);}
 else{data.id=appState._riskNextId++;data.created=todayStr();data.history=[{date:todayStr(),text:'Risk created.'}];appState.risks.push(data);auditRecord('risks',data.id,'created',[],title);}
 logActivity('risks',existing?'Updated':'Created',pmdId('risks',existing?existing.id:data.id),title);closeModal('pmdDialog');renderContent();}
function getFilteredRisks(){var list=appState.risks.filter(function(r){return (riskStatusFilter==='all'||r.status===riskStatusFilter||riskStatusFilter==='FormalAction'&&needsFA(getCrit(r))||riskStatusFilter==='Overdue'&&r.due&&r.due<todayStr()&&!pmdClosed('risks',r))&&(riskRackFilter==='all'||(r.rackIds||[]).includes(riskRackFilter))&&(!riskSearchQuery||JSON.stringify(r).toLowerCase().includes(riskSearchQuery.toLowerCase()));});return list.sort(function(a,b){var x=riskSortField==='criticality'?(getCrit(a).sum??-1):(a[riskSortField]??''),y=riskSortField==='criticality'?(getCrit(b).sum??-1):(b[riskSortField]??'');return riskSortDir*(typeof x==='number'?x-y:String(x).localeCompare(String(y)));});}
function renderRiskModule(area){var list=getFilteredRisks();var html=pmdHeading('risks','<button class="btn" onclick="openSettings(\'risk\')">Risk framework</button><button class="btn" onclick="openReportModal()">Report</button>');html+='<div class="pmd-actions"><input aria-label="Search risks" placeholder="Search risks" value="'+esc(riskSearchQuery)+'" oninput="riskSearchQuery=this.value;debounce(\'riskSearch\',renderContent,200)"><select aria-label="Risk status filter" onchange="riskStatusFilter=this.value;renderContent()">'+['all'].concat(pmdList('riskStatuses')).map(function(s){return '<option value="'+esc(s)+'" '+(riskStatusFilter===s?'selected':'')+'>'+esc(s==='all'?'All statuses':s)+'</option>';}).join('')+'</select></div>';
 var models=new Set(appState.risks.map(function(r){return (r._riskModel||appState.settings.riskModel)?.id;}).filter(Boolean));if(models.size>1)html+='<div class="pmd-note">This register contains multiple assessment frameworks. Scores are shown with their methodology and are not combined into an average.</div>';
 html+='<div class="pmd-table-wrap"><table class="pmd-table"><thead><tr>'+[['id','ID'],['title','Risk'],['status','Status'],['criticality','Score'],['owner','Owner'],['due','Due']].map(function(x){return '<th><button class="btn btn-sm" onclick="riskSortBy(\''+x[0]+'\')">'+x[1]+sortArrow(x[0],riskSortField,riskSortDir)+'</button></th>';}).join('')+'<th>Manage</th></tr></thead><tbody>'+list.map(riskRow).join('')+'</tbody></table></div>';if(!list.length&&appState.risks.length)html+='<p class="pmd-muted">No risks match these filters.</p>';area.innerHTML=html;}
function riskRow(r){var c=getCrit(r);return '<tr><td>'+esc(pmdId('risks',r.id))+'</td><td><button class="btn btn-sm" onclick="openRiskDetail('+r.id+')">'+esc(r.title||'Untitled')+'</button><div class="pmd-muted">'+esc(r.category)+'</div></td><td>'+esc(r.status||'Not configured')+'</td><td><span class="crit-score '+c.className+'">'+(c.hasAny?c.sum:'—')+'</span> '+esc(c.severity)+'<div class="pmd-muted">'+esc(c.model?.name||'No framework')+'</div></td><td>'+esc(r.owner||'—')+'</td><td>'+fmtDate(r.due)+'</td><td><button class="btn btn-sm" onclick="openEditRiskModal('+r.id+')">Edit</button> <button class="btn btn-sm" onclick="pmdDelete(\'risks\','+r.id+')">Delete</button></td></tr>';}
function renderRiskRegister(a){renderRiskModule(a);}function renderRiskDashboard(a){renderRiskModule(a);}function renderRackMgmt(a){renderAssemblyModule(a);}
function openRiskDetail(id){var r=appState.risks.find(function(x){return x.id===id;});if(!r)return;var c=getCrit(r);var html='<h3>'+esc(r.title)+'</h3><p>'+esc(r.description)+'</p><div class="pmd-note">'+esc(c.model?.name||'Framework not configured')+'<br>Score: '+(c.hasAny?c.sum:'—')+' · '+esc(c.severity)+'</div>'+pmdDetailFields(r,['status','category','owner','due','mitigation'])+(c.model?pmdDetailFields(r,c.model.dimensions.map(function(d){return d.key;})):'')+pmdRelatedHTML('risks',id)+renderAuditHistoryHTML('risks',id);openDetailPanel(pmdId('risks',id),html,'openEditRiskModal('+id+')');}
function riskShowCtx(e,id){e.preventDefault();showContextMenu(e.clientX,e.clientY,[{label:'View details',action:function(){openRiskDetail(id);}},{label:'Edit',action:function(){openEditRiskModal(id);}},{label:'Delete',action:function(){pmdDelete('risks',id);}}]);}
function generateReportHtml(){return '<h1>'+esc(appState.settings.reportHeading||'Program Report')+' · '+esc(pmdName('risks'))+'</h1><p>'+esc(appState.settings.programName||'Unnamed program')+' · '+todayStr()+'</p>'+(appState.risks.length?'<table style="border-collapse:collapse;width:100%"><tr><th>ID</th><th>Risk</th><th>Status</th><th>Methodology</th><th>Score</th><th>Criticality</th></tr>'+appState.risks.map(function(r){var c=getCrit(r);return '<tr>'+[pmdId('risks',r.id),r.title,r.status,c.model?.name||'Not configured',c.hasAny?c.sum:'—',c.severity].map(function(v){return '<td style="border:1px solid #bbb;padding:8px">'+esc(v)+'</td>';}).join('')+'</tr>';}).join('')+'</table>':'<p>No risks have been added.</p>');}

/* A bounded parent/child hierarchy reuses the assembly record identity, so existing
 hardware/risk links remain valid. Legacy subassemblies become child nodes on import. */
function renderAssemblyModule(area){var list=appState.racks.filter(function(n){return !pmdStructureQuery||JSON.stringify(n).toLowerCase().includes(pmdStructureQuery.toLowerCase());}).sort(function(a,b){return String(a[pmdStructureSort]||'').localeCompare(String(b[pmdStructureSort]||''));});area.innerHTML=pmdHeading('assemblies')+'<p class="pmd-muted">Define products, systems, workstreams, teams, or deliverables with a parent, type, identifier, and owner. Up to eight levels.</p><input aria-label="Search structure" placeholder="Search structure" value="'+esc(pmdStructureQuery)+'" oninput="pmdStructureQuery=this.value;debounce(\'structure\',renderContent,200)"><div class="pmd-table-wrap"><table class="pmd-table"><thead><tr><th>Name</th><th>Parent</th><th>Type</th><th>Identifier</th><th>Owner</th><th>Manage</th></tr></thead><tbody>'+list.map(function(n){var p=appState.racks.find(function(x){return x.id===n.parentId;});return '<tr><td><button class="btn btn-sm" onclick="openStructureDetail('+n.id+')">'+esc(n.name)+'</button></td><td>'+esc(p?.name||'—')+'</td><td>'+esc(n.type||'—')+'</td><td>'+esc(n.identifier||pmdId('racks',n.id))+'</td><td>'+esc(n.owner||'—')+'</td><td><button class="btn btn-sm" onclick="openStructureEditor('+n.id+')">Edit</button> <button class="btn btn-sm" onclick="pmdDelete(\'racks\','+n.id+')">Delete</button></td></tr>';}).join('')+'</tbody></table></div>';}
function openStructureEditor(id){var n=appState.racks.find(function(x){return x.id===id;})||{};pmdDialog(n.id?'Edit structure item':'New structure item','<div class="pmd-form-grid">'+pmdInput('strName','Name *',n.name)+pmdInput('strIdentifier','Identifier (optional)',n.identifier)+pmdInput('strType','Type',n.type||'')+pmdInput('strOwner','Owner',n.owner)+'</div><div class="form-group"><label for="strParent">Parent</label><select id="strParent"><option value="">No parent</option>'+appState.racks.filter(function(x){return x.id!==id;}).map(function(x){return '<option value="'+x.id+'" '+(x.id===n.parentId?'selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select></div>'+pmdText('strDescription','Description',n.description),'<button class="btn btn-primary" onclick="pmdSaveStructure('+(id||'null')+')">Save item</button>');var inp=document.getElementById('strType');var dl=document.createElement('datalist');dl.id='structureTypes';pmdList('structureTypes').forEach(function(v){var o=document.createElement('option');o.value=v;dl.appendChild(o);});inp.after(dl);inp.setAttribute('list','structureTypes');}
function pmdSaveStructure(id){var name=pmdValue('strName');if(!name){toast('Name is required.','error');return;}var data={name:name,identifier:pmdValue('strIdentifier'),type:pmdValue('strType'),owner:pmdValue('strOwner'),parentId:Number(pmdValue('strParent'))||null,description:pmdValue('strDescription')};var candidate=pmdClone(appState.racks),found=candidate.find(function(n){return n.id===id;});if(found)Object.assign(found,data);else candidate.push(Object.assign({id:appState._rackNextId},data));try{pmdValidateHierarchy(candidate,'Structure',8);}catch(e){toast(e.message,'error');return;}snapshotForUndo('Save structure item');var existing=appState.racks.find(function(n){return n.id===id;});if(existing)Object.assign(existing,data);else appState.racks.push(Object.assign({id:appState._rackNextId++},data));auditRecord('assemblies',id||appState._rackNextId-1,existing?'updated':'created',[],name);logActivity('assemblies',existing?'Updated':'Created',id,name);closeModal('pmdDialog');renderContent();}
function openStructureDetail(id){var n=appState.racks.find(function(x){return x.id===id;});if(!n)return;openDetailPanel(n.name,pmdDetailFields(n,['identifier','type','description','owner'])+'<h3>Children</h3>'+appState.racks.filter(function(x){return x.parentId===id;}).map(function(x){return '<button class="btn btn-sm" onclick="openStructureDetail('+x.id+')">'+esc(x.name)+'</button>';}).join('')+pmdRelatedHTML('racks',id),'openStructureEditor('+id+')');}
function addRack(){openStructureEditor();}function openEditAssembly(id){openStructureEditor(id);}function openRackEdit(id){openStructureDetail(id);}function getRackLabel(id){return appState.racks.find(function(x){return x.id===id;})?.name||'Missing structure item '+id;}
function pmdDetailFields(r,keys){return keys.map(function(k){return '<div class="detail-field"><div class="detail-label">'+esc(k.replace(/([A-Z])/g,' $1'))+'</div><div>'+esc(r[k]===null||r[k]===undefined||r[k]===''?'—':r[k])+'</div></div>';}).join('');}

/* Home uses only enabled modules and explicitly entered data. Zero counts are real
 counts; undefined performance metrics remain uncalculated. */
function pmdClosed(k,r){var rules=appState.settings.statusRules[k]||{};return (rules.closed||[]).includes(r.status||r.result||r.verStatus||'');}
function isActionOverdue(a){return !!(a.due&&a.due<todayStr()&&!pmdClosed('actions',a));}
function pmdAttention(){var out=[],today=todayStr();PMD_MODULES.forEach(function(m){if(!pmdEnabled(m.key)||!m.array)return;pmdRecords(m.key).forEach(function(r){if(pmdClosed(m.key,r))return;var date=r.due||r.dueDate||r.targetDate||r.dateNeeded||r.date,blocked=(appState.settings.statusRules[m.key]?.blocked||[]).includes(r.status||r.result);if(blocked)out.push({module:m.key,id:r.id,title:pmdTitle(r),reason:'Needs attention: '+(r.status||r.result)});else if(date&&date<today)out.push({module:m.key,id:r.id,title:pmdTitle(r),reason:'Overdue · '+fmtDate(date)});else if(m.key==='risks'&&['High','Critical'].includes(getCrit(r).severity))out.push({module:m.key,id:r.id,title:pmdTitle(r),reason:getCrit(r).severity+' risk'});else if(m.key==='decisions'&&r.status&&!pmdClosed(m.key,r))out.push({module:m.key,id:r.id,title:pmdTitle(r),reason:'Pending decision'});else if(m.key==='actions'&&r.priority&&r.priority===pmdList('actionPriorities')[0])out.push({module:m.key,id:r.id,title:pmdTitle(r),reason:'Highest configured priority'});else if(m.key==='costTracker'&&appState.settings.thresholds.costVariancePercent!==null&&pmdHasNumber(r.budget)&&r.budget>0&&pmdCostVariance([r],true)!==null&&(-pmdCostVariance([r],true)/r.budget*100)>appState.settings.thresholds.costVariancePercent)out.push({module:m.key,id:r.id,title:pmdTitle(r),reason:'Forecast exceeds configured budget variance threshold'});});});return out;}
function pmdUpcoming(){var today=todayStr(),end=new Date(today+'T12:00:00');end.setDate(end.getDate()+appState.settings.thresholds.upcomingDays);var limit=end.toISOString().slice(0,10),out=[];['actions','milestones','procurement','tests','risks','changes'].forEach(function(k){if(!pmdEnabled(k))return;pmdRecords(k).forEach(function(r){var date=r.due||r.dueDate||r.date||r.targetDate||r.eta||r.dateNeeded||r.scheduledDate;if(date&&date>=today&&date<=limit&&!pmdClosed(k,r))out.push({module:k,id:r.id,title:pmdTitle(r),reason:fmtDate(date),date:date});});});return out.sort(function(a,b){return a.date.localeCompare(b.date);});}
function pmdHomeRows(items,empty){return items.length?items.slice(0,10).map(function(x){return '<div class="pmd-row"><span><button class="btn btn-sm" onclick="navigateToItem(\''+x.module+'\','+x.id+')">'+esc(x.title)+'</button><div class="pmd-muted">'+esc(pmdName(x.module))+' · '+esc(x.reason)+'</div></span></div>';}).join('')+(items.length>10?'<p class="pmd-muted">'+(items.length-10)+' more items in the corresponding modules.</p>':''):'<p class="pmd-muted">'+esc(empty)+'</p>';}
function renderDashboard(area){var total=Object.keys(PMD_COUNTERS).reduce(function(n,k){return n+(appState[k]||[]).length;},0),s=appState.settings;var html='';
 if(!total&&!s.setupComplete)html='<section class="pmd-hero"><div class="pmd-eyebrow">PMD 10.1 / Your program starts here</div><h1>A blank workspace.<br>Built around your program.</h1><p>Plan work, manage risks, connect engineering decisions, and track execution. Start with the essentials and enable specialist tools when you need them.</p><div class="pmd-actions"><button class="btn btn-primary" onclick="pmdStartBlank()">Start Blank</button><button class="btn" onclick="pmdOpenSetup()">New Program Setup</button><button class="btn" onclick="triggerImport()">Import Program Backup</button></div><p class="pmd-muted">Offline capable · No account · Explicit backups</p></section>';
 else html='<section class="pmd-hero"><div class="pmd-eyebrow">Program overview</div><h1>'+esc(s.programName||'Your workspace')+'</h1><p>'+esc(s.subtitle||(!total?'Ready for your first item. Configure only what you need.':'Attention, upcoming work, and connected decisions.'))+'</p><div class="pmd-actions"><button class="btn btn-primary" onclick="switchModule(\'actions\')">Open actions</button><button class="btn" onclick="openSettings(\'modules\')">Manage modules</button><button class="btn" onclick="pmdProgramReport()">Program report</button></div></section>';
 var attention=pmdAttention(),upcoming=pmdUpcoming();html+='<div class="pmd-grid">';
 if(s.dashboard.attention)html+='<section class="pmd-card"><h2>What needs attention?</h2>'+pmdHomeRows(attention,total?'No matching attention items in enabled modules.':'No data yet. Add actions, risks, or decisions to surface attention items.')+'</section>';
 if(s.dashboard.upcoming)html+='<section class="pmd-card"><h2>What is coming?</h2>'+pmdHomeRows(upcoming,'No dated work in the next '+s.thresholds.upcomingDays+' days. Missing dates are not treated as late.')+'</section>';
 if(s.dashboard.dependencies){var rels=pmdAllRelationships().filter(function(e){return pmdEnabled(e.from.module)&&pmdEnabled(e.to.module);});html+='<section class="pmd-card"><h2>Where are the dependencies?</h2><p class="pmd-muted">'+(rels.length?rels.length+' intentional relationships across enabled modules.':'No intentional relationships recorded.')+'</p>'+rels.filter(function(e){return e.type==='depends on';}).slice(0,6).map(function(e){var from=pmdFind(e.from),to=pmdFind(e.to);return '<div class="pmd-row"><span>'+esc(from?pmdTitle(from):'Missing source')+' → '+esc(to?pmdTitle(to):'Missing target')+'<div class="pmd-muted">'+(to?pmdClosed(pmdModule(e.to.module)?.key,to)?'Dependency complete':'Dependency unresolved':'Reference needs review')+'</div></span></div>';}).join('')+'<button class="btn btn-sm" onclick="pmdOpenRelationshipIndex()">Explore relationships</button></section>';}
 if(s.dashboard.activity)html+='<section class="pmd-card"><h2>What changed?</h2>'+(appState.activityLog.filter(function(x){return x.module==='settings'||pmdEnabled(x.module);}).slice(0,8).map(function(x){return '<div class="pmd-row"><span>'+esc(x.action)+' · '+esc(x.desc)+'<div class="pmd-muted">'+fmtDate(x.timestamp)+'</div></span></div>';}).join('')||'<p class="pmd-muted">No activity recorded. Changes appear here as you work.</p>')+'</section>';
 if(s.dashboard.overview)html+='<section class="pmd-card"><h2>What does the program contain?</h2>'+PMD_MODULES.filter(function(m){return m.array&&pmdEnabled(m.key);}).map(function(m){var n=pmdRecords(m.key).length;return '<div class="pmd-row"><span>'+esc(pmdName(m.key))+'</span><button class="btn btn-sm" onclick="switchModule(\''+m.key+'\')">'+(n?n+' records':'No data')+'</button></div>';}).join('')+'</section>';
 html+='</div><div class="pmd-actions"><button class="btn" onclick="openSettings()">Program settings</button><button class="btn" onclick="runDataIntegrityCheck()">Check data integrity</button><button class="btn" onclick="openAuditTrailViewer()">Audit history</button><button class="btn" onclick="performUndo()">Undo</button><button class="btn" onclick="performRedo()">Redo</button><button class="btn" onclick="exportAllData()">Program Backup</button></div>';area.innerHTML=html;}
function getNotifications(){return pmdAttention().map(function(x){return {module:x.module,id:x.id,type:'attention',severity:'high',title:x.title,detail:x.reason,action:function(){navigateToItem(x.module,x.id);}};});}
function performGlobalSearch(q,results){q=q.trim().toLowerCase();results=results||document.getElementById('globalSearchResults');var out=[];PMD_MODULES.filter(function(m){return m.array&&pmdEnabled(m.key);}).forEach(function(m){pmdRecords(m.key).forEach(function(r){if((pmdTitle(r)+' '+pmdId(m.array,r.id)+' '+JSON.stringify(r)).toLowerCase().includes(q))out.push({m:m,r:r});});});if(pmdEnabled('hwItems'))appState.swItems.forEach(function(r){if(JSON.stringify(r).toLowerCase().includes(q))out.push({m:pmdModule('swItems'),r:r});});results.innerHTML='<div style="padding:12px"><strong>'+out.length+' results</strong>'+out.slice(0,40).map(function(x){return '<button class="nav-item" style="width:100%;white-space:normal" onclick="closeGlobalSearch();navigateToItem(\''+x.m.array+'\','+x.r.id+')">'+esc(pmdId(x.m.array,x.r.id))+' · '+esc(pmdTitle(x.r))+'<small> · '+esc(pmdName(x.m.key))+'</small></button>';}).join('')+(!out.length?'<p class="pmd-muted">No matching records in enabled modules.</p>':'')+'</div>';results.classList.add('open');results.style.display='block';}
function closeGlobalSearch(){var el=document.getElementById('globalSearchResults');el.classList.remove('open');el.style.display='none';}
function handleGlobalSearch(e){if(e.key==='Escape'){closeGlobalSearch();return;}var q=document.getElementById('globalSearchInput').value;clearTimeout(globalSearchDebounceTimer);if(!q.trim()){closeGlobalSearch();return;}globalSearchDebounceTimer=setTimeout(function(){performGlobalSearch(q);},180);}
function navigateToItem(key,id){var m=pmdModule(key);if(!m)return;if(!pmdEnabled(key)){pmdDialog('Retained in a disabled module','<p>'+esc(pmdTitle(pmdFind({module:key,id:id})||{}))+'</p><p class="pmd-muted">This record is retained. Enable '+esc(pmdName(key))+' in Settings to edit it.</p>','<button class="btn" onclick="openSettings(\'modules\')">Module Manager</button>');return;}switchModule(m.key);if(m.detail&&typeof window[m.detail]==='function')window[m.detail](id);}

/* Relationships: stable collection + numeric ID endpoints. Existing explicit FK
 fields are adapters, never duplicated into a competing source of truth. Text
 similarity and matching part numbers are deliberately excluded. */
var PMD_REL_RULES=FK_SCHEMA.map(function(r){return {from:r.sourceArr,field:r.field,to:r.targetArr,type:r.field==='linkedTestId'?'verifies':'relates to'};}).concat([
 {from:'tests',field:'reqId',to:'requirements',type:'verifies'},
 {from:'actions',field:'blockedBy',to:'actions',type:'depends on'},
 {from:'evmPackages',field:'linkedActions',to:'actions',type:'relates to'},
 {from:'hwItems',field:'assemblyId',to:'racks',type:'belongs to'},
 {from:'boms',field:'assemblyId',to:'racks',type:'belongs to'},
 {from:'inventory',field:'linkedBomId',to:'boms',type:'fulfills'},
 {from:'actionPlanCards',field:'dependsOn',to:'actionPlanCards',type:'depends on'},
 {from:'milestones',field:'linkedActionIds',to:'actions',type:'depends on'},
 {from:'swItems',field:'assemblyId',to:'racks',type:'belongs to'}
]);
function pmdArray(key){return {risk:'risks',action:'actions',bom:'boms',hw:'hwItems',assembly:'racks',assemblies:'racks',evm:'evmPackages',costTracker:'costItems',procurement:'purchases',actionPlan:'actionPlanCards',strategy:'stakeholders',links:'linkSections'}[key]||key;}
function pmdFind(ep,state){state=state||appState;return (state[pmdArray(ep.module)]||[]).find(function(r){return r.id===ep.id;});}
function pmdRefId(value,arr,state){if(typeof value==='number')return value;if(typeof value!=='string')return null;state=state||appState;var v=value.trim();var exact=(state[arr]||[]).find(function(r){return r.reqId&&r.reqId===v;});if(exact)return exact.id;if(/^\d+$/.test(v))return Number(v);var m=v.match(/^([A-Za-z][A-Za-z0-9_]*)-(\d+)$/);if(!m)return null;var prefixes=[state.settings.prefixes[arr],PMD_PREFIXES[arr]].concat(state.settings.prefixHistory?.[arr]||[]).concat({risks:['RSK'],actions:['ACT','A'],costItems:['COST'],tests:['TST'],evmPackages:['EVM'],changes:['CHG'],lessons:['LES']}[arr]||[]);return prefixes.some(function(p){return p&&p.toUpperCase()===m[1].toUpperCase();})?Number(m[2]):null;}
function pmdRefs(value){return Array.isArray(value)?value:value===null||value===undefined||value===''?[]:String(value).split(',').map(function(v){return v.trim();}).filter(Boolean);}
function pmdAllRelationships(state){state=state||appState;var out=(state.relationships||[]).map(function(e){return Object.assign({},e,{from:{module:pmdArray(e.from.module),id:e.from.id},to:{module:pmdArray(e.to.module),id:e.to.id}});});PMD_REL_RULES.forEach(function(rule){(state[rule.from]||[]).forEach(function(r){pmdRefs(r[rule.field]).forEach(function(v,i){var id=pmdRefId(v,rule.to,state);if(id!==null)out.push({id:'legacy:'+rule.from+':'+r.id+':'+rule.field+':'+i,from:{module:rule.from,id:r.id},to:{module:rule.to,id:id},type:rule.type,legacy:{field:rule.field,value:v}});});});});
 (state.risks||[]).forEach(function(r){var ids=r.rackIds||[];if(ids.includes('all'))ids=state.racks.map(function(n){return n.id;});ids.forEach(function(id){out.push({id:'rack:'+r.id+':'+id,from:{module:'risks',id:r.id},to:{module:'racks',id:id},type:'affects',legacy:{field:'rackIds',value:id}});});});
 ['racks','boms'].forEach(function(arr){(state[arr]||[]).forEach(function(r){if(r.parentId)out.push({id:'parent:'+arr+':'+r.id,from:{module:arr,id:r.id},to:{module:arr,id:r.parentId},type:'child of',legacy:{field:'parentId',value:r.parentId}});});});return out;
}
function pmdSame(a,b){return pmdArray(a.module)===pmdArray(b.module)&&a.id===b.id;}
function pmdRelated(key,id){var ep={module:pmdArray(key),id:id};return pmdAllRelationships().filter(function(e){return pmdSame(e.from,ep)||pmdSame(e.to,ep);});}
function pmdAreRelated(a,idA,b,idB){return pmdRelated(a,idA).some(function(e){return pmdSame(e.from,{module:b,id:idB})||pmdSame(e.to,{module:b,id:idB});});}
function pmdRelatedHTML(key,id){var rels=pmdRelated(key,id);return '<section class="pmd-rel"><h3>Everything related to this item</h3>'+(rels.length?rels.map(function(e){var other=pmdSame(e.from,{module:key,id:id})?e.to:e.from,r=pmdFind(other);return '<div class="pmd-row"><span><button class="btn btn-sm" onclick="navigateToItem(\''+other.module+'\','+other.id+')">'+esc(pmdId(other.module,other.id))+' · '+esc(r?pmdTitle(r):'Missing record')+'</button><div class="pmd-muted">'+esc(e.type)+(pmdEnabled(other.module)?'':' · module disabled')+(e.legacy?' · record field':'')+'</div></span></div>';}).join(''):'<p class="pmd-muted">No intentional relationships recorded.</p>')+'<div class="pmd-actions"><button class="btn btn-sm" onclick="pmdRelationshipEditor(\''+pmdArray(key)+'\','+id+')">+ Link item</button><button class="btn btn-sm" onclick="openImpactAnalysis(\''+pmdArray(key)+'\','+id+')">Manage relationships</button></div></section>';}
function pmdRelationshipEditor(key,id){var modules=Object.keys(PMD_COUNTERS).filter(function(k){return (appState[k]||[]).length&&pmdEnabled(k);});pmdDialog('Link a related item','<p class="pmd-muted">Links are intentional and bidirectional in inspection. A dependency points from the blocked item to its prerequisite.</p><div class="form-group"><label for="relModule">Target module</label><select id="relModule" onchange="pmdRelationshipOptions()">'+modules.map(function(k){return '<option value="'+k+'">'+esc(pmdName(k))+'</option>';}).join('')+'</select></div><div class="form-group"><label for="relItem">Target record</label><select id="relItem"></select></div>'+pmdSelect('relType','Relationship',pmdList('relationshipTypes'),'relates to')+pmdText('relNote','Notes (optional)',''),'<button class="btn btn-primary" onclick="pmdSaveRelationship(\''+key+'\','+id+')">Create link</button>');pmdRelationshipOptions();}
function pmdRelationshipOptions(){var arr=pmdValue('relModule');document.getElementById('relItem').innerHTML=(appState[arr]||[]).map(function(r){return '<option value="'+r.id+'">'+esc(pmdId(arr,r.id)+' · '+pmdTitle(r))+'</option>';}).join('');}
function pmdSaveRelationship(key,id){var target={module:pmdValue('relModule'),id:Number(pmdValue('relItem'))},from={module:key,id:id},type=pmdValue('relType');if(!pmdFind(target)||pmdSame(from,target)||!type){toast('Choose a different existing item and a relationship type.','error');return;}if(pmdAllRelationships().some(function(e){return e.type===type&&pmdSame(e.from,from)&&pmdSame(e.to,target);})){toast('That relationship already exists.','info');return;}snapshotForUndo('Link related items');appState.relationships.push({id:generateId(),from:from,to:target,type:type,note:pmdValue('relNote'),createdAt:nowISO()});logActivity('relationships','Linked',id,pmdId(key,id)+' → '+pmdId(target.module,target.id));auditRecord('relationships',id,'created',[],type);openImpactAnalysis(key,id);renderContent();}
function openImpactAnalysis(key,id){key=pmdArray(key);var r=pmdFind({module:key,id:id});if(!r)return;var rels=pmdRelated(key,id);pmdDialog('Relationships · '+pmdId(key,id),'<h3>'+esc(pmdTitle(r))+'</h3>'+(rels.length?rels.map(function(e,i){var other=pmdSame(e.from,{module:key,id:id})?e.to:e.from,item=pmdFind(other);return '<div class="pmd-row"><span>'+esc(e.type)+' · '+esc(pmdId(other.module,other.id))+' · '+esc(item?pmdTitle(item):'Missing record')+'<div class="pmd-muted">'+(pmdEnabled(other.module)?'':'Module disabled · ')+esc(e.note||'')+'</div></span><button class="btn btn-sm" onclick="pmdUnlink('+i+',\''+key+'\','+id+')">Unlink</button></div>';}).join(''):'<p class="pmd-muted">No links yet. Text matches are not relationships.</p>'),'<button class="btn btn-primary" onclick="pmdRelationshipEditor(\''+key+'\','+id+')">+ Link item</button>');}
function pmdRemoveEdge(e){if(!e.legacy){appState.relationships=appState.relationships.filter(function(x){return x.id!==e.id;});return;}var r=pmdFind(e.from);if(!r)return;var f=e.legacy.field;if(f==='rackIds'&&(r[f]||[]).includes('all'))r[f]=appState.racks.map(function(x){return x.id;}).filter(function(id){return id!==e.to.id;});else if(Array.isArray(r[f]))r[f]=r[f].filter(function(v){return pmdRefId(v,e.to.module)!==e.to.id;});else if(typeof r[f]==='number')r[f]=null;else r[f]=pmdRefs(r[f]).filter(function(v){return pmdRefId(v,e.to.module)!==e.to.id;}).join(', ');}
function pmdUnlink(index,key,id){var e=pmdRelated(key,id)[index];if(!e)return;snapshotForUndo('Remove relationship');pmdRemoveEdge(e);logActivity('relationships','Unlinked',id,e.type);auditRecord('relationships',id,'deleted',[],e.type);openImpactAnalysis(key,id);renderContent();}
function pmdOpenRelationshipIndex(){var rels=pmdAllRelationships();pmdDialog('Program relationships','<p class="pmd-muted">Explicit links only. Disabled modules retain their links. Add links from any record’s detail panel.</p>'+ (rels.length?'<div class="pmd-table-wrap"><table class="pmd-table"><thead><tr><th>From</th><th>Relationship</th><th>To</th><th>Manage</th></tr></thead><tbody>'+rels.map(function(e){return '<tr><td>'+esc(pmdId(e.from.module,e.from.id))+' · '+esc(pmdFind(e.from)?pmdTitle(pmdFind(e.from)):'Missing')+'</td><td>'+esc(e.type)+'</td><td>'+esc(pmdId(e.to.module,e.to.id))+' · '+esc(pmdFind(e.to)?pmdTitle(pmdFind(e.to)):'Missing')+'</td><td><button class="btn btn-sm" onclick="openImpactAnalysis(\''+e.from.module+'\','+e.from.id+')">Inspect</button></td></tr>';}).join('')+'</tbody></table></div>':'<p>No relationships recorded.</p>'));}
function buildLinkGraph(key,id){var graph={risks:[],actions:[],boms:[],inventory:[],hwItems:[],swItems:[],assemblies:[]};pmdRelated(key,id).forEach(function(e){var other=pmdSame(e.from,{module:pmdArray(key),id:id})?e.to:e.from,k=other.module==='racks'?'assemblies':other.module;graph[k]=graph[k]||[];var r=pmdFind(other);graph[k].push({id:other.id,title:r?pmdTitle(r):'Missing record',status:r?.status||'',rel:e.type});});return graph;}
function countGraphLinks(g){return Object.values(g).reduce(function(n,a){return n+a.length;},0);}
function renderLinkGraphHTML(g){return Object.keys(g).map(function(k){return g[k].map(function(r){return '<div class="pmd-row"><button class="btn btn-sm" onclick="navigateToItem(\''+k+'\','+r.id+')">'+esc(r.title)+'</button><span>'+esc(r.rel)+'</span></div>';}).join('');}).join('')||'<p class="pmd-muted">No intentional relationships.</p>';}
function pmdAttachRelated(key,id){pmdDetailContext={module:key,id:id};var panel=document.getElementById('detailPanelBody')||document.querySelector('#detailPanel .detail-body');if(panel&&!panel.querySelector('.pmd-rel'))panel.insertAdjacentHTML('beforeend',pmdRelatedHTML(key,id));}
function openActionDetail(id){v95_openActionDetail(id);pmdAttachRelated('actions',id);}function openBomDetail(id){v95_openBomDetail(id);pmdAttachRelated('boms',id);}function openInvDetail(id){v95_openInvDetail(id);pmdAttachRelated('inventory',id);}function openHwDetail(id){v95_openHwDetail(id);pmdAttachRelated('hwItems',id);}function openSwDetail(id){v95_openSwDetail(id);document.getElementById('detailPanel').classList.add('open');pmdAttachRelated('swItems',id);}function openDecisionDetail(id){v95_openDecisionDetail(id);pmdAttachRelated('decisions',id);}function openMilestoneDetail(id){v95_openMilestoneDetail(id);pmdAttachRelated('milestones',id);}function openChangeDetail(id){v95_openChangeDetail(id);pmdAttachRelated('changes',id);}function openTestDetail(id){v95_openTestDetail(id);pmdAttachRelated('tests',id);}function openLessonDetail(id){v95_openLessonDetail(id);pmdAttachRelated('lessons',id);}function openReqDetail(id){v95_openReqDetail(id);pmdAttachRelated('requirements',id);}function openTradeDetail(id){v95_openTradeDetail(id);pmdAttachRelated('tradeStudies',id);}function openAnomDetail(id){v95_openAnomDetail(id);pmdAttachRelated('anomalies',id);}function openCostDetail(id){var r=appState.costItems.find(function(x){return x.id===id;});if(!r)return;openDetailPanel(pmdId('costItems',id),'<'+'h3>'+esc(r.title)+'</h3>'+pmdDetailFields(r,['wbsCode','category','owner','period','notes'])+['budget','actual','committed','etc'].map(function(k){return '<div class="detail-field"><span class="detail-label">'+esc(k)+'</span><span>'+fmtCurrency(r[k])+'</span></div>';}).join('')+'<p>Remaining budget: '+fmtCurrency(pmdCostVariance([r],false))+'<br>Forecast variance: '+fmtCurrency(pmdCostVariance([r],true))+'</p>'+pmdRelatedHTML('costItems',id)+renderAuditHistoryHTML('costTracker',id),function(){openCostModal(id);});}function openPurchaseDetail(id){var r=appState.purchases.find(function(x){return x.id===id;});if(!r)return;openDetailPanel(pmdId('purchases',id),'<h3>'+esc(r.itemName)+'</h3>'+pmdDetailFields(r,['vendor','partNumber','category','status','qty','requester','poNumber','dateNeeded','dateOrdered','eta','dateReceived','trackingNumber','notes'])+'<p>Unit cost: '+fmtCurrency(r.unitCost)+'<br>Total: '+fmtCurrency(pmdMultiply(r.qty,r.unitCost))+'</p><button class="btn" onclick="offerProcurementClosure(appState.purchases.find(function(x){return x.id==='+id+';}))">Apply receipt to linked records…</button>'+pmdRelatedHTML('purchases',id),function(){openPurchaseModal(id);});}
function pmdDelete(arr,id){arr=pmdArray(arr);var r=pmdFind({module:arr,id:id});if(!r)return;var edges=pmdRelated(arr,id);showConfirm('Delete '+pmdId(arr,id),'Delete <strong>'+esc(pmdTitle(r))+'</strong>? '+edges.length+' reference(s) will be removed. Child structure/BOM records will remain with no parent. Undo restores the record and its relationships.','Delete',function(){snapshotForUndo('Delete '+pmdId(arr,id));edges.forEach(pmdRemoveEdge);appState[arr]=appState[arr].filter(function(x){return x.id!==id;});if(arr==='racks')appState.subs=appState.subs.filter(function(s){return s.id!==r._legacySubId;});auditRecord(pmdModule(arr)?.key||arr,id,'deleted',[],pmdTitle(r));logActivity(pmdModule(arr)?.key||arr,'Deleted',id,pmdTitle(r));closeDetailPanel();closeModal('pmdDialog');renderContent();});}
function deleteRack(id){pmdDelete('racks',id);}function deleteDecision(id){pmdDelete('decisions',id);}function deleteMilestone(id){pmdDelete('milestones',id);}function deleteEvmPackage(id){pmdDelete('evmPackages',id);}function deleteChange(id){pmdDelete('changes',id);}function deleteTest(id){pmdDelete('tests',id);}function deleteLesson(id){pmdDelete('lessons',id);}function deleteReq(id){pmdDelete('requirements',id);}function deleteTrade(id){pmdDelete('tradeStudies',id);}function deleteAnom(id){pmdDelete('anomalies',id);}function deleteCost(id){pmdDelete('costItems',id);}function deletePurchase(id){pmdDelete('purchases',id);}
function runFkIntegritySweep(){var out=[];pmdAllRelationships().forEach(function(e){if(!pmdFind(e.from)||!pmdFind(e.to))out.push(pmdId(e.from.module,e.from.id)+' → '+pmdId(e.to.module,e.to.id)+' has a missing endpoint.');});PMD_REL_RULES.forEach(function(rule){(appState[rule.from]||[]).forEach(function(r){pmdRefs(r[rule.field]).forEach(function(v){if(pmdRefId(v,rule.to)===null)out.push(pmdId(rule.from,r.id)+' has an unresolved '+rule.field+': '+v);});});});return out;}
function runDataIntegrityCheck(){var issues=runFkIntegritySweep();['racks','boms'].forEach(function(k){try{pmdValidateHierarchy(appState[k],k, k==='racks'?8:100);}catch(e){issues.push(e.message);}});pmdDialog('Data integrity',issues.length?'<p>'+issues.length+' issue(s). References remain preserved for review.</p><ul>'+issues.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'<p>No missing explicit references or hierarchy cycles found.</p><p class="pmd-muted">This checks structure and links. It does not judge the completeness or quality of your program data.</p>');return issues;}

/* Versioned backup: validate and normalize in isolation, then replace atomically.
 Legacy omissions become blank arrays rather than leaking the previous program. */
function pmdValidateJSON(x,path,depth){path=path||'backup';depth=depth||0;if(depth>40)throw Error(path+': nesting exceeds 40 levels.');if(x===null)return;if(typeof x==='number'&&!Number.isFinite(x))throw Error(path+': number is not finite.');if(typeof x==='string'&&x.length>2000000)throw Error(path+': text is too long.');if(typeof x==='object'){if(Array.isArray(x)&&x.length>100000)throw Error(path+': too many entries.');Object.keys(x).forEach(function(k){if(['__proto__','prototype','constructor'].includes(k))throw Error(path+': unsafe property '+k);pmdValidateJSON(x[k],path+'.'+k,depth+1);});}}
function pmdMerge(base,source){var out=pmdClone(base);Object.keys(source||{}).forEach(function(k){var v=source[k];if(v&&typeof v==='object'&&!Array.isArray(v)&&out[k]&&typeof out[k]==='object'&&!Array.isArray(out[k]))out[k]=pmdMerge(out[k],v);else out[k]=pmdClone(v);});return out;}
function pmdValidateRiskModel(m){if(m===null)return;if(!m||typeof m!=='object'||typeof m.name!=='string'||!['sum','product','max'].includes(m.formula))throw Error('Risk framework requires a supported calculation.');if(!Array.isArray(m.dimensions)||m.dimensions.length<1||m.dimensions.length>8)throw Error('Risk framework requires 1–8 dimensions.');var seen=new Set();m.dimensions.forEach(function(d){if(!d||!/^([a-z][a-z0-9_]*)$/i.test(d.key)||['id','title','status','owner','description','due','category','mitigation','rackIds','constructor','prototype','__proto__'].includes(d.key)||seen.has(d.key))throw Error('Risk dimension keys must be safe and unique.');seen.add(d.key);if(typeof d.label!=='string'||!d.label.trim()||!Number.isInteger(d.min)||!Number.isInteger(d.max)||d.min<0||d.max<d.min||d.max>100)throw Error('Risk dimensions require a label and whole-number bounds from 0 to 100.');if(d.labels!==undefined&&(!d.labels||Array.isArray(d.labels)||typeof d.labels!=='object'))throw Error('Risk scale descriptions must be a dictionary.');});var t=m.thresholds;if(!t||!['medium','high','critical'].every(function(k){return pmdHasNumber(t[k]);})||t.medium>t.high||t.high>t.critical)throw Error('Risk thresholds must be numeric and ordered medium ≤ high ≤ critical.');['maxHigh','maxCritical'].forEach(function(k){if(t[k]!==null&&!pmdHasNumber(t[k]))throw Error('Risk dimension override must be numeric or empty.');});}
function pmdValidateSettings(s){if(!s||typeof s!=='object'||Array.isArray(s))throw Error('Settings must be an object.');['toolTitle','programName','subtitle','programType','currency','dateFormat','defaultUnits','reportHeading','theme','preparerName'].forEach(function(k){if(typeof s[k]!=='string')throw Error('Setting '+k+' must be text.');});if(!/^#[0-9a-f]{6}$/i.test(s.accent))throw Error('Accent must be a six-digit color.');if(!['iso','mdy','dmy'].includes(s.dateFormat)||!['light','dark'].includes(s.theme))throw Error('Unsupported date format or theme.');if(!Array.isArray(s.team)||s.team.some(function(v){return typeof v!=='string';}))throw Error('Team members must be text.');['structure','node','child'].forEach(function(k){if(typeof s.terminology[k]!=='string'||s.terminology[k].length>80)throw Error('Invalid terminology: '+k);});PMD_MODULES.forEach(function(m){var c=s.modules[m.key];if(!c||typeof c.enabled!=='boolean'||!Number.isInteger(c.order)||typeof c.group!=='string'||typeof s.moduleNames[m.key]!=='string')throw Error('Invalid module configuration: '+m.key);});if(!s.modules.dashboard.enabled)throw Error('Home must remain enabled.');Object.keys(s.dropdownLists).forEach(function(k){var list=s.dropdownLists[k];if(!/^[a-zA-Z][a-zA-Z0-9]*$/.test(k)||!Array.isArray(list)||list.some(function(v){return typeof v!=='string'||v.length>300;}))throw Error('Invalid dropdown list: '+k);});var pref=new Set();Object.keys(s.prefixes).forEach(function(k){var p=s.prefixes[k];if(typeof p!=='string'||!(/^[A-Za-z][A-Za-z0-9_]{0,15}$/).test(p)||pref.has(p.toUpperCase()))throw Error('ID prefixes must be unique, 1–16 letters/numbers/underscores, beginning with a letter.');pref.add(p.toUpperCase());});Object.entries(s.statusRules).forEach(function(x){Object.keys(x[1]).forEach(function(k){if(!Array.isArray(x[1][k])||x[1][k].some(function(v){return typeof v!=='string';}))throw Error('Invalid workflow mapping: '+x[0]);});});var t=s.thresholds;if(!Number.isInteger(t.upcomingDays)||t.upcomingDays<1||t.upcomingDays>3650)throw Error('Upcoming window must be 1–3650 days.');['evmWarning','evmCritical','costVariancePercent'].forEach(function(k){if(t[k]!==null&&(!pmdHasNumber(t[k])||t[k]<0))throw Error('Metric thresholds must be nonnegative or empty.');});if(t.evmCritical!==null&&t.evmWarning!==null&&t.evmCritical>t.evmWarning)throw Error('EVM critical threshold must be ≤ warning threshold.');pmdValidateRiskModel(s.riskModel);}
function pmdValidateHierarchy(records,label,maxDepth){var byId=new Map(records.map(function(r){return [r.id,r];}));records.forEach(function(r){var seen=new Set(),n=r,depth=0;while(n){if(seen.has(n.id))throw Error(label+': parent cycle involving '+r.id);if(++depth>maxDepth)throw Error(label+': exceeds '+maxDepth+' levels.');seen.add(n.id);n=n.parentId?byId.get(n.parentId):null;}});}
var PMD_NUMBER_FIELDS=['unitCost','qtyRequired','qtyOnHand','qty','quantity','bac','pv','ev','ac','budget','actual','committed','etc','costImpact','scheduleImpact','pctComplete','estimatedCost','actualCost'];
var PMD_TEXT_FIELDS=['title','name','partName','partNumber','itemName','serialNumber','description','status','priority','category','owner','assignee','source','taskType','notesText','location','condition','vendor','leadTime','model','equipType','classification','nodeName','os','due','dueDate','date','targetDate','dateNeeded','eta','startDate','endDate','testDate','created','updated','createdDate','updatedDate','reqId','type','verMethod','verStatus','result','severity','reportDate','reportedBy','system','wbsCode'];
function pmdNormalizeRecord(record,arr){var r=pmdClone(record);if(!r||typeof r!=='object'||Array.isArray(r)||!Number.isSafeInteger(r.id)||r.id<1)throw Error(arr+': every record needs a positive integer ID.');PMD_TEXT_FIELDS.forEach(function(k){if(r[k]!==undefined&&r[k]!==null&&typeof r[k]!=='string')throw Error(arr+' #'+r.id+': '+k+' must be text.');});PMD_NUMBER_FIELDS.forEach(function(k){if(r[k]!==undefined&&r[k]!==null&&!pmdHasNumber(r[k]))throw Error(arr+' #'+r.id+': '+k+' must be a number or null.');});['history','notesArray','memory','rackIds','links'].forEach(function(k){if(r[k]!==undefined&&!Array.isArray(r[k]))throw Error(arr+' #'+r.id+': '+k+' must be an array.');});['history','notesArray','memory'].forEach(function(k){if(r[k]&&r[k].some(function(v){return !v||typeof v!=='object'||Array.isArray(v);}))throw Error(arr+' #'+r.id+': malformed '+k+' entry.');});if(['actions','decisions','milestones'].includes(arr)&&r.notes!==undefined&&(!Array.isArray(r.notes)||r.notes.some(function(n){return !n||typeof n!=='object';})))throw Error(arr+' #'+r.id+': notes must contain dated entries.');if(arr==='actionPlanCards'&&r.dependsOn!==undefined&&(!Array.isArray(r.dependsOn)||r.dependsOn.some(function(id){return !Number.isSafeInteger(id)||id<1;})))throw Error('Invalid action planning dependencies.');if(r.parentId!==undefined&&r.parentId!==null&&(!Number.isSafeInteger(r.parentId)||r.parentId<1))throw Error(arr+' #'+r.id+': parent ID must be a positive integer or null.');['status','priority','category','title','name','description'].forEach(function(k){if(r[k]===undefined||r[k]===null)r[k]='';});if(['risks','boms','inventory','hwItems','swItems','racks','subs'].includes(arr)&&!r.history)r.history=[];if(arr==='risks'){if(!r.rackIds)r.rackIds=[];if(r.rackIds.some(function(v){return v!=='all'&&(!Number.isSafeInteger(v)||v<1);}))throw Error('Invalid risk structure references.');pmdValidateRiskModel(r._riskModel||null);if(r._riskModel)r._riskModel.dimensions.forEach(function(d){if(r[d.key]!==undefined&&r[d.key]!==null&&(!Number.isInteger(r[d.key])||r[d.key]!==0&&(r[d.key]<d.min||r[d.key]>d.max)))throw Error('Risk #'+r.id+': score outside '+d.label+' scale.');});}if(arr==='hwItems'&&!r.memory)r.memory=[];if(arr==='linkSections'){r.links=r.links||[];var seen=new Set();r.links.forEach(function(l){if(!l||!Number.isSafeInteger(l.id)||seen.has(l.id))throw Error('Invalid or duplicate link ID.');seen.add(l.id);['title','url','description'].forEach(function(k){if(l[k]!==undefined&&typeof l[k]!=='string')throw Error('Invalid link '+k);});});}return r;}
function pmdBuildImport(data){pmdValidateJSON(data);if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Backup root must be an object.');var modern=data.schema===PMD_SCHEMA;if(data.schema&&!modern)throw Error('Unrecognized backup schema.');if(modern&&data.schemaVersion!==PMD_SCHEMA_VERSION)throw Error('Unsupported schema version '+data.schemaVersion+'. This version accepts schema 1.');if(!modern&&!data.settings&&!Array.isArray(data.risks))throw Error('Unrecognized PMD backup.');if(!modern&&data._meta?.version&&Number(String(data._meta.version).split('.')[0])>4)throw Error('Unsupported legacy export version.');var source=modern?data.state:data;if(!source||typeof source!=='object'||Array.isArray(source))throw Error('Backup state is missing.');if(modern){if(!source.settings||!Array.isArray(source.relationships)||!Array.isArray(source.activityLog)||!source.swot||!data.counters||!data.session)throw Error('Incomplete program backup.');Object.keys(PMD_COUNTERS).forEach(function(k){if(!Array.isArray(source[k]))throw Error('Missing collection: '+k);});}var state=pmdBlankState(),warnings=[];state.settings=pmdMerge(pmdDefaults(),source.settings||{});
 if(!modern){state.settings.setupComplete=true;state.settings.riskModel=pmdRiskPreset('legacy');state.settings.modules=pmdDefaults().modules;PMD_MODULES.forEach(function(m){state.settings.modules[m.key].enabled=true;});if(data.appConfig){state.settings.programName=data.appConfig.programName||state.settings.programName;state.settings.preparerName=data.appConfig.preparedBy||state.settings.preparerName;}warnings.push('Legacy backup migrated. Existing risk scores retain the V9.5 methodology. Omitted collections are blank.');}
 pmdValidateSettings(state.settings);Object.keys(PMD_COUNTERS).forEach(function(arr){if(source[arr]!==undefined&&!Array.isArray(source[arr]))throw Error(arr+' must be an array.');var seen=new Set();state[arr]=(source[arr]||[]).map(function(r){if(!modern&&arr==='risks')r=Object.assign({},r,{_riskModel:pmdRiskPreset('legacy')});var normalized=pmdNormalizeRecord(r,arr);if(modern)normalized=pmdClone(r);if(seen.has(normalized.id))throw Error(arr+': duplicate ID '+normalized.id);seen.add(normalized.id);return normalized;});});
 ['racks','boms'].forEach(function(k){pmdValidateHierarchy(state[k],k,k==='racks'?8:100);});
 state.relationships=pmdClone(source.relationships||[]);if(!Array.isArray(state.relationships))throw Error('Relationships must be an array.');var relSeen=new Set();state.relationships.forEach(function(e){if(!e||typeof e.id!=='string'||!e.id||relSeen.has(e.id)||typeof e.type!=='string')throw Error('Invalid or duplicate relationship ID.');relSeen.add(e.id);[e.from,e.to].forEach(function(ep){if(!ep||!PMD_COUNTERS[pmdArray(ep.module)]||!Number.isSafeInteger(ep.id)||ep.id<1)throw Error('Invalid relationship endpoint.');});if(pmdSame(e.from,e.to))throw Error('A relationship cannot point to itself.');});
 if(source.swot!==undefined){if(!source.swot||typeof source.swot!=='object'||Array.isArray(source.swot))throw Error('SWOT must be an object.');Object.keys(state.swot).forEach(function(k){var v=source.swot[k]||[];if(!Array.isArray(v)||v.some(function(x){return typeof x!=='string';}))throw Error('Invalid SWOT '+k);state.swot[k]=pmdClone(v);});}
 if(source.activityLog!==undefined&&!Array.isArray(source.activityLog))throw Error('Activity log must be an array.');state.activityLog=pmdClone(source.activityLog||[]);state.activityLog.forEach(function(e){if(!e||typeof e!=='object'||['timestamp','module','action','desc'].some(function(k){return e[k]!==undefined&&typeof e[k]!=='string';}))throw Error('Malformed activity entry.');});
 var globals={},incoming=modern?data.counters||{}:data;Object.keys(PMD_COUNTERS).forEach(function(arr){var key=PMD_COUNTERS[arr],value=incoming[key]??source[key]??(!modern?{_riskNextId:data.nextId,_rackNextId:data.nextRackId,_subNextId:data.nextSubId}[key]:undefined),min=state[arr].reduce(function(n,r){return Math.max(n,r.id+1);},1);if(value!==undefined&&(!Number.isSafeInteger(value)||value<1))throw Error('Invalid counter '+key);var result=Math.max(min,value||1);if(SNAPSHOT_GLOBAL_COUNTERS[key])globals[key]=result;else state[key]=result;});if(source._linkNextId!==undefined&&(!Number.isSafeInteger(source._linkNextId)||source._linkNextId<1))throw Error('Invalid link counter.');state._linkNextId=Math.max(source._linkNextId||1,...state.linkSections.flatMap(function(s){return s.links.map(function(l){return l.id+1;});}),1);
 if(!modern)state.subs.forEach(function(sub){if(state.racks.some(function(n){return n._legacySubId===sub.id;}))return;state.racks.push({id:state._rackNextId++,name:sub.name||'',parentId:sub.rackId||null,type:'Subassembly',identifier:sub.partNumber||'',description:sub.description||'',owner:sub.owner||'',_legacySubId:sub.id});});
 var audit=modern?data.auditTrail:data.auditTrail||[];if(!Array.isArray(audit))throw Error('Audit trail must be an array.');audit.forEach(function(e){if(!e||typeof e!=='object'||Array.isArray(e))throw Error('Invalid audit entry.');if(e.changes!==undefined&&(!Array.isArray(e.changes)||e.changes.some(function(c){return !c||typeof c!=='object';})))throw Error('Audit changes must be an array.');});
 var extras=modern?data.session||{}:{};if(!extras||typeof extras!=='object'||Array.isArray(extras))throw Error('Invalid session metadata.');['raci','savedFilters','subViews'].forEach(function(k){if(extras[k]!==undefined&&(!extras[k]||typeof extras[k]!=='object'||Array.isArray(extras[k])))throw Error('Invalid '+k);});
 Object.keys(source).forEach(function(k){if(!(k in state))state._extensions[k]=pmdClone(source[k]);});if(source._extensions)state._extensions=pmdMerge(state._extensions,source._extensions);
 var missing=pmdAllRelationships(state).filter(function(e){return !pmdFind(e.from,state)||!pmdFind(e.to,state);}).length;if(missing)warnings.push(missing+' relationship(s) reference missing records. They are preserved for review in Data integrity.');return {state:state,globals:globals,audit:pmdClone(audit),session:pmdClone(extras),warnings:warnings,legacy:!modern};
}
function pmdBackup(){var counters={};Object.keys(SNAPSHOT_GLOBAL_COUNTERS).forEach(function(k){counters[k]=SNAPSHOT_GLOBAL_COUNTERS[k].get();});return {schema:PMD_SCHEMA,schemaVersion:PMD_SCHEMA_VERSION,applicationVersion:PMD_VERSION,exportedAt:nowISO(),state:pmdClone(appState),counters:counters,auditTrail:pmdClone(_auditLog),session:{raci:pmdClone(_raciData),savedFilters:pmdClone(savedFilters),subViews:pmdClone(moduleSubViews)}};}
function pmdDownload(name,text,type){var blob=new Blob([text],{type:type||'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
function exportAllData(){var backup=pmdBackup();try{pmdBuildImport(backup);}catch(e){toast('Backup validation failed: '+e.message+'. Use Data integrity to review.','error');return;}pmdDownload('PMD_'+(appState.settings.programName||'Program').replace(/[^a-z0-9_-]/ig,'_').slice(0,50)+'_'+nowISO().replace(/[:.]/g,'-')+'.json',JSON.stringify(backup,null,2));markSaved();_lastExportAt=Date.now();_warnedAt={};toast('Program Backup download requested. Keep the downloaded JSON with your toolkit.','success');}
function processImportFile(file){if(!file||!file.name.toLowerCase().endsWith('.json')){toast('Select a JSON Program Backup.','error');return;}if(file.size>50*1024*1024){toast('Backup exceeds the 50 MB import limit.','error');return;}var reader=new FileReader();reader.onload=function(e){try{validateAndImport(JSON.parse(e.target.result));}catch(err){pmdImportError(err);}};reader.onerror=function(){pmdImportError(Error('The file could not be read.'));};reader.readAsText(file);}
function pmdImportError(err){pmdDialog('Import rejected','<div class="pmd-note pmd-error">'+esc(err.message)+'</div><p>Your current program has not been changed.</p>');}
function validateAndImport(data){var prepared;try{prepared=pmdBuildImport(data);}catch(e){pmdImportError(e);return false;}var count=Object.keys(PMD_COUNTERS).reduce(function(n,k){return n+prepared.state[k].length;},0);showConfirm('Import Program Backup','<p><strong>'+esc(prepared.state.settings.programName||'Unnamed program')+'</strong> · '+count+' records</p>'+prepared.warnings.map(function(w){return '<p class="pmd-note">'+esc(w)+'</p>';}).join('')+'<p>This replaces the current workspace. Export first to retain a separate copy. Undo can restore the prior workspace during this session.</p>','Import backup',function(){pmdCommitImport(prepared);});return true;}
function pmdCommitImport(prepared){var previous=_captureSnapshot('Before import');try{snapshotForUndo('Import Program Backup');appState=prepared.state;Object.keys(prepared.globals).forEach(function(k){SNAPSHOT_GLOBAL_COUNTERS[k].set(prepared.globals[k]);});_auditLog=prepared.audit;_raciData=prepared.session.raci||{};savedFilters=prepared.session.savedFilters||{};moduleSubViews=prepared.session.subViews||{};pmdApplyConfig();pmdClearFilters();currentModule='dashboard';updateHeader();closeModal('pmdDialog');buildNav();renderContent();markUnsaved();toast('Backup imported. '+prepared.warnings.join(' '),'success');}catch(e){restoreSnapshot(previous);pmdImportError(e);}}
function pmdClearFilters(){riskSearchQuery=actionSearchQuery=bomSearchQuery=invSearchQuery=hwSearchQuery=swSearchQuery=decSearchQuery=evmSearchQuery=chgSearchQuery=testSearchQuery=lesSearchQuery=reqSearchQuery=_costSearch=_trdSearch=_anomSearch=_procSearch='';riskStatusFilter=actionStatusFilter=actionPriorityFilter=actionTaskTypeFilter=bomStatusFilter=bomCategoryFilter=invStatusFilter=invLocationFilter=hwStatusFilter=swStatusFilter=decStatusFilter=msStatusFilter=chgStatusFilter=testStatusFilter=reqStatusFilter='all';riskRackFilter='all';_costCatFilter=_trdStatusFilter=_anomStatusFilter=_procStatusFilter=_procCatFilter='';paginationState={};clearBulkSelection();document.getElementById('globalSearchInput').value='';closeGlobalSearch();}
function _captureSnapshot(desc){return {desc:desc,state:pmdClone(appState),counters:{},globals:Object.fromEntries(Object.keys(SNAPSHOT_GLOBAL_COUNTERS).map(function(k){return [k,SNAPSHOT_GLOBAL_COUNTERS[k].get()];})),audit:pmdClone(_auditLog),raci:pmdClone(_raciData),savedFilters:pmdClone(savedFilters),subViews:pmdClone(moduleSubViews)};}
function restoreSnapshot(snapshot){appState=pmdClone(snapshot.state);Object.keys(snapshot.globals||{}).forEach(function(k){if(SNAPSHOT_GLOBAL_COUNTERS[k])SNAPSHOT_GLOBAL_COUNTERS[k].set(snapshot.globals[k]);});_auditLog=pmdClone(snapshot.audit||[]);_raciData=pmdClone(snapshot.raci||{});savedFilters=pmdClone(snapshot.savedFilters||{});moduleSubViews=pmdClone(snapshot.subViews||{});pmdApplyConfig();pmdClearFilters();updateHeader();closeDetailPanel();closeModal('pmdDialog');buildNav();renderContent();markUnsaved();}

/* Metrics require complete numeric inputs. Zero is valid; null is not zero. */
function pmdSum(rows,key){return rows.length&&rows.every(function(r){return pmdHasNumber(r[key]);})?rows.reduce(function(s,r){return s+r[key];},0):null;}
function pmdEvm(rows){var bac=pmdSum(rows,'bac'),pv=pmdSum(rows,'pv'),ev=pmdSum(rows,'ev'),ac=pmdSum(rows,'ac');var cpi=ac!==null&&ac>0&&ev!==null?ev/ac:null,spi=pv!==null&&pv>0&&ev!==null?ev/pv:null;return {bac:bac,pv:pv,ev:ev,ac:ac,cpi:cpi,spi:spi,eac:cpi!==null&&cpi>0&&bac!==null?bac/cpi:null,cv:ev!==null&&ac!==null?ev-ac:null,sv:ev!==null&&pv!==null?ev-pv:null};}
function pmdMetric(label,value,note){return '<div class="pmd-card"><div class="pmd-muted">'+esc(label)+'</div><div class="pmd-metric">'+esc(value===null||value===undefined?'—':value)+'</div><div class="pmd-muted">'+esc(note||'')+'</div></div>';}
function pmdRatio(v){return v===null?'—':v.toFixed(2);}
function pmdEvmHealth(v){var t=appState.settings.thresholds;if(v===null)return 'No data';if(t.evmWarning===null||t.evmCritical===null)return 'Thresholds not configured';return v<t.evmCritical?'Below critical threshold':v<t.evmWarning?'Below warning threshold':'Within configured thresholds';}
function renderEvmModule(area){var rows=appState.evmPackages,m=pmdEvm(rows);area.innerHTML=pmdHeading('evm')+'<p class="pmd-muted">All packages need a value for each input before its aggregate can be calculated. Blank means unknown; 0 is an entered value. Ratios require a positive denominator.</p><div class="pmd-stat-grid">'+pmdMetric('Budget at completion',fmtCurrency(m.bac),appState.settings.currency||'Currency not configured')+pmdMetric('Planned value',fmtCurrency(m.pv))+pmdMetric('Earned value',fmtCurrency(m.ev))+pmdMetric('Actual cost',fmtCurrency(m.ac))+pmdMetric('CPI',pmdRatio(m.cpi),pmdEvmHealth(m.cpi))+pmdMetric('SPI',pmdRatio(m.spi),pmdEvmHealth(m.spi))+pmdMetric('Estimate at completion',fmtCurrency(m.eac),'BAC ÷ CPI when CPI > 0')+'</div><div class="pmd-table-wrap"><table class="pmd-table"><thead><tr>'+['ID','Work package','BAC','PV','EV','AC','CPI','SPI','Manage'].map(function(t){return '<th>'+t+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){var v=pmdEvm([r]);return '<tr><td>'+esc(pmdId('evmPackages',r.id))+'</td><td><button class="btn btn-sm" onclick="openEvmDetail('+r.id+')">'+esc(r.name)+'</button></td>'+['bac','pv','ev','ac'].map(function(k){return '<td>'+fmtCurrency(r[k])+'</td>';}).join('')+'<td>'+pmdRatio(v.cpi)+'</td><td>'+pmdRatio(v.spi)+'</td><td><button class="btn btn-sm" onclick="openEvmModal('+r.id+')">Edit</button> <button class="btn btn-sm" onclick="pmdDelete(\'evmPackages\','+r.id+')">Delete</button></td></tr>';}).join('')+'</tbody></table></div>';}
function openEvmModal(id){var r=appState.evmPackages.find(function(x){return x.id===id;})||{};pmdDialog(r.id?'Edit work package':'New work package','<div class="pmd-form-grid">'+pmdInput('evmName','Name *',r.name)+pmdInput('evmWbs','WBS / work code',r.wbsCode)+pmdInput('evmBac','Budget at completion',r.bac,'number')+pmdInput('evmPv','Planned value',r.pv,'number')+pmdInput('evmEv','Earned value',r.ev,'number')+pmdInput('evmAc','Actual cost',r.ac,'number')+pmdInput('evmOwner','Owner',r.owner)+pmdSelect('evmStatus','Status',[''].concat(pmdList('evmStatuses')),r.status||'')+pmdInput('evmStart','Start date',r.startDate,'date')+pmdInput('evmEnd','End date',r.endDate,'date')+'</div>'+pmdText('evmDesc','Description',r.description)+'<p class="pmd-muted">Leave unknown inputs empty. Add intentional links through the saved record’s detail panel.</p>','<button class="btn btn-primary" onclick="saveEvmPackage('+(id||'null')+')">Save package</button>');}
function saveEvmPackage(id){var data={name:pmdValue('evmName'),wbsCode:pmdValue('evmWbs'),bac:pmdNumber('evmBac'),pv:pmdNumber('evmPv'),ev:pmdNumber('evmEv'),ac:pmdNumber('evmAc'),owner:pmdValue('evmOwner'),status:pmdValue('evmStatus'),startDate:pmdValue('evmStart'),endDate:pmdValue('evmEnd'),description:pmdValue('evmDesc'),updatedDate:todayStr()};if(!data.name){toast('Name is required.','error');return;}if(['bac','pv','ev','ac'].some(function(k){return data[k]!==null&&(!Number.isFinite(data[k])||data[k]<0);})){toast('EVM inputs must be nonnegative numbers or blank.','error');return;}snapshotForUndo('Save work package');var r=appState.evmPackages.find(function(x){return x.id===id;});if(r)Object.assign(r,data);else{data.id=appState._evmNextId++;data.createdDate=todayStr();appState.evmPackages.push(data);}auditRecord('evm',id||data.id,r?'updated':'created',[],data.name);logActivity('evm',r?'Updated':'Created',id||data.id,data.name);closeModal('pmdDialog');renderContent();}
function openEvmDetail(id){var r=appState.evmPackages.find(function(x){return x.id===id;});if(!r)return;var m=pmdEvm([r]);openDetailPanel(pmdId('evmPackages',id),'<h3>'+esc(r.name)+'</h3>'+pmdDetailFields(r,['wbsCode','description','owner','status','startDate','endDate'])+'<div class="pmd-note">CPI '+pmdRatio(m.cpi)+' · SPI '+pmdRatio(m.spi)+' · EAC '+fmtCurrency(m.eac)+'</div>'+pmdRelatedHTML('evmPackages',id),'openEvmModal('+id+')');}
function pmdGuardNumbers(area,k){var rows=pmdRecords(k);if(!rows.length)return;var summary='';if(k==='costTracker'){var budget=pmdSum(rows,'budget'),actual=pmdSum(rows,'actual'),committed=pmdSum(rows,'committed'),etc=pmdSum(rows,'etc');summary=pmdMetric('Budget',fmtCurrency(budget))+pmdMetric('Actual',fmtCurrency(actual))+pmdMetric('Committed',fmtCurrency(committed))+pmdMetric('Estimate to complete',fmtCurrency(etc))+pmdMetric('Variance',budget!==null&&actual!==null&&committed!==null&&etc!==null?fmtCurrency(budget-actual-committed-etc):null,'Requires budget, actual, committed and ETC for every item');}else if(k==='boms'){var valid=rows.every(function(r){return pmdHasNumber(r.unitCost)&&pmdHasNumber(r.qtyRequired);});summary=pmdMetric('Required extended cost',valid?fmtCurrency(rows.reduce(function(n,r){return n+r.unitCost*r.qtyRequired;},0)):null,valid?'Entered quantity × unit cost':'Cost inputs incomplete');}else if(k==='procurement'){var valid=rows.every(function(r){return pmdHasNumber(r.unitCost)&&pmdHasNumber(r.qty);});summary=pmdMetric('Purchase value',valid?fmtCurrency(rows.reduce(function(n,r){return n+r.unitCost*r.qty;},0)):null,valid?'Entered quantity × unit cost':'Cost inputs incomplete');}
 if(summary){area.querySelectorAll('.stat-cards-row,.kpi-row').forEach(function(e){e.remove();});area.insertAdjacentHTML('afterbegin','<div class="pmd-stat-grid">'+summary+'</div>');}}
function renderCostTrackerModule(a){var all=appState.costItems,rows=all.filter(function(r){return (!_costCatFilter||r.category===_costCatFilter)&&(!_costSearch||JSON.stringify(r).toLowerCase().includes(_costSearch.toLowerCase()));}).sort(function(x,y){var v=x[_costSortField],w=y[_costSortField];return (_costSortDir==='asc'?1:-1)*(typeof v==='number'&&typeof w==='number'?v-w:String(v??'').localeCompare(String(w??'')));});var html=pmdHeading('costTracker')+'<p class="pmd-muted">Currency: '+esc(appState.settings.currency||'Not configured')+'. Blank amounts remain unknown. Remaining budget = budget − actual − committed. Forecast variance also subtracts estimate to complete.</p><div class="pmd-stat-grid">'+['budget','actual','committed','etc'].map(function(k){return pmdMetric({budget:'Budget',actual:'Actual',committed:'Committed',etc:'Estimate to complete'}[k],fmtCurrency(pmdSum(all,k)));}).join('')+pmdMetric('Forecast variance',fmtCurrency(pmdCostVariance(all,true)))+'</div><div class="pmd-actions"><input aria-label="Search costs" placeholder="Search costs" value="'+esc(_costSearch)+'" oninput="_costSearch=this.value;debounce(\'costSearch\',renderContent,200)"><select aria-label="Cost category filter" onchange="_costCatFilter=this.value;renderContent()">'+[''].concat(pmdList('costCategories')).map(function(c){return '<option value="'+esc(c)+'" '+(_costCatFilter===c?'selected':'')+'>'+esc(c||'All categories')+'</option>';}).join('')+'</select></div><div class="pmd-table-wrap"><table class="pmd-table"><thead><tr>'+['wbsCode','title','category','budget','actual','committed','etc','owner'].map(function(k){return '<th><button class="btn btn-sm" onclick="costSort(\''+k+'\')">'+esc(k==='wbsCode'?'Work code':k)+'</button></th>';}).join('')+'<th>Remaining</th><th>Manage</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td>'+esc(r.wbsCode||'—')+'</td><td><button class="btn btn-sm" onclick="openCostDetail('+r.id+')">'+esc(r.title)+'</button></td><td>'+esc(r.category||'—')+'</td>'+['budget','actual','committed','etc'].map(function(k){return '<td>'+fmtCurrency(r[k])+'</td>';}).join('')+'<td>'+esc(r.owner||'—')+'</td><td>'+fmtCurrency(pmdCostVariance([r],false))+'</td><td><button class="btn btn-sm" onclick="openCostModal('+r.id+')">Edit</button> <button class="btn btn-sm" onclick="deleteCost('+r.id+')">Delete</button></td></tr>';}).join('')+'</tbody></table></div>';
 var groups={};all.forEach(function(r){var key=r.wbsCode?r.wbsCode.split('.')[0]:'Unassigned';(groups[key]||(groups[key]=[])).push(r);});html+='<div class="pmd-grid">'+Object.keys(groups).sort().map(function(k){return '<div class="pmd-card"><h2>Work group · '+esc(k)+'</h2><p>'+groups[k].length+' items</p><p class="pmd-muted">Budget '+fmtCurrency(pmdSum(groups[k],'budget'))+' · Actual '+fmtCurrency(pmdSum(groups[k],'actual'))+'<br>Forecast variance '+fmtCurrency(pmdCostVariance(groups[k],true))+'</p></div>';}).join('')+'</div>';a.innerHTML=html;}
function pmdCostVariance(rows,forecast){var keys=['budget','actual','committed'].concat(forecast?['etc']:[]),vals=keys.map(function(k){return pmdSum(rows,k);});return vals.some(function(v){return v===null;})?null:vals.slice(1).reduce(function(n,v){return n-v;},vals[0]);}
function renderBomModule(a){v95_renderBomModule(a);pmdGuardNumbers(a,'boms');}
function renderProcurementModule(a){var rows=appState.purchases.filter(function(r){return (!_procSearch||JSON.stringify(r).toLowerCase().includes(_procSearch.toLowerCase()))&&(!_procStatusFilter||r.status===_procStatusFilter)&&(!_procCatFilter||r.category===_procCatFilter);}).sort(function(x,y){var v=x[_procSortField],w=y[_procSortField];return (_procSortDir==='asc'?1:-1)*(typeof v==='number'&&typeof w==='number'?v-w:String(v??'').localeCompare(String(w??'')));});var all=appState.purchases,values=all.map(function(r){return pmdMultiply(r.qty,r.unitCost);}),total=values.length&&values.every(function(v){return v!==null;})?values.reduce(function(n,v){return n+v;},0):null;var html=pmdHeading('procurement')+'<div class="pmd-stat-grid">'+pmdMetric('Purchase records',all.length)+pmdMetric('Active',all.filter(function(r){return !pmdClosed('procurement',r);}).length,'Using configured inactive statuses')+pmdMetric('Purchase value',fmtCurrency(total),appState.settings.currency||'Currency not configured')+'</div><div class="pmd-actions"><input aria-label="Search procurement" placeholder="Search procurement" value="'+esc(_procSearch)+'" oninput="_procSearch=this.value;debounce(\'procSearch\',renderContent,200)"><select aria-label="Procurement status" onchange="_procStatusFilter=this.value;renderContent()">'+[''].concat(pmdList('procurementStatuses')).map(function(s){return '<option value="'+esc(s)+'" '+(_procStatusFilter===s?'selected':'')+'>'+esc(s||'All statuses')+'</option>';}).join('')+'</select><select aria-label="Procurement category" onchange="_procCatFilter=this.value;renderContent()">'+[''].concat(pmdList('procurementCategories')).map(function(s){return '<option value="'+esc(s)+'" '+(_procCatFilter===s?'selected':'')+'>'+esc(s||'All categories')+'</option>';}).join('')+'</select></div><div class="pmd-table-wrap"><table class="pmd-table"><thead><tr>'+[['id','ID'],['itemName','Item'],['vendor','Vendor'],['status','Status'],['qty','Quantity'],['unitCost','Unit cost'],['dateNeeded','Needed'],['eta','Expected']].map(function(c){return '<th><button class="btn btn-sm" onclick="procSort(\''+c[0]+'\')">'+c[1]+'</button></th>';}).join('')+'<th>Total</th><th>Manage</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td>'+esc(pmdId('purchases',r.id))+'</td><td><button class="btn btn-sm" onclick="openPurchaseDetail('+r.id+')">'+esc(r.itemName)+'</button></td><td>'+esc(r.vendor||'—')+'</td><td>'+esc(r.status||'Not configured')+'</td><td>'+pmdDisplayNumber(r.qty)+'</td><td>'+fmtCurrency(r.unitCost)+'</td><td>'+fmtDate(r.dateNeeded)+'</td><td>'+fmtDate(r.eta)+'</td><td>'+fmtCurrency(pmdMultiply(r.qty,r.unitCost))+'</td><td><button class="btn btn-sm" onclick="openPurchaseModal('+r.id+')">Edit</button> <button class="btn btn-sm" onclick="advancePurchaseStatus('+r.id+')">Advance</button> <button class="btn btn-sm" onclick="deletePurchase('+r.id+')">Delete</button></td></tr>';}).join('')+'</tbody></table></div>';var vendors={};all.forEach(function(r){(vendors[r.vendor||'Unassigned']||(vendors[r.vendor||'Unassigned']=[])).push(r);});html+='<div class="pmd-grid">'+Object.keys(vendors).map(function(v){var group=vendors[v],vals=group.map(function(r){return pmdMultiply(r.qty,r.unitCost);});return '<div class="pmd-card"><h2>'+esc(v)+'</h2><p>'+group.length+' purchases · '+fmtCurrency(vals.every(function(x){return x!==null;})?vals.reduce(function(n,x){return n+x;},0):null)+'</p></div>';}).join('')+'</div>';a.innerHTML=html;}
function procNextStatus(cur){var list=pmdList('procurementStatuses'),i=list.indexOf(cur);return i>=0?list[i+1]||null:list[0]||null;}
function advancePurchaseStatus(id){var r=appState.purchases.find(function(x){return x.id===id;});if(!r)return;if(pmdClosed('procurement',r)){toast('This status is configured as complete/inactive. Edit the item to reopen it.','info');return;}var next=procNextStatus(r.status);if(!next){toast('No next procurement status configured.','info');return;}snapshotForUndo('Advance procurement status');var before=r.status;r.status=next;r.updatedDate=todayStr();auditRecord('procurement',id,'status_change',[{field:'Status',oldVal:before,newVal:next}],r.itemName);logActivity('procurement','Updated',id,r.itemName+' → '+next);renderContent();}
function offerProcurementClosure(p){if(!p)return;if(p._receiptApplied){toast('This purchase receipt has already been applied. Undo the receipt transaction to reverse it.','info');return;}var links=pmdRelated('purchases',p.id),targets=[];links.forEach(function(e){var ep=pmdSame(e.from,{module:'purchases',id:p.id})?e.to:e.from;if(['boms','costItems'].includes(ep.module)&&pmdEnabled(ep.module)&&!targets.some(function(x){return pmdSame(x,ep);}))targets.push(ep);});var changes=[];targets.forEach(function(ep){var r=pmdFind(ep);if(!r)return;if(ep.module==='boms'&&pmdHasNumber(p.qty)&&p.qty>=0&&pmdHasNumber(r.qtyOnHand))changes.push({ep:ep,field:'qtyOnHand',before:r.qtyOnHand,after:r.qtyOnHand+p.qty});if(ep.module==='costItems'&&pmdMultiply(p.qty,p.unitCost)!==null&&pmdHasNumber(r.actual))changes.push({ep:ep,field:'actual',before:r.actual,after:r.actual+p.qty*p.unitCost});});if(!changes.length){pmdDialog('Receipt update unavailable','<p>Link this purchase to a BOM and/or cost record first. Enter a purchase quantity, unit cost for cost updates, and the current on-hand/actual amount in the target. Disabled modules are excluded. Missing amounts are not treated as zero.</p>');return;}showConfirm('Apply purchase receipt','<p>Confirm this delivery was received. Each linked target below receives the full purchase quantity/value; split allocations should be entered manually.</p>'+changes.map(function(c){return '<p>'+esc(pmdId(c.ep.module,c.ep.id))+' · '+esc(c.field)+': '+c.before+' → '+c.after+'</p>';}).join('')+'<p>This one-time transaction is recorded and can be undone.</p>','Apply receipt',function(){snapshotForUndo('Apply purchase receipt');changes.forEach(function(c){pmdFind(c.ep)[c.field]=c.after;auditRecord(pmdModule(c.ep.module).key,c.ep.id,'updated',[{field:c.field,oldVal:c.before,newVal:c.after}],'Purchase receipt '+pmdId('purchases',p.id));});p._receiptApplied={at:nowISO(),changes:changes};logActivity('procurement','Receipt applied',p.id,p.itemName);renderContent();});}
function parseLinkedId(value){if(typeof value!=='string')return null;var m=value.trim().match(/^([A-Za-z][A-Za-z0-9_]*)-(\d+)$/);if(!m)return null;for(var arr of Object.keys(PMD_PREFIXES)){var id=pmdRefId(value,arr);if(id!==null)return {module:pmdModule(arr)?.key||arr,id:id};}return null;}
function renderTestsModule(a){v95_renderTestsModule(a);pmdReplaceCoverage(a,'tests');}
function renderRequirementsModule(a){v95_renderRequirementsModule(a);pmdReplaceCoverage(a,'requirements');}
function pmdStatusSummary(area,key){var rows=pmdRecords(key),rules=appState.settings.statusRules[key]||{closed:[],blocked:[]};area.querySelectorAll('.stat-cards-row,.kpi-row').forEach(function(e){e.remove();});if(!rows.length)return;var configured=rows.filter(function(r){return !!r.status;}),closed=configured.filter(function(r){return pmdClosed(key,r);}),blocked=configured.filter(function(r){return rules.blocked.includes(r.status);});area.insertAdjacentHTML('afterbegin','<div class="pmd-stat-grid">'+pmdMetric('Records',rows.length)+pmdMetric('Status not configured',rows.length-configured.length)+pmdMetric('Complete / inactive',configured.length?closed.length:null,'Using configured status meanings')+pmdMetric('Blocked / attention',configured.length?blocked.length:null,'Using configured status meanings')+'</div>');}
function renderActionModule(a){v95_renderActionModule(a);pmdStatusSummary(a,'actions');}function renderMilestoneModule(a){v95_renderMilestoneModule(a);pmdStatusSummary(a,'milestones');}function renderDecisionModule(a){v95_renderDecisionModule(a);pmdStatusSummary(a,'decisions');}function renderChangesModule(a){v95_renderChangesModule(a);pmdStatusSummary(a,'changes');}function renderAnomaliesModule(a){v95_renderAnomaliesModule(a);pmdStatusSummary(a,'anomalies');}
function pmdReplaceCoverage(a,key){a.querySelector('.stat-cards-row')?.remove();Array.from(a.children).filter(function(x){return x.textContent.startsWith('Test Coverage:')||x.textContent.startsWith('Verification Coverage:');}).forEach(function(x){x.remove();});var rows=pmdRecords(key),isTest=key==='tests',field=isTest?'result':'verStatus',configured=rows.filter(function(r){return !!r[field];}),rules=appState.settings.statusRules[key],measured=rows.filter(function(r){return rules.success.concat(rules.failure).includes(r[field]);}),success=measured.filter(function(r){return rules.success.includes(r[field]);});a.insertAdjacentHTML('afterbegin','<div class="pmd-stat-grid">'+pmdMetric('Defined records',rows.length)+pmdMetric('Outcome recorded',configured.length)+pmdMetric(isTest?'Pass rate':'Verified share',measured.length?Math.round(success.length/measured.length*100)+'%':null,isTest?'Successful / recorded mapped outcomes; pending excluded':'Successful / recorded mapped verification outcomes')+pmdMetric('Intentional links',rows.reduce(function(n,r){return n+(pmdRelated(key,r.id).length?1:0);},0),'Records with at least one explicit link')+'</div>');}
function bomIsShortfall(b){return pmdHasNumber(b.qtyOnHand)&&pmdHasNumber(b.qtyRequired)&&b.qtyOnHand<b.qtyRequired;}
function openProgramHealthScore(){pmdMetricsReport();}function openTPMDashboard(){pmdMetricsReport();}
function pmdMetricsReport(){var html='<p class="pmd-muted">Metrics only use enabled modules with their required inputs. PMD does not infer a program health grade from missing data.</p><div class="pmd-stat-grid">';if(pmdEnabled('evm')){var m=pmdEvm(appState.evmPackages);html+=pmdMetric('CPI',pmdRatio(m.cpi),pmdEvmHealth(m.cpi))+pmdMetric('SPI',pmdRatio(m.spi),pmdEvmHealth(m.spi));}if(pmdEnabled('costTracker'))html+=pmdMetric('Actual cost',fmtCurrency(pmdSum(appState.costItems,'actual')));if(pmdEnabled('tests')){var rules=appState.settings.statusRules.tests,performed=appState.tests.filter(function(t){return rules.success.concat(rules.failure).includes(t.result);}),passed=performed.filter(function(t){return rules.success.includes(t.result);});html+=pmdMetric('Test pass rate',performed.length?Math.round(passed.length/performed.length*100)+'%':null,'Successful / all mapped executed outcomes');}if(pmdEnabled('risks'))html+=pmdMetric('Assessed risks',appState.risks.length?appState.risks.filter(function(r){return getCrit(r).hasAny;}).length:null,'No combined score across different frameworks');pmdDialog('Program metrics',html+'</div>');}
function pmdProgramReport(){var s=appState.settings;var body='<h1>'+esc(s.reportHeading||'Program Report')+'</h1><p>'+esc(s.programName||'Unnamed program')+' · '+todayStr()+'</p><p>'+esc(s.subtitle)+'</p><h3>Attention</h3>'+pmdHomeRows(pmdAttention(),'No matching attention items.')+'<h3>Upcoming work</h3>'+pmdHomeRows(pmdUpcoming(),'No dated work in the configured window.')+'<h3>Enabled modules</h3><table class="pmd-table"><tr><th>Module</th><th>Contents</th></tr>'+PMD_MODULES.filter(function(m){return m.array&&pmdEnabled(m.key);}).map(function(m){return '<tr><td>'+esc(pmdName(m.key))+'</td><td>'+(pmdRecords(m.key).length||'No data')+'</td></tr>';}).join('')+'</table><h3>Configuration</h3><p>Currency: '+esc(s.currency||'Not configured')+' · Risk framework for new assessments: '+esc(s.riskModel?.name||'Not configured')+'</p><p class="pmd-muted">No automatic aggregate program health rating. Data is manually maintained.</p>';pmdDialog('Program report',body,'<button class="btn" onclick="window.print()">Print / PDF</button><button class="btn" onclick="exportMarkdownReport()">Download Markdown</button>');}
function exportMarkdownReport(){var s=appState.settings;var text='# '+(s.reportHeading||'Program Report')+'\n\n'+(s.programName||'Unnamed program')+' · '+todayStr()+'\n\n## Attention\n\n'+(pmdAttention().map(function(x){return '- '+pmdName(x.module)+': '+x.title+' — '+x.reason;}).join('\n')||'No matching items.')+'\n\n## Upcoming\n\n'+(pmdUpcoming().map(function(x){return '- '+x.title+' — '+x.reason;}).join('\n')||'No dated work.')+'\n\n## Contents\n\n'+PMD_MODULES.filter(function(m){return m.array&&pmdEnabled(m.key);}).map(function(m){return '- '+pmdName(m.key)+': '+(pmdRecords(m.key).length||'No data');}).join('\n')+'\n\nCurrency: '+(s.currency||'Not configured')+'\nRisk default: '+(s.riskModel?.name||'Not configured')+'\n';pmdDownload('PMD_Program_Report.md',text,'text/markdown');}
function exportModuleCsv(key){var m=pmdModule(key),rows=m?pmdRecords(key):[],arr=m?.array;if(!rows.length){toast('No records to export.','info');return;}var fields=[...new Set(rows.flatMap(function(r){return Object.keys(r).filter(function(k){return k[0]!=='_';});}))];var cell=function(v){if(v&&typeof v==='object')v=JSON.stringify(v);v=String(v??'');if(/^[=+@\-]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';};pmdDownload('PMD_'+arr+'.csv','\ufeff'+[fields.map(cell).join(',')].concat(rows.map(function(r){return fields.map(function(k){return cell(r[k]);}).join(',');})).join('\r\n'),'text/csv');}
function exportAllCsv(){pmdDialog('CSV export','<p class="pmd-muted">Choose a module. CSV is a flat review copy; use Program Backup for complete reconstruction.</p><div class="pmd-actions">'+PMD_MODULES.filter(function(m){return m.array&&pmdEnabled(m.key);}).map(function(m){return '<button class="btn" onclick="exportModuleCsv(\''+m.key+'\')">'+esc(pmdName(m.key))+'</button>';}).join('')+'</div>');}
function openExportMenu(){pmdDialog('Export program','<p>Program Backup preserves the complete configured workspace.</p><div class="pmd-actions"><button class="btn btn-primary" onclick="exportAllData()">Program Backup · JSON</button><button class="btn" onclick="exportAllCsv()">Module CSV</button><button class="btn" onclick="exportMarkdownReport()">Program report · Markdown</button><button class="btn" onclick="pmdProgramReport()">Print report</button></div>');}
function openWhatsNew(){openSettings('help');}
function openQuickEntry(key){if(key==='risks'){openAddRiskModal();return;}v95_openQuickEntry(key);}
function pmdValidateFormNumbers(root){var bad=Array.from(root.querySelectorAll('input[type=number]')).find(function(e){return e.value!==''&&!Number.isFinite(Number(e.value));});if(bad){toast('Enter a valid number or leave the field blank.','error');bad.focus();return false;}return true;}
function buildAuditHistoryHTML(module,id){return renderAuditHistoryHTML(module,id);}
function openCascadeAnalysis(){var roots=appState.risks.filter(function(r){return pmdEnabled('risks')&&!pmdClosed('risks',r)&&['High','Critical'].includes(getCrit(r).severity);});pmdDialog('Risk dependency paths','<p class="pmd-muted">High and critical risks under their recorded assessment frameworks. Only intentional links are traversed, up to three steps. A connection does not prove causal impact.</p>'+(roots.map(function(r){var seen=new Set(['risks:'+r.id]),front=[{module:'risks',id:r.id}],rows=[];for(var depth=0;depth<3;depth++){var next=[];front.forEach(function(ep){pmdRelated(ep.module,ep.id).forEach(function(e){var other=pmdSame(e.from,ep)?e.to:e.from,k=other.module+':'+other.id;if(seen.has(k)||!pmdEnabled(other.module))return;seen.add(k);next.push(other);var item=pmdFind(other);rows.push('<div class="pmd-row" style="margin-left:'+(depth*14)+'px"><span>'+esc(e.type)+' → '+esc(pmdId(other.module,other.id))+' · '+esc(item?pmdTitle(item):'Missing record')+'</span></div>');});});front=next;}return '<section class="pmd-card"><h3>'+esc(pmdId('risks',r.id))+' · '+esc(r.title)+'</h3>'+ (rows.join('')||'<p class="pmd-muted">No connected items in enabled modules.</p>')+'</section>';}).join('')||'<p>No assessed high or critical risks.</p>'));}
function openTraceabilityMatrix(){pmdOpenRelationshipIndex();}function openReqTraceMatrix(){pmdOpenRelationshipIndex();}
function showConfirm(title,msg,btnText,callback){document.getElementById('confirmTitle').textContent=title;document.getElementById('confirmMsg').innerHTML=msg;var b=document.getElementById('confirmBtn');b.textContent=btnText||'Confirm';b.style.display='';pendingConfirmCallback=function(){var before=_captureSnapshot(title),depth=undoStack.length,edges=pmdAllRelationships();callback();if(/delet|remov/i.test(title)){var removed=[];Object.keys(PMD_COUNTERS).forEach(function(arr){(before.state[arr]||[]).forEach(function(r){if(!pmdFind({module:arr,id:r.id}))removed.push({module:arr,id:r.id});});});if(removed.length){if(undoStack.length===depth){undoStack.push(before);redoStack=[];}edges.filter(function(e){return removed.some(function(ep){return pmdSame(ep,e.from)||pmdSame(ep,e.to);});}).forEach(pmdRemoveEdge);markUnsaved();renderContent();}}};var overlay=document.getElementById('confirmOverlay');overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';b.focus();}

var pmdFormRecord=null;
var PMD_NUMERIC_FORM_FIELDS={costBudget:'budget',costActual:'actual',costCommitted:'committed',costETC:'etc',bQtyReq:'qtyRequired',bQtyHand:'qtyOnHand',bUnitCost:'unitCost',bStorageQty:'storageQty',bNhaQty:'nhaQty',purQty:'qty',purUnitCost:'unitCost',chgCost:'costImpact',chgSched:'scheduleImpact'};
var PMD_FORM_LISTS={aStatus:['actionStatuses','status'],aPriority:['actionPriorities','priority'],aCategory:['actionCategories','category'],aTaskType:['actionTaskTypes','taskType'],bCategory:['bomCategories','category'],bStatus:['bomStatuses','status'],bInstallStatus:['installStatuses','installStatus'],iStatus:['invStatuses','status'],iLocation:['invLocations','location'],iCondition:['invConditions','condition'],hwEquipType:['equipmentTypes','equipType'],hwOS:['operatingSystems','os'],hwClassification:['classificationLevels','classification'],hwSanitization:['sanitizationMethods','sanitization'],hwStatus:['hwReviewStatuses','status'],swClassification:['classificationLevels','classification'],swLicenseType:['softwareTypes','licenseType'],swStatus:['swReviewStatuses','status'],decCategory:['decisionCategories','category'],decStatus:['decisionStatuses','status'],decImpact:['decisionImpacts','impact'],msCategory:['milestoneCategories','category'],msStatus:['milestoneStatuses','status'],chgClass:['changeClasses','classification'],chgPriority:['changePriorities','priority'],chgStatus:['changeStatuses','status'],testCat:['testCategories','category'],testMethod:['verificationMethods','verMethod'],testResult:['testResults','result'],lesCat:['lessonCategories','category'],lesPhase:['lifecyclePhases','phase'],lesImpact:['lessonImpacts','impact'],lesSentiment:['lessonSentiments','sentiment'],reqType:['requirementCategories','type'],reqPriority:['requirementPriorities','priority'],reqMethod:['verificationMethods','verMethod'],reqVerStatus:['requirementStatuses','verStatus'],costCategory:['costCategories','category'],trdCategory:['tradeCategories','category'],trdStatus:['tradeStatuses','status'],anomCategory:['anomalyCategories','category'],anomSeverity:['anomalySeverities','severity'],anomStatus:['anomalyStatuses','status'],purCategory:['procurementCategories','category'],purStatus:['procurementStatuses','status']};
function pmdPrepareForms(){var roots=Array.from(document.querySelectorAll('.modal-overlay.open,#confirmOverlay.open'));roots.forEach(function(root){pmdLabelControls(root);pmdAdaptTerminology(root);Object.keys(PMD_FORM_LISTS).forEach(function(id){var el=root.querySelector('#'+id);if(!el||el.dataset.pmdPrepared)return;var cfg=PMD_FORM_LISTS[id],values=[''].concat(pmdList(cfg[0])),selected=pmdFormRecord&&pmdFormRecord[cfg[1]]!==undefined?pmdFormRecord[cfg[1]]:'';if(selected&&!values.includes(selected))values.push(selected);el.innerHTML=values.map(function(v){return '<option value="'+esc(v)+'" '+(v===selected?'selected':'')+'>'+esc(v||'Not configured')+'</option>';}).join('');el.dataset.pmdPrepared='true';});root.querySelectorAll('input[type=number]').forEach(function(el){if(!el.dataset.pmdNumber){if(!pmdFormRecord)el.value='';else if(PMD_NUMERIC_FORM_FIELDS[el.id])el.value=pmdFormRecord[PMD_NUMERIC_FORM_FIELDS[el.id]]??'';el.dataset.pmdNumber='true';}});root.querySelectorAll('label').forEach(function(l){l.textContent=l.textContent.replace(/\(\$\)/g,appState.settings.currency?'('+appState.settings.currency+')':'(currency not configured)').replace('CCB Decision','Review decision');});root.querySelectorAll('input[type=date]').forEach(function(e){if(!e.dataset.pmdDate&&!pmdFormRecord)e.value='';e.dataset.pmdDate='true';});var owners=root.querySelectorAll('input[id*=Owner],input[id*=Assignee],input[id*=Tester],input[id*=Maker],input[id*=Contrib]');if(owners.length){var old=root.querySelector('#pmdTeamOptions');if(!old){var dl=document.createElement('datalist');dl.id='pmdTeamOptions';appState.settings.team.forEach(function(name){var o=document.createElement('option');o.value=name;dl.appendChild(o);});root.appendChild(dl);}owners.forEach(function(e){e.setAttribute('list','pmdTeamOptions');});}});}
function pmdInstallAdapters(){
 var oldToast=toast;toast=function(){oldToast.apply(this,arguments);var c=document.getElementById('toastContainer');if(c)while(c.children.length>3)c.firstElementChild.remove();};
 var formats={riskFmtId:'risks',actionFmtId:'actions',bomFmtId:'boms',invFmtId:'inventory',hwFmtId:'hwItems',swFmtId:'swItems',decFmtId:'decisions',msFmtId:'milestones',evmFmtId:'evmPackages',chgFmtId:'changes',testFmtId:'tests',lesFmtId:'lessons',reqFmtId:'requirements',trdFmtId:'tradeStudies',anomFmtId:'anomalies',costFmtId:'costItems',procFmtId:'purchases'};
 Object.keys(formats).forEach(function(fn){window[fn]=function(id){return pmdId(formats[fn],id);};});
 var editors={openAddActionModal:['actions',false],openEditActionModal:['actions',true],openAddBomModal:['boms',false],openEditBomModal:['boms',true],openAddInvModal:['inventory',false],openEditInvModal:['inventory',true],openAddHwModal:['hwItems',false],openEditHwModal:['hwItems',true],openAddSwModal:['swItems',false],openEditSwModal:['swItems',true],openAddDecisionModal:['decisions',false],openEditDecisionModal:['decisions',true],openAddMilestoneModal:['milestones',false],openEditMilestoneModal:['milestones',true],openChangeModal:['changes',true],openTestModal:['tests',true],openLessonModal:['lessons',true],openReqModal:['requirements',true],openCostModal:['costItems',true],openTradeModal:['tradeStudies',true],openAnomModal:['anomalies',true],openPurchaseModal:['purchases',true]};
 Object.entries(editors).forEach(function(entry){var name=entry[0],cfg=entry[1],fn=window[name];if(typeof fn!=='function')return;window[name]=function(id){pmdFormRecord=cfg[1]&&id?(appState[cfg[0]].find(function(x){return x.id===id;})||null):null;var result=fn(id===undefined?null:id);pmdPrepareForms();return result;};});
 // Some inherited editors lacked undo or audit. Wrap only mutations, with a
 // before/after transaction boundary, and do not create duplicate undo entries.
 ['saveSwItem','saveHwItem','saveAction','saveBom','saveInventory','saveDecision','saveMilestone','saveChange','saveTest','saveLesson','saveReq','saveCost','saveTrade','saveAnom','savePurchase'].forEach(function(name){var fn=window[name];window[name]=function(){var before=_captureSnapshot(name),depth=undoStack.length,auditDepth=_auditLog.length;var result=fn.apply(this,arguments);var changed=JSON.stringify(before.state)!==JSON.stringify(appState);if(changed){if(undoStack.length===depth){undoStack.push(before);if(undoStack.length>UNDO_MAX_DEPTH)undoStack.shift();redoStack=[];}if(_auditLog.length===auditDepth){Object.keys(PMD_COUNTERS).forEach(function(arr){var old=new Map((before.state[arr]||[]).map(function(r){return [r.id,r];}));(appState[arr]||[]).forEach(function(r){var prior=old.get(r.id);if(JSON.stringify(prior)!==JSON.stringify(r)){var fields=Object.keys(r).filter(function(k){return !['history','notes'].includes(k);}).map(function(k){return {key:k,label:k};});auditRecord(pmdModule(arr)?.key||arr,r.id,prior?'updated':'created',prior?auditDiff(prior,r,fields):[],pmdTitle(r));}});});}markUnsaved();buildNav();}return result;};});
}

/* Initialize only after all legacy module declarations are available. */
function pmdInitialize(){
 appState=pmdBlankState();appState.settings.dropdownLists.evmStatuses=['Not Started','In Progress','Complete'];appState.settings.dropdownLists.changeClasses=[];appState.settings.dropdownLists.changePriorities=['Routine','Urgent','Emergency'];appState.settings.dropdownLists.requirementPriorities=['High','Medium','Low'];
 Object.keys(SNAPSHOT_GLOBAL_COUNTERS).forEach(function(k){SNAPSHOT_GLOBAL_COUNTERS[k].set(1);});
 pmdInstallAdapters();
 EXPORT_VERSION=PMD_VERSION;undoStack=[];redoStack=[];_auditLog=[];_raciData={};savedFilters={};moduleSubViews={};pmdApplyConfig();updateHeader();updateAccent();buildNav();renderContent();markSaved();
 document.getElementById('navItems').addEventListener('keydown',function(e){if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;var buttons=Array.from(this.querySelectorAll('button')),i=buttons.indexOf(document.activeElement);if(i<0)return;e.preventDefault();buttons[e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus();});
 document.addEventListener('keydown',function(e){var modal=document.getElementById('pmdDialog');if(modal?.classList.contains('open')){if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeModal('pmdDialog');}if(e.key==='Tab'){var controls=Array.from(modal.querySelectorAll('button,input,select,textarea,a[href]')).filter(function(x){return !x.disabled&&x.offsetParent!==null;});if(controls.length){var first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}},true);
 document.getElementById('globalSearchInput').addEventListener('input',handleGlobalSearch);
}
pmdInitialize();

