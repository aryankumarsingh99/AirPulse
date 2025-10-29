# AirPulse - Data Distribution Across All Graphs

## Overview

All graphs and visualizations now use **real-time sensor data** from your backend API. The system automatically calculates and distributes pollutant values based on the actual sensor readings.

## Backend Data Input

Your API provides:
```json
{
  "success": true,
  "data": {
    "Gas": 4095,           // MQ-135 gas sensor (0-4095 range)
    "Humidity": 68.3,      // Humidity percentage
    "RelayStatus": "OFF",  // Relay state
    "Temperature": 29.3    // Temperature in Celsius
  }
}
```

## Data Transformation Algorithm

### AQI Calculation
```typescript
// Normalize gas sensor to AQI scale (0-500)
gasAQI = Math.min(500, (Gas / 4095) * 500)

// For Gas = 4095:
gasAQI = 500 (Hazardous level)
```

### Pollutant Calculations
Based on the gas sensor AQI and environmental factors:

```typescript
// PM2.5 (Particulate Matter 2.5µm)
pm25 = (gasAQI / 500) * 250
// For gasAQI=500: pm25 = 250 µg/m³

// PM10 (Particulate Matter 10µm)
pm10 = pm25 * 1.6
// For pm25=250: pm10 = 400 µg/m³

// Temperature Factor (affects pollutant concentration)
tempFactor = Temperature / 30
// For 29.3°C: tempFactor = 0.977

// Humidity Factor (affects pollutant dispersion)
humidityFactor = Humidity / 100
// For 68.3%: humidityFactor = 0.683

// NO2 (Nitrogen Dioxide) - increases with temperature
no2 = (gasAQI / 500) * 100 * (1 + tempFactor * 0.3)
// For gasAQI=500, temp=29.3: no2 = 129.3 ppb

// O3 (Ozone) - decreases with humidity
o3 = (gasAQI / 500) * 120 * (1 - humidityFactor * 0.2)
// For gasAQI=500, humidity=68.3: o3 = 103.6 ppb

// CO (Carbon Monoxide) - increases with temperature
co = (gasAQI / 500) * 15 * (1 + tempFactor * 0.4)
// For gasAQI=500, temp=29.3: co = 20.9 ppm

// SO2 (Sulfur Dioxide) - slight humidity correlation
so2 = (gasAQI / 500) * 80 * (1 + humidityFactor * 0.1)
// For gasAQI=500, humidity=68.3: so2 = 85.5 ppb
```

## Data Distribution by Page

### 1. Dashboard (`src/Home/Dashboard.tsx`)

#### Real-time AQI Chart
- **X-axis**: Time progression (incremental)
- **Y-axis**: AQI value (0-500)
- **Data Points**: Last 20 readings collected every 30 seconds
- **Calculation**: Uses `gasAQI` from sensor

#### Pollutant Level Cards (6 cards)
| Pollutant | Value | Max | Unit | Status |
|-----------|-------|-----|------|--------|
| PM2.5 | 250.0 | 60 | µg/m³ | Hazardous |
| PM10 | 400.0 | 100 | µg/m³ | Hazardous |
| NO2 | 129.3 | 200 | ppb | Unhealthy |
| O3 | 103.6 | 180 | ppb | Unhealthy |
| CO | 20.9 | 10 | ppm | Hazardous |
| SO2 | 85.5 | 80 | ppb | Hazardous |

#### Weather Cards (4 cards)
| Parameter | Value | Display |
|-----------|-------|---------|
| Temperature | 29.3°C | Real sensor data |
| Humidity | 68.3% | Real sensor data |
| Gas Sensor | 4095 ppm | Real sensor data |
| Wind Speed | 35 km/h | Static (no sensor) |

---

### 2. Analytics (`src/Home/Analytics.tsx`)

#### Single Pollutant Trend Chart
- **X-axis**: Time labels (HH:MM format)
- **Y-axis**: Pollutant concentration
- **Data**: Real-time values collected every 30 seconds
- **Duration**: User-selectable (6h, 12h, 24h, 72h)

