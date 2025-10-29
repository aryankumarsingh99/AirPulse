import React, { useState, useEffect } from 'react';
import { Bell, Mail, User, Settings, AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { fetchSensorData, SensorData } from '../utils/api';

type NotificationItem = {
  id: number;
  alertId?: string;
  title: string;
  message: string;
  time: string;
  timestamp?: string;
  node?: string;
  pollutant?: string;
  measured?: string; // include unit
  threshold?: string;
  aqi?: string;
  severity?: 'Low' | 'Moderate' | 'Severe' | 'Hazardous';
  status?: 'Active' | 'Resolved';
  type?: string;
  location?: string;
  healthTip?: string;
  channels?: string[]; // e.g. ['SMS','Email']
  deviceStatus?: string;
  channel: 'system' | 'mail' | 'user';
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    alertId: 'ALERT-2025-001',
    title: 'Station Offline',
    message: 'Station #12 has stopped reporting data.',
    time: '2m ago',
    timestamp: '2025-10-22 10:43:12',
    node: 'Node_12 (Rourkela City)',
    type: 'Device Offline',
    status: 'Active',
    location: '25.5941° N, 85.1376° E',
    channels: ['App'],
    deviceStatus: 'Offline',
    channel: 'system',
    read: false
  },
  {
    id: 2,
    alertId: 'ALERT-2025-002',
    title: 'PM2.5 Exceeded',
    message: 'PM2.5 levels have exceeded 150 µg/m³ in your area.',
    time: '10m ago',
    timestamp: '2025-10-22 10:35:53',
    node: 'Node_03 (Rourkela City)',
    pollutant: 'PM2.5',
    measured: '158 µg/m³',
    threshold: 'Safe ≤ 60 µg/m³',
    aqi: 'AQI 190 — Unhealthy',
    severity: 'Severe',
    status: 'Active',
    type: 'Pollution Exceeded',
    location: '25.5941° N, 85.1376° E',
    healthTip: 'Avoid outdoor exercise. Use N95 mask.',
    channels: ['SMS', 'Email', 'App'],
    channel: 'mail',
    read: false
  },
  {
    id: 3,
    alertId: 'INFO-2025-010',
    title: 'User Invite',
    message: 'Ana invited you to project AirPulse.',
    time: '1h ago',
    timestamp: '2025-10-22 09:30:00',
    node: undefined,
    type: 'User Action',
    status: 'Resolved',
    channels: ['App'],
    channel: 'user',
    read: true
  },
  {
    id: 4,
    alertId: 'ALERT-2025-003',
    title: 'Firmware Update',
    message: 'Firmware v1.2.3 available for Station #3.',
    time: '3h ago',
    timestamp: '2025-10-22 07:15:02',
    node: 'Node_03',
    type: 'Device Update',
    status: 'Active',
    channels: ['App'],
    deviceStatus: 'Online',
    channel: 'system',
    read: false
  },
  {
    id: 5,
    alertId: 'REPORT-2025-WEEK42',
    title: 'Weekly Report',
    message: 'Your weekly air quality summary is ready.',
    time: '1d ago',
    timestamp: '2025-10-21 11:00:00',
    type: 'Report',
    status: 'Resolved',
    channels: ['Email'],
    channel: 'mail',
    read: true
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate real-time alerts based on sensor data
  useEffect(() => {
    const generateAlerts = async () => {
      try {
        setLoading(true);
        const data = await fetchSensorData();
        setSensorData(data);
        
        const newAlerts: NotificationItem[] = [];
        const now = new Date();
        let alertCount = initialNotifications.length + 1;

        // Check PM2.5 levels
        if (data.pm25 && data.pm25 > 150) {
          newAlerts.push({
            id: alertCount++,
            alertId: `ALERT-${now.getFullYear()}-${String(alertCount).padStart(3, '0')}`,
            title: 'Critical PM2.5 Level',
            message: `PM2.5 levels have reached ${data.pm25.toFixed(1)} µg/m³, exceeding safe limits.`,
            time: 'Just now',
            timestamp: now.toISOString(),
            node: 'Node_01 (Rourkela - Steel Plant)',
            pollutant: 'PM2.5',
            measured: `${data.pm25.toFixed(1)} µg/m³`,
            threshold: 'Safe ≤ 60 µg/m³',
            aqi: `AQI ${data.aqi || 0} — ${data.status || 'Unknown'}`,
            severity: data.aqi && data.aqi > 300 ? 'Hazardous' : data.aqi && data.aqi > 200 ? 'Severe' : 'Moderate',
            status: 'Active',
            type: 'Pollution Exceeded',
            location: '22.2604° N, 84.8536° E',
            healthTip: 'Stay indoors, use air purifiers, wear N95 masks if going outside.',
            channels: ['SMS', 'Email', 'App'],
            channel: 'system',
            read: false
          });
        } else if (data.pm25 && data.pm25 > 60) {
          newAlerts.push({
            id: alertCount++,
            alertId: `WARN-${now.getFullYear()}-${String(alertCount).padStart(3, '0')}`,
            title: 'Elevated PM2.5 Detected',
            message: `PM2.5 levels are at ${data.pm25.toFixed(1)} µg/m³, above recommended limits.`,
            time: 'Just now',
            timestamp: now.toISOString(),
            node: 'Node_01 (Rourkela - Steel Plant)',
            pollutant: 'PM2.5',
            measured: `${data.pm25.toFixed(1)} µg/m³`,
            threshold: 'Recommended ≤ 60 µg/m³',
            aqi: `AQI ${data.aqi || 0} — ${data.status || 'Unknown'}`,
            severity: 'Moderate',
            status: 'Active',
            type: 'Air Quality Warning',
            location: '22.2604° N, 84.8536° E',
            healthTip: 'Limit prolonged outdoor activities, especially for sensitive groups.',
            channels: ['App'],
            channel: 'system',
            read: false
          });
        }

        // Check Gas sensor
        if (data.gas && data.gas > 3000) {
          newAlerts.push({
            id: alertCount++,
            alertId: `ALERT-${now.getFullYear()}-${String(alertCount).padStart(3, '0')}`,
            title: 'High Gas Concentration',
            message: `Air quality gas sensor reading is ${data.gas} ppm, indicating poor air quality.`,
            time: 'Just now',
            timestamp: now.toISOString(),
            node: 'Node_01 (Rourkela - Steel Plant)',
            pollutant: 'Gas Sensor',
            measured: `${data.gas} ppm`,
            threshold: 'Normal ≤ 2000 ppm',
            aqi: `AQI ${data.aqi || 0} — ${data.status || 'Unknown'}`,
            severity: data.gas > 4000 ? 'Hazardous' : 'Severe',
            status: 'Active',
            type: 'Gas Detection',
            location: '22.2604° N, 84.8536° E',
            healthTip: 'Poor air quality detected. Ensure proper ventilation.',
            channels: ['SMS', 'App'],
            channel: 'system',
            read: false
          });
        }

        // Check Temperature
        if (data.temperature && data.temperature > 35) {
          newAlerts.push({
            id: alertCount++,
            alertId: `INFO-${now.getFullYear()}-${String(alertCount).padStart(3, '0')}`,
            title: 'High Temperature Alert',
            message: `Temperature has reached ${data.temperature.toFixed(1)}°C, which may affect air quality.`,
            time: 'Just now',
            timestamp: now.toISOString(),
            node: 'Node_01 (Rourkela - Steel Plant)',
            measured: `${data.temperature.toFixed(1)}°C`,
            severity: 'Low',
            status: 'Active',
            type: 'Environmental Alert',
            location: '22.2604° N, 84.8536° E',
            healthTip: 'Stay hydrated and avoid prolonged sun exposure.',
            channels: ['App'],
            channel: 'system',
            read: false
          });
        }

        // Relay Status notification
        if (data.relayStatus) {
          newAlerts.push({
            id: alertCount++,
            alertId: `STATUS-${now.getFullYear()}-${String(alertCount).padStart(3, '0')}`,
            title: `Relay Status: ${data.relayStatus}`,
            message: `Air purification relay is currently ${data.relayStatus}.`,
            time: 'Just now',
            timestamp: now.toISOString(),
            node: 'Node_01 (Rourkela - Steel Plant)',
            type: 'Device Status',
            status: 'Active',
            deviceStatus: data.relayStatus,
            channels: ['App'],
            channel: 'system',
            read: false
          });
        }

        // Add new alerts to existing ones (avoid duplicates)
        if (newAlerts.length > 0) {
          setNotifications(prev => {
            // Remove old "Just now" alerts to avoid duplicates
            const filtered = prev.filter(n => n.time !== 'Just now');
            return [...newAlerts, ...filtered];
          });
        }

      } catch (err) {
        console.error('Error generating alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    generateAlerts();
    // Refresh alerts every 2 minutes
    const interval = setInterval(generateAlerts, 120000);
    return () => clearInterval(interval);
  }, []);

  const toggleRead = (id: number) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const clearRead = () => {
    setNotifications((prev) => prev.filter(n => !n.read));
  };

  const visible = notifications.filter(n => (filter === 'unread' ? !n.read : true));

  const iconFor = (notif: NotificationItem) => {
    // Choose icon based on type and severity
    if (notif.severity === 'Hazardous' || notif.severity === 'Severe') {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
    if (notif.type === 'Device Status' || notif.type === 'Device Update' || notif.type === 'Device Offline') {
      return <Activity className="w-5 h-5 text-[#4a3f9e]" />;
    }
    if (notif.channel === 'mail') return <Mail className="w-5 h-5 text-[#4a3f9e]" />;
    if (notif.channel === 'user') return <User className="w-5 h-5 text-[#4a3f9e]" />;
    return <Bell className="w-5 h-5 text-[#4a3f9e]" />;
  };

  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeAlertsCount = notifications.filter(n => n.status === 'Active' && !n.read).length;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 italic mb-1">Notifications</h1>
          <p className="text-slate-600">Recent alerts, messages and system updates</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-3 rounded-full bg-slate-100 text-[#4a3f9e] hover:bg-slate-200 transition-all">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button className="p-3 rounded-full bg-slate-100 text-[#4a3f9e] hover:bg-slate-200 transition-all">
            <Settings size={18} />
          </button>
          <button className="p-3 rounded-full bg-slate-100 text-[#4a3f9e] hover:bg-slate-200 transition-all">
            <User size={18} />
          </button>
        </div>
      </div>

      {/* Real-time Status Summary */}
      {sensorData && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current AQI Status */}
          <div className={`p-4 rounded-xl border-2 ${
            sensorData.aqi && sensorData.aqi > 300 ? 'bg-red-50 border-red-300' :
            sensorData.aqi && sensorData.aqi > 200 ? 'bg-orange-50 border-orange-300' :
            sensorData.aqi && sensorData.aqi > 150 ? 'bg-yellow-50 border-yellow-300' :
            'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-center gap-3">
              <Activity className={`w-8 h-8 ${
                sensorData.aqi && sensorData.aqi > 300 ? 'text-red-600' :
                sensorData.aqi && sensorData.aqi > 200 ? 'text-orange-600' :
                sensorData.aqi && sensorData.aqi > 150 ? 'text-yellow-600' :
                'text-green-600'
              }`} />
              <div>
                <div className="text-xs font-semibold text-slate-600">Current AQI</div>
                <div className="text-2xl font-bold text-slate-900">{sensorData.aqi || 0}</div>
                <div className="text-xs text-slate-600">{sensorData.status || 'Unknown'}</div>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="p-4 rounded-xl border-2 bg-purple-50 border-purple-300">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-xs font-semibold text-slate-600">Active Alerts</div>
                <div className="text-2xl font-bold text-slate-900">{activeAlertsCount}</div>
                <div className="text-xs text-slate-600">Require attention</div>
              </div>
            </div>
          </div>

          {/* Sensor Status */}
          <div className="p-4 rounded-xl border-2 bg-blue-50 border-blue-300">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-xs font-semibold text-slate-600">System Status</div>
                <div className="text-lg font-bold text-slate-900">{loading ? 'Updating...' : 'Online'}</div>
                <div className="text-xs text-slate-600">
                  Temp: {sensorData.temperature?.toFixed(1)}°C | Relay: {sensorData.relayStatus || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filter === 'all' ? 'bg-[#4a3f9e] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filter === 'unread' ? 'bg-[#4a3f9e] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Unread
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={markAllRead} className="px-3 py-2 rounded-lg bg-[#4a3f9e]/10 text-[#4a3f9e] text-sm hover:bg-[#4a3f9e]/20 transition">
            Mark all read
          </button>
          <button onClick={clearRead} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200 transition">
            Clear read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 gap-4">
        {visible.length === 0 ? (
          <div className="bg-slate-50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-slate-600">
            You're all caught up — no notifications to show.
          </div>
        ) : (
          visible.map((n) => {
            const expanded = expandedId === n.id;
            
            // Get background color based on severity
            const getBgColor = () => {
              if (n.severity === 'Hazardous') return 'bg-red-100 border-red-300';
              if (n.severity === 'Severe') return 'bg-orange-100 border-orange-300';
              if (n.severity === 'Moderate') return 'bg-yellow-100 border-yellow-300';
              if (n.read) return 'bg-slate-50 border-slate-200';
              return 'bg-white border-[#4a3f9e]/20 shadow-lg';
            };

            const getIconBg = () => {
              if (n.severity === 'Hazardous') return 'bg-red-200';
              if (n.severity === 'Severe') return 'bg-orange-200';
              if (n.severity === 'Moderate') return 'bg-yellow-200';
              return 'bg-[#4a3f9e]/10';
            };

            return (
              <div key={n.id} className={`flex flex-col gap-3 p-4 rounded-2xl border ${getBgColor()}`}>
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getIconBg()}`}>
                    {iconFor(n)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className={`text-lg font-semibold ${n.read ? 'text-slate-600' : 'text-slate-800'}`}>{n.title}</h3>
                          {n.alertId && <div className="text-xs text-slate-500 mt-0.5">{n.alertId}</div>}
                        </div>
                        {!n.read && <span className="text-xs px-2 py-0.5 rounded-full bg-[#4a3f9e] text-white">New</span>}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">{n.time}</span>
                        <button
                          onClick={() => toggleExpand(n.id)}
                          className="text-sm px-3 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                        >
                          {expanded ? 'Hide details' : 'View details'}
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 mt-1">{n.message}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => toggleRead(n.id)}
                        className={`text-sm px-3 py-1 rounded-lg transition ${n.read ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-[#4a3f9e] text-white hover:bg-[#4a3f9e]/90'}`}
                      >
                        {n.read ? 'Mark unread' : 'Mark read'}
                      </button>
                      <button
                        onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                        className="text-sm px-3 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details panel */}
                {expanded && (
                  <div className="bg-slate-50 border-t border-slate-200 pt-3 mt-2 text-slate-600 rounded-b-lg p-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-slate-500">Alert ID</div>
                        <div className="font-medium">{n.alertId ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Node</div>
                        <div className="font-medium">{n.node ?? '—'}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Timestamp</div>
                        <div className="font-medium">{n.timestamp ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Location</div>
                        <div className="font-medium">{n.location ?? '—'}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Pollutant</div>
                        <div className="font-medium">{n.pollutant ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Measured</div>
                        <div className="font-medium">{n.measured ?? '—'}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Threshold</div>
                        <div className="font-medium">{n.threshold ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">AQI / Category</div>
                        <div className="font-medium">{n.aqi ?? '—'}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Severity</div>
                        <div className="font-medium">{n.severity ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Status</div>
                        <div className="font-medium">{n.status ?? '—'}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Type</div>
                        <div className="font-medium">{n.type ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Notified via</div>
                        <div className="font-medium">{n.channels?.join(', ') ?? '—'}</div>
                      </div>

                      {n.healthTip && (
                        <div className="col-span-2">
                          <div className="text-xs text-slate-500">Health Tip</div>
                          <div className="font-medium">{n.healthTip}</div>
                        </div>
                      )}
                      {n.deviceStatus && (
                        <div>
                          <div className="text-xs text-slate-500">Device Status</div>
                          <div className="font-medium">{n.deviceStatus}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}