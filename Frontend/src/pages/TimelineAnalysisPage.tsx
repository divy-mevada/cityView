import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Calendar, TrendingUp, BarChart3, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const timelineData = [
  { period: 'Q1 2023', aqi: 145, traffic: 68, healthcare: 75, schools: 82 },
  { period: 'Q2 2023', aqi: 152, traffic: 72, healthcare: 78, schools: 84 },
  { period: 'Q3 2023', aqi: 148, traffic: 75, healthcare: 72, schools: 86 },
  { period: 'Q4 2023', aqi: 156, traffic: 72, healthcare: 80, schools: 83 },
  { period: 'Q1 2024', aqi: 162, traffic: 78, healthcare: 85, schools: 88 },
  { period: 'Q2 2024', aqi: 158, traffic: 74, healthcare: 82, schools: 90 },
];

export const TimelineAnalysisPage: React.FC = () => {
  const { logout } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState('aqi');

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole="government" />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Timeline Analysis</h1>
          <p className="text-gray-600">Historical trends and temporal analysis of city metrics</p>
        </div>

        {/* Metric Selector */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Metric</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedMetric('aqi')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMetric === 'aqi'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Air Quality Index
            </button>
            <button
              onClick={() => setSelectedMetric('traffic')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMetric === 'traffic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Traffic Congestion
            </button>
            <button
              onClick={() => setSelectedMetric('healthcare')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMetric === 'healthcare'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Healthcare Load
            </button>
            <button
              onClick={() => setSelectedMetric('schools')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMetric === 'schools'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              School Performance
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Timeline Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Timeline Trend - {selectedMetric.toUpperCase()}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name={selectedMetric.toUpperCase()}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Comparative Bar Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Quarterly Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={selectedMetric} fill="#3b82f6" name={selectedMetric.toUpperCase()} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timeline Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Best Quarter</h4>
              <p className="text-sm text-blue-700">
                Q3 2023 showed the best performance with optimal metrics across all categories.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Trend Analysis</h4>
              <p className="text-sm text-yellow-700">
                Overall upward trend in most metrics, indicating need for intervention strategies.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Recommendations</h4>
              <p className="text-sm text-green-700">
                Focus on sustainable development and infrastructure improvements for Q3 2024.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Logout Button - Fixed at bottom left */}
      <button
        onClick={logout}
        className="fixed bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors z-50"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
};