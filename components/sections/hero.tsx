'use client';

import { animate, createAnimatable, createTimeline, onScroll, spring, splitText, stagger, utils } from 'animejs';
import { Button } from '@/components/ui/button';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { SITE, waLink } from '@/lib/site';

// Layout after awmedia.marketing (pill badge, big gradient headline, two buttons) and fragment.im (tiny mono labels, a thin
// info rule along the bottom). No illustrations. One big motion moment: badge, giant name (letters spring up, gradient on every
// letter), intro, buttons, info rule. After that the name leans toward the mouse and lifts away on scroll.
export function Hero() {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const q = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));
    let intro: ReturnType<typeof createTimeline> | undefined;

    const { chars } = splitText(root.querySelector<HTMLElement>('#heroName')!, { chars: { wrap: 'clip' } });
    utils.set(chars, { translateY: '115%', rotate: () => utils.random(-8, 8) });
    const lead = splitText(root.querySelector<HTMLElement>('#heroLead')!, { words: true }).words;
    utils.set(lead, { opacity: 0, translateY: 14 });
    utils.set(q('.hero-meta'), { opacity: 0, translateY: 12 });
    utils.set(q('.hero-fade'), { opacity: 0, translateY: 16 });
    utils.set(q('.hero-rule'), { scaleX: 0 });

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      intro = createTimeline({ defaults: { ease: 'outExpo', duration: 900 } })
        .add(q('.hero-meta'), { opacity: 1, translateY: 0, duration: 600, delay: stagger(110) })
        .add(chars, { translateY: '0%', rotate: 0, ease: spring({ bounce: 0.3, duration: 1100 }), delay: stagger(70) }, '-=300')
        .add(lead, { opacity: 1, translateY: 0, duration: 600, delay: stagger(30) }, '-=700')
        .add(q('.hero-fade'), { opacity: 1, translateY: 0, duration: 650, delay: stagger(90) }, '-=450')
        .add(q('.hero-rule'), { scaleX: 1, duration: 1100, ease: 'outExpo' }, '-=500');
    });

    // letters jump in a wave from the centre when the pointer touches the name
    const jump = () => animate(chars, { translateY: [{ to: '-12%', duration: 180, ease: 'outQuad' }, { to: '0%', duration: 600, ease: 'outBounce' }], delay: stagger(40, { from: 'center' }) });
    const nameEl = root.querySelector<HTMLElement>('#heroName')!;
    nameEl.addEventListener('pointerenter', jump);
    nameEl.addEventListener('touchstart', jump, { passive: true });

    // the headline block leans a few px toward the mouse (mouse only)
    type Move = { x: (v: number) => void; y: (v: number) => void; revert: () => void };
    const lean = (matchMedia('(pointer: fine)').matches ? createAnimatable(root.querySelector<HTMLElement>('#heroLean')!, { x: 500, y: 500, ease: 'out(3)' }) : null) as unknown as Move | null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !lean) return;
      const r = root.getBoundingClientRect();
      lean.x(((e.clientX - r.left) / r.width - 0.5) * 18);
      lean.y(((e.clientY - r.top) / r.height - 0.5) * 12);
    };
    root.addEventListener('pointermove', onMove, { passive: true });

    // on scroll the whole block lifts away and fades, so the next section arrives clean
    const scroll = () => onScroll({ target: root, enter: { target: 'top', container: 'top' }, leave: { target: 'bottom', container: 'top' }, sync: true });
    const a = [
      animate('#heroScroll', { translateY: [0, -90], opacity: [1, 0.15], ease: 'linear', autoplay: scroll() }),
      animate('#heroName', { scale: [1, 0.94], ease: 'linear', autoplay: scroll() }),
    ];
    return () => { root.removeEventListener('pointermove', onMove); nameEl.removeEventListener('pointerenter', jump); nameEl.removeEventListener('touchstart', jump); intro?.revert(); lean?.revert(); a.forEach((x) => x.revert()); };
  });

  return (
    <section ref={ref} id="hero" className="surface-paper glow relative isolate flex min-h-[max(100svh,44rem)] flex-col overflow-hidden px-5 pt-32 pb-8 sm:px-8 sm:pt-36">
      <div id="heroScroll" className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center text-center">
        <div id="heroLean" className="flex flex-col items-center">
          <p className="hero-meta chip-pill">
            <span className="relative flex size-1.5"><span className="ping-soft absolute inset-0 rounded-full bg-white" /><span className="relative size-1.5 rounded-full bg-white" /></span>
            {SITE.status}
          </p>

          <h1 id="heroName" className="grad-letters mt-8 text-[clamp(3rem,15.5vw,13rem)] leading-[1.05] font-semibold tracking-[-0.04em] whitespace-nowrap">
            JACKQQQ
          </h1>

          <p id="heroLead" className="mt-6 max-w-2xl text-xl leading-snug font-light text-[#c7c7cc] sm:text-3xl">
            Website yang rapi, cepat, dan siap mendatangkan pelanggan.
          </p>
          <p className="hero-fade mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Fullstack developer dan multimedia specialist dari Malang. Membangun website, menggarap live streaming, motion bumper, foto, dan video lewat JQ Works.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="solid" burst href={waLink('Halo JACKQQQ, saya ingin konsultasi gratis.')}>Konsultasi Gratis</Button>
            <Button href="#project">Lihat Project</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl">
        <div className="hero-rule h-px origin-left bg-[var(--line)]" />
        <div className="hero-meta eyebrow mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1">
          <span>Fullstack / Multimedia</span>
          <span>Web / Streaming / Foto / Video</span>
          <span>Malang, Indonesia</span>
        </div>
      </div>
    </section>
  );
}
