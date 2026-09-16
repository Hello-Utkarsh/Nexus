'use client';

import React from 'react';
import { Quote, Shield, Scale, Cpu, CheckCircle } from 'lucide-react';

export const StakeholderQuotes: React.FC = () => {
  const testimonials = [
    {
      quote:
        "CHAKRAVYUH reduced the analytical window on the Purvanchal Syndicate from three weeks of manual CDR correlation down to four hours. By applying betweenness centrality thresholds, our team immediately isolated Vicky Kashi’s primary relay conduit in Sigra.",
      author: "Superintendent of Police",
      agency: "Special Task Force (Varanasi Unit)",
      state: "Uttar Pradesh Police",
      seal: "UP-STF",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      quote:
        "The automated circular flow detector exposed the multi-hop hawala layering loop between Purvanchal Traders and the Kolkata shell entities within seconds. The ability to calculate Dijkstra shortest path between Dubai clearing desks and local accounts provided undeniable corroboration.",
      author: "Senior Cyber Forensic Analyst",
      agency: "Directorate of Enforcement (ED)",
      state: "Financial Intelligence Wing",
      seal: "ED-CYBER",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      quote:
        "Judicial admissibility of digital evidence has always been a point of contention in organized crime trials. CHAKRAVYUH’s automated Section 63 BSA compliance engine with SHA-256 evidence hashing passed judicial scrutiny in the Sessions Court without defense objection.",
      author: "Public Prosecutor",
      agency: "Special Anti-Organized Crime Division",
      state: "High Court of Judicature",
      seal: "JUDICIAL",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <section id="compliance" className="py-16 md:py-20 bg-slate-50 dark:bg-[#07090E] border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-center mx-auto">
          <div className="inline-flex items-center space-x-1.5 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500"></span>
            <span>OPERATIONAL STAKEHOLDER DIRECTIVES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Field-tested across active special operations.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans">
            Trusted by investigating officers, financial intelligence units, and senior prosecuting attorneys handling high-profile syndicates.
          </p>
        </div>

        {/* 3 High-Craft Quotation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0A0F1D] rounded border border-slate-200/90 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1626] flex items-center justify-center font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {item.seal}
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${item.badgeClass}`}>
                    Verified Operation
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 font-mono">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {item.author}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  {item.agency}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                  {item.state}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
