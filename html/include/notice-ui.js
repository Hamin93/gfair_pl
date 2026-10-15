(()=>{
 const app=document.getElementById('app');if(!app)return;
 const base=document.currentScript.src,css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../css/notice-ui.css?v=notice-multi-target-20261015',base);document.head.append(css);
 const E=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const titles=['행사 운영 및 참가 안내','상담일지 작성 안내','바이어 현장 도착 및 출석 안내','상담 일정 확인 안내','통역원 사전 준비 안내','참가기업 부스 운영 안내','구매상담 진행 안내','수출상담 자료 준비 안내','행사장 이용 안내','만족도 설문 참여 안내','현장 매칭 안내','상담 후속 업무 안내'];
 let records=titles.map((title,i)=>({id:'NOTICE-'+String(i+1).padStart(3,'0'),event:i===11?'2025':'2026',category:i%2?'일반공지':'운영공지',title:title+' (예시)',target:i===8?'구매상담 운영용역사':i===10?'수출상담 운영용역사':['전체','국내바이어','해외바이어','통역원'][i%4],pinned:i<2,status:i===3||i===7?'미게시':'게시',writer:'운영 관리자 (예시)',date:'2026.10.'+String(14-i).padStart(2,'0'),period:'2026.10.01 ~ 2026.10.31',start:'2026-10-01',end:'2026-10-31',body:title+'에 관한 예시 공지입니다.\n\n행사 운영 절차와 담당 일정을 확인해 주세요.\n이 화면의 공지와 저장 동작은 기획 검토용 예시입니다.',attachment:null}));
 let criteria={target:['전체'],title:'',status:'전체'},page=1,size=10,order='desc',mode='detail',selected=null,activeNotice=false,draft=null;
 const targetOptions=['전체','국내바이어','해외바이어','통역원','구매상담 운영용역사','수출상담 운영용역사'];
 const targets=value=>Array.isArray(value)?value:value?[value]:['전체'];
 const targetText=value=>targets(value).join(', ');
 const targetPicker=(name,value)=>`<details class="notice-target-picker"><summary aria-label="대상 다중 선택"><span>${E(targetText(value))}</span><span aria-hidden="true">⌄</span></summary><div class="notice-target-options" role="group" aria-label="대상 옵션">${targetOptions.map(option=>`<label><input type="checkbox" name="${name}" value="${E(option)}"${targets(value).includes(option)?' checked':''}><span>${E(option)}</span></label>`).join('')}</div></details>`;
 records=records.map((r,i)=>({...r,target:i===1?['국내바이어','통역원']:targets(r.target)}));
 const role=()=>document.getElementById('role-picker')?.value||'admin',admin=()=>role()==='admin';
 const button=(action,text,attrs='',cls='btn')=>`<button type="button" class="${cls}" data-notice-action="${action}" ${attrs}>${E(text)}</button>`;
 const options=(values,value)=>values.map(v=>`<option value="${E(v)}"${v===value?' selected':''}>${E(v==='2026'||v==='2025'?'G-FAIR KOREA '+v:v)}</option>`).join('');
 const heading=(title,actions='')=>`<div class="pagehead"><div><nav class="breadcrumb" aria-label="현재 위치"><a href="#MON-01">홈</a><span>›</span><span>공지/알림</span><span>›</span><a href="#NTC-01">공지사항</a>${title==='공지사항'?'':`<span>›</span><span>${E(title)}</span>`}</nav><h1>${E(title)}</h1><p class="subtitle">행사 및 대상별 공지사항을 확인합니다.</p></div><div class="head-actions">${actions}</div></div>`;
 function visible(){return records.filter(r=>admin()||r.status==='게시'&&(targets(r.target).includes('전체')||targets(r.target).includes(({buyer:'국내바이어',interpreter:'통역원',buyOperator:'구매상담 운영용역사',exportOperator:'수출상담 운영용역사'})[role()])));}
 function filtered(){const event=document.getElementById('event-picker')?.value||'2026';return visible().filter(r=>r.event===event&&(targets(criteria.target).includes('전체')||targets(r.target).includes('전체')||targets(criteria.target).some(value=>targets(r.target).includes(value)))&&(!criteria.title||[r.title,r.body,r.writer].some(value=>value.toLowerCase().includes(criteria.title.toLowerCase())))&&(criteria.status==='전체'||r.status===criteria.status)).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||(order==='desc'?b.date.localeCompare(a.date):a.date.localeCompare(b.date)));}
 function list(){
  const all=filtered(),pages=Math.max(1,Math.ceil(all.length/size));page=Math.min(page,pages);
  return `<div class="notice-board" data-notice-view="list">${heading('공지사항',admin()?button('create','공지 등록','','btn primary')+'<a href="#NTC-05" class="btn">알림 발송</a>':'')}
  <form id="filter-form" class="panel filters notice-filters" data-notice-form="search"><div class="field"><span>대상</span>${targetPicker('f1',criteria.target)}</div><label class="field"><span>게시 상태</span><select name="f3">${options(['전체','게시','미게시'],criteria.status)}</select></label><label class="field"><span>통합검색</span><input type="search" name="f2" value="${E(criteria.title)}" placeholder="제목·본문·작성자를 입력해 주세요"></label><div class="row"><button type="submit" class="btn primary">검색</button>${button('reset','초기화')}</div></form>
  <section class="panel notice-panel"><div class="panelhead"><h2><strong>${all.length}</strong>건의 공지사항이 조회되었습니다.</h2><div class="row"><select id="notice-sort" aria-label="공지사항 정렬"><option value="desc"${order==='desc'?' selected':''}>등록일 내림차순</option><option value="asc"${order==='asc'?' selected':''}>등록일 오름차순</option></select><select id="notice-size" aria-label="페이지당 공지 수">${[10,30,50].map(n=>`<option value="${n}"${n===size?' selected':''}>${n}건씩 보기</option>`).join('')}</select></div></div>
  <div class="tablewrap"><table class="notice-list"><thead><tr><th>No.</th><th>공지구분</th><th class="notice-title-column">제목</th><th>대상</th><th>게시기간</th><th>작성자</th><th>등록일</th><th>게시 상태</th></tr></thead><tbody>${all.length?all.slice((page-1)*size,page*size).map((r,i)=>`<tr><td>${r.pinned?'공지':all.length-(page-1)*size-i}</td><td>${E(r.category)}</td><td><a class="notice-title" href="#NTC-04" data-notice-id="${r.id}" title="${E(r.title)}">${r.pinned?'<span aria-label="상단 공지">⌖ </span>':''}${E(r.title)}</a></td><td>${E(targetText(r.target))}</td><td>${E(r.period)}</td><td>${E(r.writer)}</td><td>${E(r.date)}</td><td><span class="badge">${r.status}</span></td></tr>`).join(''):'<tr><td colspan="8"><div class="empty"><strong>검색 결과가 없습니다.</strong>검색 조건을 변경하거나 초기화해 주세요.</div></td></tr>'}</tbody></table></div>
  <nav class="notice-pagination pagination" aria-label="공지사항 페이지">${button('page','‹',`data-page="${page-1}" ${page===1?'disabled':''}`)}${Array.from({length:pages},(_,i)=>button('page',i+1,`data-page="${i+1}" ${page===i+1?'aria-current="page"':''}`)).join('')}${button('page','›',`data-page="${page+1}" ${page===pages?'disabled':''}`)}</nav></section></div>`;
 }
 const item=()=>records.find(r=>r.id===selected);
 function detail(){const r=item();if(!r)return `${heading('공지사항 상세')}<div class="notice-board"><p>공지사항을 찾을 수 없습니다.</p>${button('back','목록')}</div>`;
  return `<div class="notice-board" data-notice-view="detail">${heading('공지사항 상세')}<section class="panel notice-panel"><dl class="notice-detail"><dt>공지구분</dt><dd>${E(r.category)}</dd><dt>상단 공지</dt><dd>${r.pinned?'예':'아니오'}</dd><dt>행사</dt><dd>G-FAIR KOREA ${r.event}</dd><dt>대상</dt><dd>${E(targetText(r.target))}</dd><dt>작성자</dt><dd>${E(r.writer)}</dd><dt>등록일</dt><dd>${E(r.date)}</dd><dt>게시 상태</dt><dd>${r.status}</dd><dt>게시기간</dt><dd>${E(r.period)}</dd><dt>제목</dt><dd class="notice-wide"><strong>${E(r.title)}</strong></dd><dt>내용</dt><dd class="notice-wide notice-body">${E(r.body)}</dd>${r.attachment?`<dt>첨부파일</dt><dd class="notice-wide"><a href="${E(r.attachment.url)}" download="${E(r.attachment.name)}">${E(r.attachment.name)}</a></dd>`:''}</dl></section><div class="notice-bottom-actions">${button('back','목록')}${admin()?button('edit','수정','','btn primary'):''}</div></div>`;
 }
 function editor(){const r=draft||{};return `<div class="notice-board" data-notice-view="${mode}">${heading('공지사항 '+(mode==='create'?'등록':'수정'))}<form data-notice-form="save" class="notice-editor"><section class="panel notice-panel"><div class="notice-form-grid">
  <label class="field"><span>행사 <span class="notice-required" role="img" aria-label="필수">*</span></span><select name="event" required>${options(['2026','2025'],r.event||'2026')}</select></label><div class="field"><span>대상 <span class="notice-required" role="img" aria-label="필수">*</span></span>${targetPicker('target',r.target||['전체'])}</div><label class="field"><span>공지구분 <span class="notice-required" role="img" aria-label="필수">*</span></span><select name="category" required><option value="">선택하세요</option>${options(['운영공지','일반공지'],r.category)}</select></label><fieldset><legend>상단 공지 <span class="notice-required" role="img" aria-label="필수">*</span></legend><label><input type="radio" name="pinned" value="yes"${r.pinned?' checked':''}> 예</label><label><input type="radio" name="pinned" value="no"${!r.pinned?' checked':''}> 아니오</label></fieldset>
  <label class="field"><span>게시 상태 <span class="notice-required" role="img" aria-label="필수">*</span></span><select name="status" required>${options(['게시','미게시'],r.status||'미게시')}</select></label><div class="field"><span>게시기간 <span class="notice-required" role="img" aria-label="필수">*</span></span><div class="notice-dates"><input type="date" name="start" required aria-label="게시 시작일" value="${E(r.start)}"><span>~</span><input type="date" name="end" required aria-label="게시 종료일" value="${E(r.end)}"></div></div>
  <label class="field wide"><span>제목 <span class="notice-required" role="img" aria-label="필수">*</span></span><input name="title" required maxlength="200" value="${E(r.title)}" placeholder="제목을 입력해 주세요"></label><label class="field wide"><span>내용 <span class="notice-required" role="img" aria-label="필수">*</span></span><textarea class="notice-editor-body" name="body" required placeholder="내용을 입력해 주세요">${E(r.body)}</textarea></label><div class="field wide"><label for="notice-file">첨부파일</label><input id="notice-file" type="file" accept=".jpg,.png,.bmp,.zip,.hwp,.doc,.xls,.ppt,.pdf"><p class="small">파일 1개, 10MB 이하 · jpg, png, bmp, zip, hwp, doc, xls, ppt, pdf</p><div id="notice-file-info">${r.attachment?`${E(r.attachment.name)} ${button('remove-file','첨부 삭제')}`:'선택된 파일 없음'}</div></div></div></section><div class="notice-bottom-actions">${button('cancel','취소')}<button type="submit" class="btn primary">저장</button></div><p class="small notice-save-note">저장한 예시 공지는 현재 열린 화면에서만 유지됩니다.</p></form></div>`;}
 function route(){return decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen;}
 function render(){const current=route(),main=app.querySelector('main');if(!main)return;if(current==='NTC-01'){activeNotice=true;if(main.querySelector('.notice-board'))return;main.innerHTML=list();}else if(current==='NTC-04'&&activeNotice){if(main.querySelector('.notice-board'))return;main.innerHTML=mode==='detail'?detail():editor();}else activeNotice=false;}
 function refresh(){const main=app.querySelector('main');if(main){main.querySelector('.notice-board')?.remove();}render();}
 function gotoDetail(){if(route()==='NTC-04')refresh();else location.hash='NTC-04';}
 document.addEventListener('click',e=>{
  const link=e.target.closest('[data-notice-id]'),b=e.target.closest('[data-notice-action]');if(!link&&!b)return;e.preventDefault();e.stopImmediatePropagation();
  if(link){selected=link.dataset.noticeId;mode='detail';activeNotice=true;gotoDetail();return;}
  switch(b.dataset.noticeAction){
   case 'create':mode='create';draft={event:document.getElementById('event-picker')?.value||'2026',target:['전체'],pinned:false,status:'미게시'};gotoDetail();break;
   case 'edit':mode='edit';draft={...item()};refresh();break;
   case 'back':mode='detail';location.hash='NTC-01';break;
   case 'cancel':if(confirm('입력을 취소하고 이전 화면으로 돌아갈까요?')){if(mode==='create')location.hash='NTC-01';else{mode='detail';refresh();}}break;
   case 'reset':criteria={target:['전체'],title:'',status:'전체'};page=1;refresh();break;
   case 'page':page=Number(b.dataset.page);refresh();break;
   case 'remove-file':draft.attachment=null;document.getElementById('notice-file-info').textContent='선택된 파일 없음';document.getElementById('notice-file').value='';break;
  }
 },true);
 document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset.noticeForm)return;e.preventDefault();e.stopImmediatePropagation();const data=new FormData(f);
  if(f.dataset.noticeForm==='search'){criteria={target:data.getAll('f1'),title:String(data.get('f2')).trim(),status:data.get('f3')};page=1;refresh();return;}
  if(!admin()||!f.reportValidity())return;
  if(!String(data.get('title')).trim()||!String(data.get('body')).trim()){alert('제목과 내용을 입력해 주세요.');return;}
  if(data.get('start')&&data.get('end')&&data.get('start')>data.get('end')){alert('게시 종료일은 시작일보다 빠를 수 없습니다.');return;}
  const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).replace(/-/g,'.');
  const r={...draft,event:data.get('event'),target:data.getAll('target'),category:data.get('category'),pinned:data.get('pinned')==='yes',status:data.get('status'),title:String(data.get('title')).trim(),body:String(data.get('body')).trim(),start:data.get('start'),end:data.get('end'),period:data.get('start')||data.get('end')?`${data.get('start')||'미등록'} ~ ${data.get('end')||'미등록'}`:'기간 미등록'};
  if(mode==='create'){r.id='NOTICE-'+Date.now();r.writer='운영 관리자 (예시)';r.date=date;records.unshift(r);}else records=records.map(old=>old.id===selected?r:old);
  selected=r.id;mode='detail';refresh();
 },true);
 document.addEventListener('change',e=>{
  const picker=e.target.closest('.notice-target-picker');
  if(picker&&e.target.type==='checkbox'){
   const inputs=Array.from(picker.querySelectorAll('input')),all=inputs[0];
   if(e.target.value==='전체'&&e.target.checked)inputs.slice(1).forEach(input=>input.checked=false);
   else if(e.target.checked)all.checked=false;
   if(!inputs.some(input=>input.checked))all.checked=true;
   const chosen=inputs.filter(input=>input.checked).map(input=>input.value);picker.querySelector('summary>span').textContent=chosen.join(', ');
  }
  if(e.target.id==='notice-sort'){order=e.target.value;page=1;refresh();}if(e.target.id==='notice-size'){size=Number(e.target.value);page=1;refresh();}if(e.target.id==='notice-file'){const file=e.target.files[0];if(!file)return;if(file.size>10*1024*1024||!/\.(jpg|png|bmp|zip|hwp|doc|xls|ppt|pdf)$/i.test(file.name)){alert('허용 확장자의 10MB 이하 파일 1개를 선택해 주세요.');e.target.value='';return;}draft.attachment={name:file.name,url:URL.createObjectURL(file)};document.getElementById('notice-file-info').textContent=file.name;}},true);
 document.addEventListener('click',event=>{app.querySelectorAll('.notice-target-picker[open]').forEach(picker=>{if(!picker.contains(event.target))picker.open=false;});});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')app.querySelectorAll('.notice-target-picker[open]').forEach(picker=>{picker.open=false;picker.querySelector('summary').focus();});});
 new MutationObserver(render).observe(app,{childList:true,subtree:true});window.addEventListener('hashchange',render);render();
})();
