
import { ApiSource, Insight, InsightAnalysis, InsightReport, ScraperCode } from "@/types/competitors";
import { getInsights, extractStructuredData, generateScraper, analyzeCompetitorStrategy, formatInsightReport } from "./openRouter";

export class ScraperService {
  private static getConfigFromStorage() {
    const config = localStorage.getItem('scraperConfig');
    return config ? JSON.parse(config) : {};
  }

  static async setConfig(newConfig: {openrouterKey?: string, openaiKey?: string, newsApiKey?: string}) {
    const currentConfig = this.getConfigFromStorage();
    const updatedConfig = { ...currentConfig, ...newConfig };
    localStorage.setItem('scraperConfig', JSON.stringify(updatedConfig));
    return updatedConfig;
  }

  static getConfig() {
    return this.getConfigFromStorage();
  }

  static async testApiKey(key: string, type: 'openai' | 'openrouter' | 'newsapi'): Promise<boolean> {
    try {
      switch (type) {
        case 'openrouter':
          // Test with a simple Claude query
          const response = await getInsights("Test message", key);
          return response.length > 0;
          
        case 'newsapi':
          const newsResponse = await fetch(`https://newsapi.org/v2/everything?q=test&apiKey=${key}`);
          return newsResponse.ok;
          
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${key}` }
          });
          return openaiResponse.ok;
          
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error testing ${type} API key:`, error);
      return false;
    }
  }

