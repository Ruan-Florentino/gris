import { ResourceData } from './data';
import * as shpwrite from '@mapbox/shp-write';

export function exportGeoJSON(resources: ResourceData[]) {
  const geojson = {
    type: 'FeatureCollection',
    features: resources.map(res => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [res.lng, res.lat]
      },
      properties: {
        id: res.id,
        name: res.name,
        category: res.category,
        type: res.type,
        region: res.region,
        country: res.country,
        estimated_size: res.estimatedSize,
        depth: res.depth,
        probability: res.probability,
        confidence: res.confidence,
        source: res.source,
        threat_level: res.threatLevel
      }
    }))
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "gris_export.geojson");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export async function exportShapefile(resources: ResourceData[]) {
  // O uso do @mapbox/shp-write gera um ZIP contendo .shp, .dbf, .prj
  const geojson: any = {
    type: 'FeatureCollection',
    features: resources.map(res => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [res.lng, res.lat]
      },
      properties: {
        name: res.name || 'Unnamed',
        type: res.type || 'Unknown'
      }
    }))
  };

  const options = {
    folder: 'gris_shapefile',
    types: {
      point: 'points'
    }
  };

  try {
    const base64Zip = await shpwrite.zip(geojson, options);
    
    // Create an anchor node to prompt download
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", 'data:application/zip;base64,' + base64Zip);
    downloadAnchorNode.setAttribute("download", "gris_export_shp.zip");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  } catch (error) {
    console.error("Shapefile export error:", error);
    alert("Erro ao exportar Shapefile. Verifique os dados.");
  }
}
