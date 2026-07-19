const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ShoppingBag, Sparkles, ChevronDown } from 'lucide-react';

import ProductCard from '@/components/ProductCard';
import GlamShopHero from '@/components/GlamShopHero';
import RadialShowcase from '@/components/RadialShowcase';
import { Button } from '@/components/ui/button';

const fallbackCategories = [
  { name: 'Skincare', slug: 'skincare' },
  { name: 'Makeup', slug: 'makeup' },
  { name: 'Haircare', slug: 'haircare' },
  { name: 'Tools', slug: 'tools' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: 'low', label: 'Under AED 150' },
  { value: 'mid', label: 'AED 150 – 300' },
  { value: 'high', label: 'Over AED 300' },
];

export default function GlamShop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          db.entities.Product.list('-created_date', 50),
          db.entities.Category.list(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (e) {
        console.error('Failed to load shop data', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const bestsellers = useMemo(
    () => products.filter(p => p.tags?.includes('bestseller')).slice(0, 6),
    [products]
  );

  const filtered = useMemo(() => {
    let result = selectedCategory
      ? products.filter(p => p.category_id === selectedCategory)
      : [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.category_name?.toLowerCase().includes(q)
      );
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange === 'low' ? [0, 150] : priceRange === 'mid' ? [150, 300] : [300, Infinity];
      result = result.filter(p => p.price >= min && (max === Infinity || p.price < max));
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'bestselling': result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0)); break;
    }
    return result;
  }, [products, selectedCategory, search, sortBy, priceRange]);

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory(null);
    setPriceRange('all');
    setSortBy('featured');
  };

  return (
    <div className="bg-background">
      <GlamShopHero />

      {/* Trust Bar */}
      <section className="bg-primary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-center">
          <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" /> 100% Authentic</span>
          <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-accent" /> Free Shipping Over AED 200</span>
          <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" /> GlamShield Verified</span>
        </div>
      </section>

      {/* Radial Bestsellers Showcase */}
      {bestsellers.length > 0 && <RadialShowcase products={bestsellers} title="Bestsellers" />}

      {/* Category Navigation */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-6 px-6 md:justify-center scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                !selectedCategory ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
            >
              All Products
            </button>
            {displayCategories.map(cat => (
              <button
                key={cat.id || cat.slug}
                onClick={() => setSelectedCategory(cat.id || null)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === (cat.id || null) ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid with Filters */}
      <section id="products" className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter/Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 h-11 rounded-full border text-sm font-medium transition-colors ${
                  showFilters ? 'bg-primary text-primary-foreground border-primary' : 'border-input bg-card hover:bg-secondary'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="h-11 pl-4 pr-10 rounded-full border border-input bg-card text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Price filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <p className="text-sm font-medium mb-3">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map(range => (
                      <button
                        key={range.value}
                        onClick={() => setPriceRange(range.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          priceRange === range.value ? 'bg-accent text-accent-foreground' : 'bg-card hover:bg-secondary border border-border/40'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
            </p>
            {(search || selectedCategory || priceRange !== 'all' || sortBy !== 'featured') && (
              <button onClick={clearFilters} className="text-sm text-accent hover:underline">
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-xl" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                    <div className="h-9 bg-muted rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No products match your filters.</p>
              <Button variant="outline" className="rounded-full" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}