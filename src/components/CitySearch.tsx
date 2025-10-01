import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Search, Loader2 } from 'lucide-react';
import type { CitySearchResponse } from '../lib/weather-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { searchCities } from '../lib/weather-api';
interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

const popularCities: City[] = [
  { id: '1', name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { id: '2', name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { id: '3', name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { id: '4', name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { id: '5', name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
  { id: '6', name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 },
  { id: '7', name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832 },
  { id: '8', name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
  { id: '9', name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
  { id: '10', name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777 },
];

export function CitySearch({ onCitySelect }: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResponse[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(searchTerm);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCitySelectFromSearch = (city: CitySearchResponse) => {
    const selectedCity: City = {
      id: `${city.lat}-${city.lon}`,
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    };
    onCitySelect(selectedCity);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleCitySelectFromDropdown = (cityId: string) => {
    const selectedCity = popularCities.find(city => city.id === cityId);
    if (selectedCity) {
      onCitySelect(selectedCity);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          )}
          <Input
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
          />
        </div>
        
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((city, index) => (
              <button
                key={`${city.lat}-${city.lon}-${index}`}
                onClick={() => handleCitySelectFromSearch(city)}
                className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              >
                <div>
                  <span className="block">{city.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {city.state ? `${city.state}, ` : ''}{city.country}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm mb-2 block">Or select from popular cities:</label>
        <Select onValueChange={handleCitySelectFromDropdown}>
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {popularCities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}, {city.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}