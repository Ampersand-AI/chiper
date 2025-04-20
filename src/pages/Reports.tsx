
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Filter, Search, FileText, Download, Calendar, Clock, CheckSquare, PlusCircle } from 'lucide-react';
import { mockCompetitors, mockReports } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = mockReports.filter(
    report => 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCompetitorNames = (competitorIds: number[]) => {
    return competitorIds
      .map(id => mockCompetitors.find(c => c.id === id)?.name || '')
      .filter(name => name !== '')
      .join(', ');
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view strategic reports
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>
                Configure your report parameters and select competitors to include
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="report-title">Report Title</Label>
                <Input id="report-title" placeholder="e.g. Q2 Competitive Analysis" />
              </div>
              <div className="grid gap-2">
                <Label>Include Competitors</Label>
                <div className="grid gap-1.5">
                  {mockCompetitors.map(competitor => (
                    <div key={competitor.id} className="flex items-center space-x-2">
                      <Checkbox id={`competitor-${competitor.id}`} />
                      <label 
                        htmlFor={`competitor-${competitor.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {competitor.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select defaultValue="30days">
                  <SelectTrigger id="timeframe">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last quarter</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select defaultValue="full">
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full analysis</SelectItem>
                    <SelectItem value="executive">Executive summary</SelectItem>
                    <SelectItem value="trends">Trend analysis</SelectItem>
                    <SelectItem value="pricing">Pricing comparison</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Generate Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6">
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <Card key={report.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          {report.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {report.description}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-y-2 text-sm">
                      <div className="flex items-center mr-6">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{formatDate(new Date(report.date))}</span>
                      </div>
                      <div className="flex items-center mr-6">
                        <CheckSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{report.insights.length} insights</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>5 min read</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 text-sm">
                    <span className="text-muted-foreground mr-2">Includes:</span>
                    <span className="font-medium">{getCompetitorNames(report.competitors)}</span>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="mt-12 flex flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No reports found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or create a new report
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <div className="text-center py-12 text-muted-foreground">
            Recently generated reports will appear here
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="text-center py-12 text-muted-foreground">
            Saved reports will appear here
          </div>
        </TabsContent>
        <TabsContent value="scheduled">
          <div className="text-center py-12 text-muted-foreground">
            Scheduled reports will appear here
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Reports;
