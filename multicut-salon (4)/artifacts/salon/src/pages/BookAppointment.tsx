import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { supabase } from "@/lib/supabase";
import { Service, Stylist } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Calendar, Clock, Scissors } from "lucide-react";
import { fallbackServices, fallbackStylists } from "@/lib/fallbackData";
import { isMissingTableError, queueLocalAppointment } from "@/lib/offlineQueue";

const timeSlots = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM"];

export default function BookAppointment() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    service_id: params.get("service") || "",
    stylist_id: params.get("stylist") || "",
    date: "", time: "", notes: ""
  });

  useEffect(() => {
    Promise.all([
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("stylists").select("*").order("sort_order"),
    ]).then(([svc, sty]) => {
      setServices((svc.data && svc.data.length > 0 ? svc.data : fallbackServices) as Service[]);
      setStylists((sty.data && sty.data.length > 0 ? sty.data : fallbackStylists) as Stylist[]);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) {
      toast({ title: "Please fill all required fields", variant: "destructive" }); return;
    }
    setLoading(true);
    const payload = {
      name: form.name, phone: form.phone, email: form.email,
      service_id: form.service_id || null,
      stylist_id: form.stylist_id || null,
      date: form.date, time: form.time, notes: form.notes,
      status: "pending"
    };
    const { error } = await supabase.from("appointments").insert(payload);
    setLoading(false);
    if (error) {
      if (isMissingTableError(error)) {
        queueLocalAppointment(payload);
        setSubmitted(true);
        return;
      }
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 pb-24 px-6 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">Booking Submitted!</h1>
          <p className="text-muted-foreground mb-2">Thank you, <strong>{form.name}</strong>!</p>
          <p className="text-muted-foreground mb-8">We've received your appointment request for <strong>{form.date}</strong> at <strong>{form.time}</strong>. We'll confirm within 24 hours via phone or email.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { setSubmitted(false); setForm({ name:"",phone:"",email:"",service_id:"",stylist_id:"",date:"",time:"",notes:"" }); }}>Book Another</Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>Back to Home</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">Reserve Your Spot</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-muted-foreground text-lg">Fill out the form below — we'll confirm your booking within 24 hours.</p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-10">
        <div className="max-w-3xl mx-auto flex gap-6 flex-wrap">
          {[
            { icon: Scissors, label: "Choose Service" },
            { icon: Calendar, label: "Pick a Date" },
            { icon: Clock, label: "Select Time" },
          ].map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</div>
              <Icon className="w-3.5 h-3.5 text-primary" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone *</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 8900" required className="bg-background" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="bg-background" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Service</Label>
                <Select value={form.service_id} onValueChange={v => setForm(f => ({ ...f, service_id: v }))}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select a service" /></SelectTrigger>
                  <SelectContent>
                    {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — ₹{s.price}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Preferred Stylist</Label>
                <Select value={form.stylist_id} onValueChange={v => setForm(f => ({ ...f, stylist_id: v }))}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Any available stylist" /></SelectTrigger>
                  <SelectContent>
                    {stylists.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className="bg-background" min={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-1.5">
                <Label>Time *</Label>
                <Select value={form.time} onValueChange={v => setForm(f => ({ ...f, time: v }))}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select a time" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Special Requests</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes or special requests..." className="bg-background" rows={3} />
            </div>
            <Button type="submit" size="lg" className="w-full text-base shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? "Submitting..." : "Request Appointment"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">We'll reach out within 24 hours to confirm your booking.</p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
