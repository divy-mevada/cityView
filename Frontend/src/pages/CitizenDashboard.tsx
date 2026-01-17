import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { KPICard } from '../components/KPICard';

import { MapComponent } from '../components/MapComponent';
import { apiService } from '../services/api';
import type { KPIData } from '../types';
import { Activity, Car, Stethoscope, GraduationCap, Building2, LogOut } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmitLocation = async () => {
    if (!selectedLocation) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Location submitted successfully:', data);
        alert('Location submitted successfully!');
      } else {
        throw new Error(data.error || 'Failed to submit location');
      }
    } catch (error) {
      console.error('Error submitting location:', error);
      alert('Error submitting location. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerate = () => {
    console.log('Generate button clicked');
    // Add your generation logic here
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
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate
            </button>
          </div>
          
          {/* Map */}
          <MapComponent layers={['traffic', 'aqi']} />
        </div>

        {/* Bottom Section: Ahmedabad City Overview */}
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


