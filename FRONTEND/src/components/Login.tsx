import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export default function Login({ onSwitchToRegister }: LoginProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 auth-background-radial" />
      <div className="auth-glow-circle" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-8 rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-35px_rgba(15,23,42,0.8)] backdrop-blur-xl ring-1 ring-white/10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200/80 shadow-sm shadow-cyan-500/10">
              Premium editorial intelligence
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                AI Battle Arena
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                Elevate your coding debates with premium AI comparison, judge scoring, and polished evaluation insights.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">Decision engine</p>
                <p className="mt-3 text-sm text-slate-200">AI judges both answers and gives a clear winner with reasoning.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300/90">Secure login</p>
                <p className="mt-3 text-sm text-slate-200">Premium-grade authentication and encrypted session handling.</p>
              </div>
            </div>
          </section>

          <div className="relative rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
            <div className="absolute -right-10 top-10 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute -left-8 bottom-10 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="mb-8 space-y-3">
              <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400">Sign in to continue your premium AI judging experience.</p>
            </div>

            {(error || localError) && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-400" />
                <p className="text-sm">{error || localError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 gradient-button"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="font-semibold text-white hover:text-cyan-300 transition"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
