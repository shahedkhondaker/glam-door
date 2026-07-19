const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Zap, Shield, Star, Leaf, Award, ArrowLeft, Minus, Plus } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';

export default function GlamProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let found = null;
        try {
          const results = await db.entities.Product.filter({ slug });
          if (results.length > 0) found = results[0];
        } catch {}
        if (!found) {
          try {
            found = await db.entities.Product.get(slug);
          } catch {}
        }
        setProduct(found);
        if (found) {
          try {
            const all = await db.entities.Product.list('-created_date', 50);
            setRelated(all.filter(p => p.id !== found.id && p.category_id === found.category_id).slice(0, 4));
          } catch {}
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-muted rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-heading mb-4">Product not found</h1>
        <Button asChild><Link to="/glamshop">Back to Shop</Link></Button>
      </div>
    );
  }

  const onSale = product.compare_at_price && product.compare_at_price > product.price;
  const soldOut = (product.inventory ?? 1) <= 0;
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'];
  const discountPct = onSale ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) : 0;

  const handleAdd = () => {
    if (soldOut) return;
    addItem(product, quantity);
    toast({ title: 'Added to cart', description: `${quantity} × ${product.name}` });
  };

  const handleBuyNow = () => {
    if (soldOut) return;
    addItem(product, quantity);
    window.location.href = '/glamshop/checkout';
  };

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/glamshop" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30">
              <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category_name && (
              <span className="text-sm text-accent font-medium uppercase tracking-wide">{product.category_name}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-heading font-light text-foreground mt-1">{product.name}</h1>

            {product.rating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.review_count || 0} reviews)</span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-5">
              <span className="text-3xl font-heading font-semibold text-primary">AED {product.price}</span>
              {onSale && (
                <>
                  <span className="text-xl text-muted-foreground line-through">AED {product.compare_at_price}</span>
                  <span className="bg-accent/15 text-accent text-sm font-medium px-2.5 py-1 rounded-full">-{discountPct}%</span>
                </>
              )}
            </div>

            <p className="mt-5 text-muted-foreground leading-relaxed">{product.description}</p>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2.5 hover:bg-secondary rounded-l-full">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2.5 font-medium w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2.5 hover:bg-secondary rounded-r-full">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className={`text-sm ${soldOut ? 'text-destructive' : 'text-muted-foreground'}`}>
                {soldOut ? 'Out of stock' : `${product.inventory} in stock`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <Button onClick={handleAdd} disabled={soldOut} className="flex-1 rounded-full h-12 text-base">
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </Button>
              <Button onClick={handleBuyNow} disabled={soldOut} variant="secondary" className="flex-1 rounded-full h-12 text-base">
                <Zap className="w-5 h-5" /> Buy It Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border/40">
              <div className="text-center">
                <Shield className="w-6 h-6 text-accent mx-auto mb-1.5" />
                <div className="text-xs text-muted-foreground">GlamShield Verified</div>
              </div>
              <div className="text-center">
                <Leaf className="w-6 h-6 text-accent mx-auto mb-1.5" />
                <div className="text-xs text-muted-foreground">Cruelty-Free</div>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 text-accent mx-auto mb-1.5" />
                <div className="text-xs text-muted-foreground">Premium Quality</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-heading font-light mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}