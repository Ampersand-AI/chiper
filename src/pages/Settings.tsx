import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScraperService } from '@/services/scraperService';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { queryOpenRouter } from '@/services/openRouter';

const Settings = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [newsApiKey, setNewsApiKey] = useState('');
  const [enableScraper, setEnableScraper] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = ScraperService.getConfig();
        if (config.openaiKey) setOpenaiKey(config.openaiKey);
        if (config.openrouterKey) setOpenrouterKey(config.openrouterKey);
        if (config.newsApiKey) setNewsApiKey(config.newsApiKey);
        setEnableScraper(config.enabled !== false);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load config:", error);
        setLoading(false);
      }
    };
    
    loadConfig();
  }, []);

  const testApiKey = async (key: string, type: 'openai' | 'openrouter' | 'newsapi') => {
    if (!key) {
      toast({
        title: "Error",
        description: "Please enter an API key first",
        variant: "destructive",
      });
      return;
    }

    setTesting(type);
    try {
      const success = await ScraperService.testApiKey(key, type);
      
      if (success) {
        // Save the key if test was successful
        const configUpdate = {
          [`${type}Key`]: key
        };
        await ScraperService.setConfig(configUpdate);

        toast({
          title: "Success",
          description: `${type.toUpperCase()} API key verified and saved successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: `Invalid ${type.toUpperCase()} API key`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error testing ${type} key:`, error);
      toast({
        title: "Error",
        description: `Failed to test ${type.toUpperCase()} API key. Check console for details.`,
        variant: "destructive",
      });
    } finally {
      setTesting(null);
    }
  };

  const handleToggleEnable = (checked: boolean) => {
    setEnableScraper(checked);
    ScraperService.setConfig({ enabled: checked });
    
    toast({
      title: checked ? "Scraper Enabled" : "Scraper Disabled",
      description: checked 
        ? "Intelligence gathering is now active" 
        : "Intelligence gathering has been paused",
    });
  };

  const handleManualSave = async (type: 'openai' | 'openrouter' | 'newsapi') => {
    try {
      let keyValue = '';
      switch (type) {
        case 'openai':
          keyValue = openaiKey;
          break;
        case 'openrouter':
          keyValue = openrouterKey;
          break;
        case 'newsapi':
          keyValue = newsApiKey;
          break;
      }
      
      if (!keyValue) {
        toast({
          title: "Error",
          description: "Please enter an API key first",
          variant: "destructive",
        });
        return;
      }
      
      const configUpdate = {
        [`${type}Key`]: keyValue
      };
      await ScraperService.setConfig(configUpdate);
      
      toast({
        title: "Success",
        description: `${type.toUpperCase()} API key saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${type.toUpperCase()} API key`,
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings and API connections
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="api-keys" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="scraper">Scraper</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Connect API keys for AI services and data sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="openrouter-key">OpenRouter API Key (Required)</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="openrouter-key" 
                      type="password" 
                      value={openrouterKey} 
                      onChange={e => setOpenrouterKey(e.target.value)} 
                      placeholder="sk-or-..." 
                    />
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => testApiKey(openrouterKey, 'openrouter')} 
                        disabled={testing === 'openrouter' || !openrouterKey}
                        variant="default"
                      >
                        {testing === 'openrouter' ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                        Test & Save
                      </Button>
                      <Button
                        onClick={() => handleManualSave('openrouter')}
                        variant="outline"
                        disabled={!openrouterKey}
                      >
                        Save Only
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Required for accessing AI models like Claude and Mistral. <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Get your key here</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key (Optional)</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="openai-key" 
                      type="password" 
                      value={openaiKey} 
                      onChange={e => setOpenaiKey(e.target.value)} 
                      placeholder="sk-..." 
                    />
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => testApiKey(openaiKey, 'openai')} 
                        disabled={testing === 'openai' || !openaiKey}
                        variant="default"
                      >
                        {testing === 'openai' ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                        Test & Save
                      </Button>
                      <Button
                        onClick={() => handleManualSave('openai')}
                        variant="outline"
                        disabled={!openaiKey}
                      >
                        Save Only
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Used for generating insights and summaries from competitor data
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newsapi-key">NewsAPI Key (Optional)</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="newsapi-key" 
                      type="password" 
                      value={newsApiKey} 
                      onChange={e => setNewsApiKey(e.target.value)} 
                      placeholder="..." 
                    />
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => testApiKey(newsApiKey, 'newsapi')} 
                        disabled={testing === 'newsapi' || !newsApiKey}
                        variant="default"
                      >
                        {testing === 'newsapi' ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                        Test & Save
                      </Button>
                      <Button
                        onClick={() => handleManualSave('newsapi')}
                        variant="outline"
                        disabled={!newsApiKey}
                      >
                        Save Only
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For fetching news articles about competitors
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  API keys are stored locally in your browser and used only for the specified purposes.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-scraper">Enable Intelligence Gathering</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically collect competitor data based on your configuration
                    </p>
                  </div>
                  <Switch 
                    id="enable-scraper" 
                    checked={enableScraper} 
                    onCheckedChange={handleToggleEnable}
                  />
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Data Collection Schedule</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      Daily (6:00 AM)
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Weekly (Monday)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scraper">
            <Card>
              <CardHeader>
                <CardTitle>Scraper Settings</CardTitle>
                <CardDescription>
                  Configure how data is collected and processed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI-Powered Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Use AI to analyze collected data and generate insights
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically update insights based on new data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                      Apply rate limiting to API requests to avoid hitting limits
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive alerts about competitor activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Insights</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new insights are discovered
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>High Impact Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for high-impact competitor activities
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports of competitor activities
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </MainLayout>
  );
};

export default Settings;
