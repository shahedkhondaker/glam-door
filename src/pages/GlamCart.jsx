import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export default function GlamCart() {
  const { items, removeItem, updateQuantity, total, count } = useCart();

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-heading font-light mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Discover premium beauty products to add to your collection.</p>
        <Button asChild className="rounded-full bg-primary text-primary-foreground px-8">
          <Link to="/glamshop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  const shipping = total >= 200 ? 0 : 25;
  const grandTotal = total + shipping;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading font-light mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-card rounded-xl p-4 border border-border/40">
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300'}
                alt={product.name}
                className="w-24 h-24 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/glamshop/product/${product.slug || product.id}`} className="font-medium hover:text-primary line-clamp-2">
                  {product.name}
                </Link>
                <div className="text-primary font-heading font-semibold mt-1">AED {product.price}</div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-full">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-3 py-1.5 hover:bg-secondary rounded-l-full">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium w-10 text-center">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-3 py-1.5 hover:bg-secondary rounded-r-full">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(product.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-heading font-semibold">AED {(product.price * quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}
          <Link to="/glamshop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl p-6 border border-border/40 h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-heading mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>AED {total.toFixed(2)}</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? <span className="text-accent font-medium">Free</span> : `AED ${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground pt-1">Add AED {(200 - total).toFixed(2)} more for free shipping</p>
            )}
            <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-base">
              <span>Total</span><span>AED {grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <Button asChild className="w-full mt-6 rounded-full h-11">
            <Link to="/glamshop/checkout" className="flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-center">
            <Shield className="w-4 h-4 text-accent" /> Secure checkout — GlamShield protected
          </div>
        </div>
      </div>
    </div>
  );
}