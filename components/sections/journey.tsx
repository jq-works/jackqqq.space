'use client';

import { animate, onScroll, spring, stagger, utils } from 'animejs';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { PROJECTS, STICKERS, TIMELINE } from '@/lib/site';
import { revealBlocks, revealTitles, whenVisible } from '@/lib/motion';

// Every number is derived from the content file, so it can never drift from what is on the page.
const STATS = [
  { to: PROJECTS.length, label: 'Project' },
  { to: STICKERS.length, label: 'Prestasi' },
];

// Reference's "our journey" block: story + timeline on the left, count-up stats and a desk illustration on the right.
// Scroll-linked: the timeline rule draws down, the stats count up, the illustration floats against the scroll.
export function Journey() {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const stops: Array<() => void> = [revealTitles(root), revealBlocks(root)];
    const a: Array<{ revert: () => void }> = [];
    const range = (target: Element, leaveContainer: 'top' | 'center' = 'top') =>
      onScroll({ target, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: leaveContainer }, sync: true });

    // timeline rule grows with scroll; each dot gives one pulse ring when the tip of the rule reaches it (re-arms on scroll back)
    const tl = root.querySelector<HTMLElement>('#timeline')!;
    const ringEls = Array.from(root.querySelectorAll<HTMLElement>('.tl-ring'));
    const lit = ringEls.map(() => false);
    const pulse = (ring: HTMLElement) => animate(ring, { scale: [1, 2.8], opacity: [0.55, 0], duration: 700, ease: 'outQuad' });
    a.push(animate(root.querySelector('#tlLine')!, {
      scaleY: [0, 1], ease: 'linear', autoplay: range(tl, 'center'),
      onUpdate: (self) => {
        const tipY = self.progress * tl.offsetHeight;
        ringEls.forEach((ring, i) => {
          const item = ring.closest<HTMLElement>('.tl-item')!;
          const at = item.offsetTop + 14; // the dot sits 6px below the item's top and is 16px tall: its centre is at 14px
          if (tipY >= at && !lit[i]) { lit[i] = true; pulse(ring); }
          else if (tipY < at - 20 && lit[i]) lit[i] = false;
        });
      },
    }));

    // entries slide in once; their dots pop with a spring
    const items = Array.from(root.querySelectorAll<HTMLElement>('.tl-item'));
    const dots = Array.from(root.querySelectorAll<HTMLElement>('.tl-dot'));
    utils.set(items, { opacity: 0, translateX: -40 });
    utils.set(dots, { scale: 0 });
    items.forEach((el, i) => stops.push(whenVisible(el, () => {
      animate(el, { opacity: 1, translateX: 0, duration: 800, ease: 'outExpo' });
      animate(dots[i], { scale: 1, ease: spring({ bounce: 0.6, duration: 700 }), delay: 150 });
    }, 0.3)));

    // stats count up while scrolling through them
    const nums = Array.from(root.querySelectorAll<HTMLElement>('.stat-num'));
    nums.forEach((el) => {
      const to = Number(el.dataset.to);
      const o = { v: 0 };
      el.textContent = '0';
      a.push(animate(o, { v: to, ease: 'linear', modifier: utils.round(0), onUpdate: () => { el.textContent = String(o.v); }, autoplay: range(el, 'center') }));
    });

    a.push(animate(root.querySelector('#journeyHead')!, { translateY: [24, -24], ease: 'linear', autoplay: range(root) }));
    return () => { stops.forEach((s) => s()); a.forEach((x) => x.revert()); nums.forEach((el) => { el.textContent = el.dataset.to ?? ''; }); };
  });

  return (
    <section ref={ref} id="tentang" className="surface-paper relative overflow-hidden px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow">Tentang</p>
        <div className="mt-6 grid gap-14 md:grid-cols-[1.3fr_1fr] md:gap-20">
          <div id="journeyHead">
            <h2 className="split-title grad-letters text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[1.04] font-extralight tracking-[-0.035em]">Dari proyek sekolah sampai lomba tingkat ASEAN.</h2>
            <p className="reveal mt-6 max-w-md leading-relaxed text-muted">
              Tiap langkah menambah satu hal: membuat sesuatu yang benar-benar dipakai orang.
            </p>

            <div className="mt-12 flex gap-12 border-t border-line pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="grad text-5xl font-light tracking-[-0.03em] sm:text-6xl"><span className="stat-num" data-to={s.to}>{s.to}</span></p>
                  <p className="eyebrow mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="timeline" className="relative pl-8">
            <div aria-hidden className="absolute top-1 left-[7px] h-[calc(100%-0.5rem)] w-px bg-ink/15" />
            <div id="tlLine" aria-hidden className="absolute top-1 left-[7px] h-[calc(100%-0.5rem)] w-px origin-top bg-ink" />
            {TIMELINE.map((t, n) => (
              <div key={t.year} className="tl-item relative pb-10 last:pb-0">
                <span className="tl-dot absolute top-1.5 -left-8 size-[15px] rounded-full border border-ink bg-paper">
                  <span aria-hidden className="tl-ring pointer-events-none absolute -inset-0.5 rounded-full border border-ink opacity-0" />
                </span>
                <p className="eyebrow">{String(n + 1).padStart(2, '0')} / {t.year}</p>
                <ul className="mt-2 space-y-2 text-base leading-relaxed text-[#c7c7cc]">
                  {t.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
