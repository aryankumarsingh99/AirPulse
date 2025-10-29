// API utility functions for AirPulse

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://10.96.203.117:3000/';
const API_SENSORS = import.meta.env.VITE_API_SENSORS || 'http://10.96.203.117:3000/sensors';
const API_RELAY_ON = import.meta.env.VITE_API_RELAY_ON || 'http://10.96.203.117:3000/relay/on';
const API_RELAY_OFF = import.meta.env.VITE_API_RELAY_OFF || 'http://10.96.203.117:3000/relay/off';

export interface SensorData {
  timestamp?: string;
  temperature?: number;
  humidity?: number;
  gas?: number;
  relayStatus?: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  co?: number;
  so2?: number;
  aqi?: number;
  status?: string;
}

export interface APIResponse {
  success: boolean;
  data: {
    Gas: number;
    Humidity: number;
    RelayStatus: string;
    Temperature: number;
  };
}

/**
 * Fetch sensor data from the API
 */
export const fetchSensorData = async (): Promise<SensorData> => {
  try {
    const response = await fetch(API_SENSORS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: APIResponse = await response.json();
    
    // Calculate AQI from gas sensor (MQ-135 sensor typical range: 0-4095)
    // Normalize to AQI scale (0-500)
    const gasAQI = Math.min(500, Math.round((apiResponse.data.Gas / 4095) * 500));
    
    // Calculate derived pollutant values based on gas sensor and environmental data
    // These are estimates - adjust based on your actual sensor calibration
    const pm25 = Math.round((gasAQI / 500) * 250 * 10) / 10; // 0-250 µg/m³
    const pm10 = Math.round(pm25 * 1.6 * 10) / 10; // PM10 typically 1.6x PM2.5
    
    // Calculate other pollutants based on AQI and temperature/humidity correlation
    const tempFactor = apiResponse.data.Temperature / 30; // Normalize to 0-1 range
    const humidityFactor = apiResponse.data.Humidity / 100; // Normalize to 0-1 range
    
    const no2 = Math.round((gasAQI / 500) * 100 * (1 + tempFactor * 0.3) * 10) / 10; // 0-100 ppb
    const o3 = Math.round((gasAQI / 500) * 120 * (1 - humidityFactor * 0.2) * 10) / 10; // 0-120 ppb
    const co = Math.round((gasAQI / 500) * 15 * (1 + tempFactor * 0.4) * 10) / 10; // 0-15 ppm
    const so2 = Math.round((gasAQI / 500) * 80 * (1 + humidityFactor * 0.1) * 10) / 10; // 0-80 ppb
    
    // Transform API response to SensorData format
    const sensorData: SensorData = {
      temperature: apiResponse.data.Temperature,
      humidity: apiResponse.data.Humidity,
      gas: apiResponse.data.Gas,
      relayStatus: apiResponse.data.RelayStatus,
      timestamp: new Date().toISOString(),
      // Calculated pollutant values
      pm25,
      pm10,
      no2,
      o3,
      co,
      so2,
      aqi: gasAQI,
      status: getAQIStatus(gasAQI)
    };
    
    return sensorData;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    throw error;
  }
};

/**
 * Turn relay ON
 */
export const turnRelayOn = async (): Promise<any> => {
  try {
    const response = await fetch(API_RELAY_ON, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error turning relay on:', error);
    throw error;
  }
};

/**
 * Turn relay OFF
 */
export const turnRelayOff = async (): Promise<any> => {
  try {
    const response = await fetch(API_RELAY_OFF, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error turning relay off:', error);
    throw error;
  }
};

/**
 * Calculate AQI status based on PM2.5 value
 */
export const getAQIStatus = (pm25: number): string => {
  if (pm25 <= 50) return 'Good';
  if (pm25 <= 100) return 'Moderate';
  if (pm25 <= 150) return 'Unhealthy for Sensitive Groups';
  if (pm25 <= 200) return 'Unhealthy';
  if (pm25 <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

/**
 * Get color based on AQI status
 */
export const getAQIColor = (status: string): string => {
  switch (status) {
    case 'Good':
      return 'text-green-500';
    case 'Moderate':
      return 'text-yellow-500';
    case 'Unhealthy for Sensitive Groups':
      return 'text-orange-500';
    case 'Unhealthy':
      return 'text-red-500';
    case 'Very Unhealthy':
      return 'text-purple-500';
    case 'Hazardous':
      return 'text-red-800';
    default:
      return 'text-gray-500';
  }
};

/**
 * Calculate percentage for pollutant display (0-100%)
 */
export const calculatePercentage = (value: number, max: number): number => {
  return Math.min(100, Math.round((value / max) * 100));
};
