import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { MapComponent } from '../components/MapComponent';
import { Map, FileText } from 'lucide-react';

export const CitizenMapPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Determine user role based on current path or user data
  const userRole = user?.role || 'citizen';

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleGenerate = () => {
    console.log('Generate report');
    // Add generation logic here
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

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole={userRole as 'citizen' | 'government'} />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interactive Map</h1>
          <p className="text-gray-600">Explore Ahmedabad city with multiple data layers</p>
        </div>

        {/* Full Width Map */}
        <div className="card h-[calc(100vh-200px)] relative">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Map className="w-5 h-5" />
            Ahmedabad City Map
          </h3>
          <MapComponent 
            layers={['traffic', 'aqi']} 
            onLocationSelect={handleLocationSelect}
          />
          
          {/* Generate Button - Fixed at bottom right of map */}
          <button
            onClick={handleGenerate}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors z-10"
          >
            <FileText size={16} />
            <span>Generate</span>
          </button>
        </div>
        
        {/* Location Selection UI - Only show for citizen users */}
        {userRole === 'citizen' && (
          <div className="card mt-4">
            <div className="flex items-center justify-between">
              <div>
                {selectedLocation ? (
                  <p className="text-sm text-gray-600">
                    Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Click on the map to select a location</p>
                )}
              </div>
              <button
                onClick={handleSubmitLocation}
                disabled={!selectedLocation || submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Location'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};