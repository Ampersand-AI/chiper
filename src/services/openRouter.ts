
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

export async function queryOpenRouter(model: string, messages: Message[]): Promise<string> {
  try {
    // Note: In a production app, you would store the API key securely
    // For demo purposes, we'll use a placeholder
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_OPENROUTER_API_KEY',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API returned ${response.status}`);
    }

    const data = await response.json() as OpenRouterResponse;
    return data.choices[0]?.message?.content || "No response";
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return "An error occurred while processing your request.";
  }
}

// Helper functions for specific AI models
export const getInsights = async (competitorData: string): Promise<string> => {
  return queryOpenRouter("anthropic/claude-3-sonnet", [
    { role: "system", content: "You are a competitive strategy expert." },
    { role: "user", content: "Analyze this content from a competitor and highlight positioning, gaps, and market moves:\n\n" + competitorData },
  ]);
};

export const extractStructuredData = async (webScrapedHtml: string): Promise<string> => {
  return queryOpenRouter("openai/gpt-4-turbo", [
    { role: "system", content: "You are an expert at extracting structured info from messy web text." },
    { role: "user", content: "Extract pricing, features, product names and format as JSON:\n\n" + webScrapedHtml },
  ]);
};

export const generateScraper = async (url: string): Promise<string> => {
  return queryOpenRouter("deepseek/deepseek-coder", [
    { role: "system", content: "You are an expert web scraper that generates reliable scraping code." },
    { role: "user", content: `Generate a JavaScript function that can scrape content from ${url}. The code should be resilient to website structure changes.` },
  ]);
};
