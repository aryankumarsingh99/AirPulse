import React, { useState, useEffect } from 'react';
import { fetchSensorData, turnRelayOn, turnRelayOff, SensorData } from '../utils/api';
import { CheckCircle, XCircle, RefreshCw, Power, Zap } from 'lucide-react';

export default function APITest() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relayStatus, setRelayStatus] = useState<'on' | 'off' | 'unknown'>('unknown');
  const [relayLoading, setRelayLoading] = useState(false);

  const testSensorAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSensorData();
      setSensorData(data);
      console.log('Sensor data:', data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sensor data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRelayOn = async () => {
    setRelayLoading(true);
    try {
      const result = await turnRelayOn();
      setRelayStatus('on');
      console.log('Relay ON result:', result);
      alert('Relay turned ON successfully!');
    } catch (err: any) {
      alert('Failed to turn relay ON: ' + err.message);
      console.error('Error:', err);
    } finally {
      setRelayLoading(false);
    }
  };

  const handleRelayOff = async () => {
    setRelayLoading(true);
    try {
      const result = await turnRelayOff();
      setRelayStatus('off');
      console.log('Relay OFF result:', result);
      alert('Relay turned OFF successfully!');
    } catch (err: any) {
      alert('Failed to turn relay OFF: ' + err.message);
      console.error('Error:', err);
    } finally {
      setRelayLoading(false);
    }
  };

  useEffect(() => {
    testSensorAPI();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">API Connection Test</h1>
        <p className="text-slate-600 mb-8">Test your backend API connectivity and relay controls</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sensor API Test */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Sensor Data API</h2>
              <button
                onClick={testSensorAPI}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#4a3f9e] text-white rounded-lg hover:bg-[#4a3f9e]/90 transition-all disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-slate-500 font-mono">
                {import.meta.env.VITE_API_SENSORS}
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <RefreshCw size={20} className="text-blue-600 animate-spin" />
                <span className="text-blue-800">Fetching sensor data...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle size={20} className="text-red-600" />
                <div>
                  <p className="text-red-800 font-semibold">Connection Failed</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && sensorData && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="text-green-800 font-semibold">Connected Successfully!</span>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-bold text-slate-800 mb-3">Sensor Readings:</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Temperature:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        {sensorData.temperature?.toFixed(1) || 'N/A'}°C
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Humidity:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        {sensorData.humidity?.toFixed(0) || 'N/A'}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">PM2.5:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        {sensorData.pm25?.toFixed(1) || 'N/A'} µg/m³
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">PM10:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        {sensorData.pm10?.toFixed(1) || 'N/A'} µg/m³
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">NO2:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        {sensorData.no2?.toFixed(1) || 'N/A'} ppb
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">O3:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        {sensorData.o3?.toFixed(1) || 'N/A'} ppb
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">CO:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        {sensorData.co?.toFixed(1) || 'N/A'} ppm
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">SO2:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        {sensorData.so2?.toFixed(1) || 'N/A'} ppb
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">AQI:</span>
                      <span className="ml-2 font-bold text-[#4a3f9e] text-lg">
                        {sensorData.aqi || 'N/A'}
                      </span>
                      <span className="ml-2 text-slate-600">
                        ({sensorData.status || 'N/A'})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-2">Raw JSON Response:</p>
                  <pre className="text-xs text-slate-700 overflow-x-auto bg-white p-3 rounded border border-slate-200">
                    {JSON.stringify(sensorData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Relay Control */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Relay Control</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                relayStatus === 'on' ? 'bg-green-100 text-green-800' :
                relayStatus === 'off' ? 'bg-slate-100 text-slate-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {relayStatus === 'on' ? 'ON' : relayStatus === 'off' ? 'OFF' : 'Unknown'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">ON Endpoint:</p>
                <p className="text-xs text-slate-700 font-mono mb-3">
                  {import.meta.env.VITE_API_RELAY_ON}
                </p>
                <p className="text-xs text-slate-500 mb-1">OFF Endpoint:</p>
                <p className="text-xs text-slate-700 font-mono">
                  {import.meta.env.VITE_API_RELAY_OFF}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleRelayOn}
                  disabled={relayLoading}
                  className="flex flex-col items-center gap-3 p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all disabled:opacity-50 group"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Power size={32} className="text-white" />
                  </div>
                  <span className="font-bold text-green-800">Turn ON</span>
                </button>

                <button
                  onClick={handleRelayOff}
                  disabled={relayLoading}
                  className="flex flex-col items-center gap-3 p-6 bg-slate-50 border-2 border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all disabled:opacity-50 group"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Power size={32} className="text-white" />
                  </div>
                  <span className="font-bold text-slate-800">Turn OFF</span>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-semibold text-sm">Control Your Devices</p>
                    <p className="text-blue-600 text-xs mt-1">
                      Use these buttons to control connected relays for air purifiers, fans, or other devices.
                      The relay state will be updated when you click the buttons.
                    </p>
                  </div>
                </div>
              </div>

              {relayLoading && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <RefreshCw size={20} className="text-yellow-600 animate-spin" />
                  <span className="text-yellow-800">Sending relay command...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Backend Setup Instructions</h3>
          <div className="space-y-4 text-sm text-slate-700">
            <p>Your backend server should implement the following endpoints:</p>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-mono text-xs text-slate-600 mb-2">GET /sensors</p>
              <p className="text-xs text-slate-600">Returns JSON with sensor readings</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-mono text-xs text-slate-600 mb-2">GET /relay/on</p>
              <p className="text-xs text-slate-600">Turns relay ON, returns success status</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-mono text-xs text-slate-600 mb-2">GET /relay/off</p>
              <p className="text-xs text-slate-600">Turns relay OFF, returns success status</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold text-sm mb-2">⚠️ CORS Configuration Required</p>
              <p className="text-yellow-700 text-xs">
                Make sure your backend allows requests from this frontend by enabling CORS with appropriate headers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
