'use client';

import * as React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '../lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MapLayerConfig {
  id: string;
  label: string;
  active: boolean;
  color: string;
  description?: string;
}

export interface MapPanelProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  layers?: MapLayerConfig[];
  onLayerToggle?: (layerId: string, active: boolean) => void;
  selectedParcelId?: string;
  geojsonFeature?: any;
  topologyConflicts?: any[];
  satelliteChanges?: any[];
  className?: string;
  children?: React.ReactNode;
}

// Minimal fallback parcel data — callers should pass geojsonFeature for real data
const PANEL_PARCEL_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { parcel_id: 'P001', ulpin: '33230101000001', survey_number: '41/1A', area: 3.1, land_use: 'Agricultural', owner: 'Lakshmi Narayanan', status: 'Verified', risk_level: 'Low' },
      geometry: { type: 'Polygon' as const, coordinates: [[[80.1806,12.7322],[80.1838,12.7331],[80.1851,12.7318],[80.1843,12.7302],[80.1818,12.7294],[80.1798,12.7306],[80.1806,12.7322]]] },
    },
    {
      type: 'Feature' as const,
      properties: { parcel_id: 'P003', ulpin: '33230101000003', survey_number: '42/3B', area: 2.4, land_use: 'Residential', owner: 'Arun Kumar', status: 'Conflict', risk_level: 'High' },
      geometry: { type: 'Polygon' as const, coordinates: [[[80.1876,12.7323],[80.1896,12.7330],[80.1910,12.7317],[80.1904,12.7298],[80.1882,12.7290],[80.1870,12.7300],[80.1876,12.7323]]] },
    },
    {
      type: 'Feature' as const,
      properties: { parcel_id: 'P004', ulpin: '33230101000004', survey_number: '42/4A', area: 4.2, land_use: 'Agricultural', owner: 'Suresh Babu', status: 'Warning', risk_level: 'Medium' },
      geometry: { type: 'Polygon' as const, coordinates: [[[80.1910,12.7317],[80.1928,12.7328],[80.1944,12.7322],[80.1946,12.7304],[80.1928,12.7291],[80.1908,12.7290],[80.1904,12.7298],[80.1910,12.7317]]] },
    },
  ],
};

// Default conflict overlay (overlap zone between P003 and P008)
const DEFAULT_CONFLICT_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { label: 'OVERLAP 42m²' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[80.1876, 12.7302],[80.1886, 12.7300],[80.1884, 12.7292],[80.1874, 12.7294],[80.1876, 12.7302]]],
      },
    },
  ],
};

// ── MapLibre expression helpers ───────────────────────────────────────────────

function statusFillColor(): any {
  return [
    'match', ['get', 'status'],
    'Verified', '#16a34a',
    'Conflict', '#dc2626',
    'Warning',  '#d97706',
    'Pending',  '#2456a6',
    '#9aa4b3',
  ];
}

function statusBorderColor(): any {
  return [
    'match', ['get', 'status'],
    'Verified', '#00ff88',
    'Conflict', '#ff4400',
    'Warning',  '#ffa500',
    'Pending',  '#44aaff',
    '#ffffff',
  ];
}

function selectedFillOpacity(parcelId: string | undefined): any {
  if (!parcelId) return 0.3;
  return ['case', ['any', ['==', ['get', 'parcel_id'], parcelId], ['==', ['get', 'ulpin'], parcelId]], 0.55, 0.3];
}

function selectedLineWidth(parcelId: string | undefined): any {
  if (!parcelId) return 2;
  return ['case', ['any', ['==', ['get', 'parcel_id'], parcelId], ['==', ['get', 'ulpin'], parcelId]], 4, 2];
}

