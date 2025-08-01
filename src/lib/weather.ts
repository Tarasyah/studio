// IMPORTANT:
// The application will not work without a valid OpenWeatherMap API key.
// 1. Get your free API key from https://openweathermap.org/
// 2. Create a file named .env.local in the root of your project.
// 3. Add the following line to .env.local:
//    NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: { id: number; main: string; description: string; icon: string }[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust: number };
  visibility: number;
  pop: number;
  sys: { pod: string };
  dt_txt: string;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export type OtherCityData = Pick<WeatherData, 'name' | 'main' | 'weather'>;


const checkApiKey = () => {
  if (!API_KEY) {
    throw new Error(
      "OpenWeatherMap API key is missing. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your .env.local file."
    );
  }
};

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "An error occurred while fetching data.");
  }
  return res.json();
}

export async function getWeatherAndForecast(city: string) {
  checkApiKey();
  const weatherUrl = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastUrl = `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const [weather, forecast] = await Promise.all([
      fetcher<WeatherData>(weatherUrl),
      fetcher<ForecastData>(forecastUrl),
    ]);
    return { weather, forecast };
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

export async function getCurrentWeatherForCities(cities: string[]): Promise<OtherCityData[]> {
    checkApiKey();
    const requests = cities.map(city => {
        const url = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
        return fetcher<WeatherData>(url).catch(e => {
            console.error(`Failed to fetch weather for ${city}`, e);
            return null; // Return null on failure
        });
    });

    try {
        const results = await Promise.all(requests);
        // Filter out null results and map to the required format
        return results.filter(r => r !== null).map(({ name, main, weather }) => ({ name, main, weather })) as OtherCityData[];
    } catch (error) {
        console.error("Failed to fetch weather for multiple cities:", error);
        // Return empty array or handle as needed
        return [];
    }
}
