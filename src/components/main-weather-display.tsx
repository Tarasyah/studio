
"use client";
import React from 'react';
import { Card, CardContent } from './ui/card';
import { WeatherIcon } from './weather-icon';
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
  ).slice(0, 5);
  
  return (
    <main className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-t-none md:rounded-r-3xl overflow-y-auto">
      <div className="hidden md:flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Weather Forecast</h1>
        <div className="w-full md:w-auto">
            <SearchInput onSearch={onSearch} />
        </div>
      </div>

      <div className='md:hidden mb-4'>
        <SearchInput onSearch={onSearch} />
      </div>
      
      <div>
        <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Hourly Forecast</h2>
        <ForecastChart forecastData={forecastData} />
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Next 5 Days</h2>
        <div className="space-y-3">
        {dailyForecasts.map((item, index) => (
          <Card key={index} className="bg-gray-100 dark:bg-gray-700/50 border-none p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="w-1/3 text-gray-600 dark:text-gray-300">{format(new Date(item.dt_txt), "EEEE")}</p>
              <WeatherIcon iconCode={item.weather[0].icon} className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <div className="w-1/3 text-right">
                <span className="font-semibold text-gray-800 dark:text-white">{Math.round(item.main.temp_max)}°</span>
                <span className="text-gray-500 dark:text-gray-400"> / {Math.round(item.main.temp_min)}°</span>
              </div>
            </div>
          </Card>
        ))}
        </div>
      </div>
    </main>
  );
}