// Compute bounding box from a polygon coordinate ring
function bboxFromCoords(coords: number[][]): [[number, number], [number, number]] {
  return coords.reduce<[[number, number], [number, number]]>(
    (acc, c) => [
      [Math.min(acc[0][0], c[0]), Math.min(acc[0][1], c[1])],
      [Math.max(acc[1][0], c[0]), Math.max(acc[1][1], c[1])],
    ],
    [[Infinity, Infinity], [-Infinity, -Infinity]]
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MapPanel({
  initialCenter = [80.187, 12.729],
  initialZoom = 14,
  layers: _layers,
  onLayerToggle: _onLayerToggle,
  selectedParcelId,
  geojsonFeature,
  topologyConflicts,
  satelliteChanges: _satelliteChanges,
  className,
  children,
}: MapPanelProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const loadedRef = React.useRef(false);

  // Stable refs for values used inside map callbacks
  const selectedRef = React.useRef(selectedParcelId);
  React.useEffect(() => { selectedRef.current = selectedParcelId; }, [selectedParcelId]);

  // ── Mount: create the MapLibre map once ─────────────────────────────────
  React.useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          satellite: {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: '© Esri, Maxar, Earthstar Geographics',
          },
        },
        layers: [{ id: 'satellite-bg', type: 'raster', source: 'satellite' }],
      },
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    mapRef.current = map;

    // Controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120 }), 'bottom-left');

    map.on('load', () => {
      if (destroyed) return;
      loadedRef.current = true;

      // Determine parcel data source: prefer geojsonFeature prop, fall back to built-in parcels
      const parcelData: any = geojsonFeature ?? PANEL_PARCEL_GEOJSON;

      map.addSource('panel-parcels', { type: 'geojson', data: parcelData });

      // Fill layer: status-based coloring
      map.addLayer({
        id: 'panel-parcels-fill',
        type: 'fill',
        source: 'panel-parcels',
        paint: {
          'fill-color': statusFillColor(),
          'fill-opacity': selectedFillOpacity(selectedRef.current),
        },
      });

      // Outline layer: bright borders for satellite contrast
      map.addLayer({
        id: 'panel-parcels-outline',
        type: 'line',
        source: 'panel-parcels',
        paint: {
          'line-color': statusBorderColor(),
          'line-width': selectedLineWidth(selectedRef.current),
        },
      });

      // Labels layer: parcel IDs with halo for readability on satellite
      map.addLayer({
        id: 'panel-parcels-labels',
        type: 'symbol',
        source: 'panel-parcels',
        layout: {
          'text-field': ['get', 'parcel_id'],
          'text-size': 10,
          'text-font': ['Noto Sans Bold'],
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1.2,
        },
      });

      // Conflict overlay source: prefer topologyConflicts prop, fall back to default
      const conflictData: any = (topologyConflicts && topologyConflicts.length > 0)
        ? { type: 'FeatureCollection', features: topologyConflicts }
        : DEFAULT_CONFLICT_GEOJSON;

      map.addSource('panel-conflicts', { type: 'geojson', data: conflictData });

      map.addLayer({
        id: 'panel-conflict-fill',
        type: 'fill',
        source: 'panel-conflicts',
        paint: { 'fill-color': '#dc2626', 'fill-opacity': 0.55 },
      });

      map.addLayer({
        id: 'panel-conflict-outline',
        type: 'line',
        source: 'panel-conflicts',
        paint: {
          'line-color': '#ff4400',
          'line-width': 2,
          'line-dasharray': [4, 2],
        },
      });

      // If a parcel is pre-selected, fly to it
      if (selectedRef.current) {
        fitToParcel(map, selectedRef.current);
      }
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        loadedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── React to selectedParcelId changes ───────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;

    try {
      map.setPaintProperty('panel-parcels-fill', 'fill-opacity', selectedFillOpacity(selectedParcelId));
      map.setPaintProperty('panel-parcels-outline', 'line-width', selectedLineWidth(selectedParcelId));
    } catch (_) {
      // Layers may not be ready yet
    }

    if (selectedParcelId) {
      fitToParcel(map, selectedParcelId);
    }
  }, [selectedParcelId]);

  // ── React to topologyConflicts changes ──────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;

    const src = map.getSource('panel-conflicts') as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    if (topologyConflicts && topologyConflicts.length > 0) {
      src.setData({ type: 'FeatureCollection', features: topologyConflicts } as any);
    } else {
      src.setData(DEFAULT_CONFLICT_GEOJSON as any);
    }
  }, [topologyConflicts]);

  // ── React to geojsonFeature changes ─────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current || !geojsonFeature) return;

    const src = map.getSource('panel-parcels') as maplibregl.GeoJSONSource | undefined;
    if (src) {
      src.setData(geojsonFeature);
    }
  }, [geojsonFeature]);

  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[380px] rounded-md overflow-hidden',
        className
      )}
    >
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {children}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fitToParcel(map: maplibregl.Map, parcelId: string) {
  const feature = PANEL_PARCEL_GEOJSON.features.find(
    (f) => f.properties.parcel_id === parcelId || f.properties.ulpin === parcelId
  );
  if (!feature) return;

  try {
    const coords = feature.geometry.coordinates[0];
    const bounds = bboxFromCoords(coords);
    map.fitBounds(bounds, { padding: 60, maxZoom: 17, animate: true });
  } catch (_) {
    // Geometry may be malformed; silently ignore
  }
}
