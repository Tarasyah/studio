
"use client";
import React from 'react';
import { Card } from './ui/card';
import { WeatherIcon } from './weather-icon';
import { OtherCityData, WeatherData, ForecastData } from '@/lib/weather';
import { format } from 'date-fns';
import { MapPin, Menu, Droplets, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { SearchInput } from './search-input';

interface SidebarProps {
  weatherData: WeatherData;
  forecastData: ForecastData;
  otherCities: OtherCityData[];
  onCitySelect: (city: string) => void;
  onSearch: (city: string) => void;
}

export function Sidebar({ weatherData, forecastData, otherCities, onCitySelect, onSearch }: SidebarProps) {

  const sidebarContent = (
    <div className="flex flex-col h-full text-white p-6 bg-white/10 md:bg-transparent">
        <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Weather</h1>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 border-none w-3/4 bg-gray-900/80 backdrop-blur-md">
                   <div className="flex flex-col h-full text-white p-6 bg-white/10">
                        <div className="mb-6">
                            <SearchInput onSearch={onSearch}/>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5"/> Other Cities</h2>
                            <div className="space-y-3">
                            {otherCities.map((city) => (
                                <Card 
                                    key={city.name} 
                                    onClick={() => onCitySelect(city.name)}
                                    className="p-3 bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                                >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{city.name}</p>
                                        <p className="text-sm text-white/70">{city.weather[0].main}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">{Math.round(city.main.temp)}°</span>
                                    <WeatherIcon iconCode={city.weather[0].icon} className="w-7 h-7" />
                                    </div>
                                </div>
                                </Card>
                            ))}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

      <div className="text-center md:text-left mb-6">
        <h2 className="text-lg font-medium text-white/80">{format(new Date(), "EEEE, dd/MM")}</h2>
        <p className="text-sm text-white/60">Now in {weatherData.name}</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-8xl font-bold tracking-tighter">{Math.round(weatherData.main.temp)}<span className="align-top text-4xl">°C</span></p>
        <WeatherIcon iconCode={weatherData.weather[0].icon} className="w-24 h-24 mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-3">
              <Droplets className="w-6 h-6 mx-auto mb-1 text-white/80"/>
              <p className="font-semibold">{Math.round(forecastData.list[0].pop * 100)}%</p>
              <p className="text-xs text-white/70">Chance of rain</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
              <Wind className="w-6 h-6 mx-auto mb-1 text-white/80"/>
              <p className="font-semibold">{weatherData.wind.speed.toFixed(1)} km/h</p>
              <p className="text-xs text-white/70">Wind</p>
          </div>
      </div>
      
      {/* Desktop only */}
      <div className="hidden md:block mt-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5"/> Other Cities</h2>
        <div className="space-y-3">
          {otherCities.map((city) => (
            <Card 
                key={city.name} 
                onClick={() => onCitySelect(city.name)}
                className={`p-3 bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-colors ${city.name === weatherData.name ? 'ring-2 ring-white' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium">{city.name}</p>
                    <p className="text-sm text-white/70">{city.weather[0].main}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{Math.round(city.main.temp)}°</span>
                  <WeatherIcon iconCode={city.weather[0].icon} className="w-7 h-7" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile view uses sidebarContent directly and Sheet for other cities */}
       <aside className="md:w-1/3 lg:w-2/5 xl:w-1/3 h-full">
         {sidebarContent}
       </aside>

      {/* Desktop view uses sidebarContent within the aside */}
      {/* The desktop sidebar logic is now inside sidebarContent */}
    </>
  );
}
