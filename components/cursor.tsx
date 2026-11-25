'use client';

import { useEffect, useRef } from 'react';
import { createAnimatable } from 'animejs';
import { prefersReducedMotion } from '@/lib/motion';

// 24px ring, only for fine pointers and only after the first mouse move. Over an element with data-cursor="Kata" the ring
// grows into a pill showing that word ("Buka", "Seret", "Kirim"); over other links and buttons it just grows.
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !matchMedia('(pointer: fine)').matches) return;
    const a = createAnimatable(el, { x: 180, y: 180, scale: 250, ease: 'out(3)' });
    let word = '';
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      el.style.opacity = '1';
      (a as any).x(e.clientX - 12); // eslint-disable-line @typescript-eslint/no-explicit-any
      (a as any).y(e.clientY - 12); // eslint-disable-line @typescript-eslint/no-explicit-any
      const t = e.target as Element | null;
      const tagged = t?.closest?.<HTMLElement>('[data-cursor]');
      const next = tagged?.dataset.cursor ?? '';
      if (next !== word) {
        word = next;
        if (label.current) label.current.textContent = word;
        el.dataset.labeled = word ? 'true' : 'false';
      }
      const hot = !!t?.closest?.('a,button,[role="button"]');
      (a as any).scale(word ? 3.4 : hot ? 2.4 : 1); // eslint-disable-line @typescript-eslint/no-explicit-any
      if (label.current) label.current.style.transform = `scale(${word ? 1 / 3.4 : 1})`;
    };
    addEventListener('pointermove', move, { passive: true });
    return () => {
      removeEventListener('pointermove', move);
      a.revert();
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[200] flex size-6 items-center justify-center rounded-full border-2 border-white opacity-0 mix-blend-difference">
      {/* ring grows 3.4x; the word is counter-scaled by 1/3.4 so it stays 13px on screen */}
      <span ref={label} className="cursor-label text-[13px] leading-none font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-150 [[data-labeled=true]>&]:opacity-100" style={{ transform: 'scale(1)' }} />
    </div>
  );
}
