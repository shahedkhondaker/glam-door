const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Star, MapPin, ArrowRight, Check, Shield, Users, Scissors,
  Calendar, Heart, Award, Zap, Search, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import SalonCard from '@/components/SalonCard';
import GlamDoorEmblem from '@/components/GlamDoorEmblem';

const serviceCategories = [
  { name: 'Massage', icon: Heart, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600' },
  { name: 'Facial', icon: Sparkles, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600' },
  { name: 'Hair', icon: Scissors, image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600' },
  { name: 'Nails', icon: Award, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600' },
  { name: 'Makeup', icon: Star, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600' },
  { name: 'Spa', icon: Heart, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600' },
  { name: 'Wellness', icon: Shield, image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600' },
  { name: 'Beauty', icon: Sparkles, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600' },
];

const steps = [
  { icon: Search, title: 'Discover', text: 'Browse premium salons and trusted home-based beauty professionals near you across the UAE.' },
  { icon: Calendar, title: 'Book', text: 'Choose your service, pick a time, and book instantly — confirmation sent via WhatsApp.' },
  { icon: Heart, title: 'Relax', text: 'Show up and enjoy. Leave reviews, earn loyalty, and discover your go-to beauty experts.' },
];

const areas = ['Dubai Marina', 'Downtown Dubai', 'JLT', 'Jumeirah', 'Business Bay', 'Deira', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Al Ain', 'Mussafah'];

const pricingPlans = [
  {
    name: 'Free Listing', price: '0', period: 'always',
    features: ['Basic salon profile', 'Appear in search results', 'Customer reviews', 'WhatsApp inquiries'],
    highlighted: false,
  },
  {
    name: 'Growth', price: '299', period: 'month',
    features: ['Everything in Free', 'Online booking system', 'Featured placement', 'Business dashboard', 'Social media marketing', '5% commission on bookings'],
    highlighted: true,
  },
  {
    name: 'Premium', price: '799', period: 'month',
    features: ['Everything in Growth', 'Priority listing', 'AI business insights', 'Inventory management', 'Staff scheduling', '10% commission on bookings'],
    highlighted: false,
  },
];

const testimonials = [
  { name: 'Aisha M.', area: 'Dubai Marina', text: 'Found an incredible home-based nail artist through GlamDoor. The booking was instant and the service was impeccable!', rating: 5 },
  { name: 'Fatima K.', area: 'Abu Dhabi', text: 'As a salon owner, GlamDoor transformed my business. Bookings doubled in 3 months and the dashboard makes management effortless.', rating: 5 },
  { name: 'Sara R.', area: 'Sharjah', text: 'Finally a platform that connects me with trusted beauty professionals nearby. The reviews make it so easy to choose.', rating: 5 },
];

export default function Home() {
  const [featuredSalons, setFeaturedSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSalons = async () => {
      try {
        const salons = await db.entities.Salon.list('-rating', 4);
        setFeaturedSalons(salons);
      } catch (e) {
        console.error('Failed to load salons', e);
      } finally {
        setLoading(false);
      }
    };
    loadSalons();
  }, []);

  return (
    <div className="smooth-scroll">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80"
            alt="Luxury spa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/45 to-[#f5efe8]" />
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 pt-24">
          <div className="animate-scale-in">
            <GlamDoorEmblem size={300} />
          </div>

          <h1 className="mt-10 text-4xl md:text-6xl font-heading font-light text-white text-shadow-lux text-center leading-tight animate-fade-in-up">
            Where Beauty<br />Meets <span className="italic text-accent font-medium">Trust</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-white/80 max-w-xl mx-auto text-center text-shadow-lux animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover premium salons, spas, and trusted home-based beauty professionals across the UAE. Book your next moment of bliss — instantly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-14 text-base shadow-xl">
              <Link to="/salons" className="flex items-center gap-2">
                Book an Appointment <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white px-8 h-14 text-base">
              <Link to="/partner">Partner With Us</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <ChevronRight className="w-6 h-6 text-white/50 rotate-90" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '100+', label: 'Partner Salons' },
            { value: '50+', label: 'Home Professionals' },
            { value: 'All UAE', label: 'Areas Covered' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-heading font-semibold text-accent">{stat.value}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Our Services</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              A World of Beauty, <span className="italic">At Your Door</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From organic spa treatments to advanced beauty services — explore our exquisite menu curated for the discerning client.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {serviceCategories.map((cat, i) => (
              <Link
                key={i}
                to="/salons"
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <cat.icon className="w-6 h-6 text-accent mb-2" />
                  <h3 className="text-xl font-heading text-white">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Featured Partners</p>
              <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
                Discover <span className="italic">Excellence</span>
              </h2>
            </div>
            <Link to="/salons" className="hidden md:flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredSalons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSalons.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Salons are being onboarded. Check back soon!</p>
            </div>
          )}

          <div className="md:hidden mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/salons">View All Salons</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              Three Steps to <span className="italic">Bliss</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6 group-hover:bg-accent/10 transition-colors duration-500">
                  <step.icon className="w-9 h-9 text-primary group-hover:text-accent transition-colors duration-500" />
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-heading font-medium text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Coverage</p>
          <h2 className="text-4xl md:text-5xl font-heading font-light mb-12">
            Across the <span className="italic text-accent">Entire UAE</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {areas.map((area, i) => (
              <span key={i} className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-default">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Partner Pricing</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              Plans That <span className="italic">Grow With You</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From free listings to full-featured premium — or simply pay commission on completed bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground shadow-2xl md:-translate-y-4 border-2 border-accent'
                    : 'bg-card border border-border/40 shadow-sm hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-2xl font-heading font-medium ${plan.highlighted ? 'text-accent' : 'text-foreground'}`}>{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-heading font-semibold">AED {plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? 'text-accent' : 'text-primary'}`} />
                      <span className={plan.highlighted ? 'text-primary-foreground/80' : 'text-foreground/80'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full rounded-full ${
                    plan.highlighted
                      ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                >
                  <Link to="/partner">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-muted-foreground">
            Or choose <span className="font-semibold text-foreground">10–20% commission</span> on completed bookings — no upfront cost.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              Loved by <span className="italic">Clients & Partners</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 shadow-sm border border-border/40">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t.area}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-heading font-light text-shadow-lux mb-6">
            Ready to <span className="italic text-accent">Glow?</span>
          </h2>
          <p className="text-lg text-white/80 mb-8 text-shadow-lux max-w-xl mx-auto">
            Book your next beauty experience with GlamDoor — trusted, effortless, luxurious.
          </p>
          <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-10 h-14 text-base shadow-xl">
            <Link to="/salons" className="flex items-center gap-2">
              Find Your Salon <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}