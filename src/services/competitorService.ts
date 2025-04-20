
import { Competitor, Insight, ScrapeTarget, ApiSource, ScraperCode, InsightAnalysis, InsightReport } from '@/types/competitors';
import { toast } from '@/hooks/use-toast';

class CompetitorService {
  // Use localStorage to persist data in the demo
  private getItem<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Get data from storage
  private get competitors(): Competitor[] {
    return this.getItem<Competitor[]>('competitors', []);
  }

  private set competitors(value: Competitor[]) {
    this.setItem('competitors', value);
  }

  private get insights(): Insight[] {
    return this.getItem<Insight[]>('insights', []);
  }

  private set insights(value: Insight[]) {
    this.setItem('insights', value);
  }

  private get scrapeTargets(): ScrapeTarget[] {
    return this.getItem<ScrapeTarget[]>('scrapeTargets', []);
  }

  private set scrapeTargets(value: ScrapeTarget[]) {
    this.setItem('scrapeTargets', value);
  }

  private get scraperCodes(): ScraperCode[] {
    return this.getItem<ScraperCode[]>('scraperCodes', []);
  }

  private set scraperCodes(value: ScraperCode[]) {
    this.setItem('scraperCodes', value);
  }

  private get insightAnalyses(): InsightAnalysis[] {
    return this.getItem<InsightAnalysis[]>('insightAnalyses', []);
  }

  private set insightAnalyses(value: InsightAnalysis[]) {
    this.setItem('insightAnalyses', value);
  }

  private get insightReports(): InsightReport[] {
    return this.getItem<InsightReport[]>('insightReports', []);
  }

  private set insightReports(value: InsightReport[]) {
    this.setItem('insightReports', value);
  }

  // Default API sources
  private apiSources: ApiSource[] = [
    {
      id: 1,
      title: "PatentsView API",
      description: "Fetch recent patent filings for a given competitor",
      api_url: "https://search.patentsview.org/api/v1/patents/query",
      method: "GET",
      params: {
        q: '{"assignee_organization":"<COMPETITOR_NAME>"}',
        f: '["patent_title","patent_date"]'
      },
      requiresKey: false,
      category: "patents",
      status: "active"
    },
    {
      id: 2,
      title: "NewsAPI (Media Mentions)",
      description: "Pull news articles mentioning competitors",
      api_url: "https://newsapi.org/v2/everything",
      method: "GET",
      params: {
        q: "<COMPETITOR_NAME>",
        apiKey: "YOUR_NEWSAPI_KEY"
      },
      requiresKey: true,
      category: "news",
      status: "active"
    },
    {
      id: 3,
      title: "RemoteOK Jobs API",
      description: "Monitor remote hiring trends in startups",
      api_url: "https://remoteok.com/api",
      method: "GET",
      requiresKey: false,
      category: "jobs",
      status: "active"
    },
    {
      id: 4,
      title: "Reddit via Pushshift",
      description: "Monitor Reddit comments about a competitor",
      api_url: "https://api.pushshift.io/reddit/search/comment/",
      method: "GET",
      params: {
        q: "<COMPETITOR_NAME>"
      },
      requiresKey: false,
      category: "social",
      status: "active"
    },
    {
      id: 5,
      title: "OpenCorporates Company Search",
      description: "Retrieve basic registration and legal data about companies",
      api_url: "https://api.opencorporates.com/v0.4/companies/search",
      method: "GET",
      params: {
        q: "<COMPETITOR_NAME>"
      },
      requiresKey: false,
      category: "company",
      status: "active"
    },
    {
      id: 6,
      title: "GlobeNewswire RSS Parser",
      description: "Parse press releases for strategic updates",
      method: "RSS",
      rss_url: "https://www.globenewswire.com/rss-feed/organization/<COMPETITOR>.xml",
      requiresKey: false,
      category: "pr",
      status: "active"
    },
    {
      id: 7,
      title: "SEC EDGAR API (Filings)",
      description: "Retrieve public company filings (e.g., 10-K, S-1)",
      api_url: "https://data.sec.gov/submissions/<CIK_ID>.json",
      method: "GET",
      requiresKey: false,
      category: "financial",
      status: "active"
    },
    {
      id: 8,
      title: "GitHub Public Repos",
      description: "Track open-source activities of competitor teams",
      api_url: "https://api.github.com/users/<GITHUB_USERNAME>/repos",
      method: "GET",
      requiresKey: false,
      category: "opensource",
      status: "active"
    },
    {
      id: 9,
      title: "CoinGecko API",
      description: "Retrieve project token data for crypto/web3 competitors",
      api_url: "https://api.coingecko.com/api/v3/coins/<COMPETITOR>",
      method: "GET",
      requiresKey: false,
      category: "crypto",
      status: "active"
    },
    {
      id: 10,
      title: "World Bank Economic Indicators",
      description: "Retrieve macroeconomic and industry indicators",
      api_url: "https://api.worldbank.org/v2/country/<COUNTRY>/indicator/<INDICATOR>?format=json",
      method: "GET",
      requiresKey: false,
      category: "economic",
      status: "active"
    }
  ];

