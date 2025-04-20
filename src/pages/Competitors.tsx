import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CompetitorCard } from '@/components/dashboard/CompetitorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitorService } from '@/services/competitorService';
import { toast } from '@/hooks/use-toast';
import { Competitor } from '@/types/competitors';

const Competitors = () => {
  // ... keep existing code (state, queries, mutation setup)

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: competitors = [], isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => competitorService.getCompetitors(),
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['insights'],
    queryFn: () => competitorService.getInsights(),
  });

  const addCompetitorMutation = useMutation({
    mutationFn: (data: any) => competitorService.addCompetitor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Competitor added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add competitor",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      website: formData.get('website') as string,
      description: formData.get('description') as string,
      industryPositioning: formData.get('positioning') as string,
    };
    addCompetitorMutation.mutate(data);
  };

  // Navigate to competitor detail page
  const handleViewDetails = (competitorId: number) => {
    navigate(`/competitors/${competitorId}`);
  };

  // Filter competitors by search query
  const filteredCompetitors = competitors.filter(
    competitor => 
      competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.industryPositioning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count insights per competitor from last 60 days
  const getInsightCount = (competitorId: number) => {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    return insights.filter(
      insight => 
        insight.competitorId === competitorId && 
        new Date(insight.date) >= sixtyDaysAgo
    ).length;
  };

  return (
    // ... keep existing code (MainLayout and top section)
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitors</h1>
          <p className="text-muted-foreground">
            View and manage your tracked competitors
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Competitor</DialogTitle>
                <DialogDescription>
                  Enter details about the competitor you want to track
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Competitor Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Acme Inc." required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" name="website" placeholder="e.g. https://www.acme.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="positioning">Market Positioning</Label>
                  <Input id="positioning" name="positioning" placeholder="e.g. Enterprise SaaS" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Brief description of the competitor" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addCompetitorMutation.isPending}>
                  {addCompetitorMutation.isPending ? "Adding..." : "Add Competitor"}
                </Button>
              </DialogFooter>
            </form>
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

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[200px] rounded-lg border bg-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitors.map((competitor: Competitor) => (
            <CompetitorCard
              key={competitor.id}
              competitor={{
                ...competitor,
                logo: competitor.logo || '/placeholder.svg' // Ensure logo is provided
              }}
              insightCount={getInsightCount(competitor.id)}
            />
          ))}
        </div>
      )}

      {filteredCompetitors.length === 0 && !isLoading && (
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
