const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, DollarSign, Percent, Award } from 'lucide-react';

const PIE_COLORS = ['hsl(271,76%,63%)', 'hsl(280,65%,55%)', 'hsl(260,60%,50%)', 'hsl(290,60%,60%)', 'hsl(250,55%,58%)', 'hsl(300,55%,62%)'];

export default function RevenueReports() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await db.entities.Booking.list('-created_date', 200);
        setBookings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completed = bookings.filter((b) => b.status === 'completed');

  const monthlyData = React.useMemo(() => {
    const map = {};
    completed.forEach((b) => {
      if (!b.booking_date) return;
      const month = b.booking_date.substring(0, 7);
      if (!map[month]) map[month] = { month, revenue: 0, commission: 0 };
      map[month].revenue += b.total_price || 0;
      map[month].commission += Math.round((b.total_price || 0) * 0.15);
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6).map((d) => ({ ...d, month: d.month.substring(5) + '/' + d.month.substring(2, 4) }));
  }, [completed]);

  const categoryData = React.useMemo(() => {
    const map = {};
    completed.forEach((b) => {
      const cat = b.service_name || 'Other';
      map[cat] = (map[cat] || 0) + (b.total_price || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [completed]);

  const totalRevenue = completed.reduce((s, b) => s + (b.total_price || 0), 0);
  const totalCommission = Math.round(totalRevenue * 0.15);
  const netRevenue = totalRevenue - totalCommission;
  const avgBooking = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-light">Revenue Reports</h1>
          <p className="text-primary-foreground/60 mt-1">Monthly trends, commission deductions & top services</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><DollarSign className="w-5 h-5 text-primary" /></div>
            <div className="text-2xl font-heading font-semibold">AED {totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Gross Revenue</div>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><Percent className="w-5 h-5 text-accent" /></div>
            <div className="text-2xl font-heading font-semibold">AED {totalCommission.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Commission Deducted</div>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><TrendingUp className="w-5 h-5 text-green-600" /></div>
            <div className="text-2xl font-heading font-semibold">AED {netRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Net Revenue</div>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><Award className="w-5 h-5 text-primary" /></div>
            <div className="text-2xl font-heading font-semibold">AED {avgBooking}</div>
            <div className="text-xs text-muted-foreground">Avg. Booking Value</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
            <h2 className="text-lg font-heading font-medium mb-4">Monthly Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 20% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(270 10% 45%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(270 10% 45%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(0 0% 100%)', border: '1px solid hsl(270 20% 88%)', borderRadius: '12px', fontSize: '13px' }} />
                <Bar dataKey="revenue" fill="hsl(271 76% 63%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
            <h2 className="text-lg font-heading font-medium mb-4">Commission vs Revenue</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(271 76% 63%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(271 76% 63%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="com" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(290 60% 55%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(290 60% 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 20% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(270 10% 45%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(270 10% 45%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(0 0% 100%)', border: '1px solid hsl(270 20% 88%)', borderRadius: '12px', fontSize: '13px' }} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="hsl(271 76% 63%)" strokeWidth={2.5} fill="url(#rev)" />
                <Area type="monotone" dataKey="commission" stroke="hsl(290 60% 55%)" strokeWidth={2.5} fill="url(#com)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
          <h2 className="text-lg font-heading font-medium mb-4">Top Performing Services</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={(e) => `${e.name}`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(0 0% 100%)', border: '1px solid hsl(270 20% 88%)', borderRadius: '12px', fontSize: '13px' }} formatter={(v) => `AED ${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-12">No completed bookings to analyze yet</p>
          )}
        </div>
      </div>
    </div>
  );
}