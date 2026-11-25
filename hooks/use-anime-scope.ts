'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { createScope, type Scope } from 'animejs';

/**
 * Runs `setup` inside an anime.js scope rooted at `root`; reverts everything on unmount.
 * `setup` is skipped (content stays in its final, static state) when the user prefers reduced motion.
 * `setup` may return a cleanup function (listeners, observers).
 */
export function useAnimeScope<T extends HTMLElement>(
  setup: (root: T) => void | (() => void),
  deps: unknown[] = []
): RefObject<T | null> {
  const root = useRef<T>(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cleanup: void | (() => void);
    scope.current = createScope({ root: el, mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' } }).add((self) => {
      if (self?.matches.reduceMotion) return;
      cleanup = setup(el);
    });
    return () => {
      if (typeof cleanup === 'function') cleanup();
      scope.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}
