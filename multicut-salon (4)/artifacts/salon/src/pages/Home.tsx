import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { useSalonSettings } from "@/lib/hooks";
import { Service, Stylist, Review, GalleryItem } from "@/lib/types";
import { fallbackServices, fallbackStylists, fallbackReviews, fallbackGallery } from "@/lib/fallbackData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ArrowRight, Scissors } from "lucide-react";
import { handleImageError } from "@/lib/imageFallback";

export default function Home() {
  const { settings } = useSalonSettings();
  const [services, setServices] = useState<Service[]>(fallbackServices.filter(s => s.featured).slice(0, 3));
  const [stylists, setStylists] = useState<Stylist[]>(fallbackStylists);
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews.slice(0, 3));
  const [gallery, setGallery] = useState<GalleryItem[]>(fallbackGallery.slice(0, 6));

  useEffect(() => {
    Promise.all([
      supabase.from("services").select("*").eq("featured", true).order("sort_order").limit(3),
      supabase.from("stylists").select("*").order("sort_order").limit(3),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(3),
      supabase.from("gallery").select("id,image_url,caption,category,sort_order").order("sort_order").limit(6),
    ]).then(([svc, sty, rev, gal]) => {
      if (svc.data?.length) setServices(svc.data);
      if (sty.data?.length) setStylists(sty.data);
      if (rev.data?.length) setReviews(rev.data);
      if (gal.data?.length) setGallery(gal.data);
    });
  }, []);

  const scrollDown = () => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });

  const hours = typeof settings.business_hours === "object" && settings.business_hours !== null
    ? settings.business_hours as Record<string, string>
    : {};

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={settings.hero_image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80"}
            alt="Salon"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-background/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/70" />
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Premium Hair Studio
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
            {settings.hero_title.split(" ").slice(0, 2).join(" ")}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-accent">
              {settings.hero_title.split(" ").slice(2).join(" ")}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            {settings.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 text-base shadow-lg shadow-primary/20">
              <Link href="/book-appointment">Book an Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 text-base border-border hover:border-primary/50">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
        <button onClick={scrollDown} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* Featured Services */}
      <section id="featured" className="py-24 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">What We Offer</div>
              <h2 className="font-serif text-4xl font-bold">Featured Services</h2>
            </div>
            <Link href="/services" className="hidden md:flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(s => (
              <Link key={s.id} href={`/services/${s.slug || s.id}`}>
                <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="aspect-video overflow-hidden bg-secondary">
                    <img
                      src={s.image_url || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs text-primary font-semibold tracking-wider uppercase">{s.category}</span>
                        <h3 className="text-base font-semibold mt-1">{s.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{s.duration} min</p>
                      </div>
                      <div className="text-xl font-bold text-primary">₹{s.price}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img src={settings.about_image_url} alt="About" className="w-full h-full object-cover" onError={handleImageError} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-card border border-border rounded-2xl px-6 py-4 shadow-xl">
              <div className="text-2xl font-bold text-primary font-serif">{settings.about_stat_1_value}</div>
              <div className="text-xs text-muted-foreground">{settings.about_stat_1_label}</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-4">Our Story</div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">{settings.about_title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{settings.about_description}</p>
            <div className="grid grid-cols-3 gap-6 mb-8 pt-6 border-t border-border">
              {[
                [settings.about_stat_1_value, settings.about_stat_1_label],
                [settings.about_stat_2_value, settings.about_stat_2_label],
                [settings.about_stat_3_value, settings.about_stat_3_label],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-primary font-serif">{v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/about">Learn More <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stylists preview */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">Meet The Team</div>
              <h2 className="font-serif text-4xl font-bold">Our Stylists</h2>
            </div>
            <Link href="/stylists" className="hidden md:flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {stylists.map(s => (
              <Link key={s.id} href={`/stylists/${s.id}`}>
                <div className="text-center group cursor-pointer">
                  <div className="mx-auto w-36 h-36 rounded-full overflow-hidden border-2 border-border group-hover:border-primary/60 transition-all mb-4 shadow-lg">
                    <img
                      src={s.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=c8960c&color=fff&size=200`}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                  </div>
                  <h3 className="font-semibold font-serif">{s.name}</h3>
                  <p className="text-sm text-primary">{s.specialization}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.experience}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">Our Work</div>
              <h2 className="font-serif text-4xl font-bold">Gallery</h2>
            </div>
            <Link href="/gallery" className="hidden md:flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.slice(0, 6).map(img => (
              <Link key={img.id} href="/gallery">
                <div className="aspect-square rounded-xl overflow-hidden border border-border group cursor-pointer">
                  <img
                    src={img.image_url}
                    alt={img.caption || "Gallery"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline">
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews preview */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">Client Love</div>
              <h2 className="font-serif text-4xl font-bold">What They Say</h2>
            </div>
            <Link href="/reviews" className="hidden md:flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
              All Reviews <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(r => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{r.review}"</p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary border border-border shrink-0">
                    {r.photo_url
                      ? <img src={r.photo_url} alt={r.name} className="w-full h-full object-cover" onError={handleImageError} />
                      : <div className="w-full h-full flex items-center justify-center"><span className="text-sm font-bold text-primary">{r.name[0]}</span></div>
                    }
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">Verified Client</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Scissors className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Ready for Your Transformation?</h2>
          <p className="text-muted-foreground mb-8">Book your appointment today and experience the difference.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-10">
              <Link href="/book-appointment">Book Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
