import React, { useState } from 'react';
import type { AnalysisResult } from '../types';

// A simple markdown to HTML converter for basic formatting
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold text-cyan-400 mt-4 mb-2">$1</h3>')
        .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold text-cyan-300 mt-6 mb-3">$1</h2>')
        .replace(/\* (.*?)\n/g, '<li class="ml-5 list-disc">$1</li>') // List items
        .replace(/\n/g, '<br />'); // Newlines

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const ReportDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const [activeTab, setActiveTab] = useState('report');

    const sentimentColor = (sentiment: 'Positive' | 'Negative' | 'Neutral') => {
        switch (sentiment) {
            case 'Positive': return 'text-green-400 border-green-700 bg-green-900/50';
            case 'Negative': return 'text-red-400 border-red-700 bg-red-900/50';
            case 'Neutral': return 'text-yellow-400 border-yellow-700 bg-yellow-900/50';
        }
    }

    const handleEmailReport = () => {
        const subject = "Financial Analysis Report";

        // Simple function to clean up markdown for a plain text email body
        const plainTextReport = result.report
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
            .replace(/### (.*?)/g, '$1')    // Remove header markers
            .replace(/## (.*?)/g, '$1')
            .replace(/\* /g, '- ')          // Change markdown list to simple dash
            .trim();

        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainTextReport)}`;

        window.location.href = mailtoLink;
    };

    return (
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-cyan-400">Analysis Complete</h2>
                <p className="text-gray-400 mt-1">Review the generated report and the underlying data gathered by the agents.</p>
                <div className="mt-4 flex space-x-2 sm:space-x-4 border-b border-gray-600">
                    <button onClick={() => setActiveTab('report')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'report' ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>Summary Report</button>
                    <button onClick={() => setActiveTab('news')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'news' ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>News Sentiment</button>
                    <button onClick={() => setActiveTab('metrics')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'metrics' ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>Quant Metrics</button>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                {activeTab === 'report' && (
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                        <SimpleMarkdown content={result.report} />
                    </div>
                )}
                {activeTab === 'news' && (
                    <div>
                        <h3 className="text-xl font-semibold text-cyan-400 mb-4">News Sentiment Analysis</h3>
                        <div className="space-y-4">
                            {result.news.map((item, index) => (
                                <div key={index} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-gray-100">{item.headline}</p>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${sentimentColor(item.sentiment)}`}>{item.sentiment}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-400 italic">"{item.justification}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'metrics' && (
                     <div>
                        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Quantitative Risk Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
                                <p className="text-sm text-gray-400">Portfolio Beta</p>
                                <p className="text-2xl font-bold text-white">{result.metrics.beta}</p>
                            </div>
                            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
                                <p className="text-sm text-gray-400">Value at Risk (95%, 1-day)</p>
                                <p className="text-2xl font-bold text-red-400">{result.metrics.var.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                            </div>
                            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
                                <p className="text-sm text-gray-400">Tech Sector Concentration</p>
                                <p className="text-2xl font-bold text-white">{(result.metrics.concentration * 100).toFixed(0)}%</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
             <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500"><span className="font-semibold text-gray-400">Knowledge Base:</span> Risk metrics and sentiment scores stored for future analysis.</p>
                <div className="flex gap-4">
                    <button 
                        onClick={handleEmailReport}
                        className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-md hover:bg-gray-600 transition">Email Report</button>
                    <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-md hover:bg-cyan-500 transition">Download PDF</button>
                </div>
            </div>
        </div>
    );
};

export default ReportDisplay;