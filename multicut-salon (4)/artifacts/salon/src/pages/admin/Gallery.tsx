import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";

interface GalleryItem { id: string; image_url: string; caption: string; category: string; sort_order: number; }

const empty = { image_url: "", caption: "", category: "" };

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from("gallery").select("*").order("sort_order");
    setImages(data ?? []);
    setLoading(false);
  };
  useEffect(() => { loadData(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (g: GalleryItem) => { setEditing(g); setForm({ image_url: g.image_url, caption: g.caption, category: g.category }); setOpen(true); };

  const save = async () => {
    if (!form.image_url.trim()) { toast({ title: "Image is required", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = editing
      ? await supabase.from("gallery").update(form).eq("id", editing.id)
      : await supabase.from("gallery").insert(form);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editing ? "Image updated" : "Image added" });
    setOpen(false); loadData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Image removed" }); loadData();
  };

  const categories = ["All", ...Array.from(new Set(images.map(i => i.category).filter(Boolean)))];
  const filtered = categoryFilter === "All" ? images : images.filter(i => i.category === categoryFilter);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
            <p className="text-muted-foreground text-sm mt-1">{images.length} images</p>
          </div>
          <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Image</Button>
        </div>

        {/* Category filter */}
        {categories.length > 2 && (
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${categoryFilter === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-card rounded-xl animate-pulse border border-border" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <ImageIcon className="w-10 h-10 opacity-30" />
            <p>No images yet. Click "Add Image" to upload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(img => (
              <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-card">
                <img src={img.image_url} alt={img.caption || "Gallery"}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex gap-1 justify-end">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-white hover:text-primary bg-black/30"
                      onClick={() => openEdit(img)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-white hover:text-destructive bg-black/30"
                      onClick={() => remove(img.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                  <div>
                    {img.caption && <p className="text-white text-xs line-clamp-2 font-medium">{img.caption}</p>}
                    {img.category && <span className="text-primary text-xs">{img.category}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Image" : "Add Gallery Image"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Upload Image</Label>
              <ImageUpload bucket="gallery-images" currentUrl={form.image_url}
                onUploaded={url => setForm(f => ({ ...f, image_url: url }))} aspect="square" />
            </div>
            <div className="space-y-1.5">
              <Label>Or paste image URL</Label>
              <Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="https://..." className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label>Caption</Label>
              <Input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                placeholder="Describe this photo..." className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Color, Haircut, Balayage..." className="bg-background" />
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
