
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CompetitorCard } from '@/components/dashboard/CompetitorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { mockCompetitors, mockInsights } from '@/data/mockData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Competitors = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter competitors by search query
  const filteredCompetitors = mockCompetitors.filter(
    competitor => 
      competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.industryPositioning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count insights per competitor
  const getInsightCount = (competitorId: number) => {
    // Count insights from last 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    return mockInsights.filter(
      insight => 
        insight.competitorId === competitorId && 
        new Date(insight.date) >= sixtyDaysAgo
    ).length;
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitors</h1>
          <p className="text-muted-foreground">
            View and manage your tracked competitors
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Competitor</DialogTitle>
              <DialogDescription>
                Enter details about the competitor you want to track
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Competitor Name</Label>
                <Input id="name" placeholder="e.g. Acme Inc." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" placeholder="e.g. https://www.acme.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="positioning">Market Positioning</Label>
                <Input id="positioning" placeholder="e.g. Enterprise SaaS" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Brief description of the competitor" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Competitor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex w-full max-w-sm items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search competitors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCompetitors.map(competitor => (
          <CompetitorCard
            key={competitor.id}
            competitor={competitor}
            insightCount={getInsightCount(competitor.id)}
          />
        ))}
      </div>

      {filteredCompetitors.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No competitors found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or add a new competitor
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default Competitors;
