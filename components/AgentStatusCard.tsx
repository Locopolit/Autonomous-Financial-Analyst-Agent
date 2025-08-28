
import React from 'react';
import type { Agent } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface AgentStatusCardProps {
  agent: Agent;
}

const statusStyles: { [key in Agent['status']]: { bg: string; border: string; text: string; icon: React.ReactNode } } = {
  idle: {
    bg: 'bg-gray-800/60',
    border: 'border-gray-700',
    text: 'text-gray-400',
    icon: null,
  },
  working: {
    bg: 'bg-blue-900/50',
    border: 'border-blue-700',
    text: 'text-blue-300',
    icon: <SpinnerIcon className="animate-spin h-5 w-5" />,
  },
  completed: {
    bg: 'bg-green-900/50',
    border: 'border-green-700',
    text: 'text-green-300',
    icon: <CheckIcon />,
  },
  error: {
    bg: 'bg-red-900/50',
    border: 'border-red-700',
    text: 'text-red-300',
    icon: <XIcon />,
  },
};

const AgentStatusCard: React.FC<AgentStatusCardProps> = ({ agent }) => {
  const styles = statusStyles[agent.status];

  return (
    <div className={`flex flex-col p-5 rounded-xl border ${styles.border} ${styles.bg} shadow-lg transition-all duration-300 h-full`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${styles.bg} border ${styles.border}`}>{agent.icon}</div>
            <h3 className="font-bold text-lg text-gray-100">{agent.name}</h3>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${styles.bg} ${styles.text}`}>
          {styles.icon}
          <span className="capitalize">{agent.status}</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-3 h-12">{agent.description}</p>
      {agent.message && (
          <div className={`mt-auto p-3 rounded-md text-sm ${styles.bg} border ${styles.border} ${styles.text}`}>
              <strong>Log:</strong> {agent.message}
          </div>
      )}
    </div>
  );
};

export default AgentStatusCard;
