import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Simulated sensor data representing a standard 24-hr high-tech growth cycle
const generateInitialData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate day/night environmental cycles (Lights on from 6:00 to 18:00)
    const isDay = hour >= 6 && hour < 18;
    
    const vpd = isDay 
      ? +(1.2 + Math.sin(hour / 2) * 0.15 + Math.random() * 0.05).toFixed(2)
      : +(0.8 + Math.sin(hour / 2) * 0.08 + Math.random() * 0.03).toFixed(2);
      
    const temp = isDay
      ? +(79.5 + Math.sin(hour / 3) * 1.5 + Math.random() * 0.5).toFixed(1)
      : +(68.0 + Math.sin(hour / 3) * 1.0 + Math.random() * 0.4).toFixed(1);
      
    const humidity = isDay
      ? +(56 + Math.sin(hour / 2) * 4 + Math.random() * 2).toFixed(0)
      : +(64 + Math.sin(hour / 2) * 3 + Math.random() * 2).toFixed(0);
      
    const co2 = isDay 
      ? +(1200 + Math.sin(hour / 4) * 80 + Math.random() * 20).toFixed(0)
      : +(450 + Math.random() * 15).toFixed(0);

    // Drybacks (decreases throughout the day, increases during irrigation shots)
    // Shots are given from hour 7 to 11 (V1–V3 shots in crop steering)
    let dryback = 55;
    if (hour >= 6 && hour <= 12) {
      // Watering phase increases water content (so dryback indicator is low / moisture is high)
      dryback = +(35 + Math.sin(hour * 2.5) * 5 + Math.random() * 2).toFixed(1);
    } else {
      // Dryback phase
      const hrsSinceShot = hour > 12 ? (hour - 12) : (hour + 12);
      dryback = +(35 + hrsSinceShot * 1.8 + Math.random() * 1.5).toFixed(1);
    }
    
    // Substrate EC (concentrates as soil dries)
    const ec = +(3.8 + (dryback / 20) * 0.4 + Math.random() * 0.15).toFixed(2);

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      vpd,
      temp,
      humidity,
      co2,
      moisture: +(100 - dryback).toFixed(1), // Substrate Volumetric Water Content (VWC %)
      ec
    });
  }
  return data;
};

