import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get('provider');

  try {
    if (provider === 'usgs') {
      const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (provider === 'nasa-eonet') {
      const res = await fetch('https://eonet.gsfc.nasa.gov/api/v2.1/events');
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (provider === 'overpass') {
      // Overpass API for power plants in South America
      const query = `
        [out:json][timeout:25];
        (
          node["power"="plant"](-60,-90,15,-30);
          way["power"="plant"](-60,-90,15,-30);
          relation["power"="plant"](-60,-90,15,-30);
        );
        out body;
        >;
        out skel qt;
      `;
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (provider === 'open-meteo') {
      const lat = searchParams.get('lat');
      const lng = searchParams.get('lng');
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });
  } catch (error) {
    console.error(`External API Proxy Error (${provider}):`, error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
