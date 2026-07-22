const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, CheckCircle, XCircle, AlertCircle, CalendarCheck } from 'lucide-react';

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
          <p className="mt-2 text-primary-foreground/70">Manage your upcoming and past salon bookings.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="inline-flex rounded-full bg-secondary p-1 mb-8">
          {[
            { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { key: 'past', label: `Past (${past.length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <CalendarCheck className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-heading font-light mb-2">
              No {tab} appointments
            </h2>
            <p className="text-muted-foreground">
              {tab === 'upcoming'
                ? 'Book a service to see your appointments here.'
                : 'Your completed and cancelled appointments will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {displayed.map((b) => {
              const cfg = statusConfig[b.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={b.id}
                  className="bg-card rounded-2xl p-6 border border-border/40 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                    <span className="text-xl font-semibold leading-none">
                      {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit' }) : '--'}
                    </span>
                    <span className="text-xs uppercase tracking-wide">
                      {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB', { month: 'short' }) : ''}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-foreground truncate">{b.service_name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {b.salon_name}
                        {b.area ? ` · ${b.area}` : ''}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {b.booking_time || 'TBD'}
                      </span>
                      {b.total_price != null && (
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          AED {Number(b.total_price).toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                    {b.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3.5 h-3.5" /> Leave a review
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
