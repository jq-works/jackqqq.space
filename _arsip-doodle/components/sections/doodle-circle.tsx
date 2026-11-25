'use client';

import { animate, onScroll } from 'animejs';
import { Doodle, type DoodleId } from '@/components/doodle-sprite';
import { useAnimeScope } from '@/hooks/use-anime-scope';

// Doodle pool for the pattern: our own icons plus a hand-picked slice of the library (web, media, desk life).
const IDS: DoodleId[] = [
  'd-monitor', 'd-code', 'd-film', 'd-drone', 'd-chart', 'd-cube', 'd-bolt', 'd-cloud', 'd-spark', 'd-smile', 'd-trophy', 'd-heart',
  'x-camera', 'x-videocam', 'x-mic', 'x-brush', 'x-pencil', 'x-laptop', 'x-bulb', 'x-megaphone', 'x-potted-plant', 'x-gamepad', 'x-chat', 'x-image', 'x-star', 'x-sun',
];
// 5 is coprime with IDS.length (26), so the stride visits every doodle before repeating.
const CELLS = Array.from({ length: 96 }, (_, i) => ({ id: IDS[(i * 5) % IDS.length], rot: ((i * 37) % 50) - 25 }));

// The one place clip-path is animated (DESIGN-SYSTEM 7.10). Reduced motion: plain static block, no sticky.
export function DoodleCircle() {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const scroll = () => onScroll({ target: root, enter: { target: 'top', container: 'top' }, leave: { target: 'bottom', container: 'bottom' }, sync: true });
    const cells = Array.from(root.querySelectorAll<HTMLElement>('.circle-doodle')).filter((_, i) => i % 2 === 0);
    const movers = cells.map((cell, i) => {
      const distance = 10 + (i % 4) * 6;
      return animate(cell, {
        translateY: [distance, -distance],
        rotate: [-8 + (i % 3) * 4, 8 - (i % 3) * 4],
        ease: 'linear',
        autoplay: scroll(),
      });
    });
    const a = [
      animate(root.querySelector('#circle')!, { clipPath: ['circle(12% at 50% 50%)', 'circle(80% at 50% 50%)'], ease: 'inOutQuad', autoplay: scroll() }),
      animate(root.querySelector('#pattern')!, { rotate: [-8, 4], scale: [1.25, 1], ease: 'linear', autoplay: scroll() }),
      animate(root.querySelector('#circleCaption')!, { opacity: [0.45, 1], translateY: [34, -8], scale: [0.7, 1], rotate: [-6, 2], ease: 'outQuad', autoplay: scroll() }),
      ...movers,
    ];
    return () => a.forEach((x) => x.revert());
  });

  return (
    <section ref={ref} id="lingkaran" className="surface-ink relative h-[160vh] motion-reduce:h-auto">
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden bg-black motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <div id="circle" className="absolute inset-0 grid place-items-center motion-reduce:hidden" style={{ clipPath: 'circle(12% at 50% 50%)', background: '#1c1c1e' }}>
          <div id="pattern" className="grid w-[130vmax] grid-cols-8 gap-6 p-6 text-[#f5f5f7] sm:grid-cols-12">
            {CELLS.map((c, i) => (
              <span key={i} className="circle-doodle block aspect-square w-full">
                <Doodle id={c.id} className="aspect-square w-full" style={{ transform: `rotate(${c.rot}deg)` }} />
              </span>
            ))}
          </div>
        </div>
        <p id="circleCaption" className="pointer-events-none relative z-10 rounded-sm border border-line bg-black px-6 py-4 text-center text-3xl font-light text-[#f5f5f7] sm:text-5xl">
          Setiap <b className="font-bold">website</b><br />dimulai dari <b className="font-bold">coretan</b>
        </p>
      </div>
    </section>
  );
}
