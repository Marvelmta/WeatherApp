import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RefreshCw, MapPin, Wind, Thermometer } from 'lucide-react';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  wind: {
    speed: number;
    direction: string;
  };
  latitude: number;
  longitude: number;
  humidity: number;
  feelsLike: number;
  icon: string;
}

interface WeatherCardProps {
  weatherData: WeatherData;
  onUpdate: () => void;
  isLoading?: boolean;
}

export function WeatherCard({ weatherData, onUpdate, isLoading = false }: WeatherCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {weatherData.city}, {weatherData.country}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onUpdate}
          disabled={isLoading}
          className="cursor-pointer flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          Update
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-6xl">{weatherData.temperature}°</span>
            <div className="text-left">
              <div className="text-xl text-muted-foreground">C</div>
              <div className="text-sm text-muted-foreground">
                Feels like {weatherData.feelsLike}°
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-base">
            {weatherData.description}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Wind className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Wind</div>
              <div>{weatherData.wind.speed} km/h {weatherData.wind.direction}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Thermometer className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div>{weatherData.humidity}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
          <div className="text-sm text-muted-foreground">Coordinates</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Latitude:</span> {weatherData.latitude.toFixed(4)}
            </div>
            <div>
              <span className="text-muted-foreground">Longitude:</span> {weatherData.longitude.toFixed(4)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}