'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, Bot, Send, Activity, ArrowRight, ShieldCheck, Zap, Eye } from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 text-white py-28 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide">
            <Zap className="w-4 h-4 text-amber-300" />
            {t('hero_badge')}
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            CityAssist — <span className="text-amber-300">{t('hero_title')}</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            {t('hero_subtitle')}
          </p>

          <div className="pt-4">
            <Link
              href="/report"
              className="inline-flex items-center gap-3 bg-white text-indigo-700 font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
            >
              {t('hero_cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Workflow
          </span>
          <h2 className="text-3xl font-extrabold mt-2 sm:text-4xl">4 Simple Steps</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">From photo to resolution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Camera, title: t('step1_title'), desc: t('step1_desc'), num: '1' },
            { icon: Bot, title: t('step2_title'), desc: t('step2_desc'), num: '2' },
            { icon: Send, title: t('step3_title'), desc: t('step3_desc'), num: '3' },
            { icon: Activity, title: t('step4_title'), desc: t('step4_desc'), num: '4' },
          ].map((step, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all"
            >
              <span className="absolute top-6 right-6 text-3xl font-black text-slate-200 dark:text-slate-700">
                0{step.num}
              </span>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{t('cat_title')}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">{t('cat_subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: t('cat_potholes'), emoji: '🛣️' },
            { name: t('cat_lighting'), emoji: '💡' },
            { name: t('cat_trash'), emoji: '🗑️' },
            { name: t('cat_water'), emoji: '💧' },
            { name: t('cat_infra'), emoji: '🛠️' },
            { name: t('cat_trees'), emoji: '🌳' },
          ].map((c, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center hover:border-indigo-500 transition-all hover:scale-105"
            >
              <div className="text-3xl mb-3">{c.emoji}</div>
              <h4 className="font-bold text-sm">{c.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
