
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownUp, Calendar, CirclePause, Code, Database, Eye, Globe, Key, Link2, Play, Plus, RefreshCw, Search, Server, Settings, Trash } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitorService } from '@/services/competitorService';
import { ScraperService } from '@/services/scraperService';
import { toast } from '@/hooks/use-toast';
import { ApiSource, Insight, InsightAnalysis, InsightReport } from '@/types/competitors';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'error':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return '';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'patents':
      return 'bg-blue-100 text-blue-800';
    case 'news':
      return 'bg-amber-100 text-amber-800';
    case 'jobs':
      return 'bg-green-100 text-green-800';
    case 'social':
      return 'bg-purple-100 text-purple-800';
    case 'company':
      return 'bg-slate-100 text-slate-800';
    case 'pr':
      return 'bg-rose-100 text-rose-800';
    case 'financial':
      return 'bg-emerald-100 text-emerald-800';
    case 'opensource':
      return 'bg-orange-100 text-orange-800';
    case 'crypto':
      return 'bg-violet-100 text-violet-800';
    case 'economic':
      return 'bg-cyan-100 text-cyan-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'patents':
      return <Database className="h-4 w-4" />;
    case 'news':
      return <Globe className="h-4 w-4" />;
    case 'jobs':
      return <Server className="h-4 w-4" />;
    case 'social':
      return <Link2 className="h-4 w-4" />;
    case 'pr':
      return <Globe className="h-4 w-4" />;
    case 'opensource':
      return <Code className="h-4 w-4" />;
    default:
      return <Database className="h-4 w-4" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'website':
      return '🌐';
    case 'linkedin':
      return '👥';
    case 'news':
      return '📰';
    case 'jobs':
      return '💼';
    default:
      return '📄';
  }
};

