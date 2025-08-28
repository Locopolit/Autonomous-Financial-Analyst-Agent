
import type React from 'react';

export type AgentName = 'dataFetcher' | 'newsAnalyzer' | 'quantAnalyzer' | 'reportingAgent';

export type AgentStatus = 'idle' | 'working' | 'completed' | 'error';

export interface Agent {
  name: string;
  description: string;
  status: AgentStatus;
  message?: string;
  icon: React.ReactNode;
}

export interface NewsItem {
  headline: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  justification: string;
}

export interface QuantitativeMetrics {
    beta: number;
    var: number;
    concentration: number;
}

export interface AnalysisResult {
    report: string;
    news: NewsItem[];
    metrics: QuantitativeMetrics;
}