#### Multi-Pollutant Bar Chart (NEW)
Displays all 7 pollutants side-by-side:
```
PM2.5: 250.0 µg/m³
PM10:  400.0 µg/m³
NO2:   129.3 ppb
O3:    103.6 ppb
CO:    20.9 ppm
SO2:   85.5 ppb
Gas:   4095 ppm
```

#### Pollutant Grid (NEW)
Interactive cards for each pollutant showing:
- Current value
- Unit of measurement
- Click to view detailed trend

#### Statistics Cards
- **Average**: Mean of collected readings
- **Maximum**: Peak value in time window
- **Minimum**: Lowest value in time window

---

### 3. Historical Data (`src/Home/Historical Data.tsx`)

#### All Pollutants Historical Chart (NEW)
Multi-line chart showing 4 pollutants over time:
- **PM2.5 Line** (Purple): `#4a3f9e`
- **PM10 Line** (Green): `#10b981`
- **NO2 Line** (Orange): `#f59e0b`
- **Gas Line** (Red): `#ef4444`

**Data Points**: All historical readings from the selected period

#### Environmental Parameters Chart (NEW)
Dual-line chart for environmental conditions:
- **Temperature Line** (Red): `#ef4444`
- **Humidity Line** (Cyan): `#06b6d4`

**Updates**: Every 60 seconds

#### Data Table
Comprehensive table showing all measurements:
| Column | Data Source | Format |
|--------|-------------|--------|
| Timestamp | API call time | Locale string |
| PM2.5 | Calculated | 1 decimal |
| PM10 | Calculated | 1 decimal |
| NO2 | Calculated | 1 decimal |
| Gas | Direct sensor | Integer |
| Temp | Direct sensor | 1 decimal |
| Humidity | Direct sensor | Integer |

---

### 4. Map (`src/Home/Map.tsx`)

#### Station Markers
Each station shows real-time data in popups:
```
Node_01 - Gandhi Maidan
├─ AQI: 500 (color-coded)
├─ PM2.5: 250.0 µg/m³
├─ PM10: 400.0 µg/m³
├─ NO₂: 129.3 ppb
├─ Temp: 29.3°C
├─ Humidity: 68.3%
├─ Gas: 4095 ppm
└─ Relay: OFF
```

#### Station List Cards
Shows all sensor data with visual indicators:
- Temperature, Humidity, Gas with values
- Relay status (color-coded: green=ON, gray=OFF)

#### Heatmap Circles
- **Radius**: 1000m
- **Color**: Based on AQI value
- **Opacity**: 0.2 (semi-transparent)

---

## Real-time Update Intervals

| Page | Update Frequency | Method |
|------|-----------------|--------|
| Dashboard | 30 seconds | `setInterval(loadSensorData, 30000)` |
| Analytics | 30 seconds | `setInterval(loadSensorData, 30000)` |
| Map | 30 seconds | `setInterval(loadSensorData, 30000)` |
| Historical | 60 seconds | `setInterval(loadData, 60000)` |

## Data Flow Diagram

```
Backend API (http://10.96.203.117:3000/sensors)
           ↓
   [APIResponse] Raw JSON
           ↓
   fetchSensorData() - Transformation
           ↓
   [SensorData] Calculated Values
           ↓
    ┌──────┴──────┬──────────┬─────────┐
    ↓             ↓          ↓         ↓
Dashboard    Analytics    Map    Historical
    ↓             ↓          ↓         ↓
Charts       Charts      Markers   Charts
Cards        Tables      Popups    Tables
```

## Coordinate System Examples

### Dashboard AQI Chart
```typescript
// Time-series coordinates
[
  { x: 0, y: 500 },   // Initial reading
  { x: 1, y: 485 },   // 30s later
  { x: 2, y: 492 },   // 60s later
  { x: 3, y: 500 },   // 90s later
  ...
  { x: 19, y: 498 }   // Latest (10 minutes)
]
```

### Analytics Trend Chart
```typescript
// Timestamp coordinates
[
  { ts: "10:30", value: 250.0 },  // PM2.5 reading
  { ts: "10:31", value: 248.5 },
  { ts: "10:32", value: 251.2 },
  ...
]
```

