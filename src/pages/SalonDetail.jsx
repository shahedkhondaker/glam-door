const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, MapPin, BadgeCheck, Phone, MessageCircle, Clock, Calendar,
  Check, ArrowLeft, Sparkles, Home,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ServiceCard from '@/components/ServiceCard';
import { sendBookingNotifications } from '@/lib/notifications';

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

const typeLabels = {
  salon: 'Salon', home_based: 'Home-Based Professional', beauty_clinic: 'Beauty Clinic',
  wellness_center: 'Wellness Center', nail_studio: 'Nail Studio',
};

export default function SalonDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [booking, setBooking] = useState({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await db.entities.Salon.get(id);
        setSalon(s);
        const svc = await db.entities.Service.filter({ salon_id: id });
        setServices(svc);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedService || !booking.name || !booking.phone || !booking.date || !booking.time) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await db.entities.Booking.create({
        customer_name: booking.name,
        customer_phone: booking.phone,
        customer_email: booking.email,
        salon_id: id,
        salon_name: salon.name,
        service_name: selectedService.name,
        booking_date: booking.date,
        booking_time: booking.time,
        status: 'confirmed',
        total_price: selectedService.price,
        notes: booking.notes,
        area: salon.area,
      });

      // Also create/update customer record
      try {
        await db.entities.Customer.create({
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          area: salon.area,
          total_bookings: 1,
          lifetime_value: selectedService.price,
          tags: [],
        });
      } catch (e) {
        // customer might already exist
      }

      const notif = await sendBookingNotifications({
        customer_name: booking.name,
        customer_phone: booking.phone,
        customer_email: booking.email,
        salon_name: salon.name,
        service_name: selectedService.name,
        booking_date: booking.date,
        booking_time: booking.time,
        total_price: selectedService.price,
      });
      setConfirmation({
        salonName: salon.name,
        service: selectedService.name,
        date: booking.date,
        time: booking.time,
        emailSent: notif.email,
        whatsappLink: notif.whatsappLink,
      });
      toast({ title: 'Booking Confirmed!', description: `Your appointment at ${salon.name} is confirmed.` });
      setSelectedService(null);
      setBooking({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
    } catch (err) {
      toast({ title: 'Booking failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-foreground mb-4">Salon not found</h2>
          <Button asChild><Link to="/salons">Back to Salons</Link></Button>
        </div>
      </div>
    );
  }

  const whatsappLink = salon.whatsapp
    ? `https://wa.me/${salon.whatsapp.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <div className="min-h-screen pt-20">
      {/* Cover */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={salon.cover_image_url || salon.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600'}
          alt={salon.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto text-white">
            <Link to="/salons" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Salons
            </Link>
            <div className="flex items-center gap-3 mb-3">
              {salon.type === 'home_based' && (
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold flex items-center gap-1">
                  <Home className="w-3 h-3" /> Home-Based
                </span>
              )}
              {salon.is_verified && (
                <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              )}
              {salon.is_featured && (
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-light text-shadow-lux">{salon.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-white/80">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{salon.rating?.toFixed(1) || '4.8'}</span>
                <span className="text-sm">({salon.review_count || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4" /> {salon.area}{salon.city ? `, ${salon.city}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-2xl font-heading font-medium text-foreground mb-4">About</h2>
              <p className="text-foreground/70 leading-relaxed">{salon.description || 'A premium beauty destination offering exceptional services with a focus on quality, comfort, and client satisfaction.'}</p>
              {salon.specialties && salon.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {salon.specialties.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">{s}</span>
                  ))}
                </div>
              )}
            </section>

            {/* Services */}
            <section>
              <h2 className="text-2xl font-heading font-medium text-foreground mb-4">Services & Pricing</h2>
              {services.length > 0 ? (
                <div className="space-y-3">
                  {services.map((svc) => (
                    <ServiceCard
                      key={svc.id}
                      service={svc}
                      onBook={setSelectedService}
                      isSelected={selectedService?.id === svc.id}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Services are being added. Please contact the salon directly.</p>
              )}
            </section>
          </div>

          {/* Sidebar — Contact + Booking */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40 sticky top-24">
              <h3 className="font-heading text-lg font-medium text-foreground mb-4">Contact</h3>
              <div className="space-y-3">
                {salon.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/70">{salon.address}</span>
                  </div>
                )}
                {salon.phone && (
                  <a href={`tel:${salon.phone}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary">
                    <Phone className="w-4 h-4 text-accent" /> {salon.phone}
                  </a>
                )}
              </div>
              {whatsappLink !== '#' && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#1da851] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              )}
            </div>

            {/* Booking Form */}
            <div id="booking" className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="font-heading text-lg font-medium text-foreground mb-1">Book Appointment</h3>
              <p className="text-xs text-muted-foreground mb-4">
                {selectedService ? `Selected: ${selectedService.name} — AED ${selectedService.price}` : 'Select a service above to begin'}
              </p>

              <form onSubmit={handleBook} className="space-y-3">
                <Input
                  placeholder="Full Name *"
                  value={booking.name}
                  onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                  className="h-11"
                  required
                />
                <Input
                  placeholder="Phone Number *"
                  value={booking.phone}
                  onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  className="h-11"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={booking.email}
                  onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                  className="h-11"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="h-11"
                    required
                  />
                  <select
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    className="h-11 rounded-md border border-input bg-card px-3 text-sm"
                    required
                  >
                    <option value="">Time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <Textarea
                  placeholder="Notes (optional)"
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  className="resize-none"
                  rows={2}
                />
                <Button
                  type="submit"
                  disabled={submitting || !selectedService}
                  className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground h-12"
                >
                  {submitting ? 'Booking...' : `Confirm Booking${selectedService ? ` — AED ${selectedService.price}` : ''}`}
                </Button>
              </form>
            </div>

            {confirmation && (
              <div className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-2xl p-6 border border-accent/30 animate-scale-in">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-accent" />
                  <h3 className="font-heading text-lg font-medium text-foreground">Booking Confirmed</h3>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                  <p className="font-medium text-foreground">{confirmation.salonName}</p>
                  <p>{confirmation.service}</p>
                  <p>{confirmation.date} at {confirmation.time}</p>
                  {confirmation.emailSent && <p className="text-accent flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Confirmation email sent</p>}
                </div>
                {confirmation.whatsappLink && (
                  <a
                    href={confirmation.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#1da851] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Send WhatsApp Confirmation
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}