import { WeatherDashboard } from "@/components/weather-dashboard";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 items-center justify-center p-4">
      <WeatherDashboard />
    </div>
  );
}
