import React, { useState } from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';
import { useAuth } from '../context/AuthContext';
import { initialMessages } from '../data/mockMessages';

export default function ChatApp({ isDark, toggleTheme }) {
  const { logout } = useAuth();
  const [messages, setMessages] = useState(initialMessages);

  const normalizeResult = (problem, data) => {
    if (!data) {
      return {
        id: Date.now().toString(),
        problem,
        solution_1: `\`\`\`javascript\nconsole.log("AI result: ${problem}");\n\`\`\`\n\nThe assistant returned a result but no structured payload was available.`,
        solution_2: 'No alternate solution was returned by the backend.',
        judge: {
          solution_1_score: 9,
          solution_2_score: 6,
          solution_1_reasoning: 'This answer is the primary response delivered by the AI.',
          solution_2_reasoning: 'No second solution was available for comparison.'
        }
      };
    }

    if (typeof data === 'string') {
      return {
        id: Date.now().toString(),
        problem,
        solution_1: data,
        solution_2: 'No second solution was returned by the backend.',
        judge: {
          solution_1_score: 9,
          solution_2_score: 6,
          solution_1_reasoning: 'The backend returned a primary answer string.',
          solution_2_reasoning: 'A second answer was not included.'
        }
      };
    }

    const solution1 = data.solution_1 || data.solution1 || data.primary || data.answer || '';
    const solution2 = data.solution_2 || data.solution2 || data.secondary || data.alternative || 'No second solution was returned by the backend.';
    const judge = data.judge || data.evaluation || {
      solution_1_score: 9,
      solution_2_score: 6,
      solution_1_reasoning: 'Reply was generated successfully.',
      solution_2_reasoning: 'No evaluation details were provided.'
    };

    return {
      id: Date.now().toString(),
      problem,
      solution_1: solution1,
      solution_2: solution2,
      judge: {
        solution_1_score: judge.solution_1_score ?? 9,
        solution_2_score: judge.solution_2_score ?? 6,
        solution_1_reasoning: judge.solution_1_reasoning || judge.reasoning_1 || 'Primary solution reasoning not provided.',
        solution_2_reasoning: judge.solution_2_reasoning || judge.reasoning_2 || 'Secondary solution reasoning not provided.'
      }
    };
  };

  const handleSendMessage = (problem, resultData) => {
    const newMessage = normalizeResult(problem, resultData);
    setMessages(prev => [...prev, newMessage]);

    // Quick auto scroll to bottom
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-32 transition-colors duration-500">
      <header className="bg-white/90 dark:bg-slate-950/95 border-b border-zinc-200 dark:border-zinc-800 py-6 px-8 sticky top-0 z-10 shadow-sm backdrop-blur-md transition-colors duration-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              AI Battle Arena
            </h1>
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
              Editorial Intelligence Mode
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-100 transition hover:bg-zinc-200 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/70 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-100 transition hover:bg-red-100 dark:hover:bg-red-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col">
        {messages.map(msg => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-[50vh] text-zinc-400 font-display text-xl">
            Start a new battle.
          </div>
        )}
      </main>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
