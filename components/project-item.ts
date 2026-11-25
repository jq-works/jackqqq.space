import type { ViewerItem } from '@/components/ui/viewer';
import type { PROJECTS } from '@/lib/site';

export type Project = (typeof PROJECTS)[number];

/** Detail-window content for one project (shared by the home stack and the /project page). */
export const projectItem = (p: Project, images: Record<string, string[]>): ViewerItem => ({
  kicker: p.meta,
  title: p.title,
  facts: [['Jenis', p.sub], ['Teknologi', p.tags.join(', ')]],
  desc: p.desc,
  images: images[p.slug] ?? [],
  alt: `Tampilan ${p.title}`,
});
