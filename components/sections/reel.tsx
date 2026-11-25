'use client';

import Image from 'next/image';
import { animate, onScroll, utils } from 'animejs';
import { useAnimeScope } from '@/hooks/use-anime-scope';

const WORDS = ['Website', 'Live streaming', 'Motion bumper', 'Foto', 'Video'];

/**
 * Scroll media expansion (21st.dev pattern): a small framed card grows to fill the screen as you scroll, while the two halves of
 * the title slide apart. The frame shows `public/hero/reel.*` when it exists, otherwise a typographic panel (no invented imagery).
 * Scroll-linked, transform and opacity only. Reduced motion: a plain full-width block, no sticky.
 */
export function Reel({ image }: { image?: string }) {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const scroll = () => onScroll({ target: root, enter: { target: 'top', container: 'top' }, leave: { target: 'bottom', container: 'bottom' }, sync: true });
    const s0 = innerWidth < 640 ? 0.78 : 0.42; // starting size as a fraction of the viewport: wide enough to read on a phone
    const a = [
      animate(root.querySelector('#reelFrame')!, { scale: [s0, 1], translateY: [innerHeight * (innerWidth < 640 ? 0.1 : 0.12), 0], ease: 'inOutQuad', autoplay: scroll() }),
      animate(root.querySelector('#reelFrameIn')!, { scale: [1 / s0, 1], ease: 'inOutQuad', autoplay: scroll() }), // keeps the content at its true size while the frame grows
      animate(root.querySelector('#reelLeft')!, { translateX: ['0%', '-60%'], opacity: [1, 0], ease: 'linear', autoplay: scroll() }),
      animate(root.querySelector('#reelRight')!, { translateX: ['0%', '60%'], opacity: [1, 0], ease: 'linear', autoplay: scroll() }),
      animate(root.querySelectorAll('.reel-word'), { translateY: (_, i) => [40 + (i ?? 0) * 14, -20], opacity: [0, 1], ease: 'linear', autoplay: scroll() }),
    ];
    utils.set(root.querySelector('#reelFrame')!, { scale: s0, translateY: innerHeight * (innerWidth < 640 ? 0.1 : 0.12) });
    return () => a.forEach((x) => x.revert());
  });

  return (
    <section ref={ref} id="reel" className="surface-paper h-[170vh] motion-reduce:h-auto">
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-20">
        <h2 className="pointer-events-none absolute inset-x-0 top-[7.5rem] z-10 flex justify-center sm:top-[16%] gap-[0.35em] text-center text-[clamp(2.2rem,8vw,6.5rem)] leading-none font-extrabold tracking-tight uppercase motion-reduce:static" >
          <span id="reelLeft" className="grad inline-block">Karya</span>
          <span id="reelRight" className="grad-soft inline-block font-light">nyata</span>
        </h2>

        <div id="reelFrame" className="relative size-full origin-center overflow-hidden rounded-[2rem] border border-line bg-paper motion-reduce:h-[70svh] motion-reduce:scale-100">
          <div id="reelFrameIn" className="glow absolute inset-0 grid origin-center place-items-center text-paper">
            {image ? (
              <Image src={image} alt="Showreel JACKQQQ" fill sizes="100vw" className="object-cover" priority={false} />
            ) : (
              <div className="flex flex-col items-center gap-6 px-6 text-center">
                <p className="eyebrow">Showreel</p>
                <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-2xl font-light sm:text-5xl">
                  {WORDS.map((w, i) => (
                    <li key={w} className="reel-word grad-soft"><b className={i % 2 ? 'font-light' : 'font-semibold'}>{w}</b></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
