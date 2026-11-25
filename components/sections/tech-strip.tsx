import { Marquee } from '@/components/ui/marquee';

const TECH = ['Next.js', 'Tailwind', 'TypeScript', 'NestJS', 'Supabase', 'anime.js', 'Vercel', 'Figma', 'OBS', 'Premiere'];
const WEIGHTS = ['font-extrabold', 'font-light', 'font-semibold italic'];

// Two strips of tool names (the reference's logo strip): solid in front, outline behind running the other way.
// Both speed up with scroll velocity via <Marquee/>. Hover on an item is plain CSS (design system: hover/press = CSS, not anime.js).
// The outline row paints its stroke under a background-coloured fill, so Outfit's overlapping contours do not show through.
// The outline row is decorative (aria-hidden, no label) so screen readers hear the list once.
export function TechStrip() {
  return (
    <div className="surface-ink overflow-hidden py-9">
      <Marquee label={`Teknologi: ${TECH.join(', ')}`}>
        {[...TECH, ...TECH].map((t, i) => (
          <span key={i} className={`inline-block shrink-0 px-9 text-2xl tracking-tight transition-transform duration-200 ease-spring hover:scale-110 sm:text-3xl ${WEIGHTS[i % 3]}`}>
            {t}
          </span>
        ))}
      </Marquee>
      <Marquee reverse duration={36000} label="" className="mt-3">
        {[...TECH].reverse().concat([...TECH].reverse()).map((t, i) => (
          <span
            key={i}
            className="inline-block shrink-0 px-9 text-4xl font-extrabold tracking-tight uppercase transition-transform duration-200 ease-spring hover:scale-110 sm:text-6xl"
            style={{ WebkitTextStroke: '3px rgba(245,245,247,.5)', paintOrder: 'stroke fill', color: '#0a0a0a' }}
          >
            {t}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
