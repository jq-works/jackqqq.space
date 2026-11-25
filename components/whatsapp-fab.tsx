'use client';

import { useEffect, useRef } from 'react';
import { animate, spring } from 'animejs';
import { SocialIcon } from '@/components/social-icon';
import { SITE, waLink } from '@/lib/site';
import { prefersReducedMotion } from '@/lib/motion';

// Appears after the hero, hides when the footer CTA is visible. Chat icon wiggles every ~3.6s.
export function WhatsAppFab() {
  const fab = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = fab.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    const hero = document.getElementById('hero');
    let shown = false, pastHero = !hero, footerSeen = false; // no hero on this page: show right away
    const set = (show: boolean) => {
      if (show === shown) return;
      shown = show;
      if (reduce) return void (el.style.visibility = show ? 'visible' : 'hidden');
      if (show) {
        el.style.visibility = 'visible';
        animate(el, { scale: [0, 1], rotate: [-25, 0], translateY: [40, 0], ease: spring({ bounce: 0.5, duration: 700 }) });
      } else {
        animate(el, { scale: 0, translateY: 40, duration: 300, ease: 'inBack', onComplete: () => !shown && (el.style.visibility = 'hidden') });
      }
    };
    const foot = document.getElementById('kontak') ?? document.getElementById('footer'); // hide over the contact form, or the footer where there is none
    const ios: IntersectionObserver[] = [];
    if (hero) {
      const io = new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; set(pastHero && !footerSeen); });
      io.observe(hero); ios.push(io);
    }
    if (foot) {
      const io = new IntersectionObserver(([e]) => { footerSeen = e.isIntersecting; set(pastHero && !footerSeen); }, { threshold: 0.15 });
      io.observe(foot); ios.push(io);
    }
    const wiggle = reduce ? null : animate(el.querySelector('svg')!, {
      rotate: [{ to: -14, duration: 90 }, { to: 14, duration: 90 }, { to: -8, duration: 90 }, { to: 0, duration: 90 }],
      loop: true, loopDelay: 3600, ease: 'inOutSine',
    });
    return () => { ios.forEach((i) => i.disconnect()); wiggle?.revert(); };
  }, []);

  return (
    <a
      ref={fab}
      href={waLink('Halo JACKQQQ, saya ingin konsultasi')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat WhatsApp ${SITE.phone}`}
      style={{ visibility: 'hidden' }}
      className="fixed right-4 bottom-4 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-[#f5f5f7] px-5 text-sm font-medium text-black shadow-[0_0_0_1px_rgba(255,255,255,.2),0_8px_30px_rgba(255,255,255,.1)] transition-transform duration-150 ease-out-quint active:scale-95"
    >
      <SocialIcon name="WhatsApp" className="size-6" />
      Chat WhatsApp
    </a>
  );
}
