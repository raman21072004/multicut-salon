-- ============================================================
-- MULTICUT SALON — FULL SCHEMA (run entire file in Supabase SQL Editor)
-- ============================================================

-- PROFILES (role-based access control)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('super_admin', 'admin')),
  created_at timestamptz default now()
);

-- SETTINGS (extended with hero/about content)
create table if not exists settings (
  id integer primary key default 1,
  salon_name text not null default 'Multicut Salon',
  logo_url text,
  phone text,
  whatsapp text,
  email text,
  address text,
  business_hours jsonb,
  instagram text,
  facebook text,
  google_maps text,
  -- Hero section
  hero_title text default 'Where Style Meets Artistry',
  hero_subtitle text default 'Premium hair services for the discerning. Every cut, color, and treatment crafted with intention.',
  hero_image_url text default 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80',
  -- About section
  about_title text default 'Crafted with Precision & Care',
  about_description text default 'At Multicut Salon, we believe that great hair is the foundation of confidence. Our team of skilled artisans combines technical mastery with creative vision to deliver results that exceed expectations.',
  about_image_url text default 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80',
  about_stat_1_value text default '10+',
  about_stat_1_label text default 'Years Experience',
  about_stat_2_value text default '500+',
  about_stat_2_label text default 'Happy Clients',
  about_stat_3_value text default '98%',
  about_stat_3_label text default 'Satisfaction',
  updated_at timestamptz default now()
);

-- Insert default row then update with real salon details
insert into settings (id) values (1) on conflict do nothing;
update settings set
  phone            = '088376 35640',
  whatsapp         = '+918837635640',
  address          = 'Ground floor and 1st floor, Mithapur Road, Near Wadala Chowk, Mann Nagar, Khurla Kingra, Jalandhar, Punjab 144001',
  google_maps      = 'https://maps.app.goo.gl/1FfJYbgdp21rLpyA6',
  business_hours   = '{"Monday":"9am – 8pm","Tuesday":"Closed","Wednesday":"9am – 8pm","Thursday":"9am – 8pm","Friday":"9am – 8pm","Saturday":"9am – 8pm","Sunday":"9am – 8pm"}'::jsonb
where id = 1;

-- SERVICES
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  category text,
  price numeric(10,2),
  duration integer,
  description text,
  image_url text,
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- STYLISTS
create table if not exists stylists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  experience text,
  specialization text,
  bio text,
  availability text,
  instagram text,
  facebook text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- GALLERY
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  category text default 'General',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- REVIEWS
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null check (rating between 1 and 5),
  review text,
  photo_url text,
  created_at timestamptz default now()
);

-- APPOINTMENTS
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  service_id uuid references services(id) on delete set null,
  stylist_id uuid references stylists(id) on delete set null,
  date date not null,
  time text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  created_at timestamptz default now()
);

-- CONTACTS
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table settings enable row level security;
alter table appointments enable row level security;
alter table services enable row level security;
alter table stylists enable row level security;
alter table gallery enable row level security;
alter table reviews enable row level security;
alter table contacts enable row level security;

-- Public reads
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'settings' AND policyname = 'public read settings') THEN
    CREATE POLICY "public read settings" ON settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'public read services') THEN
    CREATE POLICY "public read services" ON services FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'stylists' AND policyname = 'public read stylists') THEN
    CREATE POLICY "public read stylists" ON stylists FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'gallery' AND policyname = 'public read gallery') THEN
    CREATE POLICY "public read gallery" ON gallery FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'public read reviews') THEN
    CREATE POLICY "public read reviews" ON reviews FOR SELECT USING (true);
  END IF;
END $$;

-- Public inserts (booking form, contact form)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' AND policyname = 'public insert appointments') THEN
    CREATE POLICY "public insert appointments" ON appointments FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'public insert contacts') THEN
    CREATE POLICY "public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Authenticated full access (admin operations)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'settings' AND policyname = 'auth full settings') THEN
    CREATE POLICY "auth full settings" ON settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'auth full services') THEN
    CREATE POLICY "auth full services" ON services FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'stylists' AND policyname = 'auth full stylists') THEN
    CREATE POLICY "auth full stylists" ON stylists FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'gallery' AND policyname = 'auth full gallery') THEN
    CREATE POLICY "auth full gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'auth full reviews') THEN
    CREATE POLICY "auth full reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' AND policyname = 'auth full appointments') THEN
    CREATE POLICY "auth full appointments" ON appointments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'auth full contacts') THEN
    CREATE POLICY "auth full contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'auth read profiles') THEN
    CREATE POLICY "auth read profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'auth manage profiles') THEN
    CREATE POLICY "auth manage profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'admin'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- SEED DATA — SERVICES
