import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingUp, PieChart, Activity, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const analyticsData = [
  { month: 'Jan', aqi: 145, traffic: 68, healthcare: 75, schools: 82 },
  { month: 'Feb', aqi: 152, traffic: 72, healthcare: 78, schools: 84 },
  { month: 'Mar', aqi: 148, traffic: 75, healthcare: 72, schools: 86 },
  { month: 'Apr', aqi: 156, traffic: 72, healthcare: 80, schools: 83 },
  { month: 'May', aqi: 162, traffic: 78, healthcare: 85, schools: 88 },
  { month: 'Jun', aqi: 158, traffic: 74, healthcare: 82, schools: 90 },
];

const pieData = [
  { name: 'Residential', value: 45, color: '#3b82f6' },
  { name: 'Commercial', value: 30, color: '#ef4444' },
  { name: 'Industrial', value: 15, color: '#f59e0b' },
  { name: 'Green Spaces', value: 10, color: '#10b981' },
];

export const GovernmentAnalyticsPage: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole="government" />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive data analysis and insights</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Trend Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Multi-Metric Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} name="AQI" />
                <Line type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={2} name="Traffic %" />
                <Line type="monotone" dataKey="healthcare" stroke="#10b981" strokeWidth={2} name="Healthcare %" />
                <Line type="monotone" dataKey="schools" stroke="#f59e0b" strokeWidth={2} name="Schools %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="traffic" fill="#3b82f6" name="Traffic %" />
                <Bar dataKey="healthcare" fill="#10b981" name="Healthcare %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Land Use Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Land Use Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Key Insights */}
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Key Insights
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Critical Issues</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• AQI levels consistently above 150</li>
                  <li>• Traffic congestion increasing by 8%</li>
                  <li>• Healthcare capacity at 85%</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Positive Trends</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• School performance improving</li>
                  <li>• Urban development on track</li>
                  <li>• Green space initiatives effective</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Implement traffic reduction measures</li>
                  <li>• Expand healthcare facilities</li>
                  <li>• Increase public transport capacity</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Watch Areas</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Monitor air quality in industrial zones</li>
                  <li>• Track school enrollment trends</li>
                  <li>• Assess infrastructure capacity</li>
                </ul>
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