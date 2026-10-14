(()=>{
 const config={id:'11ta8oBialEa6NBmHdngQXZFjLCD9ouPmQ_GJBAb78RE',gid:'214103993',screen:'NTC-01'};
 let sequence=0;
 function normalize(table){
  const blocks={};let block=null,header=null;
  for(const row of table.rows){
   const values=row.c.map(cell=>String(cell?.f??cell?.v??''));
   if(values[0]?.startsWith('# ')){block=values[0].slice(2).trim();header=null;blocks[block]={headers:[],rows:[]};continue;}
   if(!block||!values.some(v=>v.trim()))continue;
   if(!header){header=values.filter(v=>v.trim());blocks[block].headers=header;continue;}
   blocks[block].rows.push(values.slice(0,header.length));
  }
  const elements=blocks['화면요소'];
  const expected=['번호','항목명','요소 유형','기본값','필수여부','개요 설명','상세 설명','정책 설명'];
  if(!elements||expected.some(h=>!elements.headers.includes(h)))throw Error('화면요소 표 또는 열 제목을 확인해 주세요.');
  const seen=new Set(),specs=elements.rows.map(values=>{
   const r=Object.fromEntries(elements.headers.map((h,i)=>[h,values[i]||''])),number=Number(r['번호']);
   if(!/^\d+$/.test(r['번호'])||number<1||seen.has(number)||!r['항목명'].trim())throw Error('번호 중복·누락 또는 빈 항목명을 확인해 주세요.');
   seen.add(number);return {number,title:r['항목명'],type:r['요소 유형'],defaultValue:r['기본값'],required:r['필수여부'],summary:r['개요 설명'],description:r['상세 설명'],policyDescription:r['정책 설명'],detailTables:[]};
  }).sort((a,b)=>a.number-b.number);
  if(!specs.length)throw Error('화면요소 명세가 비어 있습니다.');
  for(const name of ['선택 옵션','상태 정의','상태 전환','버튼 동작']){
   const section=blocks[name];if(!section)throw Error(name+' 표를 확인해 주세요.');
   for(const row of section.rows){
    const number=Number(row[0]),spec=specs.find(s=>s.number===number);if(!spec)throw Error(name+'에 연결되지 않은 번호가 있습니다.');
    const offset=name==='선택 옵션'?2:1,title=name==='선택 옵션'?row[1]:name;
    let detail=spec.detailTables.find(t=>t.title===title);if(!detail){detail={title,headers:section.headers.slice(offset),rows:[]};spec.detailTables.push(detail);}
    detail.rows.push(row.slice(offset));
   }
  }
  const accessBlock=blocks['사용자별 권한'];if(!accessBlock)throw Error('사용자별 권한 표를 확인해 주세요.');
  const access=accessBlock.rows.map(row=>({role:row[0],scope:row[1],policy:row[2]}));
  return {specs,access};
 }
 function read(){return new Promise((resolve,reject)=>{
  const name='__gfairSheet'+(++sequence),script=document.createElement('script');let timeout;
  const clean=()=>{clearTimeout(timeout);script.remove();delete window[name];};
  window[name]=result=>{clean();try{if(result.status==='error'||!result.table)throw Error('시트 응답을 읽을 수 없습니다.');resolve(normalize(result.table));}catch(e){reject(e);}};
  script.onerror=()=>{clean();reject(Error('시트 읽기 권한 또는 네트워크를 확인해 주세요.'));};
  timeout=setTimeout(()=>{clean();reject(Error('시트 응답 시간이 초과되었습니다.'));},18000);
  const url=new URL('https://docs.google.com/spreadsheets/d/'+config.id+'/gviz/tq');
  url.searchParams.set('gid',config.gid);url.searchParams.set('headers','0');url.searchParams.set('tq','select *');url.searchParams.set('tqx','out:json;responseHandler:'+name);url.searchParams.set('_',Date.now());
  script.src=url.href;script.referrerPolicy='no-referrer';document.head.append(script);
 });}
 window.GFAIR_SPEC_SHEET={config,normalize,read};
})();
