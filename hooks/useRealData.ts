import useSWR from 'swr';
import { fetchUSGSEarthquakes, fetchNASAEONET, fetchOverpassPowerPlants, fetchANPData } from '../lib/api';
import { resourcesData as mockData, ResourceData } from '../lib/data';

const fetcher = async () => {
  try {
    const [usgs, nasa, overpass, anp] = await Promise.all([
      fetchUSGSEarthquakes(),
      fetchNASAEONET(),
      fetchOverpassPowerPlants(),
      fetchANPData()
    ]);
    
    // Combine real data with mock data
    return [...mockData, ...usgs, ...nasa, ...overpass, ...anp];
  } catch (error) {
    console.error("Error fetching real data, falling back to mock data", error);
    return mockData;
  }
};

export function useRealData() {
  const { data, error, isLoading } = useSWR('real-data', fetcher, {
    refreshInterval: 60000, // Refresh every minute
    fallbackData: mockData,
  });

  return {
    data: data || mockData,
    isLoading,
    isError: error
  };
}
