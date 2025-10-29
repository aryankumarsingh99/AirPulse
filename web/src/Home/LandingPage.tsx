import React, { useState } from 'react';
import { Globe, BarChart3, Bell, MapPin, DownloadCloud } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Dashboard from './Dashboard';

const headerVariant = {
  hidden: { y: -18, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } }
};

const heroVariant = {
  hidden: { scale: 0.98, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 90, damping: 12, delay: 0.08 } }
};

const cardsVariant = {
  hidden: { y: 12, opacity: 0 },
  show: (i = 1) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.08 * i, duration: 0.45, ease: 'easeOut' }
  })
};

const floatSlow = {
  animate: { y: [0, -8, 0], rotate: [0, 1.5, 0] },
  transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
};

export default function LandingPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  const reduce = useReducedMotion();

  if (showDashboard) return <Dashboard />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-slate-900 to-blue-900 text-white">
      {/* subtle floating blobs */}
      <motion.div
        aria-hidden
        className="absolute -left-24 -top-28 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-blue-800/30 via-blue-700/20 to-sky-600/10 blur-3xl opacity-65 pointer-events-none"
        {...(reduce ? {} : { animate: floatSlow.animate, transition: floatSlow.transition })}
      />
      <motion.div
        aria-hidden
        className="absolute right-[-120px] top-28 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-sky-700/20 via-blue-800/10 to-black/10 blur-2xl opacity-55 pointer-events-none"
        {...(reduce ? {} : { animate: { y: [0, 6, 0] }, transition: { duration: 14, repeat: Infinity, ease: 'easeInOut' } })}
      />

      <motion.header initial="hidden" animate="show" variants={headerVariant} className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -8, scale: 0.9, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 110, damping: 14 }}
            className="w-12 h-12 rounded-full bg-white/6 flex items-center justify-center backdrop-blur-sm overflow-hidden"
          >
            {/* Logo in a circle */}
            <img src="/AirPulse1.jpg" alt="AirPulse logo" className="w-10 h-10 object-cover rounded-full" />
          </motion.div>

          <div>
            <div className="text-lg font-bold">AirPulse</div>
            <div className="text-xs text-sky-300">Realtime air-quality monitoring</div>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowDashboard(true)} className="px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800/80">
            Dashboard
          </motion.button>

          <motion.a whileHover={{ scale: 1.03 }} href="/map" className="px-3 py-2 rounded-lg bg-slate-900/20 hover:bg-slate-900/30 text-sky-100">
            Map
          </motion.a>

          <motion.a whileHover={{ scale: 1.03 }} href="/info" className="px-3 py-2 rounded-lg bg-slate-900/20 hover:bg-slate-900/30 text-sky-100">
            Info
          </motion.a>
        </nav>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10 items-center relative z-10">
        <motion.section initial="hidden" animate="show" variants={heroVariant} className="flex-1">
          <motion.h1 initial={{ x: -36, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            AirPulse — realtime air quality for your city
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12, duration: 0.6 }} className="text-sky-200 max-w-xl mb-6">
            Monitor distributed sensor nodes, view satellite maps, receive alerts and analyze trends.
            Built for low-power devices, edge gateways and modern dashboards.
          </motion.p>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowDashboard(true)}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 160 }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-2xl"
            >
              <BarChart3 /> Get started
            </motion.button>

            <motion.a whileHover={{ scale: 1.03 }} href="/map" className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900/20 hover:bg-slate-900/30 text-sky-100">
              <MapPin /> View map
            </motion.a>

            <motion.a whileHover={{ scale: 1.03 }} href="/download" className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900/10 hover:bg-slate-900/20 text-sky-100">
              <DownloadCloud /> Download SDK
            </motion.a>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            <motion.div custom={1} initial="hidden" animate="show" variants={cardsVariant} className="p-4 rounded-xl bg-slate-900/20 border border-slate-700/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-slate-800/40"><Bell /></div>
                <div>
                  <div className="text-sm font-semibold">Alerts & Notifications</div>
                  <div className="text-xs text-sky-300">Real-time alerts via SMS, email and app</div>
                </div>
              </div>
            </motion.div>

            <motion.div custom={2} initial="hidden" animate="show" variants={cardsVariant} className="p-4 rounded-xl bg-slate-900/20 border border-slate-700/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-slate-800/40"><Globe /></div>
                <div>
                  <div className="text-sm font-semibold">Satellite Map</div>
                  <div className="text-xs text-sky-300">High-resolution basemaps and markers</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.aside initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.12 }} className="w-full lg:w-96 bg-black/10 border border-slate-800/20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="text-sky-200 text-sm mb-3">Quick stats</div>
          <div className="grid grid-cols-2 gap-3">
            <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.14 }} className="p-3 rounded-lg bg-slate-900/20">
              <div className="text-xs text-sky-300">Stations</div>
              <div className="text-lg font-semibold">12 online</div>
            </motion.div>
            <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }} className="p-3 rounded-lg bg-slate-900/20">
              <div className="text-xs text-sky-300">Active alerts</div>
              <div className="text-lg font-semibold">2</div>
            </motion.div>
            <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }} className="p-3 rounded-lg bg-slate-900/20">
              <div className="text-xs text-sky-300">Avg PM2.5</div>
              <div className="text-lg font-semibold">82 µg/m³</div>
            </motion.div>
            <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.26 }} className="p-3 rounded-lg bg-slate-900/20">
              <div className="text-xs text-sky-300">Region</div>
              <div className="text-lg font-semibold">Rourkela</div>
            </motion.div>
          </div>

          <div className="mt-4 text-sky-300 text-sm">
            <div className="font-medium mb-1">Deploy</div>
            <div className="text-xs">Use our open SDKs and lightweight sensors to collect data.</div>
          </div>
        </motion.aside>
      </main>

      <footer className="relative z-10 border-t border-slate-800/20 mt-12 py-6 bg-gradient-to-b from-transparent to-black/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sky-200 text-sm">© {new Date().getFullYear()} AirPulse — Built for community sensing</div>
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-sky-200 text-sm underline">Terms</a>
            <a href="/privacy" className="text-sky-200 text-sm underline">Privacy</a>
            <a href="/info" className="text-sky-200 text-sm underline">System info</a>
          </div>
        </div>
      </footer>
    </div>
  );
}