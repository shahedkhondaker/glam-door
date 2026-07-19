const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendOrderNotifications } from '@/lib/notifications';

export default function GlamCheckout() {
  const { items, total, clearCart, count } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', emirate: 'Dubai',
  });

  const shipping = total >= 200 ? 0 : 25;
  const grandTotal = total + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await db.entities.Order.create({
        items: items.map(i => ({
          product_id: i.product.id,
          product_name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        total: grandTotal,
        status: 'pending',
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: `${form.address}, ${form.city}, ${form.emirate}`,
      });

      await sendOrderNotifications({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        items: items.map(i => ({ product_name: i.product.name, quantity: i.quantity, price: i.product.price })),
        total: grandTotal,
        shipping_address: `${form.address}, ${form.city}, ${form.emirate}`,
      });

      clearCart();
      toast({ title: 'Order placed!', description: 'Confirmation sent to your email & WhatsApp.' });
      navigate('/glamshop/account/orders');
    } catch (err) {
      toast({ title: 'Checkout failed', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <Button asChild><Link to="/glamshop">Shop Now</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/glamshop/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      <h1 className="text-3xl font-heading font-light mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Shipping */}
          <div className="bg-card rounded-xl p-6 border border-border/40">
            <h2 className="text-lg font-heading mb-4">Shipping Information</h2>
            <div className="grid gap-4">
              <div>
                <Label className="mb-1.5 block">Full Name</Label>
                <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Email</Label>
                  <Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Phone</Label>
                  <Input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+971 50 123 4567" />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Address</Label>
                <Input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, building, apartment" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">City / Area</Label>
                  <Input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Dubai Marina" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Emirate</Label>
                  <Input required value={form.emirate} onChange={e => setForm({ ...form, emirate: e.target.value })} placeholder="Dubai" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-xl p-6 border border-border/40">
            <h2 className="text-lg font-heading mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h2>
            <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-primary bg-primary/5">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Credit / Debit Card</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Payment processing will be connected in the next phase. This is a demo checkout.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl p-6 border border-border/40 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg font-heading mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm gap-3">
                <span className="text-muted-foreground line-clamp-1">{product.name} × {quantity}</span>
                <span className="shrink-0">AED {(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>AED {total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : `AED ${shipping}`}</span></div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t"><span>Total</span><span>AED {grandTotal.toFixed(2)}</span></div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full mt-6 rounded-full h-12 text-base">
            {submitting ? 'Placing Order...' : 'Place Order'}
          </Button>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-center">
            <Shield className="w-4 h-4 text-accent" /> Secure checkout — GlamShield protected
          </div>
        </div>
      </form>
    </div>
  );
}