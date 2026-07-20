const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import {
  Calendar, DollarSign, Users, Store, TrendingUp, MapPin, Search,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

import { Input } from '@/components/ui/input';
import DashboardSidebar from '@/components/DashboardSidebar';

const revenueData = [
  { month: 'Jan', revenue: 12000, bookings: 45 },
  { month: 'Feb', revenue: 18500, bookings: 62 },
  { month: 'Mar', revenue: 24000, bookings: 85 },
  { month: 'Apr', revenue: 21000, bookings: 78 },
  { month: 'May', revenue: 32000, bookings: 110 },
  { month: 'Jun', revenue: 38500, bookings: 125 },
  { month: 'Jul', revenue: 45000, bookings: 145 },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [salons, setSalons] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [b, s, c] = await Promise.all([
          db.entities.Booking.list('-created_date', 50),
          db.entities.Salon.list('-rating', 50),
          db.entities.Customer.list('-created_date', 50),
        ]);
        setBookings(b);
        setSalons(s);
        setCustomers(c);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);
  const totalCommission = Math.round(totalRevenue * 0.15);

  const filteredBookings = bookings.filter((b) => {
    const matchSearch = !search ||
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.salon_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.service_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const topSalons = [...salons].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);

  const stats = [
    { label: 'Platform Revenue', value: `AED ${totalRevenue.toLocaleString()}`, icon: DollarSign, change: '+12.5%' },
    { label: 'Commission (15%)', value: `AED ${totalCommission.toLocaleString()}`, icon: TrendingUp, change: '+15%' },
    { label: 'Active Salons', value: salons.length, icon: Store, change: '+5' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, change: '+8.2%' },
    { label: 'Customers', value: customers.length, icon: Users, change: '+15%' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-light">Platform Dashboard</h1>
          <p className="text-primary-foreground/60 mt-1">Admin overview · all salons, bookings & commission tracking</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                  <div className="flex items-start justify-between mb-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-heading font-semibold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-heading font-medium text-foreground">Revenue Overview</h2>
                  <p className="text-xs text-muted-foreground">Monthly revenue and booking trends</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(271 76% 63%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(271 76% 63%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 20% 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(270 10% 45%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(270 10% 45%)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0 0% 100%)',
                      border: '1px solid hsl(270 20% 88%)',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(271 76% 63%)" strokeWidth={2.5} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bookings Table */}
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border/40">
                <div className="p-6 border-b border-border/40">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-medium text-foreground">Recent Bookings</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search bookings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 rounded-md border border-input bg-card px-3 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/40 bg-secondary/30">
                        <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Customer</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Service</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden md:table-cell">Date</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Price</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.slice(0, 10).map((b) => (
                          <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-3">
                              <div className="text-sm font-medium text-foreground">{b.customer_name}</div>
                              <div className="text-xs text-muted-foreground">{b.salon_name}</div>
                            </td>
                            <td className="px-6 py-3 text-sm text-foreground/70">{b.service_name}</td>
                            <td className="px-6 py-3 text-sm text-muted-foreground hidden md:table-cell">
                              {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'} {b.booking_time}
                            </td>
                            <td className="px-6 py-3 text-sm font-medium text-foreground">AED {b.total_price}</td>
                            <td className="px-6 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[b.status]?.color || statusConfig.pending.color}`}>
                                {statusConfig[b.status]?.label || b.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground text-sm">
                            No bookings found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Salons */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                <h2 className="text-lg font-heading font-medium text-foreground mb-4">Top Salons</h2>
                <div className="space-y-3">
                  {topSalons.length > 0 ? topSalons.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <img
                        src={s.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100'}
                        alt={s.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {s.area}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-accent flex items-center gap-0.5 shrink-0">
                        {s.rating?.toFixed(1) || '4.8'}
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No salons yet</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}