import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Calendar, CheckCircle, XCircle, Clock, Scissors, Users, Star, Image, MessageSquare, TrendingUp } from "lucide-react";

interface Stats {
  total: number; pending: number; confirmed: number; cancelled: number; completed: number;
  services: number; stylists: number; reviews: number; gallery: number; contacts: number;
}

interface DailyData { date: string; count: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total:0, pending:0, confirmed:0, cancelled:0, completed:0, services:0, stylists:0, reviews:0, gallery:0, contacts:0 });
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [appts, svcs, stylists, reviews, gallery, contacts] = await Promise.all([
        supabase.from("appointments").select("status, created_at"),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("stylists").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
      ]);
      const data = appts.data ?? [];
      const statusCounts = data.reduce((acc: Record<string, number>, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1; return acc;
      }, {});

      setStats({
        total: data.length,
        pending: statusCounts["pending"] || 0,
        confirmed: statusCounts["confirmed"] || 0,
        cancelled: statusCounts["cancelled"] || 0,
        completed: statusCounts["completed"] || 0,
        services: svcs.count ?? 0,
        stylists: stylists.count ?? 0,
        reviews: reviews.count ?? 0,
        gallery: gallery.count ?? 0,
        contacts: contacts.count ?? 0,
      });

      // Build last 14 days chart
      const days: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        days[d.toISOString().split("T")[0]] = 0;
      }
      data.forEach(a => {
        const day = a.created_at?.split("T")[0];
        if (day && days[day] !== undefined) days[day]++;
      });
      setDailyData(Object.entries(days).map(([date, count]) => ({ date: date.slice(5), count })));
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Bookings", value: stats.total, icon: Calendar, color: "text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "text-green-400" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-red-400" },
    { label: "Completed", value: stats.completed, icon: TrendingUp, color: "text-blue-400" },
    { label: "Services", value: stats.services, icon: Scissors, color: "text-primary" },
    { label: "Stylists", value: stats.stylists, icon: Users, color: "text-primary" },
    { label: "Reviews", value: stats.reviews, icon: Star, color: "text-yellow-400" },
    { label: "Gallery Images", value: stats.gallery, icon: Image, color: "text-primary" },
    { label: "Contact Requests", value: stats.contacts, icon: MessageSquare, color: "text-blue-400" },
  ];

  const statusChartData = [
    { name: "Pending", value: stats.pending, fill: "#facc15" },
    { name: "Confirmed", value: stats.confirmed, fill: "#4ade80" },
    { name: "Cancelled", value: stats.cancelled, fill: "#f87171" },
    { name: "Completed", value: stats.completed, fill: "#60a5fa" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your salon</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="border-border" data-testid={`card-stat-${label.toLowerCase().replace(/\s/g,"-")}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Appointments by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bookings — Last 14 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} interval={2} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
