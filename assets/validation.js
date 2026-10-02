/* Shared backup boundaries. No storage, DOM access, or network operations. */
'use strict';
const PMD_LIMITS = Object.freeze({depth:40, entries:100000, nodes:1000000, text:2000000, totalText:50*1024*1024});
const PMD_RESERVED_RISK_KEYS = new Set(['id','title','name','status','owner','description','due','category','mitigation','rackIds','history','notes','notesArray','created','updated','createdDate','updatedDate','priority','parentId','links','memory','constructor','prototype','__proto__']);
function pmdCheckJSON(root){
  const seen=new WeakSet(),stack=[{value:root,depth:0}];let nodes=0,text=0;
  while(stack.length){
    const {value,depth}=stack.pop();
    if(++nodes>PMD_LIMITS.nodes)throw Error('Backup exceeds the supported total field count.');
    if(depth>PMD_LIMITS.depth)throw Error('Backup nesting exceeds 40 levels.');
    if(value===null)continue;
    if(typeof value==='string'){text+=value.length;if(value.length>PMD_LIMITS.text||text>PMD_LIMITS.totalText)throw Error('Backup text exceeds the supported size.');continue;}
    if(typeof value==='number'){if(!Number.isFinite(value))throw Error('Backup contains a non-finite number.');continue;}
    if(typeof value==='boolean')continue;
    if(typeof value!=='object')throw Error('Backup must contain JSON values only.');
    if(seen.has(value))throw Error('Backup contains a repeated or circular object.');seen.add(value);
    if(!Array.isArray(value)&&Object.getPrototypeOf(value)!==Object.prototype&&Object.getPrototypeOf(value)!==null)throw Error('Backup must contain plain JSON objects.');
    const keys=Object.keys(value);if(keys.length>PMD_LIMITS.entries)throw Error('Backup collection exceeds 100,000 entries.');
    for(const key of keys){if(['__proto__','prototype','constructor'].includes(key))throw Error('Backup contains an unsafe property name.');text+=key.length;stack.push({value:value[key],depth:depth+1});}
  }
}
function pmdCheckObject(value,label){if(!value||typeof value!=='object'||Array.isArray(value))throw Error(label+' must be an object.');}
function pmdCheckTextFields(value,fields,label,required=false){for(const key of fields)if((required||value[key]!==undefined&&value[key]!==null)&&typeof value[key]!=='string')throw Error(label+': '+key+' must be text.');}
function pmdCalendarDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(value+'T12:00:00Z');return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;
}
// Scheduled work dates only: execution dates and creation timestamps are history.
function pmdDueDate(module,record){
  if(!record)return '';
  const value=module==='tests'?record.scheduledDate:module==='decisions'?record.reviewDate:module==='milestones'?record.date:module==='procurement'?record.dateNeeded||record.eta:record.due||record.dueDate||record.targetDate;
  return pmdCalendarDate(value)?value:'';
}
function pmdCheckRecordDetails(record,array){
  const label=array+' #'+record.id;
  if(record.id>=Number.MAX_SAFE_INTEGER)throw Error(label+': ID leaves no safe next counter.');
  for(const key of ['due','dueDate','targetDate','dateNeeded','eta','scheduledDate','reviewDate','startDate','endDate','testDate','reportDate']){
    const value=record[key];if(value!==undefined&&value!==null&&value!==''&&!pmdCalendarDate(value))throw Error(label+': '+key+' must be a valid YYYY-MM-DD date.');
  }
  if(array==='milestones'&&record.date&&!pmdCalendarDate(record.date))throw Error(label+': date must be a valid YYYY-MM-DD date.');
  for(const key of ['history','notesArray','memory',...(['actions','decisions','milestones'].includes(array)?['notes']:[])]){
    if(record[key]===undefined)continue;
    if(!Array.isArray(record[key]))throw Error(label+': '+key+' must be an array.');
    for(const entry of record[key]){pmdCheckObject(entry,label+' '+key);pmdCheckTextFields(entry,['date','timestamp','text','action','field','type','size','unit','description'],label+' '+key);}
  }
  if(!['actions','decisions','milestones'].includes(array))pmdCheckTextFields(record,['notes'],label);
  pmdCheckTextFields(record,['url','criteria','rationale','decision','outcome','resolution','mitigation','tagNumber','accountability','version','licenseKey','contact','email','phone'],label);
  if(record.links!==undefined){if(!Array.isArray(record.links))throw Error(label+': links must be an array.');for(const link of record.links){pmdCheckObject(link,label+' link');pmdCheckTextFields(link,['title','name','url','description'],label+' link');}}
}
function pmdCheckBackupDetails(data){
  const source=data.schema?data.state:data;if(!source)return;
  for(const entry of data.auditTrail||[]){
    pmdCheckObject(entry,'Audit entry');pmdCheckTextFields(entry,['timestamp','module','action','itemTitle'],'Audit entry',true);
    for(const change of entry.changes||[]){pmdCheckObject(change,'Audit change');pmdCheckTextFields(change,['field'],'Audit change');for(const key of ['oldVal','newVal'])if(change[key]!==undefined&&change[key]!==null&&!['string','number','boolean'].includes(typeof change[key]))throw Error('Audit change values must be text, numbers or booleans.');}
  }
  const session=data.session||{};
  if(session.raci)for(const value of Object.values(session.raci))if(!['','R','A','C','I'].includes(value))throw Error('Invalid responsibility assignment.');
  if(session.subViews)for(const value of Object.values(session.subViews))if(typeof value!=='string')throw Error('Subview names must be text.');
  if(session.savedFilters)for(const presets of Object.values(session.savedFilters)){
    if(!Array.isArray(presets))throw Error('Saved filters must contain lists of presets.');
    for(const preset of presets){pmdCheckObject(preset,'Filter preset');pmdCheckTextFields(preset,['name'],'Filter preset',true);const fields=preset.filters===undefined?(preset.state===undefined?preset:preset.state):preset.filters;pmdCheckObject(fields,'Filter fields');for(const value of Object.values(fields))if(!['string','number','boolean'].includes(typeof value))throw Error('Invalid saved filter value.');}
  }
  if(source.settings){
    const s=source.settings;
    if(s.dashboard){pmdCheckObject(s.dashboard,'Dashboard settings');for(const value of Object.values(s.dashboard))if(typeof value!=='boolean')throw Error('Dashboard settings must be enabled or disabled.');}
    if(s.prefixHistory){pmdCheckObject(s.prefixHistory,'Prefix history');for(const value of Object.values(s.prefixHistory))if(!Array.isArray(value)||value.some(v=>typeof v!=='string'))throw Error('Invalid prefix history.');}
  }
}
// CSV is a review format. Formula-like strings must remain text in spreadsheet apps.
function pmdSpreadsheetText(value){
  if(value&&typeof value==='object')value=JSON.stringify(value);
  const text=String(value??'');
  return typeof value!=='number'&&(/^[\s\u0000-\u001f\ufeff]*[=+@\-＝＋＠－]/u.test(text)||/^[\t\r\n]/.test(text))?"'"+text:text;
}
function pmdCSVCell(value){return '"'+pmdSpreadsheetText(value).replace(/"/g,'""')+'"';}

// Build per operation, never retain across mutations. This avoids stale-link caches
// while making import/integrity endpoint checks linear in records + relationships.
function pmdReferenceIndex(state){
  const records=new Map(),external=new Map();
  for(const array of Object.keys(PMD_COUNTERS)){
    const ids=new Map(),names=new Map();for(const record of state[array]||[]){ids.set(record.id,record);if(record.reqId&&!names.has(record.reqId))names.set(record.reqId,record);}
    records.set(array,ids);external.set(array,names);
  }
  return {records,external};
}
function pmdIndexedFind(index,endpoint){return index.records.get(pmdArray(endpoint.module))?.get(endpoint.id);}
