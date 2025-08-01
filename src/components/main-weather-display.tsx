
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { WeatherIcon } from './weather-icon';
import { WeatherData, ForecastData } from '@/lib/weather';
import { format } from 'date-fns';
import { Droplets, Gauge, Sunrise, Sunset, Wind } from 'lucide-react';
import { ForecastChart } from './forecast-chart';


interface MainWeatherDisplayProps {
  weatherData: WeatherData;
  forecastData: ForecastData;
}

export function MainWeatherDisplay({ weatherData, forecastData }: MainWeatherDisplayProps) {
  const dailyForecasts = forecastData.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  ).slice(0, 7); // 7 day forecast
  
  return (
    <main className="flex-1 p-4 md:p-6 grid grid-cols-1 gap-6 text-white">
        <div className="md:hidden">
            {/* Search Input for mobile would go here if needed */}
        </div>

        <div>
            <h2 className="text-xl font-bold mb-4 px-2">Today's Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/10 border-white/20 p-4 rounded-2xl">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-sm font-medium text-white/80 flex justify-between items-center">
                            Wind Status <Wind className="w-5 h-5" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-3xl font-bold">{weatherData.wind.speed.toFixed(1)}<span className="text-lg">km/h</span></p>
                    </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 p-4 rounded-2xl">
                     <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-sm font-medium text-white/80 flex justify-between items-center">
                            Humidity <Droplets className="w-5 h-5" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-3xl font-bold">{weatherData.main.humidity}<span className="text-lg">%</span></p>
                    </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 p-4 rounded-2xl">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-sm font-medium text-white/80 flex justify-between items-center">
                            Air Pressure <Gauge className="w-5 h-5" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-3xl font-bold">{weatherData.main.pressure}<span className="text-lg">hPa</span></p>
                    </CardContent>
                </Card>
                 <Card className="bg-white/10 border-white/20 p-4 rounded-2xl">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-sm font-medium text-white/80">Sunrise & Sunset</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col items-start justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <Sunrise className="w-6 h-6 text-yellow-300" />
                            <div>
                                <p className="font-semibold">{format(new Date(weatherData.sys.sunrise * 1000), 'h:mm a')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sunset className="w-6 h-6 text-orange-400" />
                             <div>
                                <p className="font-semibold">{format(new Date(weatherData.sys.sunset * 1000), 'h:mm a')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white/10 border-white/20 p-4 rounded-2xl">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold">Hourly Forecast</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ForecastChart forecastData={forecastData} />
            </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20 p-4 rounded-2xl">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold">7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-2">
                {dailyForecasts.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <p className="w-1/3 text-white/90 font-medium">{format(new Date(item.dt_txt), "iii, MMM d")}</p>
                    <WeatherIcon iconCode={item.weather[0].icon} className="w-8 h-8 text-white" />
                    <div className="w-1/3 text-right">
                        <span className="font-semibold text-white">{Math.round(item.main.temp_max)}°</span>
                        <span className="text-white/70"> / {Math.round(item.main.temp_min)}°</span>
                    </div>
                </div>
                ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
