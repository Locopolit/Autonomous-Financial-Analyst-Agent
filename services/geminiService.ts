
import { GoogleGenAI, Type } from "@google/genai";
import type { NewsItem } from '../types';

// Singleton instance of GoogleGenAI, lazily initialized.
let ai: GoogleGenAI | undefined;

function getAiInstance(): GoogleGenAI {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set. Please configure it to run the simulation.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

const model = "gemini-2.5-flash";

const newsSentimentSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        headline: {
          type: Type.STRING,
          description: "A realistic-sounding news headline related to the companies or query.",
        },
        sentiment: {
          type: Type.STRING,
          description: "The sentiment of the headline. Must be 'Positive', 'Neutral', or 'Negative'.",
        },
        justification: {
            type: Type.STRING,
            description: "A brief justification for the assigned sentiment."
        }
      },
      required: ["headline", "sentiment", "justification"],
    },
};


export const generateNewsSentiment = async (query: string): Promise<NewsItem[]> => {
    try {
        const ai = getAiInstance();
        const prompt = `You are a financial news sentiment analysis agent. For a portfolio focused on tech stocks like AAPL, MSFT, GOOGL, AMZN, NVDA, analyze the query: "${query}". Generate 3 recent, realistic-sounding news headlines related to these companies and the query. For each headline, provide a sentiment (Positive, Neutral, or Negative) and a brief justification.`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: newsSentimentSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString) as NewsItem[];
        return result;
    } catch (error) {
        console.error("Error generating news sentiment:", error);
        if (error instanceof Error) {
            throw error; // re-throw original error to preserve stack trace and message
        }
        throw new Error("An unknown error occurred while generating news sentiment.");
    }
};

export const generateFinalReport = async (query: string, newsItems: NewsItem[]): Promise<string> => {
    try {
        const ai = getAiInstance();
        const prompt = `
        You are an autonomous financial analyst agent generating a risk assessment report.
        User Query: "${query}"

        Here is the data you have gathered from other specialized agents:

        ---
        Real-Time Market Data (Simulated):
        - Portfolio Value: $1,250,000
        - Day's Change: +0.8% (+$10,000)
        - Top Holdings:
          - AAPL: $195.50 (+1.2%)
          - MSFT: $450.10 (+0.5%)
          - GOOGL: $180.25 (+1.0%)
          - AMZN: $185.00 (-0.2%)
          - NVDA: $1250.75 (+2.5%)

        ---
        News Sentiment Analysis:
        ${JSON.stringify(newsItems, null, 2)}

        ---
        Quantitative Risk Metrics (Simulated):
        - Portfolio Beta: 1.15 (Slightly more volatile than the market)
        - Value at Risk (VaR) @ 95% confidence (1 day): -$25,000 (Potential loss in a single bad day)
        - Sector Concentration (Tech): 65%

        ---
        Historical Context Analysis (Simulated from Vector DB):
        - Finding: The current market condition shows similarities to the tech correction of Q4 2018, but with stronger company fundamentals today.

        ---
        Your Task:
        Based on all the information above, generate a concise yet comprehensive risk assessment report for the user. Structure the report with the following sections using markdown for formatting:
        1.  **Executive Summary:** A brief overview of the key findings.
        2.  **Key Risk Exposures:** Detail the main risks based on the user's query and the data (e.g., tech sector volatility, concentration).
        3.  **Quantitative Analysis:** Briefly explain the Beta and VaR metrics in simple terms.
        4.  **Market Sentiment:** Summarize the findings from the news analysis.
        5.  **Historical Context & Concluding Remarks:** Provide context and a final thought.

        The tone should be professional, clear, and reassuring. Do not invent any new data. Return ONLY the markdown report.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating final report:", error);
        if (error instanceof Error) {
            throw error; // re-throw original error
        }
        throw new Error("An unknown error occurred while generating the final report.");
    }
};
