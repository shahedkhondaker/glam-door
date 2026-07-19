import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Calendar, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Salons', path: '/salons' },
  { label: 'GlamShop', path: '/glamshop' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Contact Us', path: '/contact-us' },
  { label: 'Partner With Us', path: '/partner' },
  { label: 'Dashboards', path: '/dashboard' },
];

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { count: cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/' || location.pathname === '/glamshop';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'glass shadow-sm border-b border-border/40'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              scrolled || !isHome ? 'bg-primary text-primary-foreground' : 'bg-white/20 backdrop-blur-sm text-white'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className={`text-2xl font-heading font-semibold tracking-wide transition-colors ${
              scrolled || !isHome ? 'text-primary' : 'text-white text-shadow-lux'
            }`}>
              GlamDoor
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors relative group ${
                  scrolled || !isHome
                    ? 'text-foreground/70 hover:text-primary'
                    : 'text-white/90 hover:text-white text-shadow-lux'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <button onClick={() => setCartOpen(true)} className="relative" aria-label="Cart">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                scrolled || !isHome ? 'bg-secondary text-primary' : 'bg-white/20 backdrop-blur-sm text-white'
              }`}>
                <ShoppingBag className="w-4 h-4" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <Button asChild size="sm" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-6 shadow-md">
              <Link to="/salons" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Book Now
              </Link>
            </Button>
          </div>

          <button
            className={`md:hidden ${scrolled || !isHome ? 'text-primary' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="md:hidden glass border-t border-border/40 animate-fade-in">
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-foreground/80 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <button onClick={() => { setMobileOpen(false); setCartOpen(true); }} className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                Cart
              </button>
              <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/salons">Book Now</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-2xl font-heading font-semibold">GlamDoor</span>
              </div>
              <p className="text-sm text-primary-foreground/70 leading-relaxed">
                UAE's trusted platform connecting customers with premium salons & home-based beauty professionals.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">Explore</h4>
              <ul className="space-y-3">
                <li><Link to="/salons" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Browse Salons</Link></li>
                <li><Link to="/about-us" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact-us" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/partner" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Partner With Us</Link></li>
                <li><Link to="/dashboard" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">Areas We Cover</h4>
              <ul className="space-y-3">
                <li className="text-sm text-primary-foreground/70">Dubai</li>
                <li className="text-sm text-primary-foreground/70">Abu Dhabi</li>
                <li className="text-sm text-primary-foreground/70">Sharjah</li>
                <li className="text-sm text-primary-foreground/70">Ajman & RAK</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">Get In Touch</h4>
              <ul className="space-y-3">
                <li className="text-sm text-primary-foreground/70">hello@glamdoor.ae</li>
                <li className="text-sm text-primary-foreground/70">+971 50 000 0000</li>
                <li className="text-sm text-primary-foreground/70">Business Bay, Dubai</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/50">© 2026 GlamDoor. All rights reserved.</p>
            <p className="text-sm text-primary-foreground/50">Where Beauty Meets Trust</p>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}