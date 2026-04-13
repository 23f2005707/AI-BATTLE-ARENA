import React, { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // Switch to a more modern, sleek dark theme
import { Check, Copy, TerminalSquare } from 'lucide-react';

// Custom Code Block Component to add a modern header and copy functionality
const CustomCodeBlock = ({ node, inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative rounded-xl overflow-hidden my-6 border border-zinc-800 dark:border-zinc-700 shadow-lg group">
        {/* Modern Mac-like / Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <TerminalSquare className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-400 font-sans uppercase tracking-wider">
              {language}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-zinc-800"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        
        {/* We strip inline padding since the wrapper provides spacing */}
        <div className="bg-[#282c34] text-[13px] md:text-sm leading-relaxed">
          <code className={className} {...props}>
            {children}
          </code>
        </div>
      </div>
    );
  }

  // Fallback for inline code snippets
  return (
    <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 rounded-md font-mono text-sm border border-zinc-200 dark:border-zinc-700" {...props}>
      {children}
    </code>
  );
};

export default function SolutionCard({ title, content, isWinning }) {
  return (
    <div className={`p-6 md:p-8 rounded-2xl bg-white dark:bg-[#121214] shadow-sm flex-1 transition-all duration-300 ${
      isWinning 
        ? 'border-2 border-blue-200 dark:border-blue-900/50 shadow-blue-50/50 dark:shadow-blue-900/10 ring-1 ring-blue-50 dark:ring-0' 
        : 'border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md'
    }`}>
      <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight flex items-center gap-2">
        {isWinning && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
        {title}
      </h3>
      <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-loose font-sans
                      prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight 
                      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-p:mb-5">
        <Markdown 
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre: ({ node, ...props }) => <>{props.children}</>, // Strip native pre, let code block wrapper handle it
            code: CustomCodeBlock
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
}
