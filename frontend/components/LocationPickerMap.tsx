'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPickerMapProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const isInitializingRef = useRef(false);

  // Initialize Leaflet map safely
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current || isInitializingRef.current) return;

      isInitializingRef.current = true;

      try {
        const L = (await import('leaflet')).default;
        if (isCancelled || !mapContainerRef.current) return;

        // Cleanup any lingering Leaflet instance on the DOM element
        if ((mapContainerRef.current as any)._leaflet_id) {
          delete (mapContainerRef.current as any)._leaflet_id;
        }

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(99, 102, 241, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #9333ea); border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const initialLat = latitude || 40.4093;
        const initialLng = longitude || 49.8671;

        // Create map (keep attribution visible — required by the OSM tile policy)
        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
        }).setView([initialLat, initialLng], latitude ? 15 : 12);

        // OpenStreetMap standard tiles — no API key required
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          referrerPolicy: 'strict-origin-when-cross-origin',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapInstanceRef.current = map;

        // Force tile rendering recalculation on mount
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 300);

        // Place initial marker if coordinates exist
        if (latitude && longitude) {
          markerRef.current = L.marker([latitude, longitude], {
            icon: customIcon,
            draggable: true,
          }).addTo(map);

          markerRef.current.on('dragend', (e: any) => {
            const pos = e.target.getLatLng();
            const lat = parseFloat(pos.lat.toFixed(6));
            const lng = parseFloat(pos.lng.toFixed(6));
            onLocationChange(lat, lng);
          });
        }

        // Map click handler
        map.on('click', async (e: any) => {
          const lat = parseFloat(e.latlng.lat.toFixed(6));
          const lng = parseFloat(e.latlng.lng.toFixed(6));

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng], {
              icon: customIcon,
              draggable: true,
            }).addTo(map);

            markerRef.current.on('dragend', (ev: any) => {
              const pos = ev.target.getLatLng();
              const newLat = parseFloat(pos.lat.toFixed(6));
              const newLng = parseFloat(pos.lng.toFixed(6));
              onLocationChange(newLat, newLng);
            });
          }

          // Reverse geocode address
          let resolvedAddress = '';
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
                resolvedAddress = [road, house, suburb].filter(Boolean).join(', ') || data.display_name;
              }
            }
          } catch (err) {
            // Ignore
          }

          onLocationChange(lat, lng, resolvedAddress || undefined);
        });
      } catch (error) {
        console.error('Leaflet map initialization error:', error);
      } finally {
        isInitializingRef.current = false;
      }
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
      isInitializingRef.current = false;
      if (mapContainerRef.current) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Update marker position when latitude or longitude props change externally
  useEffect(() => {
    if (!mapInstanceRef.current || !latitude || !longitude) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(99, 102, 241, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #9333ea); border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        markerRef.current = L.marker([latitude, longitude], {
          icon: customIcon,
          draggable: true,
        }).addTo(mapInstanceRef.current);

        markerRef.current.on('dragend', (ev: any) => {
          const pos = ev.target.getLatLng();
          onLocationChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
        });
      }

      mapInstanceRef.current.flyTo([latitude, longitude], 15, {
        animate: true,
        duration: 1.2,
      });
    });
  }, [latitude, longitude]);

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Interactive Location Map</span>
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          Tap or drag marker to set exact location
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
        <div ref={mapContainerRef} style={{ height: '240px', width: '100%' }} className="z-0" />
      </div>

      {latitude && longitude && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-mono border border-indigo-100 dark:border-indigo-800/50">
          <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
          <span>
            Selected Coordinates: <strong>{latitude.toFixed(5)}</strong>, <strong>{longitude.toFixed(5)}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
