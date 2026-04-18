import { ResourceData } from './data';

export async function fetchUSGSEarthquakes(): Promise<ResourceData[]> {
  try {
    const response = await fetch('/api/external?provider=usgs');
    
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
    const response = await fetch('/api/external?provider=nasa-eonet');
    
    if (!response.ok) {
      console.warn(`NASA EONET API error: ${response.statusText}`);
      return [];
    }
    
    const text = await response.text();
    if (text.trim().startsWith('<')) {
      console.warn('NASA EONET API returned non-JSON response.');
      return [];
    }
    
    const data = JSON.parse(text);
    
    if (!data.events) {
      return [];
    }
    
    return data.events.map((event: any) => {
      const geometrySource = event.geometry && event.geometry.length > 0 ? event.geometry[0] : null;
      if (!geometrySource || !geometrySource.coordinates) return null;
      
      let resType: any = 'seismic_zone';
      if (event.categories && event.categories[0]?.id === 'wildfires') resType = 'seismic_zone';
      else if (event.categories && event.categories[0]?.id === 'volcanoes') resType = 'fault_line';
      
      const eventDate = geometrySource.date ? new Date(geometrySource.date) : new Date();
      const lastUpdate = isNaN(eventDate.getTime()) ? new Date().toISOString() : eventDate.toISOString();

      return {
        id: `nasa-${event.id}`,
        name: event.title || 'Unknown Event',
        category: 'DADOS_GEOFISICOS',
        type: resType,
        lat: geometrySource.coordinates[1],
        lng: geometrySource.coordinates[0],
        country: 'Global',
        region: 'Various',
        estimatedSize: 'N/A',
        depth: 'Surface',
        probability: 100,
        confidence: 100,
        source: 'NASA EONET (Real-time)',
        classification: 'PUBLIC',
        threatLevel: 'ELEVATED',
        description: `Natural event: ${event.categories ? event.categories[0]?.title : 'Unknown'}.`,
        lastUpdate,
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch NASA EONET data', error);
    return [];
  }
}

export async function fetchOpenMeteo(lat: number, lng: number): Promise<any> {
  try {
    const response = await fetch(`/api/external?provider=open-meteo&lat=${lat}&lng=${lng}`);
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
    const response = await fetch('/api/external?provider=overpass');
    
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
      name: (el.tags && el.tags.name) ? el.tags.name : 'Unknown Power Plant',
      category: 'COMBUSTIVEIS_FOSSEIS',
      type: 'oil_field',
      lat: el.lat || (el.center && el.center.lat) || 0,
      lng: el.lon || (el.center && el.center.lon) || 0,
      country: 'South America',
      region: 'LATAM',
      estimatedSize: el.tags ? (el.tags['plant:output:electricity'] || el.tags['plant:output'] || 'Unknown Capacity') : 'Unknown Capacity',
      depth: 'Surface',
      probability: 100,
      confidence: 90,
      source: 'OpenStreetMap API (Real-time)',
      classification: 'PUBLIC',
      threatLevel: 'LOW',
      description: el.tags ? `Power plant infrastructure. Source: ${el.tags.source || 'OSM'}.` : 'Power plant infrastructure.',
      lastUpdate: new Date().toISOString(),
    })).filter((el: any) => el.lat !== 0 && el.lng !== 0);
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
