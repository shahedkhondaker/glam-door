import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Store } from 'lucide-react';

const dashboards = [
  { label: 'Main Dashboard', path: '/dashboard', icon: LayoutDashboard, desc: 'Platform overview' },
  { label: 'Customer View', path: '/dashboard/customer', icon: User, desc: 'My bookings & activity' },
  { label: 'Salon Partner', path: '/dashboard/salon', icon: Store, desc: 'Manage your salon' },
];

export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <>
      {/* Mobile tabs */}
      <div className="lg:hidden overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {dashboards.map((d) => {
            const active = location.pathname === d.path;
            return (
              <Link
                key={d.path}
                to={d.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground/70 border border-border/40'
                }`}
              >
                <d.icon className="w-4 h-4" />
                {d.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
            Dashboards
          </h3>
          {dashboards.map((d) => {
            const active = location.pathname === d.path;
            return (
              <Link
                key={d.path}
                to={d.path}
                className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-secondary text-foreground/70'
                }`}
              >
                <d.icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{d.label}</div>
                  <div className={`text-xs ${active ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    {d.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}