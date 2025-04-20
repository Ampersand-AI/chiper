import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownUp, Calendar, CirclePause, Eye, Play, Plus, RefreshCw, Search, Settings, Trash } from 'lucide-react';
import { mockCompetitors, mockScrapeTargets } from '@/data/mockData';

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

const getCompetitorName = (id: number) => {
  return mockCompetitors.find(c => c.id === id)?.name || 'Unknown';
};

const Scraper = () => {
  
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scraper Management</h1>
          <p className="text-muted-foreground">
            Configure and monitor your automated data collection
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Source</DialogTitle>
              <DialogDescription>
                Configure a new source to scrape for competitor intelligence
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="competitor">Competitor</Label>
                <Select>
                  <SelectTrigger id="competitor">
                    <SelectValue placeholder="Select competitor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompetitors.map(competitor => (
                      <SelectItem key={competitor.id} value={competitor.id.toString()}>
                        {competitor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source-type">Source Type</Label>
                <Select>
                  <SelectTrigger id="source-type">
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="jobs">Job Boards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" placeholder="https://example.com/page-to-scrape" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Scraping Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Source</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search sources..." className="w-full md:w-[300px] pl-8" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by competitor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitors</SelectItem>
                {mockCompetitors.map(competitor => (
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
                {mockScrapeTargets.map(target => (
                  <TableRow key={target.id}>
                    <TableCell>
                      <span className="text-lg" title={target.type}>
                        {getTypeIcon(target.type)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getCompetitorName(target.competitorId)}
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
                          <Button variant="ghost" size="icon" title="Pause">
                            <CirclePause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" title="Activate">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" title="View results">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Settings">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {getTypeIcon(i === 1 ? 'website' : i === 2 ? 'news' : 'linkedin')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {i === 1 ? 'Website Scrape' : i === 2 ? 'News Collection' : 'LinkedIn Jobs'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {mockCompetitors[i - 1].name}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div>{i * 2} hours ago</div>
                    <Badge variant="outline" className={i === 3 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}>
                      {i === 3 ? 'Failed' : 'Success'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Scrapes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {i === 1 ? 'InsightPro Blog' : i === 2 ? 'DataVision Pricing' : 'Acme Analytics Jobs'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {i === 1 ? 'Daily scrape' : i === 2 ? 'Weekly check' : 'Monthly scan'}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div>In {i * 6} hours</div>
                    <Button variant="ghost" size="sm" className="h-6">Run now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scraper Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active sources</span>
                <span className="font-medium">
                  {mockScrapeTargets.filter(t => t.status === 'active').length}/{mockScrapeTargets.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Success rate (24h)</span>
                <span className="font-medium text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Failed scrapes</span>
                <span className="font-medium text-red-600">
                  {mockScrapeTargets.filter(t => t.status === 'error').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total insights collected</span>
                <span className="font-medium">342</span>
              </div>
              <Button variant="outline" className="w-full mt-2">
                <Settings className="h-4 w-4 mr-2" />
                Configure Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Scraper;
