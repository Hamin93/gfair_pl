(()=>{
 const app=document.getElementById('app');
 if(!app)return;
 const base=new URL('.',document.currentScript.src);
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../css/spec-panel.css?v=sb-screen-search-20261014',base);document.head.append(css);
 const specs=window.GFAIR_NOTICE_SPEC||[];
 const toolbar=document.createElement('div');toolbar.className='ui-spec-toolbar';toolbar.hidden=true;
 toolbar.innerHTML='<div class="ui-spec-identity"><strong>With / 기획팀 SB</strong><select class="ui-spec-screen-picker" data-spec="screen" aria-label="목업 화면 선택"></select><button type="button" data-spec="screen-search">화면검색</button><span class="ui-spec-preview">예시 데이터 · 검토용</span></div><div class="ui-spec-actions"><label>검토 역할 <select aria-label="Description 검토 역할"></select></label><button type="button" data-spec="refresh">새로고침</button><button type="button" data-spec="numbers">번호 숨기기</button><button type="button" data-spec="full">전체보기</button><button type="button" data-spec="close">닫기</button><span class="ui-spec-status" role="status"></span></div>';
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
 let closed=false,full=false,numbers=true;
 const status=toolbar.querySelector('.ui-spec-status');
 function draw(){
  panel.replaceChildren();
  if((decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen)!=='NTC-01'){status.textContent='';return;}
  const heading=document.createElement('h2');heading.textContent='공지사항 Description';panel.append(heading);
  const intro=document.createElement('p');intro.className='ui-spec-intro';intro.textContent='NTC-01 · 검토용 Description 초안 · 외부 시트 미연결';panel.append(intro);
  const reference=document.createElement('a');reference.className='ui-spec-source';reference.textContent='작성 기준: 데모 Description · 화면요소';reference.href='https://docs.google.com/spreadsheets/d/11ta8oBialEa6NBmHdngQXZFjLCD9ouPmQ_GJBAb78RE/edit?gid=1462369663#gid=1462369663';reference.target='_blank';reference.rel='noopener';panel.append(reference);
  function table(title,headers,rows,card){
   const wrap=document.createElement('div');wrap.className='ui-spec-table';const element=document.createElement('table');
   const caption=document.createElement('caption');caption.textContent=title;element.append(caption);
   const head=document.createElement('thead'),row=document.createElement('tr');headers.forEach(text=>{const th=document.createElement('th');th.scope='col';th.textContent=text;row.append(th);});head.append(row);element.append(head);
   const body=document.createElement('tbody');rows.forEach(values=>{const tr=document.createElement('tr');values.forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td);});body.append(tr);});element.append(body);wrap.append(element);card.append(wrap);
  }
  const wrap=document.createElement("div");wrap.className="ui-spec-grid-wrap";
  const grid=document.createElement("table");grid.className="ui-spec-grid";
  const head=document.createElement("thead"),header=document.createElement("tr");
  ["번호","항목명","요소 유형","설명","기본값","필수 여부","확정 여부"].forEach((name,index)=>{const th=document.createElement("th");th.scope="col";th.textContent=name;if([2,4,5,6].includes(index))th.className="ui-spec-meta-col";header.append(th);});head.append(header);grid.append(head);
  const rows=document.createElement("tbody");
  specs.forEach(spec=>{
   const row=document.createElement("tr");row.id="notice-spec-"+spec.number;row.className="ui-spec-card";row.tabIndex=-1;
   const number=document.createElement("th");number.scope="row";number.textContent=String(spec.number).padStart(2,"0");
   const title=document.createElement("td");const strong=document.createElement("strong");strong.textContent=spec.title;title.append(strong);
   const inline=document.createElement("dl");inline.className="ui-spec-inline-meta";
   [["유형",spec.type],["기본값",spec.defaultValue],["필수",spec.required],["확정",spec.status]].forEach(([key,value])=>{const dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=key;dd.textContent=value;inline.append(dt,dd);});title.append(inline);
   const type=document.createElement("td");type.textContent=spec.type;type.className="ui-spec-meta-col";
   const description=document.createElement("td");description.className="ui-spec-description";const body=document.createElement("p");body.textContent=spec.description;description.append(body);
   if(spec.options){const options=document.createElement("p");options.textContent="선택 항목: "+spec.options.map(option=>option[0]).join(" / ");description.append(options);}
   (spec.tables||[]).forEach(section=>table(section.title,section.headers,section.rows,description));
   const note=document.createElement("p");note.className="ui-spec-note";note.textContent=spec.note;description.append(note);
   row.append(number,title,type,description);
   [spec.defaultValue,spec.required,spec.status].forEach(value=>{const td=document.createElement("td");td.className="ui-spec-meta-col";td.textContent=value;row.append(td);});rows.append(row);
  });grid.append(rows);wrap.append(grid);panel.append(wrap);
  status.textContent='Description 확인 '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit'}).format(new Date());
 }
 function sync(){
  const route=decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen;
  const active=route==='NTC-01';toolbar.hidden=false;panel.hidden=closed;
  screenPicker.value=route;
  panel.setAttribute('aria-label','Description');toolbar.querySelector('[data-spec=numbers]').hidden=!active;
  layout.classList.toggle('with-spec',!closed);layout.classList.toggle('spec-full',!closed&&full);
  toolbar.querySelector('[data-spec=close]').textContent=closed?'열기':'닫기';
  toolbar.querySelector('[data-spec=full]').textContent=full&&!closed?'목업과 함께 보기':'전체보기';
  toolbar.querySelector('[data-spec=numbers]').textContent=numbers?'번호 숨기기':'번호 표시';
  const role=document.getElementById('role-picker'),select=toolbar.querySelector('.ui-spec-actions select');
  if(role){if(!select.options.length)select.innerHTML=role.innerHTML;select.value=role.value;}
  const targets=[['#filter-form > .field:nth-child(1)',1],['#filter-form > .field:nth-child(2)',2],['#filter-form > .field:nth-child(3)',3],['#filter-form > .field:nth-child(4)',4],['#filter-form .row',5],['.notice-panel .panelhead',7],['.head-actions',8],['.tablewrap',9],['.head-actions',10]];
  targets.forEach(([selector,id])=>{
   const target=app.querySelector(selector);if(!target)return;
   let pin=target.querySelector(':scope > .ui-spec-pin[data-spec-number="'+id+'"]');
   if(active&&!closed&&numbers){if(!pin){pin=document.createElement('button');pin.type='button';pin.className='ui-spec-pin';pin.dataset.specNumber=id;pin.textContent=id;pin.setAttribute('aria-label','Description '+id+'번 보기');pin.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();panel.querySelectorAll('.ui-spec-card').forEach(c=>c.classList.remove('selected'));const card=document.getElementById('notice-spec-'+id);card.classList.add('selected');card.scrollIntoView({block:'nearest',behavior:'smooth'});card.focus({preventScroll:true});});target.classList.add('ui-spec-marked');target.append(pin);}}
   else if(pin){pin.remove();target.classList.remove('ui-spec-marked');}
  });
 }
 toolbar.addEventListener('click',event=>{
  const action=event.target.dataset.spec;
  if(action==='screen-search'){closed=false;full=false;location.hash='screens';}
  if(action==='refresh')draw();
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
 window.addEventListener('hashchange',()=>{draw();sync();});setInterval(()=>{draw();sync();},60000);draw();sync();
})();
