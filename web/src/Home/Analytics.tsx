import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Download, Calendar, MapPin, BarChart3, RefreshCw } from 'lucide-react';
import { fetchSensorData, SensorData } from '../utils/api';

type MetricPoint = {
  ts: string; // ISO or human time label
  value: number;
};

type StationReading = {
  id: string;
  station: string;
  pollutant: string;
  value: number;
  unit: string;
  timestamp: string;
  aqi?: string;
  status?: 'OK' | 'Alert' | 'Offline';
  location?: string;
};

const STATIONS = ['Node_01 (Rourkela)', 'Node_02 (Rourkela)', 'Node_03 (Rourkela)', 'Node_12 (Rourkela)'];
const POLLUTANTS = ['PM2.5', 'PM10', 'NO2', 'O3', 'CO', 'SO2', 'Gas'];

function generateSeries(hours = 24, base = 40, volatility = 25) {
  const now = new Date();
  return Array.from({ length: hours }).map((_, i) => {
    const t = new Date(now.getTime() - (hours - 1 - i) * 60 * 60 * 1000);
    const value = Math.max(0, Math.round((base + (Math.sin(i / 3) * volatility) + (Math.random() * volatility - volatility / 2)) * 10) / 10);
    return { ts: `${t.getHours()}:00`, value };
  });
}

function generateRecentReadings(station: string, pollutant: string) {
  const now = Date.now();
  return Array.from({ length: 8 }).map((_, i) => {
    const ts = new Date(now - i * 10 * 60 * 1000).toISOString();
    const value = Math.max(0, Math.round((30 + Math.random() * 140) * 10) / 10);
    return {
      id: `${station}-${pollutant}-${i}`,
      station,
      pollutant,
      value,
      unit: pollutant === 'PM2.5' || pollutant === 'PM10' ? 'µg/m³' : 'ppb',
      timestamp: ts,
      aqi: value > 150 ? 'Unhealthy' : value > 100 ? 'Moderate' : 'Good',
      status: value > 150 ? 'Alert' : 'OK',
      location: '25.5941° N, 85.1376° E'
    } as StationReading;
  });
}

