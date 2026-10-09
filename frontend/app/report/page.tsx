'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { submitReport, classifyPhoto } from '@/lib/api';
import { Camera, Image as ImageIcon, MapPin, Send, Loader2, Sparkles } from 'lucide-react';

export default function ReportPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoSource, setPhotoSource] = useState<'camera' | 'gallery'>('camera');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreview(URL.createObjectURL(file));

      // AI Classification call to Django API
      setAiLoading(true);
      try {
        const res = await classifyPhoto(file);
        if (res.description) {
          if (!description) setDescription(res.description);
          setAiResult(res.description);
        }
      } catch (err) {
        // Fallback silently
      } finally {
        setAiLoading(false);
      }
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by your browser');
      return;
    }
    setGpsStatus('Fetching device GPS...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setGpsStatus(`GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
      },
      (err) => {
        setGpsStatus('GPS permission denied or unavailable');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      alert('Please upload a photo of the problem');
      return;
    }
    if (!address.trim()) {
      alert('Please provide an address');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('address', address);
      formData.append('description', description);
      if (citizenEmail) formData.append('citizen_email', citizenEmail);
      if (latitude) formData.append('latitude', latitude.toString());
      if (longitude) formData.append('longitude', longitude.toString());
      formData.append('photo_source', photoSource);

      const createdReport = await submitReport(formData);
      router.push(`/track/${createdReport.citizen_token}`);
    } catch (err: any) {
      alert('Failed to submit report. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold">{t('nav_report')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Upload photo & details — AI and GPS will route your request directly to city departments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-800/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
        {/* Source Selector */}
        <div className="space-y-3">
          <label className="block font-bold text-sm">Photo Source *</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPhotoSource('camera')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                photoSource === 'camera'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Camera className="w-6 h-6" />
              <div>
                <div className="text-sm font-bold">Camera</div>
                <div className="text-xs opacity-75">Take instant photo</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPhotoSource('gallery')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                photoSource === 'gallery'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ImageIcon className="w-6 h-6" />
              <div>
                <div className="text-sm font-bold">Gallery</div>
                <div className="text-xs opacity-75">Upload file</div>
              </div>
            </button>
          </div>
        </div>

        {/* Upload Box */}
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            capture={photoSource === 'camera' ? 'environment' : undefined}
            onChange={handleFileChange}
            id="photoInput"
            className="hidden"
          />

          {!preview ? (
            <label
              htmlFor="photoInput"
              className="flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer transition-all bg-slate-50 dark:bg-slate-900/50"
            >
              <Camera className="w-10 h-10 text-slate-400 mb-3" />
              <span className="font-semibold text-sm">Click to capture or upload photo</span>
              <span className="text-xs text-slate-400 mt-1">JPEG, PNG up to 10MB</span>
            </label>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={preview} alt="Upload preview" className="w-full max-h-80 object-cover" />
              <label
                htmlFor="photoInput"
                className="absolute top-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-md cursor-pointer hover:bg-slate-900"
              >
                Change Photo
              </label>
            </div>
          )}

          {aiLoading && (
            <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              <Sparkles className="w-4 h-4 animate-spin" /> AI analyzing image...
            </div>
          )}
          {aiResult && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
              ✨ AI Suggested Description: {aiResult}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="block font-bold text-sm">Address & Location *</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Nizami Street 45, Baku"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-bold whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-indigo-500" />
              GPS
            </button>
          </div>
          {gpsStatus && <p className="text-xs text-slate-500">{gpsStatus}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block font-bold text-sm">Problem Description *</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem in detail..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Citizen Email */}
        <div className="space-y-2">
          <label className="block font-bold text-sm">
            Email Address <span className="font-normal text-slate-400 text-xs">(optional)</span>
          </label>
          <input
            type="email"
            value={citizenEmail}
            onChange={(e) => setCitizenEmail(e.target.value)}
            placeholder="To receive status updates"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {t('submit_btn')}
        </button>
      </form>
    </div>
  );
}
