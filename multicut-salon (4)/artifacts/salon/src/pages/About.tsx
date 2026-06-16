import { Link } from "wouter";
import { useSalonSettings } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Phone } from "lucide-react";
import { handleImageError } from "@/lib/imageFallback";

export default function About() {
  const { settings } = useSalonSettings();
  const hours = typeof settings.business_hours === "object" && settings.business_hours !== null
    ? settings.business_hours as Record<string, string>
    : {};

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Page hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">About Us</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">{settings.about_title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">{settings.about_description}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img src={settings.about_image_url} alt="About" className="w-full h-full object-cover" onError={handleImageError} />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-card border border-border rounded-2xl px-6 py-4 shadow-xl">
              <div className="text-2xl font-bold text-primary font-serif">{settings.about_stat_1_value}</div>
              <div className="text-xs text-muted-foreground">{settings.about_stat_1_label}</div>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4">Our Philosophy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that a great haircut isn't just a service — it's an experience. From the moment you walk through our doors, you're treated with the kind of attention and care that transforms a routine visit into a ritual.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every product we use is chosen for its quality. Every technique our stylists perform is mastered through years of practice and ongoing education. We never stop learning so that your results never stop impressing.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
              {[
                [settings.about_stat_1_value, settings.about_stat_1_label],
                [settings.about_stat_2_value, settings.about_stat_2_label],
                [settings.about_stat_3_value, settings.about_stat_3_label],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-bold text-primary font-serif">{v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hours & info */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-2xl font-bold">Business Hours</h3>
            </div>
            <div className="space-y-3">
              {Object.keys(hours).length > 0
                ? Object.entries(hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-sm border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="font-medium">{time}</span>
                    </div>
                  ))
                : <p className="text-muted-foreground text-sm">Contact us for hours</p>
              }
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Phone className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-2xl font-bold">Get In Touch</h3>
            </div>
            <div className="space-y-4 mb-6">
              {settings.phone && <p className="text-sm"><span className="text-muted-foreground">Phone: </span><a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">{settings.phone}</a></p>}
              {settings.email && <p className="text-sm"><span className="text-muted-foreground">Email: </span><a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">{settings.email}</a></p>}
              {settings.address && <p className="text-sm"><span className="text-muted-foreground">Address: </span>{settings.address}</p>}
            </div>
            <div className="flex gap-3">
              <Button asChild className="gap-2">
                <Link href="/book-appointment">Book Now <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
