const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, MapPin, Tag, DollarSign, Users } from 'lucide-react';

import { Input } from '@/components/ui/input';

export default function CRMManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await db.entities.Customer.list('-lifetime_value', 200);
        setCustomers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = customers.filter((c) =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.area?.toLowerCase().includes(search.toLowerCase()) ||
    c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const totalLTV = customers.reduce((s, c) => s + (c.lifetime_value || 0), 0);
  const totalBookings = customers.reduce((s, c) => s + (c.total_bookings || 0), 0);

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-light">Client CRM</h1>
          <p className="text-primary-foreground/60 mt-1">Manage your customer relationships and track lifetime value</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><Users className="w-5 h-5 text-primary" /></div>
            <div className="text-2xl font-heading font-semibold">{customers.length}</div>
            <div className="text-xs text-muted-foreground">Total Clients</div>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><DollarSign className="w-5 h-5 text-green-600" /></div>
            <div className="text-2xl font-heading font-semibold">AED {totalLTV.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Lifetime Value</div>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><Tag className="w-5 h-5 text-accent" /></div>
            <div className="text-2xl font-heading font-semibold">{totalBookings}</div>
            <div className="text-xs text-muted-foreground">Total Bookings</div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="p-6 border-b border-border/40">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, phone, email, area, or tag..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-secondary/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden md:table-cell">Contact</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden lg:table-cell">Area</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden md:table-cell">Tags</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Bookings</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">LTV</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length > 0 ? (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">{c.name?.charAt(0) || '?'}</div>
                          <div className="text-sm font-medium text-foreground">{c.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell">
                        <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone || '-'}</div>
                        {c.email && <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {c.email}</div>}
                      </td>
                      <td className="px-6 py-3 hidden lg:table-cell text-sm text-muted-foreground">
                        {c.area ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.area}</span> : '-'}
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {c.tags?.length > 0 ? c.tags.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">{t}</span>
                          )) : <span className="text-xs text-muted-foreground">-</span>}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground/70">{c.total_bookings || 0}</td>
                      <td className="px-6 py-3 text-sm font-medium text-primary">AED {(c.lifetime_value || 0).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-muted-foreground text-sm">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}