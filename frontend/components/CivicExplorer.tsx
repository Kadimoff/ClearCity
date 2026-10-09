'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  MapPin, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  Search, Filter, Sparkles, Building2, Eye, ArrowUpRight, X,
  ExternalLink, Camera, ArrowRight, ShieldAlert, Calendar, Check
} from 'lucide-react';

interface IssueItem {
  id: string;
  titleKeyAZ: string;
  titleKeyEN: string;
  titleKeyRU: string;
  category: string;
  departmentKey: string;
  location: string;
  status: 'resolved' | 'in_progress' | 'pending';
  dateKeyAZ: string;
  dateKeyEN: string;
  dateKeyRU: string;
  image: string;
  descriptionAZ: string;
  descriptionEN: string;
  descriptionRU: string;
  timeline: { step: string; time: string; completed: boolean }[];
}

const mockIssues: IssueItem[] = [
  {
    id: 'REP-4821',
    titleKeyAZ: 'Nizami küçəsində yol çuxuru uğurla təmir edildi',
    titleKeyEN: 'Damaged Road Pothole repaired on Nizami Street',
    titleKeyRU: 'Дорожная яма на улице Низами успешно отремонтирована',
    category: 'Roads',
    departmentKey: 'dept_transport',
    location: 'Nizami Street 45, Baku',
    status: 'resolved',
    dateKeyAZ: '10 dəqiqə əvvəl',
    dateKeyEN: '10 mins ago',
    dateKeyRU: '10 мин назад',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    descriptionAZ: 'Vətəndaşın bildirdiyi 15 sm dərinlikdə asfalt çuxuru Nəqliyyat İdarəsinin təmir briqadası tərəfindən asfalt qatı ilə bərpa olundu.',
    descriptionEN: 'A 15cm deep asphalt pothole reported by a citizen was successfully resurfaced by the Transport Department road crew.',
    descriptionRU: 'Яма глубиной 15 см, о которой сообщил житель, была заасфальтирована ремонтной бригадой департамента транспорта.',
    timeline: [
      { step: 'Report Submitted', time: '10:14 AM', completed: true },
      { step: 'AI Classification Verified', time: '10:15 AM', completed: true },
      { step: 'Dispatched to Transport Dept', time: '10:20 AM', completed: true },
      { step: 'Issue Repaired & Closed', time: '11:30 AM', completed: true },
    ],
  },
  {
    id: 'REP-4820',
    titleKeyAZ: 'Fəvvarələr Meydanında fənər dirəyi yenilənir',
    titleKeyEN: 'Streetlight Maintenance & Replacement on Fountain Square',
    titleKeyRU: 'Замена и обслуживание уличного фонаря на Площади Фонтанов',
    category: 'Lighting',
    departmentKey: 'dept_lighting',
    location: 'Fountain Square, Baku',
    status: 'in_progress',
    dateKeyAZ: '25 dəqiqə əvvəl',
    dateKeyEN: '25 mins ago',
    dateKeyRU: '25 мин назад',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    descriptionAZ: 'Sayrışan və xətti qırılmış dekorativ işıqlandırma dirəyi İşıqlandırma Xidmətinin nəzarətinə götürülüb, təmir icradadır.',
    descriptionEN: 'Flickering and damaged streetlight fixture assigned to the Lighting Department; technician unit currently dispatched on-site.',
    descriptionRU: 'Мерцающий и поврежденный фонарный столб передан службе освещения, техническая бригада уже на объекте.',
    timeline: [
      { step: 'Report Submitted', time: '11:00 AM', completed: true },
      { step: 'AI Vision Verified', time: '11:01 AM', completed: true },
      { step: 'Field Technician Dispatched', time: '11:15 AM', completed: true },
      { step: 'Maintenance in Progress', time: 'Current', completed: false },
    ],
  },
  {
    id: 'REP-4819',
    titleKeyAZ: 'Yasamal Parkı yaxınlığında tullantı sahəsi təmizləndi',
    titleKeyEN: 'Cleaned Up Waste Container Area near Yasamal Park',
    titleKeyRU: 'Убрана мусорная площадка около парка Ясамал',
    category: 'Waste',
    departmentKey: 'dept_sanitation',
    location: 'Yasamal District, Baku',
    status: 'resolved',
    dateKeyAZ: '1 saat əvvəl',
    dateKeyEN: '1 hour ago',
    dateKeyRU: '1 час назад',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    descriptionAZ: 'Konteyner ətrafında toplanan tullantı yığını Təmizlik İdarəsinin xüsusi texnikası ilə tam təmizləndi və dezinfeksiya edildi.',
    descriptionEN: 'Overflowing waste dumpsters and surrounding litter cleaned and sanitized by municipal waste management vehicles.',
    descriptionRU: 'Переполненные мусорные контейнеры и прилегающая территория очищены и продезинфицированы спецтехникой.',
    timeline: [
      { step: 'Report Submitted', time: '09:30 AM', completed: true },
      { step: 'AI Vision Categorized', time: '09:31 AM', completed: true },
      { step: 'Sanitation Truck Dispatched', time: '09:45 AM', completed: true },
      { step: 'Waste Cleared & Verified', time: '10:45 AM', completed: true },
    ],
  },
  {
    id: 'REP-4818',
    titleKeyAZ: 'Neftçilər prospektində su borusu sızması yoxlanılır',
    titleKeyEN: 'Water Pipe Leak Repair Under Inspection',
    titleKeyRU: 'Проверка и устранение утечки трубы на проспекте Нефтяников',
    category: 'Water',
    departmentKey: 'dept_utilities',
    location: 'Neftchilar Avenue 12, Baku',
    status: 'pending',
    dateKeyAZ: '2 saat əvvəl',
    dateKeyEN: '2 hours ago',
    dateKeyRU: '2 часа назад',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    descriptionAZ: 'Səki altındakı boru sızıntısı qeydiyyata alınıb və təcili təmir qrupunun növbəsinə daxil edilib.',
    descriptionEN: 'Underground pavement water pipe leakage logged into the municipal queue for urgent pipeline assessment.',
    descriptionRU: 'Утечка водопровода под тротуаром зарегистрирована в муниципальной очереди на срочную инспекцию.',
    timeline: [
      { step: 'Report Submitted', time: '08:00 AM', completed: true },
      { step: 'AI Vision Categorized', time: '08:01 AM', completed: true },
      { step: 'Scheduled for Inspection', time: 'Pending', completed: false },
      { step: 'Final Resolution', time: 'Upcoming', completed: false },
    ],
  },
];

