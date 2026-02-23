'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Brain, Send, Loader2, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react';
import { InsightMessage } from '../types/dashboard';

interface AIInsightsProps {
    insights: InsightMessage[];
    dataSummary: Record<string, unknown>;
}

interface Interaction {
    question: string;
    answer: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights, dataSummary }) => {
    const [history, setHistory] = useState<Interaction[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const suggestions = [
        "Which product had the highest revenue?",
        "Which region has the lowest sales?",
        "How did sales trend month over month?",
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history, isLoading, error]);

    const handleAsk = async (question: string) => {
        if (!question.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setInput('');

        try {
            const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
            const response = await fetch('/api/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, dataSummary })
            });

            const [_, res] = await Promise.all([minDelay, response.json()]);

            if (response.ok && res.answer) {
                setHistory(prev => [...prev, { question, answer: res.answer }]);
            } else {
                throw new Error(res.error || 'Failed to get insights');
            }
        } catch (err: unknown) {
            console.error('Failed to ask AI:', err);
            const errorMessage = err instanceof Error ? err.message : 'The AI assistant is temporarily unavailable. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="bg-card rounded-3xl border-2 border-border overflow-hidden shadow-xl flex flex-col h-[750px] transition-colors duration-300 w-full max-w-7xl mx-auto ring-1 ring-border/50">
            <div className="p-6 bg-primary text-primary-foreground flex items-center justify-between shadow-lg z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-extrabold text-xl leading-none">Intelligence Assistant</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <p className="text-[10px] text-primary-foreground/80 font-bold uppercase tracking-[0.2em]">Neural Engine Syncing</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => { setHistory([]); setError(null); }}
                    className="p-2.5 hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                    title="Clear session data"
                >
                    <RefreshCw className="w-5 h-5 opacity-80" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 overflow-x-hidden slim-scrollbar">
                {/* Intelligence Feed */}
                {insights.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {insights.map((insight) => (
                            <div
                                key={insight.id}
                                className="flex gap-4 p-5 rounded-[2rem] bg-secondary/20 border border-border/40 backdrop-blur-sm transition-all hover:bg-secondary/30 hover:shadow-md"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Brain className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm leading-relaxed font-medium text-muted-foreground whitespace-pre-wrap">{insight.content}</p>
                                    <span className="text-[10px] uppercase tracking-widest text-primary/60 font-black mt-3 block">
                                        System Node • {insight.timestamp}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Dynamic Context History */}
                <div className="space-y-8">
                    {history.map((interaction, idx) => (
                        <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                            <div className="flex justify-end">
                                <div className="bg-primary text-primary-foreground px-8 py-4 rounded-[2rem] rounded-tr-none shadow-lg max-w-[80%] lg:max-w-[60%]">
                                    <p className="text-base font-semibold leading-relaxed">{interaction.question}</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 shadow-lg border border-border/50">
                                    <Brain className="w-7 h-7 text-primary" />
                                </div>
                                <div className="bg-secondary/40 p-8 rounded-[2rem] rounded-tl-none border border-border/30 w-full relative group transition-all hover:bg-secondary/50 hover:shadow-inner">
                                    <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">{interaction.answer}</p>
                                    <button
                                        onClick={() => copyToClipboard(interaction.answer, idx)}
                                        className="absolute -right-4 -top-4 p-3 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-primary bg-background rounded-2xl border-2 border-border shadow-xl hover:scale-110 active:scale-95 z-20"
                                        title="Copy insight to clipboard"
                                    >
                                        {copiedIndex === idx ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error Boundary Visualization */}
                {error && (
                    <div className="flex gap-5 animate-in zoom-in-95 duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 shadow-sm">
                            <AlertCircle className="w-7 h-7 text-red-500" />
                        </div>
                        <div className="bg-red-500/5 p-8 rounded-[2rem] rounded-tl-none border-2 border-red-500/10 w-full shadow-inner">
                            <p className="text-base text-red-600 font-bold">{error}</p>
                            <button
                                onClick={() => handleAsk(history[history.length - 1]?.question || input)}
                                className="flex items-center gap-2 text-sm text-red-700 font-black mt-4 hover:underline"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Retry Computation
                            </button>
                        </div>
                    </div>
                )}

                {/* Computational Thinking State */}
                {isLoading && (
                    <div className="flex gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 shadow-lg border border-border/50 animate-pulse">
                            <Brain className="w-7 h-7 text-primary/30" />
                        </div>
                        <div className="bg-secondary/30 px-8 py-5 rounded-[2rem] rounded-tl-none border border-border/30 shadow-inner">
                            <div className="flex items-center gap-5 text-base text-muted-foreground">
                                <span className="font-extrabold tracking-tight italic">AI Agent is performing deep analysis</span>
                                <span className="flex gap-2.5">
                                    <span className="w-3 h-3 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-3 h-3 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-3 h-3 bg-primary/30 rounded-full animate-bounce"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} className="h-4" />
            </div>

            {/* Control Surface & Suggestion Layer */}
            <div className="p-8 bg-secondary/5 border-t-2 border-border/50 space-y-8 backdrop-blur-xl">
                {!isLoading && !error && (
                    <div className="flex flex-wrap gap-3 max-w-5xl mx-auto justify-center">
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleAsk(s)}
                                className="text-xs px-5 py-3 rounded-2xl bg-background border-2 border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left font-extrabold tracking-tight active:scale-95"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAsk(input);
                    }}
                    className="relative max-w-5xl mx-auto w-full group"
                >
                    <div className="absolute inset-0 bg-primary/5 rounded-[1.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        placeholder="Interrogate the neural engine for sales insights..."
                        className="relative w-full bg-background border-2 border-border/80 rounded-[1.5rem] pl-8 pr-16 py-5 text-lg font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50 transition-all shadow-xl placeholder:text-muted-foreground/50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-3.5 top-3 p-3.5 bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-90 transition-all disabled:opacity-30 disabled:shadow-none"
                    >
                        {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-7 h-7" />}
                    </button>
                </form>
            </div>
        </div>
    );
};
