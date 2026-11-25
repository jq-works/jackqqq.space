'use client';

import { animate, onScroll, spring, stagger, utils } from 'animejs';
import { Button } from '@/components/ui/button';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { spotlight, tilt3d } from '@/lib/fx';
import { SERVICE_GROUPS, waLink } from '@/lib/site';
import { revealBlocks, revealTitles, whenVisible } from '@/lib/motion';

export function Services() {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const stops: Array<() => void> = [revealTitles(root), revealBlocks(root)];
    const a: Array<{ revert: () => void }> = [];
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.svc'));
    utils.set(cards, { opacity: 0, translateY: 40 });
    stops.push(whenVisible(root.querySelector('#svcGrid')!, () => {
      animate(cards, { opacity: 1, translateY: 0, duration: 800, ease: 'outExpo', delay: stagger(90) });
    }, 0.15));

    // columns drift against each other with scroll
    cards.forEach((c, i) => {
      const d = i % 2 ? 18 : -18;
      a.push(animate(c.querySelector('.svc-in')!, { translateY: [-d, d], ease: 'linear', autoplay: onScroll({ target: root, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'top' }, sync: true }) }));
    });

    // Price counts up the first time its card shows. Only prices shaped "mulai Rp<number> rb" (read from the data itself).
    const priceRe = /^(.*Rp)(\d+)( rb.*)$/;
    // The real text is kept in data-final and restored on cleanup, so a re-run (React Strict Mode) never reads a half-counted value.
    const restore: Array<() => void> = [];
    cards.forEach((c) => {
      const el = c.querySelector<HTMLElement>('.svc-price');
      if (!el) return;
      const final = el.dataset.final ?? (el.dataset.final = el.textContent ?? '');
      const m = final.match(priceRe);
      if (!m) return;
      const to = Number(m[2]);
      el.textContent = `${m[1]}0${m[3]}`;
      restore.push(() => { el.textContent = final; });
      stops.push(whenVisible(c, () => {
        const o = { v: 0 };
        animate(o, { v: to, duration: 1100, delay: 250, ease: 'outExpo', modifier: utils.round(0), onUpdate: () => { el.textContent = `${m[1]}${o.v}${m[3]}`; }, onComplete: () => { el.textContent = final; } });
      }, 0.5));
    });

    // Mouse only (lib/fx.ts): 3D tilt toward the pointer, a spotlight under it, and a lit edge that follows it.
    const stopTilt = tilt3d(cards.map((c) => c.querySelector<HTMLElement>('.svc-tilt')!), 7);
    const stopSpot = spotlight(cards.map((c) => c.querySelector<HTMLElement>('.svc-tilt')!));

    const offs = cards.map((c) => {
      const icon = c.querySelector<HTMLElement>('.svc-ill')!;
      const wobble = () => animate(icon, { rotate: [{ to: -12, duration: 130 }, { to: 8, duration: 130 }, { to: 0, ease: spring({ bounce: 0.5, duration: 500 }) }], scale: [{ to: 1.12, duration: 130 }, { to: 1, ease: spring({ bounce: 0.5, duration: 500 }) }] });
      c.addEventListener('pointerenter', wobble);
      c.addEventListener('touchstart', wobble, { passive: true });
      return () => { c.removeEventListener('pointerenter', wobble); c.removeEventListener('touchstart', wobble); };
    });
    return () => { stops.forEach((s) => s()); a.forEach((x) => x.revert()); offs.forEach((o) => o()); stopTilt(); stopSpot(); restore.forEach((r) => r()); };
  });

  return (
    <section ref={ref} id="layanan" className="surface-paper  border-y border-line px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="split-title text-center text-section font-light">Layanan <b className="font-bold">freelance</b></h2>
        <p className="reveal mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted">
          Harga perkenalan, berlaku untuk 3 klien pertama. Domain dan hosting ditanggung klien.
        </p>
        <div id="svcGrid" className="mt-14 grid gap-x-10 gap-y-14 text-center sm:grid-cols-2 md:grid-cols-3">
          {SERVICE_GROUPS.map((s) => (
            <div key={s.title} className="svc [perspective:900px]">
              <div className="svc-in"><div className="svc-tilt spot spot-edge flex flex-col items-center rounded-2xl border border-line bg-mist px-6 py-8 [transform-style:preserve-3d]">
                <span className="svc-ill grad text-6xl font-extralight tracking-[-0.04em] [transform:translateZ(30px)]" aria-hidden>{String(SERVICE_GROUPS.indexOf(s) + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{s.desc}</p>
                <p className="svc-price mt-2 text-sm font-semibold tabular-nums">{s.price}</p>
                <Button className="mt-3" href={waLink(`Halo JACKQQQ, saya tertarik dengan layanan ${s.title}.`)}>Tanya layanan</Button>
              </div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