  async addCompetitor(competitor: Omit<Competitor, 'id'>): Promise<Competitor> {
    const competitors = this.competitors;
    const newCompetitor = {
      ...competitor,
      id: Date.now(),
      lastUpdated: new Date().toISOString(),
      sentimentScore: 50 + Math.floor(Math.random() * 30), // Random score between 50-80
      logo: '/placeholder.svg', // Default logo
    };
    
    this.competitors = [...competitors, newCompetitor];
    
    toast({
      title: "Competitor Added",
      description: `${newCompetitor.name} has been added to your tracking list`,
    });
    
    return newCompetitor;
  }

  async getCompetitors(): Promise<Competitor[]> {
    // Return mock data if no competitors exist yet
    if (this.competitors.length === 0) {
      const mockCompetitors: Competitor[] = [
        {
          id: 1,
          name: "TechGiant Inc",
          website: "https://techgiant.example.com",
          logo: "/placeholder.svg",
          description: "Leading provider of enterprise AI solutions with a focus on NLP and computer vision applications.",
          industryPositioning: "Enterprise AI",
          sentimentScore: 78,
          lastUpdated: new Date().toISOString(),
          country: "USA"
        },
        {
          id: 2,
          name: "DataCrunch Solutions",
          website: "https://datacrunch.example.com",
          logo: "/placeholder.svg",
          description: "Data analytics platform focusing on business intelligence and predictive modeling for mid-market companies.",
          industryPositioning: "Business Intelligence",
          sentimentScore: 65,
          lastUpdated: new Date().toISOString(),
          country: "Canada"
        },
        {
          id: 3,
          name: "CloudScale Technologies",
          website: "https://cloudscale.example.com",
          logo: "/placeholder.svg",
          description: "Cloud infrastructure provider with specialized solutions for machine learning workloads and data processing.",
          industryPositioning: "Cloud Infrastructure",
          sentimentScore: 82,
          lastUpdated: new Date().toISOString(),
          country: "Germany"
        }
      ];
      
      // Store mock data for future use
      this.competitors = mockCompetitors;
    }
    
    return this.competitors;
  }

  async getCompetitor(id: number): Promise<Competitor | undefined> {
    return this.competitors.find(c => c.id === id);
  }

