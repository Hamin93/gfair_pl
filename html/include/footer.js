window.GFAIR_INCLUDE.footer=()=>'<footer class="footer"><span>G-FAIR KOREA 구매 및 수출 상담시스템</span><span>HTML v2.0 · 2026.10.08 · with</span></footer>';

// 공통 본문 하단에 기존 화면 코드를 표시한다. 화면 전환과 역할 변경에도 갱신한다.
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
   label.setAttribute('aria-label','화면 ID');
   host.append(label);
  }
  const text='화면 ID: '+id;
  if(label.textContent!==text)label.textContent=text;
 };
 if(app){new MutationObserver(showScreenId).observe(app,{childList:true,subtree:true});showScreenId();}
})();
