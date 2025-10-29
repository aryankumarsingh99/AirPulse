import React from 'react';
import { Github, Mail, Globe } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-emerald-900/20 border-t border-emerald-700/20 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/6 flex items-center justify-center">
            <Globe className="text-emerald-200" />
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-100">AirPulse</div>
            <div className="text-xs text-emerald-300">Realtime air-quality monitoring</div>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-emerald-200 text-sm">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/map" className="hover:underline">Map</a>
          <a href="/info" className="hover:underline">System Info</a>
          <a href="/terms" className="hover:underline">Terms</a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="https://github.com/your-org/airpulse" target="_blank" rel="noreferrer" className="text-emerald-200 hover:text-white">
            <Github />
          </a>
          <a href="mailto:support@airpulse.example" className="text-emerald-200 hover:text-white">
            <Mail />
          </a>
          <div className="text-emerald-300 text-xs">© {year} AirPulse — Built for community sensing</div>
        </div>
      </div>
    </footer>
  );
}