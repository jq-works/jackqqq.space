import { SiteShell } from '@/components/site-shell';
import { Hero } from '@/components/sections/hero';
import { Reel } from '@/components/sections/reel';
import { TechStrip } from '@/components/sections/tech-strip';
import { Statement } from '@/components/sections/statement';
import { Projects } from '@/components/sections/projects';
import { Journey } from '@/components/sections/journey';
import { AchievementStickers } from '@/components/sections/achievement-stickers';
import { ContactForm } from '@/components/sections/contact-form';
import { imagesFor } from '@/lib/media';
import { FEATURED_PROJECTS, PROJECTS, STICKERS } from '@/lib/site';

// Home is kept short: who, story, selected work, achievements, contact. Anything with many items lives on its own page
// (all projects: /project). Services, work process, tech stack and FAQ were removed from the home page; their components
// (components/sections/{services,process,tech-stack,faq}.tsx) are still on disk and can be mounted again here or on a new route.
export default async function Home() {
  const [projectImages, achievementImages, heroImages] = await Promise.all([
    imagesFor('projects', PROJECTS.map((p) => p.slug)),
    imagesFor('achievements', STICKERS.map((s) => s.slug)),
    imagesFor('hero', ['reel']),
  ]);
  return (
    <SiteShell>
      <main id="atas">
        <Hero />
        <Reel image={heroImages.reel[0]} />
        <Journey />
        <TechStrip />
        <Statement />
        <Projects images={projectImages} featured={PROJECTS.slice(0, FEATURED_PROJECTS)} total={PROJECTS.length} />
        <AchievementStickers images={achievementImages} />
        <ContactForm />
      </main>
    </SiteShell>
  );
}
