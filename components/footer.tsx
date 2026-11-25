'use client';

import { animate, createAnimatable, splitText, stagger, utils } from 'animejs';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { SocialIcon } from '@/components/social-icon';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { SITE } from '@/lib/site';
import { whenVisible } from '@/lib/motion';

export function Footer({ copyright }: { copyright: React.ReactNode }) {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const cta = root.querySelector<HTMLElement>('#bigCta')!;
    const { chars } = splitText(cta, { chars: { wrap: 'clip' } });
    utils.set(chars, { translateY: '110%' });
    const stop = whenVisible(cta, () => animate(chars, { translateY: ['110%', '0%'], rotate: [16, 0], duration: 900, ease: 'outExpo', delay: stagger(35) }), 0.3);

    // Mouse only: letters near the pointer swell and lift, falling off with distance (radius 180px). The motion lives on each
    // letter's clip wrapper (the span splitText puts around it), so it never fights the reveal / hop animations on the letter itself.
    const wraps = chars.map((c) => c.parentElement as HTMLElement);
    const near = matchMedia('(pointer: fine)').matches ? wraps.map((w) => createAnimatable(w, { scale: 220, translateY: 220, ease: 'out(3)' })) : [];
    const R = 180;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      wraps.forEach((w, i) => {
        const r = w.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / R); // 1 under the pointer, 0 at the edge of the radius
        (near[i] as any).scale(1 + k * 0.22); // eslint-disable-line @typescript-eslint/no-explicit-any
        (near[i] as any).translateY(-k * 14); // eslint-disable-line @typescript-eslint/no-explicit-any
      });
    };
    const onLeave = () => near.forEach((n) => { (n as any).scale(1); (n as any).translateY(0); }); // eslint-disable-line @typescript-eslint/no-explicit-any
    if (near.length) { cta.addEventListener('pointermove', onMove, { passive: true }); cta.addEventListener('pointerleave', onLeave); }

    // letters hop from the centre on hover / touch
    const hop = () => animate(chars, { translateY: [{ to: '-22%', duration: 200, ease: 'outQuad' }, { to: '0%', duration: 650, ease: 'outBounce' }], delay: stagger(30, { from: 'center' }) });
    cta.addEventListener('pointerenter', hop);
    cta.addEventListener('touchstart', hop, { passive: true });

    return () => { stop(); cta.removeEventListener('pointermove', onMove); cta.removeEventListener('pointerleave', onLeave); near.forEach((n) => n.revert()); cta.removeEventListener('pointerenter', hop); cta.removeEventListener('touchstart', hop); };
  });

  return (
    <footer ref={ref} id="footer" className="surface-ink relative overflow-hidden px-5 pt-20 sm:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <div className="relative mx-auto w-fit">
          <Logo className="size-16 text-2xl" />
        </div>
        <p className="eyebrow mx-auto mt-4 max-w-sm">Punya ide? Ceritakan dulu</p>
        <div className="mt-5 flex justify-center gap-2">
          {SITE.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-10 place-items-center rounded-full bg-[#f5f5f7] text-black transition-transform duration-150 hover:scale-110 active:scale-95">
              <SocialIcon name={s.label} className="size-5" />
            </a>
          ))}
        </div>

        <div className="relative mt-14">
          <Link href="/#kontak" id="bigCta" className="grad-letters block text-[clamp(2.4rem,calc((100vw-2.5rem)/7.6),8.4rem)] leading-[1.1] font-semibold tracking-[-0.03em] uppercase" aria-label="Hubungi saya">Hubungi saya</Link>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-1 border-t border-line py-5 text-xs text-muted sm:flex-row sm:justify-between">
        {copyright}
        <p>{SITE.location}</p>
      </div>
    </footer>
  );
}
