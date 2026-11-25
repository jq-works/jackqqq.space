import type { Metadata } from 'next';
import { SiteShell } from '@/components/site-shell';
import { AllProjects } from '@/components/sections/all-projects';
import { imagesFor } from '@/lib/media';
import { PROJECTS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Semua Project — JACKQQQ',
  description: 'Seluruh portfolio JACKQQQ: website, sistem SaaS, dan produksi multimedia, lengkap dengan teknologi yang dipakai.',
};

export default async function ProjectsPage() {
  const images = await imagesFor('projects', PROJECTS.map((p) => p.slug));
  return (
    <SiteShell>
      <main id="atas">
        <AllProjects projects={PROJECTS} images={images} />
      </main>
    </SiteShell>
  );
}
