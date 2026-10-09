'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import {
  ShieldCheck, MapPin, PhoneCall, Mail,
  ArrowUp, Sparkles, PlusCircle, CheckCircle2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 pt-16 pb-8 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand & Mission Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <img
                src={theme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png'}
                alt="ClearCity Logo"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('footer_tagline')}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>AI Dispatch Network: Active</span>
            </div>
          </div>

          {/* Civic Services & Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">
              Civic Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/report"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-indigo-500" />
                  <span>{t('nav_report')}</span>
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Live Issue Pipeline
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Open Municipal Standards v2.4
                </span>
              </li>
            </ul>
          </div>

          {/* Municipal Emergency & Dispatch Hub */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">
              Municipal Dispatch
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Nizami Str. & Fountain Square Hub, Baku</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>24/7 Hotline: +994 (12) 598-0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>dispatch@clearcity.az</span>
              </li>
            </ul>
          </div>

          {/* AI & Governance */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">
              AI & Privacy Trust
            </h4>
            <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>OpenAI Vision Automated Routing</span>
              </div>
              <p>
                EXIF GPS metadata is processed securely for precise municipal dispatch. No citizen accounts or invasive data stored.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} ClearCity Platform. {t('footer_rights')}
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
