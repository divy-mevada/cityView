import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Map, 
  Activity, 
  Car, 
  Stethoscope, 
  GraduationCap, 
  Building2, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  Users,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  userRole: 'citizen' | 'government';
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const citizenMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/citizen' },
    { icon: Map, label: 'Interactive Map', path: '/citizen/map' },
    { icon: Activity, label: 'Air Quality', path: '/air-quality' },
    { icon: Car, label: 'Traffic', path: '/traffic-congestion' },
    { icon: Stethoscope, label: 'Healthcare', path: '/healthcare-load' },
    { icon: GraduationCap, label: 'Schools', path: '/school-performance' },
    { icon: Building2, label: 'Urban Development', path: '/urban-development' },
    { icon: MapPin, label: 'Area Demand', path: '/citizen/area-demand' },
    { icon: Users, label: 'Footfall Estimation', path: '/citizen/footfall' },
  ];

  const governmentMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/government' },
    { icon: Map, label: 'Interactive Map', path: '/citizen/map' },
    { icon: Activity, label: 'Air Quality', path: '/air-quality' },
    { icon: Car, label: 'Traffic', path: '/traffic-congestion' },
    { icon: Stethoscope, label: 'Healthcare', path: '/healthcare-load' },
    { icon: GraduationCap, label: 'Schools', path: '/school-performance' },
    { icon: Building2, label: 'Urban Development', path: '/urban-development' },
    { icon: MapPin, label: 'Area Demand', path: '/citizen/area-demand' },
    { icon: Users, label: 'Footfall Estimation', path: '/citizen/footfall' },
  ];

  const menuItems = userRole === 'citizen' ? citizenMenuItems : governmentMenuItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40 flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">City View</h1>
            <p className="text-xs text-gray-600 capitalize">{userRole} Portal</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Welcome, {user?.name}</p>
      </div>
      
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};