import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { defaultSettings } from "@/lib/types";
import { Scissors, Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/stylists", label: "Stylists" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/book-appointment", label: "Book Now" },
];

export default function Footer() {
  const [s, setS] = useState(defaultSettings);
  useEffect(() => {
    supabase.from("settings").select("*").single().then(({ data }) => {
      if (data) setS((p) => ({ ...p, ...data }));
    });
  }, []);

  return (
    <footer className="border-t border-border bg-card/20 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-serif text-lg font-semibold">{s.salon_name}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium hair services crafted with intention. Where style meets artistry.
            </p>
            <div className="flex gap-3 mt-5">
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
              {s.facebook && (
                <a href={s.facebook} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                  <FaFacebookF className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-widest text-primary uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-widest text-primary uppercase">Contact</h4>
            <ul className="space-y-3">
              {s.phone && (
                <li className="flex gap-2.5 items-start">
                  <Phone className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <a href={`tel:${s.phone}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{s.phone}</a>
                </li>
              )}
              {s.email && (
                <li className="flex gap-2.5 items-start">
                  <Mail className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <a href={`mailto:${s.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{s.email}</a>
                </li>
              )}
              {s.address && (
                <li className="flex gap-2.5 items-start">
                  <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{s.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {s.salon_name}. All rights reserved.</span>
          <Link href="/admin/login" className="hover:text-foreground transition-colors">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