  async updateCompetitor(id: number, data: Partial<Competitor>): Promise<Competitor | undefined> {
    const competitors = this.competitors;
    const index = competitors.findIndex(c => c.id === id);
    
    if (index !== -1) {
      const updatedCompetitor = {
        ...competitors[index],
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      
      competitors[index] = updatedCompetitor;
      this.competitors = competitors;
      
      toast({
        title: "Competitor Updated",
        description: `${updatedCompetitor.name} has been updated`,
      });
      
      return updatedCompetitor;
    }
    
    return undefined;
  }

  async deleteCompetitor(id: number): Promise<boolean> {
    const competitors = this.competitors;
    const index = competitors.findIndex(c => c.id === id);
    
    if (index !== -1) {
      const competitorName = competitors[index].name;
      this.competitors = competitors.filter(c => c.id !== id);
      
      // Also delete related data
      this.insights = this.insights.filter(i => i.competitorId !== id);
      this.scrapeTargets = this.scrapeTargets.filter(t => t.competitorId !== id);
      this.scraperCodes = this.scraperCodes.filter(s => s.competitorId !== id);
      this.insightReports = this.insightReports.filter(r => r.competitorId !== id);
      
      toast({
        title: "Competitor Deleted",
        description: `${competitorName} has been removed from tracking`,
      });
      
      return true;
    }
    
    return false;
  }

  async addInsight(insight: Omit<Insight, 'id'>): Promise<Insight> {
    const insights = this.insights;
    const newInsight = {
      ...insight,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    
    this.insights = [...insights, newInsight];
    return newInsight;
  }

  async getInsights(competitorId?: number): Promise<Insight[]> {
    // Return mock data if no insights exist yet
    if (this.insights.length === 0) {
      const mockInsights: Insight[] = [
        {
          id: 101,
          competitorId: 1,
          type: 'product',
          title: "TechGiant Launches New AI Platform",
          description: "TechGiant has released a new enterprise AI platform with advanced NLP capabilities.",
          source: "Company Blog",
          date: new Date().toISOString(),
          sentiment: 'positive',
          impact: 'high'
        },
        {
          id: 102,
          competitorId: 1,
          type: 'hiring',
          title: "TechGiant Hiring ML Engineers",
          description: "TechGiant is expanding their machine learning team with 15 new positions.",
          source: "LinkedIn",
          date: new Date().toISOString(),
          sentiment: 'neutral',
          impact: 'medium'
        },
        {
          id: 103,
          competitorId: 2,
          type: 'pricing',
          title: "DataCrunch Reduces Enterprise Pricing",
          description: "DataCrunch announced a 15% reduction in their enterprise plan pricing.",
          source: "Press Release",
          date: new Date().toISOString(),
          sentiment: 'negative',
          impact: 'high'
        },
        {
          id: 104,
          competitorId: 3,
          type: 'expansion',
          title: "CloudScale Expands to Asia Pacific",
          description: "CloudScale has opened new data centers in Singapore and Tokyo.",
          source: "News Article",
          date: new Date().toISOString(),
          sentiment: 'positive',
          impact: 'medium'
        }
      ];
      
      // Store mock data for future use
      this.insights = mockInsights;
    }
    
    return competitorId 
      ? this.insights.filter(i => i.competitorId === competitorId)
      : this.insights;
  }

  async addScrapeTarget(target: Omit<ScrapeTarget, 'id' | 'status' | 'lastScraped' | 'nextScheduled'>): Promise<ScrapeTarget> {
    const targets = this.scrapeTargets;
    const newTarget: ScrapeTarget = {
      ...target,
      id: Date.now(),
      status: 'active' as const,
      lastScraped: null,
      nextScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    
    this.scrapeTargets = [...targets, newTarget];
    
    toast({
      title: "Scrape Target Added",
      description: `Added ${target.url} to scraping targets`,
    });
    
    return newTarget;
  }

  async getScrapeTargets(): Promise<ScrapeTarget[]> {
    // Return mock data if no targets exist yet
    if (this.scrapeTargets.length === 0) {
      // Initialize with empty array - we'll add targets through the UI
      this.scrapeTargets = [];
    }
    return this.scrapeTargets;
  }

  async toggleScrapeTarget(id: number): Promise<ScrapeTarget | undefined> {
    const targets = this.scrapeTargets;
    const index = targets.findIndex(t => t.id === id);
    
    if (index !== -1) {
      // Fix: Use a properly typed status value
      const newStatus = targets[index].status === 'active' ? 'paused' as const : 'active' as const;
      const updatedTarget: ScrapeTarget = { 
        ...targets[index], 
        status: newStatus 
      };
      
      targets[index] = updatedTarget;
      this.scrapeTargets = targets;
      
      toast({
        title: `Target ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
        description: `Scraping for ${updatedTarget.url} is now ${newStatus}`,
      });
      
      return updatedTarget;
    }
    
    return undefined;
  }

  async deleteScrapeTarget(id: number): Promise<void> {
    const targets = this.scrapeTargets;
    const target = targets.find(t => t.id === id);
    
    if (target) {
      this.scrapeTargets = targets.filter(t => t.id !== id);
      
      toast({
        title: "Target Removed",
        description: `Removed ${target.url} from scraping targets`,
      });
    }
  }

  async getApiSources(category?: string): Promise<ApiSource[]> {
    if (category && category !== 'all') {
      return this.apiSources.filter(api => api.category === category);
    }
    return this.apiSources;
  }

  async getApiSource(id: number): Promise<ApiSource | undefined> {
    return this.apiSources.find(api => api.id === id);
  }

  // Methods for custom scrapers
  async addScraperCode(scraperCode: Omit<ScraperCode, 'id'>): Promise<ScraperCode> {
    const scrapers = this.scraperCodes;
    const newScraperCode: ScraperCode = {
      ...scraperCode,
      id: Date.now(),
    };
    
    this.scraperCodes = [...scrapers, newScraperCode];
    
    toast({
      title: "Custom Scraper Created",
      description: `Scraper for ${scraperCode.url} has been created using DeepSeek Coder AI`,
    });
    
    return newScraperCode;
  }

  async getScraperCodes(competitorId?: number): Promise<ScraperCode[]> {
    return competitorId
      ? this.scraperCodes.filter(c => c.competitorId === competitorId)
      : this.scraperCodes;
  }

  // Methods for insight analysis
  async addInsightAnalysis(analysis: Omit<InsightAnalysis, 'id'>): Promise<InsightAnalysis> {
    const analyses = this.insightAnalyses;
    const newAnalysis: InsightAnalysis = {
      ...analysis,
      id: Date.now(),
    };
    
    this.insightAnalyses = [...analyses, newAnalysis];
    return newAnalysis;
  }

  async getInsightAnalyses(insightId?: number): Promise<InsightAnalysis[]> {
    return insightId
      ? this.insightAnalyses.filter(a => a.insightId === insightId)
      : this.insightAnalyses;
  }

  // Methods for insight reports
  async addInsightReport(report: InsightReport): Promise<InsightReport> {
    const reports = this.insightReports;
    this.insightReports = [...reports, report];
    
    toast({
      title: "Report Generated",
      description: `New insight report for ${report.competitorName} is available`,
    });
    
    return report;
  }

  async getInsightReports(competitorId?: number): Promise<InsightReport[]> {
    return competitorId
      ? this.insightReports.filter(r => r.competitorId === competitorId)
      : this.insightReports;
  }
}

export const competitorService = new CompetitorService();
