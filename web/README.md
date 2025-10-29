# AirPulse - Real-Time Air Quality Monitoring System 🌍

A comprehensive air quality monitoring dashboard for tracking environmental parameters across Rourkela, Odisha. This advanced IoT-based solution provides real-time monitoring of air pollutants including PM2.5, PM10, NO2, O3, CO, SO2, along with environmental factors like temperature and humidity. Built with modern web technologies, AirPulse offers intuitive visualizations, geographic mapping of 6 monitoring stations, automated alert systems, and remote device control capabilities. Perfect for smart city initiatives, environmental research, and industrial air quality management in steel manufacturing regions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Features

- **Real-Time Monitoring**: Live tracking of PM2.5, PM10, NO2, O3, CO, SO2, Gas, Temperature, Humidity
- **Interactive Dashboard**: Color-coded AQI indicators (Good → Hazardous)
- **Analytics**: Multi-pollutant visualization with trend analysis
- **Map View**: 6 monitoring stations across Rourkela with Leaflet integration
- **Smart Alerts**: Automated notifications for critical pollution levels
- **Relay Control**: Remote device management via API
- **Historical Data**: Long-term trend analysis with 60s refresh

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Purple theme #4a3f9e)
- **Charts**: Recharts
- **Maps**: Leaflet 1.9.4 + React-Leaflet 5.0.0
- **Icons**: React Icons (io5, md, wi)

## 🌐 API Configuration

Backend: `http://10.96.203.117:3000`

**Endpoints**:
- `GET /sensors` - Fetch sensor data (Gas, Temperature, Humidity, RelayStatus)
- `POST /relay/on` - Turn relay ON
- `POST /relay/off` - Turn relay OFF

**Response Format**:
```json
{
  "success": true,
  "data": {
    "Gas": 4095,
    "Humidity": 68.3,
    "Temperature": 29.3,
    "RelayStatus": "OFF"
  }
}
```

## 📍 Monitoring Stations

1. **Steel Plant** (22.2604° N, 84.8536° E)
2. **Civil Township** (22.2497° N, 84.8821° E)
3. **Sector 19** (22.2328° N, 84.8645° E)
4. **Udit Nagar** (22.2742° N, 84.8298° E)
5. **Panposh** (22.2156° N, 84.8614° E)
6. **Bisra** (22.2891° N, 84.8125° E)

## 📊 Data Calculations

Pollutants calculated from Gas sensor (4095 ppm) + environmental factors:
- **PM2.5 & PM10**: Gas-based AQI with humidity factor
- **NO2, O3, SO2**: Calculated using temperature/humidity correlations
- **CO**: Derived from gas concentration

## 🎨 Pages

- **Dashboard**: Main overview with AQI chart & pollutant cards
- **Analytics**: Multi-pollutant trends & bar charts (30s refresh)
- **Notifications**: Real-time alerts with severity levels
- **Control**: API testing & relay control interface
- **History**: Long-term data with comprehensive charts (60s refresh)
- **Map**: Interactive station map with real-time data (30s refresh)
- **Info**: System information & documentation
- **Settings**: User preferences & configuration

## 🔔 Alert Thresholds

- **PM2.5**: >150 µg/m³ (Hazardous)
- **Gas**: >3000 ppm (Critical)
- **Temperature**: >35°C (Extreme)

## 📦 Project Structure

```
web/
├── src/
│   ├── Home/
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Analytics.tsx       # Pollutant analysis
│   │   ├── Notifications.tsx   # Alert system
│   │   ├── Map.tsx             # Interactive map
│   │   ├── Historical Data.tsx # Trend charts
│   │   ├── APITest.tsx         # Control panel
│   │   ├── Settings.tsx        # Configuration
│   │   └── Info Page.tsx       # Information
│   ├── utils/
│   │   └── api.ts              # API utilities
│   └── types/
│       └── recharts.d.ts       # Type definitions
├── .env                        # API configuration
└── package.json
```

## 🔐 Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://10.96.203.117:3000
VITE_SENSORS_ENDPOINT=/sensors
VITE_RELAY_ON_ENDPOINT=/relay/on
VITE_RELAY_OFF_ENDPOINT=/relay/off
```

## 🎯 Key Dependencies

```json
{
  "react": "^18.3.1",
  "recharts": "^2.15.0",
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "tailwindcss": "^3.4.17"
}
```

## 📈 Auto-Refresh Intervals

- Dashboard: 30 seconds
- Analytics: 30 seconds
- Map: 30 seconds
- Historical Data: 60 seconds
- Notifications: 120 seconds

## 🌟 Highlights

- **Professional UI**: Modern purple-themed design
- **Responsive**: Works on all screen sizes
- **Type-Safe**: Full TypeScript support
- **Real-Time**: Automatic data polling
- **Modular**: Component-based architecture

---

**Location**: Rourkela, Odisha  
**Built with**: React + Vite + TypeScript  
**License**: MIT
