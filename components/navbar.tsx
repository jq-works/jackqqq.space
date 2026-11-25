'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animate, createTimeline, onScroll, scrambleText, spring, stagger } from 'animejs';
import { Logo } from '@/components/logo';
import { SocialIcon } from '@/components/social-icon';
import { SITE } from '@/lib/site';
import { prefersReducedMotion } from '@/lib/motion';

const LINKS = [
  { href: '#atas', label: 'Beranda' },
  { href: '#tentang', label: 'Tentang' },
  { href: '#project', label: 'Project' },
  { href: '#prestasi', label: 'Prestasi' },
  { href: '#kontak', label: 'Kontak' },
] as const;

const SQUIGGLE = 'M2 6c10-6 14 4 24-1s14 4 24-1 14 4 24-1';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname === '/' ? '#atas' : '#project'); // off the home page, "Project" stays lit
  const pop = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const openRef = useRef(false);
  openRef.current = open;

  // Floating bar: pops up (spring) once the page is scrolled down past the hero bar, hides again at the top.
  useEffect(() => {
    const el = pop.current;
    if (!el) return;
    let shown = false;
    const set = (show: boolean) => {
      if (show === shown) return;
      shown = show;
      if (show) el.removeAttribute('inert'); else el.setAttribute('inert', '');
      el.style.visibility = 'visible';
      if (prefersReducedMotion()) {
        el.style.transform = show ? 'none' : 'translateY(-150%)';
        if (!show) el.style.visibility = 'hidden';
        return;
      }
      animate(el, show
        ? { translateY: ['-150%', '0%'], scale: [0.92, 1], ease: spring({ bounce: 0.45, duration: 700 }) }
        : { translateY: '-150%', duration: 300, ease: 'inQuad', onComplete: () => !shown && (el.style.visibility = 'hidden') });
    };
    const onScroll = () => { if (!openRef.current) set(scrollY > 120); };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // reading progress: a thin line along the bottom of the floating pill, scrubbed by page scroll (transform only)
  useEffect(() => {
    const line = pop.current?.querySelector<HTMLElement>('.nav-progress');
    if (!line || prefersReducedMotion()) return;
    const a = animate(line, { scaleX: [0, 1], ease: 'linear', autoplay: onScroll({ target: document.body, enter: { target: 'top', container: 'top' }, leave: { target: 'bottom', container: 'bottom' }, sync: true }) });
    return () => { a.revert(); };
  }, []);

  // never leave the page scroll-locked if the menu is still open when we navigate away
  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  // underline follows the section in view (home page only: the sections do not exist elsewhere)
  useEffect(() => {
    const ids = LINKS.map((l) => (l.href === '#atas' ? 'hero' : l.href.slice(1)));
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setCurrent(e.target.id === 'hero' ? '#atas' : `#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    if (pathname !== '/') return;
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const openMenu = useCallback(() => {
    const m = menu.current;
    if (!m) return;
    opener.current = document.activeElement as HTMLElement | null;
    m.removeAttribute('inert');
    document.body.style.overflow = 'hidden';
    setOpen(true);
    if (!prefersReducedMotion()) {
      createTimeline({ defaults: { ease: 'outExpo' } })
        .add(m, { translateY: ['-100%', '0%'], duration: 600 })
        .add(m.querySelectorAll('.menu-link'), { translateY: ['110%', '0%'], duration: 700, delay: stagger(60) }, '-=350')
        .add(m.querySelectorAll('.menu-icon'), { scale: [0, 1], rotate: [-90, 0], ease: spring({ bounce: 0.5, duration: 700 }), delay: stagger(60) }, '-=600');
    } else {
      m.style.transform = 'translateY(0)';
    }
    setTimeout(() => closeBtn.current?.focus(), 80);
  }, []);

  const closeMenu = useCallback(() => {
    const m = menu.current;
    if (!m) return;
    const done = () => {
      document.body.style.overflow = '';
      m.setAttribute('inert', '');
      setOpen(false);
      opener.current?.focus();
    };
    if (prefersReducedMotion()) {
      m.style.transform = 'translateY(-100%)';
      done();
    } else {
      animate(m, { translateY: ['0%', '-100%'], duration: 450, ease: 'inExpo', onComplete: done });
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && openRef.current && closeMenu();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [closeMenu]);

  const wobbleLogo = (e: React.MouseEvent<HTMLElement>) =>
    !prefersReducedMotion() &&
    animate(e.currentTarget, { rotate: [{ to: -10, duration: 120 }, { to: 6, duration: 120 }, { to: 0, ease: spring({ bounce: 0.6, duration: 600 }) }] });

  const scramble = (e: React.PointerEvent<HTMLButtonElement>) =>
    !prefersReducedMotion() && animate(e.currentTarget, { innerHTML: scrambleText({ text: 'Menu', chars: 'A-Za-z', duration: 450 }) });

  // one bar, rendered twice: attached to the hero (no background, blends into the page, scrolls away with it)
  // and floating (white pill, pops up after scrolling down)
  const bar = (floating: boolean) => (
    <div className={`relative mx-auto flex items-center justify-between rounded-full px-5 py-3 text-ink ${floating ? 'glass max-w-[1320px] ring-1 ring-line' : 'max-w-[1480px] sm:px-8'}`}>
      {floating && (
        <span aria-hidden className="pointer-events-none absolute inset-x-8 bottom-[3px] h-[3px] overflow-hidden rounded-full bg-ink/10">
          <span className="nav-progress block h-full origin-left scale-x-0 rounded-full bg-ink" />
        </span>
      )}
      <Link href="/#atas" aria-label="JQ, kembali ke atas" onClick={wobbleLogo} className="flex items-center">
        <Logo className="size-14 text-2xl" />
      </Link>

      <nav aria-label="Utama" className="hidden items-center gap-10 text-base md:flex">
        {LINKS.map((l) => (
          <Link key={l.href} href={`/${l.href}`} aria-current={current === l.href ? 'true' : undefined} className="relative py-1 text-ink/70 transition-colors hover:text-ink aria-[current=true]:text-ink">
            {l.label}
            <svg className="nav-u absolute inset-x-0 -bottom-1 h-2 w-full" viewBox="0 0 76 10" preserveAspectRatio="none" aria-hidden>
              <path d={SQUIGGLE} pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <div className="hidden gap-2 sm:flex">
          {SITE.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-10 place-items-center rounded-full bg-ink text-paper transition-transform duration-150 hover:scale-110 active:scale-95">
              <SocialIcon name={s.label} className="size-5" />
            </a>
          ))}
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={openMenu}
          onPointerEnter={scramble}
          className="h-11 rounded-full bg-ink px-5 text-base font-medium text-paper transition-transform duration-150 ease-out-quint active:scale-95 md:hidden"
        >
          Menu
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* attached to the hero: absolute, so it scrolls away with the page */}
      <header className="absolute inset-x-0 top-0 z-30 px-3 pt-4 sm:px-4">
        {bar(false)}
      </header>

      {/* floating copy: hidden at the top, pops up after scrolling down */}
      <header
        ref={pop}
        {...({ inert: true } as object)}
        style={{ visibility: 'hidden', transform: 'translateY(-150%)' }}
        className="fixed inset-x-0 top-0 z-40 px-3 pt-4 sm:px-6"
      >
        {bar(true)}
      </header>

      <div
        ref={menu}
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        {...({ inert: true } as object)}
        style={{ transform: 'translateY(-100%)' }}
        className="surface-ink fixed inset-0 z-50 flex flex-col overflow-y-auto px-5 pt-24 pb-10 sm:px-10"
      >
        <button ref={closeBtn} type="button" onClick={closeMenu} className="absolute top-4 right-4 h-10 rounded-full bg-[#f5f5f7] px-5 text-sm font-medium text-black active:scale-95 sm:right-6">
          Tutup
        </button>
        <nav className="space-y-1">
          {LINKS.map((l, i) => (
            <div key={l.href} className="overflow-hidden">
              <Link href={`/${l.href}`} onClick={closeMenu} className="menu-link flex items-baseline gap-4 py-1 text-5xl font-light tracking-[-0.03em]">
                <span className="menu-icon eyebrow w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="grad-soft">{l.label}</span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
