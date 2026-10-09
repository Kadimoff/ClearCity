'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
        <div>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CityAssist
          </span>
          <p className="mt-3 text-slate-400 text-sm">{t('footer_tagline')}</p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-indigo-400 transition-colors">
                {t('nav_home')}
              </Link>
            </li>
            <li>
              <Link href="/report" className="hover:text-indigo-400 transition-colors">
                {t('nav_report')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>📧 support@cityassist.az</li>
            <li>📞 +994 XX XXX XX XX</li>
            <li>📍 Baku, Azerbaijan</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} CityAssist. {t('footer_rights')}
      </div>
    </footer>
  );
};
