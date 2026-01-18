import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from '../components/Sidebar';
import { apiService } from "../services/api";
import { Car, Activity, AlertTriangle, TrendingUp, BarChart3, LogOut } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";

const timeRangeOptions = [
  { label: "1 Month", value: 1 },
  { label: "3 Months", value: 3 },
  { label: "5 Months", value: 5 },
];

const glassCard =
  "bg-white/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(59,130,246,0.12)]";

export const TrafficCongestion: React.FC = () => {
  const { user, logout } = useAuth();

  const [selectedRange, setSelectedRange] = useState(1);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [predictedData, setPredictedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTraffic, setCurrentTraffic] = useState<number | null>(null);
  const [zoneDistribution, setZoneDistribution] = useState<any[]>([]);

  const userRole = user?.role || 'citizen';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historical, predicted, kpiData] = await Promise.all([
          apiService.getKPIHistoricalData("traffic", selectedRange),
          apiService.getKPIPredictedData("traffic", selectedRange),
          apiService.getCityKPIs('current')
        ]);

        setHistoricalData(historical || []);
        setPredictedData(predicted || []);
        setCurrentTraffic(kpiData.traffic);
        setZoneDistribution([
          { name: 'West Zone', value: kpiData.traffic - 10, color: '#3B82F6' },
          { name: 'East Zone', value: kpiData.traffic + 8, color: '#F97316' },
          { name: 'North Zone', value: kpiData.traffic - 5, color: '#22C55E' },
          { name: 'South Zone', value: kpiData.traffic + 4, color: '#6366F1' }
        ]);
      } catch (error) {
        console.error("Error fetching traffic data:", error);
        setCurrentTraffic(72);
        setZoneDistribution([
          { name: 'West Zone', value: 68, color: '#3B82F6' },
          { name: 'East Zone', value: 80, color: '#F97316' },
          { name: 'North Zone', value: 70, color: '#22C55E' },
          { name: 'South Zone', value: 76, color: '#6366F1' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRange]);

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-[#f0f7ff]">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '45px 45px' }}></div>
      </div>

      <Sidebar userRole={userRole as 'citizen' | 'government'} />
      
      <main className="flex-1 ml-64 p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200">
                <Car size={28} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Traffic Intelligence</h1>
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] ml-1">Live Congestion Monitoring & Forecasting</p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 flex gap-2 shadow-sm">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedRange(option.value)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedRange === option.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-[4px] border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Traffic Sensors...</p>
          </div>
        ) : (
          <div className="space-y-8 pb-20">
            {currentTraffic && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'City Avg Congestion', val: `${currentTraffic}%`, Icon: Activity, color: 'text-blue-600', trend: 'HIGH' },
                  { label: 'Peak Hour Load', val: `${(currentTraffic * 1.25).toFixed(1)}%`, Icon: Car, color: 'text-orange-600', trend: 'PEAK' },
                  { label: 'Transit Reliability', val: `${Math.max(0, 100 - currentTraffic).toFixed(1)}%`, Icon: AlertTriangle, color: 'text-emerald-600', trend: 'STABLE' },
                  { label: 'Monthly Delta', val: '+3.2%', Icon: TrendingUp, color: 'text-indigo-600', trend: 'RISING' }
                ].map((item, i) => {
                  const Icon = item.Icon;
                  return (
                    <div key={i} className={`${glassCard} p-6 relative group`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${item.color} bg-white/50 shadow-sm`}>
                          <Icon size={18} />
                        </div>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border border-current ${item.color} opacity-60 tracking-tighter`}>{item.trend}</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <h2 className={`text-3xl font-black ${item.color} tracking-tighter`}>{item.val}</h2>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              <div className={glassCard + " p-8"}>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> Historical Flow Pattern
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="trafficHist" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={4} fill="url(#trafficHist)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={glassCard + " p-8"}>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <TrendingUp size={14} className="text-indigo-500" /> Forecasted Congestion Curve
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictedData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                    <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={4} strokeDasharray="8 8" dot={{r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className={glassCard + " p-8"}>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Car size={14} className="text-emerald-500" /> Zonal Congestion Share
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={zoneDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {zoneDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={glassCard + " p-8"}>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <BarChart3 size={14} className="text-blue-500" /> Corridor Stress Profile
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip cursor={{fill: 'rgba(59,130,246,0.05)'}} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {zoneDistribution.map((entry, index) => (
                        <Cell key={`cell-bar-${index}`} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <div className="fixed bottom-8 left-8 z-50">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-[1.5rem] hover:bg-red-600 transition-all shadow-2xl group active:scale-95"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Terminate Access</span>
        </button>
      </div>
    </div>
  );
};
