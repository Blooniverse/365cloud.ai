
(function(){
  const qs = (s)=>document.querySelector(s);
  const drawer = qs('#drawer');
  const scrim = qs('#scrim');
  const btn = qs('#menuBtn');
  const themeToggle = qs('#themeToggle');

  function open(){ drawer.classList.add('open'); scrim.classList.add('open'); btn.setAttribute('aria-expanded','true'); drawer.setAttribute('aria-hidden','false'); }
  function close(){ drawer.classList.remove('open'); scrim.classList.remove('open'); btn.setAttribute('aria-expanded','false'); drawer.setAttribute('aria-hidden','true'); }
  btn && btn.addEventListener('click', ()=> drawer.classList.contains('open') ? close() : open());
  scrim && scrim.addEventListener('click', close);
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });

  const STORAGE_KEY = 'theme';
  function applyTheme(t){ if(!t){ document.documentElement.removeAttribute('data-theme'); return; } document.documentElement.setAttribute('data-theme', t); }
  function currentPref(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved || '');
  if(themeToggle){
    const active = (saved ? saved : '').toLowerCase() || '';
    const effective = active || currentPref();
    themeToggle.checked = (effective === 'light');
    themeToggle.addEventListener('change', ()=>{
      const t = themeToggle.checked ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, t);
      applyTheme(t);
    });
  }
})();
