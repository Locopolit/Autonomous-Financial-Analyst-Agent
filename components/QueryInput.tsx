
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onAnalyze: (query: string) => void;
  isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, onAnalyze, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(query);
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Analyze my portfolio's exposure to tech sector volatility."
          className="w-full px-4 py-3 bg-gray-800 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Analyzing...
            </>
          ) : (
            'Run Analysis'
          )}
        </button>
      </form>
    </div>
  );
};

export default QueryInput;
