import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AnalysisChart({ judge }) {
  const scores = [
    { label: 'Solution 1', score: Number(judge?.solution_1_score) || 0, color: 'bg-cyan-500' },
    { label: 'Solution 2', score: Number(judge?.solution_2_score) || 0, color: 'bg-pink-500' }
  ];

  return (
    <div className="mt-8 border-t border-blue-200/60 dark:border-blue-800/30 pt-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h4 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
          AI comparison
        </h4>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Judge score out of 10</span>
      </div>

      <div className="space-y-4" role="img" aria-label="Comparison chart of both AI solution scores">
        {scores.map(({ label, score, color }) => (
          <div key={label} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
            <div className="h-3 rounded-full bg-white/80 dark:bg-slate-900/80 overflow-hidden border border-blue-100 dark:border-blue-900/40">
              <div
                className={`h-full rounded-full ${color} transition-[width] duration-700 ease-out`}
                style={{ width: `${Math.min(10, Math.max(0, score)) * 10}%` }}
              />
            </div>
            <span className="text-right text-sm font-bold text-zinc-800 dark:text-zinc-200">{score}/10</span>
          </div>
        ))}
      </div>
    </div>
  );
}