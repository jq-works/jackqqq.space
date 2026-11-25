'use client';

import { animate, onScroll, splitText, stagger } from 'animejs';
import { useAnimeScope } from '@/hooks/use-anime-scope';

const LINE = 'Setiap website dimulai dari satu ide yang dirapikan, dibangun dengan cepat, lalu diuji sampai benar-benar dipakai orang.';

/**
 * Typographic statement (replaces the old doodle-circle section). A huge sentence whose words light up one by one while the section
 * scrolls through, with a soft glow that drifts behind it. Scroll-linked, opacity/transform only. Reduced motion: all words lit.
 */
export function Statement() {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const scroll = () => onScroll({ target: root, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'top' }, sync: true });
    const { words } = splitText(root.querySelector<HTMLElement>('#statementText')!, { words: true });
    const a = [
      animate(words, {
        opacity: [0.16, 1], ease: 'linear', delay: stagger(60),
        autoplay: onScroll({ target: root.querySelector('#statementText')!, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'center' }, sync: true }),
      }),
      animate(root.querySelector('#statementGlow')!, { translateY: [80, -80], ease: 'linear', autoplay: scroll() }),
    ];
    return () => a.forEach((x) => x.revert());
  });

  return (
    <section ref={ref} id="pernyataan" className="surface-ink relative overflow-hidden px-5 py-36 sm:px-8 sm:py-52">
      <div id="statementGlow" aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 size-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/.07),transparent)]" />
      <div className="relative mx-auto max-w-5xl">
        <p className="eyebrow">Cara kerja</p>
        <p id="statementText" className="grad mt-8 text-[clamp(1.9rem,5vw,4.2rem)] leading-[1.12] font-light tracking-[-0.03em]">{LINE}</p>
      </div>
    </section>
  );
}
