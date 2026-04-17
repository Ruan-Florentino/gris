import { useState, useEffect } from 'react';
import { fetchOpenMeteo } from '@/lib/api';
import { Cloud, Wind, Thermometer } from 'lucide-react';

export default function WeatherWidget({ lat, lng }: { lat: number; lng: number }) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchOpenMeteo(lat, lng).then(data => {
      if (isMounted) {
        setWeather(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-[var(--gris-elevated)] rounded-2xl border border-[var(--gris-border-subtle)]">
        <div className="animate-pulse text-[10px] font-mono text-[var(--gris-emerald)] uppercase tracking-widest">
          Obtendo dados meteorológicos...
        </div>
      </div>
    );
  }

  if (!weather || !weather.current) {
    return null;
  }

  return (
    <div className="space-y-3 mt-1">
      <div className="section-header">
        <Cloud className="w-3 h-3" />
        Condições Meteorológicas (Tempo Real)
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm font-inter text-[var(--gris-text-secondary)] bg-[var(--gris-elevated)] p-4 rounded-2xl border border-[var(--gris-border-subtle)]">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[var(--gris-pink)]" />
          <div>
            <span className="block text-[10px] font-semibold text-[var(--gris-text-muted)] uppercase mb-0.5">Temperatura</span>
            <span className="text-[var(--gris-text-primary)] font-mono">{weather.current.temperature_2m}°C</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-[var(--gris-sky)]" />
          <div>
            <span className="block text-[10px] font-semibold text-[var(--gris-text-muted)] uppercase mb-0.5">Vento</span>
            <span className="text-[var(--gris-text-primary)] font-mono">{weather.current.wind_speed_10m} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
