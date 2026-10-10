'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useLanguage } from '@/context/LanguageContext';
import { submitReport, classifyPhoto } from '@/lib/api';
import {
  Camera, Image as ImageIcon, MapPin, Send, Loader2, Sparkles,
  UploadCloud, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, Zap
} from 'lucide-react';

// Dynamically import Leaflet Map Component to avoid SSR window issues
const LocationPickerMap = dynamic(
  () => import('@/components/LocationPickerMap').then((mod) => mod.LocationPickerMap),
  { ssr: false, loading: () => <div className="h-60 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400">Loading Map...</div> }
);

export default function ReportPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const formCardRef = useRef<HTMLDivElement>(null);

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
  const [gpsLoading, setGpsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // GSAP Entrance animation
  useEffect(() => {
    if (formCardRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.gsap-report-header', { opacity: 0, y: -20, duration: 0.7, ease: 'power3.out' });
        gsap.from('.gsap-report-card', { opacity: 0, y: 30, scale: 0.98, duration: 0.8, delay: 0.2, ease: 'back.out(1.4)' });
      }, formCardRef);
      return () => ctx.revert();
    }
  }, []);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFileError('Please drop an image file (JPEG, PNG, WEBP).');
      return;
    }
    setFileError(null);
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
      // Fallback gracefully
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
      // Reset input so the same file can be picked again
      e.target.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);
    // Dropping a new photo always switches to gallery mode
    setPhotoSource('gallery');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    setGpsStatus('Acquiring high-precision GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setGpsStatus(`GPS: ${lat}°, ${lng}°`);
        setGpsLoading(false);

        // Reverse geocode address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'ClearCity-App' } }
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              const road = data.address?.road || data.address?.pedestrian || '';
              const house = data.address?.house_number || '';
              const suburb = data.address?.suburb || data.address?.city_district || data.address?.city || '';
              const generated = [road, house, suburb].filter(Boolean).join(', ') || data.display_name;
              if (generated) setAddress(generated);
            }
          }
        } catch (e) {
          // Ignore
        }
      },
      (err) => {
        setGpsStatus('GPS permission denied or unavailable');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapLocationChange = (lat: number, lng: number, resolvedAddress?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setGpsStatus(`GPS: ${lat}°, ${lng}°`);
    if (resolvedAddress) {
      setAddress(resolvedAddress);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      alert('Please upload or capture a photo of the issue');
      return;
    }
    if (!address.trim()) {
      alert('Please provide an address or select a location on the map');
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
      alert('Failed to submit report. Please check your network connection.');
      setLoading(false);
    }
  };

  return (
    <div ref={formCardRef} className="max-w-3xl mx-auto px-4 py-12 relative">
      {/* Background subtle glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="gsap-report-header text-center mb-10 space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI-Powered Issue Dispatch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          {t('nav_report')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal">
          Upload photo & details — AI and GPS will route your request directly to city departments.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="gsap-report-card space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 sm:p-10 rounded-[2rem] shadow-xl dark:shadow-2xl relative z-10"
      >
        {/* Photo Source Selector */}
        <div className="space-y-3">
          <label className="block font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Photo Source & Mode <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPhotoSource('camera')}
              className={`p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-3 sm:gap-4 transition-all duration-200 cursor-pointer ${
                photoSource === 'camera'
                  ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-bold">Camera</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Take instant photo</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPhotoSource('gallery')}
              className={`p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-3 sm:gap-4 transition-all duration-200 cursor-pointer ${
                photoSource === 'gallery'
                  ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <UploadCloud className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-bold">Gallery</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Upload from files</div>
              </div>
            </button>
          </div>
        </div>

        {/* Upload Dropzone (click + drag & drop) */}
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            capture={photoSource === 'camera' ? 'environment' : undefined}
            onChange={handleFileChange}
            ref={fileInputRef}
            id="photoInput"
            className="hidden"
          />

          {!preview ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center p-10 sm:p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isDragging
                  ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 scale-[1.01] shadow-lg'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-3 transition-transform ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
                <UploadCloud className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                {isDragging ? 'Drop your photo here' : 'Click to capture or upload photo'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isDragging ? 'Release to upload' : '…or drag & drop it here — Supports High-Resolution JPEG, PNG (EXIF GPS auto-read)'}
              </span>
            </div>
          ) : (
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`relative rounded-2xl overflow-hidden border shadow-md group transition-all ${
                isDragging
                  ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/50'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <img src={preview} alt="Upload preview" className="w-full max-h-80 object-cover" />
              {isDragging && (
                <div className="absolute inset-0 bg-indigo-600/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white pointer-events-none">
                  <UploadCloud className="w-10 h-10" />
                  <span className="font-bold text-base">Drop to replace photo</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-3 right-3 bg-slate-900/90 hover:bg-slate-950 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 border border-white/20 shadow-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change Photo</span>
              </button>
            </div>
          )}

          {fileError && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-500/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {aiLoading && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-500/20">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>AI Vision Analyzing Photo & Detecting Issue Category...</span>
            </div>
          )}
          {aiResult && (
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 text-xs font-medium border border-indigo-200 dark:border-indigo-500/30 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5 text-indigo-950 dark:text-indigo-200">
                  AI Suggested Classification:
                </strong>
                <span>{aiResult}</span>
              </div>
            </div>
          )}
        </div>

        {/* Address & Location with Interactive Leaflet Map */}
        <div className="space-y-3">
          <label className="block font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Address & Location <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2.5">
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Nizami Street 45, Baku"
              className="flex-1 px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gpsLoading}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-slate-700 whitespace-nowrap transition-all cursor-pointer"
            >
              {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <MapPin className="w-4 h-4 text-rose-500" />}
              <span>GPS Pin</span>
            </button>
          </div>

          {gpsStatus && (
            <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 pl-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {gpsStatus}
            </p>
          )}

          {/* Interactive Leaflet Location Picker Map (No Leaflet Text Mentioned) */}
          <LocationPickerMap
            latitude={latitude}
            longitude={longitude}
            onLocationChange={handleMapLocationChange}
          />
        </div>

        {/* Problem Description */}
        <div className="space-y-2">
          <label className="block font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Problem Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem in detail (e.g. deep pothole near the pedestrian crossing)..."
            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all leading-relaxed shadow-xs"
          />
        </div>

        {/* Citizen Email */}
        <div className="space-y-2">
          <label className="block font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Citizen Email <span className="font-normal text-slate-500 dark:text-slate-400 lowercase">(optional for updates)</span>
          </label>
          <input
            type="email"
            value={citizenEmail}
            onChange={(e) => setCitizenEmail(e.target.value)}
            placeholder="your-email@example.com (to receive status updates)"
            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 text-base transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          <span>{t('submit_btn')}</span>
        </button>
      </motion.form>
    </div>
  );
}
