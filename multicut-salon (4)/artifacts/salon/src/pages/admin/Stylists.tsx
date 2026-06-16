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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

interface Stylist { id: string; name: string; photo_url: string; experience: string; specialization: string; bio: string; availability: string; instagram: string; facebook: string; }

const empty = { name: "", photo_url: "", experience: "", specialization: "", bio: "", availability: "", instagram: "", facebook: "" };

export default function AdminStylists() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Stylist | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from("stylists").select("*").order("sort_order");
    setStylists(data ?? []);
    setLoading(false);
  };
  useEffect(() => { loadData(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (s: Stylist) => { setEditing(s); setForm({ name: s.name, photo_url: s.photo_url || "", experience: s.experience || "", specialization: s.specialization || "", bio: s.bio || "", availability: s.availability || "", instagram: s.instagram || "", facebook: s.facebook || "" }); setOpen(true); };

  const save = async () => {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = editing
      ? await supabase.from("stylists").update(form).eq("id", editing.id)
      : await supabase.from("stylists").insert(form);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editing ? "Stylist updated" : "Stylist added" });
    setOpen(false); loadData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("stylists").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Stylist deleted" }); loadData();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stylists</h1>
            <p className="text-muted-foreground text-sm mt-1">{stylists.length} stylists</p>
          </div>
          <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Stylist</Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-card rounded-xl animate-pulse border border-border" />)}
          </div>
        ) : stylists.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No stylists yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stylists.map(s => (
              <div key={s.id} className="bg-card border border-border rounded-xl overflow-hidden">
                {s.photo_url ? (
                  <div className="aspect-[3/2] overflow-hidden bg-secondary">
                    <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[3/2] bg-secondary flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/40">{s.name[0]}</span>
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-primary font-medium">{s.specialization}</div>
                      <div className="text-xs text-muted-foreground">{s.experience}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive" onClick={() => remove(s.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  {s.bio && <p className="text-xs text-muted-foreground line-clamp-2">{s.bio}</p>}
                  {s.availability && <p className="text-xs text-muted-foreground/70">📅 {s.availability}</p>}
                  <div className="flex gap-2 pt-1">
                    {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram className="w-3.5 h-3.5" /></a>}
                    {s.facebook && <a href={s.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><FaFacebookF className="w-3.5 h-3.5" /></a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Stylist" : "Add Stylist"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Photo</Label>
              <ImageUpload bucket="stylist-images" currentUrl={form.photo_url} aspect="square"
                onUploaded={url => setForm(f => ({ ...f, photo_url: url }))} />
              <Input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))}
                placeholder="Or paste URL..." className="bg-background mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label>Specialization</Label>
                <Input value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} className="bg-background" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Experience</Label>
                <Input value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="e.g. 5 years" className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label>Availability</Label>
                <Input value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} placeholder="Mon–Sat" className="bg-background" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="bg-background" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Instagram URL</Label>
                <Input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="https://instagram.com/..." className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label>Facebook URL</Label>
                <Input value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} placeholder="https://facebook.com/..." className="bg-background" />
              </div>
            </div>
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