-- Run services-seed.sql AFTER this file (69 real Multicut services)
-- ============================================================

-- ============================================================
-- SEED DATA — STYLISTS
-- ============================================================
insert into stylists (name, photo_url, experience, specialization, bio, availability, sort_order)
select * from (values
  ('Zara M.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
   '8 years', 'Balayage & Color',
   'Zara brings artistry and precision to every color service, creating looks that turn heads wherever you go.', 'Tue–Sun', 1),

  ('Damon K.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
   '6 years', 'Precision Cuts',
   'Damon is obsessed with the perfect silhouette. His architectural cuts speak for themselves.', 'Tue–Sun', 2),

  ('Isla R.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
   '10 years', 'Treatments & Texture',
   'Isla transforms damaged hair into healthy, luminous locks with her restorative techniques.', 'Tue–Sat', 3)
) as v(name, photo_url, experience, specialization, bio, availability, sort_order)
where not exists (select 1 from stylists s where s.name = v.name);

-- ============================================================
-- SEED DATA — REVIEWS
-- ============================================================
insert into reviews (name, rating, review, photo_url)
select * from (values
  ('Sarah L.', 5,
   'Best haircut I''ve ever had. Zara understood exactly what I wanted and delivered something even better. I won''t go anywhere else.',
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'),

  ('Marcus T.', 5,
   'Damon is a genius with scissors. My hair has never looked this good. The whole experience felt premium from start to finish.',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'),

  ('Priya K.', 5,
   'The balayage came out absolutely perfect. Natural, dimensional, exactly what I pictured. I get compliments every single day.',
   'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80'),

  ('Rohan S.', 5,
   'Got the keratin treatment done — my hair is incredibly smooth now. Worth every rupee. The staff is very friendly and professional.',
   'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'),

  ('Meera V.', 5,
   'Came in for a hair spa and left feeling completely rejuvenated. The salon is so clean and the ambience is amazing.',
   'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80')
) as v(name, rating, review, photo_url)
where not exists (select 1 from reviews r where r.name = v.name and r.review = v.review);

-- ============================================================
-- SEED DATA — GALLERY (16 images)
-- ============================================================
insert into gallery (image_url, caption, category, sort_order)
select * from (values
  ('https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80', 'Blonde balayage transformation', 'Color', 1),
  ('https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80', 'Precision cut and style', 'Haircut', 2),
  ('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', 'Our premium salon space', 'Interior', 3),
  ('https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80', 'Rich color transformation', 'Color', 4),
  ('https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80', 'Expert styling session', 'Style', 5),
  ('https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', 'Beachy waves finish', 'Style', 6),
  ('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', 'Deep conditioning treatment', 'Treatment', 7),
  ('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', 'Blowout perfection', 'Style', 8),
  ('https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80', 'Hand-painted balayage', 'Color', 9),
  ('https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80', 'Stylist at work', 'Behind the Scenes', 10),
  ('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80', 'Salon styling station', 'Interior', 11),
  ('https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', 'Welcoming reception', 'Interior', 12),
  ('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', 'Relaxing hair spa', 'Treatment', 13),
  ('https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', 'Bridal hair styling', 'Specialty', 14),
  ('https://images.unsplash.com/photo-1626854578939-66f30a27cfca?w=600&q=80', 'Vivid color work', 'Color', 15),
  ('https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', 'Beard grooming', 'Grooming', 16)
) as v(image_url, caption, category, sort_order)
where not exists (select 1 from gallery g where g.image_url = v.image_url and g.sort_order = v.sort_order);

-- ============================================================
-- STORAGE BUCKETS (create these manually in Supabase → Storage)
-- ============================================================
-- gallery-images   (public)
-- stylist-images   (public)
-- service-images   (public)
-- logos            (public)
-- website-assets   (public)
