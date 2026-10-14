(()=>{
 const config={id:'11ta8oBialEa6NBmHdngQXZFjLCD9ouPmQ_GJBAb78RE',gid:'1462369663',screen:'NTC-01'};
 let sequence=0;
 function normalize(table){
  const headers=table.cols.map(c=>String(c.label||c.id).replace(/\s/g,''));
  const missing=['화면ID','번호','항목명','요소유형','설명','기본값','필수여부'].filter(h=>!headers.includes(h));
  if(missing.length)throw Error('필수 열 누락: '+missing.join(', '));
  const rows=table.rows.map(row=>Object.fromEntries(headers.map((name,i)=>[name,String(row.c[i]?.f??row.c[i]?.v??'')]))).filter(row=>row.화면ID.trim()===config.screen);
  if(!rows.length)throw Error('화면요소 시트에 NTC-01 행을 추가해 주세요.');
  const numbers=new Set();return rows.map(row=>{
   const text=row.번호.trim(),number=Number(text);
   if(!/^\d+$/.test(text)||number<1||numbers.has(number))throw Error('번호가 비어 있거나 중복·유효하지 않습니다.');
   numbers.add(number);if(!row.항목명.trim())throw Error(text+'번 항목명이 비어 있습니다.');
   return {number,title:row.항목명,type:row.요소유형,description:row.설명,defaultValue:row.기본값,required:row.필수여부,note:''};
  }).sort((a,b)=>a.number-b.number);
 }
 function read(){return new Promise((resolve,reject)=>{
  const name='__gfairSheetSpec'+(++sequence),script=document.createElement('script');let timeout;
  const clean=()=>{clearTimeout(timeout);script.remove();delete window[name];};
  window[name]=result=>{clean();try{if(result.status==='error'||!result.table)throw Error('시트 응답을 읽을 수 없습니다.');resolve(normalize(result.table));}catch(error){reject(error);}};
  script.onerror=()=>{clean();reject(Error('시트 읽기 권한 또는 네트워크를 확인해 주세요.'));};
  timeout=setTimeout(()=>{clean();reject(Error('시트 응답 시간이 초과됐습니다.'));},18000);
  const url=new URL('https://docs.google.com/spreadsheets/d/'+config.id+'/gviz/tq');
  url.searchParams.set('gid',config.gid);url.searchParams.set('headers','1');url.searchParams.set('tq','select *');url.searchParams.set('tqx','out:json;responseHandler:'+name);url.searchParams.set('_',Date.now());
  script.src=url.href;script.referrerPolicy='no-referrer';document.head.append(script);
 });}
 window.GFAIR_SPEC_SHEET={read,normalize,config};
})();
