const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Clock, DollarSign, X, Scissors } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const categories = [
  { value: 'massage', label: 'Massage' },
  { value: 'facial', label: 'Facial' },
  { value: 'hair', label: 'Hair' },
  { value: 'nails', label: 'Nails' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'spa', label: 'Spa' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'beauty', label: 'Beauty' },
];

export default function ServiceManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [salonId, setSalonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'hair', description: '', duration_mins: 60, price: 0, image_url: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const salons = await db.entities.Salon.list('-rating', 1);
        if (salons.length > 0) {
          setSalonId(salons[0].id);
          const svc = await db.entities.Service.filter({ salon_id: salons[0].id });
          setServices(svc);
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
    if (!form.name || !form.price) {
      toast({ title: 'Name and price are required', variant: 'destructive' });
      return;
    }
    try {
      if (editing) {
        await db.entities.Service.update(editing.id, { ...form, duration_mins: Number(form.duration_mins), price: Number(form.price) });
        toast({ title: 'Service updated' });
      } else {
        await db.entities.Service.create({ ...form, salon_id: salonId, duration_mins: Number(form.duration_mins), price: Number(form.price) });
        toast({ title: 'Service added' });
      }
      const svc = await db.entities.Service.filter({ salon_id: salonId });
      setServices(svc);
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', category: 'hair', description: '', duration_mins: 60, price: 0, image_url: '' });
    } catch (err) {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
  };

  const handleEdit = (svc) => {
    setEditing(svc);
    setForm({ name: svc.name, category: svc.category, description: svc.description || '', duration_mins: svc.duration_mins || 60, price: svc.price, image_url: svc.image_url || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await db.entities.Service.delete(id);
      setServices(services.filter((s) => s.id !== id));
      toast({ title: 'Service removed' });
    } catch (err) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-light">Service Management</h1>
            <p className="text-primary-foreground/60 mt-1">Add, edit, and manage your service menu</p>
          </div>
          <Button onClick={() => { setEditing(null); setForm({ name: '', category: 'hair', description: '', duration_mins: 60, price: 0, image_url: '' }); setShowForm(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <Plus className="w-4 h-4" /> Add Service
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : !salonId ? (
          <div className="text-center py-20">
            <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Register your salon first to manage services.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.length > 0 ? services.map((svc) => (
              <div key={svc.id} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/40">
                <div className="h-32 overflow-hidden">
                  <img src={svc.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600'} alt={svc.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading text-lg font-medium text-foreground">{svc.name}</h3>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">{svc.category}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(svc)} className="p-2 rounded-lg hover:bg-secondary text-primary">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(svc.id)} className="p-2 rounded-lg hover:bg-secondary text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {svc.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{svc.description}</p>}
                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" /> {svc.duration_mins} mins
                    </div>
                    <div className="flex items-center gap-1 text-lg font-heading font-semibold text-primary">
                      <DollarSign className="w-4 h-4" />{svc.price}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20">
                <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No services yet. Add your first service to get started.</p>
                <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  <Plus className="w-4 h-4" /> Add Service
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="text-xl font-heading font-medium">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Service Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Deep Tissue Massage" className="h-11" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-11 rounded-md border border-input bg-card px-3 text-sm">
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price (AED) *</label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="250" className="h-11" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Duration (mins)</label>
                  <Input type="number" value={form.duration_mins} onChange={(e) => setForm({ ...form, duration_mins: e.target.value })} placeholder="60" className="h-11" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Image URL</label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="h-11" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the service..." rows={3} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-full">Cancel</Button>
                <Button type="submit" className="flex-1 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">{editing ? 'Save Changes' : 'Add Service'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}