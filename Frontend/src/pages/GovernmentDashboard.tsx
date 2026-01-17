import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { KPICard } from '../components/KPICard';
import { TimelineSelector } from '../components/TimelineSelector';
import { MapComponent } from '../components/MapComponent';
import { Chatbot } from '../components/Chatbot';
import { apiService, timelineOptions } from '../services/api';
import { mapService } from '../services/mapService';
import type { KPIData } from '../types';
import { BarChart3, TrendingUp, Users, AlertTriangle, Activity, MapPin, Wind, Car } from 'lucide-react';
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
  AreaChart,
  Area
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
  { name: 'West Zone', value: 145, color: '#00e400' },
  { name: 'East Zone', value: 168, color: '#ff7e00' },
  { name: 'North Zone', value: 152, color: '#ffff00' },
  { name: 'South Zone', value: 158, color: '#ff7e00' }
];

const trafficData = [
  { hour: '6AM', flow: 45 },
  { hour: '8AM', flow: 85 },
  { hour: '10AM', flow: 65 },
  { hour: '12PM', flow: 70 },
  { hour: '2PM', flow: 75 },
  { hour: '4PM', flow: 90 },
  { hour: '6PM', flow: 95 },
  { hour: '8PM', flow: 60 },
  { hour: '10PM', flow: 35 }
];

export const GovernmentDashboard: React.FC = () => {
  const { user } = useAuth(); // ✅ logout handled in Sidebar
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState('current');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex min-h-screen bg-[#D1E7F0]">
      <Sidebar userRole="government" />

      <main className="flex-1 ml-64 p-6 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Government Dashboard
          </h1>
          <p className="text-gray-600">
            Advanced analytics and city-wide monitoring
          </p>
        </div>

        {/* CITY MAP */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            Live City Map with AQI & Traffic
          </h3>
          <MapComponent layers={['aqi', 'traffic']} />
        </div>

        {/* COMPREHENSIVE ANALYTICS */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Zone-wise AQI Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wind className="text-green-600" size={20} />
              Zone AQI Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={zoneData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`AQI: ${value}`, 'Zone']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1">
              {zoneData.map((zone, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: zone.color }}></div>
                    <span>{zone.name}</span>
                  </div>
                  <span className="font-semibold">{zone.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Flow Pattern */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Car className="text-blue-600" size={20} />
              Daily Traffic Flow
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="flow" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Real-time Metrics */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="text-red-600" size={20} />
              Real-time Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">City Average AQI</span>
                  <span className="font-bold text-orange-600">156</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Traffic Congestion</span>
                  <span className="font-bold text-blue-600">74%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Healthcare Load</span>
                  <span className="font-bold text-green-600">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm font-medium text-red-800">High AQI Alert</p>
                <p className="text-xs text-red-600">East Zone exceeds safe levels</p>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-sm font-medium text-yellow-800">Traffic Peak</p>
                <p className="text-xs text-yellow-600">Evening rush hour congestion</p>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-sm font-medium text-green-800">Healthcare Stable</p>
                <p className="text-xs text-green-600">All facilities operating normally</p>
              </div>
            </div>
          </div>
        </div>

        {/* CITY-WIDE ANALYTICS */}
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              City-Wide Analytics
            </h2>
            <TimelineSelector
              options={timelineOptions}
              selected={selectedTimeline}
              onChange={setSelectedTimeline}
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : kpiData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <KPICard
                title="Air Quality Index"
                value={kpiData.aqi}
                color="blue"
                trend="up"
                icon={<AlertTriangle size={20} />}
                onClick={() => navigate('/air-quality')}
              />
              <KPICard
                title="Traffic Congestion"
                value={kpiData.traffic}
                unit="%"
                color="blue"
                trend="up"
                icon={<TrendingUp size={20} />}
                onClick={() => navigate('/traffic-congestion')}
              />
              <KPICard
                title="Healthcare Load"
                value={kpiData.healthcare}
                unit="%"
                color="blue"
                icon={<BarChart3 size={20} />}
                onClick={() => navigate('/healthcare-load')}
              />
              <KPICard
                title="School Performance"
                value={kpiData.schools}
                unit="%"
                color="blue"
                trend="down"
                icon={<Users size={20} />}
                onClick={() => navigate('/school-performance')}
              />
              <KPICard
                title="Urban Development"
                value={kpiData.urbanDevelopment}
                unit="%"
                color="blue"
                icon={<BarChart3 size={20} />}
                onClick={() => navigate('/urban-development')}
              />
            </div>
          )}
        </div>

        {/* TRENDS + CHATBOT */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={20} />
              Multi-Parameter Trend Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} name="AQI" />
                <Line type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={2} name="Traffic %" />
                <Line type="monotone" dataKey="healthcare" stroke="#10b981" strokeWidth={2} name="Healthcare %" />
                <Line type="monotone" dataKey="education" stroke="#f59e0b" strokeWidth={2} name="Education %" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Air Quality Index</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Traffic Congestion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Healthcare Load</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Education Performance</span>
              </div>
            </div>
          </div>

          <Chatbot />
        </div>

        {/* ACTION PANELS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              Active Alerts
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                <AlertTriangle size={16} className="text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Critical AQI in East Zone</p>
                  <p className="text-red-600 text-xs">AQI: 168 - Immediate action required</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                <AlertTriangle size={16} className="text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Heavy Traffic on SG Highway</p>
                  <p className="text-yellow-600 text-xs">95% congestion during peak hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Activity size={16} className="text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Healthcare Capacity Alert</p>
                  <p className="text-blue-600 text-xs">89% utilization in North Zone</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="text-purple-600" size={20} />
              Predictive Analytics
            </h3>
            <div className="space-y-4">
              <div className="p-3 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Next Week AQI Forecast</span>
                  <span className="text-lg font-bold text-red-600">165 ↑</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Expected 6% increase</p>
              </div>
              <div className="p-3 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Traffic Trend</span>
                  <span className="text-lg font-bold text-blue-600">+5% ↑</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '79%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Peak hour congestion rising</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary text-left text-sm p-3 hover:bg-blue-50">
                📊 Export Analytics Report
              </button>
              <button className="w-full btn-secondary text-left text-sm p-3 hover:bg-green-50">
                📋 Schedule Policy Review
              </button>
              <button className="w-full btn-secondary text-left text-sm p-3 hover:bg-purple-50">
                🎯 Run Scenario Analysis
              </button>
              <button className="w-full btn-secondary text-left text-sm p-3 hover:bg-yellow-50">
                📱 Send Public Alert
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
