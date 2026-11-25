'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { animate, createDrawable, onScroll, spring, stagger, utils } from 'animejs';
import { projectItem, type Project } from '@/components/project-item';
import { Viewer, type ViewerItem } from '@/components/ui/viewer';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { spotlight, tilt3d } from '@/lib/fx';
import { lightWords, revealTitles, whenVisible } from '@/lib/motion';

/**
 * Every project in one page: a filterable grid of cards. Tap a card (or its button) for the detail window with photos.
 * The filter is a tag chip row; cards that do not match fade out of the way (opacity + scale, never height) and the
 * grid re-flows. Motion: title letters, cards spring in once, doodles draw, cards drift with scroll (mouse or touch).
 */
export function AllProjects({ projects, images }: { projects: Project[]; images: Record<string, string[]> }) {
  const [open, setOpen] = useState<ViewerItem | null>(null);
  const [tag, setTag] = useState('Semua');
  const tags = ['Semua', ...Array.from(new Set(projects.flatMap((p) => p.tags)))];
  const shown = projects.filter((p) => tag === 'Semua' || p.tags.includes(tag));

  const ref = useAnimeScope<HTMLElement>((sec) => {
    const stops = [revealTitles(sec), lightWords(sec)];
    const a: Array<{ revert: () => void }> = [];
    a.push(animate(sec.querySelector('.split-title')!, { translateY: [14, -14], ease: 'linear', autoplay: onScroll({ target: sec, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'top' }, sync: true }) }));
    return () => { stops.forEach((s) => s()); a.forEach((x) => x.revert()); };
  });

  // Cards enter again whenever the filtered set changes (keyed by tag), so the grid never shows a static swap.
  const grid = (el: HTMLElement | null) => {
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.pcard'));
    const lines = createDrawable(el.querySelectorAll('.pcard-art > svg > *'));
    utils.set(cards, { opacity: 0, translateY: 36, scale: 0.96 });
    utils.set(lines, { draw: '0 0' });
    const stop = whenVisible(el, () => {
      animate(cards, { opacity: 1, translateY: 0, scale: 1, ease: spring({ bounce: 0.3, duration: 800 }), delay: stagger(70) });
      animate(lines, { draw: '0 1', duration: 900, delay: stagger(30, { start: 250 }), ease: 'inOutQuad' });
    }, 0.05);
    // 21st.dev style: the card tilts in 3D toward the pointer and a spotlight + lit edge follow it (mouse only)
    const inner = cards.map((c) => c.querySelector<HTMLElement>('.pcard-in')!);
    const stopTilt = tilt3d(inner, 5);
    const stopSpot = spotlight(inner);
    return () => { stop(); stopTilt(); stopSpot(); };
  };

  return (
    <section ref={ref} className="surface-paper  min-h-[80svh] overflow-x-clip px-5 pt-36 pb-28 sm:px-8 sm:pt-44">
      <div className="mx-auto max-w-6xl">
        <div className="relative">
          <p className="eyebrow">Portfolio</p>
          <h1 className="split-title grad-letters mt-4 text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[1.04] font-extralight tracking-[-0.035em]">Semua project</h1>
        </div>
        <p className="light-words mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
          {projects.length} project: website, sistem, dan produksi yang sudah dikerjakan. Pilih satu untuk melihat foto dan penjelasan lengkapnya.
        </p>

        <div role="group" aria-label="Filter teknologi" className="mt-8 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)} className="rounded-full border border-line px-4 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-ink hover:text-paper aria-pressed:bg-ink aria-pressed:text-paper">
              {t}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">{shown.length} project ditampilkan</p>

        <div key={tag} ref={grid} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => {
            const cover = images[p.slug]?.[0];
            return (
              <article key={p.slug} className="pcard group [perspective:1000px]">
                <div className="pcard-in spot spot-edge flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-mist">
                <button type="button" data-cursor="Lihat" onClick={() => setOpen(projectItem(p, images))} aria-label={`Lihat detail ${p.title}`} className="pcard-art relative grid aspect-[4/3] w-full place-items-center overflow-hidden bg-mist">
                  {cover ? (
                    <Image src={cover} alt="" fill sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 ease-out-quint group-hover:scale-105" />
                  ) : (
                    <span className="grad text-6xl font-extralight tracking-[-0.04em] transition-transform duration-300 ease-out-quint group-hover:scale-110" aria-hidden>{String(projects.indexOf(p) + 1).padStart(2, '0')}</span>
                  )}
                </button>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium">
                    <span className="chip-pill">{p.meta}</span>
                    <span className="eyebrow">{p.tags.join(' / ')}</span>
                  </p>
                  <h2 className="grad text-2xl font-semibold tracking-[-0.02em]">{p.title}</h2>
                  <p className="text-sm font-light">{p.sub}</p>
                  <p className="text-sm leading-relaxed text-muted">{p.desc}</p>
                  <button type="button" onClick={() => setOpen(projectItem(p, images))} className="mt-auto w-fit pt-3 text-sm font-semibold underline underline-offset-4">Lihat detail</button>
                </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14">
          <Link href="/#project" className="inline-flex h-11 items-center rounded-full border border-line px-6 text-sm font-medium transition-transform duration-150 hover:scale-105 active:scale-95">‹ Kembali ke beranda</Link>
        </div>
      </div>
      <Viewer item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
