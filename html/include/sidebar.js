window.GFAIR_INCLUDE=window.GFAIR_INCLUDE||{};
window.GFAIR_INCLUDE.sidebar=({s,role,event,info,escape:E})=>{
 const tree=window.GFAIR_NAV.visible(role).filter(g=>!['로그인','알림'].includes(g.name)),active=info?.owner;
 const link=([id,label])=>`<a href="#${id}" class="${active===id?'active':''}" ${active===id?'aria-current="page"':''}>${E(label)}</a>`;
 return `<aside class="sidebar"><a class="brand" href="#MON-01">G<span>·</span>FAIR<small>KOREA</small></a><div class="caption">구매 및 수출 상담시스템</div><nav aria-label="사이트맵 메뉴">${tree.map(g=>`<details class="nav-group" ${g.name===info?.g.name?'open':''}><summary class="${g.name===info?.g.name?'active':''}"><span class="icon"><i data-lucide="${g.icon}" aria-hidden="true"></i></span><span>${E(g.name)}</span><span class="nav-chevron" aria-hidden="true">⌄</span></summary><div class="nav-children">${g.items.map(i=>i[2].length?`<details class="nav-second" ${active===i[0]||i[2].some(c=>c[0]===active)?'open':''}><summary><span>${E(i[1])}</span><span class="nav-chevron" aria-hidden="true">⌄</span></summary><div class="nav-third">${i[2].map(link).join('')}</div></details>`:link(i)).join('')}</div></details>`).join('')}</nav><div class="profile"><span class="avatar">운</span><div>${E({admin:'운영 관리자',buyOperator:'구매상담 운영용역사',exportOperator:'수출상담 운영용역사',buyer:'국내바이어',interpreter:'통역원'}[role])}<small>G-FAIR KOREA ${E(event)}</small></div></div></aside>`;
};
// 한 단계에서 한 메뉴만 펼쳐 전체 높이를 줄인다.
document.addEventListener('toggle',event=>{
 const current=event.target;
 if(!current.matches?.('.sidebar details')||!current.open)return;
 for(const sibling of current.parentElement.children){if(sibling!==current&&sibling.tagName==='DETAILS')sibling.open=false;}
},true);
