import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Service { id: string; name: string; slug: string; category: string; price: number; duration: number; description: string; image_url: string; featured: boolean; }

const empty = { name: "", slug: "", category: "", price: 0, duration: 0, description: "", image_url: "", featured: false };

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices(data ?? []);
    setLoading(false);
  };
  useEffect(() => { loadData(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, slug: s.slug || "", category: s.category, price: s.price, duration: s.duration, description: s.description, image_url: s.image_url, featured: s.featured });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    const payload = { ...form, price: Number(form.price), duration: Number(form.duration), slug: form.slug || slugify(form.name) };
    const { error } = editing
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editing ? "Service updated" : "Service added" });
    setOpen(false); loadData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Service deleted" }); loadData();
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    await supabase.from("services").update({ featured: !featured }).eq("id", id);
    loadData();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground text-sm mt-1">{services.length} services</p>
          </div>
          <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Service</Button>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-card">
          {loading ? <div className="p-8 text-center text-muted-foreground">Loading...</div>
            : services.length === 0 ? <div className="p-8 text-center text-muted-foreground">No services yet.</div>
            : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 text-left">Service</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">Duration</th>
                      <th className="px-4 py-3 text-left">Featured</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {services.map(s => (
                      <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {s.image_url && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-secondary">
                                <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{s.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{s.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                        <td className="px-4 py-3 text-primary font-medium">{formatPrice(s.price)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.duration} min</td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleFeatured(s.id, s.featured)} title="Toggle featured"
                            className={`transition-colors ${s.featured ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                            <Star className={`w-4 h-4 ${s.featured ? "fill-primary" : ""}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive" onClick={() => remove(s.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Service Image</Label>
              <ImageUpload bucket="service-images" currentUrl={form.image_url}
                onUploaded={url => setForm(f => ({ ...f, image_url: url }))} aspect="video" />
              <Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="Or paste URL..." className="bg-background mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="bg-background" placeholder="Hair, Color..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>URL Slug</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="bg-background font-mono text-sm" />
              <p className="text-xs text-muted-foreground">Used in URL: /services/{form.slug || "..."}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} className="bg-background" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-background" rows={3} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <span className="text-sm">Feature this service on the homepage</span>
            </label>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
