import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { defaultSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Scissors, Menu, X, MessageCircle } from "lucide-react";
import { handleImageError } from "@/lib/imageFallback";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/stylists", label: "Stylists" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [salonName, setSalonName] = useState(defaultSettings.salon_name);
  const [logoUrl, setLogoUrl] = useState("");
  const [whatsapp, setWhatsapp] = useState(defaultSettings.whatsapp);

  useEffect(() => {
    supabase.from("settings").select("salon_name,logo_url,whatsapp").single().then(({ data }) => {
      if (data) {
        if (data.salon_name) setSalonName(data.salon_name);
        if (data.logo_url) setLogoUrl(data.logo_url);
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      }
    });
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-background/80 backdrop-blur-sm"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={salonName} className="h-8 w-auto" onError={handleImageError} />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <span className="font-serif text-lg font-semibold tracking-wide">{salonName}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`text-sm tracking-wide transition-colors ${isActive(href) ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                title="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
            <Button asChild size="sm" className="px-5">
              <Link href="/book-appointment">Book Now</Link>
            </Button>
          </div>

          {/* Mobile */}
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-border bg-background px-6 py-5 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`block py-2 text-sm transition-colors ${isActive(href) ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                {label}
              </Link>
            ))}
            <div className="pt-3 flex gap-3">
              <Button asChild className="w-full">
                <Link href="/book-appointment" onClick={() => setOpen(false)} className="flex-1">Book Now</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* WhatsApp FAB */}
      {whatsapp && (
        <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#22bf5b] flex items-center justify-center shadow-2xl transition-all hover:scale-110"
          title="Chat on WhatsApp">
          <MessageCircle className="w-7 h-7 text-white fill-white" />
        </a>
      )}
    </>
  );
}
