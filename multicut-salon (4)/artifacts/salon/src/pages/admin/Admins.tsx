import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Shield, ShieldCheck, Mail } from "lucide-react";

interface Profile { id: string; full_name: string; role: string; created_at: string; email?: string; }

export default function AdminAdmins() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [myRole, setMyRole] = useState<string>("admin");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "admin" });
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at");
    setProfiles(data ?? []);
    if (user?.id) {
      const me = data?.find(p => p.id === user.id);
      if (me) setMyRole(me.role);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [user]);

  const isSuperAdmin = myRole === "super_admin";

  const inviteAdmin = async () => {
    if (!form.email || !form.password) { toast({ title: "Email and password are required", variant: "destructive" }); return; }
    setSaving(true);
    const { data, error } = await supabase.auth.admin ? 
      // If admin API available, try it; otherwise use signUp
      { data: null, error: { message: "Use Supabase dashboard to invite users" } } :
      { data: null, error: { message: "Use Supabase dashboard to invite users" } };
    
    // Since client-side admin user creation requires service role key,
    // we guide the admin to use Supabase dashboard
    setSaving(false);
    toast({ 
      title: "To add an admin:", 
      description: "Go to Supabase → Authentication → Users → Invite user. After they sign in, their profile will appear here automatically.",
      variant: "default"
    });
    setOpen(false);
  };

  const updateRole = async (id: string, role: string) => {
    if (!isSuperAdmin) { toast({ title: "Only super admins can change roles", variant: "destructive" }); return; }
    if (id === user?.id) { toast({ title: "You cannot change your own role", variant: "destructive" }); return; }
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Role updated" });
    loadData();
  };

  const removeAdmin = async (id: string) => {
    if (!isSuperAdmin) { toast({ title: "Only super admins can remove admins", variant: "destructive" }); return; }
    if (id === user?.id) { toast({ title: "You cannot remove yourself", variant: "destructive" }); return; }
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Admin removed" });
    loadData();
  };

  const promoteMyself = async () => {
    // First user becomes super admin if no super admin exists
    const hasSuperAdmin = profiles.some(p => p.role === "super_admin");
    if (!hasSuperAdmin && user?.id) {
      await supabase.from("profiles").upsert({ id: user.id, role: "super_admin", full_name: user.email });
      toast({ title: "You've been set as Super Admin" });
      loadData();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {profiles.length} admin{profiles.length !== 1 ? "s" : ""} · Your role: <span className={`font-medium ${myRole === "super_admin" ? "text-primary" : "text-muted-foreground"}`}>{myRole.replace("_", " ")}</span>
            </p>
          </div>
          <Button onClick={() => setOpen(true)} data-testid="button-add-admin">
            <Plus className="w-4 h-4 mr-2" />Add Admin
          </Button>
        </div>

        {/* Role info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Super Admin</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Manage admin users & roles</li>
              <li>• Access all settings</li>
              <li>• Full access to everything</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Admin</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Manage website content</li>
              <li>• Manage bookings & gallery</li>
              <li>• Manage services & stylists</li>
            </ul>
          </div>
        </div>

        {/* No super admin yet */}
        {!profiles.some(p => p.role === "super_admin") && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-primary">No Super Admin set</p>
              <p className="text-sm text-muted-foreground mt-1">Set yourself as Super Admin to manage other admins.</p>
            </div>
            <Button onClick={promoteMyself} size="sm">Become Super Admin</Button>
          </div>
        )}

        {/* Admin list */}
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No admin profiles yet.</p>
              <p className="text-xs mt-2">Admin profiles are created automatically when users sign in for the first time.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Admin</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Since</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {profiles.map(p => (
                  <tr key={p.id} className={`hover:bg-secondary/30 transition-colors ${p.id === user?.id ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {(p.full_name || "A")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{p.full_name || "Admin User"}</div>
                          {p.id === user?.id && <div className="text-xs text-primary">You</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isSuperAdmin && p.id !== user?.id ? (
                        <Select value={p.role} onValueChange={v => updateRole(p.id, v)}>
                          <SelectTrigger className="w-36 h-7 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.role === "super_admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                          {p.role === "super_admin" ? <><ShieldCheck className="w-3 h-3" />Super Admin</> : <><Shield className="w-3 h-3" />Admin</>}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      {isSuperAdmin && p.id !== user?.id && (
                        <Button size="sm" variant="ghost" className="h-7 px-2 hover:text-destructive" onClick={() => removeAdmin(p.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle>Add Admin User</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="bg-secondary/50 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Mail className="w-4 h-4 text-primary" />
                How to add admin users:
              </div>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Go to your <strong>Supabase Dashboard</strong></li>
                <li>Navigate to <strong>Authentication → Users</strong></li>
                <li>Click <strong>"Invite user"</strong> and enter their email</li>
                <li>They'll receive an invite email to set a password</li>
                <li>Once they sign in, their profile appears here</li>
                <li>You can then update their role above</li>
              </ol>
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
