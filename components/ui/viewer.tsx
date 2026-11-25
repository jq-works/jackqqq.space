'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, spring } from 'animejs';
import { prefersReducedMotion } from '@/lib/motion';

export type ViewerItem = {
  title: string;
  kicker?: string; // small line above the title: type / label
  facts?: Array<[string, string]>; // label / value rows (empty values are skipped by the caller)
  desc?: string;
  images: string[];
  alt: string;
  link?: { href: string; label: string };
};

/**
 * Detail window on the native <dialog> (focus trap, Esc, inert background and focus return come from the browser).
 * Shows a photo/certificate gallery plus short facts. With no image it says so plainly instead of showing a fake one.
 * The caller owns the open state: pass `item` to open, `null` to close.
 */
export function Viewer({ item, onClose }: { item: ViewerItem | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [idx, setIdx] = useState(0);
  const last = useRef<ViewerItem | null>(null);
  if (item) last.current = item; // keep content mounted while the closing animation runs
  const shown = item ?? last.current;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) {
      setIdx(0);
      d.showModal();
      if (!prefersReducedMotion()) {
        animate(d, { opacity: [0, 1], duration: 200, ease: 'outQuad' });
        animate(d.querySelector('.viewer-card')!, { translateY: [30, 0], scale: [0.96, 1], ease: spring({ bounce: 0.3, duration: 600 }) });
      }
    } else if (!item && d.open) {
      if (prefersReducedMotion()) d.close();
      else animate(d, { opacity: 0, duration: 160, ease: 'inQuad', onComplete: () => d.close() });
    }
  }, [item]);

  // arrow keys move through the gallery
  useEffect(() => {
    if (!item || item.images.length < 2) return;
    const n = item.images.length;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const go = (dir: number) => setIdx((i) => (i + dir + n) % n);
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [item]);

  const n = shown?.images.length ?? 0;
  const step = (dir: number) => setIdx((i) => (i + dir + n) % n);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }} // click on the backdrop area
      aria-label={shown?.title}
      className="m-auto max-h-[92svh] w-[min(64rem,94vw)] overflow-visible bg-transparent p-0 text-[#f5f5f7] backdrop:bg-black/80 backdrop:backdrop-blur-none"
    >
      {shown && (
        <div className="viewer-card grid max-h-[92svh] overflow-hidden rounded-2xl border border-line bg-[#0b0b0b] md:grid-cols-[1.25fr_1fr]">
          <div className="relative grid min-h-64 place-items-center bg-[#141414] p-3 md:min-h-[26rem]">
            {n > 0 ? (
              <>
                <div className="relative size-full min-h-60 md:min-h-[24rem]">
                  <Image key={shown.images[idx]} src={shown.images[idx]} alt={`${shown.alt} (${idx + 1} dari ${n})`} fill sizes="(min-width: 768px) 560px, 94vw" className="object-contain" />
                </div>
                {n > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Gambar sebelumnya" className="absolute top-1/2 left-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink text-paper active:scale-90">‹</button>
                    <button type="button" onClick={() => step(1)} aria-label="Gambar berikutnya" className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink text-paper active:scale-90">›</button>
                    <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-xs text-paper" aria-hidden>{idx + 1} / {n}</p>
                  </>
                )}
              </>
            ) : (
              <p className="max-w-[24ch] text-center text-sm leading-relaxed text-muted">Foto belum diunggah. Taruh file gambar dengan nama sesuai slug di folder <code className="font-mono text-xs">public/</code> dan akan tampil di sini.</p>
            )}
          </div>

          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-5 sm:p-7">
            <button type="button" onClick={onClose} aria-label="Tutup" className="ml-auto grid size-10 shrink-0 place-items-center rounded-full border border-line text-lg transition-transform duration-150 hover:scale-105 active:scale-90">×</button>
            {shown.kicker && <p className="text-sm text-muted">{shown.kicker}</p>}
            <h3 className="text-2xl leading-tight font-bold sm:text-3xl">{shown.title}</h3>
            {shown.facts && shown.facts.length > 0 && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                {shown.facts.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {shown.desc && <p className="text-sm leading-relaxed text-muted sm:text-base">{shown.desc}</p>}
            {shown.link && <a href={shown.link.href} target="_blank" rel="noopener noreferrer" className="mt-auto w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform duration-150 hover:scale-105 active:scale-95">{shown.link.label}</a>}
          </div>
        </div>
      )}
    </dialog>
  );
}
