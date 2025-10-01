import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';

interface ForecastDay {
  date: string;
  dayName: string;
  temperature: {
    max: number;
    min: number;
  };
  description: string;
  humidity: number;
  wind: number;
  icon: string;
}

interface ForecastData {
  city: string;
  country: string;
  forecast: ForecastDay[];
}

interface ForecastCardProps {
  forecastData: ForecastData;
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('rain')) return <CloudRain className="h-5 w-5" />;
  if (desc.includes('snow')) return <CloudSnow className="h-5 w-5" />;
  if (desc.includes('cloud')) return <Cloud className="h-5 w-5" />;
  return <Sun className="h-5 w-5" />;
};

export function ForecastCard({ forecastData }: ForecastCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          5-Day Forecast for {forecastData.city}, {forecastData.country}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {forecastData.forecast.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary">
                {getWeatherIcon(day.description)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="min-w-20">{day.dayName}</span>
                  <Badge variant="outline" className="text-xs">
                    {day.description}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{day.date}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-lg">{day.temperature.max}°</span>
                  <span className="text-sm text-muted-foreground">/ {day.temperature.min}°</span>
                </div>
              </div>
              
              <div className="text-right text-sm text-muted-foreground min-w-16">
                <div>💨 {day.wind} km/h</div>
                <div>💧 {day.humidity}%</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}