# AirPulse API Integration - Real-time Monitoring

## Overview
The AirPulse dashboard is now **fully connected** to your backend API running at `http://10.96.203.117:3000` with **real-time monitoring** across all pages and graphs.

## API Endpoints

### 1. Sensor Data - `/sensors`
**Method:** GET  
**URL:** `http://10.96.203.117:3000/sensors`  
**Description:** Fetches real-time sensor data including air quality metrics, temperature, and humidity.

**Expected Response Format:**
```json
{
  "timestamp": "2025-10-23T10:30:00Z",
  "temperature": 25.5,
  "humidity": 65,
  "pm25": 42,
  "pm10": 55,
  "no2": 35,
  "o3": 45,
  "co": 2.5,
  "so2": 15,
  "aqi": 85,
  "status": "Good"
}
```

### 2. Relay Control - ON - `/relay/on`
**Method:** GET  
**URL:** `http://10.96.203.117:3000/relay/on`  
**Description:** Turns the relay ON (e.g., for air purifier control)

### 3. Relay Control - OFF - `/relay/off`
**Method:** GET  
**URL:** `http://10.96.203.117:3000/relay/off`  
**Description:** Turns the relay OFF

## 🎯 Complete Integration Across All Pages

### ✅ **Dashboard Page** (Main Overview)
- **Real-time Temperature**: Live sensor temperature in °C
- **Real-time Humidity**: Live humidity percentage
- **Live AQI Score**: Current Air Quality Index from API
- **6 Pollutants Display**: PM2.5, PM10, NO2, O3, CO, SO2 with live values
- **Dynamic Chart**: Real-time AQI trend graph (updates every 30s)
- **Auto-refresh**: Polls API every 30 seconds
- **Connection Status**: Green badge when connected, red on error
- **Loading States**: Shows "--" while fetching data

### ✅ **Analytics Page** (Trends & Analysis)
- **Real-time Data Integration**: Uses live sensor readings
- **Historical Chart**: Builds time-series data from API calls
- **Auto-updating Graphs**: Chart updates every 30 seconds with new data
- **Pollutant Selection**: Switch between PM2.5, PM10, NO2, O3, CO, SO2
- **Time Period Options**: 24h, 72h, 7 days view
- **Live Statistics**: Average, min, max calculated from real data
- **CSV Export**: Export real-time readings with timestamps

### ✅ **Historical Data Page** (Long-term Trends)
- **Real-time Data Collection**: Continuously collects sensor readings
- **Time-series Storage**: Builds historical database in browser
- **Multiple Time Periods**: 24h, 72h, 7-day historical views
- **Station Comparison**: View trends across multiple stations
- **Auto-refresh**: Updates every 60 seconds
- **Data Export**: Download historical data as CSV
- **Trend Charts**: Line graphs showing PM2.5, PM10, NO2 over time

### ✅ **Map Page** (Geographic View)
- **Live Station Updates**: Main station updates with real API data
- **Real-time AQI Display**: Shows current AQI from sensor
- **Status Indicators**: Color-coded markers (Good/Moderate/Unhealthy)
- **Auto-refresh**: Updates every 30 seconds
- **Live Data Badge**: Shows "Live Data" indicator when connected
- **Interactive Markers**: Click stations to see real-time readings
- **Heatmap Visualization**: Visual representation of air quality
- **Station Search & Filter**: Find stations by name or status

### ✅ **API Test Page** (Debugging & Control)
- **Sensor Data Testing**: Test `/sensors` endpoint directly
- **Raw JSON Display**: View complete API response
- **Relay Control**: Turn relay ON/OFF with buttons
- **Visual Status**: Real-time connection status
- **Error Display**: Shows detailed error messages
- **Manual Refresh**: Test API anytime with refresh button

### ✅ AQI Status Calculation
- Good: 0-50 (Green)
- Moderate: 51-100 (Yellow)
- Unhealthy for Sensitive Groups: 101-150 (Orange)
- Unhealthy: 151-200 (Red)
- Very Unhealthy: 201-300 (Purple)
- Hazardous: 300+ (Dark Red)

## Environment Variables

All API endpoints are configured in `.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://10.96.203.117:3000/
VITE_API_SENSORS=http://10.96.203.117:3000/sensors
VITE_API_RELAY_ON=http://10.96.203.117:3000/relay/on
VITE_API_RELAY_OFF=http://10.96.203.117:3000/relay/off
VITE_WS_URL=ws://10.96.203.117:3000
```

## Usage in Code

### Fetch Sensor Data
```typescript
import { fetchSensorData } from '../utils/api';

const data = await fetchSensorData();
console.log(data.temperature, data.humidity, data.aqi);
```

