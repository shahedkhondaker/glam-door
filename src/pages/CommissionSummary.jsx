const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Percent, Wallet } from 'lucide-react';

export default function CommissionSummary() {
  const [bookings, setBookings] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const salons = await db.entities.Salon.list('-rating', 1);
        if (salons.length > 0) {
          setSalon(salons[0]);
          const bks = await db.entities.Booking.filter({ salon_id: salons[0].id, status: 'completed' });
          setBookings(bks);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const commissionRate = salon?.commission_rate || 15;
  const rows = bookings.map((b) => {
    const commission = Math.round((b.total_price || 0) * commissionRate / 100);
    const net = (b.total_price || 0) - commission;
    return { ...b, commission, net };
  });

  const grossRevenue = rows.reduce((s, r) => s + (r.total_price || 0), 0);
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0);
  const netRevenue = grossRevenue - totalCommission;

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-light">Commission Summary</h1>
          <p className="text-primary-foreground/60 mt-1">Revenue generated and platform commission fees per booking</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><DollarSign className="w-5 h-5 text-primary" /></div>
                <div className="text-2xl font-heading font-semibold">AED {grossRevenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Gross Revenue</div>
              </div>
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><Percent className="w-5 h-5 text-accent" /></div>
                <div className="text-2xl font-heading font-semibold">{commissionRate}%</div>
                <div className="text-xs text-muted-foreground">Commission Rate</div>
              </div>
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><Wallet className="w-5 h-5 text-destructive" /></div>
                <div className="text-2xl font-heading font-semibold">AED {totalCommission.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Commission Deducted</div>
              </div>
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><TrendingUp className="w-5 h-5 text-green-600" /></div>
                <div className="text-2xl font-heading font-semibold">AED {netRevenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Net Earnings</div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
              <div className="p-6 border-b border-border/40">
                <h2 className="text-lg font-heading font-medium">Per-Booking Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 bg-secondary/30">
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Customer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden md:table-cell">Service</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Date</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Revenue</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Commission</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length > 0 ? rows.map((r) => (
                      <tr key={r.id} className="border-b border-border/30 hover:bg-secondary/20">
                        <td className="px-6 py-3 text-sm font-medium text-foreground">{r.customer_name}</td>
                        <td className="px-6 py-3 text-sm text-muted-foreground hidden md:table-cell">{r.service_name}</td>
                        <td className="px-6 py-3 text-sm text-muted-foreground">{r.booking_date ? new Date(r.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}</td>
                        <td className="px-6 py-3 text-sm font-medium">AED {r.total_price}</td>
                        <td className="px-6 py-3 text-sm text-destructive">-AED {r.commission}</td>
                        <td className="px-6 py-3 text-sm font-medium text-green-600">AED {r.net}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" className="px-6 py-8 text-center text-muted-foreground text-sm">No completed bookings yet</td></tr>
                    )}
                  </tbody>
                  {rows.length > 0 && (
                    <tfoot>
                      <tr className="bg-secondary/30 font-medium">
                        <td className="px-6 py-3 text-sm" colSpan="3">Totals</td>
                        <td className="px-6 py-3 text-sm">AED {grossRevenue}</td>
                        <td className="px-6 py-3 text-sm text-destructive">AED {totalCommission}</td>
                        <td className="px-6 py-3 text-sm text-green-600">AED {netRevenue}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}