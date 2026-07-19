const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Ticket, Percent, DollarSign, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function MarketingPromos() {
  const { toast } = useToast();
  const [promos, setPromos] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', description: '', discount_type: 'percentage', discount_value: 15, service_name: '', valid_from: '', valid_until: '', usage_limit: 50 });

  useEffect(() => {
    const load = async () => {
      try {
        const salons = await db.entities.Salon.list('-rating', 1);
        if (salons.length > 0) {
          setSalon(salons[0]);
          const data = await db.entities.Promo.list('-created_date', 50);
          setPromos(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discount_value) {
      toast({ title: 'Code and discount value are required', variant: 'destructive' });
      return;
    }
    try {
      await db.entities.Promo.create({
        ...form,
        salon_id: salon.id,
        salon_name: salon.name,
        discount_value: Number(form.discount_value),
        usage_limit: Number(form.usage_limit) || 50,
        times_used: 0,
        is_active: true,
      });
      toast({ title: 'Promo code created' });
      const data = await db.entities.Promo.list('-created_date', 50);
      setPromos(data);
      setShowForm(false);
      setForm({ code: '', description: '', discount_type: 'percentage', discount_value: 15, service_name: '', valid_from: '', valid_until: '', usage_limit: 50 });
    } catch (err) {
      toast({ title: 'Failed to create promo', variant: 'destructive' });
    }
  };

  const toggleActive = async (promo) => {
    try {
      await db.entities.Promo.update(promo.id, { is_active: !promo.is_active });
      setPromos(promos.map((p) => (p.id === promo.id ? { ...p, is_active: !p.is_active } : p)));
    } catch (e) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await db.entities.Promo.delete(id);
      setPromos(promos.filter((p) => p.id !== id));
      toast({ title: 'Promo deleted' });
    } catch (e) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-light">Marketing Promos</h1>
            <p className="text-primary-foreground/60 mt-1">Create promotional codes and discounts to attract customers</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <Plus className="w-4 h-4" /> Create Promo
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : promos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {promos.map((promo) => (
              <div key={promo.id} className={`bg-card rounded-2xl p-6 shadow-sm border border-border/40 ${!promo.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10">
                    <Ticket className="w-6 h-6 text-accent" />
                  </div>
                  <button onClick={() => toggleActive(promo)} className="text-muted-foreground hover:text-primary">
                    {promo.is_active ? <ToggleRight className="w-7 h-7 text-green-600" /> : <ToggleLeft className="w-7 h-7" />}
                  </button>
                </div>
                <div className="text-2xl font-heading font-bold text-primary tracking-wider mb-1">{promo.code}</div>
                {promo.description && <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>}
                <div className="flex items-center gap-2 mb-3">
                  {promo.discount_type === 'percentage' ? (
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold flex items-center gap-1">
                      <Percent className="w-3 h-3" /> {promo.discount_value}% OFF
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> AED {promo.discount_value} OFF
                    </span>
                  )}
                </div>
                {promo.service_name && <p className="text-xs text-muted-foreground mb-2">Applies to: {promo.service_name}</p>}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  {promo.valid_from && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {promo.valid_from}</span>}
                  {promo.valid_until && <span>→ {promo.valid_until}</span>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">{promo.times_used || 0}/{promo.usage_limit || '∞'} used</span>
                  <button onClick={() => handleDelete(promo.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No promo codes yet. Create one to start attracting new customers.</p>
            <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
              <Plus className="w-4 h-4" /> Create Promo
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="text-xl font-heading font-medium">Create Promo Code</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Promo Code *</label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER25" className="h-11 uppercase" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Summer special — 25% off all facials" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Discount Type</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="w-full h-11 rounded-md border border-input bg-card px-3 text-sm">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Discount Value *</label>
                  <Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder="25" className="h-11" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Applies To (Service)</label>
                <Input value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} placeholder="All services or specific name" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Valid From</label>
                  <Input type="date" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} className="h-11" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Valid Until</label>
                  <Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className="h-11" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Usage Limit</label>
                <Input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} placeholder="50" className="h-11" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-full">Cancel</Button>
                <Button type="submit" className="flex-1 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">Create Promo</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}