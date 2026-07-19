import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Heart, Shield, Users, Award, Globe, ArrowRight,
  Star, Calendar, Check, MapPin, TrendingUp, HandHeart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const values = [
  { icon: Heart, title: 'Authentic Trust', text: 'Every salon and professional is verified. We connect you only with beauty experts you can rely on.' },
  { icon: Shield, title: 'Quality First', text: 'We curate premium experiences — from luxury salons to trusted home-based professionals across the UAE.' },
  { icon: Users, title: 'Community Driven', text: 'We empower local beauty businesses to grow while giving customers effortless access to the best talent.' },
  { icon: Sparkles, title: 'Effortless Luxury', text: 'Booking beauty should feel as good as the experience itself. Simple, seamless, and elegant — every time.' },
];

const milestones = [
  { year: '2024', title: 'The Idea', text: 'GlamDoor was born from a simple frustration: finding trusted beauty professionals in the UAE was harder than it should be.' },
  { year: '2025', title: 'Early Growth', text: 'We onboarded our first 50 salon partners across Dubai and Abu Dhabi, building a curated marketplace.' },
  { year: '2026', title: 'Nationwide Coverage', text: 'Today we connect thousands of customers with salons, spas, and home-based professionals across the entire UAE.' },
];

const stats = [
  { value: '100+', label: 'Partner Salons' },
  { value: '50+', label: 'Home Professionals' },
  { value: '15K+', label: 'Happy Customers' },
  { value: '4.9★', label: 'Average Rating' },
];

const team = [
  { name: 'Layla Al Mansoori', role: 'Founder & CEO', initial: 'L' },
  { name: 'Priya Sharma', role: 'Head of Partnerships', initial: 'P' },
  { name: 'Ahmed Hassan', role: 'Chief Technology Officer', initial: 'A' },
  { name: 'Sara Khoury', role: 'Customer Experience Lead', initial: 'S' },
];

export default function AboutUs() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-heading font-light text-shadow-lux mb-6">
            Beauty Meets <span className="italic text-accent">Trust</span>
          </h1>
          <p className="text-lg text-white/80 text-shadow-lux max-w-2xl mx-auto leading-relaxed">
            GlamDoor is the UAE's premier beauty marketplace — connecting discerning clients with premium salons, spas, and trusted home-based beauty professionals.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-heading font-semibold text-accent">{s.value}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Our Mission</p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground mb-6">
            Making Beauty <span className="italic">Effortless</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe finding the right beauty professional should be as luxurious as the experience itself. GlamDoor brings together a curated community of vetted salons and home-based artists, giving every customer instant access to trusted talent — wherever they are in the UAE.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Our Values</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              What We <span className="italic">Stand For</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 shadow-sm border border-border/40 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-5">
                  <v.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-medium text-foreground mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              From Idea to <span className="italic">Nationwide</span>
            </h2>
          </div>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-semibold shrink-0">{m.year.slice(-2)}</div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-8">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">{m.year}</span>
                  <h3 className="text-xl font-heading font-medium text-foreground mt-1 mb-2">{m.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Our Team</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
              The People Behind <span className="italic">GlamDoor</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground text-3xl font-heading font-semibold flex items-center justify-center mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="font-heading text-lg font-medium text-foreground">{member.name}</h3>
                <p className="text-sm text-accent">{member.role}</p>
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
          <h2 className="text-4xl md:text-5xl font-heading font-light text-shadow-lux mb-6">
            Join the <span className="italic text-accent">GlamDoor</span> Family
          </h2>
          <p className="text-lg text-white/80 mb-8 text-shadow-lux max-w-xl mx-auto">
            Whether you're a customer seeking beauty or a professional ready to grow — we'd love to have you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-14 text-base shadow-xl">
              <Link to="/salons" className="flex items-center gap-2">Find Your Salon <ArrowRight className="w-5 h-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white px-8 h-14 text-base">
              <Link to="/contact-us">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}