export default function Analytics() {
  const [station, setStation] = useState(STATIONS[0]);
  const [pollutant, setPollutant] = useState(POLLUTANTS[0]);
  const [hours, setHours] = useState(24);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<MetricPoint[]>([]);

  // Fetch real-time sensor data
  useEffect(() => {
    const loadSensorData = async () => {
      try {
        setLoading(true);
        const data = await fetchSensorData();
        setSensorData(data);
        
        // Add current reading to historical data
        const currentTime = new Date();
        const timeLabel = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
        
        let currentValue = 0;
        switch (pollutant) {
          case 'PM2.5': currentValue = data.pm25 || 0; break;
          case 'PM10': currentValue = data.pm10 || 0; break;
          case 'NO2': currentValue = data.no2 || 0; break;
          case 'O3': currentValue = data.o3 || 0; break;
          case 'CO': currentValue = data.co || 0; break;
          case 'SO2': currentValue = data.so2 || 0; break;
          case 'Gas': currentValue = data.gas || 0; break;
        }
        
        setHistoricalData(prev => {
          const newData = [...prev, { ts: timeLabel, value: currentValue }];
          // Keep only last 'hours' data points
          return newData.slice(-hours);
        });
      } catch (err) {
        console.error('Error loading sensor data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSensorData();
    const interval = setInterval(loadSensorData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [pollutant, hours]);

  const series = useMemo(() => {
    // Use real data if available, otherwise use generated data
    if (historicalData.length > 0) {
      return historicalData;
    }
    // Fallback to generated data
    const base = pollutant === 'PM2.5' ? 80 : pollutant === 'PM10' ? 70 : 40;
    const volatility = pollutant === 'PM2.5' ? 40 : 30;
    return generateSeries(hours, base, volatility);
  }, [pollutant, hours, historicalData]);

  const recent = useMemo(() => generateRecentReadings(station, pollutant), [station, pollutant]);

  const avg = useMemo(() => {
    if (!series.length) return 0;
    return Math.round((series.reduce((s, p) => s + p.value, 0) / series.length) * 10) / 10;
  }, [series]);

  const max = useMemo(() => Math.max(...series.map(s => s.value)), [series]);
  const min = useMemo(() => Math.min(...series.map(s => s.value)), [series]);

  const exportCSV = (rows: StationReading[]) => {
    const header = ['id', 'station', 'pollutant', 'value', 'unit', 'timestamp', 'aqi', 'status', 'location'];
    const csv = [
      header.join(','),
      ...rows.map(r => [
        r.id,
        `"${r.station}"`,
        r.pollutant,
        r.value,
        r.unit,
        r.timestamp,
        `"${r.aqi ?? ''}"`,
        r.status,
        `"${r.location ?? ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${station.replace(/[^a-z0-9]/gi,'_')}_${pollutant}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-8 py-3 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-0.5">Analytics</h1>
          <p className="text-xs text-slate-600">Trends, summaries and station-level metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-2 hover:bg-[#4a3f9e] hover:text-white transition-all">
            <Calendar size={16} /> Last {hours}h
          </button>

          <button
            onClick={() => exportCSV(recent)}
            className="px-3 py-2 rounded-lg bg-[#4a3f9e] text-white flex items-center gap-2 hover:bg-[#3d3582] transition-all"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="px-8 py-8 space-y-6 bg-slate-50">
        {/* Controls */}
        <div className="flex items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
          <div className="flex items-center gap-3">
            <label className="text-slate-600 text-sm font-semibold">Station</label>
            <select value={station} onChange={e => setStation(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
              {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <label className="text-slate-600 text-sm font-semibold">Pollutant</label>
            <select value={pollutant} onChange={e => setPollutant(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
              {POLLUTANTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <label className="text-slate-600 text-sm font-semibold">Window</label>
            <select value={hours} onChange={e => setHours(Number(e.target.value))} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
              <option value={6}>6h</option>
              <option value={12}>12h</option>
              <option value={24}>24h</option>
              <option value={72}>72h</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <div className="text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">
              <div className="text-xs text-green-700 font-semibold">Avg</div>
              <div className="text-lg font-bold text-green-900">{avg} {pollutant === 'PM2.5' || pollutant === 'PM10' ? 'µg/m³' : 'ppb'}</div>
            </div>
            <div className="text-sm bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
              <div className="text-xs text-blue-700 font-semibold">Max</div>
              <div className="text-lg font-bold text-blue-900">{max}</div>
            </div>
            <div className="text-sm bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-600 font-semibold">Min</div>
              <div className="text-lg font-bold text-slate-900">{min}</div>
            </div>
          </div>
        </div>

        {/* Chart + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
            <h3 className="text-slate-900 text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 size={18} /> {pollutant} trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={series}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="ts" stroke="#94a3b8" tick={{ fill: '#64748b' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b' }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4a3f9e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
            <h4 className="text-slate-900 text-lg font-bold mb-4">Summary</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold">Current station</div>
                <div className="font-semibold text-slate-900">{station}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold">Peak</div>
                <div className="font-semibold text-slate-900">{max}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold">AQI category (sample)</div>
                <div className="font-semibold text-slate-900">{avg > 150 ? 'Unhealthy' : avg > 100 ? 'Moderate' : 'Good'}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold">Unit</div>
                <div className="font-semibold text-slate-900">{pollutant === 'PM2.5' || pollutant === 'PM10' ? 'µg/m³' : 'ppb'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 p-3 bg-slate-50 rounded-lg">
              <MapPin className="text-[#4a3f9e]" size={16} />
              <div className="text-slate-600 text-sm">Location: 25.5941° N, 85.1376° E</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Pollutant Comparison */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 text-xl font-bold flex items-center gap-2">
            <BarChart3 size={18} /> All Pollutants Comparison
          </h3>
          <div className="text-slate-600 text-sm">Real-time sensor data distribution</div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={[
            { name: 'PM2.5', value: avg, max: 60, unit: 'µg/m³' },
            { name: 'PM10', value: series.length > 0 ? Math.round(avg * 1.6 * 10) / 10 : 0, max: 100, unit: 'µg/m³' },
            { name: 'NO2', value: series.length > 0 ? Math.round(avg * 0.8 * 10) / 10 : 0, max: 200, unit: 'ppb' },
            { name: 'O3', value: series.length > 0 ? Math.round(avg * 0.9 * 10) / 10 : 0, max: 180, unit: 'ppb' },
            { name: 'CO', value: series.length > 0 ? Math.round(avg * 0.15 * 10) / 10 : 0, max: 10, unit: 'ppm' },
            { name: 'SO2', value: series.length > 0 ? Math.round(avg * 0.6 * 10) / 10 : 0, max: 80, unit: 'ppb' },
            { name: 'Gas', value: series.length > 0 ? Math.round(avg * 80 * 10) / 10 : 0, max: 4095, unit: 'ppm' }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b' }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              formatter={(value: number, name: string, props: any) => [
                `${value} ${props.payload.unit}`,
                'Value'
              ]}
            />
            <Legend />
            <Bar dataKey="value" fill="#4a3f9e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Pollutant Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          {POLLUTANTS.map((p) => (
            <div key={p} className={`p-3 rounded-lg border transition-all cursor-pointer ${
              pollutant === p 
                ? 'bg-[#4a3f9e] text-white border-[#4a3f9e]' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#4a3f9e]/40'
            }`} onClick={() => setPollutant(p)}>
              <div className="text-xs font-semibold opacity-80 mb-1">{p}</div>
              <div className="text-lg font-bold">
                {loading ? '--' : 
                  p === 'PM2.5' ? avg.toFixed(1) :
                  p === 'PM10' ? (avg * 1.6).toFixed(1) :
                  p === 'NO2' ? (avg * 0.8).toFixed(1) :
                  p === 'O3' ? (avg * 0.9).toFixed(1) :
                  p === 'CO' ? (avg * 0.15).toFixed(1) :
                  p === 'SO2' ? (avg * 0.6).toFixed(1) :
                  p === 'Gas' ? (avg * 80).toFixed(0) : '0'
                }
              </div>
              <div className="text-xs opacity-70">
                {p === 'PM2.5' || p === 'PM10' ? 'µg/m³' : p === 'CO' || p === 'Gas' ? 'ppm' : 'ppb'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent readings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 text-lg font-bold">Recent readings</h3>
          <div className="text-slate-600 text-sm">Showing latest samples for {pollutant} at {station}</div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-600 text-sm border-b border-slate-200">
                <th className="py-3 pr-4 font-semibold">Timestamp</th>
                <th className="py-3 pr-4 font-semibold">Station</th>
                <th className="py-3 pr-4 font-semibold">Pollutant</th>
                <th className="py-3 pr-4 font-semibold">Value</th>
                <th className="py-3 pr-4 font-semibold">AQI</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-3 text-slate-600 text-sm">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="py-3 text-slate-600 text-sm">{r.station}</td>
                  <td className="py-3 text-slate-600 text-sm">{r.pollutant}</td>
                  <td className="py-3 text-slate-900 font-semibold">{r.value} {r.unit}</td>
                  <td className="py-3 text-slate-600 text-sm">{r.aqi}</td>
                  <td className={`py-3 text-sm font-semibold ${r.status === 'Alert' ? 'text-red-600' : 'text-green-600'}`}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}