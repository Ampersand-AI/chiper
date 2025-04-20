import { Competitor, Insight, ScrapeTarget } from '@/types/competitors';

// This would be replaced with real API calls once connected to a backend
export class CompetitorService {
  private competitors: Competitor[] = [];
  private insights: Insight[] = [];
  private scrapeTargets: ScrapeTarget[] = [];

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
}

export const competitorService = new CompetitorService();