export default function SensorChart() {
  const [data, setData] = useState(generateInitialData());
  const [activeMetric, setActiveMetric] = useState<"environment" | "substrate">("environment");

  // Soft real-time ticks to update the dashboard sensor data
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const nextData = [...prevData.slice(1)];
        const last = prevData[prevData.length - 1];
        
        // Tick values slightly
        const time = new Date();
        const hour = time.getHours();
        const isDay = hour >= 6 && hour < 18;

        const vpd = isDay 
          ? +(1.2 + Math.sin(hour / 2) * 0.15 + Math.random() * 0.05).toFixed(2)
          : +(0.8 + Math.sin(hour / 2) * 0.08 + Math.random() * 0.03).toFixed(2);

        const temp = isDay
          ? +(79.5 + Math.sin(hour / 3) * 1.5 + Math.random() * 0.5).toFixed(1)
          : +(68.0 + Math.sin(hour / 3) * 1.0 + Math.random() * 0.4).toFixed(1);

        const humidity = isDay
          ? +(56 + Math.sin(hour / 2) * 4 + Math.random() * 2).toFixed(0)
          : +(64 + Math.sin(hour / 2) * 3 + Math.random() * 2).toFixed(0);

        const co2 = isDay 
          ? +(1200 + Math.sin(hour / 4) * 80 + Math.random() * 20).toFixed(0)
          : +(450 + Math.random() * 15).toFixed(0);

        let dryback = 55;
        if (hour >= 6 && hour <= 12) {
          dryback = +(35 + Math.sin(hour * 2.5) * 5 + Math.random() * 2).toFixed(1);
        } else {
          const hrsSinceShot = hour > 12 ? (hour - 12) : (hour + 12);
          dryback = +(35 + hrsSinceShot * 1.8 + Math.random() * 1.5).toFixed(1);
        }
        
        const ec = +(3.8 + (dryback / 20) * 0.4 + Math.random() * 0.15).toFixed(2);

        nextData.push({
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          vpd,
          temp,
          humidity,
          co2,
          moisture: +(100 - dryback).toFixed(1),
          ec
        });
        return nextData;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
      
      {/* Sensor Controls & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pl-2">
        <div>
          <span className="text-[10px] tracking-widest text-emerald-500 font-mono font-bold uppercase block mb-1">
            • Live Crop Steering Diagnostics
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Commercial Controlled Environment Integration
          </h3>
        </div>
        
        {/* Toggle between Air Environment and Substrate Root Zone */}
        <div className="flex bg-neutral-900 border border-neutral-800 p-0.5 rounded-md self-stretch sm:self-auto">
          <button
            onClick={() => setActiveMetric("environment")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded text-xs font-medium transition ${
              activeMetric === "environment"
                ? "bg-emerald-500 text-black font-semibold shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Air Climatology
          </button>
          <button
            onClick={() => setActiveMetric("substrate")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded text-xs font-medium transition ${
              activeMetric === "substrate"
                ? "bg-emerald-500 text-black font-semibold shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Root substrate
          </button>
        </div>
      </div>

      {/* Grid of latest metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pl-2">
        {activeMetric === "environment" ? (
          <>
            <div className="bg-neutral-900/50 border border-neutral-800/60 p-3 rounded-lg">
              <p className="text-neutral-500 font-mono text-[10px] uppercase">VPD (Vapor Pressure)</p>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{latest.vpd} <span className="text-xs text-neutral-400">kPa</span></p>
              <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (latest.vpd / 2) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-neutral-900/50 border border-neutral-800/60 p-3 rounded-lg">
              <p className="text-neutral-500 font-mono text-[10px] uppercase">Temperature</p>
              <p className="text-xl font-bold font-mono text-white mt-0.5">{latest.temp}°F</p>
              <span className="text-[9px] text-neutral-400 font-mono bg-neutral-800 px-1.5 py-0.5 rounded">Lights-on Optimal</span>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800/60 p-3 rounded-lg">
              <p className="text-neutral-500 font-mono text-[10px] uppercase">Relative Humidity</p>
              <p className="text-xl font-bold font-mono text-white mt-0.5">{latest.humidity}%</p>
              <span className="text-[9px] text-emerald-400 font-mono">Stable Transpiration</span>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800/60 p-3 rounded-lg">
              <p className="text-neutral-500 font-mono text-[10px] uppercase">Carbon Dioxide CO₂</p>
              <p className="text-xl font-bold font-mono text-emerald-500 mt-0.5">{latest.co2} <span className="text-xs text-neutral-400">PPM</span></p>
              <span className="text-[9px] text-neutral-400 font-mono">Enriched Saturation</span>
            </div>
          </>
        ) : (
          <>
            <div className="bg-neutral-900/50 border border-neutral-800/60 p-3 rounded-lg">
              <p className="text-neutral-500 font-mono text-[10px] uppercase">Substrate Water (VWC)</p>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{latest.moisture}%</p>
              <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${latest.moisture}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800/60 p-3 rounded-lg">
              <p className="text-neutral-500 font-mono text-[10px] uppercase">Root Zone EC</p>
              <p className="text-xl font-bold font-mono text-white mt-0.5">{latest.ec} <span className="text-xs text-neutral-400">mS/cm</span></p>
              <span className="text-[9px] text-emerald-400 font-mono">Generative Yield Feed</span>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800/60 p-3 rounded-lg">
              <p className="text-neutral-500 font-mono text-[10px] uppercase">Estimated Dryback</p>
              <p className="text-xl font-bold font-mono text-white mt-0.5">{(100 - latest.moisture).toFixed(1)}%</p>
              <span className="text-[9px] text-neutral-400 font-mono">Target: 12-15% Daily</span>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800/60 p-3 rounded-lg">
              <p className="text-neutral-500 font-mono text-[10px] uppercase">Substrate Type</p>
              <p className="text-xl font-bold font-emerald-400 mt-0.5 text-emerald-400">Coco Coir</p>
              <span className="text-[9px] text-neutral-400 font-mono">Rockwool Profile Available</span>
            </div>
          </>
        )}
      </div>

      {/* Chart Wrapper layout */}
      <div className="h-64 sm:h-72 w-full mt-4 bg-neutral-950/40 p-2 rounded border border-neutral-900">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === "environment" ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVpd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="time" stroke="#525252" fontSize={10} tickLine={false} />
              <YAxis stroke="#525252" fontSize={10} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "#404040", color: "#fff" }} 
                itemStyle={{ color: "#34d399" }}
                labelStyle={{ color: "#a3a3a3", fontSize: "11px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#a3a3a3" }} />
              <Area name="Vapor Pressure Deficit (kPa)" type="monotone" dataKey="vpd" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVpd)" />
              <Line name="Temperature (°F)" type="monotone" dataKey="temp" stroke="#e5e5e5" strokeWidth={1.5} dot={false} />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="time" stroke="#525252" fontSize={10} tickLine={false} />
              <YAxis stroke="#525252" fontSize={10} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "#404040", color: "#fff" }} 
                itemStyle={{ color: "#10b981" }}
                labelStyle={{ color: "#a3a3a3", fontSize: "11px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#a3a3a3" }} />
              <Line 
                name="Substrate Water Content (VWC %)" 
                type="monotone" 
                dataKey="moisture" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                dot={false}
              />
              <Line 
                name="Substrate Feeding EC (mS/cm)" 
                type="monotone" 
                dataKey="ec" 
                stroke="#a3a3a3" 
                strokeWidth={1.5} 
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mt-4 pl-2 text-[10px] text-neutral-500 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          REST API Core Engaged (960Hz Sync)
        </span>
        <span>Aroya, Trollmaster, Growlink connected via REST API</span>
      </div>
    </div>
  );
}
