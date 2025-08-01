
'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { ForecastData } from '@/lib/weather';

interface ForecastChartProps {
    forecastData: ForecastData;
}

export function ForecastChart({ forecastData }: ForecastChartProps) {
    const hourlyData = forecastData.list.slice(0, 8).map(item => ({
        time: format(new Date(item.dt_txt), 'ha'),
        temp: Math.round(item.main.temp),
    }));

  return (
    <div className="h-64 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={hourlyData}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(255,255,255,0.6)" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="rgba(255,255,255,0.1)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.7)"
            tick={{ fill: 'white', fontSize: 12 }}
            tickLine={{ stroke: 'rgba(255,255,255,0.7)' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.7)"
            tick={{ fill: 'white', fontSize: 12 }}
            tickLine={{ stroke: 'rgba(255,255,255,0.7)' }}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickFormatter={(value) => `${value}°`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.5rem',
              color: 'white',
            }}
            labelStyle={{ fontWeight: 'bold' }}
            formatter={(value: number) => [`${value}°C`, 'Temperature']}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="white"
            fill="url(#colorTemp)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
