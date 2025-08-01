"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WeatherIcon } from "./weather-icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OtherCityData } from "@/lib/weather";

type CityPin = {
  name: string;
  top: string;
  left: string;
};

const cityPins: CityPin[] = [
  { name: "New York", top: "38%", left: "26%" },
  { name: "London", top: "33%", left: "49%" },
  { name: "Tokyo", top: "40%", left: "83%" },
  { name: "Sydney", top: "72%", left: "86%" },
  { name: "Rio", top: "66%", left: "35%" },
];

interface WeatherMapProps {
  cities: OtherCityData[];
  onCityClick: (city: OtherCityData) => void;
}

export function WeatherMap({ cities, onCityClick }: WeatherMapProps) {
  const getCityData = (name: string) => {
    return cities.find((city) => city.name === name);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Weather Map</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1558486012-817176f84c6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNnx8d2VhdGhlcnxlbnwwfHx8fDE3NTQwMDYzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="World Map"
              layout="fill"
              objectFit="cover"
              className="opacity-70"
              data-ai-hint="world map"
            />
            {cityPins.map((pin) => {
              const cityData = getCityData(pin.name);
              if (!cityData) return null;

              return (
                <Tooltip key={pin.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onCityClick(cityData)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 bg-background/50 rounded-full backdrop-blur-sm transition-transform hover:scale-110"
                      style={{ top: pin.top, left: pin.left }}
                    >
                      <WeatherIcon
                        iconCode={cityData.weather[0].icon}
                        className="w-6 h-6 text-white"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{cityData.name}</p>
                    <p>{Math.round(cityData.main.temp)}°c, {cityData.weather[0].main}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
