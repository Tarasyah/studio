
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { getWeatherAndForecast, WeatherData } from "@/lib/weather";

const getWeatherGradient = (weatherMain?: string) => {
  switch (weatherMain?.toLowerCase()) {
    case "clear":
      return "from-yellow-300 to-orange-400";
    case "clouds":
      return "from-blue-300 to-gray-400";
    case "rain":
    case "drizzle":
      return "from-indigo-400 to-purple-500";
    case "thunderstorm":
      return "from-gray-600 to-indigo-700";
    case "snow":
      return "from-sky-200 to-blue-300";
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
    case "sand":
    case "ash":
    case "squall":
    case "tornado":
      return "from-slate-300 to-gray-400";
    default:
      return "from-blue-400 to-indigo-500";
  }
};

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Dhaka");

  const fetchWeatherData = useCallback(async (targetCity: string) => {
    setLoading(true);
    try {
      const { weather } = await getWeatherAndForecast(targetCity);
      setWeatherData(weather);
      setCity(weather.name);
    } catch (err) {
      // Error is handled inside WeatherDashboard
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(city);
  }, [fetchWeatherData, city]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
  };
  
  const weatherGradientClass = getWeatherGradient(weatherData?.weather[0].main);

  return (
    <main className={`flex min-h-screen items-center justify-center p-4 bg-gradient-to-br transition-colors duration-1000 ${weatherGradientClass}`}>
      <WeatherDashboard initialCity={city} onCityChange={handleCityChange} />
    </main>
  );
}
