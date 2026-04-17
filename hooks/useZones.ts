import { useState, useEffect } from 'react';

export interface Zone {
  id: string;
  name: string;
  coordinates: any[]; // Cesium coordinates
}

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedZones = localStorage.getItem('gris-zones');
    if (savedZones) {
      setZones(JSON.parse(savedZones));
    }
  }, []);

  const saveZone = (name: string, coordinates: any[]) => {
    const newZone: Zone = {
      id: Date.now().toString(),
      name,
      coordinates,
    };
    const updatedZones = [...zones, newZone];
    setZones(updatedZones);
    localStorage.setItem('gris-zones', JSON.stringify(updatedZones));
  };

  const deleteZone = (id: string) => {
    const updatedZones = zones.filter(z => z.id !== id);
    setZones(updatedZones);
    localStorage.setItem('gris-zones', JSON.stringify(updatedZones));
  };

  return { zones, saveZone, deleteZone, isHydrated };
}
