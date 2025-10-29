# AirPulse - Actual API Integration Complete ✅

## Summary

Successfully integrated your backend API response format across all pages of the AirPulse application. The application now properly displays real-time data from your backend at `http://10.96.203.117:3000`.

## Actual Backend Response Format

Your backend returns:
```json
{
  "success": true,
  "data": {
    "Gas": 4095,
    "Humidity": 68.3,
    "RelayStatus": "OFF",
    "Temperature": 29.3
  }
}
```

## Changes Made

### 1. API Utility Layer (`src/utils/api.ts`)

**Added APIResponse Interface:**
```typescript
export interface APIResponse {
  success: boolean;
  data: {
    Gas: number;
    Humidity: number;
    RelayStatus: string;
    Temperature: number;
  };
}
```

**Updated SensorData Interface:**
```typescript
export interface SensorData {
  temperature?: number;
  humidity?: number;
  gas?: number;           // NEW - Maps from backend "Gas"
  relayStatus?: string;   // NEW - Maps from backend "RelayStatus"
  pm25?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  co?: number;
  so2?: number;
  aqi?: number;
  status?: string;
  timestamp?: string;
}
```

**Updated fetchSensorData() Function:**
- Now parses the nested `APIResponse` structure
- Transforms backend field names to frontend format:
  - `Temperature` → `temperature`
  - `Humidity` → `humidity`
  - `Gas` → `gas`
  - `RelayStatus` → `relayStatus`
- Calculates AQI from gas sensor value: `AQI = Math.min(500, Gas / 10)`

### 2. Dashboard Page (`src/Home/Dashboard.tsx`)

**Added Gas Sensor Card:**
- Displays real-time gas sensor reading (4095 ppm)
- Uses purple theme with `MdAir` icon
- Shows in main weather cards section

**Added Relay Status Indicator:**
- Displayed in dashboard header next to title
- Green badge when relay is "ON"
- Gray badge when relay is "OFF"
- Includes live status dot indicator

### 3. Analytics Page (`src/Home/Analytics.tsx`)

**Updated Pollutant Options:**
- Added "Gas" as a selectable pollutant
- Gas sensor data now tracked in real-time charts
- 30-second auto-refresh includes gas readings

**Data Mapping:**
```typescript
case 'Gas': currentValue = data.gas || 0; break;
```

### 4. Map Page (`src/Home/Map.tsx`)

**Updated Station Type:**
```typescript
type Station = {
  // ... existing fields
  temperature?: number;
  humidity?: number;
  gas?: number;
  relayStatus?: string;
};
```

**Updated Station Data:**
- Main station (Node_01) now displays real sensor data
- Temperature: 29.3°C
- Humidity: 68.3%
- Gas: 4095 ppm
- Relay Status: OFF

**Enhanced Station Cards:**
- Station list cards show temperature, humidity, gas, and relay status
- Color-coded relay status (green for ON, gray for OFF)

**Enhanced Map Popups:**
- Marker popups display all sensor readings
- Temperature in Celsius
- Humidity percentage
- Gas sensor in ppm
- Relay status with color coding

### 5. Historical Data Page (`src/Home/Historical Data.tsx`)

**Updated Reading Type:**
```typescript
type Reading = { 
  ts: string; 
  pm25: number; 
  pm10?: number; 
  no2?: number; 
  gas?: number;        // NEW
  temperature?: number; // NEW
  humidity?: number;    // NEW
};
```

**Data Collection:**
- Now collects gas, temperature, and humidity in historical records
- 60-second polling interval
- All readings timestamped and stored

## Data Display Summary

| Field | Dashboard | Analytics | Map | Historical | APITest |
|-------|-----------|-----------|-----|------------|---------|
| **Temperature (29.3°C)** | ✅ Card | ✅ Chart | ✅ Popup | ✅ Track | ✅ Display |
| **Humidity (68.3%)** | ✅ Card | ✅ Chart | ✅ Popup | ✅ Track | ✅ Display |
| **Gas (4095 ppm)** | ✅ Card | ✅ Chart | ✅ Popup | ✅ Track | ✅ Display |
| **RelayStatus (OFF)** | ✅ Header | N/A | ✅ Popup | N/A | ✅ Display |

