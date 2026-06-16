import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { defaultSettings, SalonSettings } from "@/lib/types";

type FormState = SalonSettings & { business_hours_text: string };

export default function AdminSettings() {
  const [form, setForm] = useState<FormState>({ ...defaultSettings, business_hours_text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "about" | "hours" | "social">("general");
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("settings").select("*").single().then(({ data }) => {
      if (data) {
        const hoursText = typeof data.business_hours === "object" && data.business_hours
          ? JSON.stringify(data.business_hours, null, 2)
          : String(data.business_hours ?? "");
        setForm({ ...defaultSettings, ...data, business_hours_text: hoursText });
      }
      setLoading(false);
    });
  }, []);

  const set = (key: keyof FormState, value: string) => setForm(f => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    let business_hours: unknown = form.business_hours_text;
    try { business_hours = JSON.parse(form.business_hours_text); } catch { /* store as text */ }
    const { business_hours_text: _, ...rest } = form;
    const { error } = await supabase.from("settings").upsert({ id: 1, ...rest, business_hours });
    setSaving(false);
    if (error) { toast({ title: "Error saving", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Settings saved!", description: "Changes reflect on the website immediately." });
  };

  const tabs = [
    { key: "general", label: "General" },
    { key: "hero", label: "Hero Section" },
    { key: "about", label: "About Section" },
    { key: "hours", label: "Hours & Contact" },
    { key: "social", label: "Social Links" },
  ] as const;

  if (loading) return <AdminLayout><div className="p-8 text-center text-muted-foreground">Loading settings...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">All changes reflect instantly on the public website</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          {/* General */}
          {activeTab === "general" && (
            <>
              <div className="space-y-1.5">
                <Label>Salon Name</Label>
                <Input value={form.salon_name} onChange={e => set("salon_name", e.target.value)} className="bg-background" placeholder="Multicut Salon" />
              </div>
              <div className="space-y-1.5">
                <Label>Logo</Label>
                <ImageUpload bucket="logos" currentUrl={form.logo_url} onUploaded={url => set("logo_url", url)} aspect="free" />
                <p className="text-xs text-muted-foreground">Or paste a URL:</p>
                <Input value={form.logo_url} onChange={e => set("logo_url", e.target.value)} className="bg-background" placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => set("phone", e.target.value)} className="bg-background" placeholder="+1 234 567 8900" />
              </div>
              <div className="space-y-1.5">
                <Label>WhatsApp Number</Label>
                <Input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} className="bg-background" placeholder="+12345678900" />
                <p className="text-xs text-muted-foreground">Include country code, digits only for best results</p>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="bg-background" placeholder="hello@salon.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input value={form.address} onChange={e => set("address", e.target.value)} className="bg-background" placeholder="123 Style Ave, New York, NY" />
              </div>
              <div className="space-y-1.5">
                <Label>Google Maps URL</Label>
                <Input value={form.google_maps} onChange={e => set("google_maps", e.target.value)} className="bg-background" placeholder="https://maps.google.com/..." />
              </div>
            </>
          )}

          {/* Hero */}
          {activeTab === "hero" && (
            <>
              <div className="space-y-1.5">
                <Label>Hero Title</Label>
                <Input value={form.hero_title} onChange={e => set("hero_title", e.target.value)} className="bg-background" placeholder="Where Style Meets Artistry" />
              </div>
              <div className="space-y-1.5">
                <Label>Hero Subtitle</Label>
                <Textarea value={form.hero_subtitle} onChange={e => set("hero_subtitle", e.target.value)} className="bg-background" rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>Hero Background Image</Label>
                <ImageUpload bucket="website-assets" folder="hero" currentUrl={form.hero_image_url} onUploaded={url => set("hero_image_url", url)} aspect="video" />
                <p className="text-xs text-muted-foreground">Or paste a URL:</p>
                <Input value={form.hero_image_url} onChange={e => set("hero_image_url", e.target.value)} className="bg-background" placeholder="https://..." />
              </div>
            </>
          )}

          {/* About */}
          {activeTab === "about" && (
            <>
              <div className="space-y-1.5">
                <Label>About Title</Label>
                <Input value={form.about_title} onChange={e => set("about_title", e.target.value)} className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label>About Description</Label>
                <Textarea value={form.about_description} onChange={e => set("about_description", e.target.value)} className="bg-background" rows={5} />
              </div>
              <div className="space-y-1.5">
                <Label>About Image</Label>
                <ImageUpload bucket="website-assets" folder="about" currentUrl={form.about_image_url} onUploaded={url => set("about_image_url", url)} aspect="video" />
                <Input value={form.about_image_url} onChange={e => set("about_image_url", e.target.value)} className="bg-background mt-2" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {([
                  { val: "about_stat_1_value", lbl: "about_stat_1_label", num: 1 },
                  { val: "about_stat_2_value", lbl: "about_stat_2_label", num: 2 },
                  { val: "about_stat_3_value", lbl: "about_stat_3_label", num: 3 },
                ] as { val: keyof FormState; lbl: keyof FormState; num: number }[]).map(({ val, lbl, num }) => (
                  <div key={num} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Stat {num} Value</Label>
                      <Input value={String(form[val])} onChange={e => set(val, e.target.value)} className="bg-background" placeholder="10+" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Stat {num} Label</Label>
                      <Input value={String(form[lbl])} onChange={e => set(lbl, e.target.value)} className="bg-background" placeholder="Years" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Hours */}
          {activeTab === "hours" && (
            <div className="space-y-1.5">
              <Label>Business Hours (JSON)</Label>
              <Textarea
                value={form.business_hours_text}
                onChange={e => set("business_hours_text", e.target.value)}
                className="bg-background font-mono text-sm" rows={8}
                placeholder={'{\n  "Mon–Fri": "9am – 8pm",\n  "Saturday": "10am – 6pm",\n  "Sunday": "Closed"\n}'} />
              <p className="text-xs text-muted-foreground">Enter as JSON object. Keys are day names, values are hours.</p>
            </div>
          )}

          {/* Social */}
          {activeTab === "social" && (
            <>
              {[
                { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/yoursalon" },
                { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/yoursalon" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <Label>{label}</Label>
                  <Input value={String((form as unknown as Record<string, unknown>)[key] ?? "")} onChange={e => set(key as keyof FormState, e.target.value)} className="bg-background" placeholder={placeholder} />
                </div>
              ))}
            </>
          )}

          <Button onClick={save} disabled={saving} className="w-full mt-2">
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
