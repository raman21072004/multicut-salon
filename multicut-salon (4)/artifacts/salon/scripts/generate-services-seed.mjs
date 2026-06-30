import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.resolve(__dirname, "../src/lib/fallbackData.ts"), "utf8");

function esc(s) {
  return s.replace(/'/g, "''");
}

const rowRe =
  /\{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*price:\s*(\d+),\s*duration:\s*(\d+),\s*description:\s*"([^"]+)",\s*image_url:\s*"([^"]+)",\s*featured:\s*(true|false),\s*sort_order:\s*(\d+)\s*\}/g;

const rows = [];
let m;
while ((m = rowRe.exec(src)) !== null) {
  const [, name, slug, category, price, duration, description, image_url, featured, sort_order] = m;
  rows.push(
    `('${esc(name)}', '${slug}', '${esc(category)}', ${price}, ${duration}, '${esc(description)}', '${image_url}', ${featured}, ${sort_order})`,
  );
}

if (rows.length === 0) {
  console.error("No services parsed from fallbackData.ts");
  process.exit(1);
}

const sql = `-- ============================================================
-- MULTICUT SALON — Real Services Seed Data
-- Run in Supabase SQL Editor AFTER running schema.sql
-- Generated from fallbackData.ts (${rows.length} services)
-- ============================================================

DELETE FROM services;

INSERT INTO services (name, slug, category, price, duration, description, image_url, featured, sort_order) VALUES
${rows.join(",\n")}

ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  category    = EXCLUDED.category,
  price       = EXCLUDED.price,
  duration    = EXCLUDED.duration,
  description = EXCLUDED.description,
  image_url   = EXCLUDED.image_url,
  featured    = EXCLUDED.featured,
  sort_order  = EXCLUDED.sort_order;

-- ============================================================
-- Supabase Storage: Create "service-images" bucket (run once)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true) ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read service-images') THEN
    CREATE POLICY "Public read service-images" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth upload service-images') THEN
    CREATE POLICY "Auth upload service-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'service-images' AND auth.role() = 'authenticated');
    CREATE POLICY "Auth update service-images" ON storage.objects FOR UPDATE USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');
    CREATE POLICY "Auth delete service-images" ON storage.objects FOR DELETE USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Upload category images to Storage → service-images:
-- haircuts.jpg, beard.jpg, head-wash.jpg, hair-spa.jpg, hair-colour.jpg,
-- beard-colour.jpg, hair-treatment.jpg, hair-curling.jpg, styling.jpg,
-- facial.jpg, face-care.jpg, threading-waxing.jpg, body-care.jpg, manicure-pedicure.jpg
`;

const out = path.resolve(__dirname, "../src/lib/services-seed.sql");
fs.writeFileSync(out, sql);
console.log(`Wrote ${rows.length} services to ${out}`);
