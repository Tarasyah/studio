
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getWeatherAndForecast,
  WeatherData,
  ForecastData,
  OtherCityData,
  getCurrentWeatherForCities,
} from "@/lib/weather";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Sidebar } from "./sidebar";
import { MainWeatherDisplay } from "./main-weather-display";

export function WeatherDashboard() {
  const [currentCity, setCurrentCity] = useState("Rio de Janeiro");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [otherCities, setOtherCities] = useState<OtherCityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const otherCitiesList = ["New York", "London", "Tokyo", "Paris", "Sydney"];

  const fetchAllWeatherData = useCallback(
    async (city: string) => {
      setLoading(true);
      setIsAnimating(true);
      try {
        const [{ weather, forecast }, otherCitiesWeather] = await Promise.all([
          getWeatherAndForecast(city),
          getCurrentWeatherForCities(otherCitiesList.filter(c => c.toLowerCase() !== city.toLowerCase())),
        ]);

        setWeatherData(weather);
        setForecastData(forecast);
        setOtherCities(otherCitiesWeather);
        setCurrentCity(weather.name);
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Error fetching weather data",
          description: err.message || "Please try again later.",
        });
        setWeatherData(null);
        setForecastData(null);
      } finally {
        setLoading(false);
        setTimeout(() => setIsAnimating(false), 500); // Animation duration
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchAllWeatherData(currentCity);
  }, []);

  const handleCityChange = (newCity: string) => {
    if(newCity.toLowerCase() !== currentCity.toLowerCase()) {
      setCurrentCity(newCity);
      fetchAllWeatherData(newCity);
    }
  };
  
  if (loading && !weatherData) { // Show skeleton only on initial load
    return (
        <div className="w-full h-full max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Sidebar Skeleton */}
            <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-6">
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="flex-1 rounded-2xl" />
            </div>
            {/* Main Content Skeleton */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-6">
                 <Skeleton className="h-16 w-full rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
                <Skeleton className="flex-1 rounded-2xl" />
            </div>
        </div>
    );
  }

  if (!weatherData || !forecastData) {
    return <div className="text-center text-red-500">Failed to load weather data. Please try again.</div>
  }


  const getWeatherGradient = (weatherMain?: string) => {
    switch (weatherMain?.toLowerCase()) {
      case "clear":
        return "from-blue-400 to-sky-300";
      case "clouds":
        return "from-slate-500 to-gray-400";
      case "rain":
      case "drizzle":
        return "from-indigo-500 to-purple-600";
      case "thunderstorm":
        return "from-gray-700 to-indigo-800";
      case "snow":
        return "from-sky-300 to-blue-400";
      case "mist":
      case "smoke":
      case "haze":
      case "dust":
      case "fog":
      case "sand":
      case "ash":
      case "squall":
      case "tornado":
        return "from-slate-400 to-gray-500";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };
  const weatherGradientClass = getWeatherGradient(weatherData?.weather[0].main);

  return (
    <div className={`w-full h-full max-w-6xl mx-auto bg-gradient-to-br ${weatherGradientClass} rounded-3xl shadow-2xl overflow-hidden transition-colors duration-1000`}>
       <div className={`flex flex-col md:flex-row w-full h-full bg-black/10 backdrop-blur-sm transition-opacity duration-1000 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-full md:flex">
            <Sidebar
              weatherData={weatherData}
              otherCities={otherCities}
              onCitySelect={handleCityChange}
              onSearch={handleCityChange}
            />
            <MainWeatherDisplay
              weatherData={weatherData}
              forecastData={forecastData}
            />
        </div>
       </div>
    </div>
  );
}
