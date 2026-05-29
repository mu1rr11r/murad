// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2600);
});

// ===== RAIN =====
(function() {
  const c = document.createElement('div'); c.className = 'rain-container'; document.body.appendChild(c);
  for (let i = 0; i < 60; i++) {
    const d = document.createElement('div'); d.className = 'rain-drop';
    d.style.left = Math.random()*100+'%'; d.style.height = (12+Math.random()*25)+'px';
    d.style.animationDuration = (1.2+Math.random()*2)+'s'; d.style.animationDelay = Math.random()*5+'s';
    d.style.opacity = (0.06+Math.random()*0.12).toString(); c.appendChild(d);
  }
})();

// ===== MOONS =====
(function() {
  [{size:65,top:'7%',dir:'right',dur:50,delay:0,bob:7,op:.5},
   {size:40,top:'22%',dir:'left',dur:65,delay:-20,bob:9,op:.35},
   {size:50,top:'42%',dir:'right',dur:55,delay:-30,bob:6,op:.4},
   {size:30,top:'60%',dir:'left',dur:70,delay:-45,bob:10,op:.25},
   {size:55,top:'78%',dir:'right',dur:48,delay:-12,bob:8,op:.45}
  ].forEach(cfg => {
    const ct = document.createElement('div'); ct.className = `moon-container moon-drift-${cfg.dir}`;
    ct.style.cssText = `width:${cfg.size}px;height:${cfg.size}px;top:${cfg.top};--drift-duration:${cfg.dur}s;--drift-delay:${cfg.delay}s;`;
    const bob = document.createElement('div'); bob.className = 'moon-bob';
    bob.style.cssText = `--bob-speed:${cfg.bob}s;width:100%;height:100%;opacity:${cfg.op}`;
    bob.innerHTML = '<div class="moon-glow"></div><div class="moon-body"></div>';
    ct.appendChild(bob); document.body.appendChild(ct);
  });
})();

// ===== PARTICLES =====
(function() {
  const c = document.getElementById('particles'); if (!c) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div'); p.className = 'particle';
    p.style.left = Math.random()*100+'%'; p.style.animationDuration = (8+Math.random()*12)+'s';
    p.style.animationDelay = Math.random()*10+'s';
    const s = (1+Math.random()*2.5)+'px'; p.style.width = s; p.style.height = s; c.appendChild(p);
  }
})();

// ===== SHADER LINES =====
(function() {
  document.querySelectorAll('.shader-lines').forEach(container => {
    const count = parseInt(container.dataset.lines) || 8;
    for (let i = 0; i < count; i++) {
      const line = document.createElement('div'); line.className = 'shader-line';
      const speed = 6+Math.random()*10, delay = -(Math.random()*speed);
      line.style.cssText = `top:${(i/count)*100}%;height:${0.5+Math.random()*1.5}px;--shader-speed:${speed}s;--shader-delay:${delay}s;`;
      container.appendChild(line);
    }
  });
})();

// ===== CIRCLE ANIMATOR =====
(function() {
  document.querySelectorAll('.circle-animator').forEach(container => {
    const rings = parseInt(container.dataset.rings)||3, baseSize = parseInt(container.dataset.size)||120;
    for (let i = 0; i < rings; i++) {
      const rs = baseSize+i*60;
      const ring = document.createElement('div'); ring.className = 'circle-animator-ring';
      ring.style.cssText = `width:${rs}px;height:${rs}px;top:50%;left:50%;margin-top:${-rs/2}px;margin-left:${-rs/2}px;--ring-speed:${3+i*1.5}s;--ring-delay:${-i*0.8}s;--ring-opacity:${0.08-i*0.015};`;
      container.appendChild(ring);
    }
    const orbitR = baseSize*0.4, orbitS = baseSize*0.8;
    const orbit = document.createElement('div'); orbit.className = 'circle-animator-orbit';
    orbit.style.cssText = `width:${orbitS}px;height:${orbitS}px;top:50%;left:50%;margin-top:${-orbitS/2}px;margin-left:${-orbitS/2}px;--orbit-speed:${15+Math.random()*10}s;`;
    container.appendChild(orbit);
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div'); dot.className = 'circle-animator-dot';
      dot.style.cssText = `top:50%;left:50%;--orbit-radius:${orbitR}px;--orbit-speed:${15+Math.random()*10}s;animation-delay:${-i*5}s;`;
      container.appendChild(dot);
    }
  });
})();

