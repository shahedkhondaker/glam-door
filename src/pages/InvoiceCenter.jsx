const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { FileText, Download, DollarSign, TrendingUp, X, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const statusConfig = {
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800' },
};

export default function InvoiceCenter() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const salons = await db.entities.Salon.list('-rating', 1);
        if (salons.length > 0) {
          setSalon(salons[0]);
          const [inv, bks] = await Promise.all([
            db.entities.Invoice.list('-created_date', 50),
            db.entities.Booking.filter({ salon_id: salons[0].id, status: 'completed' }),
          ]);
          setInvoices(inv);
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

  const handleGenerate = async (booking) => {
    const commissionRate = salon.commission_rate || 15;
    const commission = Math.round(booking.total_price * commissionRate / 100);
    const net = booking.total_price - commission;
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const invNum = `INV-${Date.now().toString().slice(-6)}`;

    try {
      await db.entities.Invoice.create({
        invoice_number: invNum,
        booking_id: booking.id,
        customer_name: booking.customer_name,
        customer_phone: booking.customer_phone,
        salon_id: salon.id,
        salon_name: salon.name,
        service_name: booking.service_name,
        amount: booking.total_price,
        commission_rate: commissionRate,
        commission_amount: commission,
        net_amount: net,
        status: 'sent',
        issue_date: today,
        due_date: due,
      });
      toast({ title: 'Invoice generated', description: invNum });
      const inv = await db.entities.Invoice.list('-created_date', 50);
      setInvoices(inv);
      setShowGenerate(false);
    } catch (err) {
      toast({ title: 'Failed to generate invoice', variant: 'destructive' });
    }
  };

  const markPaid = async (id) => {
    try {
      await db.entities.Invoice.update(id, { status: 'paid' });
      setInvoices(invoices.map((i) => (i.id === id ? { ...i, status: 'paid' } : i)));
      toast({ title: 'Marked as paid' });
    } catch (err) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const totalBilled = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + (i.net_amount || 0), 0);
  const totalCommission = invoices.reduce((s, i) => s + (i.commission_amount || 0), 0);

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-light">Invoice Center</h1>
            <p className="text-primary-foreground/60 mt-1">Generate and track digital invoices</p>
          </div>
          <Button onClick={() => setShowGenerate(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <Send className="w-4 h-4" /> Generate Invoice
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><DollarSign className="w-5 h-5 text-primary" /></div>
                <div className="text-2xl font-heading font-semibold">AED {totalBilled.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Billed</div>
              </div>
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><TrendingUp className="w-5 h-5 text-green-600" /></div>
                <div className="text-2xl font-heading font-semibold">AED {totalPaid.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Net Collected</div>
              </div>
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><FileText className="w-5 h-5 text-accent" /></div>
                <div className="text-2xl font-heading font-semibold">AED {totalCommission.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Commission Deducted</div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
              <div className="p-6 border-b border-border/40">
                <h2 className="text-lg font-heading font-medium">Invoice History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 bg-secondary/30">
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Invoice #</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Customer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden md:table-cell">Service</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Amount</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 hidden md:table-cell">Net</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length > 0 ? invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/30 hover:bg-secondary/20">
                        <td className="px-6 py-3 text-sm font-medium text-foreground">{inv.invoice_number}</td>
                        <td className="px-6 py-3 text-sm text-foreground/70">{inv.customer_name}</td>
                        <td className="px-6 py-3 text-sm text-muted-foreground hidden md:table-cell">{inv.service_name}</td>
                        <td className="px-6 py-3 text-sm font-medium">AED {inv.amount}</td>
                        <td className="px-6 py-3 text-sm hidden md:table-cell">AED {inv.net_amount}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[inv.status]?.color}`}>{statusConfig[inv.status]?.label}</span>
                        </td>
                        <td className="px-6 py-3">
                          {inv.status !== 'paid' && (
                            <Button size="sm" variant="ghost" onClick={() => markPaid(inv.id)} className="text-xs">Mark Paid</Button>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="7" className="px-6 py-8 text-center text-muted-foreground text-sm">No invoices yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowGenerate(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="text-xl font-heading font-medium">Generate Invoice</h2>
              <button onClick={() => setShowGenerate(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">Select a completed booking to generate an invoice:</p>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:bg-secondary/30">
                      <div>
                        <div className="text-sm font-medium text-foreground">{b.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{b.service_name} · {b.booking_date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">AED {b.total_price}</span>
                        <Button size="sm" onClick={() => handleGenerate(b)} className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">Generate</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No completed bookings available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}