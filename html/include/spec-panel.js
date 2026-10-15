(()=>{
 const app=document.getElementById('app');
 if(!app)return;
 const base=new URL('.',document.currentScript.src);
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../css/spec-panel.css?v=notice-filter-spec-20261015',base);document.head.append(css);
 let specs=window.GFAIR_NOTICE_SPEC||[];
 let sourceLabel="전용 시트 연결 준비 중",sheetBusy=false,sheetRequested=false;
 let access=window.GFAIR_NOTICE_ACCESS||[];
 const listState={specs,access,label:sourceLabel};
 const contextCache={list:listState};let contextKey='list';
 function context(){const route=decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen;if(route==='NTC-01')return 'list';if(route==='NTC-04'){const view=app.querySelector('[data-notice-view]')?.dataset.noticeView;return view==='detail'?'detail':view==='create'||view==='edit'?'editor':null;}return null;}
 function config(){return contextKey==='list'?{gid:'1062168489',name:'NTC-01 공지사항목록'}:window.GFAIR_NOTICE_DETAIL_SPEC?.[contextKey];}
 function selectContext(){const key=context();if(!key||key===contextKey)return false;contextCache[contextKey]={specs,access,label:sourceLabel};contextKey=key;const data=contextCache[key]||window.GFAIR_NOTICE_DETAIL_SPEC[key];specs=data.specs;access=data.access;sourceLabel=data.label||'기본 명세 · 시트 연결 중';selectedTab=0;sheetRequested=false;return true;}
 const toolbar=document.createElement('div');toolbar.className='ui-spec-toolbar';toolbar.hidden=true;
 toolbar.innerHTML='<div class="ui-spec-identity"><strong>With / 기획팀 SB</strong><select class="ui-spec-screen-picker" data-spec="screen" aria-label="목업 화면 선택"></select><button type="button" data-spec="screen-search">화면검색</button><span class="ui-spec-preview">예시 데이터 · 검토용</span></div><div class="ui-spec-actions"><label>사용구분 <select aria-label="사용구분"></select></label><button type="button" data-spec="refresh">새로고침</button><button type="button" data-spec="numbers">번호 숨기기</button><button type="button" data-spec="full">전체보기</button><button type="button" data-spec="close">닫기</button><span class="ui-spec-status" role="status"></span></div>';
 const screenPicker=toolbar.querySelector('[data-spec=screen]');
 (window.GFAIR_SCREENS||[]).forEach(group=>{
  const section=document.createElement('optgroup');section.label=group.name;
  group.screens.forEach(screen=>{const option=document.createElement('option');option.value=screen.id;option.textContent=screen.id+' : '+(screen.id==='NTC-01'?'공지사항 목록':screen.title);section.append(option);});screenPicker.append(section);
 });
 const overview=document.createElement('option');overview.value='screens';overview.textContent='SCREEN-LIST : 전체 화면 목록';screenPicker.append(overview);
 const layout=document.createElement('div');layout.className='ui-spec-layout';app.before(toolbar,layout);layout.append(app);
 const measureToolbar=()=>document.documentElement.style.setProperty('--sb-toolbar-height',toolbar.getBoundingClientRect().height+'px');
 new ResizeObserver(measureToolbar).observe(toolbar);measureToolbar();
 const panel=document.createElement('aside');panel.className='ui-spec-panel';panel.setAttribute('aria-label','공지사항 Description');panel.hidden=true;layout.append(panel);
 let closed=false,full=false,numbers=true,selectedTab=0;
 const status=toolbar.querySelector('.ui-spec-status');
 function revisionAccountName(entry){const actual=entry.account||entry.accountName||'';return (window.GFAIR_REVISION_ACCOUNT_NAMES||{})[actual]||entry.accountName||actual;}
 function showHistory(){
  let modal=document.getElementById('revision-history-dialog');
  if(!modal){modal=document.createElement('dialog');modal.id='revision-history-dialog';modal.className='ui-revision-dialog';document.body.append(modal);}
  modal.replaceChildren();const heading=document.createElement('h2');heading.textContent='화면 / Description 수정 이력';modal.append(heading);
  const route=decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen;
  const releases=(window.GFAIR_REVISION_HISTORY||[]).filter(entry=>entry.release&&(!entry.screenId||entry.screenId===route));
  heading.textContent='개발 전달 이력';
  const list=document.createElement('ul');
  if(!releases.length){const empty=document.createElement('li');empty.textContent='등록된 수정 이력이 없습니다.';list.append(empty);}
  releases.forEach(entry=>{const item=document.createElement('li'),meta=document.createElement('strong'),summary=document.createElement('p');meta.textContent=entry.date+' / '+revisionAccountName(entry)+(entry.version?' · '+(entry.fromVersion?entry.fromVersion+' → ':'')+entry.version:'');summary.textContent=entry.summary;item.append(meta,summary);if(entry.changes){const changes=document.createElement('ul');entry.changes.forEach(text=>{const change=document.createElement('li');change.textContent=text;changes.append(change);});item.append(changes);}if(entry.note){const note=document.createElement('p');note.textContent=entry.note;item.append(note);}list.append(item);});modal.append(list);
  const close=document.createElement('button');close.type='button';close.className='ui-revision-close';close.textContent='×';close.setAttribute('aria-label','수정 이력 닫기');close.title='닫기';close.addEventListener('click',()=>modal.close());const header=document.createElement('div');header.className='ui-revision-header';header.append(heading,close);modal.prepend(header);modal.showModal();
 }
 function draw(){
  panel.replaceChildren();
  const version=document.createElement('footer');version.className='ui-spec-version';const revisionButton=document.createElement('button');revisionButton.type='button';const route=decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen;const latest=(window.GFAIR_REVISION_HISTORY||[]).find(entry=>entry.screenId===route);revisionButton.textContent=latest?'HTML '+latest.version+' · '+latest.date+' / '+revisionAccountName(latest):'수정 이력';revisionButton.title='수정 이력 보기';revisionButton.addEventListener('click',showHistory);version.append(revisionButton);
  if(!context()){status.textContent='';panel.append(version);return;}
  const heading=document.createElement('h2');heading.textContent=(contextKey==='list'?'공지사항':contextKey==='editor'?'공지사항 등록·수정':'공지사항 상세')+' Description';panel.append(heading);
  const intro=document.createElement('p');intro.className='ui-spec-intro';intro.textContent=(contextKey==='list'?'NTC-01':'NTC-04')+' · '+sourceLabel;panel.append(intro);
  const link=document.createElement('a');link.className='ui-spec-source';link.textContent='명세 시트 수정하기 ↗';link.href='https://docs.google.com/spreadsheets/d/11ta8oBialEa6NBmHdngQXZFjLCD9ouPmQ_GJBAb78RE/edit?gid='+config().gid+'#gid='+config().gid;link.target='_blank';link.rel='noopener';panel.append(link);
  function table(title,headers,rows,card){
   const wrap=document.createElement('div');wrap.className='ui-spec-table';const element=document.createElement('table');
   const caption=document.createElement('caption');caption.textContent=title;element.append(caption);
   const head=document.createElement('thead'),row=document.createElement('tr');headers.forEach(text=>{const th=document.createElement('th');th.scope='col';th.textContent=text;row.append(th);});head.append(row);element.append(head);
   const body=document.createElement('tbody');rows.forEach(values=>{const tr=document.createElement('tr');values.forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td);});body.append(tr);});element.append(body);wrap.append(element);card.append(wrap);
  }
  if(selectedTab&&!specs.some(spec=>spec.number===selectedTab))selectedTab=0;
  const tabs=document.createElement('div');tabs.className='ui-spec-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','공지사항 Description 항목');
  [{number:0,title:'개요'},...specs].forEach(spec=>{
   const button=document.createElement('button');button.type='button';button.id='spec-tab-'+spec.number;button.dataset.tab=spec.number;button.setAttribute('role','tab');button.setAttribute('aria-selected',String(selectedTab===spec.number));button.setAttribute('aria-controls','spec-tab-body');button.tabIndex=selectedTab===spec.number?0:-1;button.textContent=spec.number?String(spec.number).padStart(2,'0'):'개요';button.title=spec.title;
   button.addEventListener('click',()=>openTab(spec.number));tabs.append(button);
  });panel.append(tabs);
  tabs.addEventListener('keydown',event=>{
   if(event.ctrlKey||event.metaKey||event.altKey)return;
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
   const items=[0,...specs.map(spec=>spec.number)],index=items.indexOf(selectedTab);
   const next=event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowRight'?1:-1)+items.length)%items.length;
   openTab(items[next]);panel.querySelector('#spec-tab-'+items[next]).focus({preventScroll:true});
  });
  const content=document.createElement('div');content.id='spec-tab-body';content.className='ui-spec-tab-body';content.setAttribute('role','tabpanel');content.setAttribute('aria-labelledby','spec-tab-'+selectedTab);content.tabIndex=0;
  if(!selectedTab){
   const title=document.createElement('h3');title.textContent='화면요소 · 개요';content.append(title);
   const wrap=document.createElement('div');wrap.className='ui-spec-grid-wrap';const grid=document.createElement('table');grid.className='ui-spec-grid ui-spec-overview';
   const head=document.createElement('thead'),tr=document.createElement('tr');
   ['번호','항목명','요소 유형','설명','기본값','필수여부'].forEach(name=>{const th=document.createElement('th');th.scope='col';th.textContent=name;tr.append(th);});head.append(tr);grid.append(head);
   const body=document.createElement('tbody');specs.forEach(spec=>{
    const row=document.createElement('tr'),number=document.createElement('th');number.scope='row';const button=document.createElement('button');button.type='button';button.className='ui-spec-row-link';button.textContent=String(spec.number).padStart(2,'0');button.setAttribute('aria-label',button.textContent+' '+spec.title+' 상세 보기');button.addEventListener('click',()=>openTab(spec.number));number.append(button);row.append(number);
    [spec.title,spec.type,spec.summary||spec.description.split('\n')[0],spec.defaultValue,spec.required].forEach(value=>{const td=document.createElement('td');td.textContent=value||'해당없음';row.append(td);});body.append(row);
   });grid.append(body);wrap.append(grid);content.append(wrap);

   if(access.length){
    table('사용자별 권한',['사용자','이용 범위','권한 · 이용 정책'],access.map(item=>[item.role,item.scope,item.policy]),content);
    const note=document.createElement('p');note.className='ui-spec-link-hint';note.hidden=contextKey!=='list';note.textContent='공지 우선 노출은 개발 정책입니다. 현재 목업에는 상담일지 작성 중 자동 공지 노출과 실제 서버 권한 검증이 연결되어 있지 않습니다. 운영용역사·해외바이어의 이용 범위는 추후 확정이 필요합니다.';content.append(note);
   }

  }else{
   const spec=specs.find(item=>item.number===selectedTab);const title=document.createElement('h3');title.textContent=String(spec.number).padStart(2,'0')+' · '+spec.title;content.append(title);
   table('항목 정보',['요소 유형','기본값','필수여부','상세 설명','정책 설명'],[[spec.type,spec.defaultValue,spec.required,spec.description,spec.policyDescription||'해당없음']],content);
   content.querySelector('.ui-spec-table').classList.add('ui-spec-item-info');
   (spec.detailTables||[]).forEach(section=>table(section.title,section.headers,section.rows,content));
   const hint=document.createElement('p');hint.className='ui-spec-link-hint';hint.textContent=spec.number>=14?'연결 화면의 개발 조건입니다. 좌측 관련 진입 영역에 같은 번호를 표시합니다.':'탭 선택과 좌측 붉은 번호가 연결됩니다. 현재 역할에서 숨겨진 요소는 표시되지 않을 수 있습니다.';content.append(hint);
  }
  panel.append(content);panel.prepend(version);
  const foot=document.createElement('p');foot.className='ui-spec-link-hint';foot.textContent=config().name+' 시트를 수정하면 새로고침 또는 1분 자동 갱신으로 반영됩니다. 목업 입력값은 유지합니다.';panel.append(foot);
  status.textContent='Description 확인 '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit'}).format(new Date());
 }
 async function refreshDescription(){
  if(sheetBusy)return;sheetBusy=true;const button=toolbar.querySelector('[data-spec=refresh]');button.disabled=true;status.textContent='시트 명세를 불러오는 중…';
  const requestedKey=contextKey,requestedConfig=config();
  try{const next=await window.GFAIR_SPEC_SHEET.read(requestedConfig.gid);const label='구글 시트 연결 · '+next.specs.length+'개 항목';contextCache[requestedKey]={...next,label};if(context()&&contextKey===requestedKey){specs=next.specs;access=next.access;sourceLabel=label;const scroll=panel.scrollTop;draw();panel.scrollTop=scroll;status.textContent='시트 반영 완료 · '+new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});}}

  catch(error){status.textContent='갱신 실패 · 이전 명세 유지';const intro=panel.querySelector('.ui-spec-intro');if(intro)intro.textContent='이전 명세 유지 · '+error.message;}
  finally{sheetBusy=false;button.disabled=false;if(context()&&contextKey!==requestedKey)refreshDescription();}
 }
 function sync(){
  const route=decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen;
  if(selectContext())draw();const active=!!context(),overview=route==='screens';if(active&&!sheetRequested){sheetRequested=true;refreshDescription();}toolbar.hidden=false;panel.hidden=closed||overview;
  ['refresh','numbers','full','close'].forEach(action=>{toolbar.querySelector('[data-spec='+action+']').hidden=overview||(action==='numbers'&&!active);});status.hidden=overview;
  screenPicker.value=route;
  panel.setAttribute('aria-label','Description');toolbar.querySelector('[data-spec=numbers]').hidden=overview||!active;
  layout.classList.toggle('with-spec',!closed&&!overview);layout.classList.toggle('spec-full',!closed&&!overview&&full);
  toolbar.querySelector('[data-spec=close]').textContent=closed?'열기':'닫기';
  toolbar.querySelector('[data-spec=full]').textContent=full&&!closed?'목업과 함께 보기':'전체보기';
  toolbar.querySelector('[data-spec=numbers]').textContent=numbers?'번호 숨기기':'번호 표시';
  const role=document.getElementById('role-picker'),select=toolbar.querySelector('.ui-spec-actions select');
  if(role){if(!select.options.length)select.innerHTML=role.innerHTML;select.value=role.value;}
  app.querySelectorAll('#filter-form button[type=submit],#filter-form button[data-notice-action=reset],#notice-size,#notice-sort').forEach(button=>{
   if(button.parentElement.classList.contains('ui-spec-control-anchor'))return;
   const anchor=document.createElement('span');anchor.className='ui-spec-control-anchor';anchor.dataset.control=button.id==='notice-sort'?'sort':button.id==='notice-size'?'page-size':button.type==='submit'?'search':'reset';button.before(anchor);anchor.append(button);
  });
  const targets=[['#filter-form .field:has([name=f1])',1],['#filter-form .field:has([name=f3])',2],['#filter-form .field:has([name=f2])',3],['.ui-spec-control-anchor[data-control=search]',4],['.ui-spec-control-anchor[data-control=reset]',5],['.notice-panel .panelhead h2',6],['.head-actions:has([data-notice-action=create])',7],['.notice-list tbody tr:first-child td:nth-child(3)',8],['.head-actions:has(a[href="#NTC-05"])',9],['.notice-list thead th:last-child',10],['.ui-spec-control-anchor[data-control=page-size]',11],['.ui-spec-control-anchor[data-control=sort]',12]];
  if(active&&contextKey!=='list'){
   targets.length=0;
   if(contextKey==='editor'){
    ['[name=event]','.notice-target-picker','[name=category]','fieldset','[name=status]','.notice-dates','[name=title]','[name=body]','#notice-file','[data-notice-action=cancel]','[type=submit]'].forEach((selector,i)=>{const el=app.querySelector('.notice-editor '+selector);if(el){el.dataset.noticeSpecAnchor=i+1;targets.push(['[data-notice-spec-anchor="'+(i+1)+'"]',i+1]);}});
   }else{
    const indices=[0,1,2,3,4,6,7,8,9,10];indices.forEach((index,i)=>{const el=app.querySelectorAll('.notice-detail dt')[index];if(el){el.dataset.noticeSpecAnchor=i+1;targets.push(['[data-notice-spec-anchor="'+(i+1)+'"]',i+1]);}});
    targets.push(['[data-notice-action=back]',11],['[data-notice-action=edit]',12]);
   }
  }
  targets.forEach(([selector,id])=>{
   let target=app.querySelector(selector);if(!target)return;if(target.matches('.notice-target-picker'))target=target.parentElement;if(target.matches('input,select,textarea'))target=target.closest('.field')||target.parentElement;if(target.matches('button')){if(!target.parentElement.classList.contains('ui-spec-control-anchor')){const anchor=document.createElement('span');anchor.className='ui-spec-control-anchor';target.before(anchor);anchor.append(target);}target=target.parentElement;}
   let pin=target.querySelector(':scope > .ui-spec-pin[data-spec-number="'+id+'"]');
   if(active&&!closed&&numbers&&specs.some(spec=>spec.number===id)){
    if(!pin){pin=document.createElement('button');pin.type='button';pin.className='ui-spec-pin';pin.dataset.specNumber=id;pin.textContent=String(id).padStart(2,'0');pin.setAttribute('aria-label','Description '+id+'번 보기');pin.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openTab(id,false);panel.querySelector('#spec-tab-'+id)?.focus({preventScroll:true});});target.classList.add('ui-spec-marked');target.append(pin);}
    pin.classList.toggle('selected',selectedTab===id);pin.setAttribute('aria-pressed',String(selectedTab===id));
   }else if(pin){pin.remove();target.classList.remove('ui-spec-marked');}
  });
 }
 function openTab(id,scroll=true){
  selectedTab=id;closed=false;numbers=true;draw();panel.scrollTop=0;sync();
  app.querySelectorAll(".ui-spec-range-selected").forEach(element=>element.classList.remove("ui-spec-range-selected"));
  app.querySelector(".ui-spec-pin.selected")?.parentElement.classList.add("ui-spec-range-selected");
  if(scroll&&!full&&matchMedia("(min-width:1101px)").matches){const pin=app.querySelector('.ui-spec-pin[data-spec-number="'+id+'"]');pin?.parentElement.scrollIntoView({block:'nearest',behavior:'smooth'});}
 }
 toolbar.addEventListener('click',event=>{
  const action=event.target.dataset.spec;
  if(action==='screen-search'){closed=false;full=false;location.hash='screens';}
  if(action==='refresh'){closed=false;if(context())refreshDescription();else draw();}
  if(action==='numbers')numbers=!numbers;
  if(action==='full'){closed=false;full=!full;}
  if(action==='close'){closed=!closed;full=false;}
  sync();
 });
 toolbar.addEventListener('change',event=>{
  if(event.target.dataset.spec==='screen'){closed=false;full=false;location.hash=event.target.value;sync();return;}
  if(event.target===toolbar.querySelector('.ui-spec-actions select')){
   const role=document.getElementById('role-picker'),form=document.getElementById('filter-form');
   const values=form?Array.from(new FormData(form)):[];
   if(role){role.value=event.target.value;role.dispatchEvent(new Event('change',{bubbles:true}));}

   requestAnimationFrame(()=>{
    const next=document.getElementById('filter-form');
    if(next)values.forEach(([name,value])=>{const field=next.elements.namedItem(name);if(field&&(!(field instanceof HTMLSelectElement)||Array.from(field.options).some(o=>o.value===value)))field.value=value;});
   });
  }
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&full){full=false;sync();}});
 new MutationObserver(sync).observe(app,{childList:true,subtree:true});
 window.addEventListener('revision-history-loaded',draw);
 window.addEventListener('hashchange',()=>{selectedTab=0;draw();sync();});setInterval(()=>{if(!document.hidden&&context())refreshDescription();sync();},60000);draw();sync();
})();
