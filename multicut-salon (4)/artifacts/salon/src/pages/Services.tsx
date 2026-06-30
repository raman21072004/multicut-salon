import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Service } from "@/lib/types";
import { fallbackServices } from "@/lib/fallbackData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { handleImageError } from "@/lib/imageFallback";

// Category metadata: icon + Supabase storage image key
const CATEGORY_META: Record<string, { icon: string; imageKey: string }> = {
  "Hair Cuts":              { icon: "✂️",  imageKey: "haircuts.jpg" },
  "Beard & Shave":          { icon: "🪒",  imageKey: "beard.jpg" },
  "Hair Wash & Head Massage":{ icon: "🚿", imageKey: "head-wash.jpg" },
  "Hair Spa":               { icon: "💆",  imageKey: "hair-spa.jpg" },
  "Hair Colour":            { icon: "🎨",  imageKey: "hair-colour.jpg" },
  "Beard Colour":           { icon: "🖌️",  imageKey: "beard-colour.jpg" },
  "Hair Treatment":         { icon: "⚗️",  imageKey: "hair-treatment.jpg" },
  "Hair Curling & Perm":    { icon: "🌀",  imageKey: "hair-curling.jpg" },
  "Styling":                { icon: "💈",  imageKey: "styling.jpg" },
  "Facial & Clean-Up":      { icon: "🧖",  imageKey: "facial.jpg" },
  "Face Care":              { icon: "🫧",  imageKey: "face-care.jpg" },
  "Threading & Waxing":     { icon: "🧵",  imageKey: "threading-waxing.jpg" },
  "Arm & Body Care":        { icon: "💪",  imageKey: "body-care.jpg" },
  "Manicure & Pedicure":    { icon: "💅",  imageKey: "manicure-pedicure.jpg" },
};

// Preferred category order
const CATEGORY_ORDER = Object.keys(CATEGORY_META);

export default function Services() {
  const [services, setServices]         = useState<Service[]>(fallbackServices);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [viewMode, setViewMode]         = useState<"grouped" | "grid">("grouped");

  // Fetch services from Supabase
  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setServices(data);
      setLoading(false);
    });
  }, []);

  // Fetch category images from Supabase storage bucket "service-images"
  useEffect(() => {
    const imgs: Record<string, string> = {};
    Object.entries(CATEGORY_META).forEach(([cat, meta]) => {
      const { data } = supabase.storage.from("service-images").getPublicUrl(meta.imageKey);
      if (data?.publicUrl) imgs[cat] = data.publicUrl;
    });
    setCategoryImages(imgs);
  }, []);

  // Group services by category in defined order
  const grouped = CATEGORY_ORDER.reduce<Record<string, Service[]>>((acc, cat) => {
    const items = services.filter(s => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // Also include any categories not in CATEGORY_ORDER
  services.forEach(s => {
    if (s.category && !grouped[s.category]) {
      grouped[s.category] = services.filter(sv => sv.category === s.category);
    }
  });

  const categories = Object.keys(grouped);
  const totalServices = services.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">What We Offer</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-6">
            {totalServices} services across {categories.length} categories — crafted for every need.
          </p>
          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grouped")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${viewMode === "grouped" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
            >
              By Category
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
            >
              All Services
            </button>
          </div>
        </div>
      </section>

      {/* ── GROUPED VIEW ──────────────────────────────────────────────────── */}
      {viewMode === "grouped" && (
        <section className="pb-24 px-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 bg-card rounded-2xl animate-pulse border border-border" />
                ))
              : categories.map(cat => {
                  const meta = CATEGORY_META[cat] ?? { icon: "💈", imageKey: "" };
                  const imgUrl = categoryImages[cat];
                  const isOpen = activeCategory === cat;
                  const items = grouped[cat] ?? [];

                  return (
                    <div key={cat} className="border border-border rounded-2xl overflow-hidden bg-card transition-all">
                      {/* Category image banner — only shown when open and image exists */}
                      {isOpen && imgUrl && (
                        <div className="w-full h-44 overflow-hidden">
                          <img
                            src={imgUrl}
                            alt={cat}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                      )}

                      {/* Accordion header */}
                      <button
                        onClick={() => setActiveCategory(isOpen ? null : cat)}
                        className="w-full flex items-center gap-3 px-6 py-5 text-left hover:bg-secondary/30 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="text-2xl">{meta.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base">{cat}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{items.length} service{items.length !== 1 ? "s" : ""}</div>
                        </div>
                        <div className="text-xs text-primary font-semibold">
                          {isOpen ? "Hide ▲" : "View ▼"}
                        </div>
                      </button>

                      {/* Expanded service rows */}
                      {isOpen && (
                        <div className="border-t border-border divide-y divide-border">
                          {items.map(svc => (
                            <Link key={svc.id} href={`/services/${svc.slug || svc.id}`}>
                              <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-secondary/20 transition-colors cursor-pointer group">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                                    {svc.name}
                                  </div>
                                  {svc.description && (
                                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{svc.description}</div>
                                  )}
                                </div>
                                <div className="shrink-0 text-right">
                                  <div className="text-base font-bold text-primary">₹{svc.price}</div>
                                  {svc.duration > 0 && (
                                    <div className="text-xs text-muted-foreground">{svc.duration} min</div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>
        </section>
      )}

      {/* ── GRID VIEW ─────────────────────────────────────────────────────── */}
      {viewMode === "grid" && (
        <>
          {/* Category filter pills */}
          <section className="px-6 pb-8">
            <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${!activeCategory ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                >
                  {CATEGORY_META[cat]?.icon} {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="pb-24 px-6">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-72 bg-card rounded-2xl animate-pulse border border-border" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeCategory ? grouped[activeCategory] ?? [] : services).map(s => (
                    <Link key={s.id} href={`/services/${s.slug || s.id}`}>
                      <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                        <div className="aspect-video overflow-hidden bg-secondary">
                          <img
                            src={s.image_url || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"}
                            alt={s.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-xs text-primary font-semibold tracking-wider uppercase">{s.category}</span>
                              <h3 className="text-lg font-semibold mt-1">{s.name}</h3>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <div className="text-xl font-bold text-primary">₹{s.price}</div>
                              {s.duration > 0 && <div className="text-xs text-muted-foreground">{s.duration} min</div>}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{s.description}</p>
                          <div className="mt-4 text-sm text-primary font-medium">View Details →</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-muted-foreground mb-6">Reserve your spot with one of our expert stylists today.</p>
          <Button asChild size="lg" className="px-10">
            <Link href="/book-appointment">Book an Appointment</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
