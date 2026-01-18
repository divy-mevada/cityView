import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { KPICard } from '../components/KPICard';
import { TimelineSelector } from '../components/TimelineSelector';
import { MapComponent } from '../components/MapComponent';
import { Chatbot } from '../components/Chatbot';
import { apiService, timelineOptions } from '../services/api';
import type { KPIData } from '../types';
import { 
  BarChart3, TrendingUp, Users, AlertTriangle, 
  Activity, MapPin, Wind, Car, LayoutDashboard,
  Download, FileText, Settings, Send
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, 
  Cell, AreaChart, Area
} from 'recharts';

const mockChartData = [
  { month: 'Jan', aqi: 145, traffic: 68, healthcare: 82, education: 89 },
  { month: 'Feb', aqi: 152, traffic: 72, healthcare: 85, education: 91 },
  { month: 'Mar', aqi: 148, traffic: 75, healthcare: 88, education: 87 },
  { month: 'Apr', aqi: 156, traffic: 72, healthcare: 84, education: 93 },
  { month: 'May', aqi: 162, traffic: 78, healthcare: 86, education: 90 },
  { month: 'Jun', aqi: 158, traffic: 74, healthcare: 89, education: 92 }
];

const zoneData = [
  { name: 'West Zone', value: 145, color: '#10B981' },
  { name: 'East Zone', value: 168, color: '#F59E0B' },
  { name: 'North Zone', value: 152, color: '#3B82F6' },
  { name: 'South Zone', value: 158, color: '#6366F1' }
];

const trafficData = [
  { hour: '6AM', flow: 45 }, { hour: '8AM', flow: 85 },
  { hour: '10AM', flow: 65 }, { hour: '12PM', flow: 70 },
  { hour: '2PM', flow: 75 }, { hour: '4PM', flow: 90 },
  { hour: '6PM', flow: 95 }, { hour: '8PM', flow: 60 },
  { hour: '10PM', flow: 35 }
];

// Glassmorphism Shared Styles
const glassCard = "bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-white/80";

