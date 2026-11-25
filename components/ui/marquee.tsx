'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate } from 'animejs';
import { cn } from '@/lib/cn';
import { prefersReducedMotion } from '@/lib/motion';

// Duplicated 2x so -50% loops seamlessly. Speeds up with page scroll velocity (max 5x), eases back.
export function Marquee({ children, reverse, duration = 28000, className, label }: { children: ReactNode; reverse?: boolean; duration?: number; className?: string; label: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    el.style.animation = 'none'; // anime.js takes over from the CSS fallback
    const a = animate(el, { translateX: reverse ? ['-50%', '0%'] : ['0%', '-50%'], duration, ease: 'linear', loop: true });
    let boost = 1, target = 1, lastY = scrollY, raf = 0, hover = false;
    const onScroll = () => {
      target = Math.min(1 + Math.abs(scrollY - lastY) * 0.12, 5);
      lastY = scrollY;
    };
    const tick = () => {
      target += (1 - target) * 0.08;
      boost += (target - boost) * 0.12;
      a.speed = hover ? 0 : boost;
      raf = requestAnimationFrame(tick);
    };
    const wrap = el.parentElement!;
    const over = () => (hover = true), out = () => (hover = false);
    wrap.addEventListener('pointerenter', over);
    wrap.addEventListener('pointerleave', out);
    addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      wrap.removeEventListener('pointerenter', over);
      wrap.removeEventListener('pointerleave', out);
      a.revert();
    };
  }, [reverse, duration]);

  return (
    <div className={cn('marquee overflow-hidden', className)} aria-label={label}>
      <div ref={track} className={cn('marquee-track flex w-max items-center', reverse && 'reverse')} style={{ animationDuration: `${duration}ms` }} aria-hidden>
        {children}
        {children}
      </div>
    </div>
  );
}
