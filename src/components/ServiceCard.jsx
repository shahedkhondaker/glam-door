import React from 'react';
import { Clock, Sparkles } from 'lucide-react';

const categoryLabels = {
  massage: 'Massage',
  facial: 'Facial',
  hair: 'Hair',
  nails: 'Nails',
  makeup: 'Makeup',
  spa: 'Spa',
  wellness: 'Wellness',
  beauty: 'Beauty',
};

export default function ServiceCard({ service, onBook, isSelected }) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
        isSelected
          ? 'border-accent bg-accent/5 shadow-sm'
          : 'border-border/40 bg-card hover:border-accent/40 hover:shadow-sm'
      }`}
    >
      {service.image_url && (
        <img
          src={service.image_url}
          alt={service.name}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-foreground leading-tight">{service.name}</h4>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-heading font-semibold text-primary">
              AED {service.price}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {service.duration_mins} min
            </span>
          </div>
          {onBook && (
            <button
              onClick={() => onBook(service)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
                isSelected
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isSelected ? 'Selected' : 'Book'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}