export const GovernmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState('current');
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [predictions, setPredictions] = useState<{ [key: number]: any } | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apiService.getCityKPIs(selectedTimeline);
        setKpiData(data);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTimeline]);

  const handleGenerate = async () => {
    const lat = selectedLocation?.lat || 23.0225;
    const lon = selectedLocation?.lng || 72.5714;
    
    setGenerating(true);
    try {
      const predictionMonths = [1, 3, 6];
      const predictionPromises = predictionMonths.map(async (months) => {
        const response = await fetch('http://localhost:8000/api/predict/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat, lon, scenario: '', duration_months: months
          }),
        });

        if (response.ok) {
          const result = await response.json();
          let predictionData = result.predictions ? {
            annotated_aqi: result.predictions[months === 1 ? "1_month" : months === 3 ? "3_month" : "6_month"].aqi,
            impact_percentage: result.predictions[months === 1 ? "1_month" : months === 3 ? "3_month" : "6_month"].impact_percentage,
            details: {
              reasoning: result.details?.reasoning || "AI Analysis successful",
              traffic_change_percent: months * 2.5
            }
          } : result;
          return { months, data: predictionData };
        }
        throw new Error('API Error');
      });

      const results = await Promise.all(predictionPromises);
      const predictionsMap: { [key: number]: any } = {};
      results.forEach(({ months, data }) => { predictionsMap[months] = data; });
      setPredictions(predictionsMap);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#F8FAFC] to-[#DBEAFE]">
      <Sidebar userRole="government" />

      <main className="flex-1 ml-64 p-8 space-y-8">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Government Insights
              </h1>
            </div>
            <p className="text-slate-500 font-medium">
              Monitoring Ahmedabad City Infrastructure & Environment
              {user?.username ? ` • Signed in as ${user.username}` : ''}
            </p>
          </div>
          
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-slate-200 rounded-xl text-slate-700 hover:bg-white transition-all shadow-sm">
                <Download size={18} /> Export Data
             </button>
          </div>
        </div>

        {/* MAIN MAP SECTION */}
        <div className={glassCard}>
          <div className="p-6 border-b border-white/20 flex items-center justify-between bg-white/30">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="text-blue-500" size={22} />
              Live Geospatial Monitoring
            </h3>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                generating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {generating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <Activity size={18} />}
              {generating ? 'Processing AI...' : 'Generate Future Predictions'}
            </button>
          </div>
          <div className="p-4">
            <div className="h-[450px] rounded-xl overflow-hidden shadow-inner border border-slate-200/50">
              <MapComponent layers={['aqi', 'traffic']} onLocationSelect={handleLocationSelect} />
            </div>
          </div>

          {predictions && (
            <div className="p-6 bg-blue-50/50 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 3, 6].map((months) => (
                <div key={months} className="bg-white/80 p-5 rounded-2xl border border-blue-100 shadow-sm hover:translate-y-[-4px] transition-transform">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-500">{months} Month Forecast</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-800">{predictions[months]?.annotated_aqi?.toFixed(0)}</span>
                    <span className="text-sm font-bold text-slate-500">AQI</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Net Impact</span>
                      <span className="font-bold text-orange-500">+{predictions[months]?.impact_percentage?.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${Math.min(predictions[months]?.impact_percentage * 5, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ANALYTICS ROW */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className={glassCard + " p-6"}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Wind size={16} className="text-emerald-500" /> Zone Distribution
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={zoneData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {zoneData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {zoneData.map((zone, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }}></div>
                    {zone.name}
                  </div>
                  <span>{zone.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={glassCard + " p-6"}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Car size={16} className="text-blue-500" /> Traffic Flow
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="flow" stroke="#3B82F6" fillOpacity={1} fill="url(#colorFlow)" />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={glassCard + " p-6"}>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Live Indicators</h3>
             <div className="space-y-6">
                {[
                  { label: 'Avg AQI', val: 156, color: 'bg-orange-500', text: 'text-orange-600' },
                  { label: 'Congestion', val: 74, color: 'bg-blue-500', text: 'text-blue-600' },
                  { label: 'Health Load', val: 89, color: 'bg-emerald-500', text: 'text-emerald-600' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5 text-xs font-black uppercase tracking-tighter">
                      <span className="text-slate-500">{item.label}</span>
                      <span className={item.text}>{item.val}{item.label === 'Avg AQI' ? '' : '%'}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className={glassCard + " p-6 bg-slate-900/90 text-white"}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Intelligence Feed</h3>
            <div className="space-y-3">
               <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <p className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Critical Alert</p>
                  <p className="text-xs text-slate-300">East Zone AQI surpassed 168 threshold.</p>
               </div>
               <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <p className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1"><TrendingUp size={12}/> Traffic Pattern</p>
                  <p className="text-xs text-slate-300">SG Highway congestion is 12% higher than last week.</p>
               </div>
            </div>
          </div>
        </div>

        {/* CITY KPI SECTION */}
        <div className={glassCard}>
           <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800">City-Wide Performance</h2>
              <TimelineSelector options={timelineOptions} selected={selectedTimeline} onChange={setSelectedTimeline} />
           </div>
           <div className="p-6">
              {loading ? (
                <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
              ) : kpiData && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <KPICard title="AQI Index" value={kpiData.aqi} color="blue" trend="up" icon={<Wind size={20} />} onClick={() => navigate('/air-quality')} />
                  <KPICard title="Traffic" value={kpiData.traffic} unit="%" color="blue" trend="up" icon={<Car size={20} />} onClick={() => navigate('/traffic-congestion')} />
                  <KPICard title="Health" value={kpiData.healthcare} unit="%" color="blue" icon={<Activity size={20} />} onClick={() => navigate('/healthcare-load')} />
                  <KPICard title="Schools" value={kpiData.schools} unit="%" color="blue" trend="down" icon={<Users size={20} />} onClick={() => navigate('/school-performance')} />
                  <KPICard title="Urban Dev" value={kpiData.urbanDevelopment} unit="%" color="blue" icon={<BarChart3 size={20} />} onClick={() => navigate('/urban-development')} />
                </div>
              )}
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className={`${glassCard} lg:col-span-2 p-8`}>
             <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               <TrendingUp className="text-indigo-500" /> Long-term Parameter Correlation
             </h3>
             <ResponsiveContainer width="100%" height={320}>
               <LineChart data={mockChartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                 <Line type="monotone" dataKey="aqi" stroke="#F43F5E" strokeWidth={4} dot={{r: 4, fill: '#F43F5E'}} />
                 <Line type="monotone" dataKey="traffic" stroke="#3B82F6" strokeWidth={4} dot={{r: 4, fill: '#3B82F6'}} />
                 <Line type="monotone" dataKey="healthcare" stroke="#10B981" strokeWidth={4} dot={{r: 4, fill: '#10B981'}} />
               </LineChart>
             </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-6">
             <Chatbot />
             <div className={glassCard + " p-6"}>
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Settings size={18} className="text-slate-500"/> Administrative Tools
               </h3>
               <div className="grid grid-cols-1 gap-3">
                  <button className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 hover:bg-blue-600 hover:text-white transition-all group">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-blue-500 transition-colors">
                      <FileText size={16} className="text-blue-600 group-hover:text-white" />
                    </div>
                    Generate PDF Report
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 hover:bg-emerald-600 hover:text-white transition-all group">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-emerald-500 transition-colors">
                      <Send size={16} className="text-emerald-600 group-hover:text-white" />
                    </div>
                    Broadcast Public Alert
                  </button>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};
