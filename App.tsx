
import React, { useState, useCallback } from 'react';
import type { Agent, AgentName, AgentStatus, NewsItem, AnalysisResult } from './types';
import { generateNewsSentiment, generateFinalReport } from './services/geminiService';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import AgentStatusCard from './components/AgentStatusCard';
import ReportDisplay from './components/ReportDisplay';
import { DataIcon } from './components/icons/DataIcon';
import { NewsIcon } from './components/icons/NewsIcon';
import { CodeIcon } from './components/icons/CodeIcon';
import { ReportIcon } from './components/icons/ReportIcon';

const initialAgents: Record<AgentName, Agent> = {
  dataFetcher: {
    name: "Data Fetcher Agent",
    description: "Fetches real-time prices for all assets in the portfolio.",
    status: 'idle',
    icon: <DataIcon />,
  },
  newsAnalyzer: {
    name: "News Analysis Agent",
    description: "Scrapes and analyzes recent news for top holdings.",
    status: 'idle',
    icon: <NewsIcon />,
  },
  quantAnalyzer: {
    name: "Quantitative Analysis Agent",
    description: "Calculates key risk metrics (VaR, Beta, concentration).",
    status: 'idle',
    icon: <CodeIcon />,
  },
  reportingAgent: {
    name: "Reporting Agent",
    description: "Generates a coherent, natural language summary report.",
    status: 'idle',
    icon: <ReportIcon />,
  },
};


const App: React.FC = () => {
  const [query, setQuery] = useState<string>("Analyze my portfolio's exposure to tech sector volatility.");
  const [agents, setAgents] = useState<Record<AgentName, Agent>>(initialAgents);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const updateAgentStatus = (name: AgentName, status: AgentStatus, message?: string) => {
    setAgents(prev => ({
      ...prev,
      [name]: { ...prev[name], status, message: message || prev[name].message }
    }));
  };

  const resetState = () => {
    setAgents(initialAgents);
    setError(null);
    setAnalysisResult(null);
    setIsLoading(false);
  };

  const runSimulation = useCallback(async (userQuery: string) => {
    if (!userQuery.trim()) {
      setError("Please enter a valid query.");
      return;
    }
    resetState();
    setIsLoading(true);

    let currentAgent: AgentName | null = null;
    try {
      // Task 1: Data Fetcher Agent
      currentAgent = 'dataFetcher';
      updateAgentStatus(currentAgent, 'working');
      await new Promise(res => setTimeout(res, 1000)); // Simulate API call
      updateAgentStatus(currentAgent, 'completed', 'Fetched real-time prices for 5 holdings.');
      
      // Task 2: News Analysis Agent
      currentAgent = 'newsAnalyzer';
      updateAgentStatus(currentAgent, 'working');
      const newsItems: NewsItem[] = await generateNewsSentiment(userQuery);
      updateAgentStatus(currentAgent, 'completed', `Analyzed sentiment for ${newsItems.length} news items.`);
      
      // Task 3: Quantitative Analysis Agent
      currentAgent = 'quantAnalyzer';
      updateAgentStatus(currentAgent, 'working');
      await new Promise(res => setTimeout(res, 1500)); // Simulate complex calculation
      updateAgentStatus(currentAgent, 'completed', 'Calculated VaR, Beta, and concentration.');
      
      // Task 4: Reporting Agent
      currentAgent = 'reportingAgent';
      updateAgentStatus(currentAgent, 'working');
      const finalReport = await generateFinalReport(userQuery, newsItems);
      updateAgentStatus(currentAgent, 'completed', 'Final report generated.');

      setAnalysisResult({
          report: finalReport,
          news: newsItems,
          metrics: {
              beta: 1.15,
              var: -25000,
              concentration: 0.65,
          }
      });
      currentAgent = null; // Clear on success

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Simulation failed: ${errorMessage}`);
      if (currentAgent) {
        updateAgentStatus(currentAgent, 'error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8">
          <p className="text-center text-lg text-gray-400 max-w-3xl mx-auto">
            This application simulates a multi-agent system for financial analysis. Enter a query to see how different AI agents collaborate to provide a comprehensive risk assessment of a mock portfolio.
          </p>
          <QueryInput
            query={query}
            setQuery={setQuery}
            onAnalyze={runSimulation}
            isLoading={isLoading}
          />
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">Agent Orchestration Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(agents).map(agent => (
                <AgentStatusCard key={agent.name} agent={agent} />
              ))}
            </div>
          </div>
          
          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 p-4 rounded-lg">
              <h3 className="font-bold text-red-400">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {analysisResult && !isLoading && (
            <ReportDisplay result={analysisResult} />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
