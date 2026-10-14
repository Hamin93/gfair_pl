(()=>{
 const app=document.getElementById('app');if(!app)return;
 const clear=()=>app.querySelectorAll('.ui-spec-range-selected').forEach(el=>el.classList.remove('ui-spec-range-selected'));
 document.addEventListener('click',event=>{
  const pin=event.target.closest?.('.ui-spec-pin');if(!pin||!app.contains(pin))return;
  clear();const target=pin.parentElement;if(target)target.classList.add('ui-spec-range-selected');
 },true);
 document.addEventListener('keydown',event=>{if(event.key==='Escape')clear();});
 window.addEventListener('hashchange',clear);
})();
