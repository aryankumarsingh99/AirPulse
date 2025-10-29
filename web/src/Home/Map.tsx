import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Search, Layers, MapPin, Navigation, Filter, Info, X, RefreshCw } from 'lucide-react';
import { fetchSensorData, SensorData, getAQIStatus } from '../utils/api';

// Fix Leaflet default marker icon issue with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  pm25: number;
  pm10: number;
  no2: number;
  aqi: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  lastUpdate: string;
  temperature?: number;
  humidity?: number;
  gas?: number;
  relayStatus?: string;
};

// Sample station data (replace with real API data)
const SAMPLE_STATIONS: Station[] = [
  {
    id: 'Node_01',
    name: 'Rourkela - Steel Plant',
    lat: 22.2604,
    lon: 84.8536,
    pm25: 45,
    pm10: 75,
    no2: 32,
    aqi: 95,
    status: 'Moderate',
    lastUpdate: '2 mins ago'
  },
  {
    id: 'Node_02',
    name: 'Rourkela - Civil Township',
    lat: 22.2497,
    lon: 84.8821,
    pm25: 125,
    pm10: 185,
    no2: 68,
    aqi: 178,
    status: 'Unhealthy',
    lastUpdate: '5 mins ago'
  },
  {
    id: 'Node_03',
    name: 'Rourkela - Sector 19',
    lat: 22.2328,
    lon: 84.8645,
    pm25: 28,
    pm10: 52,
    no2: 18,
    aqi: 65,
    status: 'Good',
    lastUpdate: '1 min ago'
  },
  {
    id: 'Node_04',
    name: 'Rourkela - Udit Nagar',
    lat: 22.2742,
    lon: 84.8298,
    pm25: 89,
    pm10: 142,
    no2: 45,
    aqi: 142,
    status: 'Unhealthy',
    lastUpdate: '3 mins ago'
  },
  {
    id: 'Node_05',
    name: 'Rourkela - Panposh',
    lat: 22.2156,
    lon: 84.8614,
    pm25: 52,
    pm10: 88,
    no2: 28,
    aqi: 108,
    status: 'Moderate',
    lastUpdate: '7 mins ago'
  },
  {
    id: 'Node_06',
    name: 'Rourkela - Bisra',
    lat: 22.2891,
    lon: 84.8125,
    pm25: 35,
    pm10: 62,
    no2: 22,
    aqi: 78,
    status: 'Good',
    lastUpdate: '4 mins ago'
  }
];

// Component to handle map recenter
function MapController({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Get color based on AQI level
const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#10b981'; // Good - Green
  if (aqi <= 100) return '#f59e0b'; // Moderate - Yellow
  if (aqi <= 150) return '#f97316'; // Unhealthy for sensitive - Orange
  if (aqi <= 200) return '#ef4444'; // Unhealthy - Red
  if (aqi <= 300) return '#9333ea'; // Very Unhealthy - Purple
  return '#7f1d1d'; // Hazardous - Maroon
};

// Get status text color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Good': return 'text-green-600 bg-green-50';
    case 'Moderate': return 'text-yellow-600 bg-yellow-50';
    case 'Unhealthy': return 'text-red-600 bg-red-50';
    case 'Hazardous': return 'text-purple-600 bg-purple-50';
    default: return 'text-slate-600 bg-slate-50';
  }
};

