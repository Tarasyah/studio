
"use client";
import React from 'react';
import { Card } from './ui/card';
import { WeatherIcon } from './weather-icon';
import { OtherCityData } from '@/lib/weather';
import { format } from 'date-fns';
import { MapPin, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { SearchInput } from './search-input';

interface SidebarProps {
  currentCity: string;
  otherCities: OtherCityData[];
  onCitySelect: (city: string) => void;
  onSearch: (city: string) => void;
}

export function Sidebar({ currentCity, otherCities, onCitySelect, onSearch }: SidebarProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full text-white p-4 md:p-6 bg-white/5 border-r border-white/10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-sun"><path d="M12 16.5A4.5 4.5 0 1 1 16.5 12A4.5 4.5 0 0 1 12 16.5Z"/><path d="M12 7.29A6.45 6.45 0 0 1 18.2 12 6.5 6.5 0 0 1 12 18.2a6.5 6.5 0 0 1-6.2-6.2A6.45 6.45 0 0 1 12 7.3z"/><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m17.66 17.66 1.41 1.41"/><path d="M12 22v-2"/><path d="m6.34 17.66-1.41 1.41"/><path d="M2 12H0"/><path d="m6.34 6.34-1.41-1.41"/></svg>
            WeatherWise
        </h1>
        <p className="text-sm text-white/70">{format(currentTime, "eeee, d MMMM")}</p>
        <p className="text-2xl font-bold">{format(currentTime, "HH:mm")}</p>
      </div>

      <div className="mb-6 md:hidden">
        <SearchInput onSearch={onSearch}/>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5"/> Other Cities</h2>
        <div className="space-y-3">
          {otherCities.map((city) => (
            <Card 
                key={city.name} 
                onClick={() => onCitySelect(city.name)}
                className={`p-3 bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-colors ${city.name === currentCity ? 'ring-2 ring-white' : ''}`}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{city.name}</p>
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
      {/* Mobile Sidebar */}
      <div className="md:hidden p-4 absolute top-0 left-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-none w-3/4 bg-gray-900/80 backdrop-blur-md">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 xl:w-1/6 h-full">
        {sidebarContent}
      </aside>
    </>
  );
}
