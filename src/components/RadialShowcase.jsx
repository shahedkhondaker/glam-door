import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function RadialShowcase({ products = [], title = 'Bestsellers' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(i => (i + 1) % products.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) return null;
  const active = products[activeIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> {title}
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground">
            Trending <span className="italic text-accent">Now</span>
          </h2>
        </div>

        <div className="relative h-[440px] flex items-center justify-center">
          {/* Rotating ring with product thumbnails */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[360px] h-[360px] md:w-[400px] md:h-[400px] rounded-full border-2 border-dashed border-primary/15"
          >
            {products.map((p, i) => {
              const angle = (i / products.length) * 360;
              const rad = (angle * Math.PI) / 180;
              const radius = 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              return (
                <motion.div
                  key={p.id}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-1/2 left-1/2"
                  style={{ x, y, marginLeft: -22, marginTop: -22 }}
                >
                  <motion.div
                    animate={{
                      scale: i === activeIndex ? 1.35 : 1,
                      opacity: i === activeIndex ? 1 : 0.45,
                    }}
                    transition={{ duration: 0.5 }}
                    className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer"
                    onClick={() => setActiveIndex(i)}
                  >
                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Glow behind center */}
          <div className="absolute w-56 h-56 rounded-full bg-accent/10 blur-3xl" />

          {/* Center active product */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.id}
              initial={{ opacity: 0, scale: 0.4, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.4, filter: 'blur(20px)' }}
              transition={{ duration: 0.6 }}
              className="text-center z-10"
            >
              <Link to={`/glamshop/product/${active.slug || active.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-44 h-44 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-2xl mx-auto mb-4 ring-4 ring-accent/20"
                >
                  <img src={active.images?.[0]} alt={active.name} className="w-full h-full object-cover" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-heading font-medium text-foreground">{active.name}</h3>
                <div className="text-primary font-heading font-semibold text-lg mt-1">AED {active.price}</div>
                <div className="inline-flex items-center gap-1 text-sm text-accent mt-2 font-medium">
                  View Product <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-accent' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}