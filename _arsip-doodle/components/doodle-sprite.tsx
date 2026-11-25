// Doodle sprite (DESIGN-SYSTEM section 6). Use: <Doodle id="d-spark" className="size-8 " />
// Inline <path>s are needed for draw animations, so use inlineDoodle() data when you must animate strokes.
export function DoodleSprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <symbol id="d-spark" viewBox="0 0 48 48"><path d="M24 4c2 14 6 18 20 20-14 2-18 6-20 20-2-14-6-18-20-20 14-2 18-6 20-20z"/></symbol>
      <symbol id="d-cloud" viewBox="0 0 48 48"><path d="M13 35h23a8 8 0 0 0 1-16 11 11 0 0 0-21-2 9 9 0 0 0-3 18z"/><path d="M19 27c1.5 1.5 3.5 1.5 5 0"/></symbol>
      <symbol id="d-smile" viewBox="0 0 48 48"><circle cx="24" cy="24" r="19"/><path d="M18 19v3M30 19v3M15.5 28c4.5 6 12.5 6 17 0"/></symbol>
      <symbol id="d-arrow" viewBox="0 0 48 48"><path d="M5 34c7-12 13 5 20-6s9-15 17-14"/><path d="M35 9l7 5-5 7"/></symbol>
      <symbol id="d-cube" viewBox="0 0 48 48"><path d="M24 5l17 9.5v19L24 43 7 33.5v-19z"/><path d="M7 14.5L24 24l17-9.5M24 24v19"/><path d="M15 23l3 1.7M30 31l3-1.7"/></symbol>
      <symbol id="d-monitor" viewBox="0 0 48 48"><rect x="5" y="8" width="38" height="26" rx="4"/><path d="M18 42h12M24 34v8M14 18l4 3-4 3M22 25h9"/></symbol>
      <symbol id="d-building" viewBox="0 0 48 48"><path d="M9 43V13l15-7v37M24 19h15v24M5 43h38M15 18h3M15 25h3M15 32h3M30 26h3M30 33h3"/></symbol>
      <symbol id="d-chart" viewBox="0 0 48 48"><rect x="5" y="7" width="38" height="34" rx="4"/><path d="M13 33V24M21 33V17M29 33v-6M37 33V14"/></symbol>
      <symbol id="d-bolt" viewBox="0 0 48 48"><path d="M27 4L10 28h12l-3 16 19-26H26z"/></symbol>
      <symbol id="d-cursor" viewBox="0 0 48 48"><path d="M10 6l26 14-11 3-5 11z"/><path d="M33 33l5 5M38 27l4 1M28 38l1 4"/></symbol>
      <symbol id="d-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
      <symbol id="d-chat" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5z"/></symbol>
      <symbol id="d-trophy" viewBox="0 0 48 48"><path d="M15 7h18v10a9 9 0 0 1-18 0zM15 11H8c0 7 3 10 8 10M33 11h7c0 7-3 10-8 10M24 26v8M16 41h16l-2-7H18z"/></symbol>
      <symbol id="d-film" viewBox="0 0 48 48"><rect x="6" y="12" width="36" height="26" rx="3"/><path d="M6 19h36M6 31h36M13 12v7M20 12v7M28 12v7M35 12v7M13 31v7M20 31v7M28 31v7M35 31v7"/></symbol>
      <symbol id="d-drone" viewBox="0 0 48 48"><path d="M17 24h14M20 20h8v8h-8z"/><path d="M17 24L9 16M31 24l8-8M17 24l-8 8M31 24l8 8"/><path d="M3 14h12M33 14h12M3 34h12M33 34h12"/></symbol>
      <symbol id="d-code" viewBox="0 0 48 48"><path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 9l-6 30"/></symbol>
      <symbol id="d-heart" viewBox="0 0 48 48"><path d="M24 41S6 30 6 18a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 12-18 23-18 23z"/></symbol>
    </svg>
  );
}

