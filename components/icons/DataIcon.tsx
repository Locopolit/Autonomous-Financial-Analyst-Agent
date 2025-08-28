
import React from 'react';

export const DataIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6 text-gray-300" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7a8 8 0 0116 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 11a8 8 0 0116 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 15a8 8 0 0116 0" />
    </svg>
);
