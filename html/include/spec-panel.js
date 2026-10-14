(()=>{
 const app=document.getElementById('app');
 if(!app)return;
 const base=new URL('.',document.currentScript.src);
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../css/spec-panel.css?v=notice-spec-2',base);document.head.append(css);
 const specs=[
  ['화면 개요','행사 운영 안내와 이용 공지를 행사·대상 역할별로 조회한다. 공지 게시와 알림 발송은 별도 작업이다.','화면 ID: NTC-01 · 공지사항'],
  ['검색 조건','행사, 대상 역할, 제목, 게시 상태로 조회한다. 제목은 입력어를 포함하는 공지를 검색한다. 일반 사용자의 조회 범위는 본인 행사·역할로 제한하는 설계다.','기본값: 전체 / 제목 빈 값. 기본 행사와 게시 상태 옵션은 협의 필요.'],
  ['검색·초기화','검색하면 조건에 맞는 목록을 표시한다. 초기화하면 검색 조건을 기본값으로 되돌린다. 결과가 없으면 검색 결과 없음과 조건 초기화 안내를 표시한다.','입력: 검색 조건은 선택 항목. 새로고침으로 사용자 입력을 임의로 변경하지 않는다.'],
  ['공지 목록·상세','공지구분, 제목, 대상, 게시기간, 작성일, 상태를 표시한다. 조회 버튼으로 선택 공지의 상세를 확인하고 목록 복귀 시 검색 조건을 유지하도록 설계한다.','상세 항목: 제목·본문·첨부파일·게시기간. 정렬 기준과 첨부 제한은 협의 필요.'],
  ['공지 등록·수정','관리자에게만 등록·수정·게시 작업을 허용하는 설계다. 제목·본문·대상 역할을 필수로 입력한다. 기간을 입력한 경우 종료일이 시작일보다 빠르면 저장을 제한한다.','등록 화면: NTC-04. 실제 서버 저장·권한 검증은 연결하지 않는다.'],
  ['알림 발송','발송 권한이 있는 관리자가 NTC-05에서 대상과 내용을 확인한다. 게시와 발송은 분리한다. 목업에서는 실제 문자나 알림을 보내지 않고 예시 동작임을 안내한다.','성공·실패 및 재발송 정책: 협의 필요. 실제 SMS 미구현.'],
  ['게시 상태·전환','준비·게시·종료 등의 최종 상태값, 의미, 변경 주체와 게시기간에 따른 자동 전환 여부를 확정해야 한다. 사용자에게는 게시 조건에 맞는 공지만 노출하는 설계다.','협의 필요: 기간 미입력 정책, 자동 전환, 삭제·종료 권한.'],
  ['역할별 권한','관리자: 공지 작성·수정·게시 및 승인된 대상에게 알림 발송. 일반 사용자: 본인 행사·역할에 해당하는 게시 공지 조회. 운영용역사의 작성 범위는 협의 필요하다.','현재 목업 차이: 일반 역할에도 등록·발송 버튼이 보이며 게시 상태에 공지와 무관한 옵션이 있다. 명세 패널은 기능이나 권한을 변경하지 않는다.'],
  ['긴급 공지·입력 보호','긴급 공지는 NTC-06 팝업과 연결하는 설계다. 상담일지 작성 중 수신 시 작성 내용을 보호하고 공지를 안내해야 한다.','협의 필요: 우선 노출·확인 강제 기준. 실제 수신·서버 동기화 미구현.']
 ];
 const toolbar=document.createElement('div');toolbar.className='ui-spec-toolbar';toolbar.hidden=true;
 toolbar.innerHTML='<strong>WITH / UI SPEC</strong><label>검토 역할 <select aria-label="명세 검토 역할"></select></label><button type="button" data-spec="refresh">명세 새로고침</button><label><input type="checkbox" data-spec="auto"> 자동 갱신</label><button type="button" data-spec="numbers">번호 숨기기</button><button type="button" data-spec="full">명세 전체보기</button><button type="button" data-spec="close">개발 명세 닫기</button><span class="ui-spec-status" role="status"></span>';
 const layout=document.createElement('div');layout.className='ui-spec-layout';app.before(toolbar,layout);layout.append(app);
 const panel=document.createElement('aside');panel.className='ui-spec-panel';panel.setAttribute('aria-label','공지사항 개발 명세');panel.hidden=true;layout.append(panel);
 let closed=false,full=false,numbers=true,timer=null;
 const status=toolbar.querySelector('.ui-spec-status');
 function draw(){
  panel.replaceChildren();
  const heading=document.createElement('h2');heading.textContent='공지사항 개발 명세';panel.append(heading);
  const intro=document.createElement('p');intro.className='ui-spec-intro';intro.textContent='NTC-01 · 검토용 명세 초안 · 외부 시트 미연결';panel.append(intro);
  specs.forEach(([title,description,note],i)=>{
   const card=document.createElement('details');card.id='notice-spec-'+(i+1);card.className='ui-spec-card';card.open=i===0;
   const summary=document.createElement('summary');summary.textContent=String(i+1).padStart(2,'0')+' '+title;
   const body=document.createElement('p');body.textContent=description;const foot=document.createElement('p');foot.className='ui-spec-note';foot.textContent=note;card.append(summary,body,foot);panel.append(card);
  });
  status.textContent='명세 확인 '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit'}).format(new Date());
 }
 function sync(){
  const route=decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen;
  const active=route==='NTC-01';toolbar.hidden=!active;panel.hidden=!active||closed;
  layout.classList.toggle('with-spec',active&&!closed);layout.classList.toggle('spec-full',active&&!closed&&full);
  toolbar.querySelector('[data-spec=close]').textContent=closed?'개발 명세 열기':'개발 명세 닫기';
  toolbar.querySelector('[data-spec=full]').textContent=full&&!closed?'목업과 함께 보기':'명세 전체보기';
  toolbar.querySelector('[data-spec=numbers]').textContent=numbers?'번호 숨기기':'번호 표시';
  const role=document.getElementById('role-picker'),select=toolbar.querySelector('select');
  if(role){if(!select.options.length)select.innerHTML=role.innerHTML;select.value=role.value;}
  const targets=[['.pagehead',1],['#filter-form',2],['#filter-form .row',3],['.tablewrap',4],['.head-actions',5],['.tablefoot',7]];
  targets.forEach(([selector,id])=>{
   const target=app.querySelector(selector);if(!target)return;
   let pin=target.querySelector(':scope > .ui-spec-pin');
   if(active&&!closed&&numbers){if(!pin){pin=document.createElement('button');pin.type='button';pin.className='ui-spec-pin';pin.textContent=id;pin.setAttribute('aria-label','개발 명세 '+id+'번 보기');pin.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();panel.querySelectorAll('.ui-spec-card').forEach(c=>c.classList.remove('selected'));const card=document.getElementById('notice-spec-'+id);card.open=true;card.classList.add('selected');card.scrollIntoView({block:'nearest',behavior:'smooth'});card.querySelector('summary').focus();});target.classList.add('ui-spec-marked');target.append(pin);}}
   else if(pin){pin.remove();target.classList.remove('ui-spec-marked');}
  });
 }
 toolbar.addEventListener('click',event=>{
  const action=event.target.dataset.spec;
  if(action==='refresh')draw();
  if(action==='numbers')numbers=!numbers;
  if(action==='full'){closed=false;full=!full;}
  if(action==='close'){closed=!closed;full=false;}
  sync();
 });
 toolbar.addEventListener('change',event=>{
  if(event.target.tagName==='SELECT'){
   const role=document.getElementById('role-picker'),form=document.getElementById('filter-form');
   const values=form?Array.from(new FormData(form)):[];
   if(role){role.value=event.target.value;role.dispatchEvent(new Event('change',{bubbles:true}));}
   if(location.hash!=='#NTC-01')location.hash='NTC-01';
   requestAnimationFrame(()=>{
    const next=document.getElementById('filter-form');
    if(next)values.forEach(([name,value])=>{const field=next.elements.namedItem(name);if(field&&(!(field instanceof HTMLSelectElement)||Array.from(field.options).some(o=>o.value===value)))field.value=value;});
   });
  }
  if(event.target.dataset.spec==='auto'){clearInterval(timer);timer=event.target.checked?setInterval(()=>{if(!panel.hidden)draw();},60000):null;}
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&full){full=false;sync();}});
 new MutationObserver(sync).observe(app,{childList:true,subtree:true});
 window.addEventListener('hashchange',sync);draw();sync();
})();
