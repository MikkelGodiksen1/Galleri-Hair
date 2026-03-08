/* ═══════════════════════════════════════════════════════
   Galleri Hair – Main JS
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── NAV: Scroll state ── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial
})();

/* ── NAV: Mobile burger ── */
(function initBurger() {
  const burger = document.querySelector('.nav__burger');
  if (!burger) return;

  // Inject mobile nav
  const mobile = document.createElement('nav');
  mobile.className = 'nav__mobile';
  mobile.setAttribute('aria-label', 'Mobilnavigation');

  const links = [
    { href: '#om-os',    label: 'Om os' },
    { href: '#team',     label: 'Team' },
    { href: '#ydelser',  label: 'Ydelser' },
    { href: '#instagram',   label: 'Galleri' },
    { href: '#anmeldelser', label: 'Anmeldelser' },
    { href: '#aabent',      label: 'Åbningstider' },
    { href: '#kontakt',  label: 'Kontakt' },
    { href: 'https://salonbook.one/?galleri.hair', label: 'Book tid →', external: true },
  ];

  links.forEach(({ href, label, external }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (external) { a.target = '_blank'; a.rel = 'noopener'; }
    a.addEventListener('click', close);
    mobile.appendChild(a);
  });

  document.body.appendChild(mobile);

  function open() {
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    mobile.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobile.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? close() : open();
  });

  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── SMOOTH HOVER: Service cards ── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX = y * 4;
      const tiltY = -x * 4;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── INSTAGRAM KARRUSEL ── */
(function initIgCarousel() {
  const track    = document.getElementById('igTrack');
  const dotsWrap = document.getElementById('igDots');
  if (!track) return;

  const slides   = Array.from(track.children);
  const btnPrev  = document.querySelector('.ig-carousel__btn--prev');
  const btnNext  = document.querySelector('.ig-carousel__btn--next');

  function getSlidesVisible() {
    if (window.innerWidth <= 600)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  let current = 0;

  function maxIndex() {
    return Math.max(0, slides.length - getSlidesVisible());
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const d = document.createElement('button');
      d.className = 'dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const slideW = slides[0].offsetWidth + 24; // gap = 1.5rem = 24px
    track.style.transform = `translateX(-${current * slideW}px)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  btnPrev && btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext && btnNext.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  buildDots();
  window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIndex())); });
})();

/* ── INSTAGRAM: Click-to-load facade ── */
(function initIgFacade() {
  document.querySelectorAll('.ig-placeholder').forEach(placeholder => {
    placeholder.addEventListener('click', function () {
      const src = this.dataset.src;
      if (!src) return;
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.className = 'ig-frame';
      iframe.allowTransparency = 'true';
      iframe.style.cssText = 'width:100%;height:calc(100% + 72px + 220px);margin-top:-72px;border:none;display:block;background:#fafafa;';
      const wrap = this.parentNode;
      wrap.replaceChild(iframe, this);
    });
  });
})();

/* ── ACTIVE nav link highlight on scroll ── */
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();
