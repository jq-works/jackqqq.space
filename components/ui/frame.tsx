import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

// Slightly skewed quadrilaterals (like the reference's tilted frames). Stroke stays 1.5px at any size.
const SHAPES = ['6,2 99,0 100,97 0,100', '0,4 97,0 100,96 3,100', '3,0 100,5 97,100 0,95', '0,0 94,3 100,100 5,97'];

export function Frame({ children, className, shape = 0, thick }: { children: ReactNode; className?: string; shape?: number; thick?: boolean }) {
  return (
    <div className={cn('relative', className)}>
      <svg aria-hidden className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points={SHAPES[shape % SHAPES.length]} style={{ fill: 'var(--bg)' }} stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {thick && <polyline points="100,0 100,97" stroke="currentColor" strokeWidth={7} vectorEffect="non-scaling-stroke" />}
      </svg>
      <div className="relative h-full">{children}</div>
    </div>
  );
}
