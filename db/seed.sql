-- Seed data untuk development testing

-- Projects
insert into public.projects (title, slug, description, category, tags, featured, order_index) values
  ('OneLensMedia', 'onelens-media', 'Platform live streaming untuk content creator dan bisnis di Malang', 'landing-page', array['Next.js', 'Tailwind', 'Framer Motion'], true, 1),
  ('Admin Dashboard Fintech', 'fintech-dashboard', 'Dashboard admin untuk monitoring transaksi dan analytics', 'web-app', array['React', 'TypeScript', 'Recharts'], true, 2),
  ('E-commerce Platform', 'ecommerce-platform', 'Platform e-commerce dengan fitur pembayaran dan tracking', 'saas', array['Next.js', 'Supabase', 'Stripe'], false, 3);

-- Education
insert into public.education (school, degree, field, start_date, end_date, description, is_current, order_index) values
  ('SMK Telkom Malang', 'RPL (Rekayasa Perangkat Lunak)', 'Software Development', '2022-01-01', '2025-06-30', 'Juara Hackathon, ASEAN Scholar', true, 1),
  ('BINUS University', 'S1 Computer Science', 'Software Engineering', '2025-08-01', null, 'BINUS Scholarship recipient', true, 2);

-- Skills
insert into public.skills (name, category, proficiency, order_index) values
  ('Next.js', 'frontend', 'expert', 1),
  ('React', 'frontend', 'expert', 2),
  ('TypeScript', 'frontend', 'advanced', 3),
  ('Tailwind CSS', 'frontend', 'expert', 4),
  ('Framer Motion', 'frontend', 'advanced', 5),
  ('Node.js', 'backend', 'advanced', 6),
  ('Supabase', 'backend', 'advanced', 7),
  ('PostgreSQL', 'backend', 'intermediate', 8),
  ('Figma', 'design', 'advanced', 9),
  ('Git', 'tools', 'expert', 10);

-- Services
insert into public.services (title, description, price_range, icon_name, order_index) values
  ('Landing Page', 'Website landing page yang cepat dan dioptimasi untuk konversi. Termasuk design, development, dan deployment.', '5jt-10jt', 'globe', 1),
  ('Web Application', 'Aplikasi web custom dengan backend, database, dan real-time features. Scalable dan production-ready.', '20jt-50jt', 'layers', 2),
  ('Website Maintenance', 'Support dan maintenance untuk website/aplikasi existing. Update, bugfix, dan feature additions.', 'custom', 'wrench', 3);

-- Achievements
insert into public.achievements (title, description, date, category, url, order_index) values
  ('ASEAN Hackathon Winner', 'Juara hackathon level ASEAN dengan project OneLensMedia', '2024-09-15', 'competition', 'https://asean-hackathon.example.com', 1),
  ('BINUS Full Scholarship', 'Penerima beasiswa penuh program S1 Computer Science di BINUS University', '2025-06-01', 'award', 'https://binus.ac.id', 2),
  ('Freelance 5+ Projects', 'Sukses menyelesaikan 5+ project freelance dengan client satisfaction 100%', '2024-12-01', 'milestone', null, 3);
