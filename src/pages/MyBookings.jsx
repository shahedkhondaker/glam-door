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