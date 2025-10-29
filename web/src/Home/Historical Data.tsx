import React, { useMemo, useState, useEffect } from 'react';
import { Download, ChevronDown, Calendar, RefreshCw } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { fetchSensorData, SensorData } from '../utils/api';

type Reading = { ts: string; pm25: number; pm10?: number; no2?: number; gas?: number; temperature?: number; humidity?: number };
type StationLite = { id: string; name: string; lat?: number; lon?: number };

const SAMPLE_STATIONS: StationLite[] = [
  { id: 'Node_01', name: 'Node_01 (Rourkela - Center)' },
  { id: 'Node_02', name: 'Node_02 (Rourkela - East)' },
  { id: 'Node_03', name: 'Node_03 (Rourkela - West)' },
  { id: 'Node_12', name: 'Node_12 (Rourkela - South)' }
];

function generateReadings(hours: number, seed = 42): Reading[] {
  const out: Reading[] = [];
  const now = Date.now();
  let base = 40 + (seed % 7) * 6;
  for (let i = hours; i >= 0; i -= Math.max(1, Math.floor(hours / 48))) {
    const ts = new Date(now - i * 60 * 60 * 1000).toISOString();
    // small pseudo-random walk
    base += (Math.sin((now + i * 7) / 5_000_000) * 8 + (Math.random() - 0.5) * 6);
    const pm25 = Math.max(0, Math.round(base * 10) / 10);
    const pm10 = Math.max(0, Math.round((pm25 * (1.4 + Math.random() * 0.6)) * 10) / 10);
    const no2 = Math.max(0, Math.round((pm25 * (0.3 + Math.random() * 0.6)) * 10) / 10);
    out.push({ ts, pm25, pm10, no2 });
  }
  return out;
}

function csvFromReadings(rows: Reading[], station: StationLite) {
  const header = ['timestamp', 'stationId', 'stationName', 'pm25', 'pm10', 'no2'];
  const lines = rows.map(r => [
    r.ts,
    station.id,
    `"${station.name}"`,
    r.pm25,
    r.pm10 ?? '',
    r.no2 ?? ''
  ].join(','));
  return [header.join(','), ...lines].join('\n');
}

