
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { InsightDistributionChart } from '@/components/dashboard/InsightDistributionChart';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowRight,
  BarChart,
  LineChart,
  Search,
  Target,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

import {
  mockCompetitors,
  mockInsights,
  sentimentTrendData,
  competitorsActivityData,
  insightDistributionData
} from '@/data/mockData';

const Dashboard = () => {
  // Get latest insights (last 10)
  const latestInsights = [...mockInsights]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Calculate total insights in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentInsights = mockInsights.filter(
    insight => new Date(insight.date) >= thirtyDaysAgo
  );

  // Count insights by type
  const insightTypeCounts = recentInsights.reduce((acc, insight) => {
    acc[insight.type] = (acc[insight.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitive Pulse</h1>
          <p className="text-muted-foreground">
            Monitor your competitive landscape and get AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last quarter</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monitored Competitors"
          value={mockCompetitors.length}
          description="Active tracking"
          icon={<Target className="h-4 w-4" />}
          trendValue="All active"
          trend="neutral"
        />
        <StatCard
          title="Insights Collected"
          value={recentInsights.length}
          description="Last 30 days"
          icon={<LineChart className="h-4 w-4" />}
          trendValue="+12% vs previous"
          trend="up"
        />
        <StatCard
          title="Product Updates"
          value={insightTypeCounts.product || 0}
          description="From all competitors"
          icon={<BarChart className="h-4 w-4" />}
          trendValue="-5% vs previous"
          trend="down"
        />
        <StatCard
          title="Average Sentiment"
          value={Math.round(sentimentTrendData[sentimentTrendData.length - 1].value)}
          description="Score out of 100"
          icon={<TrendingUp className="h-4 w-4" />}
          trendValue="+3 points"
          trend="up"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <SentimentChart data={sentimentTrendData} />
        <ActivityChart data={competitorsActivityData} />
      </div>

      <div className="mt-6">
        <InsightDistributionChart data={insightDistributionData} />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Latest Insights</h2>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search insights..." className="pl-8" />
            </div>
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="product">
                  Product <Badge className="ml-1 px-1 py-0">
                    {insightTypeCounts.product || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="hiring">Hiring</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestInsights.map(insight => {
            const competitor = mockCompetitors.find(c => c.id === insight.competitorId)!;
            return (
              <InsightCard
                key={insight.id}
                insight={insight}
                competitorName={competitor.name}
              />
            );
          })}
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/insights">
              View all insights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
