/**
 * Momentum-smoothed page scroll.
 * Feel taken from Effects_Glossary [Motion] Momentum-smoothed page scroll
 * (antigravity.google ScrollSmoother: fast start, ~0.5s settle, expo tail).
 *
 * Native scrollTop is updated each frame so the LINE rail loop, which reads
 * scrollY, stays in sync. No transform wrapper: the fixed mast stays put.
 * Touch-only devices keep native scroll. Reduced-motion skips this.
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

const touchOnly = () => !finePointer.matches && navigator.maxTouchPoints > 0;

if (reduce.matches || touchOnly()) {
  // Native scroll. Hash links still work.
} else {
  const TAU = 0.16;
  const html = document.documentElement;
  html.style.scrollBehavior = 'auto';
  document.body.style.scrollBehavior = 'auto';

  let current = window.scrollY;
  let target = window.scrollY;
  let running = false;
  let last = performance.now();
  let dragging = false;

  const maxY = () => Math.max(0, html.scrollHeight - window.innerHeight);
  const clamp = (n) => Math.max(0, Math.min(maxY(), n));

  const mastOffset = () => {
    const mast = document.querySelector('.mast');
    return mast ? Math.ceil(mast.getBoundingClientRect().height) : 52;
  };

  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const k = 1 - Math.exp(-dt / TAU);
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.35) {
      current = target;
      running = false;
    }
    window.scrollTo(0, current);
    if (running) requestAnimationFrame(tick);
  };

  const go = () => {
    if (running || dragging) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  };

  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.defaultPrevented) return;
      e.preventDefault();
      let dy = e.deltaY;
      if (e.shiftKey && e.deltaX) dy = e.deltaX;
      if (e.deltaMode === 1) dy *= 16;
      if (e.deltaMode === 2) dy *= window.innerHeight;
      target = clamp(target + dy);
      go();
    },
    { passive: false }
  );

  window.addEventListener(
    'scroll',
    () => {
      if (running) return;
      current = window.scrollY;
      target = window.scrollY;
    },
    { passive: true }
  );

  window.addEventListener('mousedown', (e) => {
    if (e.clientX >= html.clientWidth) dragging = true;
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    current = window.scrollY;
    target = window.scrollY;
  });

  const scrollToHash = (hash, push) => {
    if (!hash || hash === '#') return false;
    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return false;
    if (push) history.pushState(null, '', hash);
    target = clamp(el.getBoundingClientRect().top + window.scrollY - mastOffset());
    go();
    return true;
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const url = new URL(a.href, window.location.href);
    if (url.pathname !== window.location.pathname) return;
    if (scrollToHash(url.hash, true)) e.preventDefault();
  });

  window.addEventListener('hashchange', () => {
    scrollToHash(location.hash, false);
  });

  if (location.hash) {
    requestAnimationFrame(() => scrollToHash(location.hash, false));
  }
}
