'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { animate, createAnimatable, createDrawable, onScroll, spring, stagger, utils } from 'animejs';
import { Button } from '@/components/ui/button';
import { Viewer, type ViewerItem } from '@/components/ui/viewer';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { projectItem, type Project } from '@/components/project-item';
import { waLink } from '@/lib/site';
import { spotlight } from '@/lib/fx';
import { lightWords, prefersReducedMotion, revealTitles, whenVisible } from '@/lib/motion';

// Folder look per project: paper, light grey, black, repeating (neighbours always differ).
const VARIANTS = ['fv-paper', 'fv-mist', 'fv-ink'];

/**
 * Stacking folders (CSS sticky), laid out like index tabs (layout taken from the reference screenshots, look unchanged): the
 * tabs sit side by side along the top edge and every folder sticks at the same spot, so a new panel slides over the previous one while all tabs stay on screen. Click a tab to bring
 * that folder forward. The last folder is not a project: it links to the full portfolio page (/project).
 * Anime.js adds the scroll-linked part: the covered panel dims while the next one arrives, the art turns with
 * scroll, and each folder draws itself the first time it shows. Reduced motion: still stacks (plain CSS), no animation.
 */
export function Projects({ images, featured, total }: { images: Record<string, string[]>; featured: Project[]; total: number }) {
  const [open, setOpen] = useState<ViewerItem | null>(null);
  const show = (p: Project) => setOpen(projectItem(p, images));
  const rest = total - featured.length; // projects only shown on /project
  const n = featured.length + 1; // the last folder is the "explore more" folder
  const items = [...featured.map((p) => ({ kind: 'project' as const, p })), { kind: 'more' as const }];

  const root = useAnimeScope<HTMLElement>((sec) => {
    const stops = [revealTitles(sec), lightWords(sec)];
    const a: Array<{ revert: () => void }> = [];
    const stack = sec.querySelector<HTMLElement>('#folders')!;
    const folders = Array.from(sec.querySelectorAll<HTMLElement>('.folder'));
    const track = (target: Element) =>
      onScroll({ target, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'top' }, sync: true });
    // scrubbed from "next folder reaches the bottom of this one" until "it has reached its sticky spot"
    const until = (next: Element, from: number, stuckTop: number) =>
      onScroll({ target: next, enter: { target: 'top', container: from }, leave: { target: 'top', container: stuckTop }, sync: true });

    // title drifts with scroll
    a.push(animate(sec.querySelector('.split-title')!, { translateY: [18, -18], ease: 'linear', autoplay: track(sec) }));

    // art turns a little against the scroll while the stack passes
    folders.forEach((f, i) => a.push(animate(f.querySelector('.folder-art')!, { rotate: [i % 2 ? 3 : -3, i % 2 ? -3 : 3], translateY: [14, -14], ease: 'linear', autoplay: track(stack) })));

    // The covered PANEL only dims while the next folder slides over it. It is never translated or scaled: any movement of the panel
    // that the tab does not share opens a gap under the tab (translateY did) or pulls the edges off the tab row (scale did). Top-left is square because tab 01 always
    // sits on it (a rounded corner there left a notch under the tab); top-right is square only on the last folder, whose tab sits on it. Tabs stay put: they are the row the reader navigates by.
    // Distances depend on the folder height, so this is rebuilt when the stack is resized.
    let cover: Array<{ revert: () => void }> = [];
    const buildCover = () => {
      cover.forEach((x) => x.revert());
      cover = [];
      folders.forEach((f, i) => {
        const next = folders[i + 1];
        if (!next) return;
        const stuckTop = parseFloat(getComputedStyle(next).top) || 0;
        const from = Math.min(stuckTop + f.offsetHeight, innerHeight);
        cover.push(animate(f.querySelector('.folder-dim')!, { opacity: [0, 0.14], ease: 'linear', autoplay: until(next, from, stuckTop) }));
      });
    };
    buildCover();
    const ro = new ResizeObserver(buildCover);
    ro.observe(stack);

    // each folder draws itself the first time it shows: text rises, art strokes are drawn
    folders.forEach((f) => {
      const text = Array.from(f.querySelectorAll<HTMLElement>('.f-text > *'));
      const lines = createDrawable(f.querySelectorAll('.folder-art > svg > *')); // empty when the folder shows a photo
      utils.set(text, { opacity: 0, translateY: 18 });
      utils.set(lines, { draw: '0 0' });
      stops.push(whenVisible(f.querySelector('.folder-body')!, () => {
        animate(text, { opacity: 1, translateY: 0, duration: 700, ease: 'outExpo', delay: stagger(70) });
        animate(lines, { draw: '0 1', duration: 1000, delay: stagger(40, { start: 250 }), ease: 'inOutQuad' });
      }, 0.15));
    });

    // art wobble on hover / touch
    const offs = folders.map((f) => {
      const art = f.querySelector<HTMLElement>('.folder-art')!;
      const pop = () => animate(art, { scale: [{ to: 1.06, duration: 130 }, { to: 1, ease: spring({ bounce: 0.5, duration: 500 }) }] });
      f.addEventListener('pointerenter', pop);
      return () => f.removeEventListener('pointerenter', pop);
    });
    // 21st.dev style: a spotlight follows the pointer inside each panel
    const stopSpot = spotlight(folders.map((f) => f.querySelector<HTMLElement>('.folder-body')!));
    return () => { stops.forEach((s) => s()); a.forEach((x) => x.revert()); offs.forEach((o) => o()); ro.disconnect(); cover.forEach((x) => x.revert()); stopSpot(); };
  });

  // "Hover preview": over a tab, a small card with the project's cover (or doodle) and name follows the pointer.
  // Mouse only. Pure transform on a fixed element; the tab itself is unchanged.
  const [peek, setPeek] = useState<{ title: string; sub: string; img?: string; n: string } | null>(null);
  const peekEl = useRef<HTMLDivElement>(null);
  const peekFx = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);
  useEffect(() => {
    const el = peekEl.current;
    if (!el || prefersReducedMotion() || !matchMedia('(pointer: fine)').matches) return;
    const a = createAnimatable(el, { x: 220, y: 220, ease: 'out(3)' }) as unknown as { x: (v: number) => void; y: (v: number) => void; revert: () => void };
    peekFx.current = a;
    const move = (e: PointerEvent) => { if (e.pointerType === 'mouse') { a.x(e.clientX + 18); a.y(e.clientY + 22); } };
    addEventListener('pointermove', move, { passive: true });
    return () => { removeEventListener('pointermove', move); a.revert(); peekFx.current = null; };
  }, []);

  // Plain scroll logic, independent of animation: once a folder is fully covered its panel must not be focusable or read out.
  // Also wires the tabs to scroll their folder into place.
  const wire = (el: HTMLElement | null) => {
    if (!el) return;
    const folders = Array.from(el.querySelectorAll<HTMLElement>('.folder'));
    let tick = false;
    const update = () => {
      tick = false;
      folders.forEach((f, i) => {
        const next = folders[i + 1];
        const covered = !!next && next.getBoundingClientRect().top <= f.getBoundingClientRect().top + 6;
        f.querySelector<HTMLElement>('.folder-body')!.inert = covered;
        f.dataset.covered = String(covered);
      });
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(update); } };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    const go = (e: Event) => {
      const tab = (e.target as Element).closest<HTMLElement>('.folder-tab');
      if (!tab) return;
      const i = Number(tab.dataset.i);
      const anchor = el.querySelector<HTMLElement>(`[data-anchor="${i}"]`)!;
      const top = parseFloat(getComputedStyle(folders[i]).top) || 0;
      scrollTo({ top: anchor.getBoundingClientRect().top + scrollY - top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };
    el.addEventListener('click', go);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); el.removeEventListener('click', go); };
  };

  return (
    <section ref={root} id="project" className="surface-paper  overflow-x-clip border-t border-line px-5 pt-24 pb-32 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative">
          <p className="eyebrow">Project</p>
          <h2 className="split-title grad-letters mt-4 text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[1.04] font-extralight tracking-[-0.035em]">Project pilihan</h2>
        </div>
        <p className="light-words mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
          {featured.length} project pilihan. Scroll dan tiap map menimpa map sebelumnya, tab-nya tetap berjajar di atas. Map terakhir membuka semua project.
        </p>

        <div id="folders" ref={wire} className="mt-12 [--base:6.5rem] [--tab:2.75rem] sm:[--tab:3.25rem]">
          {items.map((it, i) => {
            const v = VARIANTS[i % VARIANTS.length];
            const isMore = it.kind === 'more';
            const p = it.kind === 'project' ? it.p : null;
            const cover = p ? images[p.slug]?.[0] : undefined;
            return (
              <Fragment key={p?.slug ?? 'more'}>
                <div data-anchor={i} aria-hidden className="h-0" />
                <article className={`folder pointer-events-none sticky top-[var(--base)] mb-8 origin-top pt-[var(--tab)] sm:mb-12 ${v}`}>
                  {/* tabs sit side by side along the top edge (one slot per folder); same rounded, thin-bordered look as before */}
                  <button
                    type="button"
                    data-i={i}
                    aria-label={isMore ? 'Buka folder Explore more project' : `Buka project ${p!.title}`}
                    data-cursor="Buka"
                    onPointerEnter={(e) => { if (e.pointerType === 'mouse' && peekFx.current) { peekFx.current.x(e.clientX + 18); peekFx.current.y(e.clientY + 22); setPeek(p ? { title: p.title, sub: p.sub, img: cover, n: String(i + 1).padStart(2, '0') } : { title: 'Explore more project', sub: 'Lihat semua project', n: '↗' }); } }}
                    onPointerLeave={() => setPeek(null)}
                    style={{ left: `calc(${i} * 100% / ${n})`, width: `calc(100% / ${n})` }}
                    className="folder-tab pointer-events-auto absolute top-0 z-10 flex h-[calc(var(--tab)+1px)] items-center justify-center gap-1.5 rounded-t-xl border border-b-0 border-line bg-bg px-1 text-[11px] font-semibold text-fg transition-transform duration-150 ease-out-quint hover:-translate-y-0.5 sm:gap-2 sm:px-3 sm:text-sm"
                  >
                    <span className="font-light">{String(i + 1).padStart(2, '0')}</span>
                    <span className="hidden max-w-[8rem] truncate sm:inline">{isMore ? 'Semua project' : p!.title}</span>
                  </button>

                  <div className={`folder-body spot pointer-events-auto relative flex origin-top items-center rounded-b-2xl border border-line bg-bg px-5 py-8 text-fg sm:px-10 sm:py-12 min-h-[max(26rem,calc(100svh-var(--base)-var(--tab)-1.5rem))] ${i === n - 1 ? '' : 'rounded-tr-2xl'}`}>
                    <span aria-hidden className="folder-dim pointer-events-none absolute inset-0 rounded-[inherit] bg-fg opacity-0" />
                    <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
                      {isMore ? (
                        <>
                          <div className="f-text space-y-4 pr-20 lg:pr-0">
                            <p><span className="chip-pill">{rest > 0 ? `${rest} project lagi` : 'Semua project'}</span></p>
                            <h3 className="grad text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-5xl">Explore more project</h3>
                            <p className="max-w-[46ch] text-sm leading-relaxed text-muted sm:text-base">Seluruh portfolio dalam satu halaman, lengkap dengan teknologi dan detailnya. Buka salah satunya untuk melihat foto dan penjelasan.</p>
                            <div className="pt-1"><Button href="/project" burst>Lihat semua project</Button></div>
                          </div>
                          <Link href="/project" data-cursor="Buka" className="group grid place-items-center gap-4 text-center">
                            <div className="folder-art grad text-[clamp(5rem,14vw,11rem)] leading-none font-extralight" aria-hidden>↗</div>
                            <span className="grad-soft text-xl font-light sm:text-3xl">Lihat semua project</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="f-text space-y-4 pr-20 lg:pr-0">
                            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
                              <span className="chip-pill">{p!.meta}</span>
                              <span className="eyebrow">{p!.tags.join(' / ')}</span>
                            </p>
                            <h3 className="grad text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-5xl">{p!.title}</h3>
                            <p className="text-lg font-light text-[#c7c7cc] sm:text-xl">{p!.sub}</p>
                            <p className="max-w-[52ch] text-sm leading-relaxed text-muted sm:text-base">{p!.desc}</p>
                            <div className="flex flex-wrap gap-3 pt-1">
                              <Button onClick={() => show(p!)}>Lihat detail</Button>
                              <Button href={waLink(`Halo JACKQQQ, saya tertarik dengan project seperti ${p!.title}.`)}>Diskusikan project serupa</Button>
                            </div>
                          </div>
                          {/* art: a photo fills a rounded, thin-bordered frame; without one the doodle is shown as before */}
                          <div className="folder-art absolute top-[calc(var(--tab)+1.25rem)] right-5 size-16 lg:static lg:size-auto lg:aspect-[16/10] lg:w-full">
                            {cover ? (
                              <button type="button" data-cursor="Lihat" onClick={() => show(p!)} aria-label={`Lihat foto ${p!.title}`} className="absolute inset-0 block overflow-hidden rounded-xl border border-fg lg:rounded-2xl">
                                <Image src={cover} alt="" fill sizes="(min-width: 1024px) 520px, 64px" className="object-cover" />
                              </button>
                            ) : (
                              <div className="absolute inset-0 grid place-items-center rounded-xl border border-line bg-[#0b0b0b] lg:rounded-2xl">
                                <span className="grad text-3xl font-extralight tracking-[-0.04em] lg:text-[clamp(4rem,9vw,8rem)]" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Fragment>
            );
          })}
          <div aria-hidden className="h-[12vh]" />
        </div>
      </div>
      <div ref={peekEl} aria-hidden className={`pointer-events-none fixed top-0 left-0 z-[150] w-56 overflow-hidden rounded-xl border border-line bg-mist text-ink transition-opacity duration-150 ${peek ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative grid aspect-[16/10] place-items-center bg-mist">
          {peek?.img ? <Image src={peek.img} alt="" fill sizes="224px" className="object-cover" /> : <span className="grad text-5xl font-extralight" aria-hidden>{peek?.n}</span>}
        </div>
        <div className="p-3"><p className="text-sm font-bold">{peek?.title}</p><p className="text-xs text-muted">{peek?.sub}</p></div>
      </div>
      <Viewer item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
