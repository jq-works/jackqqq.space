'use client';

import { animate, onScroll, spring, stagger, utils } from 'animejs';
import { Frame } from '@/components/ui/frame';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { STEPS } from '@/lib/site';
import { spotlight, tilt3d } from '@/lib/fx';
import { revealTitles, whenVisible } from '@/lib/motion';

// Reference's black "Why choose" block with four numbered skewed cards. Here the cards are the 4-step work process (PRD F-07).
export function Process() {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const stops = [revealTitles(root)];
    const a: Array<{ revert: () => void }> = [];
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.step'));
    utils.set(cards, { opacity: 0, scale: 0.8, rotate: () => utils.random(-8, 8) });
    stops.push(whenVisible(root.querySelector('#steps')!, () => animate(cards, { opacity: 1, scale: 1, rotate: 0, ease: spring({ bounce: 0.4, duration: 800 }), delay: stagger(120) }), 0.2));

    const track = () => onScroll({ target: root, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'top' }, sync: true });
    cards.forEach((c, i) => a.push(animate(c.querySelector('.step-in')!, { translateY: [i % 2 ? 16 : -16, i % 2 ? -16 : 16], ease: 'linear', autoplay: track() })));
    a.push(animate(root.querySelector('#stepRule')!, { scaleX: [0, 1], ease: 'linear', autoplay: onScroll({ target: root.querySelector('#steps')!, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'center' }, sync: true }) }));

    // A dot rides the tip of the drawing line; each number badge pops once when the dot passes it (re-arms when scrolling back).
    // Positions are measured, so it is rebuilt whenever the section is resized. Lines only exist from `lg` up.
    const wrap = root.querySelector<HTMLElement>('#stepsWrap')!;
    const dot = root.querySelector<HTMLElement>('#stepDot')!;
    const nums = cards.map((c) => c.querySelector<HTMLElement>('.step-num')!);
    const popNum = (num: HTMLElement) => animate(num, { scale: [{ to: 1.3, duration: 130 }, { to: 1, ease: spring({ bounce: 0.6, duration: 500 }) }], rotate: [{ to: -10, duration: 130 }, { to: 0, ease: spring({ bounce: 0.6, duration: 500 }) }] });
    let ride: { revert: () => void } | undefined;
    const build = () => {
      ride?.revert();
      utils.set(dot, { opacity: 0 });
      if (!matchMedia('(min-width: 1024px)').matches) return;
      const W = wrap.clientWidth;
      const passAt = cards.map((c) => c.offsetLeft + 4); // badge centre, measured from the left edge of the line
      const lit = cards.map(() => false);
      utils.set(dot, { opacity: 1 });
      ride = animate(dot, {
        translateX: [0, W], ease: 'linear',
        autoplay: onScroll({ target: root.querySelector('#steps')!, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'center' }, sync: true }),
        onUpdate: (self) => {
          const x = self.progress * W;
          passAt.forEach((at, i) => {
            if (x >= at && !lit[i]) { lit[i] = true; popNum(nums[i]); }
            else if (x < at - 24 && lit[i]) lit[i] = false;
          });
        },
      });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(wrap);

    const stepBoxes = cards.map((c) => c.querySelector<HTMLElement>('.step-box')!);
    const stopTilt = tilt3d(stepBoxes, 6);
    const stopSpot = spotlight(stepBoxes);
    const offs = cards.map((c, i) => {
      const num = nums[i];
      const pop = () => popNum(num);
      c.addEventListener('pointerenter', pop);
      c.addEventListener('touchstart', pop, { passive: true });
      return () => { c.removeEventListener('pointerenter', pop); c.removeEventListener('touchstart', pop); };
    });
    return () => { stops.forEach((s) => s()); a.forEach((x) => x.revert()); offs.forEach((o) => o()); ro.disconnect(); ride?.revert(); stopTilt(); stopSpot(); };
  });

  return (
    <section ref={ref} id="alur" className="surface-ink relative overflow-hidden px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative max-w-md">
          <h2 className="split-title text-section font-bold">Alur kerja</h2>
          <p className="text-section font-light">empat langkah</p>
        </div>

        <div id="stepsWrap" className="relative mt-14">
          <div aria-hidden className="absolute top-3 right-0 left-0 hidden h-px bg-ink/15 lg:block" />
          <div id="stepRule" aria-hidden className="absolute top-3 right-0 left-0 hidden h-px origin-left bg-ink lg:block" />
          <span id="stepDot" aria-hidden className="absolute top-3 left-0 z-10 -mt-1.5 -ml-1.5 hidden size-3 rounded-full bg-ink opacity-0 ring-4 ring-line lg:block" />
          <div id="steps" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="step [perspective:900px]">
                <div className="step-in">
                  <Frame shape={i} className="step-box spot text-paper">
                    <div className="p-5 pt-8">
                      <span className="step-num absolute -top-3 -left-3 grid size-8 place-items-center bg-ink text-sm font-semibold text-paper">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-lg font-semibold">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                    </div>
                  </Frame>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
