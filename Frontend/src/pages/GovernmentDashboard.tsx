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
import { BarChart3, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockChartData = [
  { month: 'Jan', aqi: 145, traffic: 68 },
  { month: 'Feb', aqi: 152, traffic: 72 },
  { month: 'Mar', aqi: 148, traffic: 75 },
  { month: 'Apr', aqi: 156, traffic: 72 },
  { month: 'May', aqi: 162, traffic: 78 },
  { month: 'Jun', aqi: 158, traffic: 74 }
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
          <h3 className="text-lg font-semibold mb-4">
            City Map with Layers
          </h3>
          <MapComponent layers={['traffic', 'aqi', 'healthcare']} />
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
            <h3 className="text-lg font-semibold mb-4">
              Trend Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Chatbot />
        </div>

        {/* ACTION PANELS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Alerts</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={16} />
                High AQI in East Zone
              </div>
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle size={16} />
                Traffic congestion on SG Highway
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Forecasting</h3>
            <div className="text-sm space-y-2">
              <div>
                <span className="text-gray-600">Next Week AQI:</span>
                <span className="font-semibold ml-2">165 ↑</span>
              </div>
              <div>
                <span className="text-gray-600">Traffic Trend:</span>
                <span className="font-semibold ml-2">+5% ↑</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Scenarios</h3>
            <button className="w-full btn-secondary text-left text-sm mb-2">
              Scenario A: Traffic Reduction
            </button>
            <button className="w-full btn-secondary text-left text-sm">
              Scenario B: Green Initiatives
            </button>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <button className="w-full btn-primary text-sm mb-2">
              Generate Report
            </button>
            <button className="w-full btn-secondary text-sm mb-2">
              Export Data
            </button>
            <button className="w-full btn-secondary text-sm">
              Schedule Meeting
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
