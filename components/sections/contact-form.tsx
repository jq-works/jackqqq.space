'use client';

import { useRef, useState, type FormEvent } from 'react';
import { animate, createMotionPath, onScroll, spring, splitText, stagger, utils } from 'animejs';
import { useToast } from '@/components/ui/toast';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { SITE } from '@/lib/site';
import { lightWords, prefersReducedMotion, whenVisible } from '@/lib/motion';
import { cn } from '@/lib/cn';

const PURPOSES = ['Freelance', 'Beasiswa', 'Kerja', 'Lainnya'] as const;
const field = 'h-11 w-full rounded-lg border border-line bg-transparent px-4 text-fg placeholder:text-ash focus:border-line focus:outline-none aria-[invalid=true]:border-danger';

export function ContactForm() {
  const toast = useToast();
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]>('Freelance');
  const [err, setErr] = useState<{ name?: string; email?: string; message?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const send = useRef<HTMLButtonElement>(null);
  const formEl = useRef<HTMLFormElement>(null);
  const plane = useRef<HTMLSpanElement>(null);
  const route = useRef<SVGPathElement>(null);
  const refs = { name: useRef<HTMLInputElement>(null), email: useRef<HTMLInputElement>(null), message: useRef<HTMLTextAreaElement>(null) };

  const root = useAnimeScope<HTMLElement>((sec) => {
    const stops: Array<() => void> = [];
    const title = sec.querySelector<HTMLElement>('.contact-title')!;
    const { chars } = splitText(title, { chars: { wrap: 'clip' } });
    utils.set(chars, { translateY: '110%' });
    stops.push(whenVisible(title, () => animate(chars, { translateY: ['110%', '0%'], rotate: [12, 0], duration: 750, ease: 'outExpo', delay: stagger(40) }), 0.4));

    // copy and form fields rise in sequence, once
    const items = Array.from(sec.querySelectorAll<HTMLElement>('.contact-item'));
    utils.set(items, { opacity: 0, translateY: 28 });
    stops.push(whenVisible(sec.querySelector('form')!, () => animate(items, { opacity: 1, translateY: 0, duration: 700, ease: 'outExpo', delay: stagger(80) }), 0.1));

    // handwritten note and heading drift against scroll
    const track = () => onScroll({ target: sec, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'top' }, sync: true });
    const drift = [
      animate(title, { translateY: [14, -14], ease: 'linear', autoplay: track() }),
    ];
    stops.push(lightWords(sec));
    return () => { stops.forEach((s) => s()); drift.forEach((d) => d.revert()); };
  });

  // Paper plane leaves the button on a curve (anime.js motion path), turning with the curve and shrinking into the distance.
  // The path is built in pixels from the real button position, so it starts exactly at the button at any screen size.
  const fly = () => {
    const f = formEl.current, b = send.current, p = plane.current, r = route.current;
    if (!f || !b || !p || !r || prefersReducedMotion()) return;
    const fr = f.getBoundingClientRect(), br = b.getBoundingClientRect();
    const sx = br.left - fr.left + br.width * 0.8, sy = br.top - fr.top + br.height / 2;
    const ex = fr.width + 60, ey = sy - 320;
    r.parentElement!.setAttribute('viewBox', `0 0 ${fr.width} ${fr.height}`);
    r.setAttribute('d', `M${sx} ${sy} C${sx + 70} ${sy + 70} ${sx + 150} ${sy - 150} ${ex - 80} ${ey + 140} S${ex} ${ey + 40} ${ex} ${ey}`);
    animate(b, { scale: [{ to: 0.9, duration: 90 }, { to: 1, ease: spring({ bounce: 0.6, duration: 500 }) }] });
    animate(p, {
      ...createMotionPath(r),
      opacity: [{ to: 1, duration: 100 }, { to: 1, duration: 760 }, { to: 0, duration: 300 }],
      scale: [{ to: 1, duration: 200 }, { to: 0.5, duration: 960 }],
      duration: 1160, ease: 'inOutSine',
      onComplete: () => { p.style.opacity = '0'; },
    });
  };

  const shake = (el: HTMLElement | null) =>
    el && !prefersReducedMotion() && animate(el, { translateX: [{ to: -8, duration: 60 }, { to: 8, duration: 60 }, { to: -5, duration: 60 }, { to: 5, duration: 60 }, { to: 0, duration: 60 }] });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get('name') ?? '').trim().slice(0, 100);
    const email = String(f.get('email') ?? '').trim().slice(0, 200);
    const message = String(f.get('message') ?? '').trim().slice(0, 2000);
    const next: typeof err = {};
    if (!name) next.name = 'Nama wajib diisi';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Email belum benar';
    if (!message) next.message = 'Pesan wajib diisi';
    setErr(next);
    const firstBad = (['name', 'email', 'message'] as const).find((k) => next[k]);
    if (firstBad) {
      refs[firstBad].current?.focus();
      shake(refs[firstBad].current);
      return;
    }
    setSending(true);
    try {
      // ponytail: stored as an analytics event (anon insert allowed). Move to a messages table + email notify with the admin.
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'contact_message', page_path: '/', metadata: { name, email, message, purpose } }),
      });
      if (!res.ok) throw new Error();
      toast('Pesan terkirim');
      form.reset();
      setSent(true);
      setTimeout(() => setSent(false), 2400);
      fly();
    } catch {
      toast('Gagal terkirim. Coba lewat WhatsApp.');
    } finally {
      setSending(false);
    }
  }

  const bad = (k: 'name' | 'email' | 'message') => (err[k] ? { 'aria-invalid': true, 'aria-describedby': `e-${k}` } : {});
  const msg = (k: 'name' | 'email' | 'message') => err[k] && <p id={`e-${k}`} className="mt-1.5 text-sm text-danger">{err[k]}</p>;

  return (
    <section ref={root} id="kontak" className="surface-paper overflow-x-clip px-5 py-20 sm:px-8">
      <div className="surface-ink mx-auto grid max-w-5xl gap-12 rounded-3xl p-7 sm:p-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">Kontak</p>
          <h2 className="contact-title grad-letters mt-4 text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.04] font-extralight tracking-[-0.035em]">Ayo bicara</h2>
          <p className="light-words mt-4 max-w-[62ch] text-lg leading-relaxed text-fg">
            Butuh website yang rapi, siaran langsung acara, motion bumper, atau dokumentasi foto dan video? Terbuka untuk kontrak freelance, peran engineering, dan tantangan teknis. Konsultasi awal gratis.
          </p>
          <ul className="contact-item mt-6 space-y-1 text-muted">
            <li><a className="font-semibold text-fg underline underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li>{SITE.phone}</li>
          </ul>
        </div>

        <form ref={formEl} onSubmit={onSubmit} noValidate className="relative space-y-5">
          <svg aria-hidden className="pointer-events-none absolute top-0 left-0 size-full" viewBox="0 0 100 100"><path ref={route} d="M0 0" fill="none" stroke="none" /></svg>
          <span ref={plane} aria-hidden className="pointer-events-none absolute top-0 left-0 -mt-4 -ml-4 size-8 text-paper opacity-0">
            <svg viewBox="0 0 24 24" className="size-full" fill="currentColor"><path d="M2.5 3.2a.8.8 0 0 1 1.1-.9l17.6 8.2a.8.8 0 0 1 0 1.5L3.6 20a.8.8 0 0 1-1.1-.9l1.8-6.3 9.2-.8-9.2-.8z" /></svg>
          </span>
          <fieldset className="contact-item">
            <legend className="mb-2 text-sm font-semibold">Keperluan</legend>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <label key={p} className={cn('cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150', purpose === p ? 'border-line bg-paper text-ink' : 'border-line')}>
                  <input type="radio" name="purpose" value={p} checked={purpose === p} onChange={() => setPurpose(p)} className="sr-only" />
                  {p}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="contact-item">
            <label htmlFor="f-name" className="mb-1.5 block text-sm font-semibold">Nama</label>
            <input ref={refs.name} id="f-name" name="name" maxLength={100} autoComplete="name" placeholder="Nama kamu" className={field} {...bad('name')} />
            {msg('name')}
          </div>
          <div className="contact-item">
            <label htmlFor="f-email" className="mb-1.5 block text-sm font-semibold">Email</label>
            <input ref={refs.email} id="f-email" name="email" type="email" maxLength={200} autoComplete="email" placeholder="kamu@email.com" className={field} {...bad('email')} />
            {msg('email')}
          </div>
          <div className="contact-item">
            <label htmlFor="f-msg" className="mb-1.5 block text-sm font-semibold">Pesan</label>
            <textarea ref={refs.message} id="f-msg" name="message" rows={5} maxLength={2000} placeholder="Ceritakan kebutuhanmu" className={cn(field, 'h-auto py-3')} {...bad('message')} />
            {msg('message')}
          </div>
          <button
            ref={send}
            type="submit"
            data-cursor="Kirim"
            disabled={sending}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#f5f5f7] pr-2 pl-5 text-sm font-medium text-black transition-transform duration-150 ease-out-quint active:scale-95 disabled:opacity-50"
          >
            {sending ? 'Mengirim…' : sent ? 'Terkirim' : 'Kirim pesan'}
            <span className="grid size-8 place-items-center rounded-full bg-black text-[#f5f5f7] transition-transform duration-250 group-hover:rotate-90">
              +
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
