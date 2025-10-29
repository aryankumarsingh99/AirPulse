import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Globe,
  Lock,
  Database,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  MapPin,
  Save,
  RefreshCw,
  Download,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';

type NotificationSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  alertThreshold: number;
  dailyReport: boolean;
  weeklyReport: boolean;
};

type DisplaySettings = {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
};

type PrivacySettings = {
  shareLocation: boolean;
  shareData: boolean;
  analyticsEnabled: boolean;
  showProfile: boolean;
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'display' | 'privacy' | 'data'>('profile');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Profile settings
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    location: 'Rourkela, Odisha',
    organization: 'Environmental Research Institute'
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertThreshold: 150,
    dailyReport: true,
    weeklyReport: false
  });

  // Display settings
  const [display, setDisplay] = useState<DisplaySettings>({
    theme: 'light',
    language: 'en',
    temperatureUnit: 'celsius',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    shareLocation: true,
    shareData: false,
    analyticsEnabled: true,
    showProfile: true
  });

  // Password change
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleExportData = () => {
    const data = {
      profile,
      notifications,
      display,
      privacy,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airpulse-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setNotifications({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        alertThreshold: 150,
        dailyReport: true,
        weeklyReport: false
      });
      setDisplay({
        theme: 'light',
        language: 'en',
        temperatureUnit: 'celsius',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      });
      setPrivacy({
        shareLocation: true,
        shareData: false,
        analyticsEnabled: true,
        showProfile: true
      });
    }
  };

  const handleClearCache = () => {
    if (confirm('Clear all cached data? This will improve performance but may require reloading some content.')) {
      // Simulate cache clearing
      alert('Cache cleared successfully!');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data & Storage', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <SettingsIcon className="text-[#4a3f9e]" />
              Settings
            </h1>
            <p className="text-sm text-slate-600 mt-1">Manage your account and application preferences</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 bg-[#4a3f9e] text-white rounded-lg hover:bg-[#3d3582] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle size={16} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 min-h-screen p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#4a3f9e] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 space-y-2">
            <button
              onClick={handleResetSettings}
              className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <RefreshCw size={16} />
              <span className="text-sm">Reset to Default</span>
            </button>
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Download size={16} />
              <span className="text-sm">Export Settings</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Profile Information</h2>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#4a3f9e] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-all">
                          Change Photo
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Organization</label>
                        <input
                          type="text"
                          value={profile.organization}
                          onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Change Password</h2>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e] pr-10"
                        />
                        <button
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e] pr-10"
                        />
                        <button
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e] pr-10"
                        />
                        <button
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button className="px-4 py-2 bg-[#4a3f9e] text-white rounded-lg hover:bg-[#3d3582] transition-all flex items-center gap-2">
                      <Lock size={16} />
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Notification Preferences</h2>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <Mail className="text-slate-600" size={20} />
                        <div>
                          <div className="font-medium text-slate-900">Email Notifications</div>
                          <div className="text-sm text-slate-600">Receive alerts via email</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailNotifications}
                          onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <Smartphone className="text-slate-600" size={20} />
                        <div>
                          <div className="font-medium text-slate-900">SMS Notifications</div>
                          <div className="text-sm text-slate-600">Receive alerts via SMS</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.smsNotifications}
                          onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <Bell className="text-slate-600" size={20} />
                        <div>
                          <div className="font-medium text-slate-900">Push Notifications</div>
                          <div className="text-sm text-slate-600">Receive in-app notifications</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.pushNotifications}
                          onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>

                    <div className="py-3">
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Alert Threshold (AQI)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="50"
                          max="300"
                          step="10"
                          value={notifications.alertThreshold}
                          onChange={(e) => setNotifications({ ...notifications, alertThreshold: parseInt(e.target.value) })}
                          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-lg font-bold text-[#4a3f9e] w-12">{notifications.alertThreshold}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">Get notified when AQI exceeds this value</p>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <div className="font-medium text-slate-900">Daily Report</div>
                        <div className="text-sm text-slate-600">Receive daily air quality summary</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.dailyReport}
                          onChange={(e) => setNotifications({ ...notifications, dailyReport: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium text-slate-900">Weekly Report</div>
                        <div className="text-sm text-slate-600">Receive weekly air quality summary</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReport}
                          onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Display Tab */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Display Settings</h2>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', icon: Sun, label: 'Light' },
                          { value: 'dark', icon: Moon, label: 'Dark' },
                          { value: 'auto', icon: Monitor, label: 'Auto' }
                        ].map((theme) => {
                          const Icon = theme.icon;
                          return (
                            <button
                              key={theme.value}
                              onClick={() => setDisplay({ ...display, theme: theme.value as any })}
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                display.theme === theme.value
                                  ? 'border-[#4a3f9e] bg-purple-50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <Icon size={24} className={display.theme === theme.value ? 'text-[#4a3f9e]' : 'text-slate-600'} />
                              <span className={`text-sm font-medium ${display.theme === theme.value ? 'text-[#4a3f9e]' : 'text-slate-700'}`}>
                                {theme.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Language</label>
                      <select
                        value={display.language}
                        onChange={(e) => setDisplay({ ...display, language: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e]"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="mr">मराठी (Marathi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Temperature Unit</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDisplay({ ...display, temperatureUnit: 'celsius' })}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            display.temperatureUnit === 'celsius'
                              ? 'border-[#4a3f9e] bg-purple-50 text-[#4a3f9e]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          Celsius (°C)
                        </button>
                        <button
                          onClick={() => setDisplay({ ...display, temperatureUnit: 'fahrenheit' })}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            display.temperatureUnit === 'fahrenheit'
                              ? 'border-[#4a3f9e] bg-purple-50 text-[#4a3f9e]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          Fahrenheit (°F)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Date Format</label>
                      <select
                        value={display.dateFormat}
                        onChange={(e) => setDisplay({ ...display, dateFormat: e.target.value as any })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a3f9e]"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Time Format</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDisplay({ ...display, timeFormat: '12h' })}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            display.timeFormat === '12h'
                              ? 'border-[#4a3f9e] bg-purple-50 text-[#4a3f9e]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          12-hour (AM/PM)
                        </button>
                        <button
                          onClick={() => setDisplay({ ...display, timeFormat: '24h' })}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            display.timeFormat === '24h'
                              ? 'border-[#4a3f9e] bg-purple-50 text-[#4a3f9e]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          24-hour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Privacy & Security</h2>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-slate-600" size={20} />
                        <div>
                          <div className="font-medium text-slate-900">Share Location</div>
                          <div className="text-sm text-slate-600">Allow app to access your location</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.shareLocation}
                          onChange={(e) => setPrivacy({ ...privacy, shareLocation: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <Database className="text-slate-600" size={20} />
                        <div>
                          <div className="font-medium text-slate-900">Share Data</div>
                          <div className="text-sm text-slate-600">Share anonymous usage data</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.shareData}
                          onChange={(e) => setPrivacy({ ...privacy, shareData: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <Globe className="text-slate-600" size={20} />
                        <div>
                          <div className="font-medium text-slate-900">Analytics</div>
                          <div className="text-sm text-slate-600">Help improve our app</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.analyticsEnabled}
                          onChange={(e) => setPrivacy({ ...privacy, analyticsEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <User className="text-slate-600" size={20} />
                        <div>
                          <div className="font-medium text-slate-900">Public Profile</div>
                          <div className="text-sm text-slate-600">Make your profile visible to others</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.showProfile}
                          onChange={(e) => setPrivacy({ ...privacy, showProfile: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a3f9e]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
                    <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center gap-2">
                      <Shield size={20} />
                      Danger Zone
                    </h3>
                    <p className="text-sm text-red-700 mb-4">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all flex items-center gap-2 justify-center">
                        <Trash2 size={16} />
                        Delete All Data
                      </button>
                      <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 justify-center">
                        <X size={16} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Storage Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Data & Storage</h2>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <div className="font-medium text-slate-900">Storage Used</div>
                        <div className="text-sm text-slate-600">47.8 MB of 500 MB</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#4a3f9e]">9.6%</div>
                      </div>
                    </div>

                    <div className="py-3">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-[#4a3f9e] h-3 rounded-full" style={{ width: '9.6%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Cache</span>
                        <span className="font-medium text-slate-900">12.3 MB</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Database</span>
                        <span className="font-medium text-slate-900">28.5 MB</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Files</span>
                        <span className="font-medium text-slate-900">7.0 MB</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <button
                        onClick={handleClearCache}
                        className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2 justify-center"
                      >
                        <RefreshCw size={16} />
                        Clear Cache
                      </button>

                      <button
                        onClick={handleExportData}
                        className="w-full px-4 py-2 bg-[#4a3f9e] text-white rounded-lg hover:bg-[#3d3582] transition-all flex items-center gap-2 justify-center"
                      >
                        <Download size={16} />
                        Export All Data
                      </button>

                      <button className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2 justify-center">
                        <Database size={16} />
                        Backup Settings
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Data Sync</h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Your settings are automatically synced across all your devices.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">Last synced</span>
                      <span className="font-medium text-blue-900">2 minutes ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
