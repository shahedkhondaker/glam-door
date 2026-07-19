const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, Percent, Lightbulb, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';

export default function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ bookings: 0, revenue: 0, customers: 0, services: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [bks, custs, svcs] = await Promise.all([
          db.entities.Booking.list('-created_date', 100),
          db.entities.Customer.list('-created_date', 100),
          db.entities.Service.list('-created_date', 100),
        ]);
        const revenue = bks.filter((b) => b.status === 'completed').reduce((s, b) => s + (b.total_price || 0), 0);
        setStats({ bookings: bks.length, revenue, customers: custs.length, services: svcs.length });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const generate = async () => {
    setLoading(true);
    setInsights(null);
    try {
      const prompt = `You are a business growth consultant for a UAE-based beauty salon platform called GlamDoor. Based on the following dashboard data, provide actionable AI-powered growth insights as markdown.

Dashboard Data:
- Total bookings: ${stats.bookings}
- Completed revenue: AED ${stats.revenue}
- Total customers: ${stats.customers}
- Total services listed: ${stats.services}

Provide insights in these sections (use ## headings):
1. **Promotional Offers** — 2-3 specific promo campaign ideas with suggested discount ranges
2. **Footfall Improvement** — 2-3 strategies to increase bookings and customer visits
3. **Business Growth** — 2-3 strategic recommendations for scaling revenue
4. **Quick Wins** — 2-3 immediate actions to implement this week

Keep each point concise and specific to a UAE beauty salon context. Use bullet points within each section.`;

      const result = await db.integrations.Core.InvokeLLM({ prompt, model: 'gemini_3_flash' });
      setInsights(result);
    } catch (err) {
      setInsights('Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-light">AI Growth Insights</h1>
          <p className="text-primary-foreground/60 mt-1">Automated suggestions powered by your dashboard data</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Bookings', value: stats.bookings, icon: TrendingUp },
            { label: 'Revenue', value: `AED ${stats.revenue.toLocaleString()}`, icon: Percent },
            { label: 'Customers', value: stats.customers, icon: Users },
            { label: 'Services', value: stats.services, icon: Sparkles },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3"><s.icon className="w-5 h-5 text-primary" /></div>
              <div className="text-xl font-heading font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10"><Lightbulb className="w-6 h-6 text-accent" /></div>
              <div>
                <h2 className="text-lg font-heading font-medium">Growth Recommendations</h2>
                <p className="text-xs text-muted-foreground">AI-generated strategies based on your salon's performance</p>
              </div>
            </div>
            <Button onClick={generate} disabled={loading} className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> {insights ? 'Regenerate' : 'Generate Insights'}</>}
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-secondary border-t-accent rounded-full animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Analyzing your data...</p>
            </div>
          ) : insights ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{insights}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-16">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-1">Click "Generate Insights" to get AI-powered growth recommendations</p>
              <p className="text-xs text-muted-foreground">We'll analyze your bookings, revenue, and customer data to suggest actionable strategies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}