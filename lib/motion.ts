import { animate, onScroll, spring, splitText, stagger, utils } from 'animejs';

// Motion tokens (DESIGN-SYSTEM section 8.2)
export const EASE = { slow: 'outExpo', in: 'inExpo' } as const;
export const SPRING = {
  soft: () => spring({ bounce: 0.35, duration: 800 }),
  pop: () => spring({ bounce: 0.5, duration: 700 }),
  button: () => spring({ bounce: 0.45, duration: 600 }),
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Run fn once when el becomes visible. */
export function whenVisible(el: Element, fn: (el: Element) => void, threshold = 0.25) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        fn(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold });
  io.observe(el);
  return () => io.disconnect();
}

/**
 * `.split-title` letters spring up one by one with a random tilt when visible, then tilt in a wave when
 * hovered / touched (titles only, DESIGN-SYSTEM 8.6). Returns cleanup.
 */
export function revealTitles(root: Element) {
  const offs: Array<() => void> = [];
  Array.from(root.querySelectorAll<HTMLElement>('.split-title')).forEach((el) => {
    const { chars } = splitText(el, { chars: { wrap: 'clip' } });
    utils.set(chars, { translateY: '110%', rotate: () => utils.random(-10, 10) });
    offs.push(whenVisible(el, () => animate(chars, { translateY: ['110%', '0%'], rotate: 0, ease: spring({ bounce: 0.3, duration: 900 }), delay: stagger(30) }), 0.4));
    const wave = () => animate(chars, { rotate: [{ to: -9, duration: 120 }, { to: 0, ease: spring({ bounce: 0.6, duration: 500 }) }], skewX: [{ to: -6, duration: 120 }, { to: 0, ease: spring({ bounce: 0.6, duration: 500 }) }], delay: stagger(28) });
    el.addEventListener('pointerenter', wave);
    el.addEventListener('touchstart', wave, { passive: true });
    offs.push(() => { el.removeEventListener('pointerenter', wave); el.removeEventListener('touchstart', wave); });
  });
  return () => offs.forEach((o) => o());
}

/** `.light-words` paragraphs light up word by word while scrolled through (opacity + 10px rise). Returns cleanup. */
export function lightWords(root: Element) {
  const anims = Array.from(root.querySelectorAll<HTMLElement>('.light-words')).map((el) => {
    const { words } = splitText(el, { words: true });
    return animate(words, {
      opacity: [0.18, 1], translateY: [10, 0], ease: 'linear', delay: stagger(40),
      autoplay: onScroll({ target: el, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'center' }, sync: true }),
    });
  });
  return () => anims.forEach((x) => x.revert());
}

/** `.reveal` blocks fade up once when visible. Returns cleanup. */
export function revealBlocks(root: Element) {
  const stops = Array.from(root.querySelectorAll<HTMLElement>('.reveal')).map((el) => {
    utils.set(el, { opacity: 0, translateY: 24 });
    return whenVisible(el, () => animate(el, { opacity: 1, translateY: 0, duration: 700, ease: 'outExpo' }), 0.15);
  });
  return () => stops.forEach((s) => s());
}
