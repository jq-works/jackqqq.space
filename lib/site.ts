// Single source for contact + socials + static content. Edit here only.
export const SITE = {
  name: 'JACKQQQ',
  brand: 'JQ Works',
  email: 'jackq.works@gmail.com',
  phone: '+62 851-1123-2385',
  whatsapp: 'https://wa.me/6285111232385',
  location: 'Malang, Indonesia',
  status: 'Menerima project freelance',
  socials: [
    { label: 'Instagram', handle: '@jackqqqq_', href: 'https://instagram.com/jackqqqq_' },
    { label: 'TikTok', handle: '@one_lens', href: 'https://tiktok.com/@one_lens' },
    { label: 'GitHub', handle: 'jq-works', href: 'https://github.com/jq-works' },
    { label: 'LinkedIn', handle: 'mdzakyazzam', href: 'https://linkedin.com/in/mdzakyazzam' },
  ],
} as const;

export const waLink = (text: string) => `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;


// ponytail: static seed from DESIGN-SYSTEM demo. Move to Supabase tables (projects/services/achievements) once admin exists.
export const PROJECTS: { slug: string; title: string; sub: string; meta: string; desc: string; icon?: string; tags: string[] }[] = [
  { slug: 'onelensmedia', title: 'OneLensMedia', sub: 'Landing page startup live streaming', meta: 'Founder', desc: 'Landing page untuk OneLensMedia, startup siaran langsung acara di Malang yang saya dirikan.', tags: ['Next.js', 'Tailwind'] },
  { slug: 'orchicare', title: 'Orchicare', sub: 'Landing page dan demo dashboard', meta: 'Lomba FIKSI 2026', desc: 'Landing page dan demo dashboard untuk lomba FIKSI 2026.', tags: ['Next.js', 'Dashboard'] },
  { slug: 'lokacraft', title: 'Lokacraft', sub: 'Landing page tim lomba', meta: 'Lomba FIKSI 2026', desc: 'Landing page yang dikerjakan atas permintaan tim lomba FIKSI 2026.', tags: ['Next.js', 'Landing page'] },
  { slug: 'saas-pdam', title: 'SaaS PDAM', sub: 'Sistem layanan air bersih berbasis SaaS', meta: 'Demo privat', desc: 'Sistem layanan air bersih berbasis SaaS dengan Next.js dan NestJS, berupa demo privat.', tags: ['Next.js', 'NestJS'] },
  { slug: 'lalapan-cak-bud', title: 'Lalapan Cak Bud', sub: 'Web app pemesanan makanan', meta: 'Tim sekolah', desc: 'Web app pemesanan makanan untuk customer dan admin, lengkap dengan tracking pesanan.', tags: ['Next.js', 'shadcn/ui'] },
  { slug: 'jackqqq-space', title: 'jackqqq.space', sub: 'Website portofolio ini', meta: 'Pribadi', desc: 'Website portofolio yang sedang kamu lihat, dibangun sendiri dengan animasi anime.js.', tags: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'anime.js'] },
];

// How many projects the home page stack shows; the last folder after them links to the full /project page.
export const FEATURED_PROJECTS = 3;

export const SKILL_GROUPS: { title: string; skills: string[] }[] = [
  { title: 'Frontend', skills: ['Next.js', 'TypeScript', 'Tailwind', 'shadcn/ui', 'anime.js'] },
  { title: 'Backend', skills: ['NestJS', 'Supabase'] },
  { title: 'Tools', skills: ['Vercel', 'OBS', 'Premiere'] },
  { title: 'Desain', skills: ['Figma'] },
];

export const STEPS: { title: string; desc: string }[] = [
  { title: 'Konsultasi', desc: 'Ceritakan kebutuhanmu. Konsultasi awal gratis.' },
  { title: 'Desain', desc: 'Susun tampilan dan alur halaman bersama.' },
  { title: 'Pengembangan', desc: 'Dibangun dengan Next.js: cepat dan responsif.' },
  { title: 'Serah terima', desc: 'Deploy lalu serahkan. Domain dan hosting ditanggung klien.' },
];

// Newest first (PRD F-11).
export const TIMELINE: { year: string; items: string[] }[] = [
  { year: '2026', items: ['Mengerjakan Orchicare dan Lokacraft untuk lomba FIKSI 2026.'] },
  { year: '2025', items: ['Finalis Drone Battle tingkat ASEAN, STEM Nexus Malaysia.', 'Finalis BPC ITS.', 'Finalis film pendek, Ratu Film Festival Tulungagung.'] },
];

// ponytail: multimedia prices are "tanya dulu" placeholders until Jackqqq sets real rates.
export const SERVICES: { title: string; icon?: string; price: string; featured?: boolean }[] = [
  { title: 'Landing page', price: 'mulai Rp400 rb', featured: true },
  { title: 'Company profile', price: 'mulai Rp800 rb' },
  { title: 'Dashboard SaaS', price: 'sesuai kebutuhan' },
  { title: 'Live streaming', price: 'tanya dulu' },
  { title: 'Motion bumper', price: 'tanya dulu' },
  { title: 'Fotografi', price: 'tanya dulu' },
  { title: 'Videografi', price: 'tanya dulu' },
  { title: 'Server Minecraft', price: 'mulai Rp150 rb' },
];

export const SERVICE_GROUPS: { title: string; icon?: string; desc: string; price: string }[] = [
  { title: 'Landing Page', desc: '1 halaman responsif, 2 kali revisi, sudah deploy.', price: 'mulai Rp400 rb' },
  { title: 'Company Profile', desc: 'Hingga 4 halaman, 2 kali revisi, sudah deploy.', price: 'mulai Rp800 rb' },
  { title: 'Dashboard SaaS', desc: 'Website dan dashboard SaaS. Estimasi setelah konsultasi.', price: 'sesuai kebutuhan' },
  { title: 'Server Minecraft', desc: 'Setup server dan instalasi plugin.', price: 'mulai Rp150 rb' },
  { title: 'Live Streaming', desc: 'Siaran langsung dan motion bumper untuk acara.', price: 'tanya dulu' },
  { title: 'Foto dan Video', desc: 'Fotografi dan videografi untuk dokumentasi acara.', price: 'tanya dulu' },
];

// One entry per achievement. Details are shown in the viewer. Fields marked "isi" are not in the PRD yet: they are left empty
// on purpose and simply not shown until filled in (never invent organiser names, ranks, or credential numbers).
// Certificate image: drop a file named `<slug>.jpg|png|webp` into public/achievements/ (more: `<slug>-2.jpg`, ...).
export type Achievement = {
  slug: string;
  text: string; // ring text on the sticker
  label: string;
  icon?: string;
  dark: boolean;
  type: string; // jenis: Lomba, Sertifikasi, Beasiswa
  title: string;
  organizer?: string;
  year: string;
  desc: string;
  result?: string; // isi: peringkat / hasil
};

export const STICKERS: Achievement[] = [
  { slug: 'drone-battle-asean-2025', text: 'FINALIS DRONE BATTLE ✦ ASEAN 2025 ✦ ', label: 'Finalis Drone Battle, ASEAN 2025', dark: true, type: 'Lomba', title: 'Finalis Drone Battle tingkat ASEAN', organizer: 'STEM Nexus Malaysia', year: '2025', desc: 'Kompetisi drone internasional. Menguji pilotase presisi, kalibrasi flight controller, dan navigasi arena dengan batas waktu ketat.' },
  { slug: 'bpc-its-2025', text: 'FINALIS BPC ITS ✦ 2025 ✦ FINALIS BPC ITS ✦ ', label: 'Finalis BPC ITS, 2025', dark: false, type: 'Lomba', title: 'Finalis BPC ITS', organizer: 'ITS', year: '2025', desc: 'Lolos ke babak final kompetisi BPC ITS.' },
  { slug: 'film-pendek-tulungagung-2025', text: 'FINALIS FILM PENDEK ✦ TULUNGAGUNG 2025 ✦ ', label: 'Finalis Film Pendek, Tulungagung 2025', dark: true, type: 'Lomba', title: 'Finalis lomba film pendek', organizer: 'Ratu Film Festival Tulungagung', year: '2025', desc: 'Karya film pendek lolos sebagai finalis di festival film Tulungagung.' },
  { slug: 'sertifikasi-nextjs-nestjs', text: 'SERTIFIKASI NEXT.JS & NESTJS ✦ ', label: 'Sertifikasi Next.js dan NestJS', dark: false, type: 'Sertifikasi', title: 'Sertifikasi keahlian Next.js dan NestJS', year: '', desc: 'Sertifikasi keahlian pengembangan web fullstack dengan Next.js dan NestJS.' },
  { slug: 'binus-osis-scholarship', text: 'DITERIMA BINUS ✦ OSIS SCHOLARSHIP ✦ ', label: 'Diterima BINUS, OSIS Scholarship', dark: true, type: 'Beasiswa', title: 'Diterima di BINUS University Malang', organizer: 'BINUS University', year: '', desc: 'Diterima di jurusan Computer Science lewat jalur OSIS Scholarship, mulai 2027.' },
];
