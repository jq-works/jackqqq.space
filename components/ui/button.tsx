'use client';

import { useEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import Link from 'next/link';
import { animate, utils } from 'animejs';
import { cn } from '@/lib/cn';
import { magnetic } from '@/lib/fx';
import { prefersReducedMotion } from '@/lib/motion';

type Props = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  /** solid = light pill (main action); ghost = hairline pill (secondary). `oval` is kept as an alias of ghost. */
  variant?: 'solid' | 'ghost' | 'oval';
  /** small light sparks fly out from the press point */
  burst?: boolean;
  href?: string;
  children: ReactNode;
};

function sparkBurst(x: number, y: number) {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < 7; i++) {
    const s = document.createElement('span');
    s.className = 'pointer-events-none fixed z-[100] size-1.5 rounded-full bg-white mix-blend-difference';
    s.style.left = `${x - 3}px`;
    s.style.top = `${y - 3}px`;
    document.body.appendChild(s);
    const ang = (Math.PI * 2 * i) / 7 + utils.random(-0.3, 0.3);
    const dist = utils.random(40, 84);
    animate(s, { translateX: Math.cos(ang) * dist, translateY: Math.sin(ang) * dist, scale: [1, 0.2], opacity: [1, 0], duration: 600, ease: 'outQuad', onComplete: () => s.remove() });
  }
}

const base = 'group relative inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-transform duration-150 ease-out-quint hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40';
const solid = 'bg-[#f5f5f7] text-black shadow-[0_0_0_1px_rgba(255,255,255,.2),0_8px_30px_rgba(255,255,255,.08)]';
const ghost = 'border border-white/15 bg-white/[.03] text-[#f5f5f7] hover:border-white/30 hover:bg-white/[.07]';

export function Button({ variant = 'ghost', burst = false, href, className, children, onClick, ...rest }: Props) {
  const el = useRef<HTMLElement | null>(null);
  useEffect(() => (el.current ? magnetic([el.current], 0.3, 14) : undefined), []);
  const cls = cn(base, variant === 'solid' ? solid : ghost, className);
  if (href?.startsWith('/')) {
    return (
      <Link ref={(n) => { el.current = n; }} href={href} className={cls} onClick={(e) => burst && sparkBurst(e.clientX, e.clientY)}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={(n) => { el.current = n; }} href={href} className={cls} onClick={(e) => burst && sparkBurst(e.clientX, e.clientY)} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return (
    <button
      ref={(n) => { el.current = n; }}
      type="button"
      className={cls}
      onClick={(e) => {
        if (burst) sparkBurst(e.clientX, e.clientY);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
