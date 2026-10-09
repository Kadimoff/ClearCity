'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchReportByToken, updateReportStatus, Report } from '@/lib/api';
import { Loader2, Building, Check, Send, AlertCircle } from 'lucide-react';

export default function DepartmentPortalPage() {
  const params = useParams();
  const token = params?.token as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('pending');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchReportByToken(token)
        .then((data) => {
          setReport(data);
          setNewStatus(data.status);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setUpdating(true);
    try {
      const updated = await updateReportStatus(token, newStatus, comment);
      setReport(updated);
      setMessage('Status updated successfully!');
      setComment('');
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-4">
        <div>
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold">Invalid Department Link</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Portal Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center gap-4 shadow-lg">
        <Building className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold">Department Portal</h1>
          <p className="text-xs text-emerald-100">Review issue & update resolution status</p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-500" /> {message}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Issue Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
          <h2 className="text-2xl font-bold">{report.title}</h2>
          {report.photo_url && (
            <img src={report.photo_url} alt="Report" className="w-full max-h-80 object-cover rounded-2xl border border-slate-200 dark:border-slate-700" />
          )}
          <p className="text-slate-600 dark:text-slate-300 text-sm">{report.description}</p>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Address</span>
              <span className="font-semibold">{report.address}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Current Status</span>
              <span className="font-semibold capitalize text-emerald-600 dark:text-emerald-400">{report.status_display}</span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
          <h3 className="font-bold text-lg">Update Status</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none"
              >
                <option value="pending">Gözləmədə (Pending)</option>
                <option value="accepted">Qəbul edilib (Accepted)</option>
                <option value="in_progress">İcrada (In Progress)</option>
                <option value="resolved">Həll edilib (Resolved)</option>
                <option value="rejected">Rədd edilib (Rejected)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Comment</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add status update notes..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-sm"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
