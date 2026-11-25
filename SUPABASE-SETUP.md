# Supabase Setup Instructions

## Status: ✅ Schema Deployed

Database schema sudah di-deploy ke Supabase (tables + RLS policies + indexes).

---

## ✅ Step 1: Verify Tables Created

Go to Supabase Dashboard → **SQL Editor** → run:

```sql
select table_name from information_schema.tables where table_schema = 'public' order by table_name;
```

**Expected tables:**
- achievements
- analytics_events
- education
- projects
- services
- skills

---

## Step 2: Insert Seed Data (Optional for testing)

Copy semua dari `db/seed.sql` → paste ke SQL Editor → **Run**

This adds sample data untuk 3 projects, 2 education entries, 10 skills, 3 services, 3 achievements.

Atau manual insert lewat dashboard UI:

1. Dashboard → **Table Editor**
2. Select table (e.g., projects)
3. Click **+ Insert Row**
4. Fill data

---

## Step 3: Test API Routes

Dev server running di `http://localhost:3000`

**Test endpoints:**

```bash
# Health check
curl http://localhost:3000/api/health

# Get all projects
curl http://localhost:3000/api/projects

# Get featured projects only
curl http://localhost:3000/api/projects?featured=true

# Get skills
curl http://localhost:3000/api/skills

# Get education
curl http://localhost:3000/api/education

# Get services
curl http://localhost:3000/api/services

# Get achievements
curl http://localhost:3000/api/achievements

# Track analytics event (POST)
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"event_type":"page_view","page_path":"/","metadata":{"source":"direct"}}'
```

**Expected response (empty if no seed data):**
```json
{"data":[],"error":null,"success":true}
```

**With seed data:**
```json
{"data":[{"id":"...","title":"OneLensMedia",...}],"error":null,"success":true}
```

---

## Environment Variables

**Current `.env` file has:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

**Keep these secret!** Never commit `.env` to git (already in `.gitignore`).

---

## Next Steps

### Phase 3: Build Components

Once data is seeded and API routes verified, build:

1. **Navbar Component** — sticky header with nav links
2. **Hero Section** — glassmorphic + Framer Motion
3. **ProjectGrid Component** — fetch from `/api/projects`
4. **Services Section** — fetch from `/api/services`
5. **About Section** — fetch from `/api/education`, `/api/achievements`
6. **Contact Form** — POST to `/api/analytics`
7. **Footer** — static + social links

### Data Flow

```
Components 
    ↓
useFetch() hook (or fetch() in useEffect)
    ↓
/api/projects, /api/skills, /api/education, etc.
    ↓
Supabase (via supabase-js)
    ↓
Database
```

Components **never** connect directly to Supabase. Always use API routes for:
- Consistency
- Security (service_role key hidden in backend)
- Error handling centralized
- Caching (can add later)

---

## Troubleshooting

### API returns error

Check `.env` file:
```bash
cat .env | grep SUPABASE
```

If values missing or wrong, update `.env` and restart dev server (`npm run dev`).

### RLS policy blocking access

Check Supabase dashboard → **Auth** → **Policies**

All tables should have:
- `projects_public_read` ✅ public read
- `projects_auth_write` ✅ authenticated write
- etc.

### Tables not accessible via REST API

Supabase dashboard → **Integrations** → **Data API** → **Settings**

Verify `anon` and `authenticated` roles have access to public schema.

---

## Schema Reference

### projects
- `id`, `title`, `slug`, `description`, `category` (landing-page|saas|web-app|mobile)
- `tags[]`, `thumbnail_url`, `demo_url`, `repo_url`
- `featured` (boolean), `order_index`, `created_at`, `updated_at`

### education
- `id`, `school`, `degree`, `field`, `start_date`, `end_date`
- `description`, `is_current`, `order_index`, `created_at`, `updated_at`

### skills
- `id`, `name`, `category` (frontend|backend|tools|design)
- `proficiency` (beginner|intermediate|advanced|expert)
- `order_index`, `created_at`, `updated_at`

### services
- `id`, `title`, `description`, `price_range`, `icon_name`
- `order_index`, `created_at`, `updated_at`

### achievements
- `id`, `title`, `description`, `date`, `category` (competition|award|publication|milestone)
- `url`, `order_index`, `created_at`, `updated_at`

### analytics_events
- `id`, `event_type` (page_view|cta_click|contact_form|download)
- `page_path`, `user_id`, `metadata` (jsonb), `created_at`

---

## Security Notes

✅ RLS enabled on all tables
✅ Public read for content tables (projects, education, skills, services, achievements)
✅ Auth-only write (prevents spam/abuse)
✅ Service role key never exposed to client
✅ Anon key safe (data already public)

**For admin dashboard (Phase 4):**
- Add Supabase Auth
- Check `auth.uid()` in RLS policies
- Implement edit/delete only for owner
