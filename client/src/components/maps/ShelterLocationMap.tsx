"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, ExternalLink, Navigation, Clock, Building2 } from "lucide-react";

interface ShelterLocationMapProps {
  shelterName: string;
  latitude?: number | null;
  longitude?: number | null;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  dropOffHours?: string;
  className?: string;
}

export default function ShelterLocationMap({
  shelterName,
  latitude,
  longitude,
  street,
  city,
  state,
  zip,
  dropOffHours,
  className = "",
}: ShelterLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const hasValidCoordinates =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    (latitude !== 0 || longitude !== 0);

  const lat = hasValidCoordinates ? (latitude as number) : 37.7749;
  const lng = hasValidCoordinates ? (longitude as number) : -122.4194;

  const googleMapsUrl = hasValidCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${shelterName} ${street || ""} ${city || ""} ${state || ""}`.trim()
      )}`;

  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Custom Styled Leaflet Pin
    const customIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="
            background: #cc4b2e;
            color: #faf6ec;
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 16px rgba(204, 75, 46, 0.45);
            border: 2px solid #faf6ec;
          ">
            <svg style="transform: rotate(45deg); width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div style="
            width: 12px;
            height: 5px;
            background: rgba(44, 37, 30, 0.3);
            border-radius: 50%;
            margin-top: 2px;
          "></div>
        </div>
      `,
      iconSize: [38, 45],
      iconAnchor: [19, 45],
      popupAnchor: [0, -45],
    });

    // Instantiate map
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false, // Don't hijack page scroll
    });

    mapInstanceRef.current = map;

    // Sleek OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker
    const marker = L.marker([lat, lng], {
      icon: customIcon,
    }).addTo(map);

    // Popup with shelter summary
    const popupContent = `
      <div style="font-family: inherit; padding: 4px; max-width: 220px;">
        <strong style="display: block; font-size: 13px; color: #2c251e; margin-bottom: 4px; font-weight: 700;">
          ${shelterName}
        </strong>
        <span style="display: block; font-size: 11px; color: #8c8273; margin-bottom: 6px;">
          ${[street, city, state, zip].filter(Boolean).join(", ")}
        </span>
        <span style="display: inline-block; font-size: 11px; color: #cc4b2e; font-weight: 600;">
          Click map to open in Google Maps &rarr;
        </span>
      </div>
    `;

    marker.bindPopup(popupContent);

    // Clicking marker or map routes to Google Maps
    marker.on("click", () => {
      // Small timeout allows popup to also be readable or directly opens
      marker.openPopup();
    });

    // Clicking anywhere on map directly opens Google Maps if clicked
    map.on("click", () => {
      handleOpenGoogleMaps();
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, shelterName, street, city, state, zip]);

  const fullAddress = [street, city, state, zip].filter(Boolean).join(", ");

  return (
    <div
      className={`border border-neo-line/60 rounded-2xl bg-neo-rice overflow-hidden shadow-sm space-y-0 ${className}`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line/40 bg-neo-rice/90">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-neo-sun font-heading font-semibold text-[11px] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Facility Location & Directions</span>
          </div>
          <h3 className="font-heading font-bold text-lg text-neo-ink">
            {shelterName}
          </h3>
          {fullAddress && (
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              {fullAddress}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleOpenGoogleMaps}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20 cursor-pointer shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>

      {/* Interactive Map View */}
      <div className="relative w-full h-64 sm:h-72 cursor-pointer group">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Hover Hint Overlay */}
        <div className="absolute top-2.5 right-2.5 z-[1000] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity bg-neo-rice/95 backdrop-blur-sm border border-neo-line/60 px-3 py-1.5 rounded-xl shadow-sm text-[11px] font-heading font-semibold text-neo-ink flex items-center gap-1.5">
          <ExternalLink className="w-3 h-3 text-neo-sun" />
          <span>Click map for directions</span>
        </div>

        {/* Coordinates Badge */}
        {hasValidCoordinates && (
          <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-neo-rice/95 backdrop-blur-sm border border-neo-line/60 px-2.5 py-1 rounded-lg shadow-sm text-[10px] font-mono text-neo-ash flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-neo-sun" />
            <span>
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </span>
          </div>
        )}
      </div>

      {/* Footer Info Row */}
      {dropOffHours && (
        <div className="p-3.5 bg-neo-bg/50 border-t border-neo-line/40 flex items-center justify-between text-xs font-body text-neo-ash px-5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-neo-sun" />
            <span>Drop-Off Hours: <strong className="text-neo-ink font-heading">{dropOffHours}</strong></span>
          </div>
          <span className="text-[11px] text-neo-sun font-semibold">Drop-off friendly</span>
        </div>
      )}
    </div>
  );
}
