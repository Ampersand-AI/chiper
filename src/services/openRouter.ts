
interface Message {
  role: string;
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function queryOpenRouter(model: string, messages: Message[], apiKey?: string): Promise<string> {
  try {
    if (!apiKey || apiKey === 'YOUR_OPENROUTER_API_KEY') {
      throw new Error('No OpenRouter API key provided');
    }

    console.log(`Calling OpenRouter with model: ${model}`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href, // Required by OpenRouter
        'X-Title': 'Competitive Intelligence Scraper', // Optional but helpful
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

    const data = await response.json() as OpenRouterResponse;
    return data.choices[0]?.message?.content || "No response";
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error; // Re-throw to allow proper error handling
  }
}

// Helper functions for specific AI models and use cases
export const getInsights = async (competitorData: string, apiKey?: string): Promise<string> => {
  return queryOpenRouter("anthropic/claude-3-sonnet", [
    { role: "system", content: "You are a competitive strategy expert." },
    { role: "user", content: "Analyze this content from a competitor and highlight positioning, gaps, and market moves:\n\n" + competitorData },
  ], apiKey);
};

export const extractStructuredData = async (webScrapedHtml: string, apiKey?: string): Promise<string> => {
  return queryOpenRouter("openai/gpt-4-turbo", [
    { role: "system", content: "You are an expert at extracting structured info from messy web text." },
    { role: "user", content: "Extract pricing, features, product names and format as JSON:\n\n" + webScrapedHtml },
  ], apiKey);
};

export const generateScraper = async (url: string, apiKey?: string): Promise<string> => {
  const scraperTemplate = `
// Kaggle datasets scraper example template
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const results = [];
  
  // Extract relevant information from the page
  // This part should be customized based on the website structure
  const data = await page.evaluate(() => {
    return {
      // Extract specific elements from the page
      // Example for a generic website
      title: document.querySelector('h1')?.innerText || 'N/A',
      description: document.querySelector('meta[name="description"]')?.content || 'N/A',
      // Add more fields as needed
    };
  });
  
  results.push(data);
  await browser.close();
  
  return results;
}

// Main function to run the scraper
(async () => {
  const websiteData = await scrapeWebsite('${url}');
  console.log(JSON.stringify(websiteData, null, 2));
})();
  `;

  return queryOpenRouter("deepseek/deepseek-coder", [
    { role: "system", content: "You are an expert web scraper that generates reliable scraping code. Use the provided template as a starting point, but customize it for the specific website." },
    { role: "user", content: `Generate a JavaScript function that can scrape content from ${url}. The code should be resilient to website structure changes, extract product information, pricing, and key features. Use Puppeteer for browser automation and return structured JSON data. Start with this template and adapt it:\n\n${scraperTemplate}` },
  ], apiKey);
};

export const analyzeCompetitorStrategy = async (insights: string, apiKey?: string): Promise<string> => {
  return queryOpenRouter("anthropic/claude-3-sonnet", [
    { role: "system", content: "You're a competitive intelligence analyst." },
    { role: "user", content: `Analyze the following data about a company and summarize their product strategy, market positioning, and potential gaps in 3-5 bullet points.\n\nData:\n${insights}` },
  ], apiKey);
};

export const formatInsightReport = async (analyzedData: string, apiKey?: string): Promise<string> => {
  return queryOpenRouter("openai/gpt-4-turbo", [
    { role: "system", content: "You are an executive report writer." },
    { role: "user", content: `Generate a clean and structured executive summary from this competitor data. Format it in Markdown with sections: Overview, Key Moves, Threat Level, and Opportunities.\n\nInput:\n${analyzedData}` },
  ], apiKey);
};
