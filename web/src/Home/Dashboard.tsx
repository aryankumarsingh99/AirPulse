import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { IoNotificationsOutline, IoPersonOutline, IoMailOutline, IoSettingsOutline, IoLogOutOutline, IoMapOutline, IoInformationCircleOutline, IoMenuOutline, IoThermometerOutline, IoWaterOutline, IoFlashOutline, IoTrendingUpOutline, IoPulseOutline, IoCheckmarkCircleOutline, IoRadioOutline } from 'react-icons/io5';
import { MdDashboard, MdBarChart, MdPeople, MdCalendarToday, MdAir } from 'react-icons/md';
import { WiStrongWind } from 'react-icons/wi';
import Notifications from './Notifications';
import Analytics from './Analytics';
import InfoPage from './Info Page';
import HistoricalData from './Historical Data';
import Map from './Map';
import Settings from './Settings';
import APITest from './APITest';
import { fetchSensorData, getAQIStatus, calculatePercentage, SensorData } from '../utils/api';


const AirPulseDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{x: number, y: number}[]>([]);

  // Fetch sensor data from API
  useEffect(() => {
    const loadSensorData = async () => {
      try {
        setLoading(true);
        const data = await fetchSensorData();
        setSensorData(data);
        setError(null);
        
        // Add current AQI to chart data
        if (data.aqi) {
          setChartData(prev => {
            const newPoint = { 
              x: prev.length > 0 ? prev[prev.length - 1].x + 5 : 1, 
              y: data.aqi || 0 
            };
            const updated = [...prev, newPoint];
            // Keep only last 20 points for performance
            return updated.slice(-20);
          });
        }
      } catch (err) {
        setError('Failed to fetch sensor data');
        console.error('Error loading sensor data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSensorData();

    // Poll for new data every 30 seconds
    const interval = setInterval(loadSensorData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Chart data - use real data if available
  const analyticalData = chartData.length > 0 ? chartData : [
    { x: 1, y: 5 },
    { x: 5, y: 10 },
    { x: 10, y: 20 },
    { x: 15, y: 50 },
    { x: 20, y: 10 },
    { x: 25, y: 15 },
    { x: 30, y: 35 },
    { x: 35, y: 30 },
    { x: 40, y: 25 },
    { x: 45, y: 15 },
    { x: 50, y: 12 },
    { x: 55, y: 18 },
    { x: 60, y: 42 },
    { x: 65, y: 38 },
    { x: 70, y: 35 },
    { x: 75, y: 32 },
    { x: 80, y: 28 },
    { x: 85, y: 25 },
    { x: 90, y: 22 },
    { x: 95, y: 20 }
  ];

  // Dynamic pollutants data based on sensor readings
  const pollutants = [
    { 
      name: 'PM2.5', 
      value: sensorData?.pm25 || 0, 
      max: 60, 
      status: getAQIStatus(sensorData?.pm25 || 0), 
      percentage: calculatePercentage(sensorData?.pm25 || 0, 60) 
    },
    { 
      name: 'PM10', 
      value: sensorData?.pm10 || 0, 
      max: 100, 
      status: getAQIStatus(sensorData?.pm10 || 0), 
      percentage: calculatePercentage(sensorData?.pm10 || 0, 100) 
    },
    { 
      name: 'NO2', 
      value: sensorData?.no2 || 0, 
      max: 200, 
      status: getAQIStatus(sensorData?.no2 || 0), 
      percentage: calculatePercentage(sensorData?.no2 || 0, 200) 
    },
    { 
      name: 'O3', 
      value: sensorData?.o3 || 0, 
      max: 180, 
      status: getAQIStatus(sensorData?.o3 || 0), 
      percentage: calculatePercentage(sensorData?.o3 || 0, 180) 
    },
    { 
      name: 'CO', 
      value: sensorData?.co || 0, 
      max: 10, 
      status: getAQIStatus(sensorData?.co || 0), 
      percentage: calculatePercentage(sensorData?.co || 0, 10) 
    },
    { 
      name: 'SO2', 
      value: sensorData?.so2 || 0, 
      max: 80, 
      status: getAQIStatus(sensorData?.so2 || 0), 
      percentage: calculatePercentage(sensorData?.so2 || 0, 80) 
    }
  ];

  const menuItems = [
    { name: 'Dashboard', icon: MdDashboard },
    { name: 'Analytics', icon: MdBarChart },
    { name: 'Notifications', icon: MdPeople },
    { name: 'Control', icon: IoRadioOutline },
    { name: 'History', icon: MdCalendarToday },
    { name: 'Map', icon: IoMapOutline },
    { name: 'Info', icon: IoInformationCircleOutline },
    { name: 'Settings', icon: IoSettingsOutline }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900 text-white">
      {/* Sidebar */}
      <div
        className={`w-72 p-6 flex flex-col fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:static md:translate-x-0 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#4a3f9e' }}
      >
        {/* Logo & Brand */}
        <div className="mb-10 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/10">
              <img
                src="/AirPulse1.jpg"
                alt="AirPulse logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">AirPulse</h2>
              <p className="text-xs text-white/60 font-medium">Air Quality Monitor</p>
            </div>
          </div>
          <div className="h-px bg-white/10 mt-4"></div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  console.log('menu click ->', item.name);
                  setActiveTab(item.name);
                }}
                className={`group w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 ${
                  activeTab === item.name
                    ? 'bg-white text-[#4a3f9e] shadow-lg font-semibold'
                    : 'text-white/75 hover:bg-white/10 hover:text-white hover:translate-x-1'
                }`}
              >
                <Icon size={20} className={activeTab === item.name ? '' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-white/10 my-4"></div>

        {/* User Profile */}
        <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <IoPersonOutline size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-white/60">admin@airpulse.com</p>
            </div>
          </div>
        </div>

       </div>

      {/* mobile overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden" />}

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white">
        {/* mobile menu button */}
        <div className="p-4 md:hidden bg-white">
          <button onClick={() => setSidebarOpen(v => !v)} className="p-2 rounded-md bg-slate-200 text-slate-800">
            <IoMenuOutline size={24} />
          </button>
        </div>

        {activeTab === 'History' ? (
          <HistoricalData />
        ) : activeTab === 'Notifications' ? (
          <Notifications />
        ) : activeTab === 'Analytics' ? (
          <Analytics />
        ) : activeTab === 'Map' ? (
          <Map />
        ) : activeTab === 'Info' ? (
          <InfoPage />
        ) : activeTab === 'Settings' ? (
          <Settings />
        ) : activeTab === 'Control' ? (
          <APITest />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-3 bg-white border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 mb-0.5">Overview</h1>
                  <h2 className="text-xs font-medium text-slate-600">Welcome to <span className="text-[#4a3f9e] font-bold">AirPulse</span></h2>
                </div>
                {/* Relay Status Indicator */}
                {sensorData && (
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    sensorData.relayStatus === 'ON' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      sensorData.relayStatus === 'ON' ? 'bg-green-500' : 'bg-slate-400'
                    }`}></div>
                    Relay: {sensorData.relayStatus || 'Unknown'}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab('Notifications')} className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#4a3f9e] hover:text-white transition-all">
                  <IoNotificationsOutline size={18} />
                </button>
                <button onClick={() => setActiveTab('Analytics')} className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#4a3f9e] hover:text-white transition-all">
                  <MdBarChart size={18} />
                </button>
                <button className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#4a3f9e] hover:text-white transition-all">
                  <IoPersonOutline size={18} />
                </button>
              </div>
            </div>

            <div className="px-8 py-8 pb-8 space-y-6 bg-slate-50">
              {/* Connection Status */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <IoRadioOutline className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-red-800 font-semibold">Connection Error</p>
                    <p className="text-red-600 text-sm">{error} - Using cached data</p>
                  </div>
                </div>
              )}
              {!error && !loading && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                  <IoCheckmarkCircleOutline className="w-5 h-5 text-green-500" />
                  <p className="text-green-800 text-sm font-medium">Connected to sensor API at {import.meta.env.VITE_API_SENSORS}</p>
                </div>
              )}
              
              {/* Analytical AI Chart */}
              <div className="bg-gradient-to-br from-[#4a3f9e]/5 to-purple-50 rounded-3xl p-8 border border-[#4a3f9e]/20 shadow-lg hover:shadow-xl transition-all">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[#4a3f9e]/10 flex items-center justify-center">
                        <IoPulseOutline className="w-5 h-5 text-[#4a3f9e]" />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900">Analytical AI</h3>
                    </div>
                    <p className="text-slate-600 text-sm flex items-center gap-2 ml-13">
                      <IoRadioOutline className="w-3 h-3 text-green-500 animate-pulse" />
                      October 2025 • Real-time monitoring
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">AQI Score</p>
                    <p className="text-2xl font-bold text-[#4a3f9e]">{loading ? '--' : sensorData?.aqi || '0'}</p>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={analyticalData}>
                      <XAxis 
                        dataKey="x" 
                        stroke="#94a3b8" 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={{ stroke: '#cbd5e1' }}
                        domain={[0, 60]}
                        ticks={[0, 10, 20, 30, 40, 50, 60]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="#4a3f9e" 
                        strokeWidth={3}
                        dot={{ fill: '#4a3f9e', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#4a3f9e', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weather Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all">
                  <h4 className="text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wide">Temperature</h4>
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                      <IoThermometerOutline className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 text-4xl font-bold">{loading ? '--' : sensorData?.temperature?.toFixed(1) || '0'}°</span>
                      <span className="text-slate-500 text-xl ml-1">C</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all">
                  <h4 className="text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wide">Wind Speed</h4>
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                      <WiStrongWind className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 text-4xl font-bold">35</span>
                      <span className="text-slate-500 text-xl ml-1">km/h</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all">
                  <h4 className="text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wide">Humidity</h4>
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <IoWaterOutline className="w-8 h-8 text-cyan-600" />
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 text-4xl font-bold">{loading ? '--' : sensorData?.humidity?.toFixed(0) || '0'}</span>
                      <span className="text-slate-500 text-xl ml-1">%</span>
                    </div>
                  </div>
                </div>
                {/* Gas Sensor card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all">
                  <h4 className="text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wide">Gas Sensor</h4>
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                      <MdAir className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 text-4xl font-bold">{loading ? '--' : sensorData?.gas || '0'}</span>
                      <span className="text-slate-500 text-xl ml-1">ppm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wind Speed and Lightning Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all">
                  <h4 className="text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wide">Wind Speed</h4>
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                      <WiStrongWind className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 text-4xl font-bold">35</span>
                      <span className="text-slate-500 text-xl ml-1">km/h</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all">
                  <h4 className="text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wide">Lightning</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-yellow-100 ring-2 ring-yellow-200">
                      <IoFlashOutline className="w-7 h-7 text-yellow-600 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-slate-900 text-xl font-bold">Storm</div>
                      <div className="text-slate-500 text-sm">40% • Moderate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pollutant Levels */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#4a3f9e]/10 flex items-center justify-center">
                    <MdAir className="w-6 h-6 text-[#4a3f9e]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900">Pollutant Levels</h3>
                    <p className="text-slate-500 text-sm">Real-time air quality monitoring</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pollutants.map((pollutant) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'Good':
                          return 'bg-green-100 text-green-800 border border-green-200';
                        case 'Moderate':
                          return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
                        case 'Unhealthy for Sensitive Groups':
                          return 'bg-orange-100 text-orange-800 border border-orange-200';
                        case 'Unhealthy':
                          return 'bg-red-100 text-red-800 border border-red-200';
                        case 'Very Unhealthy':
                          return 'bg-purple-100 text-purple-800 border border-purple-200';
                        case 'Hazardous':
                          return 'bg-red-900 text-white border border-red-900';
                        default:
                          return 'bg-slate-100 text-slate-700 border border-slate-200';
                      }
                    };

                    const getBarColor = (status: string) => {
                      switch (status) {
                        case 'Good':
                          return 'bg-gradient-to-r from-green-500 to-emerald-500';
                        case 'Moderate':
                          return 'bg-gradient-to-r from-yellow-500 to-amber-500';
                        case 'Unhealthy for Sensitive Groups':
                          return 'bg-gradient-to-r from-orange-500 to-orange-600';
                        case 'Unhealthy':
                          return 'bg-gradient-to-r from-red-500 to-red-600';
                        case 'Very Unhealthy':
                          return 'bg-gradient-to-r from-purple-500 to-purple-700';
                        case 'Hazardous':
                          return 'bg-gradient-to-r from-red-700 to-red-900';
                        default:
                          return 'bg-gradient-to-r from-slate-400 to-slate-500';
                      }
                    };

                    // Determine unit based on pollutant
                    const getUnit = (name: string) => {
                      if (name === 'PM2.5' || name === 'PM10') return 'µg/m³';
                      if (name === 'CO') return 'ppm';
                      return 'ppb';
                    };

                    return (
                      <div key={pollutant.name} className="space-y-3 p-5 rounded-xl bg-white border border-slate-200 hover:border-[#4a3f9e]/50 hover:shadow-lg transition-all">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-lg text-slate-900">{pollutant.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {loading ? 'Loading...' : `${pollutant.value.toFixed(1)} ${getUnit(pollutant.name)}`}
                            </div>
                          </div>
                          <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusColor(pollutant.status)}`}>
                            {pollutant.status}
                          </div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300 shadow-inner">
                          <div 
                            className={`h-full transition-all duration-700 ease-out ${getBarColor(pollutant.status)}`}
                            style={{ width: `${Math.min(100, pollutant.percentage)}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 font-medium">
                            Max: {pollutant.max} {getUnit(pollutant.name)}
                          </span>
                          <span className={`font-bold ${
                            pollutant.percentage > 100 ? 'text-red-600' : 
                            pollutant.percentage > 80 ? 'text-orange-600' : 
                            pollutant.percentage > 50 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {pollutant.percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:border-green-300 transition-all shadow-md">
                  <p className="text-green-700 text-sm font-semibold mb-3 uppercase tracking-wide">Last 24h Average</p>
                  <p className="text-5xl font-bold text-green-900 mb-2">Good</p>
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <IoCheckmarkCircleOutline className="w-4 h-4 animate-pulse" />
                    <span>Healthy air quality</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition-all shadow-md">
                  <p className="text-blue-700 text-sm font-semibold mb-3 uppercase tracking-wide">Active Stations</p>
                  <p className="text-5xl font-bold text-blue-900 mb-2">8</p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <IoRadioOutline className="w-4 h-4 animate-pulse" />
                    <span>All systems online</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#4a3f9e]/40 transition-all shadow-md">
                  <p className="text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wide">Trend (6h)</p>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                      <IoTrendingUpOutline className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">+12%</p>
                      <p className="text-slate-500 text-sm">Improving</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-yellow-300 transition-all shadow-md">
                  <p className="text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wide">Active Alerts</p>
                  <p className="text-5xl font-bold text-slate-900 mb-2">2</p>
                  <div className="flex items-center gap-2 text-yellow-600 text-sm">
                    <IoNotificationsOutline className="w-4 h-4 animate-pulse" />
                    <span>Requires attention</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AirPulseDashboard;