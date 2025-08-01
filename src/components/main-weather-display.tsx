
"use client";
import React from 'react';
import { Card } from './ui/card';
import { WeatherIcon } from './weather-icon';
import { Thermometer, Wind, Droplets, Sunrise, Sunset, Eye } from 'lucide-react';
import { WeatherData, ForecastData } from '@/lib/weather';
import { format } from 'date-fns';
import { SearchInput } from './search-input';
import { ForecastChart } from './forecast-chart';

interface MainWeatherDisplayProps {
  weatherData: WeatherData;
  forecastData: ForecastData;
  onSearch: (city: string) => void;
}

export function MainWeatherDisplay({ weatherData, forecastData, onSearch }: MainWeatherDisplayProps) {
  const dailyForecasts = forecastData.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  ).slice(0, 3);
  
  return (
    <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto text-white">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">Weather Forecast</h1>
        </div>
        <div className="w-full md:w-auto">
            <SearchInput onSearch={onSearch} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
            <div className="mb-6 md:mb-8">
                <h2 className="text-5xl md:text-6xl font-bold capitalize">
                {weatherData.weather[0].description}
                </h2>
                <p className="text-lg md:text-xl mt-2 text-white/80">
                Today's forecast for {weatherData.name}, {weatherData.sys.country}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
            {dailyForecasts.map((item, index) => (
                <Card key={index} className="flex-1 bg-white/10 border-white/20 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                        <p className="text-3xl font-bold">{Math.round(item.main.temp)}°</p>
                        <p className="text-md text-white/80">{format(new Date(item.dt_txt), "eeee")}</p>
                        </div>
                        <WeatherIcon iconCode={item.weather[0].icon} className="w-12 h-12" />
                    </div>
                </Card>
            ))}
            </div>

             <Card className="bg-white/10 border-white/20 p-4 md:p-6">
                <h3 className="font-semibold mb-4 text-lg">Hourly Forecast</h3>
                <ForecastChart forecastData={forecastData} />
             </Card>

        </div>

        <div className="lg:col-span-1 space-y-6 md:space-y-8">
            <Card className="bg-white/10 border-white/20 p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Current Weather</h3>
                    <WeatherIcon iconCode={weatherData.weather[0].icon} className="w-10 h-10" />
                </div>
                <p className="text-6xl md:text-7xl font-bold mb-4">{Math.round(weatherData.main.temp)}°C</p>
                <div className="space-y-3 text-white/90">
                    <div className="flex items-center gap-3">
                        <Thermometer className="w-5 h-5"/>
                        <span>Feels like: {Math.round(weatherData.main.feels_like)}°C</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Wind className="w-5 h-5"/>
                        <span>Wind: {weatherData.wind.speed} m/s</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Droplets className="w-5 h-5"/>
                        <span>Humidity: {weatherData.main.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5"/>
                        <span>Visibility: {weatherData.visibility / 1000} km</span>
                    </div>
                </div>
            </Card>

            <Card className="bg-white/10 border-white/20 p-4 md:p-6">
                <h3 className="font-semibold text-lg mb-4">Sunrise & Sunset</h3>
                <div className="flex justify-between items-center text-center">
                    <div>
                        <Sunrise className="w-10 h-10 mx-auto mb-2"/>
                        <p className="font-bold text-xl">{format(new Date(weatherData.sys.sunrise * 1000), "HH:mm")}</p>
                        <p className="text-sm text-white/80">Sunrise</p>
                    </div>
                     <div>
                        <Sunset className="w-10 h-10 mx-auto mb-2"/>
                        <p className="font-bold text-xl">{format(new Date(weatherData.sys.sunset * 1000), "HH:mm")}</p>
                        <p className="text-sm text-white/80">Sunset</p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </main>
  );
}