// ===== CURSOR + TRAIL =====
const dot = document.getElementById('cursorDot'), ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
const ghostCount = 6, ghosts = [], gpos = [];
for (let i = 0; i < ghostCount; i++) {
  const g = document.createElement('div'); g.className = 'cursor-ghost';
  const s = Math.max(2, 5-i*0.6); g.style.width = s+'px'; g.style.height = s+'px';
  g.style.opacity = (0.2-i*0.025).toString(); document.body.appendChild(g);
  ghosts.push(g); gpos.push({x:0,y:0});
}
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx-3+'px'; dot.style.top=my-3+'px'; });
(function animCursor() {
  rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
  ring.style.left=rx-18+'px'; ring.style.top=ry-18+'px';
  gpos[0].x+=(mx-gpos[0].x)*0.25; gpos[0].y+=(my-gpos[0].y)*0.25;
  for (let i=1;i<ghostCount;i++){gpos[i].x+=(gpos[i-1].x-gpos[i].x)*0.2;gpos[i].y+=(gpos[i-1].y-gpos[i].y)*0.2;}
  ghosts.forEach((g,i)=>{const hs=parseFloat(g.style.width)/2;g.style.left=gpos[i].x-hs+'px';g.style.top=gpos[i].y-hs+'px';});
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button,.about-tag,.tilt-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
});
if('ontouchstart' in window)[dot,ring,...ghosts].forEach(e=>e.style.display='none');

// ===== CIRCLE HOVER =====
document.querySelectorAll('.circle-hover-wrap').forEach(wrap => {
  const circle = wrap.querySelector('.circle-hover-effect'); if (!circle) return;
  wrap.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect(), size = Math.max(rect.width,rect.height)*2.5;
    circle.style.width=size+'px'; circle.style.height=size+'px';
    circle.style.left=(e.clientX-rect.left-size/2)+'px'; circle.style.top=(e.clientY-rect.top-size/2)+'px';
    circle.classList.remove('releasing'); circle.classList.add('active');
  });
  wrap.addEventListener('mouseleave', function() {
    circle.classList.remove('active'); circle.classList.add('releasing');
    setTimeout(()=>circle.classList.remove('releasing'),800);
  });
  wrap.addEventListener('mousemove', function(e) {
    const rect=this.getBoundingClientRect(), size=parseFloat(circle.style.width)||200;
    circle.style.left=(e.clientX-rect.left-size/2)+'px'; circle.style.top=(e.clientY-rect.top-size/2)+'px';
  });
});

// ===== WAVE CLICK =====
document.addEventListener('click', e => {
  const r = document.createElement('div'); r.className = 'wave-ripple';
  r.style.left=e.clientX+'px'; r.style.top=e.clientY+'px';
  document.body.appendChild(r); setTimeout(()=>r.remove(),900);
});

// ===== NAV =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn'), mobMenu = document.getElementById('mobMenu');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active'); mobMenu.classList.toggle('active');
  document.body.style.overflow = mobMenu.classList.contains('active') ? 'hidden' : '';
});
function closeMenu() {
  menuBtn.classList.remove('active'); mobMenu.classList.remove('active'); document.body.style.overflow = '';
}

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal-up,.reveal-down,.reveal-left,.reveal-right,.reveal-scale,.reveal-rotate-left,.reveal-rotate-right,.reveal-flip,.reveal-zoom-rotate,.reveal-bounce,.reveal-blur,.reveal-slide-fade,.timeline-item').forEach(el=>revealObs.observe(el));

