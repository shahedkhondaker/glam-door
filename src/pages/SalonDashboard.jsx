const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, DollarSign, Scissors, Star, Clock, Check, TrendingUp, Users, Sparkles,
  FileText, Award, BarChart3, Lightbulb, Bell, Percent, Ticket,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

import DashboardSidebar from '@/components/DashboardSidebar';

const managementTools = [
  { label: 'Services', path: '/service-management', icon: Scissors },
  { label: 'Invoices', path: '/invoice-center', icon: FileText },
  { label: 'Professionals', path: '/professional-profile', icon: Award },
  { label: 'Revenue Reports', path: '/revenue-reports', icon: BarChart3 },
  { label: 'Client CRM', path: '/crm-management', icon: Users },
  { label: 'AI Insights', path: '/ai-insights', icon: Lightbulb },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Commission', path: '/commission-summary', icon: Percent },
  { label: 'Availability', path: '/availability-settings', icon: Clock },
  { label: 'Promos', path: '/marketing-promos', icon: Ticket },
  { label: 'My Bookings', path: '/my-bookings', icon: Calendar },
];

const salonRevenueData = [
  { day: 'Mon', revenue: 1200, bookings: 4 },
  { day: 'Tue', revenue: 2100, bookings: 7 },
  { day: 'Wed', revenue: 1800, bookings: 6 },
  { day: 'Thu', revenue: 2600, bookings: 9 },
  { day: 'Fri', revenue: 3400, bookings: 12 },
  { day: 'Sat', revenue: 4200, bookings: 15 },
  { day: 'Sun', revenue: 2800, bookings: 8 },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-purple-100 text-purple-700' },
  confirmed: { label: 'Confirmed', color: 'bg-violet-100 text-violet-700' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700' },
};

export default function SalonDashboard() {
  const [bookings, setBookings] = useState([]);
  const [salons, setSalons] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, s, sv] = await Promise.all([
          db.entities.Booking.list('-created_date', 50),
          db.entities.Salon.list('-rating', 50),
          db.entities.Service.list('-created_date', 50),
        ]);
        setBookings(b);
        setSalons(s);
        setServices(sv);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Use first salon as "my salon"
  const mySalon = salons[0] || null;
  const myBookings = mySalon ? bookings.filter((b) => b.salon_id === mySalon.id) : bookings;
  const myServices = mySalon ? services.filter((s) => s.salon_id === mySalon.id) : services;

  const revenue = myBookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const todayBookings = myBookings.filter((b) => {
    const today = new Date().toISOString().split('T')[0];
    return b.booking_date === today;
  });

  const completedCount = myBookings.filter((b) => b.status === 'completed').length;
  const uniqueCustomers = new Set(myBookings.map((b) => b.customer_phone)).size;

  const stats = [
    { label: "Today's Bookings", value: todayBookings.length, icon: Calendar, color: 'text-violet-600' },
    { label: 'Revenue', value: `AED ${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600' },
    { label: 'Active Services', value: myServices.length, icon: Scissors, color: 'text-fuchsia-600' },
    { label: 'Avg Rating', value: mySalon?.rating?.toFixed(1) || '4.8', icon: Star, color: 'text-pink-600' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {mySalon && (
            <p className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-1">{mySalon.area} · {mySalon.city}</p>
          )}
          <h1 className="text-3xl md:text-4xl font-heading font-light">
            {mySalon?.name || 'Salon Dashboard'}
          </h1>
          <p className="text-primary-foreground/60 mt-1">Manage your bookings, services, and performance</p>
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
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                    <div className="flex items-start justify-between mb-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      {stat.label === 'Revenue' && (
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> +18%
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-heading font-semibold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-heading font-medium text-foreground">Weekly Revenue</h2>
                    <p className="text-xs text-muted-foreground">Last 7 days performance</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={salonRevenueData}>
                    <defs>
                      <linearGradient id="salonRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(271 76% 63%)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(271 76% 63%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 20% 90%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(270 10% 45%)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(270 10% 45%)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0 0% 100%)',
                        border: '1px solid hsl(270 20% 88%)',
                        borderRadius: '12px',
                        fontSize: '13px',
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(271 76% 63%)" strokeWidth={2.5} fill="url(#salonRevGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Services */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-medium text-foreground">My Services</h2>
                    <Scissors className="w-5 h-5 text-accent" />
                  </div>
                  <div className="space-y-3">
                    {myServices.length > 0 ? myServices.slice(0, 6).map((s) => (
                      <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                        {s.image_url && (
                          <img src={s.image_url} alt={s.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{s.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {s.duration_mins} min
                          </div>
                        </div>
                        <div className="text-sm font-medium text-primary shrink-0">AED {s.price}</div>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No services added yet</p>
                    )}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-medium text-foreground">Recent Bookings</h2>
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/40 bg-secondary/30">
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Service</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Date</th>
                          <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myBookings.length > 0 ? myBookings.slice(0, 8).map((b) => (
                          <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-foreground">{b.customer_name}</div>
                              <div className="text-xs text-muted-foreground">{b.customer_phone}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground/70">{b.service_name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                              {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'} {b.booking_time}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[b.status]?.color || statusConfig.pending.color}`}>
                                {statusConfig[b.status]?.label || b.status}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-muted-foreground text-sm">No bookings yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Customer Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-2xl p-6 shadow-sm">
                  <Users className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-3xl font-heading font-semibold">{uniqueCustomers}</div>
                  <div className="text-sm text-primary-foreground/70 mt-1">Unique Customers</div>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                  <Check className="w-8 h-8 mb-3 text-emerald-500" />
                  <div className="text-3xl font-heading font-semibold text-foreground">{completedCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Completed Services</div>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                  <Sparkles className="w-8 h-8 mb-3 text-accent" />
                  <div className="text-3xl font-heading font-semibold text-foreground">{mySalon?.subscription_plan?.toUpperCase() || 'FREE'}</div>
                  <div className="text-sm text-muted-foreground mt-1">Current Plan</div>
                </div>
              </div>

              {/* Management Tools */}
              <div>
                <h2 className="text-lg font-heading font-medium text-foreground mb-4">Management Tools</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {managementTools.map((tool) => (
                    <Link key={tool.path} to={tool.path} className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/40 hover:border-accent/40 hover:shadow-md transition-all">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary group-hover:bg-accent/10 transition-colors">
                        <tool.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                      </div>
                      <span className="text-xs font-medium text-center text-foreground/80">{tool.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}