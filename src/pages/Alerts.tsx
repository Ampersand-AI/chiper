
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellRing, Check, Clock, Edit, PlusCircle, Trash, X } from 'lucide-react';
import { mockCompetitors } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const alertTypes = [
  { 
    id: 1, 
    name: 'Price Change Alert', 
    description: 'Get notified when competitors change their pricing',
    criteria: 'Any pricing change detected',
    enabled: true,
    severity: 'high',
    competitors: [1, 2]
  },
  { 
    id: 2, 
    name: 'New Feature Alert', 
    description: 'Get notified when competitors launch new features',
    criteria: 'Product update detected on website or in news',
    enabled: true,
    severity: 'medium',
    competitors: [1, 3, 4]
  },
  { 
    id: 3, 
    name: 'Job Posting Alert', 
    description: 'Track when competitors post jobs in specific departments',
    criteria: 'New engineering or product job posts',
    enabled: false,
    severity: 'low',
    competitors: [2, 3]
  },
  { 
    id: 4, 
    name: 'News Mention Alert', 
    description: 'Get notified when competitors are mentioned in major publications',
    criteria: 'News article with more than 1000 shares',
    enabled: true,
    severity: 'medium',
    competitors: [1, 2, 3, 4]
  },
];

const recentAlerts = [
  {
    id: 1,
    title: 'InsightPro launched new AI features',
    description: 'InsightPro announced a new suite of AI-powered analytics features on their website and blog',
    time: '2 hours ago',
    type: 'New Feature',
    read: false,
    competitor: 3
  },
  {
    id: 2,
    title: 'DataVision Inc changed enterprise pricing',
    description: 'DataVision Inc increased their enterprise tier pricing by 15% and added new service levels',
    time: '1 day ago',
    type: 'Price Change',
    read: true,
    competitor: 2
  },
  {
    id: 3,
    title: 'Acme Analytics hiring ML Engineers',
    description: 'Acme Analytics posted 5 new job openings for Machine Learning Engineers in the last week',
    time: '2 days ago',
    type: 'Job Posting',
    read: true,
    competitor: 1
  },
  {
    id: 4,
    title: 'MetricMasters featured in TechCrunch',
    description: 'MetricMasters was featured in a TechCrunch article about emerging analytics platforms',
    time: '3 days ago',
    type: 'News Mention',
    read: true,
    competitor: 4
  }
];

const Alerts = () => {
  const getCompetitorNames = (ids: number[]) => {
    return ids
      .map(id => mockCompetitors.find(c => c.id === id)?.name || '')
      .filter(name => name !== '')
      .join(', ');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return '';
    }
  };

  const getCompetitorName = (id: number) => {
    return mockCompetitors.find(c => c.id === id)?.name || 'Unknown';
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts Center</h1>
          <p className="text-muted-foreground">
            Manage notifications and stay informed about competitor activities
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Alert</DialogTitle>
              <DialogDescription>
                Set up a new alert to monitor specific competitor activities
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="alert-name">Alert Name</Label>
                <Input id="alert-name" placeholder="e.g. New Feature Alert" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alert-description">Description</Label>
                <Input id="alert-description" placeholder="e.g. Notify me when competitors launch new features" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alert-type">Alert Type</Label>
                <Select>
                  <SelectTrigger id="alert-type">
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price Change</SelectItem>
                    <SelectItem value="feature">New Feature</SelectItem>
                    <SelectItem value="job">Job Posting</SelectItem>
                    <SelectItem value="news">News Mention</SelectItem>
                    <SelectItem value="custom">Custom Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alert-severity">Alert Severity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="alert-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Monitor Competitors</Label>
                <div className="grid gap-1.5">
                  {mockCompetitors.map(competitor => (
                    <div key={competitor.id} className="flex items-center space-x-2">
                      <Switch id={`comp-${competitor.id}`} />
                      <Label htmlFor={`comp-${competitor.id}`}>{competitor.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="grid gap-4">
            {recentAlerts.map(alert => (
              <Card key={alert.id} className={!alert.read ? "border-primary/30 shadow-md" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      {!alert.read && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <CardDescription className="mt-1">{alert.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className="ml-2">
                      {alert.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {alert.time} • {getCompetitorName(alert.competitor)}
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.read ? (
                      <Button variant="outline" size="sm">
                        <Check className="mr-1 h-4 w-4" />
                        Mark as Read
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Trash className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6">
            {alertTypes.map(alert => (
              <Card key={alert.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <CardTitle>{alert.name}</CardTitle>
                        <Badge className={`ml-2 ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">{alert.description}</CardDescription>
                    </div>
                    <Switch checked={alert.enabled} />
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-col gap-2 text-sm">
                    <div>
                      <span className="font-medium">Alert Criteria:</span>
                      <span className="ml-2">{alert.criteria}</span>
                    </div>
                    <div>
                      <span className="font-medium">Monitoring:</span>
                      <span className="ml-2">{getCompetitorNames(alert.competitors)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>View past alerts and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...recentAlerts, ...recentAlerts].slice(0, 6).map((alert, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${index % 3 === 0 ? 'bg-red-100' : index % 3 === 1 ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                      <BellRing className={`h-4 w-4 ${index % 3 === 0 ? 'text-red-600' : index % 3 === 1 ? 'text-yellow-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {alert.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {alert.description.substring(0, 60)}...
                      </p>
                      <div className="flex items-center pt-1">
                        <p className="text-xs text-muted-foreground">{index === 0 ? '2 hours ago' : index === 1 ? '1 day ago' : `${index + 1} days ago`}</p>
                        <span className="mx-1 text-muted-foreground">•</span>
                        <p className="text-xs font-medium">{getCompetitorName(alert.competitor)}</p>
                      </div>
                    </div>
                    <div>
                      {Math.random() > 0.3 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Check className="mr-1 h-3 w-3" /> Actioned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700">
                          <X className="mr-1 h-3 w-3" /> Dismissed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t">
              <Button variant="ghost">View All History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Alerts;