// ===== COUNTER =====
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el=e.target,target=parseInt(el.dataset.target); let cur=0; const inc=target/30;
      const t=setInterval(()=>{cur+=inc;if(cur>=target){el.textContent=target+'+';clearInterval(t);}else el.textContent=Math.floor(cur);},50);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el=>counterObs.observe(el));

// ===== 3D TILT =====
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r=card.getBoundingClientRect();
    card.style.transform=`perspective(800px) rotateY(${((e.clientX-r.left)/r.width-0.5)*10}deg) rotateX(${((e.clientY-r.top)/r.height-0.5)*-10}deg) scale3d(1.02,1.02,1.02)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform=''; });
});

// ===== 3D SCROLL =====
let ticking = false;
function update3DScroll() {
  const scrollY=window.scrollY, vh=window.innerHeight;
  document.querySelectorAll('.scene').forEach(scene=>{
    const rect=scene.getBoundingClientRect();
    if(rect.top<vh&&rect.bottom>0){const p=(vh-rect.top)/(vh+rect.height);const inner=scene.querySelector('.scene-inner');if(inner)inner.style.transform=`rotateX(${(p-0.5)*2.5}deg) translateZ(0)`;}
  });
  const aboutImg=document.querySelector('.about-image-inner');
  if(aboutImg){const rect=aboutImg.getBoundingClientRect();if(rect.top<vh&&rect.bottom>0){const p=(vh-rect.top)/(vh+rect.height);aboutImg.style.transform=`perspective(800px) rotateY(${(p-0.5)*5}deg) rotateX(${(p-0.5)*-2}deg)`;}}
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update3DScroll);ticking=true;}});

// ===== PROGRESS =====
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => { const s=window.scrollY,d=document.documentElement.scrollHeight-window.innerHeight; progressBar.style.width=(s/d*100)+'%'; });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); const t=document.querySelector(a.getAttribute('href')); if(t) t.scrollIntoView({behavior:'smooth',block:'start'}); });
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const sp=window.scrollY+200;
  sections.forEach(s=>{const link=document.querySelector(`.nav-center a[href="#${s.id}"]`);if(link)link.style.color=(sp>=s.offsetTop&&sp<s.offsetTop+s.offsetHeight)?'var(--white)':'';});
});

// ===== FORM =====
function handleSubmit(e) {
  e.preventDefault(); const toast=document.getElementById('toast');
  toast.style.transform='translateY(0)'; toast.style.opacity='1'; e.target.reset();
  setTimeout(()=>{toast.style.transform='translateY(100px)';toast.style.opacity='0';},3000);
}

// ===== TITLE SPLIT =====
document.querySelectorAll('.section-title').forEach(title => {
  const html=title.innerHTML, parts=html.split(/(<[^>]+>)/);
  let result='',wi=0;
  parts.forEach(part=>{if(part.startsWith('<')){result+=part;}else{part.split(' ').forEach(word=>{if(word.trim()){result+=`<span style="display:inline-block;overflow:hidden"><span style="display:inline-block;transform:translateY(110%);transition:transform .6s cubic-bezier(.16,1,.3,1);transition-delay:${wi*70}ms" class="title-word">${word}</span></span> `;wi++;}});}});
  title.innerHTML=result;
});
const titleObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.querySelectorAll('.title-word').forEach(w=>w.style.transform='translateY(0)'); });
}, { threshold: 0.3 });
document.querySelectorAll('.section-title').forEach(el=>titleObs.observe(el));

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => { const r=btn.getBoundingClientRect(); btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`; });
  btn.addEventListener('mouseleave', () => { btn.style.transform=''; });
});

