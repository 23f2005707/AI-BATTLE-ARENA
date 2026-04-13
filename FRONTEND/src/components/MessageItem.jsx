import React from 'react';
import SolutionCard from './SolutionCard';
import JudgeRecommendation from './JudgeRecommendation';
import { UserCheck } from 'lucide-react';

export default function MessageItem({ message }) {
  const { problem, solution_1, solution_2, judge } = message;

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-8 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 transition-colors duration-300">
      {/* Problem Section */}
      <div className="mb-10 pl-4 md:pl-0">
        <div className="flex items-start gap-4">
          <div className="mt-1 bg-zinc-200 dark:bg-zinc-800 p-2 rounded-full hidden md:block transition-colors">
            <UserCheck className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">The Inquiry</h2>
            <p className="text-xl md:text-2xl font-display text-zinc-900 dark:text-zinc-50 leading-tight">
              {problem}
            </p>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <SolutionCard 
          title="Solution 1" 
          content={solution_1} 
          isWinning={judge.solution_1_score > judge.solution_2_score} 
        />
        <SolutionCard 
          title="Solution 2" 
          content={solution_2} 
          isWinning={judge.solution_2_score > judge.solution_1_score} 
        />
      </div>

      {/* Judge Recommendation */}
      <JudgeRecommendation judge={judge} />
    </div>
  );
}
