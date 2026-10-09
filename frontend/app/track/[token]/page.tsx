'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchReportByToken, Report } from '@/lib/api';
import { Loader2, CheckCircle2, Clock, AlertTriangle, Building, MapPin, Bot, History } from 'lucide-react';

export default function TrackPage() {
  const params = useParams();
  const token = params?.token as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchReportByToken(token)
        .then((data) => {
          setReport(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Report not found');
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-4">
        <div className="space-y-3">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold">Report Not Found</h2>
          <p className="text-slate-500 text-sm">Please verify the tracking token link.</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    in_progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
    resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
          <div>
            <span className="text-xs text-slate-400 font-mono">Report #{report.id.slice(0, 8)}</span>
            <h1 className="text-2xl font-bold mt-1">{report.title}</h1>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[report.status] || ''}`}>
            {report.status_display}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {report.photo_url && (
            <img src={report.photo_url} alt="Report" className="w-full max-h-72 object-cover rounded-2xl border border-slate-200 dark:border-slate-700" />
          )}

          <div className="space-y-4 text-sm">
            <p className="text-slate-600 dark:text-slate-300">{report.description}</p>
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold">{report.category_detail?.name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold">{report.department_detail?.name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Priority</span>
                <span className="font-semibold capitalize">{report.priority_display}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Address</span>
                <span className="font-semibold text-right max-w-xs">{report.address}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Created</span>
                <span className="font-semibold">{new Date(report.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Classification & Status History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {report.ai_classification && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Bot className="w-6 h-6" /> AI Classification
            </div>
            <div className="space-y-2 text-sm pt-2 border-t border-white/20">
              <div className="flex justify-between">
                <span>Predicted Category</span>
                <span className="font-bold">{report.ai_classification.category_predicted}</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence</span>
                <span className="font-bold">{(report.ai_classification.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}

        {report.status_history && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <History className="w-5 h-5 text-indigo-500" /> Status Audit History
            </div>
            <div className="space-y-3">
              {report.status_history.map((h) => (
                <div key={h.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>{new Date(h.changed_at).toLocaleString()}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{h.status_display}</span>
                  </div>
                  {h.comment && <p className="text-slate-600 dark:text-slate-300">{h.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
