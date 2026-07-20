import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=80',
    badge: 'GlamShop — Premium Beauty',
    title: 'Discover Your New',
    titleAccent: 'Signature',
    subtitle: 'Curated skincare, makeup, haircare & tools — trusted by UAE\u2019s top salons.',
    cta: 'Shop Now',
  },
  {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80',
    badge: 'New Arrivals',
    title: 'Professional Grade',
    titleAccent: 'Beauty Tools',
    subtitle: 'Salon-quality tools delivered to your door across the UAE.',
    cta: 'Explore Tools',
  },
  {
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=80',
    badge: 'Bestsellers',
    title: 'Glow From',
    titleAccent: 'Within',
    subtitle: 'Skincare essentials loved by thousands. Free shipping over AED 200.',
    cta: 'Shop Skincare',
  },
];

export default function GlamShopHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[480px] md:h-[520px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={slides[index].image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium tracking-wide">{slides[index].badge}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-light text-shadow-lux leading-tight">
              {slides[index].title}
              <br />
              <span className="italic text-accent font-medium">{slides[index].titleAccent}</span>
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-xl text-shadow-lux">{slides[index].subtitle}</p>
            <a
              href="#products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12 font-medium glow-cta transition-all"
            >
              {slides[index].cta} <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  );
}