export const CivicExplorer: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalIssue, setActiveModalIssue] = useState<IssueItem | null>(null);

  const categories = [
    { key: 'All', label: t('tab_all') },
    { key: 'Roads', label: t('tab_roads') },
    { key: 'Lighting', label: t('tab_lighting') },
    { key: 'Waste', label: t('tab_waste') },
    { key: 'Water', label: t('tab_water') },
  ];

  const getIssueTitle = (issue: IssueItem) => {
    if (lang === 'az') return issue.titleKeyAZ;
    if (lang === 'ru') return issue.titleKeyRU;
    return issue.titleKeyEN;
  };

  const getIssueDate = (issue: IssueItem) => {
    if (lang === 'az') return issue.dateKeyAZ;
    if (lang === 'ru') return issue.dateKeyRU;
    return issue.dateKeyEN;
  };

  const getIssueDesc = (issue: IssueItem) => {
    if (lang === 'az') return issue.descriptionAZ;
    if (lang === 'ru') return issue.descriptionRU;
    return issue.descriptionEN;
  };

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
    const title = getIssueTitle(issue).toLowerCase();
    const loc = issue.location.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    return matchesCategory && (title.includes(q) || loc.includes(q) || issue.id.toLowerCase().includes(q));
  });

  const getStatusBadge = (status: IssueItem['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('status_resolved')}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>{t('status_in_progress')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('status_pending')}</span>
          </span>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-10 relative overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('stream_badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('stream_title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              {t('stream_subtitle')}
            </p>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('stream_search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-48 sm:w-64 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Issue Cards Grid with Smooth Tab Switch and No Layout Glitch */}
        <motion.div
          key={`${selectedCategory}-${searchQuery}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        >
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setActiveModalIssue(issue)}
                className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-500/70 dark:hover:border-indigo-500/70 hover:shadow-neon-indigo dark:hover:shadow-neon-indigo hover:-translate-y-1.5 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      {issue.id}
                    </span>
                    {getStatusBadge(issue.status)}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {getIssueTitle(issue)}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{issue.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{t(issue.departmentKey)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 dark:text-slate-500">{getIssueDate(issue)}</span>
                  <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>{t('view_details')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-400 text-sm">
              No issues found matching this filter.
            </div>
          )}
        </motion.div>
      </div>

      {/* Interactive Issue Details Modal */}
      <AnimatePresence>
        {activeModalIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                    {activeModalIssue.id}
                  </span>
                  {getStatusBadge(activeModalIssue.status)}
                </div>

                <button
                  onClick={() => setActiveModalIssue(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="relative rounded-2xl overflow-hidden max-h-56 bg-slate-950 shadow-md">
                  <img
                    src={activeModalIssue.image}
                    alt={getIssueTitle(activeModalIssue)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                    Verified Citizen Capture
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {getIssueTitle(activeModalIssue)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {getIssueDesc(activeModalIssue)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      {activeModalIssue.location}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block">Assigned Unit</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      {t(activeModalIssue.departmentKey)}
                    </span>
                  </div>
                </div>

                {/* Dispatch & Resolution Timeline */}
                <div className="space-y-3">
                  <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block">
                    Execution Timeline
                  </span>
                  <div className="space-y-2.5">
                    {activeModalIssue.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'}`}>
                            {step.completed ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          </div>
                          <span className={step.completed ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}>
                            {step.step}
                          </span>
                        </div>
                        <span className="font-mono text-slate-400">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <button
                  onClick={() => setActiveModalIssue(null)}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/report"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Report An Issue</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
