'use client';

import React from 'react';
import { Database, Target, Layers, FileCheck2 } from 'lucide-react';

export const ProofMetricsStrip: React.FC = () => {
  const metrics = [
    {
      value: '10,000+ Records/sec',
      title: 'Parsing Throughput',
      detail: 'Multi-source CDR, IPDR & Hawala transaction processing',
      icon: Database,
      badge: 'STF Engine v4',
    },
    {
      value: '0.94 Centrality',
      title: 'Accuracy Score',
      detail: 'PageRank & Betweenness isolation of non-calling kingpins',
      icon: Target,
      badge: 'Normalized',
    },
    {
      value: '3 Syndicate Clusters',
      title: 'Community Detection',
      detail: 'Automatic Louvain partitioning across hawala, burner & hit cells',
      icon: Layers,
      badge: 'Unsupervised',
    },
    {
      value: '100% BSA Compliant',
      title: 'Evidentiary Standard',
      detail: 'Court-admissible certificate under Section 63 BSA / Sec 65B IEA',
      icon: FileCheck2,
      badge: 'Sec 63 Certified',
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-[#0A0F1D] border-b border-slate-200/80 dark:border-slate-800/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`py-4 sm:py-0 px-4 sm:px-6 flex flex-col justify-between ${
                  index === 0 ? 'sm:pl-0' : ''
                } ${index === metrics.length - 1 ? 'sm:pr-0' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 text-xs font-mono font-medium">
                    <Icon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xs">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100">
                    {item.value}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
