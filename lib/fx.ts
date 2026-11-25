import { createAnimatable } from 'animejs';
import { prefersReducedMotion } from '@/lib/motion';

// Interaction primitives in the style of 21st.dev (spotlight card, 3D tilt, magnetic button). All three are mouse-only:
// no effect on touch (a finger has no hover), and none under prefers-reduced-motion. Each returns a cleanup function.
// Only transform and CSS variables are animated; the spotlight itself is a CSS radial-gradient (see .spot in globals.css).
const fine = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches && !prefersReducedMotion();
const mouse = (e: PointerEvent) => e.pointerType === 'mouse';

/** A soft light that follows the pointer inside the element. Set --mx/--my (px); the .spot class draws the gradient. */
export function spotlight(els: HTMLElement[]) {
  if (!fine()) return () => {};
  const offs = els.map((el) => {
    const move = (e: PointerEvent) => {
      if (!mouse(e)) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      el.style.setProperty('--spot', '1');
    };
    const leave = () => el.style.setProperty('--spot', '0');
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.style.removeProperty('--spot'); };
  });
  return () => offs.forEach((o) => o());
}

/**
 * 3D tilt toward the pointer (rotateX/rotateY, max degrees). The element's PARENT needs `perspective` (e.g. [perspective:900px]);
 * `glare` adds the CSS variable --gx/--gy (0..1) so a highlight can follow the tilt.
 */
export function tilt3d(els: HTMLElement[], max = 8) {
  if (!fine()) return () => {};
  const offs = els.map((el) => {
    const a = createAnimatable(el, { rotateX: 350, rotateY: 350, scale: 300, ease: 'out(3)' }) as unknown as Record<string, (v: number) => void> & { revert: () => void };
    const move = (e: PointerEvent) => {
      if (!mouse(e)) return;
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      a.rotateY(nx * max);
      a.rotateX(-ny * max);
      a.scale(1.02);
    };
    const leave = () => { a.rotateX(0); a.rotateY(0); a.scale(1); };
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); a.revert(); };
  });
  return () => offs.forEach((o) => o());
}

/**
 * The element is pulled toward the pointer while the pointer is over it (its box grown by `pad` px) and springs back on leave.
 * Keep `pad` smaller than half the gap between neighbours, or two neighbouring elements would be pulled at once and overlap.
 */
export function magnetic(els: HTMLElement[], strength = 0.35, pad = 12) {
  if (!fine()) return () => {};
  const offs = els.map((el) => {
    const a = createAnimatable(el, { translateX: 400, translateY: 400, ease: 'out(3)' }) as unknown as Record<string, (v: number) => void> & { revert: () => void };
    const move = (e: PointerEvent) => {
      if (!mouse(e)) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const near = Math.abs(dx) <= r.width / 2 + pad && Math.abs(dy) <= r.height / 2 + pad;
      a.translateX(near ? dx * strength : 0);
      a.translateY(near ? dy * strength : 0);
    };
    const leave = () => { a.translateX(0); a.translateY(0); };
    addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    return () => { removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); a.revert(); };
  });
  return () => offs.forEach((o) => o());
}
