const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Clock, CalendarX, Plus, Trash2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const days = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

const defaultHours = {
  mon: { open: true, start: '09:00', end: '21:00' },
  tue: { open: true, start: '09:00', end: '21:00' },
  wed: { open: true, start: '09:00', end: '21:00' },
  thu: { open: true, start: '09:00', end: '21:00' },
  fri: { open: true, start: '09:00', end: '21:00' },
  sat: { open: true, start: '10:00', end: '20:00' },
  sun: { open: false, start: '10:00', end: '18:00' },
};

export default function AvailabilitySettings() {
  const { toast } = useToast();
  const [salon, setSalon] = useState(null);
  const [hours, setHours] = useState(defaultHours);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const salons = await db.entities.Salon.list('-rating', 1);
        if (salons.length > 0) {
          setSalon(salons[0]);
          if (salons[0].weekly_hours) {
            try { setHours(JSON.parse(salons[0].weekly_hours)); } catch (e) {}
          }
          if (salons[0].blocked_dates) setBlockedDates(salons[0].blocked_dates);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleDay = (key) => setHours({ ...hours, [key]: { ...hours[key], open: !hours[key].open } });
  const updateHours = (key, field, value) => setHours({ ...hours, [key]: { ...hours[key], [field]: value } });

  const addBlockedDate = () => {
    if (newDate && !blockedDates.includes(newDate)) {
      setBlockedDates([...blockedDates, newDate].sort());
      setNewDate('');
    }
  };

  const removeBlockedDate = (date) => setBlockedDates(blockedDates.filter((d) => d !== date));

  const handleSave = async () => {
    if (!salon) return;
    setSaving(true);
    try {
      await db.entities.Salon.update(salon.id, {
        weekly_hours: JSON.stringify(hours),
        blocked_dates: blockedDates,
      });
      toast({ title: 'Availability saved' });
    } catch (err) {
      toast({ title: 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-light">Salon Availability</h1>
            <p className="text-primary-foreground/60 mt-1">Set operating hours and block out holidays or vacations</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-heading font-medium">Weekly Operating Hours</h2>
          </div>
          <div className="space-y-3">
            {days.map((day) => (
              <div key={day.key} className="flex items-center gap-4 p-3 rounded-xl border border-border/40">
                <label className="flex items-center gap-3 w-32 shrink-0">
                  <input type="checkbox" checked={hours[day.key]?.open} onChange={() => toggleDay(day.key)} className="w-4 h-4" />
                  <span className="text-sm font-medium">{day.label}</span>
                </label>
                {hours[day.key]?.open ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input type="time" value={hours[day.key]?.start} onChange={(e) => updateHours(day.key, 'start', e.target.value)} className="h-9 w-28" />
                    <span className="text-muted-foreground text-sm">to</span>
                    <Input type="time" value={hours[day.key]?.end} onChange={(e) => updateHours(day.key, 'end', e.target.value)} className="h-9 w-28" />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40">
          <div className="flex items-center gap-2 mb-6">
            <CalendarX className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-heading font-medium">Blocked Dates</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="h-10 flex-1" />
            <Button onClick={addBlockedDate} variant="outline" className="rounded-full"><Plus className="w-4 h-4" /> Add</Button>
          </div>
          {blockedDates.length > 0 ? (
            <div className="space-y-2">
              {blockedDates.map((date) => (
                <div key={date} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                  <span className="text-sm font-medium">{new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => removeBlockedDate(date)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No blocked dates. Add holidays or vacation days above.</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-8">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}