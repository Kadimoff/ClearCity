'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  Search, Filter, Sparkles, Building2, Eye, ArrowUpRight
} from 'lucide-react';

interface IssueItem {
  id: string;
  title: string;
  category: string;
  department: string;
  location: string;
  status: 'resolved' | 'in_progress' | 'pending';
  statusText: string;
  date: string;
  image: string;
}

const mockIssues: IssueItem[] = [
  {
    id: 'REP-4821',
    title: 'Damaged Road Pothole repaired on Nizami Street',
    category: 'Roads',
    department: 'Roads & Transportation Department',
    location: 'Nizami Street 45, Baku',
    status: 'resolved',
    statusText: 'Həll edilib (Resolved)',
    date: '10 mins ago',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'REP-4820',
    title: 'Streetlight Maintenance & Replacement on Fountain Square',
    category: 'Lighting',
    department: 'Public Lighting Department',
    location: 'Fountain Square, Baku',
    status: 'in_progress',
    statusText: 'İcrada (In Progress)',
    date: '25 mins ago',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'REP-4819',
    title: 'Cleaned Up Waste Container Area near Yasamal Park',
    category: 'Waste',
    department: 'Sanitation & Waste Management',
    location: 'Yasamal District, Baku',
    status: 'resolved',
    statusText: 'Həll edilib (Resolved)',
    date: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'REP-4818',
    title: 'Water Pipe Leak Repair Under Inspection',
    category: 'Water',
    department: 'General Utilities Department',
    location: 'Neftchilar Avenue 12',
    status: 'pending',
    statusText: 'Gözləmədə (Pending)',
    date: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
  },
];

export const CivicExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Roads', 'Lighting', 'Waste', 'Water'];

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const statusBadge = (status: IssueItem['status'], text: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {text}
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            {text}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5" />
            {text}
          </span>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-10 relative overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Live Civic Stream
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Real-Time Issue Pipeline & Resolutions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              Explore reported municipal challenges and live resolution status directly managed by city authorities.
            </p>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search issues or street..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-48 sm:w-64"
              />
            </div>

            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Grid with Framer Motion AnimatePresence */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <AnimatePresence>
            {filteredIssues.map((issue) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={issue.id}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500/60 hover:shadow-neon-indigo transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md">
                      {issue.id}
                    </span>
                    {statusBadge(issue.status, issue.statusText)}
                  </div>

                  <h3 className="font-bold text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {issue.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{issue.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{issue.department}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">{issue.date}</span>
                  <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    View Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
