import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, Home } from 'lucide-react';

const typeLabels = {
  salon: 'Salon',
  home_based: 'Home-Based',
  beauty_clinic: 'Beauty Clinic',
  wellness_center: 'Wellness Center',
  nail_studio: 'Nail Studio',
};

export default function SalonCard({ salon }) {
  return (
    <Link
      to={`/salons/${salon.id}`}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/40"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={salon.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'}
          alt={salon.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {salon.is_featured && (
            <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold shadow-md">
              Featured
            </span>
          )}
          {salon.type === 'home_based' && (
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 shadow-md">
              <Home className="w-3 h-3" /> Home-Based
            </span>
          )}
        </div>
        {salon.is_verified && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
            <BadgeCheck className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
            {salon.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-foreground">{salon.rating?.toFixed(1) || '4.8'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-sm">{salon.area}{salon.city ? `, ${salon.city}` : ''}</span>
        </div>

        {salon.specialties && salon.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {salon.specialties.slice(0, 3).map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">
                {s}
              </span>
            ))}
            {salon.specialties.length > 3 && (
              <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">
                +{salon.specialties.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}