
import { Competitor, Insight, ScrapeTarget, ApiSource } from '@/types/competitors';

// This would be replaced with real API calls once connected to a backend
export class CompetitorService {
  private competitors: Competitor[] = [];
  private insights: Insight[] = [];
  private scrapeTargets: ScrapeTarget[] = [];
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
      category: "patents"
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
      category: "news"
    },
    {
      id: 3,
      title: "RemoteOK Jobs API",
      description: "Monitor remote hiring trends in startups",
      api_url: "https://remoteok.com/api",
      method: "GET",
      requiresKey: false,
      category: "jobs"
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
      category: "social"
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
      category: "company"
    },
    {
      id: 6,
      title: "GlobeNewswire RSS Parser",
      description: "Parse press releases for strategic updates",
      method: "RSS",
      rss_url: "https://www.globenewswire.com/rss-feed/organization/<COMPETITOR>.xml",
      requiresKey: false,
      category: "pr"
    },
    {
      id: 7,
      title: "SEC EDGAR API (Filings)",
      description: "Retrieve public company filings (e.g., 10-K, S-1)",
      api_url: "https://data.sec.gov/submissions/<CIK_ID>.json",
      method: "GET",
      requiresKey: false,
      category: "financial"
    },
    {
      id: 8,
      title: "GitHub Public Repos",
      description: "Track open-source activities of competitor teams",
      api_url: "https://api.github.com/users/<GITHUB_USERNAME>/repos",
      method: "GET",
      requiresKey: false,
      category: "opensource"
    },
    {
      id: 9,
      title: "CoinGecko API",
      description: "Retrieve project token data for crypto/web3 competitors",
      api_url: "https://api.coingecko.com/api/v3/coins/<COMPETITOR>",
      method: "GET",
      requiresKey: false,
      category: "crypto"
    },
    {
      id: 10,
      title: "World Bank Economic Indicators",
      description: "Retrieve macroeconomic and industry indicators",
      api_url: "https://api.worldbank.org/v2/country/<COUNTRY>/indicator/<INDICATOR>?format=json",
      method: "GET",
      requiresKey: false,
      category: "economic"
    }
  ];

  async addCompetitor(competitor: Omit<Competitor, 'id'>): Promise<Competitor> {
    const newCompetitor = {
      ...competitor,
      id: Math.floor(Math.random() * 10000),
      lastUpdated: new Date().toISOString(),
      sentimentScore: 50,
      logo: '/placeholder.svg', // Adding default logo
    };
    this.competitors.push(newCompetitor);
    return newCompetitor;
  }

  async getCompetitors(): Promise<Competitor[]> {
    return this.competitors;
  }

  async getCompetitor(id: number): Promise<Competitor | undefined> {
    return this.competitors.find(c => c.id === id);
  }

  async addInsight(insight: Omit<Insight, 'id'>): Promise<Insight> {
    const newInsight = {
      ...insight,
      id: Math.floor(Math.random() * 10000),
      date: new Date().toISOString(),
    };
    this.insights.push(newInsight);
    return newInsight;
  }

  async getInsights(competitorId?: number): Promise<Insight[]> {
    return competitorId 
      ? this.insights.filter(i => i.competitorId === competitorId)
      : this.insights;
  }

  async addScrapeTarget(target: Omit<ScrapeTarget, 'id' | 'status' | 'lastScraped' | 'nextScheduled'>): Promise<ScrapeTarget> {
    const newTarget: ScrapeTarget = {
      ...target,
      id: Math.floor(Math.random() * 10000),
      status: 'active' as const, // Using a const assertion to ensure type safety
      lastScraped: null,
      nextScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    this.scrapeTargets.push(newTarget);
    return newTarget;
  }

  async getScrapeTargets(): Promise<ScrapeTarget[]> {
    return this.scrapeTargets;
  }

  async toggleScrapeTarget(id: number): Promise<ScrapeTarget | undefined> {
    const target = this.scrapeTargets.find(t => t.id === id);
    if (target) {
      target.status = target.status === 'active' ? 'paused' : 'active';
      return target;
    }
  }

  async deleteScrapeTarget(id: number): Promise<void> {
    const index = this.scrapeTargets.findIndex(t => t.id === id);
    if (index !== -1) {
      this.scrapeTargets.splice(index, 1);
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
}

export const competitorService = new CompetitorService();
