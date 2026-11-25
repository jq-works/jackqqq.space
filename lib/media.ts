import { readdir } from 'node:fs/promises';
import path from 'node:path';

const EXT = /\.(jpe?g|png|webp|avif)$/i;

/**
 * Lists images for each slug from `public/<folder>/`. A file belongs to a slug when its name is `<slug>.<ext>` or
 * `<slug>-<anything>.<ext>`: `<slug>.<ext>` is the cover and comes first, the rest follow in natural order (`-2` before `-10`). Missing folder or no match = empty list.
 * Server-only (uses node:fs: importing it from a client component fails the build). Read on the server at render time, so adding a photo only means dropping the file in the folder.
 */
export async function imagesFor(folder: 'achievements' | 'projects' | 'hero', slugs: string[]): Promise<Record<string, string[]>> {
  'use cache'; // the folders only change on deploy; Cache Components requires fs reads to be cached
  let files: string[] = [];
  try {
    files = (await readdir(path.join(process.cwd(), 'public', folder))).filter((f) => EXT.test(f)).sort();
  } catch {
    // folder missing: nothing to show
  }
  return Object.fromEntries(
    slugs.map((slug) => [
      slug,
      files
        .filter((f) => f.replace(EXT, '') === slug || f.replace(EXT, '').startsWith(`${slug}-`))
        // the plain `<slug>.<ext>` is the cover and comes first; the rest follow in natural order (-2 before -10)
        .sort((x, y) => Number(y.replace(EXT, '') === slug) - Number(x.replace(EXT, '') === slug) || x.localeCompare(y, undefined, { numeric: true }))
        .map((f) => `/${folder}/${f}`),
    ])
  );
}
