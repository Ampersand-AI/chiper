
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  LineChart,
  Settings,
  Building,
  FileText,
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Competitors', icon: Building, path: '/competitors' },
  { name: 'Reports', icon: FileText, path: '/reports' },
  { name: 'Scraper', icon: LineChart, path: '/scraper' },
  { name: 'Alerts', icon: BarChart, path: '/alerts' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r shadow-sm transition-transform duration-200 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary animate-pulse-slow"></div>
              <span className="text-lg font-semibold">CompetitivePulse</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "nav-link",
                      location.pathname === item.path && "nav-link-active"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent"></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Demo User</span>
                <span className="text-xs text-muted-foreground">demo@competitivepulse.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
