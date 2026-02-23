'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Sun, Moon, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Baarez AI
                </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl hover:bg-accent text-muted-foreground transition-all active:scale-95"
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button className="p-2.5 rounded-xl hover:bg-accent text-muted-foreground transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
                </button>

                <div className="flex items-center gap-2 pl-4 border-l border-border ml-2">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground shadow-inner">
                        AD
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-xs font-bold leading-none">Admin User</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5 tracking-wider">Enterprise Ops</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};
