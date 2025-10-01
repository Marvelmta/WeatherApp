import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CitySearch } from '../components/CitySearch';
import { WeatherCard } from '../components/WeatherCard';
import { ErrorCard } from '../components/ErrorCard';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { CloudSun, Calendar, Loader2 } from 'lucide-react';
import { useCurrentWeather } from '../hooks/use-weather';

interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export function HomePage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const navigate = useNavigate();

  const {
    data: weatherData,
    error,
    isLoading,
    refetch,
    isRefetching
  } = useCurrentWeather(
    selectedCity?.lat ?? null, 
    selectedCity?.lon ?? null
  );

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  const handleForecastNavigate = () => {
    if (selectedCity) {
      navigate(`/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&city=${encodeURIComponent(selectedCity.name)}&country=${selectedCity.country}`);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CloudSun className="h-8 w-8 text-primary" />
            <h1 className="text-3xl">Weather App</h1>
          </div>
          <p className="text-muted-foreground">
            Search for a city to get current weather conditions and forecasts
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-center">Select a City</h2>
          <CitySearch onCitySelect={handleCitySelect} />
        </div>

        {isLoading && selectedCity && (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading weather data for {selectedCity.name}...</span>
            </div>
          </div>
        )}

        {error && selectedCity && (
          <ErrorCard
            title="Weather Data Error"
            message={`Could not load weather data for ${selectedCity.name}. Please check your connection and try again.`}
            onRetry={handleRetry}
            isRetrying={isRefetching}
          />
        )}

        {weatherData && selectedCity && !error && (
          <div className="space-y-4">
            <WeatherCard
              weatherData={weatherData}
              onUpdate={() => refetch()}
              isLoading={isRefetching}
            />
            
            <div className="flex justify-center">
              <Button
                onClick={handleForecastNavigate}
                className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br text-white"
              >
                <Calendar className="h-4 w-4" />
                Get 5-Day Forecast
              </Button>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <Separator />
          <p>
            Weather data provided by OpenWeatherMap API
          </p>
        </div>
      </div>
    </div>
  );
}