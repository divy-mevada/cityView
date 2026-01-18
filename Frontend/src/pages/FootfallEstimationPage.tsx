import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Users, MapPin, TrendingUp, LogOut } from 'lucide-react';
import { MapComponent } from '../components/MapComponent';

export const FootfallEstimationPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Determine user role based on current path or user data
  const userRole = user?.role || 'citizen';
  
  const footfallData = [
    { location: 'CG Road', current: 2500, predicted: 3200, capacity: 4000 },
    { location: 'Maninagar', current: 1800, predicted: 2100, capacity: 3000 },
    { location: 'Satellite', current: 3100, predicted: 3800, capacity: 5000 },
    { location: 'Vastrapur', current: 2200, predicted: 2800, capacity: 3500 },
  ];

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage < 60) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole={userRole as 'citizen' | 'government'} />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Footfall Estimation</h1>
          <p className="text-gray-600">Real-time and predicted footfall data for Ahmedabad areas</p>
        </div>

        {/* Map */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Footfall Heat Map
          </h3>
          <MapComponent layers={['footfall']} />
        </div>

        {/* Live Footfall */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Live Footfall
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {footfallData.map((item) => (
              <div key={item.location} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.location}</h4>
                  <span className={`text-sm font-semibold ${getCapacityColor(item.current, item.capacity)}`}>
                    {Math.round((item.current / item.capacity) * 100)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {item.current.toLocaleString()} / {item.capacity.toLocaleString()}
                </p>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (item.current / item.capacity) * 100 < 60 ? 'bg-green-500' :
                      (item.current / item.capacity) * 100 < 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(item.current / item.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predicted Footfall */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Predicted Footfall (Next 2 Hours)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {footfallData.map((item) => (
              <div key={item.location} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{item.location}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-semibold">{item.current.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Predicted</span>
                  <span className="font-semibold text-blue-600">{item.predicted.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Change</span>
                  <span className={`font-semibold ${
                    item.predicted > item.current ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.predicted > item.current ? '+' : ''}{item.predicted - item.current}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
