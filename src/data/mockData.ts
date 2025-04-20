// Mock data for the demo
import { getRandomNumber, generateChartData } from '@/lib/utils';

export interface Competitor {
  id: number;
  name: string;
  website: string;
  logo: string;
  description: string;
  industryPositioning: string;
  lastUpdated: string;
  sentimentScore: number;
}

export interface Insight {
  id: number;
  competitorId: number;
  title: string;
  description: string;
  source: string;
  type: 'product' | 'hiring' | 'expansion' | 'pricing' | 'news';
  sentiment: 'positive' | 'negative' | 'neutral';
  date: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ScrapeTarget {
  id: number;
  competitorId: number;
  url: string;
  type: 'website' | 'linkedin' | 'news' | 'jobs';
  status: 'active' | 'paused' | 'error';
  frequency: 'daily' | 'weekly' | 'monthly';
  lastScraped: string | null;
  nextScheduled: string;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  date: string;
  competitors: number[];
  insights: number[];
  downloadUrl: string;
}

export const mockCompetitors: Competitor[] = [
  {
    id: 1,
    name: 'Acme Analytics',
    website: 'acmeanalytics.com',
    logo: '/placeholder.svg',
    description: 'Market leader in business intelligence software with a focus on data visualization.',
    industryPositioning: 'Enterprise BI Solutions',
    lastUpdated: '2025-04-15',
    sentimentScore: 78
  },
  {
    id: 2,
    name: 'DataVision Inc',
    website: 'datavision.com',
    logo: '/placeholder.svg',
    description: 'Specialized in real-time analytics and dashboarding for mid-market companies.',
    industryPositioning: 'Mid-market Analytics',
    lastUpdated: '2025-04-12',
    sentimentScore: 82
  },
  {
    id: 3,
    name: 'InsightPro',
    website: 'insightpro.ai',
    logo: '/placeholder.svg',
    description: 'AI-powered analytics startup focusing on predictive insights and automation.',
    industryPositioning: 'AI-First Analytics',
    lastUpdated: '2025-04-18',
    sentimentScore: 91
  },
  {
    id: 4,
    name: 'MetricMasters',
    website: 'metricmasters.io',
    logo: '/placeholder.svg',
    description: 'Self-service analytics platform with a focus on usability and quick adoption.',
    industryPositioning: 'Self-service Analytics',
    lastUpdated: '2025-04-10',
    sentimentScore: 65
  }
];

// Generate insight types and sentiments for random distribution
const insightTypes: ('product' | 'hiring' | 'expansion' | 'pricing' | 'news')[] = 
  ['product', 'hiring', 'expansion', 'pricing', 'news'];
const sentiments: ('positive' | 'negative' | 'neutral')[] = 
  ['positive', 'negative', 'neutral'];
const impacts: ('high' | 'medium' | 'low')[] = 
  ['high', 'medium', 'low'];

// Generate mock insights
export const mockInsights: Insight[] = [];

// For each competitor, generate 5-10 insights
mockCompetitors.forEach(competitor => {
  const insightCount = getRandomNumber(5, 10);
  
  for (let i = 0; i < insightCount; i++) {
    const insightType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const impact = impacts[Math.floor(Math.random() * impacts.length)];
    
    // Generate a date within the last 60 days
    const daysAgo = getRandomNumber(1, 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    let title = '';
    let description = '';
    let source = '';
    
    switch (insightType) {
      case 'product':
        title = `${competitor.name} launches new feature`;
        description = `${competitor.name} has launched a new ${['AI-powered', 'integrated', 'automated', 'real-time'][getRandomNumber(0, 3)]} ${['analytics', 'dashboard', 'reporting', 'prediction'][getRandomNumber(0, 3)]} feature.`;
        source = `${competitor.website}/blog`;
        break;
      case 'hiring':
        title = `${competitor.name} hiring for ${['Data Science', 'Engineering', 'Product', 'Sales'][getRandomNumber(0, 3)]} roles`;
        description = `${competitor.name} is expanding their ${['Data Science', 'Engineering', 'Product', 'Sales'][getRandomNumber(0, 3)]} team with multiple job postings.`;
        source = 'linkedin.com';
        break;
      case 'expansion':
        title = `${competitor.name} expands to ${['European', 'Asian', 'Latin American', 'Australian'][getRandomNumber(0, 3)]} market`;
        description = `${competitor.name} has announced their expansion into ${['European', 'Asian', 'Latin American', 'Australian'][getRandomNumber(0, 3)]} markets with new offices and local teams.`;
        source = 'techcrunch.com';
        break;
      case 'pricing':
        title = `${competitor.name} ${['increases', 'reduces', 'restructures'][getRandomNumber(0, 2)]} pricing`;
        description = `${competitor.name} has ${['increased', 'reduced', 'restructured'][getRandomNumber(0, 2)]} their pricing structure, affecting ${['enterprise', 'mid-market', 'small business'][getRandomNumber(0, 2)]} customers.`;
        source = `${competitor.website}/pricing`;
        break;
      case 'news':
        title = `${competitor.name} ${['secures funding', 'partners with enterprise', 'wins award', 'releases quarterly results'][getRandomNumber(0, 3)]}`;
        description = `${competitor.name} has ${['secured $25M in Series B funding', 'announced a strategic partnership', 'won an industry innovation award', 'released strong quarterly results'][getRandomNumber(0, 3)]}.`;
        source = 'businesswire.com';
        break;
    }
    
    mockInsights.push({
      id: mockInsights.length + 1,
      competitorId: competitor.id,
      title,
      description,
      source,
      type: insightType,
      sentiment,
      date: date.toISOString().split('T')[0],
      impact,
    });
  }
});

// Generate mock scrape targets
export const mockScrapeTargets: ScrapeTarget[] = [];

// Define target types for distribution
const targetTypes: ('website' | 'linkedin' | 'news' | 'jobs')[] = 
  ['website', 'linkedin', 'news', 'jobs'];
const frequencies: ('daily' | 'weekly' | 'monthly')[] = 
  ['daily', 'weekly', 'monthly'];
const statuses: ('active' | 'paused' | 'error')[] = 
  ['active', 'active', 'active', 'paused', 'error']; // Weighted for more active

mockCompetitors.forEach(competitor => {
  // Each competitor should have 3-5 scrape targets
  const targetCount = getRandomNumber(3, 5);
  
  for (let i = 0; i < targetCount; i++) {
    const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
    let url = '';
    
    switch (type) {
      case 'website':
        url = `https://www.${competitor.website}/${['products', 'features', 'pricing', ''][getRandomNumber(0, 3)]}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/company/${competitor.name.toLowerCase().replace(' ', '-')}`;
        break;
      case 'news':
        url = `https://news.google.com/search?q=${encodeURIComponent(competitor.name)}`;
        break;
      case 'jobs':
        url = `https://www.indeed.com/jobs?q=${encodeURIComponent(competitor.name)}`;
        break;
    }
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    
    // Generate lastScraped date (if active or error)
    let lastScraped = null;
    if (status !== 'paused') {
      const daysAgo = getRandomNumber(1, 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      lastScraped = date.toISOString().split('T')[0];
    }
    
    // Generate nextScheduled date
    const daysAhead = status === 'paused' ? null : getRandomNumber(1, 30);
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (daysAhead || 0));
    const nextScheduled = daysAhead ? nextDate.toISOString().split('T')[0] : '';
    
    mockScrapeTargets.push({
      id: mockScrapeTargets.length + 1,
      competitorId: competitor.id,
      url,
      type,
      status,
      frequency,
      lastScraped,
      nextScheduled
    });
  }
});

// Generate mock reports
export const mockReports: Report[] = [];

for (let i = 1; i <= 5; i++) {
  // Random date in the last 90 days
  const daysAgo = getRandomNumber(1, 90);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  // Pick 2-4 random competitors
  const compCount = getRandomNumber(2, 4);
  const competitors: number[] = [];
  while (competitors.length < compCount) {
    const compId = getRandomNumber(1, mockCompetitors.length);
    if (!competitors.includes(compId)) {
      competitors.push(compId);
    }
  }
  
  // Pick 5-10 random insights
  const insightCount = getRandomNumber(5, 10);
  const insights: number[] = [];
  while (insights.length < insightCount) {
    const insightId = getRandomNumber(1, mockInsights.length);
    if (!insights.includes(insightId)) {
      insights.push(insightId);
    }
  }
  
  mockReports.push({
    id: i,
    title: [
      'Quarterly Competitive Analysis',
      'Market Positioning Report',
      'Competitive Threat Assessment',
      'Strategic Opportunities Analysis',
      'Industry Landscape Overview'
    ][getRandomNumber(0, 4)],
    description: `Comprehensive analysis of ${compCount} key competitors, highlighting recent market movements and strategic implications.`,
    date: date.toISOString().split('T')[0],
    competitors,
    insights,
    downloadUrl: '#'
  });
}

// Generate chart data for dashboard
export const sentimentTrendData = generateChartData(30, 40, 95);
export const competitorsActivityData = mockCompetitors.map(competitor => ({
  id: competitor.id,
  name: competitor.name,
  data: generateChartData(30, 0, 10).map(item => ({
    ...item,
    value: item.value > 3 ? item.value : 0 // Some days may have zero activity
  }))
}));

// Aggregate insight types by competitor
export interface InsightDistribution {
  competitor: string;
  product: number;
  hiring: number;
  expansion: number;
  pricing: number;
  news: number;
}

export const insightDistributionData: InsightDistribution[] = mockCompetitors.map(competitor => {
  const competitorInsights = mockInsights.filter(insight => insight.competitorId === competitor.id);
  
  return {
    competitor: competitor.name,
    product: competitorInsights.filter(i => i.type === 'product').length,
    hiring: competitorInsights.filter(i => i.type === 'hiring').length,
    expansion: competitorInsights.filter(i => i.type === 'expansion').length,
    pricing: competitorInsights.filter(i => i.type === 'pricing').length,
    news: competitorInsights.filter(i => i.type === 'news').length,
  };
});
