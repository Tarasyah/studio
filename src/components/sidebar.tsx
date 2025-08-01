
"use client";
import React from 'react';
import { Card } from './ui/card';
import { WeatherIcon } from './weather-icon';
import { OtherCityData, WeatherData } from '@/lib/weather';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import { SearchInput } from './search-input';
import { ScrollArea } from './ui/scroll-area';

interface SidebarProps {
  weatherData: WeatherData;
  otherCities: OtherCityData[];
  onCitySelect: (city: string) => void;
  onSearch: (city: string) => void;
}

export function Sidebar({ weatherData, otherCities, onCitySelect, onSearch }: SidebarProps) {

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-6 text-white flex flex-col gap-6">
      {/* Search on mobile */}
       <div className="md:hidden">
        <SearchInput onSearch={onSearch} />
      </div>

      {/* Current Weather */}
      <Card className="bg-white/10 border-white/20 p-4 flex flex-col items-center text-center rounded-2xl">
          <h1 className="text-xl font-bold">{weatherData.name}</h1>
          <p className="text-sm text-white/80">{format(new Date(), "EEEE, h:mm a")}</p>
          <div className="my-2">
              <WeatherIcon iconCode={weatherData.weather[0].icon} className="w-20 h-20" />
          </div>
          <p className="text-4xl font-bold tracking-tighter">{Math.round(weatherData.main.temp)}°C</p>
          <p className="text-base font-medium capitalize mt-1 text-white/90">{weatherData.weather[0].description}</p>
      </Card>
      
      {/* Search on desktop/tablet */}
      <div className="hidden md:block">
        <SearchInput onSearch={onSearch} />
      </div>

      {/* Other Cities */}
       <Card className="bg-white/10 border-white/20 p-4 rounded-2xl flex-1 flex-col hidden md:flex">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 shrink-0"><MapPin className="w-5 h-5"/> Other Cities</h2>
        <div className="md:hidden lg:block space-y-2 flex-1">
           {otherCities.map((city) => (
            <Card 
                key={city.name} 
                onClick={() => onCitySelect(city.name)}
                className={`p-3 bg-white/10 border-none cursor-pointer hover:bg-white/20 transition-all duration-300 rounded-lg ${city.name === weatherData.name ? 'ring-2 ring-white/80 bg-white/20' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium text-sm">{city.name}</p>
                    <p className="text-xs text-white/70">{city.weather[0].main}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">{Math.round(city.main.temp)}°</span>
                  <WeatherIcon iconCode={city.weather[0].icon} className="w-7 h-7" />
                </div>
              </div>
            </Card>
          ))}
        </div>
         <ScrollArea className="hidden md:block lg:hidden flex-1 [&>div]:h-full">
            <div className="space-y-2 pr-2">
              {otherCities.map((city) => (
                <Card 
                    key={city.name} 
                    onClick={() => onCitySelect(city.name)}
                     className={`p-3 bg-white/10 border-none cursor-pointer hover:bg-white/20 transition-all duration-300 rounded-lg ${city.name === weatherData.name ? 'ring-2 ring-white/80 bg-white/20' : ''} ${city.name.toLowerCase() === 'depok' ? '' : 'md:flex'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-sm">{city.name}</p>
                        <p className="text-xs text-white/70">{city.weather[0].main}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">{Math.round(city.main.temp)}°</span>
                      <WeatherIcon iconCode={city.weather[0].icon} className="w-7 h-7" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
        </ScrollArea>
      </Card>
    </aside>
  );
}
