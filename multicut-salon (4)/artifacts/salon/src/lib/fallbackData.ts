import { Service, Stylist, GalleryItem, Review } from "./types";

export const fallbackServices: Service[] = [
  { id: "1", name: "Haircut & Style", slug: "haircut-style", category: "Hair", price: 45, duration: 60, description: "Precision cut with blowout finish tailored to your face shape and lifestyle.", image_url: "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?w=600&q=80", featured: true, sort_order: 1 },
  { id: "2", name: "Color & Highlights", slug: "color-highlights", category: "Color", price: 120, duration: 150, description: "Full color or highlights with professional toner for vibrant, lasting results.", image_url: "https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80", featured: true, sort_order: 2 },
  { id: "3", name: "Balayage", slug: "balayage", category: "Color", price: 180, duration: 180, description: "Hand-painted natural highlights for a sun-kissed dimensional look.", image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80", featured: true, sort_order: 3 },
  { id: "4", name: "Beard Trim & Shape", slug: "beard-trim", category: "Grooming", price: 25, duration: 30, description: "Expert shaping and defining of your beard to complement your facial features.", image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80", featured: false, sort_order: 4 },
  { id: "5", name: "Deep Conditioning", slug: "deep-conditioning", category: "Treatment", price: 55, duration: 45, description: "Intensive moisture treatment to restore health, shine and luminosity to dry hair.", image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", featured: false, sort_order: 5 },
  { id: "6", name: "Keratin Treatment", slug: "keratin-treatment", category: "Treatment", price: 200, duration: 120, description: "Smoothing and frizz-control treatment for silky, manageable hair that lasts months.", image_url: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&q=80", featured: true, sort_order: 6 },
  { id: "7", name: "Hair Spa", slug: "hair-spa", category: "Treatment", price: 70, duration: 60, description: "Relaxing scalp massage with nourishing oil treatment and steam therapy.", image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", featured: false, sort_order: 7 },
  { id: "8", name: "Bridal Hair", slug: "bridal-hair", category: "Specialty", price: 350, duration: 180, description: "Complete bridal hair styling with trial session — from intricate updos to flowing waves.", image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", featured: true, sort_order: 8 },
  { id: "9", name: "Hair Rebonding", slug: "hair-rebonding", category: "Treatment", price: 150, duration: 180, description: "Permanent straightening technique for naturally straight, frizz-free hair.", image_url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80", featured: false, sort_order: 9 },
  { id: "10", name: "Blow Dry & Style", slug: "blow-dry", category: "Hair", price: 30, duration: 45, description: "Professional blowout for a smooth, voluminous finish that lasts all day.", image_url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80", featured: false, sort_order: 10 },
];

export const fallbackStylists: Stylist[] = [
  { id: "1", name: "Zara M.", photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80", experience: "8 years", specialization: "Balayage & Color", bio: "Zara brings artistry and precision to every color service, creating looks that turn heads wherever you go.", availability: "Tue–Sun", instagram: "", facebook: "" },
  { id: "2", name: "Damon K.", photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", experience: "6 years", specialization: "Precision Cuts", bio: "Damon is obsessed with the perfect silhouette. His architectural cuts speak for themselves.", availability: "Tue–Sun", instagram: "", facebook: "" },
  { id: "3", name: "Isla R.", photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", experience: "10 years", specialization: "Treatments & Texture", bio: "Isla transforms damaged hair into healthy, luminous locks with her restorative techniques.", availability: "Tue–Sat", instagram: "", facebook: "" },
];

export const fallbackGallery: GalleryItem[] = [
  { id: "1", image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80", caption: "Blonde balayage transformation", category: "Color", sort_order: 1 },
  { id: "2", image_url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80", caption: "Precision cut and style", category: "Haircut", sort_order: 2 },
  { id: "3", image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", caption: "Our premium salon space", category: "Interior", sort_order: 3 },
  { id: "4", image_url: "https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80", caption: "Rich color transformation", category: "Color", sort_order: 4 },
  { id: "5", image_url: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80", caption: "Expert styling session", category: "Style", sort_order: 5 },
  { id: "6", image_url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80", caption: "Beachy waves finish", category: "Style", sort_order: 6 },
  { id: "7", image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", caption: "Deep conditioning treatment", category: "Treatment", sort_order: 7 },
  { id: "8", image_url: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80", caption: "Blowout perfection", category: "Style", sort_order: 8 },
  { id: "9", image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80", caption: "Hand-painted balayage", category: "Color", sort_order: 9 },
  { id: "10", image_url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80", caption: "Stylist at work", category: "Behind the Scenes", sort_order: 10 },
  { id: "11", image_url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80", caption: "Salon styling station", category: "Interior", sort_order: 11 },
  { id: "12", image_url: "https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80", caption: "Welcoming reception", category: "Interior", sort_order: 12 },
  { id: "13", image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", caption: "Relaxing hair spa", category: "Treatment", sort_order: 13 },
  { id: "14", image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", caption: "Bridal hair styling", category: "Specialty", sort_order: 14 },
  { id: "15", image_url: "https://images.unsplash.com/photo-1626854578939-66f30a27cfca?w=600&q=80", caption: "Vivid color work", category: "Color", sort_order: 15 },
  { id: "16", image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80", caption: "Beard grooming & shaping", category: "Grooming", sort_order: 16 },
];

export const fallbackReviews: Review[] = [
  { id: "1", name: "Sarah L.", rating: 5, review: "Best haircut I've ever had. Zara understood exactly what I wanted and delivered something even better. I won't go anywhere else.", photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", created_at: new Date().toISOString() },
  { id: "2", name: "Marcus T.", rating: 5, review: "Damon is a genius with scissors. My hair has never looked this good. The whole experience felt premium from start to finish.", photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", created_at: new Date().toISOString() },
  { id: "3", name: "Priya K.", rating: 5, review: "The balayage came out absolutely perfect. Natural, dimensional, exactly what I pictured. I get compliments every single day.", photo_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80", created_at: new Date().toISOString() },
  { id: "4", name: "Rohan S.", rating: 5, review: "Got the keratin treatment done — my hair is incredibly smooth now. Worth every rupee. The staff is very friendly and professional.", photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", created_at: new Date().toISOString() },
  { id: "5", name: "Meera V.", rating: 5, review: "Came in for a hair spa and left feeling completely rejuvenated. The salon is so clean and the ambience is amazing.", photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80", created_at: new Date().toISOString() },
];
