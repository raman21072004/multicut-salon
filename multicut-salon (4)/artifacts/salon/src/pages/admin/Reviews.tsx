import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

interface Review {
  id: string; name: string; rating: number; review: string; photo_url: string; created_at: string;
}

const empty = { name: "", rating: 5, review: "", photo_url: "" };

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  };
  useEffect(() => { loadData(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (r: Review) => {
    setEditing(r);
    setForm({ name: r.name, rating: r.rating, review: r.review, photo_url: r.photo_url ?? "" });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.review.trim()) {
      toast({ title: "Name and review are required", variant: "destructive" }); return;
    }
    setSaving(true);
    const payload = { ...form, rating: Number(form.rating) };
    const { error } = editing
      ? await supabase.from("reviews").update(payload).eq("id", editing.id)
      : await supabase.from("reviews").insert(payload);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editing ? "Review updated" : "Review added" });
    setOpen(false); loadData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Review deleted" }); loadData();
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {reviews.length} reviews · Avg rating: <span className="text-primary font-medium">{avgRating} ★</span>
            </p>
          </div>
          <Button onClick={openAdd} data-testid="button-add-review"><Plus className="w-4 h-4 mr-2" />Add Review</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? [1, 2, 3].map(i => <div key={i} className="h-36 bg-card rounded-xl animate-pulse border border-border" />)
            : reviews.length === 0
              ? <div className="col-span-3 text-center py-16 text-muted-foreground">No reviews yet.</div>
              : reviews.map(r => (
                <div key={r.id} className="bg-card border border-border rounded-xl p-5 space-y-3" data-testid={`card-review-${r.id}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm">{r.name}</div>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => openEdit(r)} data-testid={`button-edit-review-${r.id}`}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive" onClick={() => remove(r.id)} data-testid={`button-delete-review-${r.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">"{r.review}"</p>
                  <div className="text-xs text-muted-foreground/50">{new Date(r.created_at).toLocaleDateString()}</div>
                </div>
              ))
          }
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Review" : "Add Review"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Client name" className="bg-background" data-testid="input-review-name" />
            </div>
            <div className="space-y-1.5">
              <Label>Rating</Label>
              <Select value={String(form.rating)} onValueChange={v => setForm(f => ({ ...f, rating: Number(v) }))}>
                <SelectTrigger className="bg-background" data-testid="select-review-rating">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map(n => (
                    <SelectItem key={n} value={String(n)}>{"★".repeat(n)} {n} Stars</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Review *</Label>
              <Textarea value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                placeholder="What did the client say?" className="bg-background" rows={4} data-testid="input-review-text" />
            </div>
            <div className="space-y-1.5">
              <Label>Photo URL (optional)</Label>
              <Input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))}
                placeholder="https://..." className="bg-background" data-testid="input-review-photo" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={save} disabled={saving} data-testid="button-save-review">
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
