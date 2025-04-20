
import { ApiSource, Insight } from '@/types/competitors';
import { toast } from '@/hooks/use-toast';

export class ScraperService {
  private static formatError(error: any): string {
    return error instanceof Error ? error.message : 'An unexpected error occurred';
  }

  static async testApiKey(key: string, type: 'openai' | 'openrouter'): Promise<boolean> {
    try {
      // Simulate API key validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make an actual API call here
      if (key && key.length > 20) {
        toast({
          title: "API Key Connected",
          description: `Successfully connected ${type === 'openai' ? 'OpenAI' : 'OpenRouter'} API key.`,
        });
        return true;
      }
      
      throw new Error('Invalid API key format');
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: ScraperService.formatError(error),
        variant: "destructive",
      });
      return false;
    }
  }

  static async runScraper(source: ApiSource, competitorId: number): Promise<Insight[]> {
    try {
      // Simulate scraping
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockInsight: Insight = {
        id: Math.floor(Math.random() * 10000),
        competitorId,
        type: 'news',
        title: `New insight from ${source.title}`,
        description: `Scraped content from ${source.api_url || source.rss_url}`,
        source: source.title,
        date: new Date().toISOString(),
        sentiment: 'neutral',
        impact: 'medium',
      };

      toast({
        title: "Scraping Complete",
        description: `Successfully scraped data from ${source.title}`,
      });

      return [mockInsight];
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: ScraperService.formatError(error),
        variant: "destructive",
      });
      return [];
    }
  }
}