### Control Relay
```typescript
import { turnRelayOn, turnRelayOff } from '../utils/api';

// Turn ON
await turnRelayOn();

// Turn OFF
await turnRelayOff();
```

### Access Environment Variables
```typescript
const apiUrl = import.meta.env.VITE_API_SENSORS;
const relayOn = import.meta.env.VITE_API_RELAY_ON;
```

## 📊 Real-time Monitoring Features

### Data Flow Architecture
```
Backend API (10.96.203.117:3000)
           ↓
    /sensors endpoint
           ↓
  Frontend API Utils
           ↓
   ┌───────┴────────┐
   ↓                ↓
Dashboard      Analytics
   ↓                ↓
Historical    Map Page
   ↓                ↓
API Test Page (Manual Control)
```

### Update Frequencies
- **Dashboard**: Every 30 seconds
- **Analytics**: Every 30 seconds
- **Historical Data**: Every 60 seconds
- **Map**: Every 30 seconds
- **API Test**: Manual + on page load

### Data Persistence
- **In-memory Storage**: Charts maintain last 20 data points
- **Session Storage**: Historical data kept during browser session
- **Real-time Updates**: No database needed, pure real-time monitoring
- **Fallback Data**: Shows sample data if API unavailable

## 📁 Files Created & Modified

### Created Files
1. **`src/utils/api.ts`** - Complete API utility functions
   - `fetchSensorData()` - Get sensor readings
   - `turnRelayOn()` - Control relay ON
   - `turnRelayOff()` - Control relay OFF
   - `getAQIStatus()` - Calculate AQI category
   - `getAQIColor()` - Get status colors
   - `calculatePercentage()` - Calculate display percentages

2. **`src/vite-env.d.ts`** - TypeScript environment types
   - All `VITE_*` environment variables typed
   - Type-safe access to configuration

3. **`src/Home/APITest.tsx`** - Interactive API testing page
   - Visual sensor data display
   - Relay control buttons
   - Connection status indicators
   - Raw JSON response viewer

4. **`API_INTEGRATION.md`** - Complete documentation

### Modified Files
1. **`src/Home/Dashboard.tsx`**
   - Real-time sensor data integration
   - Live temperature, humidity, AQI display
   - Dynamic pollutant values
   - Real-time chart updates
   - Connection status indicators

2. **`src/Home/Analytics.tsx`**
   - Real-time data fetching
   - Historical data collection
   - Live chart updates
   - Time-series data building

3. **`src/Home/Historical Data.tsx`**
   - Continuous data collection
   - Real-time readings storage
   - Historical trend building
   - Auto-refresh implementation

4. **`src/Home/Map.tsx`**
   - Live station updates
   - Real-time AQI display
   - Status indicator badges
   - Auto-refresh for map data

5. **`.env`**
   - All API endpoints configured
   - WebSocket URL configured
   - Application settings defined

## Testing

### 1. Start your backend server:
```bash
# Make sure your backend is running on 10.96.203.117:3000
```

### 2. Start the frontend:
```bash
cd web
npm run dev
```

### 3. Check the Dashboard:
- Open http://localhost:5173
- Look for the green "Connected" badge
- Verify temperature, humidity, and AQI are updating
- Check pollutant values are displaying

## Troubleshooting

### Connection Error
- Verify backend is running at `10.96.203.117:3000`
- Check CORS is enabled on your backend
- Ensure `/sensors` endpoint returns JSON data
- Restart development server after changing `.env`

### Data Not Updating
- Check browser console for errors
- Verify API response format matches expected structure
- Check network tab in browser DevTools

### CORS Issues
Your backend needs to allow requests from the frontend:
```javascript
// Add to your backend (Express example)
app.use(cors({
  origin: '*', // Or specify your frontend URL
  methods: ['GET', 'POST']
}));
```

## Future Enhancements

- [ ] WebSocket connection for real-time updates
- [ ] Historical data storage and charts
- [ ] Relay control UI in Settings page
- [ ] Push notifications for high AQI levels
- [ ] Export sensor data to CSV

## 🚀 Quick Start Guide

### Step 1: Verify Backend is Running
```bash
# Test if your backend is accessible
curl http://10.96.203.117:3000/sensors

# Should return JSON with sensor data
```

### Step 2: Start Frontend
```bash
cd web
npm install  # If first time
npm run dev
```

### Step 3: View Real-time Data
1. Open http://localhost:5173
2. **Dashboard**: See live temperature, humidity, AQI
3. **Analytics**: Watch real-time charts update
4. **Map**: View live station data on map
5. **Mail** (API Test): Test endpoints manually

### Step 4: Verify Connection
- Look for **green "Connected"** badge on Dashboard
- Check **"Live Data"** indicator on Map page
- Watch numbers update every 30 seconds
- Charts should show growing trend lines

