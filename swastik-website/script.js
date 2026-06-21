/* ═══════════════════════════════════════════════════════════════
   SWASTIK ARCHITECTURE — Script
   Image hero with Ken Burns zoom (no video)
   GSAP-owned parallax everywhere · 3D tilt on cards, studio image,
   and showcase cards · ScrollTrigger reveals · Lenis smooth scroll
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ── DATA ──────────────────────────────────────────────────────── */
const VALUES = [
  { t: 'Precision', d: 'Every measurement and detail serves the vision we bring to life.' },
  { t: 'Light',      d: 'We sculpt with natural light — spaces that breathe and transform throughout the day.' },
  { t: 'Material',   d: 'Authentic materials chosen for character, longevity, and tactile honesty.' },
  { t: 'Silence',    d: 'Architecture that speaks through restraint — allowing space to breathe for itself.' },
  { t: 'Geometry',   d: 'Clean lines and considered proportions that create lasting visual harmony.' },
];
const SERVICES = [
  { t: 'Architecture Design',      d: 'Comprehensive design from concept to construction documentation.' },
  { t: 'Interior Design',          d: 'Thoughtful interiors that complement and extend the architecture.' },
  { t: 'Urban Planning',           d: 'Strategic planning for large-scale developments and communities.' },
  { t: 'Landscape Architecture',   d: 'Seamless integration of built and natural environments.' },
  { t: 'Renovation & Restoration', d: 'Breathing new life into existing structures with care and respect.' },
  { t: 'Consultation',             d: 'Expert guidance from vision through to built reality.' },
];

