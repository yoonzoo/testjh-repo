import React, { useState } from 'react';
import { SparklesIcon } from './icons';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('Rainy cyberpunk lo-fi street view');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 z-20">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your vibe..."
          className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow text-slate-100 placeholder-slate-400"
          rows={1}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg px-4 h-12 transition-all shadow-md hover:shadow-lg hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Generate</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};