export default function HistoricalData() {
  const [stationId, setStationId] = useState<string>(SAMPLE_STATIONS[0].id);
  const [period, setPeriod] = useState<'24' | '72' | '168'>('24'); // hours: 24, 72, 168(7d)
  const hours = period === '24' ? 24 : period === '72' ? 72 : 168;
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [historicalReadings, setHistoricalReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(false);

  const station = useMemo(() => SAMPLE_STATIONS.find(s => s.id === stationId) ?? SAMPLE_STATIONS[0], [stationId]);

  // Fetch real-time data and build historical records
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchSensorData();
        setSensorData(data);
        
        // Add current reading to historical data
        const newReading: Reading = {
          ts: new Date().toISOString(),
          pm25: data.pm25 || 0,
          pm10: data.pm10 || 0,
          no2: data.no2 || 0,
          gas: data.gas || 0,
          temperature: data.temperature,
          humidity: data.humidity
        };
        
        setHistoricalReadings(prev => {
          const updated = [...prev, newReading];
          // Keep only readings within the selected time period
          const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
          return updated.filter(r => new Date(r.ts).getTime() > cutoffTime);
        });
      } catch (err) {
        console.error('Error loading sensor data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [hours]);

  const readings = useMemo(() => {
    // Use real data if available, otherwise use generated data
    if (historicalReadings.length > 0) {
      return historicalReadings;
    }
    return generateReadings(hours, stationId.length);
  }, [hours, stationId, historicalReadings]);

  const exportCSV = () => {
    const csv = csvFromReadings(readings, station);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${station.id}_historical_${hours}h_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-slate-900 font-bold">Historical Data</h1>
            <p className="text-slate-600 text-sm">View and export historical pollutant readings for stations.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-2">
              <Calendar className="text-slate-600" />
              <select
                value={period}
                onChange={e => setPeriod(e.target.value as any)}
                className="bg-transparent text-slate-900 outline-none"
              >
                <option value="24">Last 24 hours</option>
                <option value="72">Last 72 hours</option>
                <option value="168">Last 7 days</option>
              </select>
              <ChevronDown className="text-slate-600" />
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-2">
              <label className="text-slate-600 text-sm mr-2">Station</label>
              <select
                value={stationId}
                onChange={e => setStationId(e.target.value)}
                className="bg-transparent text-slate-900 outline-none"
              >
                {SAMPLE_STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <button onClick={exportCSV} className="px-3 py-2 bg-[#4a3f9e] hover:bg-[#3d3582] text-white rounded-lg flex items-center gap-2">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-lg">
          <h3 className="text-slate-900 text-lg font-bold mb-4">All Pollutants - Historical Trend</h3>
          <div style={{ height: 360 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings.map(r => ({ 
                time: new Date(r.ts).toLocaleString(), 
                pm25: r.pm25, 
                pm10: r.pm10,
                no2: r.no2,
                gas: r.gas,
                temperature: r.temperature,
                humidity: r.humidity
              }))}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} minTickGap={30} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip 
                  formatter={(v: any) => `${typeof v === 'number' ? v.toFixed(1) : v}`} 
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="pm25" stroke="#4a3f9e" strokeWidth={2.5} dot={false} name="PM2.5 (µg/m³)" />
                <Line type="monotone" dataKey="pm10" stroke="#10b981" strokeWidth={2} dot={false} name="PM10 (µg/m³)" />
                <Line type="monotone" dataKey="no2" stroke="#f59e0b" strokeWidth={2} dot={false} name="NO₂ (ppb)" />
                <Line type="monotone" dataKey="gas" stroke="#ef4444" strokeWidth={1.8} dot={false} name="Gas (ppm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Environmental Parameters */}
          {readings.length > 0 && readings[0].temperature !== undefined && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="text-slate-900 text-base font-bold mb-3">Environmental Parameters</h4>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readings.map(r => ({ 
                    time: new Date(r.ts).toLocaleString(), 
                    temperature: r.temperature,
                    humidity: r.humidity
                  }))}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} minTickGap={30} angle={-15} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(v: any) => `${typeof v === 'number' ? v.toFixed(1) : v}`} 
                      contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Temperature (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Humidity (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">Station</div>
              <div className="font-semibold">{station.name}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">Period</div>
              <div className="font-semibold">{hours} hours</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">Samples</div>
              <div className="font-semibold">{readings.length}</div>
            </div>
          </div>

          <div className="mt-4 overflow-auto max-h-64 border-t border-slate-200 pt-3">
            <table className="w-full text-slate-700 text-sm">
              <thead className="text-slate-900 sticky top-0 bg-slate-50">
                <tr>
                  <th className="text-left px-3 py-2">Timestamp</th>
                  <th className="text-right px-3 py-2">PM2.5</th>
                  <th className="text-right px-3 py-2">PM10</th>
                  <th className="text-right px-3 py-2">NO₂</th>
                  <th className="text-right px-3 py-2">Gas</th>
                  {readings.length > 0 && readings[0].temperature !== undefined && (
                    <>
                      <th className="text-right px-3 py-2">Temp</th>
                      <th className="text-right px-3 py-2">Humidity</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {readings.map(r => (
                  <tr key={r.ts} className="border-b border-slate-200 odd:bg-slate-50/50">
                    <td className="px-3 py-2">{new Date(r.ts).toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-medium">{r.pm25?.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{r.pm10?.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{r.no2?.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{r.gas?.toFixed(0) || '-'}</td>
                    {r.temperature !== undefined && (
                      <>
                        <td className="px-3 py-2 text-right">{r.temperature?.toFixed(1)}°C</td>
                        <td className="px-3 py-2 text-right">{r.humidity?.toFixed(0)}%</td>
                      </>
                    )}
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