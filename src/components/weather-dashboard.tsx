
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
  const { toast } = useToast();

  const otherCitiesList = ["New York", "London", "Tokyo", "Paris", "Sydney"];

  const fetchAllWeatherData = useCallback(
    async (city: string) => {
      setLoading(true);
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
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchAllWeatherData(currentCity);
  }, []);

  const handleCityChange = (newCity: string) => {
    setCurrentCity(newCity);
    fetchAllWeatherData(newCity);
  };
  
  if (loading || !weatherData || !forecastData) {
    return (
      <div className="flex flex-col md:flex-row h-screen w-full max-w-4xl mx-auto bg-white dark:bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/3 bg-gray-100 dark:bg-gray-900 p-6 flex flex-col justify-between">
            <Skeleton className="h-8 w-32 mb-8 rounded-md" />
            <Skeleton className="h-20 w-full mb-8 rounded-md" />
            <Skeleton className="h-6 w-24 mb-6 rounded-md" />
            <div className="space-y-4">
                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
            </div>
        </div>
        <div className="flex-1 p-6 md:p-10 bg-gray-50 dark:bg-gray-800">
            <Skeleton className="h-8 w-48 mb-8 rounded-md" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)}
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
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
    <div className={`w-full max-w-md md:max-w-4xl mx-auto bg-gradient-to-br ${weatherGradientClass} rounded-3xl shadow-2xl overflow-hidden`}>
       <div className="flex flex-col md:flex-row w-full h-full bg-black/10 backdrop-blur-sm">
        <Sidebar
          weatherData={weatherData}
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
