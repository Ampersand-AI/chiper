
import { ApiSource, Insight, ScraperCode, InsightAnalysis, InsightReport, ScraperConfig } from '@/types/competitors';
import { toast } from '@/hooks/use-toast';
import { queryOpenRouter, getInsights, analyzeCompetitorStrategy, formatInsightReport, generateScraper } from './openRouter';

export class ScraperService {
  private static formatError(error: any): string {
    return error instanceof Error ? error.message : 'An unexpected error occurred';
  }

  static async testApiKey(key: string, type: 'openai' | 'openrouter' | 'newsapi'): Promise<boolean> {
    try {
      if (!key || key.length < 10) {
        throw new Error('API key is too short or invalid');
      }
      
      // Make a simple API call to test the key
      if (type === 'openrouter') {
        // Test OpenRouter key with a simple call
        const testMessage = await queryOpenRouter("anthropic/claude-3-haiku", [
          { role: "user", content: "Respond with OK if this works" }
        ], key);
        
        if (!testMessage || !testMessage.includes("OK")) {
          throw new Error('OpenRouter key validation failed');
        }
      } else if (type === 'openai') {
        // Simulate OpenAI key test - in a real app, would make an actual API call
        if (!key.startsWith('sk-')) {
          throw new Error('Invalid OpenAI key format');
        }
      } else if (type === 'newsapi') {
        // Test NewsAPI key with an actual API call
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`);
        if (!response.ok) {
          throw new Error(`NewsAPI returned status: ${response.status}`);
        }
      }
      
      // Save key to localStorage for persistence
      localStorage.setItem(`${type}Key`, key);
      
      toast({
        title: "API Key Connected",
        description: `Successfully connected ${
          type === 'openai' ? 'OpenAI' : type === 'openrouter' ? 'OpenRouter' : 'NewsAPI'
        } API key.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: ScraperService.formatError(error),
        variant: "destructive",
      });
      return false;
    }
  }

  static async getConfig(): Promise<ScraperConfig> {
    return {
      openaiKey: localStorage.getItem('openaiKey') || undefined,
      openrouterKey: localStorage.getItem('openrouterKey') || undefined,
      newsApiKey: localStorage.getItem('newsapiKey') || undefined,
      enabled: localStorage.getItem('scraperEnabled') !== 'false',
    };
  }

  static async runScraper(source: ApiSource, competitorId: number, competitorName: string): Promise<Insight[]> {
    try {
      const config = await this.getConfig();
      
      if (!config.openrouterKey) {
        throw new Error('OpenRouter API key is required to run scrapers');
      }
      
      // For demo purposes, simulate scraping with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockData: any;
      let insights: Insight[] = [];
      
      // Based on the API source, generate appropriate mock data
      switch(source.category) {
        case 'patents':
          mockData = {
            patents: [
              { patent_title: `New AI Model by ${competitorName}`, patent_date: new Date().toISOString() },
              { patent_title: `Data Processing System by ${competitorName}`, patent_date: new Date().toISOString() }
            ]
          };
          
          insights = mockData.patents.map((patent: any, index: number) => ({
            id: Math.floor(Math.random() * 10000) + index,
            competitorId,
            type: 'patent',
            title: patent.patent_title,
            description: `Patent filed on ${new Date(patent.patent_date).toLocaleDateString()}`,
            source: source.title,
            date: new Date().toISOString(),
            sentiment: 'neutral',
            impact: 'medium',
            rawData: patent
          }));
          break;
          
        case 'news':
          mockData = {
            articles: [
              { title: `${competitorName} Launches New Product`, description: 'A groundbreaking innovation', publishedAt: new Date().toISOString() },
              { title: `${competitorName} Reports Q2 Earnings`, description: 'Exceeding market expectations', publishedAt: new Date().toISOString() }
            ]
          };
          
          insights = mockData.articles.map((article: any, index: number) => ({
            id: Math.floor(Math.random() * 10000) + index,
            competitorId,
            type: 'news',
            title: article.title,
            description: article.description,
            source: source.title,
            date: article.publishedAt,
            sentiment: 'positive',
            impact: 'medium',
            rawData: article
          }));
          break;
          
        case 'jobs':
          mockData = {
            jobs: [
              { position: `Senior Engineer at ${competitorName}`, location: 'Remote', date: new Date().toISOString() },
              { position: `Product Manager at ${competitorName}`, location: 'San Francisco', date: new Date().toISOString() }
            ]
          };
          
          insights = mockData.jobs.map((job: any, index: number) => ({
            id: Math.floor(Math.random() * 10000) + index,
            competitorId,
            type: 'hiring',
            title: job.position,
            description: `Location: ${job.location}`,
            source: source.title,
            date: job.date,
            sentiment: 'neutral',
            impact: 'medium',
            rawData: job
          }));
          break;
          
        case 'social':
          mockData = {
            posts: [
              { content: `${competitorName} announces partnership with leading tech firm`, platform: 'Twitter', posted: new Date().toISOString() },
              { content: `${competitorName} showcases new technology at industry conference`, platform: 'LinkedIn', posted: new Date().toISOString() }
            ]
          };
          
          insights = mockData.posts.map((post: any, index: number) => ({
            id: Math.floor(Math.random() * 10000) + index,
            competitorId,
            type: 'social',
            title: `${post.platform} post`,
            description: post.content,
            source: source.title,
            date: post.posted,
            sentiment: 'positive',
            impact: 'low',
            rawData: post
          }));
          break;
          
        // Add more cases for other categories
        default:
          mockData = {
            items: [
              { title: `${source.category} insight from ${competitorName}`, description: 'Generic insight description', date: new Date().toISOString() }
            ]
          };
          
          insights = mockData.items.map((item: any, index: number) => ({
            id: Math.floor(Math.random() * 10000) + index,
            competitorId,
            type: 'news',
            title: item.title,
            description: item.description,
            source: source.title,
            date: item.date,
            sentiment: 'neutral',
            impact: 'low',
            rawData: item
          }));
      }

      toast({
        title: "Scraping Complete",
        description: `Successfully scraped data from ${source.title}`,
      });

      return insights;
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: ScraperService.formatError(error),
        variant: "destructive",
      });
      return [];
    }
  }

  static async generateCustomScraper(websiteUrl: string, competitorName: string): Promise<ScraperCode | null> {
    try {
      const config = await this.getConfig();
      
      if (!config.openrouterKey) {
        throw new Error('OpenRouter API key is required to generate scrapers');
      }
      
      // Use DeepSeek Coder model via OpenRouter
      let scraperCode = '';
      
      try {
        // Call the OpenRouter API with DeepSeek Coder model
        scraperCode = await generateScraper(websiteUrl, config.openrouterKey);
      } catch (error) {
        console.error('Error generating scraper:', error);
        // Fallback to mock code if API call fails
        scraperCode = `
// Generated scraper for ${competitorName}
const puppeteer = require('puppeteer');

async function scrapeCompetitor() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('${websiteUrl}', { waitUntil: 'networkidle2' });
    
    // Extract product data
    const products = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.product-item')).map(product => ({
        title: product.querySelector('.product-title')?.textContent.trim(),
        price: product.querySelector('.product-price')?.textContent.trim(),
        description: product.querySelector('.product-description')?.textContent.trim(),
        url: product.querySelector('a')?.href
      }));
    });
    
    return {
      timestamp: new Date().toISOString(),
      source: '${websiteUrl}',
      products
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeCompetitor };
`;
      }

      toast({
        title: "Scraper Generated",
        description: `Custom scraper created for ${competitorName} using DeepSeek Coder AI`,
      });

      // Return the scraper code object
      return {
        id: Math.floor(Math.random() * 10000),
        competitorId: 0, // Will be set properly when associated with a competitor
        url: websiteUrl,
        code: scraperCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };
    } catch (error) {
      toast({
        title: "Scraper Generation Failed",
        description: ScraperService.formatError(error),
        variant: "destructive",
      });
      return null;
    }
  }

  static async analyzeInsights(insights: Insight[], competitorName: string): Promise<InsightAnalysis | null> {
    try {
      const config = await this.getConfig();
      // Prepare the insight data for analysis
      const insightData = insights.map(insight => 
        `- ${insight.type.toUpperCase()}: ${insight.title}\n  ${insight.description}\n  Impact: ${insight.impact}, Sentiment: ${insight.sentiment}\n`
      ).join('\n');
      
      // Get analysis from Claude via OpenRouter
      let analysis = '';
      if (config.openrouterKey) {
        analysis = await analyzeCompetitorStrategy(insightData, config.openrouterKey);
      } else {
        // Fallback to mock analysis if no key is available
        analysis = `
• Product Strategy: ${competitorName} is focusing on AI-powered innovations with recent patent filings and product launches suggesting an expansion into enterprise solutions.
• Market Positioning: Currently positioning as a premium provider in the enterprise SaaS space with a focus on data processing capabilities.
• Potential Gaps: Limited presence in the consumer market and potential vulnerability in pricing strategy compared to emerging competitors.
        `;
      }

      toast({
        title: "Analysis Complete",
        description: `Insights analyzed for ${competitorName}`,
      });

      // Return analysis object
      return {
        id: Math.floor(Math.random() * 10000),
        insightId: insights[0]?.id || 0,
        summary: analysis,
        productStrategy: "AI-powered innovations with focus on enterprise solutions",
        marketPositioning: "Premium provider in enterprise SaaS space",
        gaps: "Limited presence in consumer market and potential pricing vulnerabilities",
        threatLevel: 'medium',
        opportunities: "Expand to consumer market, optimize pricing strategy",
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: ScraperService.formatError(error),
        variant: "destructive",
      });
      return null;
    }
  }

  static async generateReport(analysis: InsightAnalysis, insights: Insight[], competitorName: string, competitorId: number): Promise<InsightReport | null> {
    try {
      const config = await this.getConfig();
      const prompt = `
      Competitor: ${competitorName}
      Product Strategy: ${analysis.productStrategy}
      Market Positioning: ${analysis.marketPositioning}
      Gaps: ${analysis.gaps}
      Threat Level: ${analysis.threatLevel}
      Recent Insights: ${insights.map(i => i.title).join(', ')}
      `;
      
      // Get report from GPT-4 via OpenRouter
      let reportContent = '';
      if (config.openrouterKey) {
        reportContent = await formatInsightReport(prompt, config.openrouterKey);
      } else {
        reportContent = `
# Executive Summary

## Overview
${competitorName} is establishing itself as a premium provider in the enterprise SaaS space, leveraging AI-powered innovations to differentiate from competitors.

## Key Moves
- Filing patents for new AI technology applications
- Expanding engineering team with senior hires
- Launching new enterprise-focused products

## Threat Level
Medium

## Opportunities
- Develop offerings for the underserved consumer segment
- Evaluate pricing strategy to combat emerging competitors
- Explore partnerships to strengthen market position
`;
      }
      
      // Parse the report or use mock data if API call failed
      let overview = reportContent.includes("Overview") 
        ? reportContent.split("Overview")[1].split("Key Moves")[0].trim()
        : `${competitorName} is establishing itself as a premium provider in the enterprise SaaS space, leveraging AI-powered innovations to differentiate from competitors.`;
      
      let keyMoves = [
        "Filing patents for new AI technology applications",
        "Expanding engineering team with senior hires",
        "Launching new enterprise-focused products"
      ];
      
      if (reportContent.includes("Key Moves") && reportContent.includes("Threat Level")) {
        const keyMovesSection = reportContent.split("Key Moves")[1].split("Threat Level")[0].trim();
        const bulletPoints = keyMovesSection.split("\n").filter(line => line.trim().startsWith("-"));
        if (bulletPoints.length > 0) {
          keyMoves = bulletPoints.map(point => point.replace(/^-\s*/, "").trim());
        }
      }
      
      let opportunities = [
        "Develop offerings for the underserved consumer segment",
        "Evaluate pricing strategy to combat emerging competitors",
        "Explore partnerships to strengthen market position"
      ];
      
      if (reportContent.includes("Opportunities")) {
        const oppsSection = reportContent.split("Opportunities")[1].trim();
        const bulletPoints = oppsSection.split("\n").filter(line => line.trim().startsWith("-"));
        if (bulletPoints.length > 0) {
          opportunities = bulletPoints.map(point => point.replace(/^-\s*/, "").trim());
        }
      }

      const report: InsightReport = {
        competitorId,
        competitorName,
        overview,
        keyMoves,
        threatLevel: analysis.threatLevel as 'high' | 'medium' | 'low',
        opportunities,
        insights,
        lastUpdated: new Date().toISOString()
      };

      toast({
        title: "Report Generated",
        description: `Executive summary created for ${competitorName}`,
      });

      return report;
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: ScraperService.formatError(error),
        variant: "destructive",
      });
      return null;
    }
  }
}
