/* Presentation only. Booking data and Firebase operations remain in their original modules. */
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.site-menu');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => { if (!menu || !nav) return; nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.textContent = 'Menu'; };
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); menu.textContent = open ? 'Close' : 'Menu'; });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  const photos = [['home-hero.jpg','로우씬 메인 공간 전경'],['home-indoor.jpg','로우씬 실내 공간'],['home-outdoor.jpg','로우씬 야외 공간']];
  let photo = 0;
  document.querySelector('#next-photo')?.addEventListener('click', () => { photo = (photo+1)%photos.length; const img = document.querySelector('#hero-img'); img.src = 'images/'+photos[photo][0]; img.alt = photos[photo][1]; document.querySelector('#photo-count').textContent = String(photo+1).padStart(2,'0')+' — 03'; });
  const buttons = Array.from(document.querySelectorAll('.gallery-button'));
  const lightbox = document.querySelector('.gallery-lightbox');
  if (buttons.length && lightbox) {
    let index = 0; let opener = null; let startX = null;
    const image = lightbox.querySelector('.lightbox-image');
    const counter = lightbox.querySelector('.lightbox-counter');
    const controls = Array.from(lightbox.querySelectorAll('button'));
    lightbox.setAttribute('role','dialog'); lightbox.setAttribute('aria-modal','true'); lightbox.setAttribute('aria-label','사진 크게 보기');
    const show = i => { index = (i+buttons.length)%buttons.length; const source = buttons[index].querySelector('img'); image.src = source.src; image.alt = source.alt; counter.textContent = String(index+1).padStart(2,'0')+' / '+String(buttons.length).padStart(2,'0'); };
    const close = () => { lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden','true'); document.body.classList.remove('lightbox-open'); opener?.focus(); };
    buttons.forEach((b,i) => b.addEventListener('click', () => { opener=b; show(i); lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden','false'); document.body.classList.add('lightbox-open'); controls[0]?.focus(); }));
    lightbox.querySelector('.lightbox-close').addEventListener('click',close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>show(index-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click',()=>show(index+1));
    lightbox.addEventListener('click',e=>{ if(e.target===lightbox || e.target.classList.contains('lightbox-image-wrap'))close(); });
    document.addEventListener('keydown',e=>{ if(!lightbox.classList.contains('is-open'))return; if(e.key==='Escape')close(); if(e.key==='ArrowRight')show(index+1); if(e.key==='ArrowLeft')show(index-1); if(e.key==='Tab'){const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}} });
    lightbox.addEventListener('touchstart',e=>{startX=e.changedTouches[0].screenX;},{passive:true});
    lightbox.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].screenX-startX;if(Math.abs(dx)>55)show(index+(dx>0?-1:1));startX=null;},{passive:true});
  }
  // Mobile schedule: derive display details from the already-rendered calendar.
  // No extra database access or booking writes are introduced.
  const grid = document.querySelector('#calendarGrid');
  const details = document.querySelector('.schedule-details');
  if (grid && details) {
    let selected = null;
    const text = (tag,value,cls) => { const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el; };
    const showDay = cell => {
      selected=cell.querySelector('.date-number').textContent;
      grid.querySelectorAll('.calendar-cell').forEach(c=>{c.classList.toggle('is-selected',c===cell);if(!c.classList.contains('empty'))c.setAttribute('aria-pressed',String(c===cell));});
      details.replaceChildren();
      details.append(text('h3',document.querySelector('#monthTitle').textContent+' · '+selected+'일'));
      if(document.querySelector('#errorState').style.display==='block'){details.append(text('p','예약 현황을 불러오지 못했습니다. 새로고침 후 다시 확인해주세요.'));return;}
      if(document.querySelector('#loadingState').style.display!=='none'){details.append(text('p','예약 현황을 불러오는 중입니다.'));return;}
      const chips=cell.querySelectorAll('.booking-chip');
      if(!chips.length)details.append(text('p','현재 표시된 확정 예약이 없습니다. 예약 페이지에서 시간을 선택해주세요.'));
      chips.forEach(chip=>{details.append(text('p',chip.querySelector('.booking-time')?.textContent||'예약 시간','detail-time'));details.append(text('p',chip.querySelector('.booking-user')?.textContent||'확정 예약'));});
    };
    const update = () => {
      const cells=Array.from(grid.querySelectorAll('.calendar-cell:not(.empty)'));
      cells.forEach(cell=>{const d=cell.querySelector('.date-number');cell.setAttribute('role','button');cell.setAttribute('tabindex','0');cell.setAttribute('aria-label',d.textContent+'일 '+(cell.classList.contains('booked')?'확정 예약 있음':'일정 확인'));cell.onclick=()=>showDay(cell);cell.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showDay(cell);}};});
      const cell=cells.find(c=>c.querySelector('.date-number').textContent===selected)||cells.find(c=>c.classList.contains('today'))||cells[0];
      if(cell)showDay(cell);else details.replaceChildren(text('p','일정을 불러오는 중입니다.'));
    };
    new MutationObserver(update).observe(grid,{childList:true});
    new MutationObserver(update).observe(document.querySelector('#errorState'),{attributes:true,attributeFilter:['style']});
    document.querySelectorAll('#prevMonth,#nextMonth').forEach(b=>b.addEventListener('click',()=>{selected=null;}));
    update();
  }
});

/* Mobile administrator entry, shared across all public pages. */
(() => {
  const mountMobileAdmin = () => {
    const header = document.querySelector('.site-header');
    if (!header || header.querySelector('.rs-mobile-admin')) return;
    const style = document.createElement('style');
    style.textContent = `
      body .site-header .rs-mobile-admin { display:none; }
      @media (max-width:760px) {
        body .site-header { position:relative!important; overflow:visible!important; }
        body .site-header .rs-admin-entry { display:none!important; }
        body .site-header .rs-mobile-admin {
          display:inline-flex!important; align-items:center; justify-content:center;
          gap:6px; position:absolute!important; right:88px; top:22px;
          min-height:44px; padding:0 9px; margin:0!important;
          visibility:visible!important; opacity:1!important;
          color:#454d3f!important; background:#fff; border:1px solid #e1e5dc;
          font-size:11px!important; line-height:1.4; text-decoration:none;
          white-space:nowrap; z-index:102; border-radius:3px;
        }
        body .site-header .rs-mobile-admin svg { width:15px; height:15px; flex:none; }
        body .site-header .site-menu { margin-left:auto!important; }
        body .site-header .rs-mobile-admin:focus-visible {outline:2px solid #77826b;outline-offset:3px;}
      }
    `;
    document.head.append(style);
    const link = document.createElement('a');
    link.className = 'rs-mobile-admin';
    link.href = 'admin.html';
    link.setAttribute('aria-label','관리자 페이지 — 예약 확정 및 취소');
    link.title = '예약 관리';
    link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1"/><path d="M12 16v2"/></svg><span>관리자</span>';
    header.append(link);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mountMobileAdmin);
  else mountMobileAdmin();
})();
