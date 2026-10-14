window.GFAIR_INCLUDE.footer=()=>'<footer class="footer"><span>COPYRIGHT 2026 (C) G-FAIR KOREA 구매 및 수출 상담시스템 ALL RIGHTS RESERVED.</span></footer>';

// 상대 경로로 공지사항 개발 명세 패널을 불러온다.
(()=>{const base=document.currentScript.src;const data=document.createElement('script');data.src=new URL('../data/notice-spec.js?v=sb-revision-no-gnb-20261014',base).href;data.onload=()=>{const script=document.createElement('script');script.src=new URL('spec-panel.js?v=sb-revision-no-gnb-20261014',base).href;document.head.append(script);};document.head.append(data);})();
(()=>{const script=document.createElement('script');script.src=new URL('notice-ui.js?v=notice-sb-1',document.currentScript.src).href;document.head.append(script);})();

(()=>{const script=document.createElement('script');script.src=new URL('../data/revision-history.js?v=revision-no-gnb-20261014',document.currentScript.src).href;document.head.append(script);})();
