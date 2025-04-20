
export interface Competitor {
  id: number;
  name: string;
  website: string;
  description: string;
  industryPositioning: string;
  sentimentScore: number;
  lastUpdated: string;
}

export interface Insight {
  id: number;
  competitorId: number;
  type: 'product' | 'hiring' | 'expansion' | 'pricing' | 'news';
  title: string;
  description: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

export interface ScrapeTarget {
  id: number;
  competitorId: number;
  type: 'website' | 'linkedin' | 'news' | 'jobs';
  url: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'error';
  lastScraped: string | null;
  nextScheduled: string | null;
}
