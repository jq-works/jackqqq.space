'use client';

import { animate, createDrawable, onScroll, spring, stagger, utils } from 'animejs';
import { useAnimeScope } from '@/hooks/use-anime-scope';
import { PROJECTS, SKILL_GROUPS } from '@/lib/site';
import { magnetic, spotlight } from '@/lib/fx';
import { prefersReducedMotion, revealBlocks, revealTitles, whenVisible } from '@/lib/motion';

// PRD F-13: skills grouped, each linked to the projects that use it (click a skill to light up its projects).
export function TechStack() {
  const ref = useAnimeScope<HTMLElement>((root) => {
    const stops = [revealTitles(root), revealBlocks(root)];
    const a: Array<{ revert: () => void }> = [];
    const chips = Array.from(root.querySelectorAll<HTMLElement>('.chip'));
    utils.set(chips, { scale: 0, rotate: () => utils.random(-10, 10) });
    stops.push(whenVisible(root.querySelector('#groups')!, () => animate(chips, { scale: 1, rotate: 0, ease: spring({ bounce: 0.5, duration: 700 }), delay: stagger(45) }), 0.2));
    a.push(animate(root.querySelector('#groups')!, { translateY: [24, -24], ease: 'linear', autoplay: onScroll({ target: root, enter: { target: 'top', container: 'bottom' }, leave: { target: 'bottom', container: 'top' }, sync: true }) }));

    // selecting a skill highlights the projects that use it
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.uses'));
    let picked = '';
    const onClick = (e: Event) => {
      const chip = (e.target as Element).closest<HTMLElement>('.chip');
      if (!chip) return;
      picked = picked === chip.dataset.skill ? '' : chip.dataset.skill!;
      chips.forEach((c) => { const on = c.dataset.skill === picked; c.setAttribute('aria-pressed', String(on)); });
      rows.forEach((r) => {
        const hit = !picked || r.dataset.tags!.split('|').includes(picked);
        animate(r, { opacity: hit ? 1 : 0.2, scale: hit ? 1 : 0.97, duration: 350, ease: 'outQuad' });
      });
    };
    root.addEventListener('click', onClick);
    const stopMag = magnetic(chips, 0.22, 3); // pad 3 < half the 8px gap between chips
    const stopSpot = spotlight(rows);

    // Hand-drawn connector: from the picked chip to the left edge of each project that uses it (createDrawable draws it in).
    // The chip column drifts with scroll, so the geometry is recomputed from live positions on every scroll frame while a
    // skill is picked; only the path `d` changes, the draw animation is untouched. Side-by-side layout only (md and up).
    const board = root.querySelector<HTMLElement>('#board')!;
    const svg = root.querySelector<SVGSVGElement>('#links')!;
    let drawn: { revert: () => void } | undefined;
    let current: { chip: HTMLElement; pairs: Array<{ path: SVGPathElement; row: HTMLElement }>; dot: SVGCircleElement } | null = null;
    const layout = () => {
      if (!current) return;
      const br = board.getBoundingClientRect();
      // magnetic() translates chips toward the pointer; measure them at rest so the line never anchors to a pulled position
      const rest = (c: HTMLElement) => { const r = c.getBoundingClientRect(), m = new DOMMatrix(getComputedStyle(c).transform); return { left: r.left - m.e, right: r.right - m.e, top: r.top - m.f, bottom: r.bottom - m.f, width: r.width }; };
      const chipRect = rest(current.chip);
      // rightmost edge of the chips sharing this chip's row, so the flat run starts after the whole row
      const rowRight = Math.max(...Array.from(root.querySelectorAll<HTMLElement>('.chip')).map((c) => rest(c)).filter((c) => Math.abs(c.top - chipRect.top) < 4).map((c) => c.right)) - br.left;
      const cr = { left: chipRect.left, width: chipRect.width, bottom: chipRect.bottom, rightEdge: rowRight };
      svg.setAttribute('viewBox', `0 0 ${br.width} ${br.height}`);
      const x0 = cr.left + cr.width / 2 - br.left, y0 = cr.bottom - br.top - 1;
      const gutter = y0 + 10; // runs in the strip just under this chip row, clear of the chips themselves
      current.dot.setAttribute('cx', String(x0)); current.dot.setAttribute('cy', String(y0));
      current.pairs.forEach(({ path, row }) => {
        const rr = row.getBoundingClientRect();
        const x1 = rr.left - br.left - 6, y1 = rr.top + rr.height / 2 - br.top;
        const mx = x0 + (x1 - x0) * 0.55;
        // straight down out of the chip, then a long flat run just under the row, then a gentle curve up/down to the project
        const run = Math.max(x0 + 24, cr.rightEdge + 12);
        path.setAttribute('d', `M${x0} ${y0} L${x0} ${gutter} L${run} ${gutter} C${run + (x1 - run) * 0.5} ${gutter} ${run + (x1 - run) * 0.5} ${y1} ${x1} ${y1}`);
      });
    };
    const clearLinks = () => { drawn?.revert(); svg.replaceChildren(); current = null; };
    const drawLinks = (chip: HTMLElement | null) => {
      clearLinks();
      if (!chip || prefersReducedMotion() || !matchMedia('(min-width: 768px)').matches) return;
      const users = rows.filter((r) => r.dataset.tags!.split('|').includes(chip.dataset.skill!));
      if (!users.length) return;
      const mk = (tag: string) => document.createElementNS('http://www.w3.org/2000/svg', tag);
      const pairs = users.map((row) => {
        const path = mk('path') as SVGPathElement;
        path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.6'); path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
        return { path, row };
      });
      const dot = mk('circle') as SVGCircleElement;
      dot.setAttribute('r', '3.5'); dot.setAttribute('fill', 'currentColor');
      svg.appendChild(dot);
      current = { chip, pairs, dot };
      layout();
      const lines = createDrawable(pairs.map((x) => x.path));
      utils.set(lines, { draw: '0 0' });
      utils.set(dot, { opacity: 0 });
      animate(dot, { opacity: 1, duration: 200 });
      drawn = animate(lines, { draw: '0 1', duration: 700, delay: stagger(90), ease: 'inOutQuad' });
    };
    const onPick = (e: Event) => { const chip = (e.target as Element).closest<HTMLElement>('.chip'); if (chip) drawLinks(picked ? chip : null); };
    root.addEventListener('click', onPick);
    let tick = false;
    const onFrame = () => { if (!current || tick) return; tick = true; requestAnimationFrame(() => { tick = false; layout(); }); };
    addEventListener('scroll', onFrame, { passive: true });
    addEventListener('resize', onFrame);
    return () => { stops.forEach((s) => s()); a.forEach((x) => x.revert()); root.removeEventListener('click', onClick); root.removeEventListener('click', onPick); removeEventListener('scroll', onFrame); removeEventListener('resize', onFrame); clearLinks(); stopMag(); stopSpot(); };
  });

  return (
    <section ref={ref} id="skill" className="surface-paper px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative">
          <h2 className="split-title text-section font-light">Tech <b className="font-bold">stack</b></h2>
        </div>
        <p className="reveal mt-3 max-w-xl text-sm leading-relaxed text-muted">Klik satu skill untuk melihat project yang memakainya.</p>

        <div id="board" className="relative mt-10 grid gap-10 md:grid-cols-[1fr_1fr]">
          <svg id="links" aria-hidden className="pointer-events-none absolute inset-0 hidden size-full overflow-visible text-ink md:block" />
          <div id="groups" className="space-y-6">
            {SKILL_GROUPS.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-semibold">{g.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <button key={s} type="button" data-skill={s} aria-pressed="false" className="chip rounded-full border border-line px-4 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-ink hover:text-paper aria-pressed:bg-ink aria-pressed:text-paper">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <ul className="space-y-2" aria-live="polite">
            {PROJECTS.map((p) => (
              <li key={p.slug} className="uses spot flex items-center justify-between gap-3 border-b border-line px-2 py-2 text-sm" data-tags={p.tags.join('|')}>
                <span className="font-semibold">{p.title}</span>
                <span className="text-xs text-muted">{p.tags.join(' · ')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