// ===== SHATTER IMAGE =====
class ShatterImage {
  constructor(imgEl,container,rows,cols){this.img=imgEl;this.container=container;this.rows=rows||6;this.cols=cols||6;this.assembled=false;this.init();}
  init(){
    this.wrapper=document.createElement('div');this.wrapper.className='shatter-wrapper';
    this.wrapper.style.gridTemplateColumns=`repeat(${this.cols},1fr)`;this.wrapper.style.gridTemplateRows=`repeat(${this.rows},1fr)`;
    this.container.style.position='relative';this.container.style.overflow='hidden';this.tiles=[];
    for(let r=0;r<this.rows;r++){for(let c=0;c<this.cols;c++){
      const tile=document.createElement('div');tile.className='shatter-tile';
      tile.style.cssText=`--bg-size:${this.cols*100}% ${this.rows*100}%;--bg-pos:${this.cols>1?(c/(this.cols-1))*100:0}% ${this.rows>1?(r/(this.rows-1))*100:0}%;--start-y:${-250-Math.random()*400}px;--start-x:${(Math.random()-.5)*200}px;--start-r:${(Math.random()-.5)*300}deg;--tile-delay:${(r*this.cols+c)*0.04}s;`;
      this.wrapper.appendChild(tile);this.tiles.push(tile);
    }}
    this.container.appendChild(this.wrapper);this.img.style.opacity='0';this.img.style.transition='opacity .5s';
  }
  assemble(){if(this.assembled)return;this.assembled=true;this.tiles.forEach(t=>t.classList.add('assembled'));setTimeout(()=>{this.img.style.opacity='1';if(this.wrapper.parentNode)this.wrapper.remove();},2200);}
}
const aboutImgEl=document.querySelector('.about-image-inner img'),aboutContainer=document.querySelector('.about-image-inner');
let shatterInstance=null;
if(aboutImgEl&&aboutContainer){aboutImgEl.onload=()=>{shatterInstance=new ShatterImage(aboutImgEl,aboutContainer,window.innerWidth<768?4:6,window.innerWidth<768?4:6);};if(aboutImgEl.complete)aboutImgEl.onload();}
const shatterObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting&&shatterInstance){shatterInstance.assemble();shatterObs.unobserve(e.target);}});},{threshold:0.3});
if(aboutContainer)shatterObs.observe(aboutContainer);

// ===== CARD SPREAD =====
class CardSpread {
  constructor(container){this.container=container;this.cards=Array.from(container.querySelectorAll('.spread-card'));this.spread=false;this.init();}
  init(){
    this.cards.forEach((card,i)=>{card.style.transform=`rotate(${(i-2)*3}deg) translateY(${Math.abs(i-2)*3}px)`;card.style.zIndex=i;card.style.opacity='0';});
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){this.doSpread();obs.unobserve(e.target);}});},{threshold:0.3});
    obs.observe(this.container);
  }
  doSpread(){
    if(this.spread)return;this.spread=true;
    const total=this.cards.length,isMob=window.innerWidth<480,sAngle=isMob?3:5,sOff=isMob?8:15,mX=isMob?4:20;
    this.cards.forEach((card,i)=>{setTimeout(()=>{
      card.style.opacity='1';const center=(total-1)/2,offset=i-center,angle=offset*sAngle,y=Math.abs(offset)*sOff;
      card.style.transform=`rotate(${angle}deg) translateY(${y}px)`;card.style.marginLeft=i>0?`${mX}px`:'0';
      const fill=card.querySelector('.spread-bar-fill');if(fill)setTimeout(()=>{fill.style.setProperty('--fill-width',fill.dataset.width+'%');fill.classList.add('animated');},400);
    },i*150);});
  }
}
document.querySelectorAll('.spread-container').forEach(c=>new CardSpread(c));

// ============================================
// SERVICE WHEEL — كروت دائرية كبيرة
// ============================================
class ServiceWheel {
  constructor(viewport) {
    this.viewport = viewport;
    this.wheel = viewport.querySelector('.service-wheel');
    this.cards = Array.from(viewport.querySelectorAll('.wheel-card'));
    this.spokes = Array.from(viewport.querySelectorAll('.wheel-spoke'));
    this.orbitDots = Array.from(viewport.querySelectorAll('.wheel-orbit-dot'));
    this.angle = 0;
    this.targetSpeed = 0.18;
    this.currentSpeed = 0;
    this.hoveredCard = null;
    this.isRunning = false;
    this.radius = 290;
    this.cardAngles = [];
    this.init();
  }