## Auto-Refresh Intervals

- **Dashboard**: 30 seconds
- **Analytics**: 30 seconds
- **Map**: 30 seconds
- **Historical Data**: 60 seconds

## How to Test

1. **Start your backend server** (should be running at `http://10.96.203.117:3000`)

2. **Start the frontend**:
   ```powershell
   cd web
   npm run dev
   ```

3. **Check Dashboard**:
   - Temperature should show 29.3°C
   - Humidity should show 68%
   - Gas sensor should show 4095 ppm
   - Relay status badge should show "OFF" in header

4. **Check APITest Page** (Mail menu):
   - Click "Fetch Sensor Data"
   - Raw JSON should display your backend response
   - Test relay control buttons

5. **Check Map Page**:
   - Click on Node_01 marker
   - Popup should show all 4 sensor values
   - Station list should show temperature, humidity, gas, relay status

6. **Check Analytics Page**:
   - Select "Gas" from pollutant dropdown
   - Chart should build over time with real data
   - Auto-refreshes every 30 seconds

7. **Check Historical Data Page**:
   - Data collection runs automatically
   - Gas readings stored in historical records

## API Endpoints Configuration

From `.env` file:
```env
VITE_API_BASE_URL=http://10.96.203.117:3000/
VITE_API_SENSORS=http://10.96.203.117:3000/sensors
VITE_API_RELAY_ON=http://10.96.203.117:3000/relay/on
VITE_API_RELAY_OFF=http://10.96.203.117:3000/relay/off
```

## Field Mappings

| Backend Field | Frontend Field | Display Format | Example |
|---------------|----------------|----------------|---------|
| `Temperature` | `temperature` | `X.X°C` | `29.3°C` |
| `Humidity` | `humidity` | `X%` | `68%` |
| `Gas` | `gas` | `X ppm` | `4095 ppm` |
| `RelayStatus` | `relayStatus` | `ON/OFF` | `OFF` |

## AQI Calculation

The system calculates AQI from the gas sensor value:
```typescript
aqi: Math.min(500, Math.round(apiResponse.data.Gas / 10))
```

For `Gas = 4095`:
- Calculated AQI = `Math.min(500, 4095 / 10)` = **409**
- Status = **"Hazardous"** (AQI > 300)

## Relay Control

**Turn Relay ON:**
```typescript
POST http://10.96.203.117:3000/relay/on
```

**Turn Relay OFF:**
```typescript
POST http://10.96.203.117:3000/relay/off
```

The relay status updates automatically on the next data refresh (30s or 60s depending on the page).

## Connection Status Indicators

All pages show connection status:
- ✅ **Green badge**: "Connected" - API responding
- ❌ **Red badge**: "Connection Error" - API not responding
- 🔄 **Loading**: Data being fetched

## Next Steps

1. **Verify data accuracy**: Check if the gas value (4095) and calculated AQI make sense for your sensor
2. **Calibrate AQI calculation**: Adjust the formula if needed: `aqi = Gas / 10`
3. **Test relay control**: Use APITest page to turn relay ON/OFF
4. **Monitor real-time updates**: Watch data refresh across all pages

## Troubleshooting

**No data showing?**
- Verify backend is running at `http://10.96.203.117:3000`
- Check browser console for API errors
- Test endpoint directly: `curl http://10.96.203.117:3000/sensors`

**Wrong values?**
- Check backend response format matches exactly
- Verify all field names are capitalized: `Temperature`, `Humidity`, `Gas`, `RelayStatus`

**Relay not responding?**
- Test endpoints: `/relay/on` and `/relay/off`
- Check backend logs for relay control errors

## Files Modified

1. `src/utils/api.ts` - API utility and data transformation
2. `src/Home/Dashboard.tsx` - Gas card + relay status badge
3. `src/Home/Analytics.tsx` - Gas pollutant option
4. `src/Home/Map.tsx` - Station type + popups
5. `src/Home/Historical Data.tsx` - Reading type

---

**Integration Status**: ✅ Complete and Ready for Testing

All pages now properly display your backend data:
- Temperature: **29.3°C**
- Humidity: **68.3%**
- Gas: **4095 ppm**
- Relay: **OFF**
