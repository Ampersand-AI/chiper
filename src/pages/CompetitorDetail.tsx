import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, ExternalLink, LineChart as LineChartIcon, MapPin, RefreshCw, Settings, Share2, Trash } from 'lucide-react';
import { mockCompetitors, mockInsights, mockScrapeTargets } from '@/data/mockData';
import { generateChartData } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { SentimentChart } from '@/components/dashboard/SentimentChart';

const CompetitorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const competitorId = Number(id);
  
  // Find the competitor
  const competitor = mockCompetitors.find(c => c.id === competitorId);
  
  if (!competitor) {
    return (
      <MainLayout>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/competitors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Not Found</h1>
        </div>
        <p>The competitor you're looking for doesn't exist.</p>
      </MainLayout>
    );
  }
  
  // Get insights for this competitor
  const insights = mockInsights.filter(insight => insight.competitorId === competitorId);
  
  // Sort insights by date (newest first)
  const sortedInsights = [...insights].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get scrape targets for this competitor
  const scrapeTargets = mockScrapeTargets.filter(target => target.competitorId === competitorId);
  
  // Generate sentiment data for this competitor
  const sentimentData = generateChartData(30, 50, 90);

  return (
    <MainLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/competitors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{competitor.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{competitor.name}</CardTitle>
                  <CardDescription>
                    <a href={`https://${competitor.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      {competitor.website}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{competitor.description}</p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-2">Industry Positioning</h3>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {competitor.industryPositioning}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Sentiment Score</h3>
                  <div className="flex items-center">
                    <Progress value={competitor.sentimentScore} className="h-2 flex-1 mr-2" />
                    <span className="text-sm font-medium">{competitor.sentimentScore}/100</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <h3 className="text-sm font-medium">Total Insights</h3>
                  <p className="text-2xl font-bold mt-1">{insights.length}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Active Scrapers</h3>
                  <p className="text-2xl font-bold mt-1">
                    {scrapeTargets.filter(t => t.status === 'active').length}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <p className="text-2xl font-bold mt-1">{competitor.lastUpdated}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash className="h-4 w-4 mr-1" />
                Remove
              </Button>
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh Data
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentChart
                data={sentimentData}
                title=""
                description=""
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="insights">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="scraper">Data Sources</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="product">Product Updates</SelectItem>
                  <SelectItem value="hiring">Hiring</SelectItem>
                  <SelectItem value="expansion">Market Expansion</SelectItem>
                  <SelectItem value="pricing">Pricing Changes</SelectItem>
                  <SelectItem value="news">News & PR</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Filters
              </Button>
            </div>
          </div>

          <TabsContent value="insights">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedInsights.map(insight => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  competitorName={competitor.name}
                />
              ))}
            </div>
            
            {sortedInsights.length === 0 && (
              <div className="text-center py-12">
                <LineChart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No insights yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Insights will appear here once we collect data about this competitor.
                </p>
                <Button className="mt-4">
                  Collect Insights Now
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scraper">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Active Data Sources</CardTitle>
                  <Button size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    Add Source
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scrapeTargets.map(target => (
                    <div key={target.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-muted-foreground mr-3">
                          {target.type === 'website' && '🌐'}
                          {target.type === 'linkedin' && '👥'}
                          {target.type === 'news' && '📰'}
                          {target.type === 'jobs' && '💼'}
                        </div>
                        <div>
                          <div className="font-medium">
                            {target.type === 'website' && 'Website'}
                            {target.type === 'linkedin' && 'LinkedIn'}
                            {target.type === 'news' && 'News Mentions'}
                            {target.type === 'jobs' && 'Job Postings'}
                          </div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {target.url}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge 
                          className={
                            target.status === 'active' ? 'bg-green-100 text-green-800 mr-2' :
                            target.status === 'paused' ? 'bg-yellow-100 text-yellow-800 mr-2' :
                            'bg-red-100 text-red-800 mr-2'
                          }
                        >
                          {target.status}
                        </Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}

                  {scrapeTargets.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No data sources configured</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <div className="text-center py-20 text-muted-foreground">
              Product information will be displayed here once collected
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="text-center py-20 text-muted-foreground">
              Pricing information will be displayed here once collected
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CompetitorDetail;
