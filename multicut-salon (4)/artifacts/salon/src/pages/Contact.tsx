import { useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { useSalonSettings } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { handleImageError } from "@/lib/imageFallback";
import { isMissingTableError, queueLocalContact } from "@/lib/offlineQueue";

export default function Contact() {
  const { settings } = useSalonSettings();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const hours = typeof settings.business_hours === "object" && settings.business_hours !== null
    ? settings.business_hours as Record<string, string> : {};

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) { toast({ title: "Name and message are required", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("contacts").insert(form);
    setLoading(false);
    if (error) {
      if (isMissingTableError(error)) {
        queueLocalContact(form);
        toast({ title: "Saved locally", description: "The live contacts table is not available yet, so your message was stored on this device." });
        setForm({ name: "", email: "", phone: "", message: "" });
        return;
      }
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">Get In Touch</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-xl">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-6">
            <div className="aspect-video rounded-2xl overflow-hidden border border-border">
              <img src="https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=800&q=80" alt="Salon" className="w-full h-full object-cover" onError={handleImageError} />
            </div>
            {[
              { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
              { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
              { icon: MapPin, label: "Address", value: settings.address, href: settings.google_maps || "#" },
            ].map(({ icon: Icon, label, value, href }) => value && (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
                  <div className="text-sm group-hover:text-primary transition-colors">{value}</div>
                </div>
              </a>
            ))}
            {Object.keys(hours).length > 0 && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Business Hours</div>
                  <div className="space-y-1">
                    {Object.entries(hours).map(([day, time]) => (
                      <div key={day} className="flex gap-6 text-sm">
                        <span className="text-muted-foreground w-24 shrink-0">{day}</span>
                        <span>{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"><FaInstagram className="w-4 h-4" /></a>}
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"><FaFacebookF className="w-4 h-4" /></a>}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required className="bg-card" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234..." className="bg-card" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="bg-card" />
            </div>
            <div className="space-y-1.5">
              <Label>Message *</Label>
              <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="How can we help?" required rows={7} className="bg-card" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
            <div className="text-center">
              <Link href="/book-appointment" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Want to book an appointment instead? →
              </Link>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
