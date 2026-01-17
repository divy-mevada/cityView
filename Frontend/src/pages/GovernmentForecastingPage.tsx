import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Calendar, Target, AlertTriangle, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const forecastData = [
  { period: 'Jul', historical: 158, predicted: 165, confidence: 85 },
  { period: 'Aug', historical: null, predicted: 172, confidence: 82 },
  { period: 'Sep', historical: null, predicted: 168, confidence: 78 },
  { period: 'Oct', historical: null, predicted: 175, confidence: 75 },
  { period: 'Nov', historical: null, predicted: 180, confidence: 72 },
  { period: 'Dec', historical: null, predicted: 185, confidence: 68 },
];

const trafficForecast = [
  { period: 'Jul', historical: 74, predicted: 78, confidence: 88 },
  { period: 'Aug', historical: null, predicted: 82, confidence: 85 },
  { period: 'Sep', historical: null, predicted: 79, confidence: 82 },
  { period: 'Oct', historical: null, predicted: 85, confidence: 78 },
  { period: 'Nov', historical: null, predicted: 88, confidence: 75 },
  { period: 'Dec', historical: null, predicted: 92, confidence: 72 },
];

export const GovernmentForecastingPage: React.FC = () => {
  const { logout } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState('aqi');

  const getCurrentData = () => {
    return selectedMetric === 'aqi' ? forecastData : trafficForecast;
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole="government" />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Timeline-based Forecasting</h1>
          <p className="text-gray-600">Predictive analytics for city metrics</p>
        </div>

        {/* Metric Selector */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Metric</h3>
          <div className="flex gap-2">
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
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Forecast Chart */}
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              6-Month Forecast - {selectedMetric === 'aqi' ? 'Air Quality Index' : 'Traffic Congestion'}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Historical"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Details */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Forecast Accuracy
              </h3>
              <div className="space-y-3">
                {getCurrentData().slice(1, 4).map((item) => (
                  <div key={item.period} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.period}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{item.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Key Predictions
              </h3>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-800">High Risk Period</span>
                  </div>
                  <p className="text-xs text-red-700">
                    {selectedMetric === 'aqi' ? 'AQI expected to reach 185 in December' : 'Traffic congestion may reach 92% in December'}
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-semibold text-yellow-800">Trend Alert</span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    {selectedMetric === 'aqi' ? 'Steady increase of 4-6 points monthly' : 'Traffic increasing by 3-5% monthly'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
              <div className="space-y-2">
                {selectedMetric === 'aqi' ? (
                  <>
                    <div className="text-sm bg-blue-50 p-2 rounded">
                      • Implement stricter emission controls
                    </div>
                    <div className="text-sm bg-blue-50 p-2 rounded">
                      • Increase green cover initiatives
                    </div>
                    <div className="text-sm bg-blue-50 p-2 rounded">
                      • Promote electric vehicle adoption
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm bg-blue-50 p-2 rounded">
                      • Expand public transportation
                    </div>
                    <div className="text-sm bg-blue-50 p-2 rounded">
                      • Implement smart traffic signals
                    </div>
                    <div className="text-sm bg-blue-50 p-2 rounded">
                      • Create dedicated bus lanes
                    </div>
                  </>
                )}
              </div>
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