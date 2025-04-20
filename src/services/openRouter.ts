
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
    return "An error occurred while processing your request.";
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
  return queryOpenRouter("deepseek/deepseek-coder", [
    { role: "system", content: "You are an expert web scraper that generates reliable scraping code." },
    { role: "user", content: `Generate a JavaScript function that can scrape content from ${url}. The code should be resilient to website structure changes.` },
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
