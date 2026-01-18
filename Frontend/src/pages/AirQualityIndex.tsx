import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { apiService } from '../services/api';
import { Activity, Wind, AlertTriangle, TrendingUp, LogOut, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';

const timeRangeOptions = [
  { label: '1 Month', value: 1 },
  { label: '3 Months', value: 3 },
  { label: '5 Months', value: 5 }
];

export const AirQualityIndex: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedRange, setSelectedRange] = useState(1);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [predictedData, setPredictedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAQI, setCurrentAQI] = useState<number | null>(null);
  const [zoneDistribution, setZoneDistribution] = useState<any[]>([]);

  // Determine user role based on current path or user data
  const userRole = user?.role || 'citizen';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historical, predicted, kpiData] = await Promise.all([
          apiService.getKPIHistoricalData('aqi', selectedRange),
          apiService.getKPIPredictedData('aqi', selectedRange),
          apiService.getCityKPIs('current')
        ]);
        setHistoricalData(historical);
        setPredictedData(predicted);
        setCurrentAQI(kpiData.aqi);
        
        // Generate zone distribution data
        setZoneDistribution([
          { name: 'West Zone', value: kpiData.aqi - 10, color: '#00e400' },
          { name: 'East Zone', value: kpiData.aqi + 15, color: '#ff7e00' },
          { name: 'North Zone', value: kpiData.aqi - 5, color: '#ffff00' },
          { name: 'South Zone', value: kpiData.aqi + 8, color: '#ff7e00' },
          { name: 'Central Zone', value: kpiData.aqi + 3, color: '#ffff00' }
        ]);
      } catch (error) {
        console.error('Error fetching AQI data:', error);
        // Set fallback data
        setCurrentAQI(156);
        setZoneDistribution([
          { name: 'West Zone', value: 145, color: '#00e400' },
          { name: 'East Zone', value: 168, color: '#ff7e00' },
          { name: 'North Zone', value: 152, color: '#ffff00' },
          { name: 'South Zone', value: 158, color: '#ff7e00' },
          { name: 'Central Zone', value: 156, color: '#ffff00' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRange]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole={userRole as 'citizen' | 'government'} />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Air Quality Index</h1>
          <p className="text-gray-600">Monitor air quality trends and forecasts</p>
        </div>
        {/* Time Range Selector */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Time Range</h3>
          <div className="flex space-x-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedRange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRange === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-6">
            {/* Current AQI Stats */}
            {currentAQI && (
              <div className="grid md:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Current AQI</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{currentAQI}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentAQI <= 50 ? 'Good' : currentAQI <= 100 ? 'Moderate' : currentAQI <= 150 ? 'Unhealthy for Sensitive' : 'Unhealthy'}
                  </p>
                </div>
                <div className="card bg-gradient-to-br from-orange-50 to-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">PM2.5</h3>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">{(currentAQI * 0.8).toFixed(1)}</p>
                  <p className="text-sm text-gray-600 mt-1">μg/m³</p>
                </div>
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">PM10</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{(currentAQI * 1.2).toFixed(1)}</p>
                  <p className="text-sm text-gray-600 mt-1">μg/m³</p>
                </div>
                <div className="card bg-gradient-to-br from-yellow-50 to-amber-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Trend</h3>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">+2.5%</p>
                  <p className="text-sm text-gray-600 mt-1">vs last month</p>
                </div>
              </div>
            )}

            {/* Main Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Historical Graph */}
              <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Current / Historical Values
                  </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Predicted Graph */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Predicted / Forecast Values
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Zone Distribution Pie Chart */}
            {zoneDistribution.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Zone-wise AQI Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={zoneDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {zoneDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Zone Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={zoneDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
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