  init() {
    const vpWidth = this.viewport.offsetWidth;
    this.radius = Math.min(vpWidth * 0.35, 310);
    const total = this.cards.length;
    const angleStep = 360 / total;

    this.cards.forEach((card, i) => {
      const angle = i * angleStep - 90;
      this.cardAngles.push(angle);
      card.dataset.angle = angle;
    });

    this.spokes.forEach((spoke, i) => {
      if (i < this.cardAngles.length) {
        spoke.style.width = this.radius + 'px';
        spoke.style.transform = `rotate(${this.cardAngles[i]}deg)`;
      }
    });

    this.orbitDots.forEach((dot, i) => {
      const dotAngle = (i / this.orbitDots.length) * 360;
      const rad = (dotAngle * Math.PI) / 180;
      const r = this.radius + 40;
      dot.style.marginLeft = Math.cos(rad) * r + 'px';
      dot.style.marginTop = Math.sin(rad) * r + 'px';
    });

    this.cards.forEach((card, i) => {
      card.addEventListener('mouseenter', () => {
        this.hoveredCard = i;
        this.targetSpeed = 0.015;
      });
      card.addEventListener('mouseleave', () => {
        this.hoveredCard = null;
        this.targetSpeed = 0.18;
      });
    });

    this.viewport.addEventListener('mouseenter', () => {
      if (this.hoveredCard === null) this.targetSpeed = 0.08;
    });
    this.viewport.addEventListener('mouseleave', () => {
      this.hoveredCard = null;
      this.targetSpeed = 0.18;
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !this.isRunning) {
          this.isRunning = true;
          this.animate();
        }
      });
    }, { threshold: 0.1 });
    obs.observe(this.viewport);
  }

  animate() {
    this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.04;
    this.angle += this.currentSpeed;
    if (this.angle >= 360) this.angle -= 360;

    this.wheel.style.transform = `rotate(${this.angle}deg)`;

    this.spokes.forEach((spoke, i) => {
      if (i < this.cardAngles.length) {
        spoke.style.transform = `rotate(${this.cardAngles[i] + this.angle}deg)`;
      }
    });

    this.cards.forEach((card, i) => {
      const totalAngle = this.cardAngles[i] + this.angle;
      const rad = (totalAngle * Math.PI) / 180;
      const x = Math.cos(rad) * this.radius;
      const y = Math.sin(rad) * this.radius;

      // 280x280 square element with border-radius:50%
      const cardSize = card.offsetWidth || 280;
      const halfSize = cardSize / 2;

      card.style.left = `calc(50% + ${x}px - ${halfSize}px)`;
      card.style.top = `calc(50% + ${y}px - ${halfSize}px)`;

      const inner = card.querySelector('.wheel-card-inner');
      if (inner) {
        const isHovered = this.hoveredCard === i;
        const scale = 0.78 + (Math.sin(rad) + 1) * 0.11;

        if (isHovered) {
          inner.style.transform = `rotate(${-this.angle}deg) scale(1.06)`;
          card.style.opacity = 1;
          card.style.zIndex = 100;
        } else {
          inner.style.transform = `rotate(${-this.angle}deg) scale(${scale})`;
          card.style.opacity = 0.35 + (Math.sin(rad) + 1) * 0.35;
          card.style.zIndex = Math.round(Math.sin(rad) * 10) + 10;
        }
      }
    });

    this.orbitDots.forEach((dot, i) => {
      const dotAngle = ((i / this.orbitDots.length) * 360) + this.angle * 0.3;
      const rad = (dotAngle * Math.PI) / 180;
      const r = this.radius + 45;
      dot.style.marginLeft = Math.cos(rad) * r + 'px';
      dot.style.marginTop = Math.sin(rad) * r + 'px';
    });

    requestAnimationFrame(() => this.animate());
  }
}

