
export interface Competitor {
  id: number;
  name: string;
  website: string;
  logo?: string; // Making this optional
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

export interface ApiSource {
  id: number;
  title: string;
  description: string;
  api_url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'RSS';
  params?: Record<string, string>;
  rss_url?: string;
  requiresKey: boolean;
  category: 'patents' | 'news' | 'jobs' | 'social' | 'company' | 'pr' | 'financial' | 'opensource' | 'crypto' | 'economic';
}
