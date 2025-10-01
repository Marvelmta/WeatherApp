import { useSearchParams, useNavigate } from 'react-router-dom';
import { ForecastCard } from '../components/ForecastCard';
import { ErrorCard } from '../components/ErrorCard';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, CloudSun, Loader2, RefreshCw } from 'lucide-react';
import { useForecast } from '../hooks/use-weather';

export function ForecastPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const cityName = searchParams.get('city');
  const country = searchParams.get('country');

  const {
    data: forecastData,
    error,
    isLoading,
    refetch,
    isRefetching
  } = useForecast(
    lat ? parseFloat(lat) : null,
    lon ? parseFloat(lon) : null
  );

  const handleRetry = () => {
    refetch();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!lat || !lon || !cityName || !country) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CloudSun className="h-8 w-8 text-primary" />
              <h1 className="text-3xl">Weather Forecast</h1>
            </div>
          </div>

          <ErrorCard
            title="Missing Information"
            message="City information is missing. Please go back to the homepage and select a city."
            onRetry={handleBackToHome}
            isRetrying={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CloudSun className="h-8 w-8 text-primary" />
            <h1 className="text-3xl">5-Day Forecast</h1>
          </div>
          <p className="text-muted-foreground">
            {decodeURIComponent(cityName)}, {country}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          {forecastData && (
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Update
            </Button>
          )}
        </div>

        <Separator />

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading 5-day forecast for {decodeURIComponent(cityName)}...</span>
            </div>
          </div>
        )}

        {error && (
          <ErrorCard
            title="Forecast Data Fel"
            message={`Could not load forecast data for ${decodeURIComponent(cityName)}. Please check your connection and try again.`}
            onRetry={handleRetry}
            isRetrying={isRefetching}
          />
        )}

        {forecastData && !error && (
          <ForecastCard forecastData={forecastData} />
        )}

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <Separator />
          <p>
            Forecast data provided by OpenWeatherMap API
          </p>
        </div>
      </div>
    </div>
  );
}