'use client';

import * as React from 'react';
import { useMap } from './Map';

export type UtilityLayerType =
  | 'roads'
  | 'water_pipes'
  | 'power_lines'
  | 'hospitals'
  | 'schools'
  | 'govt_offices'
  | 'bus_stops';

export interface UtilityLayerConfig {
  id: UtilityLayerType;
  label: string;
  labelHi: string;
  color: string;
  icon: string; // emoji
  type: 'line' | 'circle';
  /** Mock GeoJSON data for demo — replace with real tile URLs in production */
  mockFeatures?: GeoJSON.Feature[];
}

export const UTILITY_LAYER_CONFIGS: UtilityLayerConfig[] = [
  {
    id: 'roads',
    label: 'Roads & Highways',
    labelHi: 'सड़कें',
    color: '#F59E0B',
    icon: '🛣️',
    type: 'line',
  },
  {
    id: 'water_pipes',
    label: 'Water Supply Network',
    labelHi: 'जल आपूर्ति',
    color: '#3B82F6',
    icon: '💧',
    type: 'line',
  },
  {
    id: 'power_lines',
    label: 'Electricity Grid',
    labelHi: 'विद्युत लाइनें',
    color: '#EF4444',
    icon: '⚡',
    type: 'line',
  },
  {
    id: 'hospitals',
    label: 'Hospitals & PHCs',
    labelHi: 'अस्पताल',
    color: '#EC4899',
    icon: '🏥',
    type: 'circle',
  },
  {
    id: 'schools',
    label: 'Schools & Colleges',
    labelHi: 'विद्यालय',
    color: '#10B981',
    icon: '🏫',
    type: 'circle',
  },
  {
    id: 'govt_offices',
    label: 'Govt / Revenue Offices',
    labelHi: 'सरकारी कार्यालय',
    color: '#8B5CF6',
    icon: '🏛️',
    type: 'circle',
  },
  {
    id: 'bus_stops',
    label: 'Bus Stops & Transit',
    labelHi: 'बस स्टॉप',
    color: '#6B7280',
    icon: '🚌',
    type: 'circle',
  },
];

/** Demo mock GeoJSON generator — returns synthetic points/lines near map centre */
function mockGeoJSON(
  layerType: UtilityLayerType,
  center: [number, number],
  geomType: 'line' | 'circle'
): GeoJSON.FeatureCollection {
  const [lng, lat] = center;
  if (geomType === 'line') {
    // Create 3–4 random line segments near centre
    return {
      type: 'FeatureCollection',
      features: Array.from({ length: 4 }, (_, i) => ({
        type: 'Feature' as const,
        properties: { layer_type: layerType, id: `${layerType}-line-${i}` },
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [lng + (Math.random() - 0.5) * 0.04, lat + (Math.random() - 0.5) * 0.04],
            [lng + (Math.random() - 0.5) * 0.04, lat + (Math.random() - 0.5) * 0.04],
            [lng + (Math.random() - 0.5) * 0.04, lat + (Math.random() - 0.5) * 0.04],
          ],
        },
      })),
    };
  } else {
    // 6–8 random point features
    return {
      type: 'FeatureCollection',
      features: Array.from({ length: 6 }, (_, i) => ({
        type: 'Feature' as const,
        properties: { layer_type: layerType, id: `${layerType}-pt-${i}`, name: `${layerType} ${i + 1}` },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            lng + (Math.random() - 0.5) * 0.06,
            lat + (Math.random() - 0.5) * 0.06,
          ],
        },
      })),
    };
  }
}

export interface UtilityLayerProps {
  /** Which utility layers to show */
  visibleLayers: Set<UtilityLayerType>;
  /** Map centre (used for mock GeoJSON generation) */
  mapCenter?: [number, number];
}

/**
 * UtilityLayer — renders utility & infrastructure overlays on the cadastral map.
 *
 * In production, replace mockGeoJSON() calls with real vector tile sources
 * (OGC API - Features, OSMB, state government WFS endpoints, etc.).
 */
export function UtilityLayer({
  visibleLayers,
  mapCenter = [78.9629, 20.5937],
}: UtilityLayerProps) {
  const map = useMap();
  const addedLayers = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    if (!map) return;

    UTILITY_LAYER_CONFIGS.forEach(({ id, color, type }) => {
      const sourceId = `utility-source-${id}`;
      const layerId = `utility-layer-${id}`;

      const visible = visibleLayers.has(id);

      // Add source & layer once
      if (!map.getSource(sourceId)) {
        const geojson = mockGeoJSON(id, mapCenter, type);
        map.addSource(sourceId, { type: 'geojson', data: geojson });
      }

      if (!map.getLayer(layerId)) {
        if (type === 'line') {
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: { visibility: visible ? 'visible' : 'none' },
            paint: {
              'line-color': color,
              'line-width': 2.5,
              'line-opacity': 0.85,
              'line-dasharray': id === 'water_pipes' ? [3, 2] : id === 'power_lines' ? [1, 0] : [1, 0],
            },
          });
        } else {
          map.addLayer({
            id: layerId,
            type: 'circle',
            source: sourceId,
            layout: { visibility: visible ? 'visible' : 'none' },
            paint: {
              'circle-radius': 7,
              'circle-color': color,
              'circle-opacity': 0.85,
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1.5,
            },
          });
        }
        addedLayers.current.add(layerId);
      } else {
        // Toggle visibility
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    });
  }, [map, visibleLayers, mapCenter]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (!map) return;
      UTILITY_LAYER_CONFIGS.forEach(({ id }) => {
        const sourceId = `utility-source-${id}`;
        const layerId = `utility-layer-${id}`;
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      });
    };
  }, [map]);

  return null;
}

/**
 * UtilityLayerToggle — a floating UI panel to show/hide utility layers.
 * Drop this next to your map component.
 */
export function UtilityLayerToggle({
  visibleLayers,
  onChange,
}: {
  visibleLayers: Set<UtilityLayerType>;
  onChange: (layers: Set<UtilityLayerType>) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const toggle = (id: UtilityLayerType) => {
    const next = new Set(visibleLayers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  return (
    <div className="absolute bottom-24 left-3 z-20">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold transition-all border ${
          open
            ? 'bg-[#1a2e4a] text-white border-[#1a2e4a]'
            : 'bg-white text-[#1a2e4a] border-gray-200 hover:border-[#1a2e4a]'
        }`}
        title="Infrastructure Layers"
      >
        <span>🏗️</span>
        <span>Infrastructure</span>
        {visibleLayers.size > 0 && (
          <span className="bg-blue-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {visibleLayers.size}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-xl w-56 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Utility Layers</span>
            {visibleLayers.size > 0 && (
              <button
                onClick={() => onChange(new Set())}
                className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {UTILITY_LAYER_CONFIGS.map(({ id, label, labelHi, icon, color }) => {
              const on = visibleLayers.has(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                    on ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base w-5 text-center">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-700 leading-tight">{label}</div>
                    <div className="text-[10px] text-gray-400">{labelHi}</div>
                  </div>
                  {/* Toggle indicator */}
                  <div
                    className={`w-8 h-4 rounded-full transition-all flex-shrink-0 ${
                      on ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white shadow transition-transform mt-0.5 ${
                        on ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
