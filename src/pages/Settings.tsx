import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Key, Save } from 'lucide-react';
import { ScraperService } from '@/services/scraperService';

const Settings = () => {
  const [openRouterKey, setOpenRouterKey] = useState(localStorage.getItem('openrouterKey') || '');
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openaiKey') || '');

  const handleApiKeyChange = async (apiKey: string, type: 'openai' | 'openrouter') => {
    const success = await ScraperService.testApiKey(apiKey, type);
    if (success) {
      localStorage.setItem(`${type}Key`, apiKey);
      if (type === 'openai') {
        setOpenAIKey(apiKey);
      } else {
        setOpenRouterKey(apiKey);
      }
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application settings
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="teams">Team Access</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Demo User" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="demo@competitivepulse.com" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Competitive Pulse Inc" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america_ny">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america_ny">America/New_York (UTC-5)</SelectItem>
                      <SelectItem value="america_la">America/Los_Angeles (UTC-8)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (UTC+0)</SelectItem>
                      <SelectItem value="asia_tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Customize how CompetitivePulse works for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-refresh">Auto-refresh dashboard</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically refresh dashboard data every 30 minutes
                    </div>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-ai">AI-powered insights</Label>
                    <div className="text-sm text-muted-foreground">
                      Use AI to generate strategic recommendations from collected data
                    </div>
                  </div>
                  <Switch id="enable-ai" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Anonymous data sharing</Label>
                    <div className="text-sm text-muted-foreground">
                      Share anonymous usage data to help improve the product
                    </div>
                  </div>
                  <Switch id="data-sharing" defaultChecked />
                </div>
                <Separator />
                <div className="grid gap-2">
                  <Label htmlFor="default-view">Default Dashboard View</Label>
                  <Select defaultValue="insights">
                    <SelectTrigger id="default-view">
                      <SelectValue placeholder="Select default view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insights">Latest Insights</SelectItem>
                      <SelectItem value="competitors">Competitors</SelectItem>
                      <SelectItem value="reports">Reports</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for different AI models and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="mr-2">OpenRouter API</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Active</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Provides access to multiple AI models (OpenAI, Claude, DeepSeek)
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Change Key
                  </Button>
                </div>

                <div>
                  <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="openrouter-key"
                      type="password"
                      value={openRouterKey ? '●●●●●●●●●●●●●●●●●●●●●●●●●●●●' : ''}
                      className="rounded-r-none"
                      onChange={(e) => setOpenRouterKey(e.target.value)}
                    />
                    <Button className="rounded-l-none" onClick={() => handleApiKeyChange(openRouterKey, 'openrouter')}>
                      {openRouterKey ? 'Show' : 'Connect'}
                    </Button>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    {openRouterKey ? (
                      <>
                        <CheckCircle className="text-green-600 h-4 w-4 mr-1" />
                        <span className="text-green-600">Connected and working properly</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="text-yellow-600 h-4 w-4 mr-1" />
                        <span className="text-yellow-600">Not connected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="mr-2">OpenAI Direct Access</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Optional</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Direct connection to OpenAI API (Optional, for fallback)
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Add Key
                  </Button>
                </div>

                <div>
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="openai-key"
                      type="password"
                      placeholder="Not configured (optional)"
                      className="rounded-r-none"
                      value={openAIKey ? '●●●●●●●●●●●●●●●●●●●●●●●●●●●●' : ''}
                      onChange={(e) => setOpenAIKey(e.target.value)}
                    />
                    <Button className="rounded-l-none" disabled={!openAIKey} onClick={() => handleApiKeyChange(openAIKey, 'openai')}>
                      {openAIKey ? 'Show' : 'Connect'}
                    </Button>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Optional backup connection</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Model Preferences</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure which AI models to use for different tasks
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="data-extraction">Data Extraction Model</Label>
                    <Select defaultValue="gpt-4-turbo">
                      <SelectTrigger id="data-extraction">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4-turbo">OpenAI GPT-4 Turbo</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="insight-generation">Insight Generation Model</Label>
                    <Select defaultValue="claude-3-sonnet">
                      <SelectTrigger id="insight-generation">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4-turbo">OpenAI GPT-4 Turbo</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="scraper-code">Scraper Code Generation</Label>
                    <Select defaultValue="deepseek-coder">
                      <SelectTrigger id="scraper-code">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deepseek-coder">DeepSeek Coder</SelectItem>
                        <SelectItem value="gpt-4-turbo">OpenAI GPT-4 Turbo</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save API Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High priority alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive emails for critical competitor updates
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily digest</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive a daily summary of all competitor activities
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly reports</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive weekly competitive analysis reports
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Product updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive emails about CompetitivePulse updates
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Show notifications in real-time as they occur
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Play sound when new notifications arrive
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="alert-frequency">Alert Batching</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger id="alert-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time (immediate)</SelectItem>
                      <SelectItem value="hourly">Hourly batches</SelectItem>
                      <SelectItem value="daily">Daily batches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <div className="text-center py-20 text-muted-foreground">
            Team access settings will be implemented in a future update
          </div>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Configure data storage and retention policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="data-retention">Data Retention Period</Label>
                <Select defaultValue="6months">
                  <SelectTrigger id="data-retention">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="forever">Indefinitely</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Competitor data older than this period will be automatically archived
                </p>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="export-format">Default Export Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                    <SelectItem value="excel">Excel Workbook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Custom AI Prompt Template</Label>
                <Textarea
                  id="custom-prompt"
                  rows={4}
                  placeholder="Enter a custom prompt template to use when generating insights..."
                  className="resize-none"
                  defaultValue="Analyze the following competitor information and provide strategic insights about their positioning, recent changes, and potential threats or opportunities:"
                />
                <p className="text-sm text-muted-foreground">
                  This template will be used as a prefix for all AI analysis requests
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Clear All Data
              </Button>
              <Button>Save Data Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
