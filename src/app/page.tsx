'use client';

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';
import { AIInsights } from '@/components/AIInsights';
import { sampleSalesData } from '@/lib/sampleData';
import { buildDataSummary } from '@/lib/utils';
import { InsightMessage, SalesData } from '@/types/dashboard';
import { Database, Download, Upload, Trash2 } from 'lucide-react';

export default function Home() {
  const [salesRows, setSalesRows] = useState<SalesData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const summary = buildDataSummary(salesRows);

  const handleLoadSample = () => {
    setSalesRows(sampleSalesData);
    setIsLoaded(true);
  };

  const handleReset = () => {
    setSalesRows([]);
    setIsLoaded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length > 0) {
        setSalesRows(rows);
        setIsLoaded(true);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string): SalesData[] => {
    // Basic CSV parser logic: split by line, then by comma
    // Expected Header: date,product,revenue,units_sold,region
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {} as Record<string, string | number>;
      headers.forEach((header, i) => {
        const val = values[i] as string | undefined;
        if (header === 'revenue' || header === 'units_sold') {
          row[header] = val ? parseFloat(val) || 0 : 0;
        } else {
          row[header] = val || '';
        }
      });
      return row as unknown as SalesData;
    }).filter(row => row.date && row.product);
  };

  const insights: InsightMessage[] = [
    {
      id: '1',
      type: 'success',
      content: isLoaded
        ? `Analysis complete: ${salesRows.length} records processed.`
        : "Initial baseline analysis pending. Load data to begin.",
      timestamp: 'Just now'
    },
    {
      id: '2',
      type: 'info',
      content: 'System monitoring active. Anomaly detection running on live datasets.',
      timestamp: 'Live'
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Navbar />

      <main className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Sales Analytics
            </h1>
            <p className="text-muted-foreground font-medium">
              Enterprise-grade performance monitoring and AI-driven predictive insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all shadow-sm active:scale-95"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>

            {isLoaded ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Reset Workspace
              </button>
            ) : (
              <button
                onClick={handleLoadSample}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95"
              >
                <Download className="w-4 h-4" />
                Load Sample
              </button>
            )}
          </div>
        </header>

        <div className="flex flex-col space-y-20 overflow-x-hidden">
          {/* Section 1: KPI Cards & Charts (Full Width) */}
          <section className="w-full">
            <Dashboard data={salesRows} />
          </section>

          {/* Section 2: AI Insights Panel (Intelligence Report Tier) */}
          <section className="w-full border-t-2 border-border pt-20 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold tracking-tight">AI Intelligence Hub</h2>
                <p className="text-muted-foreground">Deep analysis and predictive insights generated from your live sales data.</p>
              </div>
              <AIInsights insights={insights} dataSummary={summary} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
