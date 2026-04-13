import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function JudgeRecommendation({ judge }) {
  if (!judge) return null;

  return (
    <div className="mt-8 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-900/30 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="text-blue-600 dark:text-blue-400 w-6 h-6" />
        <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100">Judge Verdict</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Solution 1 Score & Reasoning */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Solution 1</span>
            <span className="bg-white dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold shadow-sm shadow-blue-100/50 dark:shadow-none border border-transparent dark:border-blue-800/50">
              Score: {judge.solution_1_score}/10
            </span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
            {judge.solution_1_reasoning}
          </p>
        </div>

        {/* Solution 2 Score & Reasoning */}
        <div className="flex flex-col gap-2 relative">
          {/* Subtle divider for desktop */}
          <div className="hidden md:block absolute -left-4 top-0 bottom-0 w-px bg-blue-200/50 dark:bg-blue-800/30"></div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Solution 2</span>
            <span className="bg-white dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold shadow-sm shadow-blue-100/50 dark:shadow-none border border-transparent dark:border-blue-800/50">
              Score: {judge.solution_2_score}/10
            </span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
            {judge.solution_2_reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}
