import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, Calendar, Clock, IndianRupee, Scissors, Users, Image, MessageSquare } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  total: number; pending: number; confirmed: number; cancelled: number; completed: number;
  services: number; stylists: number; gallery: number; contacts: number; revenue: number;
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState<Stats>({ total:0,pending:0,confirmed:0,cancelled:0,completed:0,services:0,stylists:0,gallery:0,contacts:0,revenue:0 });
  const [monthlyData, setMonthlyData] = useState<{ month: string; bookings: number; revenue: number }[]>([]);
  const [serviceData, setServiceData] = useState<{ name: string; count: number }[]>([]);
  const [dailyData, setDailyData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [appts, svcs, svcList, stylists, gallery, contacts] = await Promise.all([
        supabase.from("appointments").select("status, created_at, service_id, services(name, price)"),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id, name"),
        supabase.from("stylists").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
      ]);

      const data = (appts.data ?? []) as unknown as { status: string; created_at: string; service_id: string; services: { name: string; price: number } | null }[];
      const completed = data.filter(a => a.status === "completed");
      const revenue = completed.reduce((s, a) => s + (a.services?.price ?? 0), 0);

      setStats({
        total: data.length,
        pending: data.filter(a => a.status === "pending").length,
        confirmed: data.filter(a => a.status === "confirmed").length,
        cancelled: data.filter(a => a.status === "cancelled").length,
        completed: completed.length,
        services: svcs.count ?? 0,
        stylists: stylists.count ?? 0,
        gallery: gallery.count ?? 0,
        contacts: contacts.count ?? 0,
        revenue,
      });

      // Monthly data — last 6 months
      const months: Record<string, { bookings: number; revenue: number }> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i);
        const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
        months[key] = { bookings: 0, revenue: 0 };
      }
      data.forEach(a => {
        const d = new Date(a.created_at);
        const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
        if (months[key]) {
          months[key].bookings++;
          if (a.status === "completed") months[key].revenue += (a.services?.price ?? 0);
        }
      });
      setMonthlyData(Object.entries(months).map(([month, v]) => ({ month, ...v })));

      // Daily — last 14 days
      const days: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        days[d.toISOString().split("T")[0]] = 0;
      }
      data.forEach(a => { const day = a.created_at?.split("T")[0]; if (day && days[day] !== undefined) days[day]++; });
      setDailyData(Object.entries(days).map(([date, count]) => ({ date: date.slice(5), count })));

      // Service popularity
      const svcMap: Record<string, number> = {};
      svcList.data?.forEach(s => { svcMap[s.id] = 0; });
      data.forEach(a => { if (a.service_id && svcMap[a.service_id] !== undefined) svcMap[a.service_id]++; });
      const serviceNameMap: Record<string, string> = {};
      svcList.data?.forEach(s => { serviceNameMap[s.id] = s.name; });
      setServiceData(Object.entries(svcMap).map(([id, count]) => ({ name: serviceNameMap[id] || id, count })).sort((a, b) => b.count - a.count).slice(0, 6));

      setLoading(false);
    }
    load();
  }, []);

  const PIE_COLORS = ["#eab308","#f97316","#4ade80","#60a5fa","#f87171"];

  const statusPie = [
    { name: "Pending", value: stats.pending },
    { name: "Confirmed", value: stats.confirmed },
    { name: "Completed", value: stats.completed },
    { name: "Cancelled", value: stats.cancelled },
  ].filter(d => d.value > 0);

  const kpis = [
    { label: "Total Bookings", value: stats.total, icon: Calendar, color: "text-primary" },
    { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-yellow-400" },
    { label: "Completed", value: stats.completed, icon: TrendingUp, color: "text-green-400" },
    { label: "Est. Revenue", value: formatPrice(stats.revenue), icon: IndianRupee, color: "text-primary" },
    { label: "Services", value: stats.services, icon: Scissors, color: "text-primary" },
    { label: "Stylists", value: stats.stylists, icon: Users, color: "text-primary" },
    { label: "Gallery Images", value: stats.gallery, icon: Image, color: "text-primary" },
    { label: "Contact Requests", value: stats.contacts, icon: MessageSquare, color: "text-blue-400" },
  ];

  const chartStyle = {
    tooltip: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" },
    axis: { fill: "hsl(var(--muted-foreground))", fontSize: 11 },
    grid: { stroke: "hsl(var(--border))" },
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Business overview and performance metrics</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold mt-1">{loading ? "—" : value}</p>
                  </div>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Bookings & Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.grid.stroke} />
                  <XAxis dataKey="month" tick={chartStyle.axis} />
                  <YAxis yAxisId="left" tick={chartStyle.axis} />
                  <YAxis yAxisId="right" orientation="right" tick={chartStyle.axis} />
                  <Tooltip contentStyle={chartStyle.tooltip} />
                  <Bar yAxisId="left" dataKey="bookings" fill="hsl(var(--primary))" radius={[4,4,0,0]} name="Bookings" />
                  <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--accent))" radius={[4,4,0,0]} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Daily Bookings — Last 14 Days</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.grid.stroke} />
                  <XAxis dataKey="date" tick={chartStyle.axis} interval={2} />
                  <YAxis tick={chartStyle.axis} />
                  <Tooltip contentStyle={chartStyle.tooltip} />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} name="Bookings" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Booking Status Distribution</CardTitle></CardHeader>
            <CardContent>
              {statusPie.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {statusPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={chartStyle.tooltip} />
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No booking data yet</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Popular Services</CardTitle></CardHeader>
            <CardContent>
              {serviceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={serviceData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.grid.stroke} horizontal={false} />
                    <XAxis type="number" tick={chartStyle.axis} />
                    <YAxis type="category" dataKey="name" tick={{ ...chartStyle.axis, width: 100 }} width={100} />
                    <Tooltip contentStyle={chartStyle.tooltip} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0,4,4,0]} name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No service booking data yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue summary */}
        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue Summary (Completed Bookings)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
              {[
                { label: "Total Revenue", value: formatPrice(stats.revenue) },
                { label: "Avg per Booking", value: stats.completed ? formatPrice(Math.round(stats.revenue / stats.completed)) : formatPrice(0) },
                { label: "Completion Rate", value: stats.total ? `${Math.round((stats.completed / stats.total) * 100)}%` : "0%" },
                { label: "Cancellation Rate", value: stats.total ? `${Math.round((stats.cancelled / stats.total) * 100)}%` : "0%" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center py-4 border border-border rounded-xl bg-secondary/20">
                  <div className="text-2xl font-bold text-primary font-serif">{loading ? "—" : value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
