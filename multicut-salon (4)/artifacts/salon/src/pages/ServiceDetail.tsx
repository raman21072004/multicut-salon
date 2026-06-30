import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { supabase } from "@/lib/supabase";
import { Service } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Clock, IndianRupee, ArrowLeft, Tag } from "lucide-react";
import { handleImageError } from "@/lib/imageFallback";
import { formatPrice } from "@/lib/utils";
import { fallbackServices } from "@/lib/fallbackData";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [related, setRelated] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    const query = isUuid
      ? supabase.from("services").select("*").eq("id", slug).maybeSingle()
      : supabase.from("services").select("*").eq("slug", slug).maybeSingle();

    query.then(({ data }) => {
      const match = data ?? fallbackServices.find(s => s.slug === slug || s.id === slug) ?? null;
      setService(match);
      if (match) {
        supabase.from("services").select("*").eq("category", match.category).neq("id", match.id).limit(3)
          .then(({ data: rel }) => {
            const relatedFromDb = rel ?? [];
            if (relatedFromDb.length > 0) {
              setRelated(relatedFromDb);
              return;
            }
            setRelated(
              fallbackServices
                .filter(s => s.category === match.category && s.id !== match.id)
                .slice(0, 3),
            );
          });
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!service) return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 px-6 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Service Not Found</h1>
        <Button asChild>
          <Link href="/services">Back to Services</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-xl">
              <img src={service.image_url || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"}
                alt={service.name} className="w-full h-full object-cover" onError={handleImageError} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold tracking-wider uppercase mb-3">
                <Tag className="w-3 h-3" />{service.category}
              </span>
              <h1 className="font-serif text-4xl font-bold mb-4">{service.name}</h1>
              <p className="text-muted-foreground leading-relaxed mb-8">{service.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="text-xl font-bold text-primary">{formatPrice(service.price)}</div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="text-xl font-bold">{service.duration} min</div>
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="w-full text-base">
                <Link href={`/book-appointment?service=${service.id}`}>Book This Service</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full mt-3">
                <Link href="/contact">Ask a Question</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 px-6 bg-card/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-8">Similar Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(s => (
                <Link key={s.id} href={`/services/${s.slug || s.id}`}>
                  <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="aspect-video overflow-hidden bg-secondary">
                      <img src={s.image_url || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"}
                        alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={handleImageError} />
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-primary font-semibold uppercase mb-1">{s.category}</div>
                      <h3 className="font-semibold">{s.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-primary font-bold">{formatPrice(s.price)}</span>
                        <span className="text-xs text-muted-foreground">{s.duration} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
