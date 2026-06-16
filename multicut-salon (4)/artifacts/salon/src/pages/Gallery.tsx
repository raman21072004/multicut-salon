import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GalleryItem } from "@/lib/types";
import { fallbackGallery } from "@/lib/fallbackData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { handleImageError } from "@/lib/imageFallback";

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>(fallbackGallery);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    supabase.from("gallery").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setImages(data);
      setLoading(false);
    });
  }, []);

  const categories = ["All", ...Array.from(new Set(images.map(i => i.category).filter(Boolean)))];
  const filtered = category === "All" ? images : images.filter(i => i.category === category);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">Our Work</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Gallery</h1>
          <p className="text-muted-foreground text-lg">A collection of our finest work — each image tells a story of transformation.</p>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${category === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-3 h-48 bg-card rounded-xl animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
              {filtered.map(img => (
                <div key={img.id}
                  className="break-inside-avoid mb-3 rounded-xl overflow-hidden border border-border group cursor-pointer relative"
                  onClick={() => setLightbox(img)}>
                  <img
                    src={img.image_url}
                    alt={img.caption || "Gallery"}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div>
                      {img.caption && <p className="text-white text-xs font-medium">{img.caption}</p>}
                      {img.category && <span className="text-primary text-xs">{img.category}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button
            type="button"
            aria-label="Close gallery preview"
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
            onClick={e => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl max-h-[90vh] flex flex-col items-center gap-4">
            <img
              src={lightbox.image_url}
              alt={lightbox.caption || "Gallery"}
              className="max-h-[80vh] w-auto rounded-xl object-contain"
              onError={handleImageError}
            />
            {lightbox.caption && <p className="text-white text-sm">{lightbox.caption}</p>}
          </div>
        </div>
      )}

      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Love What You See?</h2>
          <p className="text-muted-foreground mb-6">Book an appointment and get your own transformation.</p>
          <Button asChild size="lg" className="px-10">
            <Link href="/book-appointment">Book Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
