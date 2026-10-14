window.GFAIR_INCLUDE.footer=()=>'<footer class="footer"><span>COPYRIGHT 2026 (C) G-FAIR KOREA 구매 및 수출 상담시스템 ALL RIGHTS RESERVED.</span></footer>';

// 상대 경로로 공지사항 개발 명세 패널을 불러온다.
(()=>{const base=document.currentScript.src;const data=document.createElement('script');data.src=new URL('../data/notice-spec.js?v=sheet-restored-20261014',base).href;data.onload=()=>{const reader=document.createElement('script');reader.src=new URL('sheet-spec.js?v=sheet-restored-20261014',base).href;reader.onload=reader.onerror=()=>{const script=document.createElement('script');script.src=new URL('spec-panel.js?v=sheet-restored-20261014',base).href;document.head.append(script);};document.head.append(reader);};document.head.append(data);})();
(()=>{const script=document.createElement('script');script.src=new URL('notice-ui.js?v=notice-sb-1',document.currentScript.src).href;document.head.append(script);})();

(()=>{const script=document.createElement('script');script.onload=()=>window.dispatchEvent(new Event('revision-history-loaded'));script.src=new URL('../data/revision-history.js?v=sheet-restored-20261014',document.currentScript.src).href;document.head.append(script);})();