const Scraper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApiDetailsOpen, setIsApiDetailsOpen] = useState(false);
  const [isRunScraperOpen, setIsRunScraperOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedApiSource, setSelectedApiSource] = useState<ApiSource | null>(null);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('sources');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scrapedInsights, setScrapedInsights] = useState<Insight[]>([]);
  const [insightAnalysis, setInsightAnalysis] = useState<InsightAnalysis | null>(null);
  const [insightReport, setInsightReport] = useState<InsightReport | null>(null);
  const queryClient = useQueryClient();

  // Get API configuration on component mount
  const [apiConfig, setApiConfig] = useState<{openrouterKey?: string, newsApiKey?: string}>({});
  
  useEffect(() => {
    const loadConfig = async () => {
      const config = await ScraperService.getConfig();
      setApiConfig({
        openrouterKey: config.openrouterKey,
        newsApiKey: config.newsApiKey
      });
    };
    loadConfig();
  }, []);

  const { data: competitors = [], isLoading: isLoadingCompetitors } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => competitorService.getCompetitors(),
  });

  const { data: scrapeTargets = [], isLoading: isLoadingScrapeTargets } = useQuery({
    queryKey: ['scrapeTargets'],
    queryFn: () => competitorService.getScrapeTargets(),
  });

  const { data: apiSources = [], isLoading: isLoadingApiSources } = useQuery({
    queryKey: ['apiSources', selectedCategory],
    queryFn: () => competitorService.getApiSources(selectedCategory),
  });

  const addScrapeTargetMutation = useMutation({
    mutationFn: (data: any) => competitorService.addScrapeTarget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scrapeTargets'] });
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Scrape target added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add scrape target",
        variant: "destructive",
      });
    },
  });

  const toggleScrapeTargetMutation = useMutation({
    mutationFn: (id: number) => competitorService.toggleScrapeTarget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scrapeTargets'] });
      toast({
        title: "Status Updated",
        description: "Target status has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update target status",
        variant: "destructive",
      });
    },
  });

  const deleteScrapeTargetMutation = useMutation({
    mutationFn: (id: number) => competitorService.deleteScrapeTarget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scrapeTargets'] });
      toast({
        title: "Success",
        description: "Scrape target deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete target",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      competitorId: Number(formData.get('competitor')),
      type: formData.get('source-type') as 'website' | 'linkedin' | 'news' | 'jobs',
      url: formData.get('url') as string,
      frequency: formData.get('frequency') as 'daily' | 'weekly' | 'monthly',
    };
    addScrapeTargetMutation.mutate(data);
  };

  const showApiDetails = (api: ApiSource) => {
    setSelectedApiSource(api);
    setIsApiDetailsOpen(true);
  };

  const openRunScraperDialog = (api: ApiSource) => {
    setSelectedApiSource(api);
    setIsRunScraperOpen(true);
  };

  const runScraper = async () => {
    if (!selectedApiSource || !selectedCompetitorId) {
      toast({
        title: "Cannot Run Scraper",
        description: "Please select both an API source and a competitor",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const competitor = competitors.find(c => c.id === selectedCompetitorId);
      if (!competitor) {
        throw new Error("Selected competitor not found");
      }

      const insights = await ScraperService.runScraper(
        selectedApiSource,
        selectedCompetitorId,
        competitor.name
      );

      setScrapedInsights(insights);
      
      // Add insights to database
      for (const insight of insights) {
        await competitorService.addInsight(insight);
      }

      // Generate analysis after scraping
      if (insights.length > 0) {
        const analysis = await ScraperService.analyzeInsights(insights, competitor.name);
        if (analysis) {
          setInsightAnalysis(analysis);
          
          // Generate report
          const report = await ScraperService.generateReport(analysis, insights, competitor.name, selectedCompetitorId);
          if (report) {
            setInsightReport(report);
            await competitorService.addInsightReport(report);
            setActiveTab('results');
          }
        }
      }

      toast({
        title: "Scraper Completed",
        description: `Generated ${insights.length} insights for ${competitor.name}`,
      });
      
      // Close the dialog and show results
      setIsRunScraperOpen(false);
    } catch (error) {
      toast({
        title: "Scraper Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateScraperCode = async () => {
    if (!selectedCompetitorId) {
      toast({
        title: "Cannot Generate Scraper",
        description: "Please select a competitor",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const competitor = competitors.find(c => c.id === selectedCompetitorId);
      if (!competitor) {
        throw new Error("Selected competitor not found");
      }

      const scraperCode = await ScraperService.generateCustomScraper(
        competitor.website,
        competitor.name
      );

      if (scraperCode) {
        // Associate the scraper code with the competitor
        const codeWithCompetitor = {
          ...scraperCode,
          competitorId: selectedCompetitorId
        };
        
        await competitorService.addScraperCode(codeWithCompetitor);

        toast({
          title: "Custom Scraper Generated",
          description: `Created new scraper for ${competitor.name} using DeepSeek Coder AI`,
        });
        
        // Close the dialog
        setIsGenerateReportOpen(false);
      }
    } catch (error) {
      toast({
        title: "Scraper Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredScrapeTargets = scrapeTargets.filter(target => {
    const matchesSearch =
      target.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompetitor =
      selectedCompetitor === 'all' || target.competitorId === Number(selectedCompetitor);
    return matchesSearch && matchesCompetitor;
  });

  const filteredApiSources = apiSources.filter(api => 
    searchQuery ? api.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const needsApiKey = !apiConfig.openrouterKey;

  // Check if there are any competitors
  const hasCompetitors = competitors && competitors.length > 0;

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scraper Manager – Competitive Intelligence Data Sources</h1>
          <p className="text-muted-foreground">
            Configure and monitor your automated data collection across multiple public APIs
          </p>
        </div>
        <div className="flex gap-2">
          {needsApiKey && (
            <Button variant="outline" className="flex items-center gap-1" onClick={() => window.location.href = "/settings"}>
              <Key className="h-4 w-4" />
              <span>Setup API Keys</span>
            </Button>
          )}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Source</DialogTitle>
                  <DialogDescription>
                    Configure a new source to scrape for competitor intelligence
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="competitor">Competitor</Label>
                    <Select name="competitor" required>
                      <SelectTrigger id="competitor">
                        <SelectValue placeholder="Select competitor" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-background">
                        {competitors.map(competitor => (
                          <SelectItem key={competitor.id} value={competitor.id.toString()}>
                            {competitor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="source-type">Source Type</Label>
                    <Select name="source-type" required>
                      <SelectTrigger id="source-type">
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-background">
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="jobs">Job Boards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="url">URL</Label>
                    <Input id="url" name="url" placeholder="https://example.com/page-to-scrape" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Scraping Frequency</Label>
                    <Select name="frequency" defaultValue="daily">
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-background">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addScrapeTargetMutation.isPending}>
                    {addScrapeTargetMutation.isPending ? "Adding..." : "Add Source"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!hasCompetitors && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Competitors Available</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                You need to add competitors before you can set up scrapers.
              </p>
              <Button asChild>
                <a href="/competitors">Add Competitors</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {needsApiKey && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Key className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">API Key Required</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                You need to set up your OpenRouter API key to use the scraper functionality.
              </p>
              <Button asChild>
                <a href="/settings">Setup API Keys</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sources">Custom Sources</TabsTrigger>
          <TabsTrigger value="apis">API Sources</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Runs</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {activeTab === 'sources' && (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sources..."
                  className="w-full md:w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by competitor" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-background">
                    <SelectItem value="all">All Competitors</SelectItem>
                    {competitors.map(competitor => (
                      <SelectItem key={competitor.id} value={competitor.id.toString()}>
                        {competitor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apis' && (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search API sources..."
                  className="w-full md:w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-background">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="patents">Patents</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="jobs">Jobs</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="pr">Press Releases</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="opensource">Open Source</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="economic">Economic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <TabsContent value="sources" className="mt-0">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Sources</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="error">Errors</TabsTrigger>
            </TabsList>

            <Card>
              <CardHeader className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Data Sources</CardTitle>
                  <Button variant="outline" size="sm">
                    <ArrowDownUp className="h-3.5 w-3.5 mr-1" />
                    Sort
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingScrapeTargets ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredScrapeTargets.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Type</TableHead>
                        <TableHead>Competitor</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Scraped</TableHead>
                        <TableHead>Next Scheduled</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredScrapeTargets.map(target => {
                        const competitor = competitors.find(c => c.id === target.competitorId);
                        return (
                          <TableRow key={target.id}>
                            <TableCell>
                              <span className="text-lg" title={target.type}>
                                {getTypeIcon(target.type)}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">
                              {competitor?.name || 'Unknown'}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="max-w-[200px] truncate block">
                                {target.url}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">{target.frequency}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(target.status)}>
                                {target.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {target.lastScraped || 'Never'}
                            </TableCell>
                            <TableCell>
                              {target.nextScheduled || 'Not scheduled'}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" title="Run now">
                                  <Play className="h-4 w-4" />
                                </Button>
                                {target.status === 'active' ? (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    title="Pause"
                                    onClick={() => toggleScrapeTargetMutation.mutate(target.id)}
                                  >
                                    <CirclePause className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    title="Activate"
                                    onClick={() => toggleScrapeTargetMutation.mutate(target.id)}
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon" title="View results">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Settings">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="Delete"
                                  onClick={() => deleteScrapeTargetMutation.mutate(target.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No data sources found. Add your first source to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </Tabs>
        </TabsContent>

        <TabsContent value="apis" className="mt-0">
          {isLoadingApiSources ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredApiSources.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApiSources.map(api => (
                <Card key={api.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(api.category)}>
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(api.category)}
                          <span>{api.category.charAt(0).toUpperCase() + api.category.slice(1)}</span>
                        </div>
                      </Badge>
                      {api.requiresKey && (
                        <Badge variant="outline" className="ml-2">Requires API Key</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-2">{api.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{api.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      <strong>Method:</strong> {api.method}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      <strong>Endpoint:</strong> {api.api_url || api.rss_url}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 pt-2">
                    <div className="w-full flex justify-between items-center">
                      <Button variant="ghost" size="sm" onClick={() => showApiDetails(api)}>
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => openRunScraperDialog(api)}
                        disabled={!apiConfig.openrouterKey || !hasCompetitors}
                      >
                        Use API
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No API sources found for the selected category.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Scraping Tasks</CardTitle>
              <CardDescription>
                View and manage all scheduled data collection tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scrapeTargets.filter(t => t.status === 'active').length > 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {i === 1 ? 'Daily Patent Scan' : i === 2 ? 'Weekly News Collection' : 'Monthly Jobs Analysis'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {i === 1 ? 'Runs every day at 3:00 AM' : i === 2 ? 'Runs every Monday at 6:00 AM' : 'Runs on the 1st of each month'}
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div>{i === 1 ? 'Next run in 8 hours' : i === 2 ? 'Next run in 3 days' : 'Next run in 12 days'}</div>
                        <Button variant="ghost" size="sm" className="h-6">Run now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-md bg-muted/30">
                  <p className="text-center text-muted-foreground">No scheduled tasks. Activate scrape targets to see them here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                View insights and reports gathered from recent scraping operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insightReport ? (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">Executive Summary for {insightReport.competitorName}</h3>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium mb-2">Overview</h4>
                      <p className="text-muted-foreground">{insightReport.overview}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium mb-2">Key Moves</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {insightReport.keyMoves.map((move, i) => (
                          <li key={i} className="text-muted-foreground">{move}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium mb-2">Threat Level</h4>
                      <Badge className={
                        insightReport.threatLevel === 'high' ? 'bg-red-100 text-red-800' : 
                        insightReport.threatLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 
                        'bg-green-100 text-green-800'
                      }>
                        {insightReport.threatLevel.charAt(0).toUpperCase() + insightReport.threatLevel.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium mb-2">Opportunities</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {insightReport.opportunities.map((opportunity, i) => (
                          <li key={i} className="text-muted-foreground">{opportunity}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-4">
                      Generated on {new Date(insightReport.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Source Insights</h3>
                    <div className="space-y-3">
                      {insightReport.insights.map(insight => (
                        <div key={insight.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{insight.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                            </div>
                            <Badge className={
                              insight.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 
                              insight.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 
                              'bg-slate-100 text-slate-800'
                            }>
                              {insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 border rounded-md bg-muted/30 text-center">
                  <p className="text-muted-foreground">No reports generated yet. Run a scraper to collect insights.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Details Dialog */}
      <Dialog open={isApiDetailsOpen} onOpenChange={setIsApiDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedApiSource && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedApiSource.title}</DialogTitle>
                <DialogDescription>
                  {selectedApiSource.description}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Category</Label>
                  <div className="col-span-3">
                    <Badge className={getCategoryColor(selectedApiSource.category)}>
                      {selectedApiSource.category.charAt(0).toUpperCase() + selectedApiSource.category.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">API URL</Label>
                  <div className="col-span-3 font-mono text-sm bg-muted p-2 rounded">
                    {selectedApiSource.api_url || selectedApiSource.rss_url}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Method</Label>
                  <div className="col-span-3">
                    {selectedApiSource.method}
                  </div>
                </div>
                {selectedApiSource.params && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right">Parameters</Label>
                    <div className="col-span-3">
                      <div className="bg-muted p-3 rounded font-mono text-sm whitespace-pre">
                        {JSON.stringify(selectedApiSource.params, null, 2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => openRunScraperDialog(selectedApiSource)}>
                  Run Scraper
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Run Scraper Dialog */}
      <Dialog open={isRunScraperOpen} onOpenChange={setIsRunScraperOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Scraper</DialogTitle>
            <DialogDescription>
              Select a competitor to collect data for
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="competitor-select">Competitor</Label>
              <Select 
                value={selectedCompetitorId ? String(selectedCompetitorId) : ''} 
                onValueChange={(value) => setSelectedCompetitorId(Number(value))}
              >
                <SelectTrigger id="competitor-select">
                  <SelectValue placeholder="Select competitor" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-background">
                  {competitors.map(competitor => (
                    <SelectItem key={competitor.id} value={competitor.id.toString()}>
                      {competitor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedApiSource && (
              <div className="p-3 border rounded-md bg-muted/50">
                <h4 className="font-medium">Selected Data Source</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedApiSource.title}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge className={getCategoryColor(selectedApiSource.category)}>
                    {selectedApiSource.category}
                  </Badge>
                  {selectedApiSource.requiresKey && (
                    <Badge variant="outline">Requires API Key</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              disabled={!selectedCompetitorId || isProcessing}
              onClick={runScraper}
            >
              {isProcessing ? "Processing..." : "Run Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Custom Scraper Dialog */}
      <Dialog open={isGenerateReportOpen} onOpenChange={setIsGenerateReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Custom Scraper</DialogTitle>
            <DialogDescription>
              Create a custom scraper for a competitor's website using AI
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="competitor-select-gen">Competitor</Label>
              <Select 
                value={selectedCompetitorId ? String(selectedCompetitorId) : ''} 
                onValueChange={(value) => setSelectedCompetitorId(Number(value))}
              >
                <SelectTrigger id="competitor-select-gen">
                  <SelectValue placeholder="Select competitor" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-background">
                  {competitors.map(competitor => (
                    <SelectItem key={competitor.id} value={competitor.id.toString()}>
                      {competitor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 border rounded-md bg-amber-50">
              <div className="flex items-start gap-2">
                <Code className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">AI-Powered Code Generation</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    This will use DeepSeek Coder AI to generate custom scraping code for the selected competitor's website. The process may take a minute.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              disabled={!selectedCompetitorId || isProcessing}
              onClick={generateScraperCode}
            >
              {isProcessing ? "Generating..." : "Generate Code"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Scraper;
