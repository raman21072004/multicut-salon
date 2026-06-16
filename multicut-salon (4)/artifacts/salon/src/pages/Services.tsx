import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Service } from "@/lib/types";
import { fallbackServices } from "@/lib/fallbackData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { handleImageError } from "@/lib/imageFallback";

const ALL = "All";

export default function Services() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(ALL);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setServices(data);
      setLoading(false);
    });
  }, []);

  const categories = [ALL, ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];
  const filtered = category === ALL ? services : services.filter(s => s.category === category);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">What We Offer</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-muted-foreground text-lg max-w-xl">From everyday styles to transformative treatments, every service is crafted with precision.</p>
        </div>
      </section>

      {/* Category filter */}
      <section className="px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${category === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-card rounded-2xl animate-pulse border border-border" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => (
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
                          <div className="text-xs text-muted-foreground">{s.duration} min</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{s.description}</p>
                      <div className="mt-4 text-sm text-primary font-medium flex items-center gap-1 transition-all">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
