
"use client";
import React from 'react';
import { Card } from './ui/card';
import { WeatherIcon } from './weather-icon';
import { OtherCityData, WeatherData } from '@/lib/weather';
import { format } from 'date-fns';
import { MapPin, Droplets, Wind, Search } from 'lucide-react';
import { Button } from './ui/button';
import { SearchInput } from './search-input';

interface SidebarProps {
  weatherData: WeatherData;
  otherCities: OtherCityData[];
  onCitySelect: (city: string) => void;
  onSearch: (city: string) => void;
}

export function Sidebar({ weatherData, otherCities, onCitySelect, onSearch }: SidebarProps) {

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-6 text-white flex flex-col gap-6">
      {/* Current Weather */}
      <Card className="bg-white/10 border-white/20 p-6 flex flex-col items-center text-center rounded-2xl">
          <h1 className="text-2xl font-bold">{weatherData.name}</h1>
          <p className="text-white/80">{format(new Date(), "EEEE, h:mm a")}</p>
          <div className="my-6">
              <WeatherIcon iconCode={weatherData.weather[0].icon} className="w-28 h-28" />
          </div>
          <p className="text-6xl font-bold tracking-tighter">{Math.round(weatherData.main.temp)}°C</p>
          <p className="text-lg font-medium capitalize mt-2 text-white/90">{weatherData.weather[0].description}</p>
      </Card>
      
      {/* Search */}
      <div className="hidden md:block">
        <SearchInput onSearch={onSearch} />
      </div>

      {/* Other Cities */}
      <Card className="bg-white/10 border-white/20 p-4 rounded-2xl flex-1">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5"/> Other Cities</h2>
        <div className="space-y-3 overflow-y-auto max-h-60 pr-2">
          {otherCities.map((city) => (
            <Card 
                key={city.name} 
                onClick={() => onCitySelect(city.name)}
                className={`p-3 bg-white/10 border-none cursor-pointer hover:bg-white/20 transition-all duration-300 rounded-lg ${city.name === weatherData.name ? 'ring-2 ring-white/80 bg-white/20' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-base">{city.name}</p>
                    <p className="text-sm text-white/70">{city.weather[0].main}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{Math.round(city.main.temp)}°</span>
                  <WeatherIcon iconCode={city.weather[0].icon} className="w-8 h-8" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </aside>
  );
}
