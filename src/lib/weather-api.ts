const API_KEY = import.meta.env.VITE_OPEN_WEATHER_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
}

export interface CitySearchResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchForecast = async (lat: number, lon: number): Promise<ForecastResponse> => {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`);
  }
  
  return response.json();
};

export const searchCities = async (query: string): Promise<CitySearchResponse[]> => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }
  
  return response.json();
};

export const transformWeatherData = (data: WeatherResponse) => ({
  city: data.name,
  country: data.sys.country,
  temperature: Math.round(data.main.temp),
  description: data.weather[0].description,
  wind: {
    speed: Math.round(data.wind.speed * 3.6), 
    direction: getWindDirection(data.wind.deg)
  },
  latitude: data.coord.lat,
  longitude: data.coord.lon,
  humidity: data.main.humidity,
  feelsLike: Math.round(data.main.feels_like),
  icon: data.weather[0].icon
});

export const transformForecastData = (data: ForecastResponse) => {
  const dailyData = new Map();
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();
    
    if (!dailyData.has(dateKey)) {
      dailyData.set(dateKey, {
        date: dateKey,
        temps: [],
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed * 3.6),
        description: item.weather[0].description,
        icon: item.weather[0].icon
      });
    }
    
    dailyData.get(dateKey).temps.push(item.main.temp_max, item.main.temp_min);
  });

  const forecast = Array.from(dailyData.values()).slice(0, 5).map((day) => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const temps = day.temps;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName,
      temperature: {
        max: Math.round(Math.max(...temps)),
        min: Math.round(Math.min(...temps))
      },
      description: day.description,
      humidity: day.humidity,
      wind: day.wind,
      icon: day.icon
    };
  });

  return {
    city: data.city.name,
    country: data.city.country,
    forecast
  };
};