// Spot illustrations in the "thick-line doodle" style. Black parts use currentColor (.f-fg), white parts the
// section background (.f-bg), so they work on both ink and paper surfaces. Classes are styled in globals.css.

export function Person({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 330" className={`ill ${className ?? ''}`} aria-hidden>
      <path className="f-fg" d="M68 178h30l-2 110H72zM102 178h30l-4 110h-24z" />
      <rect className="f-bg" x="54" y="286" width="46" height="24" rx="11" />
      <rect className="f-bg" x="104" y="286" width="46" height="24" rx="11" />
      <path className="f-bg" d="M62 96c14-8 62-8 76 0l6 86H56z" />
      <path className="f-fg" d="M56 176h88v12H56z" />
      <path d="M62 100c-16 16-20 38-10 58" strokeWidth="20" />
      <path className="s-bg" d="M62 100c-16 16-20 38-10 58" strokeWidth="13" />
      <path d="M138 100c14 14 18 34 6 50" strokeWidth="20" />
      <path className="s-bg" d="M138 100c14 14 18 34 6 50" strokeWidth="13" />
      <path className="f-fg" d="M52 168l82-34 10 40-78 28z" />
      <circle className="s-bg" cx="96" cy="170" r="4" fill="var(--bg)" stroke="none" />
      <rect className="f-bg" x="90" y="76" width="20" height="26" rx="8" />
      <circle className="f-bg" cx="100" cy="52" r="26" />
      <path className="f-fg" d="M74 48c-2-20 12-32 28-32 18 0 28 12 24 32-12-12-34-14-52 0z" />
      <path d="M92 60h.1M112 60h.1M94 72c4 4 12 4 16 0" strokeWidth="3.5" />
    </svg>
  );
}

export function CameraRig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 320" className={`ill ${className ?? ''}`} aria-hidden>
      <path d="M100 118v112M100 128L52 300M100 128l48 172M100 230L76 300M100 230l24 70" />
      <path d="M40 300h24M136 300h24" />
      <rect className="f-bg" x="40" y="48" width="120" height="72" rx="12" />
      <path className="f-fg" d="M64 48l8-14h32l8 14z" />
      <circle className="f-fg" cx="100" cy="86" r="28" />
      <circle className="s-bg" cx="100" cy="86" r="17" strokeWidth="2.5" />
      <circle className="f-bg" cx="100" cy="86" r="7" />
      <circle className="f-fg" cx="140" cy="64" r="4" />
      <rect className="f-bg" x="82" y="230" width="36" height="14" rx="4" />
    </svg>
  );
}

export function Plant({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={`ill ${className ?? ''}`} aria-hidden>
      <path className="f-fg" d="M34 112h52l-6 40H40z" />
      <path d="M60 112V60" />
      <path className="f-bg" d="M60 70c-30-2-40-28-30-44 22 4 34 20 30 44zM60 80c24-4 38-22 32-42-20 4-34 18-32 42zM60 100c-24 2-36-12-34-28 18 0 30 10 34 28z" />
      <path d="M60 70c-6-14-14-24-24-34M60 80c8-10 18-24 24-36" />
    </svg>
  );
}

export function DeskScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 300" className={`ill ${className ?? ''}`} aria-hidden>
      <path d="M40 270c60 10 110 6 170-6s110 0 130 10" strokeDasharray="2 9" />
      <g className="desk-float">
        <rect className="f-bg" x="100" y="26" width="220" height="140" rx="10" />
        <rect className="f-fg" x="116" y="42" width="56" height="108" rx="4" />
        <path d="M188 52h104M188 72h70M188 92h92M188 112h54" />
        <path d="M210 166v34M170 200h80" />
      </g>
      <g className="desk-float2">
        <rect className="f-bg" x="22" y="96" width="66" height="116" rx="12" />
        <path d="M36 118h38M36 136h26M36 154h34" />
        <circle className="f-fg" cx="55" cy="192" r="5" />
      </g>
      <g>
        <path className="f-fg" d="M300 270l-6-40h52l-6 40z" />
        <path className="f-bg" d="M320 230c-22-6-26-34-6-52 4 20 10 30 6 52zM320 230c16-14 36-14 44-34-24-2-40 12-44 34zM320 230c-10-26-34-30-52-24 12 16 30 26 52 24z" />
      </g>
      <g className="desk-float2">
        <path className="f-bg" d="M130 262l-5-34h40l-5 34z" />
        <path d="M165 238c12-2 12 14 0 14" /><path className="steam" d="M138 218c0-6 6-6 6-12" /><path className="steam" d="M150 218c0-6 6-6 6-12" />
      </g>
    </svg>
  );
}

const SCRIBBLES = {
  zig: 'M4 36L8 14l8 12 8-14 8 14 8-12 4 22',
  loop: 'M12 12c12-5 18 6 8 9s-9-9 3-9 14 12 6 22c-4 5-10 7-16 6',
  tick: 'M8 40L4 26M16 34L14 18M26 30L36 20',
  curl: 'M4 36c8-16 20-14 16-2s-14 2-2-12 16-6 28 2M38 10l8 8-11 4',
} as const;

export function Scribble({ kind, className }: { kind: keyof typeof SCRIBBLES; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`doodle scribble ${className ?? ''}`} aria-hidden>
      <path d={SCRIBBLES[kind]} />
    </svg>
  );
}
