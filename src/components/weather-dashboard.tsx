"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  getWeatherAndForecast,
  WeatherData,
  ForecastItem,
  OtherCityData,
  getCurrentWeatherForCities,
} from "@/lib/weather";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Search,
  Wind,
  Droplets,
  Eye,
  ThermometerSun,
  Sunrise,
  Sunset,
  User,
  Bell,
  AlertCircle,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
} from "lucide-react";
import { WeatherIcon } from "./weather-icon";
import { WeatherMap } from "./weather-map";

// Helper to format UNIX timestamp to a readable time string
const formatTime = (timestamp: number, timezone: number) => {
  return new Date((timestamp + timezone) * 1000)
    .toISOString()
    .substr(11, 5);
};

export function WeatherDashboard() {
  const [city, setCity] = useState("Dhaka");
  const [searchTerm, setSearchTerm] = useState("Dhaka");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastList, setForecastList] = useState<ForecastItem[]>([]);
  const [otherCities, setOtherCities] = useState<OtherCityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (targetCity: string) => {
    setLoading(true);
    setError(null);
    try {
      const { weather, forecast } = await getWeatherAndForecast(targetCity);
      setWeatherData(weather);
      setForecastList(forecast.list);
      setCity(weather.name);
      setSearchTerm(weather.name);
    } catch (err: any) {
      setError(
        err.message || "Failed to fetch weather data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOtherCitiesData = useCallback(async () => {
    try {
      const cities = ["New York", "London", "Tokyo", "Sydney", "Rio"];
      const data = await getCurrentWeatherForCities(cities);
      setOtherCities(data);
    } catch (err) {
      console.error("Failed to fetch other cities' weather", err);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData("Dhaka");
    fetchOtherCitiesData();
  }, [fetchWeatherData, fetchOtherCitiesData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      fetchWeatherData(searchTerm);
    }
  };

  const hourlyForecast = useMemo(() => {
    if (!forecastList.length) return [];
    const now = new Date();
    const today = now.getDate();
    const tomorrow = new Date(now);
    tomorrow.setDate(today + 1);

    const getForecastForHour = (hour: number, day: Date) =>
      forecastList.find((item) => {
        const itemDate = new Date(item.dt * 1000);
        return (
          itemDate.getDate() === day.getDate() && itemDate.getHours() === hour
        );
      });

    return [
      {
        title: "Morning",
        forecast: getForecastForHour(9, now) || forecastList[0],
      },
      {
        title: "Afternoon",
        forecast: getForecastForHour(15, now) || forecastList[2],
      },
      {
        title: "Evening",
        forecast: getForecastForHour(21, now) || forecastList[4],
      },
      {
        title: "Night",
        forecast: getForecastForHour(3, tomorrow) || forecastList[6],
      },
    ].filter((item) => item.forecast);
  }, [forecastList]);

  const tomorrowsForecast = useMemo(() => {
    if (!forecastList.length) return null;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Find forecast for tomorrow around midday (12:00 or 15:00)
    return forecastList.find(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getDate() === tomorrow.getDate() && (itemDate.getHours() >= 12 && itemDate.getHours() <= 15);
    });
  }, [forecastList]);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background font-body">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hello, User!
          </h1>
          <p className="text-muted-foreground">
            Welcome back to WeatherWise.
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </form>
        </div>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center bg-primary/20 rounded-lg">
              {loading ? (
                <WeatherSkeleton />
              ) : weatherData ? (
                <>
                  <div className="flex items-center gap-4">
                    <WeatherIcon
                      iconCode={weatherData.weather[0].icon}
                      className="w-20 h-20 text-accent"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">Today</p>
                      <h2 className="text-4xl font-bold text-foreground">
                        {city}
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Temperature: {Math.round(weatherData.main.temp)}°c
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 sm:mt-0 text-sm">
                    <div className="flex items-center gap-2">
                      <ThermometerSun className="w-5 h-5 text-accent" />
                      <span>
                        Feels like: {Math.round(weatherData.main.feels_like)}°c
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-accent" />
                      <span>Humidity: {weatherData.main.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-accent" />
                      <span>
                        Visibility: {(weatherData.visibility / 1000).toFixed(1)} km
                      </span>
                    </div>
                     <div className="flex items-center gap-2">
                      <Wind className="w-5 h-5 text-accent" />
                      <span>
                        Wind: {weatherData.wind.speed.toFixed(1)} m/s
                      </span>
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <WeatherMap cities={otherCities} onCityClick={(city) => fetchWeatherData(city.name)} />

          <Card>
            <CardHeader>
              <CardTitle>Today's Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <HourlyForecastSkeleton key={i} />
                    ))
                  : hourlyForecast.map(({ title, forecast }) => (
                      <Card
                        key={title}
                        className="flex flex-col items-center justify-center p-4 bg-primary/10"
                      >
                        <p className="font-medium text-muted-foreground">
                          {title}
                        </p>
                        <WeatherIcon
                          iconCode={forecast.weather[0].icon}
                          className="w-12 h-12 my-2 text-accent"
                        />
                        <p className="text-xl font-bold">
                          {Math.round(forecast.main.temp)}°c
                        </p>
                      </Card>
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tomorrow's Forecast</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              {loading ? (
                <TomorrowForecastSkeleton />
              ) : tomorrowsForecast ? (
                <>
                  <WeatherIcon
                    iconCode={tomorrowsForecast.weather[0].icon}
                    className="w-24 h-24 text-accent"
                  />
                  <p className="text-2xl font-bold mt-2">
                    {Math.round(tomorrowsForecast.main.temp)}°c
                  </p>
                  <p className="text-muted-foreground capitalize">
                    {tomorrowsForecast.weather[0].description}
                  </p>
                </>
              ) : (
                <p>No forecast available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Cities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && !otherCities.length
                ? Array.from({ length: 3 }).map((_, i) => (
                    <OtherCitySkeleton key={i} />
                  ))
                : otherCities.map((c) => (
                    <div key={c.name} className="flex justify-between items-center">
                      <p className="font-medium">{c.name}</p>
                      <div className="flex items-center gap-2">
                         <WeatherIcon
                          iconCode={c.weather[0].icon}
                          className="w-6 h-6 text-muted-foreground"
                        />
                        <p className="font-bold">{Math.round(c.main.temp)}°c</p>
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Skeletons for loading states
function WeatherSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-40 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 sm:mt-0">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

function HourlyForecastSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center p-4 bg-primary/10">
      <Skeleton className="h-5 w-20 mb-2" />
      <Skeleton className="w-12 h-12 rounded-full my-2" />
      <Skeleton className="h-8 w-16" />
    </Card>
  );
}

function TomorrowForecastSkeleton() {
  return (
    <div className="flex flex-col items-center w-full">
      <Skeleton className="w-24 h-24 rounded-full" />
      <Skeleton className="h-8 w-20 mt-2" />
      <Skeleton className="h-5 w-32 mt-1" />
    </div>
  );
}

function OtherCitySkeleton() {
  return (
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-24" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
}
