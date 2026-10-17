import { initTool } from './tools-runtime.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const progress = document.querySelector('.reading-progress');
if (progress && !reduced) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max ? Math.max(0,Math.min(1,window.scrollY/max)) : 0})`;
    ticking = false;
  };
  document.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, {passive:true});
  update();
}

if (!reduced) {
  document.body.classList.add('motion-ready');
}

const search = document.querySelector('#tool-search');
const rows = [...document.querySelectorAll('.tool-row')];
const filters = [...document.querySelectorAll('[data-filter]')];
const results = document.querySelector('#results-status');
const empty = document.querySelector('#empty-state');
const fold = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
let activeFilter = 'Todas';
function filterList() {
  const term = fold(search?.value.trim());
  const update = () => {
    let visible = 0;
    for (const row of rows) {
      const match = (activeFilter === 'Todas' || row.dataset.category === activeFilter) && fold(row.dataset.search).includes(term);
      row.hidden = !match;
      if (match) visible++;
    }
    if (results) results.textContent = `${visible} ferramenta${visible === 1 ? '' : 's'} encontrada${visible === 1 ? '' : 's'}`;
    if (empty) empty.hidden = visible !== 0;
  };
  if (!reduced && document.startViewTransition && rows.length) document.startViewTransition(update);
  else update();
}
filters.forEach(button=>button.addEventListener('click',()=>{
  activeFilter = button.dataset.filter;
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  filterList();
}));
search?.addEventListener('input',filterList);
document.querySelector('#clear-search')?.addEventListener('click',()=>{if(!search)return;search.value='';filters[0]?.click();search.focus()});
document.addEventListener('keydown',e=>{
  if ((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&search){e.preventDefault();search.focus();search.select();}
  if(e.key==='Escape'&&document.activeElement===search){search.value='';filterList();search.blur();}
});

const preview = document.querySelector('[data-preview]');
if(preview && !reduced) {
  const steps = [...preview.querySelectorAll('[data-preview-step]')];
  let index = 0;
  let timer;
  const tick=()=>{index=(index+1)%steps.length;steps.forEach((s,i)=>s.classList.toggle('on',i===index));};
  const start=()=>{if(!timer)timer=window.setInterval(tick,2200)};
  const stop=()=>{clearInterval(timer);timer=null};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
  preview.addEventListener('mouseenter',stop);
  preview.addEventListener('mouseleave',start);
  start();
  rows.forEach(r=>r.addEventListener('mouseenter',()=>{const target=preview.querySelector('[data-preview-message]');if(target)target.textContent=r.querySelector('.tool-copy strong')?.textContent.toUpperCase()||'DEVARITY TOOLS'}));
}

const main = document.querySelector('main[data-tool]');
if(main){
  initTool(main.dataset.tool).catch(e=>{
    console.error(e);
    const workspace=document.querySelector('#tool-workspace');
    if(workspace)workspace.textContent='Não foi possível carregar a ferramenta. Recarregue a página.';
  });
}
