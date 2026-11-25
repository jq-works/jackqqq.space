'use client';

import { useRef, useState } from 'react';
import { animate, createDraggable, onScroll, spring, stagger, utils } from 'animejs';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { Viewer, type ViewerItem } from '@/components/ui/viewer';
import { STICKERS } from '@/lib/site';
import { revealTitles, whenVisible } from '@/lib/motion';

// Stickers roll right-to-left over a giant word, scrubbed by scroll. Reduced motion: static grid below the word.
export function AchievementStickers({ images }: { images: Record<string, string[]> }) {
  const [open, setOpen] = useState<ViewerItem | null>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const openRef = useRef(setOpen);
  openRef.current = setOpen;
  const ref = useAnimeScope<HTMLElement>((root) => {
    const scroll = () => onScroll({ target: root, enter: { target: 'top', container: 'top' }, leave: { target: 'bottom', container: 'bottom' }, sync: true });
    const row = root.querySelector<HTMLElement>('#stickerRow')!;
    const title = root.querySelector<HTMLElement>('.split-title')!;
    const hint = root.querySelector<HTMLElement>('.sticker-hint')!;
    const stickers = Array.from(root.querySelectorAll<HTMLElement>('.sticker'));
    utils.set(stickers, { opacity: 0, scale: 0.72, rotate: (_, i) => ((i ?? 0) % 2 ? 8 : -8) });
    const stops = [
      revealTitles(root),
      whenVisible(row, () => animate(stickers, { opacity: 1, scale: 1, rotate: 0, ease: spring({ bounce: 0.35, duration: 900 }), delay: stagger(100) }), 0.1),
    ];
    const a = [
      animate(row, { translateX: [innerWidth, -row.scrollWidth], ease: 'linear', autoplay: scroll() }),
      animate(root.querySelectorAll('.sticker-inner'), { rotate: [360, -540], scale: [0.9, 1.08], ease: 'linear', autoplay: scroll() }),
      animate(title, { translateY: [46, -46], rotate: [-1.5, 1.5], ease: 'linear', autoplay: scroll() }),
      animate(hint, { translateY: [18, -18], opacity: [0.5, 1], ease: 'linear', autoplay: scroll() }),
    ];
    const spin = (b: Element) => () =>
      animate(b, { rotate: '+=360', scale: [{ to: 1.12, duration: 160 }, { to: 1, ease: spring({ bounce: 0.6, duration: 600 }) }], ease: spring({ bounce: 0.3, duration: 900 }) });
    // Mouse only: drag a sticker anywhere, let go and it springs back to its place in the row. Touch keeps tap-to-spin and
    // normal page scroll (createDraggable sets touch-action:none on its trigger, which would block scrolling from a sticker).
    const canDrag = matchMedia('(pointer: fine)').matches;
    let moved = false;
    const drags = canDrag
      ? stickers.map((b) => createDraggable(b, {
          snap: [0], releaseEase: spring({ bounce: 0.55, duration: 900 }),
          onDrag: () => { moved = true; },
          onRelease: () => { setTimeout(() => { moved = false; }, 0); },
        }))
      : [];
    const offs = stickers.map((b) => {
      const f = spin(b);
      const i = stickers.indexOf(b);
      const onClick = () => {
        if (moved) return; // a drag that ends on the sticker must not also count as a tap
        f();
        const s = STICKERS[i];
        openRef.current({
          kicker: s.type,
          title: s.title,
          facts: ([['Penyelenggara', s.organizer ?? ''], ['Tahun', s.year], ['Hasil', s.result ?? '']] as Array<[string, string]>).filter(([, v]) => v),
          desc: s.desc,
          images: imagesRef.current[s.slug] ?? [],
          alt: `Sertifikat ${s.title}`,
        });
      };
      b.addEventListener('click', onClick);
      return () => b.removeEventListener('click', onClick);
    });
    return () => { stops.forEach((s) => s()); a.forEach((x) => x.revert()); offs.forEach((o) => o()); drags.forEach((d) => d.revert()); };
  });

  return (
    <section ref={ref} id="prestasi" className="surface-paper  h-[180vh] border-t border-line motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <h2 className="split-title grad-letters relative text-center text-[clamp(3rem,calc((100vw-2.5rem)/4.9),17rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase whitespace-nowrap">Prestasi</h2>
        <div id="stickerRow" className="absolute top-1/2 left-0 flex w-max -translate-y-1/2 gap-4 sm:gap-6 motion-reduce:static motion-reduce:mt-10 motion-reduce:w-auto motion-reduce:translate-y-0 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-5">
          {STICKERS.map((s, i) => {
            const dark = s.dark;
            const pid = `sticker-ring-${i}`;
            return (
              <button key={pid} type="button" aria-label={s.label} data-cursor="Seret" className="sticker relative size-40 shrink-0 rounded-full sm:size-56">
                <span className="sticker-inner absolute inset-0 grid place-items-center">
                  <svg viewBox="0 0 120 120" className="absolute inset-0 size-full" aria-hidden>
                    <circle cx="60" cy="60" r="57" fill={dark ? '#141414' : '#f5f5f7'} stroke={dark ? '#3a3a3c' : '#f5f5f7'} strokeWidth="1.5" />
                    <defs><path id={pid} d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" /></defs>
                    <text fontWeight="700" fontSize="9.6" letterSpacing="1.1" fill={dark ? '#f5f5f7' : '#000000'} style={{ fontFamily: 'var(--font-outfit)' }}>
                      <textPath href={`#${pid}`} textLength="268">{s.text}</textPath>
                    </text>
                  </svg>
                  <span className={`relative px-6 text-center ${s.year ? 'text-4xl sm:text-6xl' : 'text-xl sm:text-3xl'} font-extralight tracking-[-0.04em] ${dark ? 'text-[#f5f5f7]' : 'text-black'}`} aria-hidden>{s.year || s.type}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="sticker-hint eyebrow absolute inset-x-0 bottom-10 text-center motion-reduce:static motion-reduce:mt-8">Ketuk untuk melihat sertifikat</p>
      </div>
      <Viewer item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