export default function MapPage() {
  const [stations, setStations] = useState<Station[]>(SAMPLE_STATIONS);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([22.2604, 84.8536]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [layerType, setLayerType] = useState<'street' | 'satellite'>('street');
  const [showFilters, setShowFilters] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch real-time sensor data and update stations
  useEffect(() => {
    const loadSensorData = async () => {
      try {
        setLoading(true);
        const data = await fetchSensorData();
        setSensorData(data);
        
        // Update the first station with real data (main sensor)
        if (data) {
          setStations(prev => {
            const updated = [...prev];
            updated[0] = {
              ...updated[0],
              pm25: data.pm25 || updated[0].pm25,
              pm10: data.pm10 || updated[0].pm10,
              no2: data.no2 || updated[0].no2,
              aqi: data.aqi || updated[0].aqi,
              status: getAQIStatus(data.pm25 || 0) as any,
              lastUpdate: 'Just now',
              temperature: data.temperature,
              humidity: data.humidity,
              gas: data.gas,
              relayStatus: data.relayStatus
            };
            return updated;
          });
        }
      } catch (err) {
        console.error('Error loading sensor data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSensorData();
    const interval = setInterval(loadSensorData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  // Filter stations based on search and status
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || station.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [stations, searchTerm, filterStatus]);

  // Get user's current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Focus on a specific station
  const focusStation = (station: Station) => {
    setMapCenter([station.lat, station.lon]);
    setSelectedStation(station);
  };

  // Calculate average AQI
  const avgAQI = useMemo(() => {
    const sum = stations.reduce((acc, s) => acc + s.aqi, 0);
    return Math.round(sum / stations.length);
  }, [stations]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Interactive Map</h1>
            <p className="text-sm text-slate-600">Real-time air quality monitoring stations</p>
          </div>
          
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <RefreshCw size={16} className="text-blue-600 animate-spin" />
                <span className="text-xs text-blue-700">Updating...</span>
              </div>
            )}
            {!loading && sensorData && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700">Live Data</span>
              </div>
            )}
            <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500">Active Stations</div>
              <div className="text-lg font-bold text-slate-900">{stations.length}</div>
            </div>
            <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500">Avg AQI</div>
              <div className="text-lg font-bold" style={{ color: getAQIColor(avgAQI) }}>{avgAQI}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar Controls */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          {/* Search */}
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e] text-slate-900"
              />
            </div>
          </div>

          {/* Map Controls */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <button
              onClick={handleCurrentLocation}
              className="w-full flex items-center gap-2 px-4 py-2 bg-[#4a3f9e] text-white rounded-lg hover:bg-[#3d3582] transition-all"
            >
              <Navigation size={16} />
              My Location
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-all"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} />
                Filters
              </span>
              {showFilters ? <X size={16} /> : <Filter size={16} />}
            </button>

            {showFilters && (
              <div className="space-y-2 pl-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    checked={filterStatus === 'all'}
                    onChange={() => setFilterStatus('all')}
                    className="text-[#4a3f9e]"
                  />
                  All Stations
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    checked={filterStatus === 'Good'}
                    onChange={() => setFilterStatus('Good')}
                  />
                  Good
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    checked={filterStatus === 'Moderate'}
                    onChange={() => setFilterStatus('Moderate')}
                  />
                  Moderate
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    checked={filterStatus === 'Unhealthy'}
                    onChange={() => setFilterStatus('Unhealthy')}
                  />
                  Unhealthy
                </label>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Show Heatmap</span>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${showHeatmap ? 'bg-[#4a3f9e] text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {showHeatmap ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLayerType('street')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${layerType === 'street' ? 'bg-[#4a3f9e] text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                <Layers size={14} />
                Street
              </button>
              <button
                onClick={() => setLayerType('satellite')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${layerType === 'satellite' ? 'bg-[#4a3f9e] text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                <Layers size={14} />
                Satellite
              </button>
            </div>
          </div>

          {/* Stations List */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Stations ({filteredStations.length})
            </h3>
            <div className="space-y-2">
              {filteredStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => focusStation(station)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedStation?.id === station.id
                      ? 'border-[#4a3f9e] bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} style={{ color: getAQIColor(station.aqi) }} />
                        <span className="font-medium text-slate-900 text-sm">{station.name}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(station.status)}`}>
                          {station.status}
                        </span>
                        <span className="text-xs text-slate-500">{station.lastUpdate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: getAQIColor(station.aqi) }}>
                        {station.aqi}
                      </div>
                      <div className="text-xs text-slate-500">AQI</div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">PM2.5:</span>
                      <span className="ml-1 font-medium text-slate-700">{station.pm25}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">PM10:</span>
                      <span className="ml-1 font-medium text-slate-700">{station.pm10}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">NO₂:</span>
                      <span className="ml-1 font-medium text-slate-700">{station.no2}</span>
                    </div>
                  </div>
                  {/* Additional sensor data */}
                  {(station.temperature || station.humidity || station.gas || station.relayStatus) && (
                    <div className="mt-2 pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                      {station.temperature !== undefined && (
                        <div>
                          <span className="text-slate-500">Temp:</span>
                          <span className="ml-1 font-medium text-slate-700">{station.temperature.toFixed(1)}°C</span>
                        </div>
                      )}
                      {station.humidity !== undefined && (
                        <div>
                          <span className="text-slate-500">Humidity:</span>
                          <span className="ml-1 font-medium text-slate-700">{station.humidity.toFixed(0)}%</span>
                        </div>
                      )}
                      {station.gas !== undefined && (
                        <div>
                          <span className="text-slate-500">Gas:</span>
                          <span className="ml-1 font-medium text-slate-700">{station.gas} ppm</span>
                        </div>
                      )}
                      {station.relayStatus && (
                        <div>
                          <span className="text-slate-500">Relay:</span>
                          <span className={`ml-1 font-medium ${station.relayStatus === 'ON' ? 'text-green-600' : 'text-slate-600'}`}>
                            {station.relayStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <MapController center={mapCenter} />
            
            {/* Tile Layer - Street or Satellite */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                layerType === 'street'
                  ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              }
            />

            {/* Station Markers */}
            {filteredStations.map((station) => (
              <React.Fragment key={station.id}>
                <Marker
                  position={[station.lat, station.lon]}
                  eventHandlers={{
                    click: () => setSelectedStation(station),
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-slate-900 mb-2">{station.name}</h3>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs mb-2 ${getStatusColor(station.status)}`}>
                        {station.status}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">AQI:</span>
                          <span className="font-bold" style={{ color: getAQIColor(station.aqi) }}>
                            {station.aqi}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">PM2.5:</span>
                          <span className="font-medium text-slate-900">{station.pm25} µg/m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">PM10:</span>
                          <span className="font-medium text-slate-900">{station.pm10} µg/m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">NO₂:</span>
                          <span className="font-medium text-slate-900">{station.no2} µg/m³</span>
                        </div>
                        {/* Additional sensor data */}
                        {(station.temperature || station.humidity || station.gas || station.relayStatus) && (
                          <>
                            {station.temperature !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">Temperature:</span>
                                <span className="font-medium text-slate-900">{station.temperature.toFixed(1)}°C</span>
                              </div>
                            )}
                            {station.humidity !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">Humidity:</span>
                                <span className="font-medium text-slate-900">{station.humidity.toFixed(0)}%</span>
                              </div>
                            )}
                            {station.gas !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">Gas Sensor:</span>
                                <span className="font-medium text-slate-900">{station.gas} ppm</span>
                              </div>
                            )}
                            {station.relayStatus && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">Relay Status:</span>
                                <span className={`font-medium ${station.relayStatus === 'ON' ? 'text-green-600' : 'text-slate-600'}`}>
                                  {station.relayStatus}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <span className="text-xs text-slate-500">Updated: {station.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Heatmap circles */}
                {showHeatmap && (
                  <Circle
                    center={[station.lat, station.lon]}
                    radius={1000}
                    pathOptions={{
                      fillColor: getAQIColor(station.aqi),
                      fillOpacity: 0.2,
                      color: getAQIColor(station.aqi),
                      weight: 1,
                      opacity: 0.4,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} className="text-slate-600" />
              <span className="text-sm font-semibold text-slate-900">AQI Legend</span>
            </div>
            <div className="space-y-1">
              {[
                { label: 'Good (0-50)', color: '#10b981' },
                { label: 'Moderate (51-100)', color: '#f59e0b' },
                { label: 'Unhealthy (101-150)', color: '#f97316' },
                { label: 'Very Unhealthy (151-200)', color: '#ef4444' },
                { label: 'Hazardous (200+)', color: '#7f1d1d' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
