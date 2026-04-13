import React, { useState, useEffect } from 'react';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';
import { initialMessages } from '../data/mockMessages';
import { Moon, Sun } from 'lucide-react';

export default function ChatApp() {
  const [messages, setMessages] = useState(initialMessages);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial user preference 
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleSendMessage = (problem, data) => {
    console.log("FINAL DATA:", data);

    const newMessage = {
      id: Date.now().toString(),
      problem,
      loading: true,
      // solution_1: `\`\`\`javascript\nconsole.log("Solution 1 processing: ${problem}");\n\`\`\`\n\nThis is a simulated response for **Solution 1**. In a real environment, this would come from an AI model.`,
      // solution_2: `\`\`\`python\nprint(f"Solution 2 processing: {problem}")\n\`\`\`\n\nThis is a simulated response for **Solution 2**. Notice how the models might differ in approach.`,
      // judge: {
      //   solution_1_score: Math.floor(Math.random() * 5) + 5,
      //   solution_2_score: Math.floor(Math.random() * 5) + 5,
      //   solution_1_reasoning: "The code is succinct and uses appropriate syntax for the context.",
      //   solution_2_reasoning: "A solid alternative, though slightly more verbose or perhaps less optimized for performance."
      
      ...data
      
    };

    setMessages(prev => [...prev, newMessage]);

    // setTimeout(() => {
    //   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    // }, 100);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0b] pb-32 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 py-6 px-4 md:px-8 sticky top-0 z-10 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              AI Battle Arena
            </h1>
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
              Editorial Intelligence Mode
            </p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
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
