import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { MapPin, TrendingUp, Clock, LogOut, BarChart3 } from 'lucide-react';
import { TimelineSelector } from '../components/TimelineSelector';
import { timelineOptions } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AreaDemandPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedTimeline, setSelectedTimeline] = useState('current');

  // Determine user role based on current path or user data
  const userRole = user?.role || 'citizen';

  const getDataByTimeline = (timeline: string) => {
    const baseData = {
      current: [
        { category: 'Residential', demand: 85, trend: 'up' },
        { category: 'Commercial', demand: 72, trend: 'down' },
        { category: 'Healthcare', demand: 91, trend: 'up' },
        { category: 'Education', demand: 78, trend: 'stable' },
        { category: 'Transportation', demand: 88, trend: 'up' },
      ],
      '1month': [
        { category: 'Residential', demand: 82, trend: 'up' },
        { category: 'Commercial', demand: 75, trend: 'up' },
        { category: 'Healthcare', demand: 88, trend: 'stable' },
        { category: 'Education', demand: 80, trend: 'up' },
        { category: 'Transportation', demand: 85, trend: 'down' },
      ],
      '3months': [
        { category: 'Residential', demand: 78, trend: 'down' },
        { category: 'Commercial', demand: 68, trend: 'down' },
        { category: 'Healthcare', demand: 85, trend: 'down' },
        { category: 'Education', demand: 75, trend: 'stable' },
        { category: 'Transportation', demand: 82, trend: 'up' },
      ],
      '5months': [
        { category: 'Residential', demand: 75, trend: 'stable' },
        { category: 'Commercial', demand: 65, trend: 'down' },
        { category: 'Healthcare', demand: 80, trend: 'down' },
        { category: 'Education', demand: 72, trend: 'down' },
        { category: 'Transportation', demand: 78, trend: 'stable' },
      ]
    };
    return baseData[timeline as keyof typeof baseData] || baseData.current;
  };

  const getPeakHoursData = (timeline: string) => {
    const baseData = {
      current: [85, 70, 55, 40],
      '1month': [80, 65, 50, 35],
      '3months': [75, 60, 45, 30],
      '5months': [70, 55, 40, 25]
    };
    return baseData[timeline as keyof typeof baseData] || baseData.current;
  };

  const demandData = getDataByTimeline(selectedTimeline);
  const peakHoursData = getPeakHoursData(selectedTimeline);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole={userRole as 'citizen' | 'government'} />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Area Demand Analysis</h1>
          <p className="text-gray-600">Analyze demand patterns across different areas in Ahmedabad</p>
        </div>

        <div className="space-y-6">
          {/* Demand Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Demand Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demandData.map((item) => (
                <div key={item.category} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.category}</h4>
                    <TrendingUp className={`w-4 h-4 ${
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.demand}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{item.demand}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Control */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <TimelineSelector
              options={timelineOptions}
              selected={selectedTimeline}
              onChange={setSelectedTimeline}
            />
          </div>

          {/* Demand Graph */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Demand Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#3b82f6" name="Demand %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Peak Hours Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Peak Hours Analysis</h3>
            <div className="grid grid-cols-4 gap-4">
              {['Morning', 'Afternoon', 'Evening', 'Night'].map((period, index) => (
                <div key={period} className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium text-gray-900">{period}</p>
                  <p className="text-lg font-bold text-blue-600">{peakHoursData[index]}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};