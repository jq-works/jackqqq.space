'use client';

import { animate, spring } from 'animejs';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { spotlight } from '@/lib/fx';
import { revealBlocks, revealTitles } from '@/lib/motion';

const FAQ = [
  ['Berapa lama pengerjaan website?', 'Landing page biasanya beberapa hari sampai satu minggu, tergantung konten dan revisi. Estimasi pastinya saya kabari setelah konsultasi.'],
  ['Berapa kali revisi?', 'Landing page dan company profile sudah termasuk 2 kali revisi.'],
  ['Bagaimana cara pembayaran?', 'Pembayaran dibagi dalam termin dan dibahas saat konsultasi, sebelum pengerjaan dimulai.'],
  ['Domain dan hosting bagaimana?', 'Domain dan hosting ditanggung klien. Saya bantu memasang dan men-deploy-nya.'],
  ['Bagaimana cara mulai bekerja sama?', 'Klik Konsultasi Gratis untuk chat WhatsApp, atau kirim pesan lewat form. Ceritakan kebutuhanmu, lalu kita atur konsultasi awal.'],
] as const;

export function Faq() {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const stops = [revealTitles(root), revealBlocks(root)];
    const stopSpot = spotlight(Array.from(root.querySelectorAll<HTMLElement>('details')));

    // plus icon turns and the answer slides + fades in when a question opens (opacity/transform only, never height)
    const toggles = Array.from(root.querySelectorAll<HTMLDetailsElement>('details'));
    const offs = toggles.map((d) => {
      const f = () => {
        animate(d.querySelector('.faq-plus')!, { rotate: d.open ? 45 : 0, duration: 450, ease: spring({ bounce: 0.5, duration: 450 }) });
        if (d.open) animate(d.querySelector('.faq-answer')!, { opacity: [0, 1], translateY: [-8, 0], duration: 450, ease: 'outExpo' });
      };
      d.addEventListener('toggle', f);
      return () => d.removeEventListener('toggle', f);
    });
    return () => { stops.forEach((s) => s()); offs.forEach((o) => o()); stopSpot(); };
  });

  return (
    <section ref={ref} id="faq" className="surface-paper px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-5xl items-start gap-12">
        <div>
          <h2 className="split-title text-section font-light">Pertanyaan <b className="font-bold">umum</b></h2>
          <div className="reveal mt-8 border-t border-line">
            {FAQ.map(([q, a], i) => (
              <details key={q} open={i === 0} className="group spot border-b border-line px-2 py-4">
                <summary className="flex cursor-pointer list-none items-center gap-3 font-medium [&::-webkit-details-marker]:hidden">
                  <span className="faq-plus inline-block w-4 text-center text-lg leading-none" style={{ transform: i === 0 ? 'rotate(45deg)' : undefined }}>+</span>
                  {q}
                </summary>
                <p className="faq-answer mt-2 pl-7 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
