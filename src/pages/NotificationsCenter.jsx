const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Bell, Check, Calendar, Clock, AlertCircle, Gift, MailOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const typeConfig = {
  booking: { icon: Calendar, color: 'text-blue-600 bg-blue-100' },
  reminder: { icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  alert: { icon: AlertCircle, color: 'text-red-600 bg-red-100' },
  promo: { icon: Gift, color: 'text-accent bg-accent/10' },
};

export default function NotificationsCenter() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await db.entities.Notification.list('-created_date', 50);
        setNotifications(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id) => {
    try {
      await db.entities.Notification.update(id, { is_read: true });
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (e) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    try {
      await db.entities.Notification.bulkUpdate(unread.map((n) => ({ id: n.id, is_read: true })));
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast({ title: 'All marked as read' });
    } catch (e) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-light">Notifications</h1>
            <p className="text-primary-foreground/60 mt-1">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'You\'re all caught up'}</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllRead} variant="outline" className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-white/10">
              <MailOpen className="w-4 h-4" /> Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'booking', 'reminder', 'alert', 'promo'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/40'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((n) => {
              const config = typeConfig[n.type] || typeConfig.booking;
              const Icon = config.icon;
              return (
                <div key={n.id} className={`bg-card rounded-2xl p-5 shadow-sm border border-border/40 flex gap-4 ${!n.is_read ? 'ring-1 ring-accent/30' : ''}`}>
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-foreground">{n.title}</h3>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      {new Date(n.created_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.is_read && (
                    <button onClick={() => markRead(n.id)} className="p-2 rounded-lg hover:bg-secondary shrink-0" title="Mark as read">
                      <Check className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications to show</p>
          </div>
        )}
      </div>
    </div>
  );
}