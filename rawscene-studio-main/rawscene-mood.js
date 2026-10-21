document.addEventListener('DOMContentLoaded',()=>{
  const fades=document.querySelectorAll('.fade');
  const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')})},{threshold:.12});
  fades.forEach(el=>io.observe(el));
  const lb=document.createElement('div'); lb.className='lightbox'; lb.innerHTML='<button aria-label="close">Close</button><img alt="RAWSCENE preview">'; document.body.appendChild(lb);
  const img=lb.querySelector('img'); const close=lb.querySelector('button');
  document.querySelectorAll('[data-lightbox]').forEach(el=>el.addEventListener('click',()=>{img.src=el.dataset.src||'';lb.classList.add('open')}));
  close.addEventListener('click',()=>lb.classList.remove('open')); lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open')});
  document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>{document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active')); chip.classList.add('active'); const f=chip.dataset.filter; document.querySelectorAll('[data-category]').forEach(item=>{item.style.display=(f==='all'||item.dataset.category===f)?'block':'none'})}))
});
