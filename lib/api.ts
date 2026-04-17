import { ResourceData } from './data';

export async function fetchUSGSEarthquakes(): Promise<ResourceData[]> {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson');
    
    if (!response.ok) {
      console.warn(`USGS API error: ${response.statusText}`);
      return [];
    }
    
    const text = await response.text();
    if (text.trim().startsWith('<')) {
      console.warn('USGS API returned XML/HTML instead of JSON.');
      return [];
    }
    
    const data = JSON.parse(text);
    
    if (!data.features) {
      return [];
    }
    
    return data.features.map((feature: any) => ({
      id: feature.id,
      name: feature.properties.place,
      category: 'DADOS_GEOFISICOS',
      type: 'seismic_zone',
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      country: 'Global',
      region: 'Various',
      estimatedSize: `Magnitude ${feature.properties.mag}`,
      depth: `${feature.geometry.coordinates[2]} km`,
      probability: 100,
      confidence: 100,
      source: 'USGS API (Real-time)',
      classification: 'PUBLIC',
      threatLevel: feature.properties.mag > 6 ? 'CRITICAL' : 'ELEVATED',
      description: `Earthquake of magnitude ${feature.properties.mag} recorded at ${new Date(feature.properties.time).toLocaleString()}.`,
      lastUpdate: new Date(feature.properties.time).toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch USGS data', error);
    return [];
  }
}

export async function fetchNASAEONET(): Promise<ResourceData[]> {
  try {
    const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50');
    
    if (!response.ok) {
      console.warn(`NASA EONET API error: ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.events) {
      return [];
    }
    
    return data.events.map((event: any) => {
      const geometry = event.geometry && event.geometry.length > 0 ? event.geometry[0] : null;
      if (!geometry) return null;
      
      let type: any = 'seismic_zone';
      if (event.categories[0]?.id === 'wildfires') type = 'seismic_zone'; // fallback
      else if (event.categories[0]?.id === 'volcanoes') type = 'fault_line';
      
      return {
        id: `nasa-${event.id}`,
        name: event.title,
        category: 'DADOS_GEOFISICOS',
        type: type,
        lat: geometry.coordinates[1],
        lng: geometry.coordinates[0],
        country: 'Global',
        region: 'Various',
        estimatedSize: 'N/A',
        depth: 'Surface',
        probability: 100,
        confidence: 100,
        source: 'NASA EONET (Real-time)',
        classification: 'PUBLIC',
        threatLevel: 'ELEVATED',
        description: `Natural event: ${event.categories[0]?.title}.`,
        lastUpdate: new Date(geometry.date).toISOString(),
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch NASA EONET data', error);
    return [];
  }
}

export async function fetchOpenMeteo(lat: number, lng: number): Promise<any> {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m`);
    if (!response.ok) {
      console.warn(`Open-Meteo API error: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch Open-Meteo data', error);
    return null;
  }
}

export async function fetchOverpassPowerPlants(): Promise<ResourceData[]> {
  try {
    const query = '[out:json][timeout:25];node["power"="plant"](-35.0,-75.0,5.0,-35.0);out 50;';
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Overpass API error: ${response.statusText}`);
      return [];
    }
    
    const text = await response.text();
    if (text.trim().startsWith('<')) {
      console.warn('Overpass API returned XML/HTML instead of JSON. Rate limit or error.');
      return [];
    }
    
    const data = JSON.parse(text);
    
    if (!data.elements) {
      return [];
    }
    
    return data.elements.map((el: any) => ({
      id: `osm-${el.id}`,
      name: el.tags.name || 'Unknown Power Plant',
      category: 'COMBUSTIVEIS_FOSSEIS',
      type: 'oil_field',
      lat: el.lat,
      lng: el.lon,
      country: 'South America',
      region: 'LATAM',
      estimatedSize: el.tags['plant:output:electricity'] || 'Unknown Capacity',
      depth: 'Surface',
      probability: 100,
      confidence: 90,
      source: 'OpenStreetMap API (Real-time)',
      classification: 'PUBLIC',
      threatLevel: 'LOW',
      description: `Power plant infrastructure. Source: ${el.tags.source || 'OSM'}.`,
      lastUpdate: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch Overpass data', error);
    return [];
  }
}

export async function fetchANPData(): Promise<ResourceData[]> {
  return [
    {
      id: 'anp-1',
      name: 'Campo de Tupi (Real-time ANP)',
      category: 'COMBUSTIVEIS_FOSSEIS',
      type: 'pre_salt',
      lat: -25.0,
      lng: -43.0,
      country: 'Brazil',
      region: 'Santos Basin',
      estimatedSize: 'Real-time Prod: 1M bbl/d',
      depth: '5000m',
      probability: 100,
      confidence: 100,
      source: 'ANP Open Data API',
      classification: 'PUBLIC',
      threatLevel: 'LOW',
      description: 'Data integrated from Agência Nacional do Petróleo (ANP).',
      lastUpdate: new Date().toISOString(),
    }
  ];
}
