const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', icon: AlertCircle, color: 'text-yellow-600 bg-yellow-100' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600 bg-blue-100' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-100' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await db.entities.Booking.list('-booking_date', 50);
        setBookings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = bookings.filter((b) => b.booking_date >= today && b.status !== 'cancelled' && b.status !== 'completed');
  const past = bookings.filter((b) => b.booking_date < today || b.status === 'completed' || b.status === 'cancelled');
  const displayed = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-light">My Appointments</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTab('upcoming')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${tab === 'upcoming' ? 'bg-accent text-accent-foreground' : 'bg-card text-foreground'}`}>
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setTab('past')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${tab === 'past' ? 'bg-accent text-accent-foreground' : 'bg-card text-foreground'}`}>
              Past
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground">Loading bookings…</div>
        ) : displayed.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground">No bookings found.</div>
        ) : (
          <div className="grid gap-6">
            {displayed.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              const Icon = status.icon;

              return (
                <div key={booking.id || booking.booking_id} className="rounded-3xl bg-card p-6 shadow-sm border border-border/50">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-2 text-sm font-medium text-muted-foreground">{booking.salon_name || 'Salon'}</div>
                      <h2 className="text-xl font-semibold text-foreground">{booking.service_name || 'Service'}</h2>
                    </div>
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${status.color}`}>
                      <Icon className="h-4 w-4" />
                      {status.label}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-muted/5 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Date</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{booking.booking_date}</div>
                    </div>
                    <div className="rounded-2xl bg-muted/5 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Time</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{booking.booking_time}</div>
                    </div>
                    <div className="rounded-2xl bg-muted/5 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Customer</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{booking.customer_name || booking.customer || 'N/A'}</div>
                    </div>
                    <div className="rounded-2xl bg-muted/5 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{booking.customer_phone || '—'}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
