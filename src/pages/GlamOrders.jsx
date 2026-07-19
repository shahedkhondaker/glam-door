const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

import { Button } from '@/components/ui/button';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
};

export default function GlamOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await db.entities.Order.list('-created_date', 20);
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 flex justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-heading font-light mb-4">No orders yet</h1>
        <p className="text-muted-foreground mb-8">Start shopping to see your order history here.</p>
        <Button asChild className="rounded-full bg-primary text-primary-foreground px-8">
          <Link to="/glamshop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading font-light mb-8">Order History</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-card rounded-xl p-6 border border-border/40">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
              <div>
                <div className="text-sm text-muted-foreground">{new Date(order.created_date).toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[order.status] || statusStyles.pending}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>AED {((item.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {order.shipping_address && (
              <div className="mt-3 pt-3 border-t border-border/40 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Ship to:</span> {order.shipping_address}
              </div>
            )}
            <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
              <span>Total</span><span>AED {(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}