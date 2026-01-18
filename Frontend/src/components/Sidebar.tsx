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
  MessageSquare,
  LogOut,
  Users,
  TrendingUp,
  MapPin
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
    { icon: MessageSquare, label: 'What If', path: '/what-if' },
  ];

  const governmentMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/government' },
    { icon: Map, label: 'Interactive Map', path: '/government/map' },
    { icon: Activity, label: 'Air Quality', path: '/air-quality' },
    { icon: Car, label: 'Traffic', path: '/traffic-congestion' },
    { icon: Stethoscope, label: 'Healthcare', path: '/healthcare-load' },
    { icon: GraduationCap, label: 'Schools', path: '/school-performance' },
    { icon: Building2, label: 'Urban Development', path: '/urban-development' },
    { icon: MapPin, label: 'Area Demand', path: '/citizen/area-demand' },
    { icon: Users, label: 'Footfall Estimation', path: '/citizen/footfall' },
    { icon: MessageSquare, label: 'What If', path: '/what-if' },
    { icon: TrendingUp, label: 'Predict Data', path: '/government/predict' },
  ];

  const menuItems = userRole === 'citizen' ? citizenMenuItems : governmentMenuItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar-shell">
      <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">City View</h1>
            <p className="text-xs text-slate-500 capitalize">{userRole} Portal</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Welcome, <span className="font-semibold text-slate-800">{user?.name}</span>
        </p>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto bg-gradient-to-b from-white/60 via-slate-50/40 to-slate-100/20">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`sidebar-item ${
                    isActive(item.path)
                      ? 'sidebar-item-active'
                      : 'sidebar-item-inactive'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    isActive(item.path)
                      ? 'bg-white/20'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-medium tracking-tight">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-100 bg-white/80 backdrop-blur-md">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-colors text-red-600 hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-sm"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
