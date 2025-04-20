
import { toast } from '@/hooks/use-toast';

interface ScraperConfig {
  competitorName: string;
  githubUsername?: string;
  country?: string;
  indicator?: string;
  cikId?: string;
  newsApiKey?: string;
}

export class ScraperService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async fetchPatentsView(competitorName: string) {
    try {
      const url = `https://search.patentsview.org/api/v1/patents/query?q={"assignee_organization":"${competitorName}"}&f=["patent_title","patent_date"]`;
      const response = await this.fetchWithTimeout(url);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching patents data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchNewsAPI(competitorName: string, apiKey: string) {
    try {
      const url = `https://newsapi.org/v2/everything?q=${competitorName}&apiKey=${apiKey}`;
      const response = await this.fetchWithTimeout(url);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching news data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchRemoteJobs() {
    try {
      const response = await this.fetchWithTimeout("https://remoteok.com/api");
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching remote jobs",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchRedditMentions(competitorName: string) {
    try {
      const url = `https://api.pushshift.io/reddit/search/comment/?q=${competitorName}`;
      const response = await this.fetchWithTimeout(url);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching Reddit mentions",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchCompanyInfo(competitorName: string) {
    try {
      const url = `https://api.opencorporates.com/v0.4/companies/search?q=${competitorName}`;
      const response = await this.fetchWithTimeout(url);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching company info",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchPressReleases(competitorName: string) {
    try {
      const url = `https://www.globenewswire.com/rss-feed/organization/${competitorName}.xml`;
      const response = await this.fetchWithTimeout(url);
      const text = await response.text();
      return text;
    } catch (error) {
      toast({
        title: "Error fetching press releases",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchSECFilings(cikId: string) {
    try {
      const url = `https://data.sec.gov/submissions/CIK${cikId}.json`;
      const response = await this.fetchWithTimeout(url);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching SEC filings",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchGitHubRepos(username: string) {
    try {
      const url = `https://api.github.com/users/${username}/repos`;
      const response = await this.fetchWithTimeout(url);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching GitHub repos",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchCryptoData(competitorName: string) {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${competitorName.toLowerCase()}`;
      const response = await this.fetchWithTimeout(url);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching crypto data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async fetchEconomicIndicators(country: string, indicator: string) {
    try {
      const url = `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json`;
      const response = await this.fetchWithTimeout(url);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error fetching economic indicators",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }

  async runAllScrapers(config: ScraperConfig) {
    const results = {
      patents: await this.fetchPatentsView(config.competitorName),
      news: config.newsApiKey ? await this.fetchNewsAPI(config.competitorName, config.newsApiKey) : null,
      jobs: await this.fetchRemoteJobs(),
      reddit: await this.fetchRedditMentions(config.competitorName),
      company: await this.fetchCompanyInfo(config.competitorName),
      pressReleases: await this.fetchPressReleases(config.competitorName),
      secFilings: config.cikId ? await this.fetchSECFilings(config.cikId) : null,
      githubRepos: config.githubUsername ? await this.fetchGitHubRepos(config.githubUsername) : null,
      cryptoData: await this.fetchCryptoData(config.competitorName),
      economicIndicators: config.country && config.indicator ? 
        await this.fetchEconomicIndicators(config.country, config.indicator) : null
    };

    return results;
  }
}

export const scraperService = new ScraperService();