export const DOODLES = {
  'd-spark': { viewBox: '0 0 48 48', body: '<path d="M24 4c2 14 6 18 20 20-14 2-18 6-20 20-2-14-6-18-20-20 14-2 18-6 20-20z"/>' },
  'd-cloud': { viewBox: '0 0 48 48', body: '<path d="M13 35h23a8 8 0 0 0 1-16 11 11 0 0 0-21-2 9 9 0 0 0-3 18z"/><path d="M19 27c1.5 1.5 3.5 1.5 5 0"/>' },
  'd-smile': { viewBox: '0 0 48 48', body: '<circle cx="24" cy="24" r="19"/><path d="M18 19v3M30 19v3M15.5 28c4.5 6 12.5 6 17 0"/>' },
  'd-arrow': { viewBox: '0 0 48 48', body: '<path d="M5 34c7-12 13 5 20-6s9-15 17-14"/><path d="M35 9l7 5-5 7"/>' },
  'd-cube': { viewBox: '0 0 48 48', body: '<path d="M24 5l17 9.5v19L24 43 7 33.5v-19z"/><path d="M7 14.5L24 24l17-9.5M24 24v19"/><path d="M15 23l3 1.7M30 31l3-1.7"/>' },
  'd-monitor': { viewBox: '0 0 48 48', body: '<rect x="5" y="8" width="38" height="26" rx="4"/><path d="M18 42h12M24 34v8M14 18l4 3-4 3M22 25h9"/>' },
  'd-building': { viewBox: '0 0 48 48', body: '<path d="M9 43V13l15-7v37M24 19h15v24M5 43h38M15 18h3M15 25h3M15 32h3M30 26h3M30 33h3"/>' },
  'd-chart': { viewBox: '0 0 48 48', body: '<rect x="5" y="7" width="38" height="34" rx="4"/><path d="M13 33V24M21 33V17M29 33v-6M37 33V14"/>' },
  'd-bolt': { viewBox: '0 0 48 48', body: '<path d="M27 4L10 28h12l-3 16 19-26H26z"/>' },
  'd-cursor': { viewBox: '0 0 48 48', body: '<path d="M10 6l26 14-11 3-5 11z"/><path d="M33 33l5 5M38 27l4 1M28 38l1 4"/>' },
  'd-plus': { viewBox: '0 0 24 24', body: '<path d="M12 5v14M5 12h14"/>' },
  'd-chat': { viewBox: '0 0 24 24', body: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5z"/>' },
  'd-trophy': { viewBox: '0 0 48 48', body: '<path d="M15 7h18v10a9 9 0 0 1-18 0zM15 11H8c0 7 3 10 8 10M33 11h7c0 7-3 10-8 10M24 26v8M16 41h16l-2-7H18z"/>' },
  'd-film': { viewBox: '0 0 48 48', body: '<rect x="6" y="12" width="36" height="26" rx="3"/><path d="M6 19h36M6 31h36M13 12v7M20 12v7M28 12v7M35 12v7M13 31v7M20 31v7M28 31v7M35 31v7"/>' },
  'd-drone': { viewBox: '0 0 48 48', body: '<path d="M17 24h14M20 20h8v8h-8z"/><path d="M17 24L9 16M31 24l8-8M17 24l-8 8M31 24l8 8"/><path d="M3 14h12M33 14h12M3 34h12M33 34h12"/>' },
  'd-code': { viewBox: '0 0 48 48', body: '<path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 9l-6 30"/>' },
  'd-heart': { viewBox: '0 0 48 48', body: '<path d="M24 41S6 30 6 18a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 12-18 23-18 23z"/>' },
} as const;

import { DOODLE_LIB, type LibDoodleId } from './doodle-lib';

export type DoodleId = keyof typeof DOODLES | LibDoodleId;

const lib = (id: string) => (id.startsWith('x-') ? DOODLE_LIB[id.slice(2) as keyof typeof DOODLE_LIB] : undefined);

type SvgExtra = Omit<React.SVGProps<SVGSVGElement>, 'id' | 'children'>;

export function Doodle({ id, className, style, ...rest }: { id: DoodleId; className?: string; style?: React.CSSProperties } & SvgExtra & { elId?: string }) {
  const { elId, ...svg } = rest as SvgExtra & { elId?: string };
  const l = lib(id);
  if (l) {
    // library doodles are inlined (no sprite symbol); their native stroke is 3.4 at 48px
    return <svg id={elId} viewBox="0 0 48 48" className={`doodle ${className ?? ''}`} style={{ strokeWidth: 3, ...style }} aria-hidden dangerouslySetInnerHTML={{ __html: l }} {...svg} />;
  }
  return (
    <svg id={elId} className={`doodle ${className ?? ''}`} style={style} aria-hidden {...svg}>
      <use href={`#${id}`} />
    </svg>
  );
}

/** Inline copy (real <path>s) so anime.js createDrawable can animate strokes. */
export function DoodleInline({ id, className, style }: { id: DoodleId; className?: string; style?: React.CSSProperties }) {
  const l = lib(id);
  const html = l ?? DOODLES[id as keyof typeof DOODLES].body;
  const viewBox = l ? '0 0 48 48' : DOODLES[id as keyof typeof DOODLES].viewBox;
  return <svg viewBox={viewBox} className={`doodle ${className ?? ''}`} style={style} aria-hidden dangerouslySetInnerHTML={{ __html: html }} />;
}
