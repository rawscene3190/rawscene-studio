document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.querySelector('.menu-btn'); const nav=document.querySelector('.nav');
  if(btn&&nav){btn.addEventListener('click',()=>nav.classList.toggle('open'))}
  const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')})},{threshold:.12});
  document.querySelectorAll('.fade').forEach(el=>io.observe(el));
});
