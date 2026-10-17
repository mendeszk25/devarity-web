const demo = document.querySelector('[data-tools-transform]');
if (demo) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const canvas = demo.querySelector('.instrument-canvas');
  const hero = demo.closest('.hero');
  const status = demo.querySelector('[data-demo-status]');
  const source = demo.querySelector('.demo-input-visual');
  const result = demo.querySelector('.demo-result');
  const landscape = `<svg class="demo-landscape" viewBox="0 0 116 90" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><path fill="#282826" d="M0 0h116v90H0z"/><circle cx="87" cy="23" r="12" fill="#e8e8e2"/><path fill="#ff3b30" d="M-8 90 41 26 85 90z"/><path fill="#88887c" d="m42 90 39-43 46 43z"/><path fill="#121211" d="m-8 90 36-33 37 33z"/></svg>`;
  const modes = {
    image: { heading:'CONVERTA IMAGENS EM POUCOS CLIQUES.', input:'FOTO.PNG', format:'SAÍDA / WEBP', output:'Imagem em WEBP.', href:'./converter-imagem/', source:landscape, result:landscape },
    text: { heading:'CONHEÇA MELHOR SEUS TEXTOS.', input:'OLÁ, MUNDO.', format:'SAÍDA / CONTAGEM', output:'Conte seu conteúdo.', href:'./contador-caracteres/', source:'<p class="demo-text-source">Olá, mundo.</p>', result:'<div class="demo-text-result"><b>11</b><small>CARACTERES</small><span>2 palavras</span><span>1 linha</span></div>' },
    link: { heading:'CRIE LINKS E QR CODES.', input:'SEU LINK', format:'SAÍDA / QR CODE', output:'Link em QR Code.', href:'./gerar-qr-code/', source:'<span class="demo-url">https://<br>devarity.com.br<br>/tools/</span>', result:'<img class="demo-qr" src="./assets/img/hero-qr.svg" width="106" height="106" alt="">' }
  };
  const objects = [...canvas.querySelectorAll('[data-object]')].map(el => ({ el, id:el.dataset.object, x:0,y:0,rx:0,ry:0,rz:0, vx:0,vy:0,vrx:0,vry:0,vrz:0, tx:0,ty:0,trx:0,try:0,trz:0 }));
  const [input, engine, output] = objects;
  const routePaths = ['input', 'output'].map(name => ({
    line: canvas.querySelector(`[data-route="${name}"]`),
    energy: canvas.querySelector(`[data-energy="${name}"]`)
  }));
  let geometry, heroBox, frame = 0, previous = 0, drag = null, animations = [], sequence = 0;
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const measure = () => {
    geometry = canvas.getBoundingClientRect();
    heroBox = hero.getBoundingClientRect();
    for (const o of objects) {
      o.angle=parseFloat(getComputedStyle(o.el).getPropertyValue('--angle')) || 0;
      o.left=o.el.offsetLeft; o.top=o.el.offsetTop; o.width=o.el.offsetWidth; o.height=o.el.offsetHeight;
    }
    routes();
  };
  // Route geometry is based on cached object positions, never layout reads in pointer frames.
  function routes() {
    // Anchor at the rotated card edges, rather than drawing through their centres.
    const center = o => [o.left + o.width / 2 + o.x, o.top + o.height / 2 + o.y];
    const point = (o, toward) => {
      const [cx, cy] = center(o), [tx, ty] = center(toward);
      const angle = (o.angle + o.rz) * Math.PI / 180;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const dx = cos * (tx - cx) + sin * (ty - cy);
      const dy = -sin * (tx - cx) + cos * (ty - cy);
      const ratio = Math.min(o.width / 2 / (Math.abs(dx) || .001), o.height / 2 / (Math.abs(dy) || .001));
      return [cx + (cos * dx - sin * dy) * ratio, cy + (sin * dx + cos * dy) * ratio];
    };
    const path = (p, q) => {
      // Follow the vertical composition on phones without a backwards loop.
      const vertical = Math.abs(q[1] - p[1]) > Math.abs(q[0] - p[0]);
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      return vertical
        ? `M${p[0]} ${p[1]}C${p[0]} ${my},${q[0]} ${my},${q[0]} ${q[1]}`
        : `M${p[0]} ${p[1]}C${mx} ${p[1]},${mx} ${q[1]},${q[0]} ${q[1]}`;
    };
    [path(point(input, engine), point(engine, input)), path(point(engine, output), point(output, engine))]
      .forEach((d, i) => {
        routePaths[i].line.setAttribute('d', d);
        routePaths[i].energy.setAttribute('d', d);
      });
  }

  function draw(time) {
    const elapsed=Math.min((time-previous)/1000||1/60,1/30); previous=time;
    const steps=Math.ceil(elapsed/(1/120)), dt=elapsed/steps;
    let moving=false;
    for(const o of objects) {
      for(const key of ['x','y','rx','ry','rz']) {
        const velocity='v'+key,target='t'+key;
        for(let step=0;step<steps;step++) {
          o[velocity]+=(220*(o[target]-o[key])-26*o[velocity])*dt;
          o[key]+=o[velocity]*dt;
        }
        if(Math.abs(o[target]-o[key])<.015&&Math.abs(o[velocity])<.04) {o[key]=o[target];o[velocity]=0;} else moving=true;
        o.el.style.setProperty('--'+key,o[key]+(['x','y'].includes(key)?'px':'deg'));
      }
    }
    routes(); frame=moving?requestAnimationFrame(draw):0;
  }
  const wake=()=>{if(!frame&&!motion.matches){previous=performance.now();frame=requestAnimationFrame(draw)}};
  function rest() { for(const o of objects) o.tx=o.ty=o.trx=o.try=o.trz=0; wake(); }
  const stop = () => { sequence++; animations.forEach(a=>a.cancel()); animations=[]; demo.removeAttribute('data-processing'); };
  function animate(el,frames,options={}) {
    if(motion.matches||!el.animate)return;
    const a=el.animate(frames,{duration:240,easing:'cubic-bezier(.16,1,.3,1)',...options});
    animations.push(a);
    a.finished.then(()=>{animations=animations.filter(item=>item!==a)}).catch(()=>{});
    return a;
  }
  function play(keyboard=false) {
    stop();
    status.textContent='Simulação visual. Nenhum arquivo é processado aqui.';
    if(motion.matches||keyboard) {
      status.textContent='Simulação visual. Nenhum arquivo é processado aqui. Abra a ferramenta para usar seus dados.';
      return;
    }
    const token=sequence;
    demo.dataset.processing='true';
    animate(source,[{opacity:1},{opacity:.35},{opacity:1}],{duration:520});
    animate(engine.el.querySelector('img'),[{transform:'rotate(9deg)'},{transform:'rotate(28deg)',offset:.45},{transform:'rotate(9deg)'}],{duration:640,delay:90});
    canvas.querySelectorAll('[data-energy]').forEach((path,i)=>animate(path,[{strokeDashoffset:1,opacity:0},{opacity:1,offset:.15},{strokeDashoffset:-.16,opacity:0}],{duration:430,delay:i*250}));
    const last=animate(result,[{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,delay:400});
    last?.finished.then(()=>{if(sequence===token)demo.removeAttribute('data-processing')}).catch(()=>{});
  }
  function setMode(mode,keyboard=false,initial=false) {
    stop(); const content=modes[mode]; demo.dataset.mode=mode;
    demo.querySelectorAll('[data-transform-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.transformMode===mode)));
    input.el.setAttribute('aria-label', `Entrada: ${content.input}. Simular transformação visual`);
    output.el.setAttribute('aria-label', `${content.format}. ${content.output} Simular transformação visual`);
    for(const key of ['heading','input','format','output'])demo.querySelector(`[data-demo-${key}]`).textContent=content[key];
    demo.querySelector('[data-demo-link]').href=content.href;
    source.innerHTML=content.source;result.innerHTML=content.result;
    status.textContent='Simulação visual. Nenhum arquivo é processado aqui.';
    if(!initial&&!keyboard) {
      [demo.querySelector('[data-demo-heading]'),source,result].forEach((el,i)=>animate(el,[{opacity:.3,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{delay:i*35}));
      animate(engine.el.querySelector('img'),[{transform:'rotate(9deg)'},{transform:'rotate(19deg)',offset:.4},{transform:'rotate(9deg)'}],{duration:280});
      canvas.querySelectorAll('[data-route]').forEach(el=>animate(el,[{opacity:.25},{opacity:1}]));
    }
  }
  demo.querySelectorAll('[data-transform-mode]').forEach(b=>b.addEventListener('click',e=>{
    if(b.dataset.transformMode!==demo.dataset.mode)setMode(b.dataset.transformMode,e.detail===0);
  }));
  demo.querySelector('[data-transform-play]').addEventListener('click',e=>play(e.detail===0));
  engine.el.addEventListener('click',e=>play(e.detail===0));
  for(const o of [input,output]) {
    o.el.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' ')e.preventDefault();
      if(e.key==='Enter'&&!e.repeat)play(true);
    });
    o.el.addEventListener('keyup',e=>{if(e.key===' '){e.preventDefault();play(true)}});
    o.el.addEventListener('click',e=>{if(performance.now() < (o.ignoreClickUntil || 0))return;play(e.detail===0)});
    o.el.addEventListener('pointerdown',e=>{
      if(motion.matches||drag||!e.isPrimary||e.button!==0)return;
      measure();stop();
      for(const other of objects)if(other!==o)other.tx=other.ty=other.trx=other.try=other.trz=0;
      const box=o.el.getBoundingClientRect();
      drag={o,id:e.pointerId,startX:e.clientX,startY:e.clientY,originX:o.x,originY:o.y,moved:false,touch:e.pointerType==='touch',
        minX:Math.max(-65,geometry.left+20-box.left+o.x),maxX:Math.min(65,geometry.right-20-box.right+o.x),
        minY:Math.max(-55,geometry.top+20-box.top+o.y),maxY:Math.min(55,geometry.bottom-20-box.bottom+o.y)};
      o.el.setPointerCapture(e.pointerId);o.el.classList.add('is-dragging');
      demo.dataset.engaged=o.id;
    });
    o.el.addEventListener('lostpointercapture',()=>{if(drag?.o===o)release()});
    o.el.addEventListener('dragstart',e=>e.preventDefault());
  }
  function release() {
    if(!drag)return;
    drag.o.el.classList.remove('is-dragging');
    const {o,id,moved}=drag;drag=null;
    // Native click follows pointerup; avoid firing a simulation after a drag.
    if(moved)o.ignoreClickUntil=performance.now()+350;
    if(o.el.hasPointerCapture(id))o.el.releasePointerCapture(id);
    delete demo.dataset.engaged;
    rest();
  }
  canvas.addEventListener('pointermove',e=>{
    if(motion.matches)return;
    if(drag&&e.pointerId===drag.id) {
      const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
      if(Math.hypot(dx,dy)>5)drag.moved=true;
      drag.o.tx=clamp(drag.originX+dx,drag.minX,drag.maxX);drag.o.ty=drag.touch?0:clamp(drag.originY+dy,drag.minY,drag.maxY);
      drag.o.trz=clamp(dx*.045,-3,3);drag.o.try=clamp(dx*.05,-4,4);wake();return;
    }
    if(!fine.matches||e.pointerType==='touch')return;
    const x=clamp((e.clientX-geometry.left)/geometry.width-.5,-.5,.5);
    const y=clamp((e.clientY-geometry.top)/geometry.height-.5,-.5,.5);
    const hovered=e.target.closest('[data-object]');
    if(hovered)demo.dataset.engaged=hovered.dataset.object;else delete demo.dataset.engaged;
    objects.forEach((o,i)=>{
      o.tx=x*[9,5,-11][i];o.ty=y*[7,5,-9][i];o.trx=-y*7;o.try=x*9;o.trz=0;
      if(hovered===o.el) {
        const localX=clamp((e.clientX-geometry.left-o.left-o.x)/o.width-.5,-.5,.5);
        const localY=clamp((e.clientY-geometry.top-o.top-o.y)/o.height-.5,-.5,.5);
        o.trx=-localY*12;o.try=localX*14;o.ty-=3;
        if(o===engine)o.trz=localX*5;
      }
    });wake();
  },{passive:true});
  canvas.addEventListener('pointerleave',()=>{if(!drag){delete demo.dataset.engaged;rest()}});
  const finishPointer=e=>{if(drag?.id===e.pointerId)release()};
  canvas.addEventListener('pointerup',finishPointer);canvas.addEventListener('pointercancel',finishPointer);
  canvas.addEventListener('keydown',e=>{if(e.key==='Escape'){release();rest()}});
  hero.addEventListener('pointermove',e=>{
    if(motion.matches||!fine.matches||e.pointerType==='touch')return;
    hero.style.setProperty('--water-x',((e.clientX-heroBox.left)/heroBox.width-.5)*9+'px');
    hero.style.setProperty('--water-y',((e.clientY-heroBox.top)/heroBox.height-.5)*7+'px');
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--water-x','0px');hero.style.setProperty('--water-y','0px')});
  motion.addEventListener('change',()=>{
    if(motion.matches){stop();release();delete demo.dataset.engaged;hero.style.removeProperty('--water-x');hero.style.removeProperty('--water-y');cancelAnimationFrame(frame);frame=0;for(const o of objects)for(const k of ['x','y','rx','ry','rz']){o[k]=o['v'+k]=o['t'+k]=0;o.el.style.removeProperty('--'+k)}routes()}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();release();rest()}});
  window.addEventListener('blur',release);
  // Scrolling only refreshes the cached viewport origin; object sizes stay cached.
  window.addEventListener('scroll',()=>{geometry=canvas.getBoundingClientRect();heroBox=hero.getBoundingClientRect()},{passive:true});
  new ResizeObserver(()=>{release();measure()}).observe(canvas);
  setMode('image',true,true);measure();
}
