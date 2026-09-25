/* Legacy HTML sink boundary. External generated functions replace inline script;
   CSP independently disallows inline code and all off-origin connections. */
'use strict';
(() => {
  const inner=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
  const outer=Object.getOwnPropertyDescriptor(Element.prototype,'outerHTML');
  const insert=Element.prototype.insertAdjacentHTML;
  const deny=new Set(['SCRIPT','IFRAME','OBJECT','EMBED','BASE','META','LINK','FOREIGNOBJECT','IMAGE','USE','AUDIO','VIDEO','SOURCE','TRACK']);
  const urlAttrs=new Set(['href','src','action','formaction','xlink:href','poster']);
  const handlers=window.PMD_HANDLERS||[];
  window.pmdSecurityRejectedCount=0;
  const events=[...new Set(handlers.map(h=>h[0]))];
  const bound=new WeakMap();
  function safeURL(value,attr){
    const text=String(value||'').trim().replace(/[\u0000-\u0020\u007f]/g,'');
    if(attr==='src'||attr==='poster')return /^(data:image\/(png|jpeg|gif|webp);base64,|blob:)/i.test(text)||/^(\.\/)?icons\/(icon-(192|512)\.png|apple-touch-icon\.png|icon\.svg)$/.test(text);
    return /^(https?:|mailto:|tel:|#)/i.test(text)||(!/^[a-z][\w+.-]*:/i.test(text)&&!text.startsWith('//'));
  }
  function transform(root){
    const elements=[...(root instanceof Element?[root]:[]),...root.querySelectorAll('*')];
    for(const el of elements){
      if(deny.has(el.tagName.toUpperCase())){el.remove();continue;}
      if(el.tagName==='STYLE'&&/(?:@import|url\s*\(|expression\s*\()/i.test(el.textContent)){el.remove();continue;}
      const pending=[];
      for(const attr of [...el.attributes]){
        const name=attr.name.toLowerCase();
        if(name.startsWith('data-pmd-event-')){
          try{const [id,args]=JSON.parse(attr.value);if(!handlers[id]||!Array.isArray(args)||args.some(x=>x!==null&&typeof x!=='string'&&typeof x!=='number'&&typeof x!=='boolean'))throw Error();}catch{el.removeAttribute(attr.name);}continue;
        }
        if(name.startsWith('on')){
          el.removeAttribute(attr.name);const event=name.slice(2);
          let accepted=false;
          for(let i=0;i<handlers.length;i++){
            const [kind,regex,order]=handlers[i];if(kind!==event)continue;const match=regex.exec(attr.value);if(!match)continue;
            const args=[];for(let j=0;j<order.length;j++){const [index,text]=order[j],value=match[j+1];args[index]=text?value:value==='null'?null:value==='undefined'?undefined:value==='true'?true:value==='false'?false:Number(value);}
            pending.push([event,JSON.stringify([i,args])]);accepted=true;break;
          }
          if(!accepted)window.pmdSecurityRejectedCount++;
        }else if(urlAttrs.has(name)&&!safeURL(attr.value,name))el.removeAttribute(attr.name);
        else if(['srcdoc','http-equiv','srcset','imagesrcset','background'].includes(name))el.removeAttribute(attr.name);
        else if(name==='style'&&/(?:@import|url\s*\(|expression\s*\()/i.test(attr.value))el.removeAttribute(attr.name);
      }
      for(const [event,value]of pending)el.setAttribute('data-pmd-event-'+event,value);
      if(el.tagName==='A'&&el.target==='_blank')el.rel='noopener noreferrer';
    }
  }
  function clean(markup){const template=document.createElement('template');inner.set.call(template,String(markup??''));transform(template.content);return inner.get.call(template);}
  function bind(root){
    if(!root?.querySelectorAll)return;
    for(const name of events){
      const attr='data-pmd-event-'+name,selector='['+attr+']';
      const nodes=[...(root instanceof Element&&root.hasAttribute(attr)?[root]:[]),...root.querySelectorAll(selector)];
      for(const target of nodes){
        const installed=bound.get(target)||new Set();if(installed.has(name))continue;installed.add(name);bound.set(target,installed);
        // Bind at the original element to preserve currentTarget, bubbling and
        // stopPropagation semantics in retained context menus and table rows.
        target.addEventListener(name,function(event){
          try{const [id,args]=JSON.parse(this.getAttribute(attr)),h=handlers[id];if(h&&h[0]===name){const result=h[3].call(this,event,args);if(result===false)event.preventDefault();}}catch(error){console.error('PMD event failed:',name,error.message);}
        });
      }
    }
  }
  Object.defineProperty(Element.prototype,'innerHTML',{...inner,set(value){inner.set.call(this,clean(value));bind(this);}});
  Object.defineProperty(Element.prototype,'outerHTML',{...outer,set(value){const parent=this.parentElement;outer.set.call(this,clean(value));bind(parent);}});
  Element.prototype.insertAdjacentHTML=function(position,html){const result=insert.call(this,position,clean(html));bind(position==='beforebegin'||position==='afterend'?this.parentElement:this);return result;};
  // Initial static markup is already parsed. Remove handlers there as well.
  document.body.querySelectorAll('[onclick],[oninput],[onchange],[onkeyup],[onkeydown]').forEach(el=>transform(el));
  bind(document.body);
  window.pmdSanitizeHTML=clean;
})();
