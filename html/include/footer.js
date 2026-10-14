window.GFAIR_INCLUDE.footer=()=>'<footer class="footer"><span>G-FAIR KOREA 구매 및 수출 상담시스템</span><span>HTML v2.0 · 2026.10.08 · with</span></footer>';

// 공통 본문 상단 왼쪽에 화면 ID 복사 버튼을 표시한다.
(()=>{
 const app=document.getElementById('app');
 const showScreenId=()=>{
  const main=app.querySelector('main');
  if(!main)return;
  const route=decodeURIComponent(location.hash.slice(1))||document.body.dataset.screen||'MON-01';
  const id=route==='screens'?'SCREEN-LIST':route;
  const host=main.classList.contains('login-form')?(main.firstElementChild||main):main;
  let label=main.querySelector('.screen-reference');
  if(!label){
   label=document.createElement('div');
   label.className='screen-reference';
   const button=document.createElement('button');
   button.type='button';
   button.className='screen-reference-button';
   button.title='클릭하면 화면 ID를 복사합니다.';
   button.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(button.dataset.screenId);button.title='화면 ID를 복사했습니다.';}
    catch{button.title='복사할 화면 ID: '+button.dataset.screenId;}
   });
   label.append(button);
   host.prepend(label);
  }
  const text='화면 ID: '+id;
  const button=label.querySelector('button');
  button.dataset.screenId=id;
  if(button.textContent!==text)button.textContent=text;
 };
 if(app){new MutationObserver(showScreenId).observe(app,{childList:true,subtree:true});showScreenId();}
})();

// 상대 경로로 공지사항 개발 명세 패널을 불러온다.
(()=>{const script=document.createElement('script');script.src=new URL('spec-panel.js?v=notice-spec-2',document.currentScript.src).href;document.head.append(script);})();
