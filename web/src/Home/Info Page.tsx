import React, { useMemo, useState } from 'react';
import { Info, AlertCircle, Github, Phone, Clock, Layers, Server, Download } from 'lucide-react';

type AppInfo = {
  name: string;
  version: string;
  description: string;
  lastDeploy: string;
  license: string;
  repo?: string;
  contactEmail?: string;
  supportedDevices?: string[];
  termsUrl?: string;
};

type Stat = { label: string; value: string | number; icon?: React.ReactNode; tone?: string };

const DEFAULT_INFO: AppInfo = {
  name: 'AirPulse / AirPulse',
  version: 'v1.0.3',
  description: 'Realtime air-quality monitoring dashboard for distributed sensor nodes. Displays trends, alerts, and station details.',
  lastDeploy: '2025-10-22T10:40:00Z',
  license: 'MIT',
  repo: 'https://github.com/your-org/AirPulse',
  contactEmail: 'support@AirPulse.example',
  supportedDevices: ['ESP32 (PM Sensor)', 'Raspberry Pi Gateway', 'LoRa Node'],
  termsUrl: '/terms'
};

export default function InfoPage() {
  const [info] = useState<AppInfo>(DEFAULT_INFO);
  const [showChangelog] = useState(true);

  const stats: Stat[] = useMemo(
    () => [
      { label: 'Stations Online', value: 8, icon: <Server className="w-5 h-5" /> },
      { label: 'Stations Offline', value: 1, icon: <AlertCircle className="w-5 h-5" />, tone: 'text-pink-300' },
      { label: 'Active Alerts', value: 2, icon: <AlertCircle className="w-5 h-5" /> },
      { label: 'Supported Devices', value: info.supportedDevices?.length ?? 0, icon: <Layers className="w-5 h-5" /> }
    ],
    [info]
  );

  const changelog = [
    { version: 'v1.0.3', date: '2025-10-22', notes: 'Improved map clustering, fixed notification details, performance tweaks.' },
    { version: 'v1.0.2', date: '2025-09-10', notes: 'Added analytics export & CSV, minor UI polish.' },
    { version: 'v1.0.0', date: '2025-07-01', notes: 'Initial public release.' }
  ];

  const exportSystemReport = () => {
    const payload = {
      info,
      stats,
      generatedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AirPulse_report_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 italic flex items-center gap-3">
            <Info className="w-6 h-6" /> System Info
          </h1>
          <p className="text-slate-600 mt-1">{info.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <a href={info.repo} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-slate-100 text-[#4a3f9e] hover:bg-slate-200 flex items-center gap-2">
            <Github size={16} /> Repository
          </a>
          <button onClick={exportSystemReport} className="px-3 py-2 rounded-lg bg-[#4a3f9e] text-white hover:bg-[#4a3f9e]/90 flex items-center gap-2">
            <Download size={16} /> Export report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white backdrop-blur-sm rounded-3xl p-6 border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-slate-500 text-xs">Application</div>
              <div className="text-slate-800 font-semibold text-lg">{info.name} <span className="text-[#4a3f9e] text-sm ml-2">{info.version}</span></div>
              <div className="text-slate-500 text-sm mt-1">Last deploy: {new Date(info.lastDeploy).toLocaleString()}</div>
            </div>

            <div className="text-right">
              <div className="text-slate-500 text-xs">License</div>
              <div className="text-slate-800 font-medium">{info.license}</div>

              <div className="text-slate-500 text-xs mt-3">Contact</div>
              <div className="text-slate-600 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" /> <a href={`mailto:${info.contactEmail}`} className="underline">{info.contactEmail}</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-slate-500 text-xs">Deployment</div>
              <div className="text-slate-800 font-semibold mt-1">Region: ap-south-1</div>
              <div className="text-slate-600 text-sm mt-2">Node count: {stats.find(s => s.label === 'Stations Online')?.value} online</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-slate-500 text-xs">Storage & Backups</div>
              <div className="text-slate-800 font-semibold mt-1">Last backup: 2025-10-21</div>
              <div className="text-slate-600 text-sm mt-2">Retention: 30 days</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-slate-500 text-xs">API</div>
              <div className="text-slate-800 font-semibold mt-1">Status: Operational</div>
              <div className="text-slate-600 text-sm mt-2">Rate limit: 60 req/min</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-slate-500 text-xs">Integrations</div>
              <div className="text-slate-800 font-semibold mt-1">MQTT, HTTP, CSV</div>
              <div className="text-slate-600 text-sm mt-2">Docs: <a href={info.repo} className="underline">Repo</a></div>
            </div>
          </div>

          {showChangelog && (
            <div className="mt-6">
              <h4 className="text-slate-600 text-sm mb-3">Changelog</h4>
              <div className="space-y-2">
                {changelog.map(c => (
                  <div key={c.version} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-slate-800 font-semibold">{c.version}</div>
                        <div className="text-slate-500 text-xs">{c.date}</div>
                      </div>
                      <div className="text-slate-600 text-sm">{c.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="bg-white backdrop-blur-sm rounded-3xl p-6 border border-slate-200 shadow-lg">
          <h4 className="text-slate-600 text-sm mb-4">Quick Stats</h4>
          <div className="space-y-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4a3f9e]/10 flex items-center justify-center text-[#4a3f9e]">{s.icon}</div>
                  <div>
                    <div className="text-slate-500 text-xs">{s.label}</div>
                    <div className={`text-slate-800 font-semibold ${s.tone ?? ''}`}>{s.value}</div>
                  </div>
                </div>
                <div className="text-slate-500 text-xs">view</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-slate-600 text-sm mb-2">Supported Devices</h4>
            <ul className="text-slate-600 text-sm space-y-1">
              {info.supportedDevices?.map(d => <li key={d}>• {d}</li>)}
            </ul>

            <div className="mt-4">
              <a href={info.termsUrl} className="text-[#4a3f9e] underline text-sm">Terms & Privacy</a>
            </div>

            <div className="mt-4 flex gap-2">
              <a href={info.repo} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-slate-100 text-[#4a3f9e] hover:bg-slate-200 flex items-center gap-2">
                <Github size={14} /> Repo
              </a>
              <a href={`mailto:${info.contactEmail}`} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-2">
                <Phone size={14} /> Contact
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}