## 🔍 Monitoring What's Happening

### Check Browser Console
```javascript
// Open DevTools (F12) and watch for:
"Sensor data: {temperature: 25.5, humidity: 65, ...}"
"Connected to sensor API at http://10.96.203.117:3000/sensors"
```

### Network Tab
- Filter by: `10.96.203.117`
- Should see requests every 30-60 seconds
- Status should be `200 OK`
- Response should contain JSON data

### Visual Indicators
✅ **Green badge** = API connected  
🔵 **Blue spinner** = Fetching data  
🔴 **Red alert** = Connection error  
🟢 **Pulsing dot** = Live updates active  

## 📈 What Each Page Shows

| Page | Live Data | Update Rate | Chart Type |
|------|-----------|-------------|------------|
| **Dashboard** | Temp, Humidity, AQI, Pollutants | 30s | Line (AQI trend) |
| **Analytics** | All pollutants over time | 30s | Line (time-series) |
| **Historical** | PM2.5, PM10, NO2 history | 60s | Line (multi-period) |
| **Map** | Station locations + AQI | 30s | Interactive markers |
| **API Test** | All sensor data + relay | Manual | Raw JSON view |

## 🎨 Data Visualization

### Color Coding (AQI)
- 🟢 **Green (0-50)**: Good
- 🟡 **Yellow (51-100)**: Moderate
- 🟠 **Orange (101-150)**: Unhealthy for Sensitive
- 🔴 **Red (151-200)**: Unhealthy
- 🟣 **Purple (201-300)**: Very Unhealthy
- 🟤 **Maroon (300+)**: Hazardous

### Chart Behavior
- **X-axis**: Time (auto-updating labels)
- **Y-axis**: Pollutant concentration or AQI
- **Data Points**: Last 20 readings (rolling window)
- **Updates**: Smooth animations on new data

## 🛠️ Advanced Features

### Relay Control
Access via "Mail" menu → API Test page
- **Turn ON**: Activates connected relay/device
- **Turn OFF**: Deactivates relay/device
- Use case: Auto air purifier control

### Data Export
- **Analytics page**: Export CSV of current session
- **Historical page**: Export long-term trends
- **Settings page**: Export all configuration

### Filters & Search
- **Map**: Filter by status, search stations
- **Analytics**: Select specific pollutants
- **Historical**: Choose time periods (24h/72h/7d)

## 🐛 Troubleshooting Guide

### "Connection Error" Message
**Cause**: Can't reach backend API  
**Fix**:
1. Verify backend is running: `curl http://10.96.203.117:3000/sensors`
2. Check firewall isn't blocking port 3000
3. Ensure IP `10.96.203.117` is correct
4. Verify network connectivity

### "Failed to fetch" in Console
**Cause**: CORS not enabled on backend  
**Fix**: Add to your backend:
```javascript
// Express example
const cors = require('cors');
app.use(cors({
  origin: '*',  // Or specify frontend URL
  methods: ['GET', 'POST']
}));
```

### Data Shows "--" or "0"
**Cause**: API returns null/undefined values  
**Fix**:
1. Check backend returns all fields (temperature, humidity, pm25, etc.)
2. Verify data types (numbers not strings)
3. Check API response format matches expected structure

### Charts Not Updating
**Cause**: Auto-refresh not working  
**Fix**:
1. Check browser console for errors
2. Verify API is responding (Network tab)
3. Hard refresh page (Ctrl+Shift+R)
4. Clear browser cache

### Relay Control Not Working
**Cause**: Endpoints not implemented or CORS issue  
**Fix**:
1. Test manually: `curl http://10.96.203.117:3000/relay/on`
2. Check backend implements GET /relay/on and /relay/off
3. Verify relay hardware is connected
4. Check backend logs for errors

## 📞 Support & Resources

### Documentation
- **API Spec**: See `/sensors` response format above
- **Environment Variables**: Check `.env` file
- **TypeScript Types**: See `src/utils/api.ts` interfaces

### Debugging Tools
- Browser DevTools (F12)
- Network tab for API calls
- Console for error messages
- React DevTools for component state

### Contact
- Email: support@airpulse.example
- GitHub: https://github.com/satyaranjan2005/AirPulse

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Green "Connected" badge appears on Dashboard
- ✅ Temperature and humidity show real values (not "--")
- ✅ AQI number matches your sensor reading
- ✅ Charts update every 30 seconds with new data
- ✅ Map shows "Live Data" indicator
- ✅ All pollutant values are displaying numbers
- ✅ Relay buttons work (shows success alert)
- ✅ No red error messages on any page

**Congratulations! Your AirPulse dashboard is now fully connected with real-time monitoring! 🎊**
