import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { supabase } from "@/lib/supabase";
import { Stylist } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Scissors } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { handleImageError } from "@/lib/imageFallback";
import { fallbackStylists } from "@/lib/fallbackData";

export default function StylistDetail() {
  const { id } = useParams<{ id: string }>();
  const [stylist, setStylist] = useState<Stylist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("stylists").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setStylist(data ?? fallbackStylists.find(s => s.id === id) ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!stylist) return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 px-6 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Stylist Not Found</h1>
        <Button asChild>
          <Link href="/stylists">Back to Stylists</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/stylists" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Stylists
          </Link>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img
                src={stylist.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(stylist.name)}&background=c8960c&color=fff&size=800`}
                alt={stylist.name} className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">Stylist Profile</div>
                <h1 className="font-serif text-4xl font-bold">{stylist.name}</h1>
                <p className="text-xl text-primary font-medium mt-2">{stylist.specialization}</p>
              </div>

              {stylist.bio && (
                <p className="text-muted-foreground leading-relaxed">{stylist.bio}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                {stylist.experience && (
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                    <Scissors className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Experience</div>
                      <div className="font-semibold text-sm">{stylist.experience}</div>
                    </div>
                  </div>
                )}
                {stylist.availability && (
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Available</div>
                      <div className="font-semibold text-sm">{stylist.availability}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {stylist.instagram && (
                  <a href={stylist.instagram} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary border border-border hover:border-primary/50 rounded-lg px-4 py-2 transition-colors">
                    <FaInstagram className="w-4 h-4" /> Instagram
                  </a>
                )}
                {stylist.facebook && (
                  <a href={stylist.facebook} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary border border-border hover:border-primary/50 rounded-lg px-4 py-2 transition-colors">
                    <FaFacebookF className="w-4 h-4" /> Facebook
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button asChild size="lg" className="w-full">
                  <Link href={`/book-appointment?stylist=${stylist.id}`}>Book with {stylist.name.split(" ")[0]}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/stylists">View All Stylists</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
