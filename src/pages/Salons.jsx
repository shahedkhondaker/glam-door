const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, Home, Store } from 'lucide-react';

import SalonCard from '@/components/SalonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const areas = ['All Areas', 'Dubai Marina', 'Downtown Dubai', 'JLT', 'Jumeirah', 'Business Bay', 'Deira', 'Abu Dhabi', 'Sharjah', 'Ajman'];
const types = [
  { value: 'all', label: 'All Types' },
  { value: 'salon', label: 'Salons' },
  { value: 'home_based', label: 'Home-Based' },
  { value: 'beauty_clinic', label: 'Beauty Clinics' },
  { value: 'wellness_center', label: 'Wellness Centers' },
  { value: 'nail_studio', label: 'Nail Studios' },
];

export default function Salons() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadSalons = async () => {
      try {
        const data = await db.entities.Salon.list('-rating', 50);
        setSalons(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadSalons();
  }, []);

  const filtered = salons.filter((s) => {
    const matchSearch = !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.specialties?.some((sp) => sp.toLowerCase().includes(search.toLowerCase()));
    const matchArea = areaFilter === 'All Areas' || s.area === areaFilter;
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    return matchSearch && matchArea && matchType;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-light mb-4">
            Find Your <span className="italic text-accent">Beauty Expert</span>
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Browse premium salons and trusted home-based beauty professionals across the UAE.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="sticky top-20 z-30 bg-background/90 backdrop-blur-md border-b border-border/40 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search salons, services, specialties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-full border-border/60 bg-card"
            />
          </div>
          <Button
            variant="outline"
            className="md:hidden h-12 rounded-full px-6"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        {/* Type Filter Pills */}
        <div className={`max-w-7xl mx-auto px-6 lg:px-8 ${showFilters ? 'mt-4' : 'mt-3'} flex gap-2 overflow-x-auto pb-1`}>
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                typeFilter === t.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area Filter */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
        {areas.map((a) => (
          <button
            key={a}
            onClick={() => setAreaFilter(a)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-1 ${
              areaFilter === a
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {a !== 'All Areas' && <MapPin className="w-3 h-3" />}
            {a}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${filtered.length} salon${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading text-foreground mb-2">No salons found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}