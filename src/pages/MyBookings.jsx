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
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === 'upcoming' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === 'past' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Past
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No {tab} appointments found
          </div>
        ) : (
          <div className="grid gap-4">
            {displayed.map((booking) => {
              const StatusIcon = statusConfig[booking.status]?.icon || AlertCircle;
              return (
                <div
                  key={booking.id}
                  className="bg-card rounded-lg p-6 shadow-sm border border-border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.service_name || 'Service'}</h3>
                      <p className="text-muted-foreground">{booking.salon_name || 'Salon'}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[booking.status]?.color || 'text-gray-600 bg-gray-100'}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig[booking.status]?.label || booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.booking_date || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.booking_time || 'TBD'}</span>
                    </div>
                    {booking.professional_name && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.professional_name}</span>
                      </div>
                    )}
                    {booking.is_home_service && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Home Service</span>
                      </div>
                    )}
                  </div>
                  
                  {booking.total_price && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="font-semibold">Total: AED {booking.total_price}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}