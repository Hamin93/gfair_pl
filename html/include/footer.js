window.GFAIR_INCLUDE.footer=()=>'<footer class="footer"><span>COPYRIGHT 2026 (C) G-FAIR KOREA 구매 및 수출 상담시스템 ALL RIGHTS RESERVED.</span></footer>';

// 상대 경로로 공지사항 개발 명세 패널을 불러온다.
(()=>{const base=document.currentScript.src;const data=document.createElement('script');data.src=new URL('../data/notice-spec.js?v=notice-category-date-20261015',base).href;data.onload=()=>{const detailData=document.createElement('script');detailData.src=new URL('../data/notice-detail-spec.js?v=notice-category-date-20261015',base).href;detailData.onload=()=>{const reader=document.createElement('script');reader.src=new URL('sheet-spec.js?v=notice-category-date-20261015',base).href;reader.onload=reader.onerror=()=>{const script=document.createElement('script');script.src=new URL('spec-panel.js?v=notice-category-date-20261015',base).href;document.head.append(script);};document.head.append(reader);};document.head.append(detailData);};document.head.append(data);})();
(()=>{const script=document.createElement('script');script.src=new URL('notice-ui.js?v=notice-category-date-20261015',document.currentScript.src).href;document.head.append(script);})();

(()=>{const script=document.createElement('script');script.onload=()=>window.dispatchEvent(new Event('revision-history-loaded'));script.src=new URL('../data/revision-history.js?v=notice-category-date-20261015',document.currentScript.src).href;document.head.append(script);})();
// 목록 본문은 가운데 정렬, 긴 텍스트 열은 왼쪽 정렬한다.
(()=>{
 const app=document.getElementById('app');if(!app)return;
 const alignLists=()=>app.querySelectorAll('table').forEach(table=>{
  const headers=Array.from(table.querySelectorAll('thead tr:last-child>th'));
  const longColumns=headers.map(header=>/제목|내용|설명|사유|주소|비고|메모/.test(header.textContent));
  table.querySelectorAll('tbody>tr').forEach(row=>Array.from(row.children).forEach((cell,index)=>{
   cell.classList.toggle('list-text-left',cell.colSpan===1&&!!longColumns[index]);
  }));
 });
 new MutationObserver(alignLists).observe(app,{childList:true,subtree:true});alignLists();
})();