document.querySelectorAll('.wheel-viewport').forEach(vp => new ServiceWheel(vp));

// ===== HERO 3D MOUSE =====
const hero = document.querySelector('.hero');
if(hero){
  hero.addEventListener('mousemove',e=>{const rect=hero.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-0.5;const y=(e.clientY-rect.top)/rect.height-0.5;
    const la=document.querySelector('.hero-logo-area');if(la)la.style.transform=`perspective(600px) rotateY(${x*6}deg) rotateX(${y*-6}deg)`;
    const g=document.querySelector('.hero-glow');if(g)g.style.transform=`translate(calc(-50% + ${x*25}px), calc(-50% + ${y*25}px))`;
  });
  hero.addEventListener('mouseleave',()=>{const l=document.querySelector('.hero-logo-area');if(l)l.style.transform='';const g=document.querySelector('.hero-glow');if(g)g.style.transform='translate(-50%,-50%)';});
}

// ===== GLITCH =====
const heroName=document.querySelector('.hero-name');
if(heroName){heroName.classList.add('glitch');heroName.setAttribute('data-text',heroName.textContent);
  function triggerGlitch(){heroName.classList.add('active');setTimeout(()=>heroName.classList.remove('active'),250);setTimeout(triggerGlitch,4000+Math.random()*6000);}
  setTimeout(triggerGlitch,5000);
}

// ===== TEXT SCRAMBLE =====
class TextScramble{
  constructor(el){this.el=el;this.chars='!<>-_\\/[]{}—=+*^?#________';this.update=this.update.bind(this);}
  setText(newText){const oldText=this.el.innerText;const length=Math.max(oldText.length,newText.length);const promise=new Promise(r=>this.resolve=r);this.queue=[];for(let i=0;i<length;i++)this.queue.push({from:oldText[i]||'',to:newText[i]||'',start:Math.floor(Math.random()*25),end:Math.floor(Math.random()*25)+Math.floor(Math.random()*25)});cancelAnimationFrame(this.frameRequest);this.frame=0;this.update();return promise;}
  update(){let output='',complete=0;for(let i=0,n=this.queue.length;i<n;i++){let{from,to,start,end,char}=this.queue[i];if(this.frame>=end){complete++;output+=to;}else if(this.frame>=start){if(!char||Math.random()<0.28){char=this.chars[Math.floor(Math.random()*this.chars.length)];this.queue[i].char=char;}output+=`<span style="color:var(--g600)">${char}</span>`;}else output+=from;}this.el.innerHTML=output;if(complete===this.queue.length)this.resolve();else{this.frameRequest=requestAnimationFrame(this.update);this.frame++;}}
}
const scrambleObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting&&e.target.dataset.scrambled!=='true'){e.target.dataset.scrambled='true';new TextScramble(e.target).setText(e.target.textContent);}});},{threshold:0.5});
document.querySelectorAll('.section-title').forEach(el=>scrambleObs.observe(el));

// ===== TYPING =====
const heroLabelSpan=document.querySelector('.hero-label span');
if(heroLabelSpan){const orig=heroLabelSpan.textContent;heroLabelSpan.textContent='';heroLabelSpan.style.opacity='1';
  const cursor=document.createElement('span');cursor.className='typing-cursor';heroLabelSpan.appendChild(cursor);let ci=0;
  function typeChar(){if(ci<orig.length){heroLabelSpan.insertBefore(document.createTextNode(orig[ci]),cursor);ci++;setTimeout(typeChar,55+Math.random()*35);}else setTimeout(()=>{if(cursor.parentNode)cursor.style.opacity='0';},2000);}
  setTimeout(typeChar,3000);
}

// ===== NOISE FLICKER =====
function randomFlicker(){const n=document.querySelector('.noise');if(n){n.style.opacity='0.07';setTimeout(()=>{n.style.opacity='0.035';},70);}setTimeout(randomFlicker,7000+Math.random()*12000);}
setTimeout(randomFlicker,8000);