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
create policy if not exists "public read settings" on settings for select using (true);
create policy if not exists "public read services" on services for select using (true);
create policy if not exists "public read stylists" on stylists for select using (true);
create policy if not exists "public read gallery" on gallery for select using (true);
create policy if not exists "public read reviews" on reviews for select using (true);

-- Public inserts (booking form, contact form)
create policy if not exists "public insert appointments" on appointments for insert with check (true);
create policy if not exists "public insert contacts" on contacts for insert with check (true);

-- Authenticated full access (admin operations)
create policy if not exists "auth full settings" on settings for all using (auth.role() = 'authenticated');
create policy if not exists "auth full services" on services for all using (auth.role() = 'authenticated');
create policy if not exists "auth full stylists" on stylists for all using (auth.role() = 'authenticated');
create policy if not exists "auth full gallery" on gallery for all using (auth.role() = 'authenticated');
create policy if not exists "auth full reviews" on reviews for all using (auth.role() = 'authenticated');
create policy if not exists "auth full appointments" on appointments for all using (auth.role() = 'authenticated');
create policy if not exists "auth full contacts" on contacts for all using (auth.role() = 'authenticated');
create policy if not exists "auth read profiles" on profiles for select using (auth.role() = 'authenticated');
create policy if not exists "auth manage profiles" on profiles for all using (auth.role() = 'authenticated');

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
-- ============================================================
insert into services (name, slug, category, price, duration, description, image_url, featured, sort_order) values
  ('Haircut & Style', 'haircut-style', 'Hair', 45, 60,
   'Precision cut with blowout finish tailored to your face shape and lifestyle.',
   'https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?w=600&q=80', true, 1),

  ('Color & Highlights', 'color-highlights', 'Color', 120, 150,
   'Full color or highlights with professional toner for vibrant, lasting results.',
   'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=600&q=80', true, 2),

  ('Balayage', 'balayage', 'Color', 180, 180,
   'Hand-painted natural highlights for a sun-kissed dimensional look.',
   'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80', true, 3),

  ('Beard Trim & Shape', 'beard-trim', 'Grooming', 25, 30,
   'Expert shaping and defining of your beard to complement your facial features.',
   'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', false, 4),

  ('Deep Conditioning', 'deep-conditioning', 'Treatment', 55, 45,
   'Intensive moisture treatment to restore health, shine and luminosity to dry hair.',
   'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', false, 5),

  ('Keratin Treatment', 'keratin-treatment', 'Treatment', 200, 120,
   'Smoothing and frizz-control treatment for silky, manageable hair that lasts months.',
   'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&q=80', true, 6),

  ('Hair Spa', 'hair-spa', 'Treatment', 70, 60,
   'Relaxing scalp massage with nourishing oil treatment and steam therapy.',
   'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 7),

  ('Bridal Hair', 'bridal-hair', 'Specialty', 350, 180,
   'Complete bridal hair styling with trial session — from intricate updos to flowing waves.',
   'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', true, 8),

  ('Hair Rebonding', 'hair-rebonding', 'Treatment', 150, 180,
   'Permanent straightening technique for naturally straight, frizz-free hair.',
   'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80', false, 9),

  ('Blow Dry & Style', 'blow-dry', 'Hair', 30, 45,
   'Professional blowout for a smooth, voluminous finish that lasts all day.',
   'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80', false, 10)

on conflict (slug) do nothing;

-- ============================================================
-- SEED DATA — STYLISTS
-- ============================================================
insert into stylists (name, photo_url, experience, specialization, bio, availability, sort_order) values
  ('Zara M.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
   '8 years', 'Balayage & Color',
   'Zara brings artistry and precision to every color service, creating looks that turn heads wherever you go.', 'Tue–Sun', 1),

  ('Damon K.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
   '6 years', 'Precision Cuts',
   'Damon is obsessed with the perfect silhouette. His architectural cuts speak for themselves.', 'Tue–Sun', 2),

  ('Isla R.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
   '10 years', 'Treatments & Texture',
   'Isla transforms damaged hair into healthy, luminous locks with her restorative techniques.', 'Tue–Sat', 3)

on conflict do nothing;

-- ============================================================
-- SEED DATA — REVIEWS
-- ============================================================
insert into reviews (name, rating, review, photo_url) values
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

on conflict do nothing;

-- ============================================================
-- SEED DATA — GALLERY (16 images)
-- ============================================================
insert into gallery (image_url, caption, category, sort_order) values
  ('https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80', 'Blonde balayage transformation', 'Color', 1),
  ('https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80', 'Precision cut and style', 'Haircut', 2),
  ('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', 'Our premium salon space', 'Interior', 3),
  ('https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80', 'Rich color transformation', 'Color', 4),
  ('https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80', 'Expert styling session', 'Style', 5),
  ('https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', 'Beachy waves finish', 'Style', 6),
  ('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', 'Deep conditioning treatment', 'Treatment', 7),
  ('https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', 'Blowout perfection', 'Style', 8),
  ('https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80', 'Hand-painted balayage', 'Color', 9),
  ('https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80', 'Stylist at work', 'Behind the Scenes', 10),
  ('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80', 'Salon styling station', 'Interior', 11),
  ('https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', 'Welcoming reception', 'Interior', 12),
  ('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', 'Relaxing hair spa', 'Treatment', 13),
  ('https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', 'Bridal hair styling', 'Specialty', 14),
  ('https://images.unsplash.com/photo-1626854578939-66f30a27cfca?w=600&q=80', 'Vivid color work', 'Color', 15),
  ('https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', 'Beard grooming', 'Grooming', 16)

on conflict do nothing;

-- ============================================================
-- STORAGE BUCKETS (create these manually in Supabase → Storage)
-- ============================================================
-- gallery-images   (public)
-- stylist-images   (public)
-- service-images   (public)
-- logos            (public)
-- website-assets   (public)
