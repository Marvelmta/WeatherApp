import { useQuery } from '@tanstack/react-query';
import { 
  fetchCurrentWeather, 
  fetchForecast, 
  transformWeatherData, 
  transformForecastData 
} from '../lib/weather-api';

export const useCurrentWeather = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => {
      if (lat === null || lon === null) {
        throw new Error('Coordinates are required');
      }
      return fetchCurrentWeather(lat, lon);
    },
    enabled: lat !== null && lon !== null,
    staleTime: 120 * 1000, 
    select: transformWeatherData,
  });
};

export const useForecast = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: () => {
      if (lat === null || lon === null) {
        throw new Error('Coordinates are required');
      }
      return fetchForecast(lat, lon);
    },
    enabled: lat !== null && lon !== null,
    staleTime: 180 * 1000, 
    select: transformForecastData,
  });
};