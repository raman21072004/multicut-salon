import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Review } from "@/lib/types";
import { fallbackReviews } from "@/lib/fallbackData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { handleImageError } from "@/lib/imageFallback";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    supabase.from("reviews").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setReviews(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const dist = [5, 4, 3, 2, 1].map(n => ({ stars: n, count: reviews.filter(r => r.rating === n).length }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">Client Love</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Client Reviews</h1>
          <p className="text-muted-foreground text-lg">Honest words from the people who matter most — our clients.</p>
        </div>
      </section>

      {/* Summary */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="text-7xl font-bold text-primary font-serif">{avg}</div>
            <div className="flex gap-0.5 my-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <div className="text-muted-foreground text-sm">{reviews.length} verified reviews</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 space-y-3">
            {dist.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex gap-0.5 shrink-0 w-24">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all"
                    style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }} />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          {[0, 5, 4, 3, 2, 1].map(n => (
            <button key={n} onClick={() => setFilter(n)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${filter === n ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
              {n === 0 ? "All" : `${n} ★`}
            </button>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-card rounded-2xl animate-pulse border border-border" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No reviews found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(r => (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{r.review}"</p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary border border-border shrink-0">
                      {r.photo_url
                        ? <img src={r.photo_url} alt={r.name} className="w-full h-full object-cover" onError={handleImageError} />
                        : <div className="w-full h-full flex items-center justify-center"><span className="font-bold text-primary">{r.name[0]}</span></div>
                      }
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : "Verified Client"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Experience It Yourself</h2>
          <p className="text-muted-foreground mb-6">Join our happy clients and book your appointment today.</p>
          <Button asChild size="lg" className="px-10">
            <Link href="/book-appointment">Book Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