  // Generate insights from API sources
  static async runScraper(
    apiSource: ApiSource,
    competitorId: number,
    competitorName: string
  ): Promise<Insight[]> {
    try {
      const config = this.getConfig();
      
      if (!config.openrouterKey) {
        throw new Error("OpenRouter API key is required to generate insights");
      }

      // Mock data for demonstration purposes
      // In a real implementation, this would use the apiSource to fetch data
      console.log(`Running scraper for ${competitorName} using ${apiSource.title}`);
      
      const mockSources = [
        `${competitorName} has launched a new product targeting the enterprise market`,
        `${competitorName} hired a new CTO from a major tech company`,
        `${competitorName} was featured in TechCrunch for their innovative approach`,
        `${competitorName} reported a 25% increase in quarterly revenue`,
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate insights using the AI
      const insights: Insight[] = await Promise.all(
        mockSources.map(async (source, index) => {
          const analysis = await getInsights(`${source} - from ${apiSource.title}`, config.openrouterKey);
          
          return {
            id: Date.now() + index,
            competitorId,
            title: `${apiSource.category} Insight ${index + 1}`,
            description: analysis.substring(0, 200) + (analysis.length > 200 ? '...' : ''),
            source: apiSource.title,
            sourceUrl: apiSource.api_url || apiSource.rss_url || '',
            sourceType: apiSource.category,
            sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
            date: new Date().toISOString(),
            // Add required fields from Insight type
            type: 'news' as 'product' | 'hiring' | 'expansion' | 'pricing' | 'news' | 'patent' | 'financial' | 'social' | 'opensource',
            impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
            // Store the full content as raw data
            rawData: { fullContent: analysis }
          };
        })
      );

      return insights;
    } catch (error) {
      console.error("Error running scraper:", error);
      throw error;
    }
  }

  // Analyze insights using AI
  static async analyzeInsights(
    insights: Insight[],
    competitorName: string
  ): Promise<InsightAnalysis> {
    try {
      const config = this.getConfig();
      
      if (!config.openrouterKey) {
        throw new Error("OpenRouter API key is required to analyze insights");
      }

      // Combine all insights into a single document for analysis
      const insightsText = insights
        .map(insight => `Source: ${insight.source}\nTitle: ${insight.title}\nDescription: ${insight.description}\nFull Content: ${insight.rawData?.fullContent || ''}\n`)
        .join('\n---\n');

      // Use Claude to analyze the insights
      const analysisText = await analyzeCompetitorStrategy(
        `Insights about ${competitorName}:\n\n${insightsText}`,
        config.openrouterKey
      );

      // Create an analysis object that matches the InsightAnalysis type
      return {
        id: Date.now(),
        insightId: insights[0]?.id || 0,
        summary: analysisText,
        productStrategy: extractRelevantSection(analysisText, "Product Strategy"),
        marketPositioning: extractRelevantSection(analysisText, "Market Positioning"),
        gaps: extractRelevantSection(analysisText, "Gaps"),
        threatLevel: determineLevel(analysisText) as 'high' | 'medium' | 'low',
        opportunities: extractRelevantSection(analysisText, "Opportunities"),
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error analyzing insights:", error);
      throw error;
    }
  }

  // Generate a formatted report
  static async generateReport(
    analysis: InsightAnalysis,
    insights: Insight[],
    competitorName: string,
    competitorId: number
  ): Promise<InsightReport> {
    try {
      const config = this.getConfig();
      
      if (!config.openrouterKey) {
        throw new Error("OpenRouter API key is required to generate report");
      }

      // Use GPT-4 to format the report
      const formattedReport = await formatInsightReport(
        analysis.summary,
        config.openrouterKey
      );

      // Extract sections from the markdown report
      const overviewMatch = formattedReport.match(/## Overview\s+([\s\S]*?)(?=##|$)/);
      const keyMovesMatch = formattedReport.match(/## Key Moves\s+([\s\S]*?)(?=##|$)/);
      const threatLevelMatch = formattedReport.match(/## Threat Level\s+([\s\S]*?)(?=##|$)/);
      const opportunitiesMatch = formattedReport.match(/## Opportunities\s+([\s\S]*?)(?=##|$)/);

      // Parse the key moves and opportunities into bullet points
      const parseSection = (section: string | null): string[] => {
        if (!section) return [];
        
        // Extract bullet points (lines starting with -)
        const bulletPoints = section.match(/- (.*?)(?=\n|$)/g);
        if (!bulletPoints) return [section.trim()];
        
        return bulletPoints.map(point => point.replace(/^- /, '').trim());
      };

      const threatLevel = threatLevelMatch ? 
        (threatLevelMatch[1].toLowerCase().includes('high') ? 'high' : 
         threatLevelMatch[1].toLowerCase().includes('medium') ? 'medium' : 'low') : 
        'medium';

      return {
        competitorId,
        competitorName,
        overview: overviewMatch ? overviewMatch[1].trim() : "No overview available",
        keyMoves: parseSection(keyMovesMatch ? keyMovesMatch[1] : null),
        threatLevel: threatLevel as 'high' | 'medium' | 'low',
        opportunities: parseSection(opportunitiesMatch ? opportunitiesMatch[1] : null),
        insights: insights.slice(0, 5), // Include the top 5 insights
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  }

  // Generate a custom scraper using the DeepSeek Coder AI
  static async generateCustomScraper(
    url: string,
    competitorName: string
  ): Promise<ScraperCode | null> {
    try {
      const config = this.getConfig();
      
      if (!config.openrouterKey) {
        throw new Error("OpenRouter API key is required to generate scraper code");
      }

      // Use DeepSeek Coder to generate the scraper
      const code = await generateScraper(url, config.openrouterKey);

      if (!code) {
        throw new Error("Failed to generate scraper code");
      }

      // Create a scraper code object matching the ScraperCode type
      return {
        id: Date.now(),
        competitorId: 0, // This will be assigned by the calling code
        url: url,
        code: code,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active' as 'active' | 'paused' | 'error'
      };
    } catch (error) {
      console.error("Error generating custom scraper:", error);
      throw error;
    }
  }

  // Implement the Kaggle scraper functionality with AI analysis
  static async runKaggleScraper(competitorId: number, competitorName: string): Promise<Insight[]> {
    try {
      const config = this.getConfig();
      
      if (!config.openrouterKey) {
        throw new Error("OpenRouter API key is required to run the Kaggle scraper");
      }

      // Since we can't actually run the Node.js scraper in the browser,
      // we'll simulate it with some mock data
      console.log(`Running Kaggle scraper for ${competitorName}`);
      
      const mockKaggleDatasets = [
        {
          title: "COVID-19 Dataset",
          creator: "Johns Hopkins",
          downloads: "250K+",
          tags: ["healthcare", "pandemic", "visualization"],
          description: "Comprehensive COVID-19 data including cases, deaths, and recoveries worldwide",
          url: "https://www.kaggle.com/datasets/johnsHopkins/covid19"
        },
        {
          title: "Customer Segmentation Dataset",
          creator: "IBM",
          downloads: "125K+",
          tags: ["marketing", "machine-learning", "clustering"],
          description: "Customer behavior data for segmentation and targeting",
          url: "https://www.kaggle.com/datasets/ibm/customer-segmentation"
        },
        {
          title: "Financial Market Data",
          creator: `${competitorName} Research`,
          downloads: "75K+",
          tags: ["finance", "stocks", "prediction"],
          description: "Historical stock data with technical indicators",
          url: `https://www.kaggle.com/datasets/${competitorName.toLowerCase()}/financial-markets`
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate analysis using Claude
      const analysis = await queryOpenRouter("anthropic/claude-3-sonnet", [
        { 
          role: "system", 
          content: "You are a Kaggle dataset analyst AI. Provide summaries and insights." 
        },
        { 
          role: "user", 
          content: `Analyze the following datasets from Kaggle and summarize the common themes, popular categories, and competitive intelligence insights:\n\n${JSON.stringify(mockKaggleDatasets, null, 2)}` 
        }
      ], config.openrouterKey);

      // Create insights from the analysis that match the Insight type
      const insights: Insight[] = mockKaggleDatasets.map((dataset, index) => ({
        id: Date.now() + index,
        competitorId,
        title: `Kaggle Dataset: ${dataset.title}`,
        description: dataset.description,
        source: "Kaggle",
        sourceUrl: dataset.url,
        sourceType: "datasets",
        sentiment: dataset.creator.includes(competitorName) ? "positive" as 'positive' : "neutral" as 'neutral',
        date: new Date().toISOString(),
        // Required fields from Insight type
        type: 'opensource' as 'product' | 'hiring' | 'expansion' | 'pricing' | 'news' | 'patent' | 'financial' | 'social' | 'opensource',
        impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        // Store the full content as raw data
        rawData: { fullContent: analysis }
      }));

      return insights;
    } catch (error) {
      console.error("Error running Kaggle scraper:", error);
      throw error;
    }
  }
}

// Helper function for the Kaggle scraper
async function queryOpenRouter(model: string, messages: { role: string; content: string }[], apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
        'X-Title': 'Competitive Intelligence Scraper',
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response";
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

// Helper function to extract sections from the analysis text
function extractRelevantSection(text: string, sectionName: string): string | undefined {
  const sectionRegex = new RegExp(`## ${sectionName}\\s+([\\s\\S]*?)(?=##|$)`, 'i');
  const match = text.match(sectionRegex);
  return match ? match[1].trim() : undefined;
}

// Helper function to determine threat level from analysis text
function determineLevel(text: string): string {
  const lowercaseText = text.toLowerCase();
  if (lowercaseText.includes('high threat') || lowercaseText.includes('severe') || 
      lowercaseText.includes('critical') || lowercaseText.includes('major threat')) {
    return 'high';
  } else if (lowercaseText.includes('medium threat') || lowercaseText.includes('moderate')) {
    return 'medium';
  } else {
    return 'low';
  }
}
