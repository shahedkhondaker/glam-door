const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Star, Award, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function ProfessionalProfile() {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', specialization: '', area: '', bio: '', rating: 5, experience_years: 1, image_url: '', whatsapp: '', is_home_based: false });

  useEffect(() => {
    const load = async () => {
      try {
        const salons = await db.entities.Salon.list('-rating', 1);
        if (salons.length > 0) {
          setSalon(salons[0]);
          const profs = await db.entities.Professional.filter({ salon_id: salons[0].id });
          setProfessionals(profs);
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
    if (!form.name || !form.specialization) {
      toast({ title: 'Name and specialization are required', variant: 'destructive' });
      return;
    }
    try {
      const payload = { ...form, rating: Number(form.rating), experience_years: Number(form.experience_years), salon_id: salon.id };
      if (editing) {
        await db.entities.Professional.update(editing.id, payload);
        toast({ title: 'Profile updated' });
      } else {
        await db.entities.Professional.create(payload);
        toast({ title: 'Professional added' });
      }
      const profs = await db.entities.Professional.filter({ salon_id: salon.id });
      setProfessionals(profs);
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', specialization: '', area: '', bio: '', rating: 5, experience_years: 1, image_url: '', whatsapp: '', is_home_based: false });
    } catch (err) {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
  };

  const handleEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, specialization: p.specialization, area: p.area || '', bio: p.bio || '', rating: p.rating || 5, experience_years: p.experience_years || 1, image_url: p.image_url || '', whatsapp: p.whatsapp || '', is_home_based: p.is_home_based || false });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await db.entities.Professional.delete(id);
      setProfessionals(professionals.filter((p) => p.id !== id));
      toast({ title: 'Profile removed' });
    } catch (err) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-light">Professional Profiles</h1>
            <p className="text-primary-foreground/60 mt-1">Manage your beauty professionals and their expertise</p>
          </div>
          <Button onClick={() => { setEditing(null); setForm({ name: '', specialization: '', area: '', bio: '', rating: 5, experience_years: 1, image_url: '', whatsapp: '', is_home_based: false }); setShowForm(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <Plus className="w-4 h-4" /> Add Professional
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {professionals.length > 0 ? professionals.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/40">
                <div className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <img src={p.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=hsl(271,52%,28%)&color=fff&size=128`} alt={p.name} className="w-20 h-20 rounded-full object-cover mx-auto" />
                    {p.is_home_based && <span className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground rounded-full p-1.5"><Home className="w-3 h-3" /></span>}
                  </div>
                  <h3 className="font-heading text-lg font-medium text-foreground">{p.name}</h3>
                  <p className="text-sm text-accent font-medium">{p.specialization}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{p.rating?.toFixed(1) || '5.0'}</span>
                    <span className="text-xs text-muted-foreground">· {p.experience_years || 1} yrs exp</span>
                  </div>
                  {p.bio && <p className="text-sm text-muted-foreground mt-3 text-left line-clamp-3">{p.bio}</p>}
                  {p.area && <p className="text-xs text-muted-foreground mt-2">{p.area}</p>}
                </div>
                <div className="flex border-t border-border/40">
                  <button onClick={() => handleEdit(p)} className="flex-1 py-3 text-sm font-medium text-primary hover:bg-secondary flex items-center justify-center gap-1.5">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 py-3 text-sm font-medium text-destructive hover:bg-secondary flex items-center justify-center gap-1.5 border-l border-border/40">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No professionals yet. Add your first team member.</p>
                <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  <Plus className="w-4 h-4" /> Add Professional
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
              <h2 className="text-xl font-heading font-medium">{editing ? 'Edit Professional' : 'Add Professional'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Maria Santos" className="h-11" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Specialization *</label>
                <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g., Senior Hair Stylist" className="h-11" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Experience (years)</label>
                  <Input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} className="h-11" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Rating</label>
                  <Input type="number" step="0.1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="h-11" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Area</label>
                <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Dubai Marina" className="h-11" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">WhatsApp</label>
                <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+971 50 000 0000" className="h-11" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Image URL</label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="h-11" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Bio</label>
                <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell clients about your expertise..." rows={3} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_home_based} onChange={(e) => setForm({ ...form, is_home_based: e.target.checked })} className="w-4 h-4" />
                Home-based professional
              </label>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-full">Cancel</Button>
                <Button type="submit" className="flex-1 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">{editing ? 'Save Changes' : 'Add Professional'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}