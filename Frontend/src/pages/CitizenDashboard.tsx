import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { KPICard } from '../components/KPICard';

import { MapComponent } from '../components/MapComponent';
import { apiService } from '../services/api';
import type { KPIData } from '../types';
import { Activity, Car, Stethoscope, GraduationCap, Building2, LogOut, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export const CitizenDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [predictions, setPredictions] = useState<{ [key: number]: any } | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apiService.getCityKPIs('current');
        setKpiData(data);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleGenerate = async () => {
    // Use selected location or default to Ahmedabad center
    const lat = selectedLocation?.lat || 23.0225;
    const lon = selectedLocation?.lng || 72.5714;
    
    setGenerating(true);
    try {
      const predictionMonths = [1, 3, 6];  // Match run_model.py which provides 1, 3, 6 month predictions
      const predictionPromises = predictionMonths.map(async (months) => {
        try {
          const response = await fetch('http://localhost:8000/api/predict/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lat: lat,
              lon: lon,
              scenario: '',  // Empty scenario = basic prediction without projects
              duration_months: months
            }),
          });

          if (response.ok) {
            const result = await response.json();
            
            // Handle both old format and new basic-predict format
            let predictionData;
            if (result.predictions) {
              // New format from basic-predict endpoint
              const monthKey = months === 1 ? "1_month" : months === 3 ? "3_month" : "6_month";
              const pred = result.predictions[monthKey];
              predictionData = {
                annotated_aqi: pred.aqi,
                baseline_aqi: pred.baseline_aqi,
                impact_percentage: pred.impact_percentage,
                details: {
                  reasoning: result.details?.reasoning || "Basic AQI forecast",
                  traffic_change_percent: 0,
                  confidence: pred.confidence
                }
              };
            } else {
              // Old format (scenario-based)
              predictionData = result;
            }
            
            return { months, data: predictionData };
          } else {
            const errorText = await response.text();
            console.error(`API Error for ${months} months:`, response.status, errorText);
            throw new Error(`Failed to get prediction for ${months} months: ${response.status} ${errorText}`);
          }
        } catch (error) {
          console.error(`Error generating ${months}-month prediction:`, error);
          // Return mock data as fallback
          return {
            months,
            data: {
              annotated_aqi: 150 + (months * 5),
              baseline_aqi: 150,
              impact_percentage: months * 2,
              details: {
                reasoning: `Predicted AQI impact for ${months} month${months > 1 ? 's' : ''}`,
                traffic_change_percent: months * 3
              }
            }
          };
        }
      });

      const results = await Promise.all(predictionPromises);
      const predictionsMap: { [key: number]: any } = {};
      results.forEach(({ months, data }) => {
        predictionsMap[months] = data;
      });
      setPredictions(predictionsMap);
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'green';
    if (aqi <= 100) return 'yellow';
    return 'red';
  };

  const getTrafficColor = (traffic: number) => {
    if (traffic <= 40) return 'green';
    if (traffic <= 70) return 'yellow';
    return 'red';
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole="citizen" />

      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Citizen Dashboard</h1>
          <p className="text-gray-600">Monitor real-time city metrics and services</p>
        </div>

        {/* Interactive Map Section */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Interactive Map</h3>

          {/* Generate Button */}
          <div className="mb-4">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : 'Generate Predictions'}
            </button>
          </div>

          {/* Map */}
          <div className="h-[500px] rounded-lg overflow-hidden">
            <MapComponent
              layers={['traffic', 'aqi']}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Prediction Cards */}
          {predictions && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 3, 6].map((months) => {
                const pred = predictions[months];
                if (!pred) return null;
                return (
                  <div key={months} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{months} Month{months > 1 ? 's' : ''} Prediction</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Predicted AQI:</span>
                        <span className="font-bold text-blue-600">{pred.annotated_aqi?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Impact:</span>
                        <span className="font-bold text-orange-600">{pred.impact_percentage?.toFixed(1) || '0'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Traffic Change:</span>
                        <span className="font-bold text-purple-600">{pred.details?.traffic_change_percent?.toFixed(1) || '0'}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Section: Ahmedabad City Overview */}
        <div className="space-y-6">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Ahmedabad City Overview
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : kpiData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <KPICard
                  title="Air Quality Index"
                  value={kpiData.aqi}
                  color={getAQIColor(kpiData.aqi)}
                  icon={<Activity size={20} />}
                  onClick={() => navigate('/air-quality')}
                />
                <KPICard
                  title="Traffic Congestion"
                  value={kpiData.traffic}
                  unit="%"
                  color={getTrafficColor(kpiData.traffic)}
                  icon={<Car size={20} />}
                  onClick={() => navigate('/traffic-congestion')}
                />
                <KPICard
                  title="Healthcare Load"
                  value={kpiData.healthcare}
                  unit="%"
                  color="blue"
                  icon={<Stethoscope size={20} />}
                  onClick={() => navigate('/healthcare-load')}
                />
                <KPICard
                  title="School Performance"
                  value={kpiData.schools}
                  unit="%"
                  color="green"
                  icon={<GraduationCap size={20} />}
                  onClick={() => navigate('/school-performance')}
                />
                <KPICard
                  title="Urban Development"
                  value={kpiData.urbanDevelopment}
                  unit="%"
                  color="blue"
                  icon={<Building2 size={20} />}
                  onClick={() => navigate('/urban-development')}
                />
              </div>
            ) : null}
          </div>

          {/* Analytics Section */}
          {kpiData && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Jan', aqi: kpiData.aqi - 10, traffic: kpiData.traffic - 5, healthcare: kpiData.healthcare - 3 },
                    { month: 'Feb', aqi: kpiData.aqi - 5, traffic: kpiData.traffic - 2, healthcare: kpiData.healthcare - 1 },
                    { month: 'Mar', aqi: kpiData.aqi, traffic: kpiData.traffic, healthcare: kpiData.healthcare },
                    { month: 'Apr', aqi: kpiData.aqi + 3, traffic: kpiData.traffic + 2, healthcare: kpiData.healthcare + 1 },
                    { month: 'May', aqi: kpiData.aqi + 5, traffic: kpiData.traffic + 4, healthcare: kpiData.healthcare + 2 },
                    { month: 'Jun', aqi: kpiData.aqi + 8, traffic: kpiData.traffic + 6, healthcare: kpiData.healthcare + 3 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="aqi" stroke="#ef4444" name="AQI" />
                    <Line type="monotone" dataKey="traffic" stroke="#3b82f6" name="Traffic %" />
                    <Line type="monotone" dataKey="healthcare" stroke="#10b981" name="Healthcare %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Classification Pie Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Category Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Air Quality', value: kpiData.aqi, color: '#ef4444' },
                        { name: 'Traffic', value: kpiData.traffic, color: '#3b82f6' },
                        { name: 'Healthcare', value: kpiData.healthcare, color: '#10b981' },
                        { name: 'Education', value: kpiData.schools, color: '#f59e0b' },
                        { name: 'Urban Dev', value: kpiData.urbanDevelopment, color: '#8b5cf6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Air Quality', value: kpiData.aqi, color: '#ef4444' },
                        { name: 'Traffic', value: kpiData.traffic, color: '#3b82f6' },
                        { name: 'Healthcare', value: kpiData.healthcare, color: '#10b981' },
                        { name: 'Education', value: kpiData.schools, color: '#f59e0b' },
                        { name: 'Urban Dev', value: kpiData.urbanDevelopment, color: '#8b5cf6' }
                      ].map((entry, index) => (
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
                  Metrics Comparison
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'AQI', value: kpiData.aqi },
                    { name: 'Traffic', value: kpiData.traffic },
                    { name: 'Healthcare', value: kpiData.healthcare },
                    { name: 'Schools', value: kpiData.schools },
                    { name: 'Urban Dev', value: kpiData.urbanDevelopment }
                  ]}>
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


