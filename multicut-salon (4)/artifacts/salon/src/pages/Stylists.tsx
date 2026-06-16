import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Stylist } from "@/lib/types";
import { fallbackStylists } from "@/lib/fallbackData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { handleImageError } from "@/lib/imageFallback";

export default function Stylists() {
  const [stylists, setStylists] = useState<Stylist[]>(fallbackStylists);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("stylists").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setStylists(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">The Team</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Our Stylists</h1>
          <p className="text-muted-foreground text-lg max-w-xl">Passionate professionals dedicated to bringing your vision to life with skill and artistry.</p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-80 bg-card rounded-2xl animate-pulse border border-border" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stylists.map(s => (
                <div key={s.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[3/4] overflow-hidden bg-secondary">
                    <img
                      src={s.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=c8960c&color=fff&size=400`}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold">{s.name}</h3>
                    <p className="text-primary text-sm font-medium mt-1">{s.specialization}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.experience} experience</p>
                    {s.bio && <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{s.bio}</p>}
                    {s.availability && <p className="text-xs text-muted-foreground mt-2 opacity-70">📅 {s.availability}</p>}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex gap-2">
                        {s.instagram && (
                          <a href={s.instagram} target="_blank" rel="noreferrer"
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                            <FaInstagram className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {s.facebook && (
                          <a href={s.facebook} target="_blank" rel="noreferrer"
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                            <FaFacebookF className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <Button asChild size="sm" variant="outline" className="text-xs">
                        <Link href={`/stylists/${s.id}`}>View Profile</Link>
                      </Button>
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
          <h2 className="font-serif text-3xl font-bold mb-4">Book with Your Favourite Stylist</h2>
          <p className="text-muted-foreground mb-6">Choose your preferred stylist when booking your appointment.</p>
          <Button asChild size="lg" className="px-10">
            <Link href="/book-appointment">Book an Appointment</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
