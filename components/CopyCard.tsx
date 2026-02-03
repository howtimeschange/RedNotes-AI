
import React, { useState } from 'react';
import { CopyOption } from '../types';

interface CopyCardProps {
  option: CopyOption;
}

export const CopyCard: React.FC<CopyCardProps> = ({ option }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullText = `${option.title}\n\n${option.content}\n\n${option.tags.map(t => `#${t}`).join(' ')}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-red-50 text-[#ff2442] text-xs font-bold rounded-full uppercase tracking-wider">
          {option.style}
        </span>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-[#ff2442] transition-colors p-2 rounded-lg hover:bg-red-50"
          title="复制文案"
        >
          {copied ? (
            <span className="text-xs font-medium text-green-500">已复制!</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
        </button>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
        {option.title}
      </h3>
      
      <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mb-4">
        {option.content}
      </div>

      <div className="flex flex-wrap gap-2">
        {option.tags.map((tag, idx) => (
          <span key={idx} className="text-[#ff2442] text-sm hover:underline cursor-default">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
