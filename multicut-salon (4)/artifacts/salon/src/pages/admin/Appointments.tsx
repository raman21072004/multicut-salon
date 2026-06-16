import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Trash2, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface Appointment {
  id: string; name: string; phone: string; email: string;
  service_id: string; stylist_id: string; date: string; time: string;
  notes: string; status: string; created_at: string;
  services?: { name: string }; stylists?: { name: string };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  confirmed: "bg-green-400/10 text-green-400 border-green-400/20",
  cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
  completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("appointments")
      .select("*, services(name), stylists(name)")
      .order("created_at", { ascending: false });
    setAppointments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const getWhatsAppLink = (appt: Appointment, statusOverride?: string) => {
    const status = statusOverride || appt.status;
    const serviceName = appt.services?.name || "selected service";
    const stylistText = appt.stylists?.name ? ` with ${appt.stylists.name}` : "";
    
    let msg = "";
    if (status === "confirmed") {
      msg = `Hi ${appt.name}, your appointment for ${serviceName}${stylistText} at Multicut Salon is CONFIRMED for ${appt.date} at ${appt.time}. We look forward to seeing you!`;
    } else if (status === "cancelled") {
      msg = `Hi ${appt.name}, we regret to inform you that your appointment for ${serviceName}${stylistText} at Multicut Salon on ${appt.date} at ${appt.time} has been CANCELLED. Please let us know if you'd like to reschedule.`;
    } else {
      msg = `Hi ${appt.name}, this is about your appointment for ${serviceName}${stylistText} at Multicut Salon on ${appt.date} at ${appt.time}.`;
    }
    
    let cleanPhone = appt.phone ? appt.phone.trim() : "";
    if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.replace(/\D/g, "");
    } else {
      cleanPhone = cleanPhone.replace(/\D/g, "");
      if (cleanPhone.length === 10) {
        cleanPhone = "91" + cleanPhone; // India country code
      }
    }
    
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const updateStatus = async (id: string, status: string) => {
    const appt = appointments.find(a => a.id === id);
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    
    if (appt && appt.phone && (status === "confirmed" || status === "cancelled")) {
      const whatsappLink = getWhatsAppLink(appt, status);
      toast({
        title: `Marked as ${status}`,
        description: `Notify ${appt.name} via WhatsApp?`,
        action: (
          <ToastAction altText="Send WhatsApp" onClick={() => window.open(whatsappLink, "_blank")}>
            Send
          </ToastAction>
        ),
      });
    } else {
      toast({ title: `Marked as ${status}` });
    }
    loadData();
  };

  const deleteAppt = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Appointment deleted" });
    loadData();
  };

  const filtered = appointments.filter(a => {
    const matchSearch = !search || [a.name, a.phone, a.email].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground text-sm mt-1">{appointments.length} total bookings</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-background"
              data-testid="input-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-background" data-testid="select-status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-card">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No appointments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-left">Stylist</th>
                    <th className="px-4 py-3 text-left">Date & Time</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(a => (
                    <tr key={a.id} className="hover:bg-secondary/30 transition-colors" data-testid={`row-appointment-${a.id}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{a.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-muted-foreground">{a.phone}</span>
                          {a.phone && (
                            <a
                              href={getWhatsAppLink(a)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-500 hover:text-green-400 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp className="w-3.5 h-3.5 inline-block" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.services?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.stylists?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.date} {a.time}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${statusColors[a.status] ?? ""}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {a.status === "pending" && (
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-green-400 hover:text-green-300"
                              onClick={() => updateStatus(a.id, "confirmed")} title="Confirm" data-testid={`button-confirm-${a.id}`}>
                              <CheckCircle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {a.status !== "cancelled" && a.status !== "completed" && (
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-red-400 hover:text-red-300"
                              onClick={() => updateStatus(a.id, "cancelled")} title="Cancel" data-testid={`button-cancel-${a.id}`}>
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {a.status === "confirmed" && (
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-blue-400 hover:text-blue-300"
                              onClick={() => updateStatus(a.id, "completed")} title="Mark completed" data-testid={`button-complete-${a.id}`}>
                              <Clock className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteAppt(a.id)} title="Delete" data-testid={`button-delete-${a.id}`}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
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
    </AdminLayout>
  );
}