### Historical Multi-line Chart
```typescript
// Multi-pollutant coordinates
[
  {
    time: "23/10/2025, 14:30:00",
    pm25: 250.0,
    pm10: 400.0,
    no2: 129.3,
    gas: 4095
  },
  {
    time: "23/10/2025, 14:31:00",
    pm25: 248.5,
    pm10: 397.6,
    no2: 128.1,
    gas: 4080
  },
  ...
]
```

### Map Station Coordinates
```typescript
// Geographic + data coordinates
{
  id: 'Node_01',
  lat: 25.5941,      // Geographic latitude
  lon: 85.1376,      // Geographic longitude
  pm25: 250.0,       // Pollutant data
  pm10: 400.0,
  aqi: 500,
  temperature: 29.3,
  humidity: 68.3,
  gas: 4095,
  relayStatus: 'OFF'
}
```

## Color Coding by AQI Level

| AQI Range | Status | Color | Hex Code |
|-----------|--------|-------|----------|
| 0-50 | Good | Green | `#10b981` |
| 51-100 | Moderate | Yellow | `#f59e0b` |
| 101-150 | Unhealthy (Sensitive) | Orange | `#f97316` |
| 151-200 | Unhealthy | Red | `#ef4444` |
| 201-300 | Very Unhealthy | Purple | `#9333ea` |
| 301-500 | Hazardous | Maroon | `#7f1d1d` |

**Current Status**: With Gas=4095, AQI=500 → **Hazardous** (Maroon)

## Chart Libraries Used

### Recharts Components
- **LineChart**: Trend visualization (Dashboard, Analytics, Historical)
- **BarChart**: Pollutant comparison (Analytics)
- **ResponsiveContainer**: Adaptive sizing
- **CartesianGrid**: Grid lines
- **XAxis / YAxis**: Axis configuration
- **Tooltip**: Hover information
- **Legend**: Chart legend

### Leaflet Components
- **MapContainer**: Base map (Map page)
- **TileLayer**: Map tiles (OpenStreetMap/Satellite)
- **Marker**: Station markers
- **Popup**: Information popups
- **Circle**: Heatmap visualization

## Testing the Distribution

### 1. Dashboard Test
```
Expected: AQI chart shows value ~500
Expected: PM2.5 card shows "250.0 µg/m³"
Expected: Gas sensor card shows "4095 ppm"
Expected: All pollutant bars near 100%
```

### 2. Analytics Test
```
Expected: Bar chart shows all 7 pollutants
Expected: PM2.5 trend chart shows ~250 value
Expected: Gas pollutant option available
Expected: Values update every 30 seconds
```

### 3. Historical Test
```
Expected: Multi-line chart with 4 pollutants
Expected: Environmental chart with Temp & Humidity
Expected: Table shows all columns with data
Expected: Data accumulates over time
```

### 4. Map Test
```
Expected: Node_01 popup shows all 7 data points
Expected: Station card shows Temp, Humidity, Gas
Expected: Relay status shows "OFF" in gray
Expected: Marker color is Maroon (Hazardous)
```

## Calibration Notes

### If Values Seem Incorrect:

**Adjust AQI Calculation**:
```typescript
// Current: gasAQI = (Gas / 4095) * 500
// If sensor max is different:
gasAQI = (Gas / YOUR_SENSOR_MAX) * 500
```

**Adjust Pollutant Formulas**:
```typescript
// Increase/decrease multipliers based on your sensor calibration
pm25 = (gasAQI / 500) * YOUR_PM25_MAX
pm10 = pm25 * YOUR_PM10_RATIO
```

**Adjust Environmental Factors**:
```typescript
// Modify temperature/humidity influence
tempFactor = Temperature / YOUR_BASE_TEMP
humidityFactor = Humidity / 100
```

## Summary

✅ **All graphs now use real sensor data**
✅ **Pollutants calculated from Gas sensor**
✅ **Environmental factors (Temp/Humidity) included**
✅ **Real-time updates every 30-60 seconds**
✅ **Multi-pollutant visualizations added**
✅ **Color-coded by AQI level**
✅ **Coordinates distributed across all pages**

---

**Data Distribution Complete**: All visualizations are now connected to your backend API at `http://10.96.203.117:3000/sensors` and display real-time calculated values across Dashboard, Analytics, Historical Data, and Map pages.