/* ── RENDER DYNAMIC CONTENT ───────────────────────────────────── */
const arrowSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>`;

document.getElementById('valGrid').innerHTML = VALUES.map((v, i) => `
  <div class="vcard">
    <span class="vcard-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
    <h3 class="vcard-title">${v.t}</h3>
    <p class="vcard-desc">${v.d}</p>
  </div>`).join('');

document.getElementById('svcList').innerHTML = SERVICES.map((s, i) => `
  <div class="svc-row">
    <div class="svc-body">
      <div class="svc-head">
        <span class="svc-num">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="svc-title">${s.t}</h3>
      </div>
      <p class="svc-desc-sm">${s.d}</p>
    </div>
    <div class="svc-arr" aria-hidden="true">${arrowSVG}</div>
  </div>`).join('');

document.getElementById('yr').textContent = new Date().getFullYear();

/* ── GSAP REGISTER ─────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── LENIS v1.1 SMOOTH SCROLL ─────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.25,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* ── LOADER ─────────────────────────────────────────────────────
   Theatrical curtain-wipe exit, scroll locked until dismissed
   ─────────────────────────────────────────────────────────────── */
const loader = document.getElementById('loader');
lenis.stop();

function dismissLoader() {
  loader.classList.add('exit');
  loader.addEventListener('animationend', () => {
    loader.style.display = 'none';
    lenis.start();
    animateHeroIn();
  }, { once: true });
  setTimeout(() => { loader.style.display = 'none'; lenis.start(); animateHeroIn(); }, 1100);
}
window.addEventListener('load', () => setTimeout(dismissLoader, 1400));
setTimeout(dismissLoader, 3200);

/* ── NAV SCROLL STATE ───────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 80), { passive: true });

/* ── ACTIVE NAV LINK ────────────────────────────────────────────── */
const navAs = document.querySelectorAll('.nav-links a');
const secs = [...document.querySelectorAll('section[id], div[id]')];
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-38% 0px -55% 0px' });
secs.forEach(s => secObs.observe(s));

/* ── MOBILE MENU ───────────────────────────────────────────────── */
const mob = document.getElementById('mob');
const burger = document.getElementById('navBurger');
const mobClose = document.getElementById('mobClose');

function openMob() { mob.classList.add('open'); mob.setAttribute('aria-hidden', 'false'); burger.setAttribute('aria-expanded', 'true'); lenis.stop(); }
function closeMob() { mob.classList.remove('open'); mob.setAttribute('aria-hidden', 'true'); burger.setAttribute('aria-expanded', 'false'); lenis.start(); }
burger?.addEventListener('click', openMob);
mobClose?.addEventListener('click', closeMob);
document.querySelectorAll('.mob-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    closeMob();
    if (target) setTimeout(() => lenis.scrollTo(target, { offset: -80, duration: 1.6 }), 320);
  });
});

/* ── SMOOTH ANCHOR CLICKS ─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -80, duration: 1.6 }); }
  });
});
document.getElementById('viewAllBtn')?.addEventListener('click', () => {
  const el = document.getElementById('hscroll');
  if (el) lenis.scrollTo(el, { duration: 1.6 });
});

/* ── HERO ENTRANCE (line-mask reveal) ────────────────────────────── */
gsap.set('.hero-badge,.hero-sub,.hero-cta', { opacity: 0, y: 24 });
gsap.set('.hero-title-inner', { yPercent: 105, opacity: 1 });
gsap.set('.hero-stats', { opacity: 0, y: 20 });

function animateHeroIn() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.hero-badge', { opacity: 1, y: 0, duration: .8 })
    .to('.hero-title-inner', { yPercent: 0, duration: 1.25, stagger: .14 }, '-=.45')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 1 }, '-=.75')
    .to('.hero-cta', { opacity: 1, y: 0, duration: .9 }, '-=.7')
    .to('.hero-stats', { opacity: 1, y: 0, duration: .9 }, '-=.7');
}

/* ── HERO: KEN BURNS ZOOM + PARALLAX ───────────────────────────────
   GSAP owns the hero-bg transform exclusively:
   - a slow continuous zoom (Ken Burns) that loops gently
   - a scroll-scrubbed vertical drift + fade on top of that
   - subtle mouse parallax drift
   ─────────────────────────────────────────────────────────────── */
const heroBg = document.getElementById('heroBg');
const heroImg = document.getElementById('heroImg');

// Continuous slow Ken Burns zoom on the image itself
gsap.to(heroImg, {
  scale: 1.12,
  duration: 18,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
});

// Mouse parallax drift on the wrapper
let mx = 0, my = 0;
window.addEventListener('mousemove', e => {
  mx = (e.clientX / innerWidth - .5) * 20;
  my = (e.clientY / innerHeight - .5) * 13;
}, { passive: true });
gsap.ticker.add(() => gsap.set(heroBg, { x: mx, y: my }));

// Scroll-scrubbed drift + content fade
gsap.to(heroBg, {
  yPercent: 18, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
});
gsap.to('.hero-body', {
  opacity: 0, yPercent: 8, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: '55% top', scrub: 1 }
});
gsap.to('.hero-stats', {
  opacity: 0, y: 20, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: '50% top', scrub: 1 }
});

/* ── COUNTER ANIMATION ──────────────────────────────────────────── */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true,
    onEnter: () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.9, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; }
      });
    }
  });
});

/* ── WIDE BREAK / FOUNDER BG PARALLAX ─────────────────────────────── */
gsap.fromTo('#wbreakImg', { yPercent: -12 }, {
  yPercent: 12, ease: 'none',
  scrollTrigger: { trigger: '.wbreak', start: 'top bottom', end: 'bottom top', scrub: 1.3 }
});
gsap.fromTo('#founderBg', { yPercent: -14 }, {
  yPercent: 14, ease: 'none',
  scrollTrigger: { trigger: '#founder', start: 'top bottom', end: 'bottom top', scrub: 1.6 }
});

/* ── SCROLL REVEALS ─────────────────────────────────────────────── */
function reveal(sel, vars = { y: 55, stagger: 0 }) {
  gsap.fromTo(sel, { opacity: 0, y: vars.y || 55 },
    {
      opacity: 1, y: 0, duration: 1.1, stagger: vars.stagger || 0, ease: 'power3.out',
      scrollTrigger: { trigger: sel, start: 'top 85%', once: true }
    });
}
reveal('.studio-left > *', { y: 50, stagger: .12 });
reveal('.studio-img-wrap');
reveal('.pcard', { y: 70, stagger: .15 });
reveal('.vcard', { y: 45, stagger: .1 });
reveal('.svc-row', { y: 30, stagger: .08 });
reveal('.tm', { y: 30, stagger: .1 });
reveal('.cta-card');
reveal('.founder-content > *', { y: 40, stagger: .14 });

gsap.fromTo('.phil-bar', { scaleX: 0 }, {
  scaleX: 1, duration: 1.2, ease: 'power3.out', transformOrigin: 'center',
  scrollTrigger: { trigger: '#philosophy', start: 'top 78%', once: true }
});
gsap.fromTo('blockquote', { opacity: 0, y: 50 }, {
  opacity: 1, y: 0, duration: 1.3, ease: 'power3.out',
  scrollTrigger: { trigger: '#philosophy', start: 'top 70%', once: true }
});

/* ── HORIZONTAL SHOWCASE (pinned scroll-drive) ───────────────────────
   ResizeObserver recalculates after images load — avoids stale widths
   ─────────────────────────────────────────────────────────────────── */
function initHScroll() {
  const section = document.getElementById('hscroll');
  const track = document.getElementById('hscrollTrack');
  if (!section || !track || innerWidth < 768) return;
  let st = null;

  function build() {
    if (st) { st.kill(); st = null; gsap.set(track, { x: 0 }); }
    const sw = track.scrollWidth - innerWidth;
    if (sw <= 0) return;
    st = ScrollTrigger.create({
      trigger: section, start: 'top top', end: () => `+=${track.scrollWidth - innerWidth}`,
      scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: self => gsap.set(track, { x: -(track.scrollWidth - innerWidth) * self.progress })
    });
  }

  const ro = new ResizeObserver(() => { ScrollTrigger.refresh(); build(); });
  ro.observe(track);
  window.addEventListener('resize', () => {
    if (innerWidth < 768) { if (st) { st.kill(); st = null; gsap.set(track, { x: 0 }); } }
    else build();
  }, { passive: true });
  build();
}
initHScroll();

/* ── 3D CARD TILT — applied to project cards, showcase cards,
   and the studio image frame (rAF lerp loop, no setTimeout races) ── */
function applyTilt(selector, strength) {
  document.querySelectorAll(selector).forEach(card => {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * strength * 2;
      ty = -((e.clientY - r.top) / r.height - .5) * strength * 2;
      if (!raf) loop();
    });
    card.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) loop(); });
    function loop() {
      cx += (tx - cx) * .11; cy += (ty - cy) * .11;
      const target = card.matches('[data-tilt]') ? card.querySelector('.pcard-in')
                    : card.matches('[data-tilt-soft]') ? (card.querySelector('.studio-img-frame') || card)
                    : card;
      gsap.set(target, {
        rotateY: cx, rotateX: cy, transformPerspective: 1000,
        scale: Math.abs(cx) + Math.abs(cy) > .1 ? 1.015 : 1
      });
      if (Math.abs(cx - tx) > .02 || Math.abs(cy - ty) > .02) { raf = requestAnimationFrame(loop); }
      else { raf = null; }
    }
  });
}
applyTilt('[data-tilt]', 7);       // featured project cards — fuller tilt
applyTilt('[data-tilt-soft]', 4);  // studio image + showcase cards — gentler

/* ── HORIZONTAL SHOWCASE CARDS: lighter tilt too (separate target) ── */
document.querySelectorAll('.hcard').forEach(card => {
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - .5) * 5 * 2;
    ty = -((e.clientY - r.top) / r.height - .5) * 5 * 2;
    if (!raf) loop();
  });
  card.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) loop(); });
  function loop() {
    cx += (tx - cx) * .11; cy += (ty - cy) * .11;
    gsap.set(card, { rotateY: cx, rotateX: cy, transformPerspective: 900, scale: Math.abs(cx) + Math.abs(cy) > .1 ? 1.02 : 1 });
    if (Math.abs(cx - tx) > .02 || Math.abs(cy - ty) > .02) { raf = requestAnimationFrame(loop); }
    else { raf = null; }
  }
});

/* ── FILTER BUTTONS (visual only — all projects shown) ─────────────── */
document.querySelectorAll('.fbtn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.fbtn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  });
});

})();
