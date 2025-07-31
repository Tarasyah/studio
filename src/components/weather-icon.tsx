import React from "react";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Thermometer,
} from "lucide-react";

interface WeatherIconProps extends React.SVGProps<SVGSVGElement> {
  iconCode: string;
}

export function WeatherIcon({ iconCode, ...props }: WeatherIconProps) {
  const getIcon = (code: string) => {
    switch (code) {
      case "01d": return <Sun {...props} />;
      case "01n": return <Moon {...props} />;
      case "02d": return <CloudSun {...props} />;
      case "02n": return <CloudMoon {...props} />;
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <Cloud {...props} />;
      case "09d":
      case "09n":
        return <CloudDrizzle {...props} />;
      case "10d":
      case "10n":
        return <CloudRain {...props} />;
      case "11d":
      case "11n":
        return <CloudLightning {...props} />;
      case "13d":
      case "13n":
        return <CloudSnow {...props} />;
      case "50d":
      case "50n":
        return <CloudFog {...props} />;
      default:
        return <Thermometer {...props} />;
    }
  };

  return getIcon(iconCode);
}
