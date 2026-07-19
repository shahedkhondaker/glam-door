const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'hello@glamdoor.ae', sub: 'We reply within 24 hours' },
  { icon: Phone, label: 'Call Us', value: '+971 50 000 0000', sub: 'Sun–Thu, 9am–6pm GST' },
  { icon: MapPin, label: 'Visit Us', value: 'Business Bay, Dubai', sub: 'UAE' },
  { icon: Clock, label: 'Office Hours', value: '9:00 AM – 6:00 PM', sub: 'Sunday to Thursday' },
];

const reasons = [
  { title: 'Customer Support', text: 'Booking issues, account questions, or general inquiries — our team is here to help.' },
  { title: 'Partnership Enquiries', text: 'Want to list your salon or join as a beauty professional? Let us talk growth.' },
  { title: 'Feedback & Ideas', text: 'We love hearing how we can improve. Your input shapes the future of GlamDoor.' },
];

export default function ContactUs() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await db.integrations.Core.InvokeLLM({
        prompt: `A website visitor submitted a contact form. Create a brief, professional summary of their inquiry for the GlamDoor team.\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject || 'General Inquiry'}\nMessage: ${form.message}\n\nSummary:`,
      });
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast({ title: 'Message sent!', description: 'We will get back to you soon.' });
    } catch (err) {
      toast({ title: 'Failed to send message', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">We're Here to Help</p>
          <h1 className="text-4xl md:text-6xl font-heading font-light text-shadow-lux mb-6">
            Get in <span className="italic text-accent">Touch</span>
          </h1>
          <p className="text-lg text-white/80 text-shadow-lux max-w-2xl mx-auto leading-relaxed">
            Questions, feedback, or partnership ideas? Our team would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((c, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-sm border border-border/40 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
                  <c.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">{c.label}</h3>
                <p className="text-lg font-heading font-medium text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-medium text-foreground">Send Us a Message</h2>
                  <p className="text-sm text-muted-foreground">Fill out the form and we'll respond shortly</p>
                </div>
              </div>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-heading font-medium text-foreground mb-2">Thank You!</h3>
                  <p className="text-muted-foreground mb-6">Your message has been received. We'll get back to you within 24 hours.</p>
                  <Button onClick={() => setSent(false)} variant="outline" className="rounded-full">Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Name *</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="h-11" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email *</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="h-11" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Subject</label>
                    <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" className="h-11" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Message *</label>
                    <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." rows={5} required />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground h-12">
                    {submitting ? <><span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                  </Button>
                </form>
              )}
            </div>

            {/* Info Side */}
            <div className="space-y-6">
              <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-heading font-light mb-4">Why Reach Out?</h2>
                <div className="space-y-4">
                  {reasons.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-accent text-sm">{item.title}</h3>
                        <p className="text-sm text-primary-foreground/70 mt-0.5">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-sm border border-border/40 h-64">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=55.16%2C25.17%2C55.22%2C25.21&layer=mapnik"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  title="GlamDoor Location"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}