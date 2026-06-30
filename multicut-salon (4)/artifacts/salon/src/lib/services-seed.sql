-- ============================================================
-- MULTICUT SALON — Real Services Seed Data
-- Run in Supabase SQL Editor AFTER running schema.sql
-- Generated from fallbackData.ts (69 services)
-- ============================================================

DELETE FROM services;

INSERT INTO services (name, slug, category, price, duration, description, image_url, featured, sort_order) VALUES
('Haircut', 'haircut', 'Hair Cuts', 120, 30, 'Precision haircut styled to suit your face shape.', 'https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?w=600&q=80', true, 1),
('Baby Haircut', 'baby-haircut', 'Hair Cuts', 100, 20, 'Gentle, careful haircut for little ones.', 'https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?w=600&q=80', false, 2),
('Old Age Haircut', 'old-age-haircut', 'Hair Cuts', 100, 30, 'Comfortable haircut with extra care and patience.', 'https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?w=600&q=80', false, 3),
('Beard Trim', 'beard-trim', 'Beard & Shave', 80, 20, 'Clean beard shaping and trim to define your look.', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', true, 4),
('Shave', 'shave', 'Beard & Shave', 80, 20, 'Classic straight-razor shave for a smooth finish.', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', false, 5),
('Head Wash', 'head-wash', 'Hair Wash & Head Massage', 20, 15, 'Thorough cleansing wash for a fresh scalp.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 6),
('Head Massage – Olive Oil', 'head-massage-olive-oil', 'Hair Wash & Head Massage', 150, 30, 'Deeply relaxing scalp massage with warm olive oil.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 7),
('Head Massage – Almond Oil', 'head-massage-almond-oil', 'Hair Wash & Head Massage', 100, 30, 'Nourishing almond oil massage to strengthen roots.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 8),
('Head Steam', 'head-steam', 'Hair Wash & Head Massage', 50, 15, 'Steam therapy to open pores and boost scalp health.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 9),
('Hair Spa – Matrix', 'hair-spa-matrix', 'Hair Spa', 250, 45, 'Revitalising Matrix spa treatment for deep nourishment.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', false, 10),
('Hair Spa – Matrix Treatment', 'hair-spa-matrix-treatment', 'Hair Spa', 300, 60, 'Advanced Matrix treatment spa for damaged and dry hair.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', false, 11),
('Hair Spa – L''Oréal', 'hair-spa-loreal', 'Hair Spa', 300, 45, 'Luxurious L''Oréal spa for shine and manageability.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', true, 12),
('Hair Spa – L''Oréal Treatment', 'hair-spa-loreal-treatment', 'Hair Spa', 350, 60, 'Premium L''Oréal treatment spa for intense restoration.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', false, 13),
('Hair Spa – Schwarzkopf', 'hair-spa-schwarzkopf', 'Hair Spa', 350, 45, 'Professional Schwarzkopf spa for healthy, vibrant hair.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', false, 14),
('Hair Spa – Schwarzkopf Treatment', 'hair-spa-schwarzkopf-treatment', 'Hair Spa', 400, 60, 'Elite Schwarzkopf treatment spa for ultimate hair revival.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', false, 15),
('Hair Colour – Matrix', 'hair-colour-matrix', 'Hair Colour', 250, 60, 'Vibrant Matrix colour for a bold, lasting transformation.', 'https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80', true, 16),
('Hair Colour – L''Oréal', 'hair-colour-loreal', 'Hair Colour', 300, 60, 'Rich L''Oréal colour with fade-resistant shine.', 'https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80', false, 17),
('Hair Colour – Schwarzkopf', 'hair-colour-schwarzkopf', 'Hair Colour', 350, 60, 'Professional Schwarzkopf colour for intense depth.', 'https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80', false, 18),
('Hair Colour – L''Oréal Inoa', 'hair-colour-loreal-inoa', 'Hair Colour', 350, 75, 'Ammonia-free Inoa colour — gentle, vivid and long-lasting.', 'https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80', false, 19),
('Hair Colour – Matrix No Ammonia', 'hair-colour-matrix-no-ammonia', 'Hair Colour', 300, 60, 'Gentle ammonia-free Matrix formula for sensitive scalps.', 'https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80', false, 20),
('Hair Colour – Schwarzkopf Essensity', 'hair-colour-schwarzkopf-essensity', 'Hair Colour', 400, 75, 'Oil-based Essensity colour — pure, natural and nourishing.', 'https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80', false, 21),
('Beard Colour – Bigen', 'beard-colour-bigen', 'Beard Colour', 200, 30, 'Premium Bigen beard colour for a natural, even finish.', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', false, 22),
('Beard Colour', 'beard-colour', 'Beard Colour', 100, 20, 'Standard beard colouring to cover greys effortlessly.', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', false, 23),
('Hair Smoothing / Rebonding – Short to Medium', 'smoothing-short', 'Hair Treatment', 800, 120, 'Smoothing/rebonding for short to medium length hair.', 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&q=80', true, 24),
('Hair Smoothing / Rebonding – Medium to Neck', 'smoothing-medium', 'Hair Treatment', 1100, 150, 'Smoothing/rebonding for medium to neck length hair.', 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&q=80', false, 25),
('Hair Keratin – Short to Medium', 'keratin-short', 'Hair Treatment', 1000, 120, 'Keratin treatment for silky smooth short to medium hair.', 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&q=80', true, 26),
('Hair Keratin – Medium to Neck', 'keratin-medium', 'Hair Treatment', 1500, 150, 'Keratin treatment for medium to neck length hair.', 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&q=80', false, 27),
('Hair Botox – Short to Medium', 'botox-short', 'Hair Treatment', 1000, 120, 'Botox treatment for frizz-free, rejuvenated short hair.', 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&q=80', false, 28),
('Hair Botox – Medium to Neck', 'botox-medium', 'Hair Treatment', 1500, 150, 'Botox treatment for medium to neck length hair.', 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&q=80', false, 29),
('Hair Curling – Short Hair', 'curling-short', 'Hair Curling & Perm', 1000, 90, 'Beautiful curls for short hair.', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80', false, 30),
('Hair Perm Tight – Medium Length', 'perm-tight-medium', 'Hair Curling & Perm', 1300, 120, 'Tight perm curls for medium length hair.', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80', false, 31),
('Hair Perm Loose – Medium Length', 'perm-loose-medium', 'Hair Curling & Perm', 1500, 120, 'Loose, natural perm waves for medium length hair.', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80', false, 32),
('Hair Perm Loose – Neck Length', 'perm-loose-neck', 'Hair Curling & Perm', 2000, 150, 'Flowing loose perm waves for neck length hair.', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80', false, 33),
('Hair Styling', 'hair-styling', 'Styling', 100, 20, 'Expert styling for any occasion — sleek, textured or voluminous.', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80', false, 34),
('Facial – Oxy', 'facial-oxy', 'Facial & Clean-Up', 700, 60, 'Oxygen-infused facial for a bright, refreshed complexion.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 35),
('Facial – Lotus', 'facial-lotus', 'Facial & Clean-Up', 900, 60, 'Lotus facial for deeply hydrated, glowing skin.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', true, 36),
('Facial – O3+', 'facial-o3plus', 'Facial & Clean-Up', 1500, 75, 'Advanced O3+ facial targeting anti-aging and deep cleansing.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 37),
('Facial – Kanpeki', 'facial-kanpeki', 'Facial & Clean-Up', 2000, 90, 'Premium Kanpeki facial for flawless, radiant skin.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 38),
('Clean-Up – Lotus', 'cleanup-lotus', 'Facial & Clean-Up', 500, 30, 'Lotus clean-up for fresh, clear and even skin.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 39),
('Clean-Up – O3+', 'cleanup-o3plus', 'Facial & Clean-Up', 700, 30, 'O3+ clean-up for deep pore cleansing and skin clarity.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 40),
('Clean-Up – Oxy', 'cleanup-oxy', 'Facial & Clean-Up', 400, 30, 'Oxy clean-up for a quick, energising skin refresh.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 41),
('Clean-Up – Kanpeki', 'cleanup-kanpeki', 'Facial & Clean-Up', 900, 45, 'Kanpeki clean-up for premium skin care and deep cleansing.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', false, 42),
('Face Bleach', 'face-bleach', 'Face Care', 250, 20, 'Skin-brightening face bleach for a radiant look.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 43),
('Face D-Tan – O3+', 'face-dtan-o3plus', 'Face Care', 200, 20, 'O3+ D-Tan pack to reverse sun damage and brighten skin.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 44),
('Face D-Tan – Sara', 'face-dtan-sara', 'Face Care', 150, 20, 'Sara D-Tan for an even, refreshed complexion.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 45),
('Back Neck D-Tan', 'back-neck-dtan', 'Face Care', 100, 15, 'Targeted D-Tan treatment for the back of the neck.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 46),
('Face Scrub – O3+', 'face-scrub-o3plus', 'Face Care', 250, 20, 'O3+ exfoliating scrub for smoother, cleaner skin.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 47),
('Face Scrub – Lotus', 'face-scrub-lotus', 'Face Care', 200, 20, 'Gentle Lotus scrub to remove dead skin and impurities.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 48),
('Face Scrub – Oxy', 'face-scrub-oxy', 'Face Care', 150, 15, 'Oxygen-boosting scrub for vibrant, refreshed skin.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 49),
('Face Scrub – Kanpeki', 'face-scrub-kanpeki', 'Face Care', 250, 20, 'Kanpeki scrub for deep exfoliation and pore refinement.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 50),
('Face Cleansing – Lotus', 'face-cleansing-lotus', 'Face Care', 200, 20, 'Lotus cleansing ritual for soft, hydrated skin.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 51),
('Face Cleansing – O3+', 'face-cleansing-o3plus', 'Face Care', 250, 20, 'Deep O3+ cleansing for pore clarity and radiance.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 52),
('Face Cleansing – Kanpeki', 'face-cleansing-kanpeki', 'Face Care', 250, 20, 'Kanpeki cleansing for a flawless, balanced complexion.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 53),
('Face Cleansing – Oxy', 'face-cleansing-oxy', 'Face Care', 150, 15, 'Quick Oxy cleansing to remove impurities and refresh skin.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 54),
('Face Steam', 'face-steam', 'Face Care', 50, 10, 'Soothing face steam to open pores and prep skin.', 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', false, 55),
('Full Face Threading', 'full-face-threading', 'Threading & Waxing', 100, 20, 'Complete face threading for clean, defined eyebrows and smooth skin.', 'https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', false, 56),
('Cheeks Threading', 'cheeks-threading', 'Threading & Waxing', 50, 10, 'Targeted cheek threading to remove fine facial hair.', 'https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', false, 57),
('Face Wax', 'face-wax', 'Threading & Waxing', 200, 20, 'Smooth face waxing for long-lasting hair removal.', 'https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', false, 58),
('Nose Wax', 'nose-wax', 'Threading & Waxing', 50, 10, 'Quick and effective nose wax for clear nostrils.', 'https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', false, 59),
('Cheeks Wax', 'cheeks-wax', 'Threading & Waxing', 100, 15, 'Gentle cheek waxing for smooth, hair-free skin.', 'https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', false, 60),
('Arm Wax', 'arm-wax', 'Threading & Waxing', 500, 30, 'Full arm waxing for silky smooth skin.', 'https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', false, 61),
('Body Wax', 'body-wax', 'Threading & Waxing', 1200, 60, 'Full body waxing for complete, lasting smoothness.', 'https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80', false, 62),
('Arm D-Tan', 'arm-dtan', 'Arm & Body Care', 400, 20, 'D-Tan treatment for even, sun-damage-free arm skin.', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', false, 63),
('Arm Bleach', 'arm-bleach', 'Arm & Body Care', 400, 20, 'Brightening arm bleach for lighter, glowing skin.', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', false, 64),
('Full Body Hair Trim', 'full-body-hair-trim', 'Arm & Body Care', 400, 40, 'Complete body hair trimming for a clean, groomed look.', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', false, 65),
('Half Body Hair Trim', 'half-body-hair-trim', 'Arm & Body Care', 300, 25, 'Half body hair trim for targeted grooming.', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', false, 66),
('Arm Hair Trim', 'arm-hair-trim', 'Arm & Body Care', 100, 15, 'Quick arm hair trimming for a neat appearance.', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', false, 67),
('Manicure', 'manicure', 'Manicure & Pedicure', 400, 40, 'Complete manicure — soak, shape, cuticle care and moisturize.', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', false, 68),
('Pedicure', 'pedicure', 'Manicure & Pedicure', 400, 50, 'Relaxing pedicure for soft, refreshed and pampered feet.', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', false, 69)

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
