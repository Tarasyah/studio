
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
import { MainWeatherDisplay } from "./main-weather-display";
import { Sidebar } from "./sidebar";
import { Skeleton } from "./ui/skeleton";

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
        setTimeout(() => setIsAnimating(false), 500);
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
  
  if (loading || !weatherData || !forecastData) {
    return (
      <div className="flex flex-col md:flex-row h-screen w-full max-w-4xl mx-auto bg-gray-900 shadow-lg rounded-3xl overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-2/5 xl:w-1/3 bg-white/10 p-6 flex flex-col justify-between">
            <div className="flex flex-col items-center md:items-start">
              <Skeleton className="h-8 w-32 mb-2 rounded-md" />
              <Skeleton className="h-6 w-48 mb-8 rounded-md" />
            </div>
            <div className="flex flex-col items-center">
                <Skeleton className="h-32 w-32 mb-2 rounded-full" />
                <Skeleton className="h-12 w-40 mb-4 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
            </div>
            <div className="hidden md:block mt-8">
              <Skeleton className="h-8 w-32 mb-4 rounded-md" />
              <div className="space-y-3">
                  {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
              </div>
            </div>
        </div>
        <div className="flex-1 p-6 bg-gray-800 rounded-t-3xl md:rounded-t-none md:rounded-r-3xl">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-10 w-64 rounded-full" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg mb-8" />
            <Skeleton className="h-8 w-40 mb-4 rounded-md" />
            <div className="space-y-3">
              {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
            </div>
        </div>
      </div>
    );
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
    <div className={`w-full max-w-md md:max-w-4xl mx-auto bg-gradient-to-br ${weatherGradientClass} rounded-3xl shadow-2xl overflow-hidden transition-all duration-500`}>
       <div className={`flex flex-col md:flex-row w-full h-full bg-black/10 backdrop-blur-sm transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <Sidebar
          weatherData={weatherData}
          forecastData={forecastData}
          otherCities={otherCities}
          onCitySelect={handleCityChange}
          onSearch={handleCityChange}
        />
        <MainWeatherDisplay
          weatherData={weatherData}
          forecastData={forecastData}
          onSearch={handleCityChange}
        />
       </div>
    </div>
  );
}
