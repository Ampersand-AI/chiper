
import React from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <Sidebar />
      <main className={cn(
        "flex-1 ml-0 md:ml-64 min-h-screen p-4 md:p-6",
        className
      )}>
        {children}
      </main>
      <Toaster />
    </div>
  );
}
