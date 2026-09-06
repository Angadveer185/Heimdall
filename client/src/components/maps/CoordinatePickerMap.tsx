"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed, MapPin, Loader2, Compass } from "lucide-react";

interface CoordinatePickerMapProps {
  latitude: number;
  longitude: number;
  onChange: (coords: { lat: number; lng: number }) => void;
  className?: string;
}

export default function CoordinatePickerMap({
  latitude,
  longitude,
  onChange,
  className = "",
}: CoordinatePickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default fallback coordinates if invalid or 0
    const initialLat = Number.isFinite(latitude) && latitude !== 0 ? latitude : 37.7749;
    const initialLng = Number.isFinite(longitude) && longitude !== 0 ? longitude : -122.4194;

    // Create custom pin icon
    const customIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            background: #cc4b2e;
            color: #faf6ec;
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(204, 75, 46, 0.45);
            border: 2px solid #faf6ec;
          ">
            <svg style="transform: rotate(45deg); width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div style="
            width: 10px;
            height: 4px;
            background: rgba(44, 37, 30, 0.25);
            border-radius: 50%;
            margin-top: 2px;
          "></div>
        </div>
      `,
      iconSize: [36, 42],
      iconAnchor: [18, 42],
      popupAnchor: [0, -42],
    });

    // Instantiate map
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Add sleek tiles (OpenStreetMap standard with clean styling)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create marker
    const marker = L.marker([initialLat, initialLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    // Handle marker drag
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      const newLat = parseFloat(position.lat.toFixed(6));
      const newLng = parseFloat(position.lng.toFixed(6));
      onChange({ lat: newLat, lng: newLng });
    });

    // Handle map click
    map.on("click", (e: L.LeafletMouseEvent) => {
      const newLat = parseFloat(e.latlng.lat.toFixed(6));
      const newLng = parseFloat(e.latlng.lng.toFixed(6));
      marker.setLatLng([newLat, newLng]);
      map.panTo([newLat, newLng], { animate: true });
      onChange({ lat: newLat, lng: newLng });
    });

    // Invalidate size on initial mount after DOM settlement
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []); // Run once on mount

  // Sync marker and map center when latitude/longitude change from outside
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    const currentPos = markerRef.current.getLatLng();
    const isDifferent =
      Math.abs(currentPos.lat - latitude) > 0.0001 ||
      Math.abs(currentPos.lng - longitude) > 0.0001;

    if (isDifferent) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.panTo([latitude, longitude], { animate: true });
    }
  }, [latitude, longitude]);

  // Handle Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocateError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));

        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.2 });
        }
        onChange({ lat, lng });
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation failed:", error.message);
        setLocateError("Could not detect location. Please pin manually.");
        setIsLocating(false);
        setTimeout(() => setLocateError(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Map Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-body">
        <span className="inline-flex items-center gap-1.5 text-neo-ash font-medium">
          <Compass className="w-3.5 h-3.5 text-neo-sun" />
          <span>Click anywhere on the map or drag the pin to pick coordinates</span>
        </span>

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neo-bg border border-neo-line/70 hover:border-neo-sun text-neo-ink hover:text-neo-sun text-xs font-heading font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-neo-sun" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5 text-neo-sun" />
          )}
          <span>{isLocating ? "Detecting GPS..." : "Locate Me (GPS)"}</span>
        </button>
      </div>

      {locateError && (
        <div className="text-[11px] font-body text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
          {locateError}
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden border border-neo-line/70 shadow-sm z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Coordinates Overlay Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-neo-rice/95 backdrop-blur-sm border border-neo-line/70 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2 text-[11px] font-mono text-neo-ink">
          <MapPin className="w-3.5 h-3.5 text-neo-sun shrink-0" />
          <span>
            {Number.isFinite(latitude) ? latitude.toFixed(6) : "0.000000"},{" "}
            {Number.isFinite(longitude) ? longitude.toFixed(6) : "0.000000"}
          </span>
        </div>
      </div>
    </div>
  );
}
