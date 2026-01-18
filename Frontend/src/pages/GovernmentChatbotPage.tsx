import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { WhatIfChatbot } from '../components/WhatIfChatbot';
import { MapComponent } from '../components/MapComponent';
import { LogOut } from 'lucide-react';

export const GovernmentChatbotPage: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole={(user?.role as 'citizen' | 'government') || 'government'} />

      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">What-If Scenario Simulator</h1>
          <p className="text-gray-600">Simulate policy changes and their impact on city metrics</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Chatbot Interface */}
          <div className="card p-0 overflow-hidden">
            <WhatIfChatbot />
          </div>

          {/* Synced Map */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Impact Visualization</h3>
            <MapComponent layers={['scenario-impact']} />
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
