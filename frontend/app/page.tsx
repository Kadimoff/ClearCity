'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useLanguage } from '@/context/LanguageContext';
import { CivicExplorer } from '@/components/CivicExplorer';
import { HeroTypewriter } from '@/components/HeroTypewriter';
import {
  Camera, Bot, Send, Activity, ArrowRight, Zap, ShieldCheck,
  CheckCircle2, Clock, MapPin, Sparkles, Building2, ChevronDown, ChevronUp,
  Construction, Lightbulb, Trash2, Droplets, Wrench, Trees, AlertTriangle,
  ArrowUpRight, PhoneCall, ShieldAlert, BadgeCheck, Play, Eye
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // GSAP Entrance animation
  useEffect(() => {
    if (heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.gsap-hero-badge', { opacity: 0, y: -20, duration: 0.8, ease: 'back.out(1.7)' });
        gsap.from('.gsap-hero-title', { opacity: 0, y: 30, duration: 1, delay: 0.2, ease: 'power3.out' });
        gsap.from('.gsap-hero-sub', { opacity: 0, y: 20, duration: 1, delay: 0.4, ease: 'power3.out' });
        gsap.from('.gsap-hero-cta', { opacity: 0, scale: 0.9, duration: 0.8, delay: 0.5, ease: 'back.out(1.5)' });
        gsap.from('.gsap-hero-video', { opacity: 0, y: 40, duration: 1, delay: 0.7, ease: 'power3.out' });
      }, heroRef);
      return () => ctx.revert();
    }
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const typedPhrases = [
    t('typed_1'),
    t('typed_2'),
    t('typed_3'),
    t('typed_4'),
    t('typed_5'),
  ];

  const categories = [
    {
      title: t('cat_potholes'),
      desc: 'Asphalt cracks, deep road craters, sidewalk degradation, and curb fractures.',
      icon: Construction,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-500 border-amber-500/30',
      badge: 'Transport Dept',
    },
    {
      title: t('cat_lighting'),
      desc: 'Malfunctioning streetlights, flickering fixtures, dark public alleys, and power line faults.',
      icon: Lightbulb,
      color: 'from-yellow-500/20 to-amber-500/20 text-amber-600 dark:text-yellow-500 border-yellow-500/30',
      badge: 'Lighting Dept',
    },
    {
      title: t('cat_trash'),
      desc: 'Overflowing municipal dumpsters, illegal waste accumulation, and litter hotspots.',
      icon: Trash2,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-500 border-emerald-500/30',
      badge: 'Sanitation Dept',
    },
    {
      title: t('cat_water'),
      desc: 'Underground pipeline bursts, sewer overflows, stagnant street puddles, and drainage blocks.',
      icon: Droplets,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
      badge: 'Utilities Dept',
    },
    {
      title: t('cat_infra'),
      desc: 'Damaged park benches, broken guardrails, vandalized bus stops, and bent traffic signage.',
      icon: Wrench,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
      badge: 'Public Works',
    },
    {
      title: t('cat_trees'),
      desc: 'Overhanging hazardous branches, fallen trees blocking roads, and root sidewalk disruptions.',
      icon: Trees,
      color: 'from-green-500/20 to-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-green-500/30',
      badge: 'Parks & Greenery',
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      {/* Dynamic Hero Section with Video Showcase */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 lg:px-8 text-center transition-colors duration-300"
      >
        {/* Ambient mesh background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-cyan-400/15 dark:from-indigo-600/30 dark:via-purple-600/30 dark:to-cyan-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]"></div>

        <div className="max-w-5xl mx-auto space-y-6 relative z-10">
          <div className="gsap-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/90 dark:bg-white/10 backdrop-blur-md border border-indigo-200/80 dark:border-white/20 text-xs font-bold tracking-wide text-indigo-700 dark:text-indigo-300 shadow-sm dark:shadow-neon-indigo">
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-300 animate-bounce" />
            <span>{t('hero_badge')}</span>
          </div>

          <h1 className="gsap-hero-title text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            ClearCity —{' '}
            <HeroTypewriter phrases={typedPhrases} />
          </h1>

          <p className="gsap-hero-sub text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('hero_subtitle')}
          </p>

          <div className="gsap-hero-cta pt-2">
            <Link
              href="/report"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-9 py-4 rounded-full text-base sm:text-lg shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>{t('hero_cta')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Hero Video Showcase at Bottom of Hero */}
          <div className="gsap-hero-video pt-12 max-w-4xl mx-auto">
            <div className="relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-indigo-500/20 via-purple-500/20 to-slate-200/50 dark:to-slate-800/50 backdrop-blur-xl border border-indigo-500/30 dark:border-indigo-500/40 shadow-2xl shadow-indigo-500/10 dark:shadow-neon-indigo group">
              {/* Window Header Mockup */}
              <div className="flex items-center justify-between px-4 py-2 bg-white/80 dark:bg-slate-900/80 rounded-t-2xl border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>ClearCity Platform Walkthrough</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  HD 1080p
                </div>
              </div>

              {/* Video Player */}
              <div className="relative rounded-b-2xl overflow-hidden bg-slate-950 aspect-video">
                <video
                  src="/videos/clearcityvideo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact & Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl text-center"
        >
          <div className="space-y-1 p-2">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">1,240+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">{t('stats_reports')}</div>
          </div>
          <div className="space-y-1 p-2 border-l border-slate-200 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">98.4%</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">{t('stats_precision')}</div>
          </div>
          <div className="space-y-1 p-2 border-l-0 md:border-l border-slate-200 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">&lt; 24h</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">{t('stats_response')}</div>
          </div>
          <div className="space-y-1 p-2 border-l border-slate-200 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">15+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">{t('stats_depts')}</div>
          </div>
        </motion.div>
      </section>

      {/* 4 Steps to a Cleaner City (High Contrast for Light & Dark Modes) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Simple Process
          </span>
          <h2 className="text-3xl font-black mt-2 sm:text-4xl text-slate-900 dark:text-white">
            4 Steps to a Cleaner City
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">
            From photo capture to swift resolution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Camera, title: t('step1_title'), desc: t('step1_desc'), num: '1' },
            { icon: Bot, title: t('step2_title'), desc: t('step2_desc'), num: '2' },
            { icon: Send, title: t('step3_title'), desc: t('step3_desc'), num: '3' },
            { icon: Activity, title: t('step4_title'), desc: t('step4_desc'), num: '4' },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-none hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <span className="absolute top-6 right-6 text-3xl font-black text-slate-300 dark:text-slate-700/80 group-hover:text-indigo-500/40 transition-colors select-none">
                0{step.num}
              </span>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Civic Explorer Stream Component */}
      <CivicExplorer />

      {/* Issues We Resolve Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 text-xs font-bold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Civic Scope & Domains</span>
          </div>
          <h2 className="text-3xl font-black sm:text-4xl text-slate-900 dark:text-white">{t('cat_title')}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">{t('cat_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md hover:border-indigo-500/60 dark:hover:border-indigo-500/60 hover:shadow-xl dark:hover:shadow-neon-indigo cursor-pointer transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Report this issue</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black sm:text-4xl text-slate-900 dark:text-white">{t('faq_title')}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">{t('faq_subtitle')}</p>
        </div>

        <div className="space-y-4">
          {[
            { q: t('faq_q1'), a: t('faq_a1') },
            { q: t('faq_q2'), a: t('faq_a2') },
            { q: t('faq_q3'), a: t('faq_a3') },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left font-bold text-base flex justify-between items-center gap-4 text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4"
                >
                  {item.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Citizen Empowerment Initiative Banner (SaaS Gradient High Contrast) */}
      <section ref={ctaRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-10 sm:p-16 rounded-[2.5rem] bg-gradient-to-br from-indigo-700 via-indigo-900 to-purple-950 text-white overflow-hidden border border-indigo-500/40 shadow-2xl"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide text-white">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Citizen Empowerment Initiative</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Transform Your Neighborhood With <span className="text-cyan-300 drop-shadow-sm">A Single Photo</span>
            </h2>

            <p className="text-indigo-100 max-w-xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
              Join thousands of citizens making our city cleaner, safer, and smarter. Instant AI analysis and direct municipal dispatch.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/report"
                className="inline-flex items-center gap-3 bg-white hover:bg-slate-100 text-indigo-950 font-black px-9 py-4 rounded-full text-base shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-indigo-600" />
                <span>{t('hero_cta')}</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
