window.GFAIR_INCLUDE.footer=()=>'<footer class="footer"><span>G-FAIR KOREA 구매 및 수출 상담시스템</span><span>HTML v2.0 · 2026.10.08 · with</span></footer>';

// 상대 경로로 공지사항 개발 명세 패널을 불러온다.
(()=>{const base=document.currentScript.src;const data=document.createElement('script');data.src=new URL('../data/notice-spec.js?v=sb-toolbar-20261014-3',base).href;data.onload=()=>{const script=document.createElement('script');script.src=new URL('spec-panel.js?v=sb-toolbar-20261014-3',base).href;document.head.append(script);};document.head.append(data);})();
(()=>{const script=document.createElement('script');script.src=new URL('notice-ui.js?v=notice-sb-1',document.currentScript.src).href;document.head.append(script);})();
