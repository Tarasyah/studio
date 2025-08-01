
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getWeatherAndForecast,
  WeatherData,
  ForecastItem,
} from "@/lib/weather";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, AlertCircle } from "lucide-react";
import { WeatherIcon } from "./weather-icon";
import { format } from "date-fns";


export function WeatherDashboard({ initialCity, onCityChange }: { initialCity: string, onCityChange: (city: string) => void }) {
  const [city, setCity] = useState(initialCity);
  const [searchTerm, setSearchTerm] = useState(initialCity);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastList, setForecastList] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchWeatherData = useCallback(async (targetCity: string) => {
    setLoading(true);
    setError(null);
    try {
      const { weather, forecast } = await getWeatherAndForecast(targetCity);
      setWeatherData(weather);

      const dailyForecasts = forecast.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecastList(dailyForecasts.slice(0, 5));

      setCity(weather.name);
      setSearchTerm(weather.name);
      onCityChange(weather.name);
    } catch (err: any) {
      setError(
        err.message || "Failed to fetch weather data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [onCityChange]);

  useEffect(() => {
    if (initialCity) {
      setCity(initialCity);
      setSearchTerm(initialCity);
      fetchWeatherData(initialCity);
    }
  }, [initialCity, fetchWeatherData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm && searchTerm.toLowerCase() !== city.toLowerCase()) {
      fetchWeatherData(searchTerm);
    }
  };

  return (
    <div className="w-full max-w-sm font-sans text-white">
       <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 border-white/30 rounded-full shadow-sm placeholder-gray-200 focus:ring-2 focus:ring-white"
            />
        </form>

      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-500/80 border-red-700 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <WeatherCardSkeleton />
      ) : weatherData ? (
        <div className="relative bg-transparent p-6">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <WeatherIcon iconCode={weatherData.weather[0].icon} className="w-8 h-8" />
                  <span className="text-xl font-semibold capitalize">{weatherData.weather[0].description}</span>
                </div>
                <p className="text-7xl font-bold mt-2">{Math.round(weatherData.main.temp)}°</p>
                <p className="text-lg font-medium">{Math.round(weatherData.main.temp_max)}° / {Math.round(weatherData.main.temp_min)}°</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{format(currentTime, "HH:mm")}</p>
                <p className="text-md">{format(currentTime, "EEE, MMM dd")}</p>
                <p className="text-lg font-medium mt-4">{weatherData.name}</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/20">
              <div className="grid grid-cols-5 gap-2 text-center">
                {forecastList.map((item) => (
                  <div key={item.dt} className="flex flex-col items-center">
                    <p className="text-sm font-medium">{format(new Date(item.dt_txt), "EEE")}</p>
                    <WeatherIcon iconCode={item.weather[0].icon} className="w-8 h-8 my-1" />
                    <p className="text-sm font-semibold">{Math.round(item.main.temp_max)}°</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
         !error && <p>No weather data available.</p>
      )}
    </div>
  );
}


function WeatherCardSkeleton() {
    return (
        <div className="bg-white/10 animate-pulse rounded-3xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full bg-white/20" />
                        <Skeleton className="h-6 w-24 rounded-md bg-white/20" />
                    </div>
                    <Skeleton className="h-20 w-32 mt-2 rounded-md bg-white/20" />
                    <Skeleton className="h-6 w-20 mt-2 rounded-md bg-white/20" />
                </div>
                <div className="text-right">
                    <Skeleton className="h-10 w-24 rounded-md bg-white/20" />
                    <Skeleton className="h-5 w-28 mt-1 rounded-md bg-white/20" />
                    <Skeleton className="h-6 w-20 mt-4 rounded-md bg-white/20" />
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/20">
                <div className="grid grid-cols-5 gap-2 text-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <Skeleton className="h-5 w-10 rounded-md bg-white/20" />
                            <Skeleton className="w-8 h-8 my-1 rounded-full bg-white/20" />
                            <Skeleton className="h-5 w-8 rounded-md bg-white/20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
