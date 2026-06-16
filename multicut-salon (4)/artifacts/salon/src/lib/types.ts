export interface SalonSettings {
  salon_name: string;
  logo_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  business_hours: Record<string, string> | string;
  instagram: string;
  facebook: string;
  google_maps: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  about_title: string;
  about_description: string;
  about_image_url: string;
  about_stat_1_value: string;
  about_stat_1_label: string;
  about_stat_2_value: string;
  about_stat_2_label: string;
  about_stat_3_value: string;
  about_stat_3_label: string;
}

export const defaultSettings: SalonSettings = {
  salon_name: "Multicut Salon",
  logo_url: "",
  phone: "088376 35640",
  whatsapp: "+918837635640",
  email: "hello@multicut.com",
  address: "Ground floor and 1st floor, Mithapur Road, Near Wadala Chowk, Mann Nagar, Khurla Kingra, Jalandhar, Punjab 144001",
  business_hours: { "Tuesday": "Closed", "Wednesday – Monday": "9am – 8pm" },
  instagram: "",
  facebook: "",
  google_maps: "https://maps.app.goo.gl/1FfJYbgdp21rLpyA6",
  hero_title: "Where Style Meets Artistry",
  hero_subtitle: "Premium hair services for the discerning. Every cut, color, and treatment crafted with intention.",
  hero_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80",
  about_title: "Crafted with Precision & Care",
  about_description: "At Multicut Salon, we believe that great hair is the foundation of confidence. Our team of skilled artisans combines technical mastery with creative vision to deliver results that exceed expectations.",
  about_image_url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
  about_stat_1_value: "10+",
  about_stat_1_label: "Years Experience",
  about_stat_2_value: "500+",
  about_stat_2_label: "Happy Clients",
  about_stat_3_value: "98%",
  about_stat_3_label: "Satisfaction",
};

export interface Service {
  id: string; name: string; slug: string; category: string; price: number;
  duration: number; description: string; image_url: string; featured: boolean; sort_order: number;
}

export interface Stylist {
  id: string; name: string; photo_url: string; experience: string;
  specialization: string; bio: string; availability: string; instagram: string; facebook: string;
}

export interface GalleryItem {
  id: string; image_url: string; caption: string; category: string; sort_order: number;
}

export interface Review {
  id: string; name: string; rating: number; review: string; photo_url: string; created_at: string;
}

export interface Appointment {
  id: string; name: string; phone: string; email: string;
  service_id: string; stylist_id: string; date: string; time: string;
  notes: string; status: string; created_at: string;
  services?: { name: string }; stylists?: { name: string };
}
