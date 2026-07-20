const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import {
  Sparkles, Users, TrendingUp, DollarSign, Shield,
  Store, Home, ArrowRight, Star, Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const benefits = [
  { icon: Users, title: 'More Customers', text: 'We bring clients to your door — you focus on delivering exceptional service.' },
  { icon: DollarSign, title: 'Commission Based', text: 'Pay only when you earn. 10–20% commission on completed bookings — no upfront cost.' },
  { icon: TrendingUp, title: 'Grow Your Business', text: 'Online bookings, social media marketing, reviews, and analytics — all included.' },
  { icon: Shield, title: 'Trusted Platform', text: 'Join a verified network of premium salons and professionals across the UAE.' },
  { icon: Store, title: 'Digital Presence', text: 'Professional profile, Google Business Profile, WhatsApp Business integration.' },
  { icon: Zap, title: 'Instant Bookings', text: 'Clients book 24/7 with instant confirmation sent via WhatsApp.' },
];

const steps = [
  { num: '1', title: 'Register Your Business', text: 'Tell us about your salon or home-based beauty service. Free to join.' },
  { num: '2', title: 'Get Verified', text: 'Our team verifies your business and sets up your profile with services and pricing.' },
  { num: '3', title: 'Receive Bookings', text: 'Start receiving customer bookings with instant notifications via WhatsApp.' },
];

const areas = ['Dubai Marina', 'Downtown Dubai', 'JLT', 'JVC', 'Business Bay', 'Jumeirah', 'Deira', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Al Ain', 'Mussafah', 'Other'];

export default function Partner() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '', type: 'salon', area: 'Dubai Marina', phone: '', email: '',
    services: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      // Store as a salon record with subscription_plan = 'free' (pending verification)
      await db.entities.Salon.create({
        name: form.name,
        type: form.type,
        area: form.area,
        city: form.area.includes('Abu Dhabi') ? 'Abu Dhabi' : form.area.includes('Sharjah') ? 'Sharjah' : form.area.includes('Ajman') ? 'Ajman' : 'Dubai',
        description: form.message || `Beauty services in ${form.area}`,
        phone: form.phone,
        whatsapp: form.phone,
        is_featured: false,
        is_verified: false,
        commission_rate: form.type === 'home_based' ? 10 : 15,
        subscription_plan: 'free',
        specialties: form.services ? form.services.split(',').map((s) => s.trim()).filter(Boolean) : [],
        rating: 0,
        review_count: 0,
      });

      toast({
        title: 'Application Received!',
        description: 'Our team will contact you within 48 hours to verify your business.',
      });
      setForm({ name: '', type: 'salon', area: 'Dubai Marina', phone: '', email: '', services: '', message: '' });
    } catch (err) {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80"
            alt="Salon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Partner With GlamDoor</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-light text-shadow-lux mb-6">
            Grow Your Beauty<br /><span className="italic text-accent">Business With Us</span>
          </h1>
          <p className="text-lg text-white/80 text-shadow-lux max-w-xl mx-auto">
            Join 100+ salons and home-based beauty professionals across the UAE. We bring customers — you focus on service.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Why Join</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              Everything You Need to <span className="italic">Thrive</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 shadow-sm border border-border/40 hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary mb-5">
                  <b.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-medium text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              Get Started in <span className="italic">3 Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-heading font-semibold mb-5">
                  {s.num}
                </div>
                <h3 className="text-xl font-heading font-medium text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Join Now</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              Register Your <span className="italic">Business</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Free to join. No upfront cost. Commission only on completed bookings.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-sm border border-border/40 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Business Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Serenity Spa & Salon"
                className="h-11"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Business Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { value: 'salon', label: 'Salon', icon: Store },
                  { value: 'home_based', label: 'Home-Based', icon: Home },
                  { value: 'beauty_clinic', label: 'Beauty Clinic', icon: Sparkles },
                  { value: 'wellness_center', label: 'Wellness Center', icon: Shield },
                  { value: 'nail_studio', label: 'Nail Studio', icon: Star },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm({ ...form, type: t.value })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      form.type === t.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`}
                  >
                    <t.icon className="w-4 h-4" /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Area *</label>
              <select
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full h-11 rounded-md border border-input bg-card px-3 text-sm"
              >
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone / WhatsApp *</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+971 50 000 0000"
                  className="h-11"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Services (comma-separated)</label>
              <Input
                value={form.services}
                onChange={(e) => setForm({ ...form, services: e.target.value })}
                placeholder="e.g., Hair, Facial, Massage, Nails, Makeup"
                className="h-11"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">About Your Business</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your services, experience, and what makes your business special..."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
              {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to GlamDoor's partnership terms. Commission: 10–20% on completed bookings.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}