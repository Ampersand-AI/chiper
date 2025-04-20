
export interface Competitor {
  id: number;
  name: string;
  website: string;
  logo?: string; // Making this optional
  description: string;
  industryPositioning: string;
  sentimentScore: number;
  lastUpdated: string;
  githubUsername?: string;
  cikId?: string;
  country?: string;
}

export interface Insight {
  id: number;
  competitorId: number;
  type: 'product' | 'hiring' | 'expansion' | 'pricing' | 'news' | 'patent' | 'financial' | 'social' | 'opensource';
  title: string;
  description: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  rawData?: any; // For storing the original API response
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
  api_url?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'RSS';
  params?: Record<string, string>;
  rss_url?: string;
  requiresKey: boolean;
  category: 'patents' | 'news' | 'jobs' | 'social' | 'company' | 'pr' | 'financial' | 'opensource' | 'crypto' | 'economic';
  status?: 'active' | 'error' | 'paused';
  lastRun?: string;
}

export interface ScraperConfig {
  openaiKey?: string;
  openrouterKey?: string;
  newsApiKey?: string;
  enabled: boolean;
}

// For custom scraper generation
export interface ScraperCode {
  id: number;
  competitorId: number;
  url: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'paused' | 'error';
}

// For insight processing
export interface InsightAnalysis {
  id: number;
  insightId: number;
  summary: string;
  productStrategy?: string;
  marketPositioning?: string;
  gaps?: string;
  threatLevel?: 'high' | 'medium' | 'low';
  opportunities?: string;
  createdAt: string;
}

export type InsightReport = {
  competitorId: number;
  competitorName: string;
  overview: string;
  keyMoves: string[];
  threatLevel: 'high' | 'medium' | 'low';
  opportunities: string[];
  insights: Insight[];
  lastUpdated: string;
}
