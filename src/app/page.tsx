
"use client";

import React from "react";
import { WeatherDashboard } from "@/components/weather-dashboard";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <WeatherDashboard />
    </main>
  );
}
