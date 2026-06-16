import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, CheckCircle, Clock, Mail, Phone } from "lucide-react";

interface Contact {
  id: string; name: string; email: string; phone: string;
  message: string; resolved: boolean; created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    setContacts(data ?? []);
    setLoading(false);
  };
  useEffect(() => { loadData(); }, []);

  const toggleResolved = async (id: string, resolved: boolean) => {
    const { error } = await supabase.from("contacts").update({ resolved: !resolved }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: !resolved ? "Marked as resolved" : "Marked as pending" });
    loadData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Message deleted" }); loadData();
  };

  const unresolvedCount = contacts.filter(c => !c.resolved).length;
  const filtered = contacts.filter(c =>
    filter === "all" ? true : filter === "resolved" ? c.resolved : !c.resolved
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {contacts.length} total · {unresolvedCount} unresolved
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg w-fit">
          {(["all", "unresolved", "resolved"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No messages found</div>
          ) : filtered.map(c => (
            <div key={c.id}
              className={`bg-card border rounded-xl p-5 transition-all ${c.resolved ? "border-border opacity-60" : "border-primary/20 shadow-sm"}`}
              data-testid={`card-contact-${c.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-sm">{c.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.resolved ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                      {c.resolved ? <><CheckCircle className="w-3 h-3" />Resolved</> : <><Clock className="w-3 h-3" />Pending</>}
                    </span>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-3 h-3" />{c.email}
                      </a>
                    )}
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Phone className="w-3 h-3" />{c.phone}
                      </a>
                    )}
                  </div>
                  {c.message && (
                    <p className="text-sm text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">{c.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground/40">{new Date(c.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" className="h-8 px-2"
                    onClick={() => toggleResolved(c.id, c.resolved)}
                    title={c.resolved ? "Mark as pending" : "Mark as resolved"}
                    data-testid={`button-toggle-contact-${c.id}`}>
                    <CheckCircle className={`w-4 h-4 ${c.resolved ? "text-muted-foreground" : "text-green-400"}`} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-2 hover:text-destructive"
                    onClick={() => remove(c.id)} title="Delete" data-testid={`button-delete-contact-${c.id}`}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
