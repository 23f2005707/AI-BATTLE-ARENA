import React, { useState } from 'react';
import { SendHorizonal, AlertCircle } from 'lucide-react';

import axios from "axios"
import { useAuth } from '../context/AuthContext';

export default function ChatInput({ onSendMessage }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!value.trim()) return;

    if (!token) {
      setError('Please login to send messages');
      return;
    }

    setIsLoading(true);
    // call the backend API
    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: value
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      console.log("DATA: ", data);

      onSendMessage(value, data.result);  // ✅ pass whole data object
      setValue('');
    } catch(err){
      console.error("Failed to send message:", err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to send message');
      }
    } finally {
      setIsLoading(false);
    }
   
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800/80 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center shadow-sm bg-zinc-100 dark:bg-zinc-900 rounded-full transition-shadow focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 focus-within:bg-white dark:focus-within:bg-zinc-950"
        >
          <input
            type="text"
            className="w-full bg-transparent border-none py-4 pl-6 pr-14 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
            placeholder={isLoading ? "Processing..." : "Enter your inquiry..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="absolute right-2 p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-2 font-sans font-medium">
          Editorial Intelligence v4.0 Curator Engine
        </p>
      </div>
    </div>
  );
}

