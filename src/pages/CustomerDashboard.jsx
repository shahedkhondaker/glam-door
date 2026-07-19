const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Heart, Wallet, Clock, MapPin, Star,
  TrendingUp, ArrowRight, Sparkles,
} from 'lucide-react';

import DashboardSidebar from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-purple-100 text-purple-700' },
  confirmed: { label: 'Confirmed', color: 'bg-violet-100 text-violet-700' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700' },
};

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, s] = await Promise.all([
          db.entities.Booking.list('-created_date', 50),
          db.entities.Salon.list('-rating', 50),
        ]);
        setBookings(b);
        setSalons(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const upcoming = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));
  const history = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const favoriteSalons = [...salons].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-violet-600' },
    { label: 'Total Spent', value: `AED ${totalSpent.toLocaleString()}`, icon: Wallet, color: 'text-purple-600' },
    { label: 'Completed', value: completedCount, icon: Sparkles, color: 'text-fuchsia-600' },
    { label: 'Favorite Salons', value: salons.length, icon: Heart, color: 'text-pink-600' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-light">My Dashboard</h1>
          <p className="text-primary-foreground/60 mt-1">Your bookings, spending, and favorite beauty spots</p>
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
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-heading font-semibold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-medium text-foreground">Upcoming Appointments</h2>
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div className="space-y-3">
                    {upcoming.length > 0 ? upcoming.slice(0, 5).map((b) => (
                      <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/30">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit' }) : '--'}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB', { month: 'short' }) : ''}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{b.service_name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {b.salon_name} · {b.booking_time}
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusConfig[b.status]?.color || statusConfig.pending.color}`}>
                          {statusConfig[b.status]?.label || b.status}
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No upcoming appointments</p>
                    )}
                  </div>
                  <Button asChild variant="outline" className="w-full mt-4 rounded-full">
                    <Link to="/salons" className="flex items-center justify-center gap-2">
                      Book New Appointment <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                {/* Favorite Salons */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-medium text-foreground">Favorite Salons</h2>
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div className="space-y-3">
                    {favoriteSalons.map((s) => (
                      <Link key={s.id} to={`/salons/${s.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                        <img
                          src={s.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100'}
                          alt={s.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{s.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {s.area}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-accent flex items-center gap-0.5 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-accent" /> {s.rating?.toFixed(1) || '4.8'}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-medium text-foreground">Booking History</h2>
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/40 bg-secondary/30">
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Service</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Salon</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Date</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Price</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.length > 0 ? history.slice(0, 10).map((b) => (
                        <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{b.service_name}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{b.salon_name}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                            {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'} {b.booking_time}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">AED {b.total_price}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[b.status]?.color || statusConfig.pending.color}`}>
                              {statusConfig[b.status]?.label || b.status}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground text-sm">No booking history yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}