(()=>{
 const app=document.getElementById('app');
 if(!app)return;
 const base=new URL('.',document.currentScript.src);
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../css/spec-panel.css?v=spec-tabs-20261014-3',base);document.head.append(css);
 let specs=window.GFAIR_NOTICE_SPEC||[];
 let sheetBusy=false,sheetRequested=false,sourceLabel="시트 연결 준비 중";
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
  if((decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen)!=='NTC-01'){status.textContent='';panel.append(version);return;}
  const heading=document.createElement('h2');heading.textContent='공지사항 Description';panel.append(heading);
  const intro=document.createElement('p');intro.className='ui-spec-intro';intro.textContent='NTC-01 · '+sourceLabel;panel.append(intro);
  const reference=document.createElement('a');reference.className='ui-spec-source';reference.textContent='연결 시트 · 화면요소 수정하기 ↗';reference.href='https://docs.google.com/spreadsheets/d/11ta8oBialEa6NBmHdngQXZFjLCD9ouPmQ_GJBAb78RE/edit?gid=1462369663#gid=1462369663';reference.target='_blank';reference.rel='noopener';panel.append(reference);
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
  }else{
   const spec=specs.find(item=>item.number===selectedTab);const title=document.createElement('h3');title.textContent=String(spec.number).padStart(2,'0')+' · '+spec.title;content.append(title);
   table('항목 정보',['요소 유형','기본값','필수여부','확정여부'],[[spec.type,spec.defaultValue,spec.required,spec.status||'작성중']],content);
   const section=document.createElement('section');section.className='ui-spec-detail';const heading=document.createElement('h4');heading.textContent='화면 구성 · 상세 설명';const text=document.createElement('p');text.textContent=spec.description;section.append(heading,text);content.append(section);
   function conditions(title,value){
    if(!value){const p=document.createElement('p');p.className='ui-spec-detail-empty';p.textContent=title+' 명세가 비어 있습니다. 시트에서 작성해 주세요.';content.append(p);return;}
    const rows=value.split('\n').filter(line=>line.trim()).map(line=>{const at=line.indexOf(':');return at<0?['조건',line]:[line.slice(0,at),line.slice(at+1).trim()];});table(title,['구분','조건 · 설명'],rows,content);
   }
   conditions('권한 · 누가 접근하고 처리하는가',spec.permission);
   conditions('상태 · 값과 전환 조건',spec.state);
   conditions('처리 · 입력 검증과 결과',spec.processing);
   conditions('예외 · 구현 범위와 협의 사항',spec.exception);
   const hint=document.createElement('p');hint.className='ui-spec-link-hint';hint.textContent=spec.number>=14?'연결 화면의 개발 조건입니다. 좌측 관련 진입 영역에 같은 번호를 표시합니다.':'탭 선택과 좌측 붉은 번호가 연결됩니다. 현재 역할에서 숨겨진 요소는 표시되지 않을 수 있습니다.';content.append(hint);
  }
  panel.append(content);panel.prepend(version);
  const foot=document.createElement('p');foot.className='ui-spec-link-hint';foot.textContent='시트의 화면요소 탭을 수정한 뒤 새로고침하면 개요와 상세 설명이 갱신됩니다. 상태·권한·처리는 개발 명세이며 실제 서비스 권한을 변경하지 않습니다.';panel.append(foot);
  status.textContent='Description 확인 '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit'}).format(new Date());
 }
 async function refreshSheet(){
  if(sheetBusy)return;
  sheetBusy=true;const button=toolbar.querySelector('[data-spec=refresh]');button.disabled=true;status.textContent='시트 명세를 불러오는 중…';
  try{
   const next=await window.GFAIR_SPEC_SHEET.read();
   const route=location.hash.slice(1)||document.body.dataset.screen;
   const scroll=panel.scrollTop;specs=next;sourceLabel='구글 시트 연결 · '+next.length+'개 항목';
   if(route==='NTC-01'){draw();panel.scrollTop=scroll;status.textContent='시트 반영 완료 · '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit'}).format(new Date());}
  }catch(error){sourceLabel='이전 명세 유지 · '+error.message;const intro=panel.querySelector('.ui-spec-intro');if(intro)intro.textContent='NTC-01 · '+sourceLabel;status.textContent='갱신 실패 · 이전 명세 유지';}
  finally{sheetBusy=false;button.disabled=false;}
 }
 function sync(){
  const route=decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen;
  const active=route==='NTC-01',overview=route==='screens';if(active&&!sheetRequested){sheetRequested=true;refreshSheet();}toolbar.hidden=false;panel.hidden=closed||overview;
  ['refresh','numbers','full','close'].forEach(action=>{toolbar.querySelector('[data-spec='+action+']').hidden=overview||(action==='numbers'&&!active);});status.hidden=overview;
  screenPicker.value=route;
  panel.setAttribute('aria-label','Description');toolbar.querySelector('[data-spec=numbers]').hidden=overview||!active;
  layout.classList.toggle('with-spec',!closed&&!overview);layout.classList.toggle('spec-full',!closed&&!overview&&full);
  toolbar.querySelector('[data-spec=close]').textContent=closed?'열기':'닫기';
  toolbar.querySelector('[data-spec=full]').textContent=full&&!closed?'목업과 함께 보기':'전체보기';
  toolbar.querySelector('[data-spec=numbers]').textContent=numbers?'번호 숨기기':'번호 표시';
  const role=document.getElementById('role-picker'),select=toolbar.querySelector('.ui-spec-actions select');
  if(role){if(!select.options.length)select.innerHTML=role.innerHTML;select.value=role.value;}
  app.querySelectorAll('#filter-form button[type=submit],#filter-form button[data-notice-action=reset]').forEach(button=>{
   if(button.parentElement.classList.contains('ui-spec-control-anchor'))return;
   const anchor=document.createElement('span');anchor.className='ui-spec-control-anchor';anchor.dataset.control=button.type==='submit'?'search':'reset';button.before(anchor);anchor.append(button);
  });
  const targets=[['#filter-form > .field:nth-child(1)',1],['#filter-form > .field:nth-child(2)',2],['#filter-form > .field:nth-child(3)',3],['#filter-form > .field:nth-child(4)',4],['.ui-spec-control-anchor[data-control=search]',5],['.ui-spec-control-anchor[data-control=reset]',6],['.notice-panel .panelhead h2',7],['.head-actions:has([data-notice-action=create])',8],['.notice-list .notice-title-column',9],['.head-actions:has(a[href="#NTC-05"])',10],['.notice-list thead th:last-child',11],['.notice-panel .panelhead',12],['.notice-panel .tablewrap',13],['.pagehead:has([data-notice-action=create])',14],['.pagehead:has(a[href="#NTC-05"])',15]];
  targets.forEach(([selector,id])=>{
   const target=app.querySelector(selector);if(!target)return;
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
  if(action==='refresh'){closed=false;if((location.hash.slice(1)||document.body.dataset.screen)==='NTC-01')refreshSheet();else draw();}
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
 window.addEventListener('hashchange',()=>{selectedTab=0;draw();sync();});setInterval(()=>{if(!document.hidden&&(location.hash.slice(1)||document.body.dataset.screen)==='NTC-01')refreshSheet();sync();},60000);draw();sync();
})();
