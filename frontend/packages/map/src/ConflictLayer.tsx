'use client';

import * as React from 'react';
import { useMap } from './Map';
import { colors } from '@bhoomi/ui';

export interface ConflictLayerProps {
  sourceId?: string;
  layerId?: string;
  data: GeoJSON.FeatureCollection;
}

export function ConflictLayer({
  sourceId = 'conflicts',
  layerId = 'conflicts-circle',
  data,
}: ConflictLayerProps) {
  const map = useMap();

  // Stable ref for data — avoids teardown/rebuild when parent passes a new object reference
  const dataRef = React.useRef(data);
  dataRef.current = data;

  React.useEffect(() => {
    if (!map) return;

    // Add source + layer once
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: dataRef.current,
      });
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-color': [
            'match',
            ['get', 'severity'],
            'HIGH', colors.error[500],
            'MEDIUM', colors.warning[500],
            'LOW', colors.success[500],
            colors.warning[500],
          ],
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.on('mousemove', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    }

    return () => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, sourceId, layerId]);

  // Update data without tearing down layers
  React.useEffect(() => {
    if (!map) return;
    const source = map.getSource(sourceId) as any;
    if (source) {
      source.setData(data);
    }
  }, [map, sourceId, data]);

  return null;
}
