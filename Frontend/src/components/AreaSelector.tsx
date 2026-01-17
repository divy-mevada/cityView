import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface AreaSelectorProps {
  onSelectionChange: (zone: string, ward: string, locality: string) => void;
}

export const AreaSelector: React.FC<AreaSelectorProps> = ({ onSelectionChange }) => {
  const [zones, setZones] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');

  useEffect(() => {
    // Use mock data instead of API calls to prevent navigation issues
    const mockZones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
    setZones(mockZones);
  }, []);

  useEffect(() => {
    if (selectedZone) {
      // Use mock data instead of API calls
      const mockWards = [`${selectedZone} Ward 1`, `${selectedZone} Ward 2`, `${selectedZone} Ward 3`];
      setWards(mockWards);
      setSelectedWard('');
      setSelectedLocality('');
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedWard) {
      // Use mock data instead of API calls
      const mockLocalities = [`${selectedWard} Area A`, `${selectedWard} Area B`, `${selectedWard} Area C`];
      setLocalities(mockLocalities);
      setSelectedLocality('');
    }
  }, [selectedWard]);

  useEffect(() => {
    onSelectionChange(selectedZone, selectedWard, selectedLocality);
  }, [selectedZone, selectedWard, selectedLocality, onSelectionChange]);

  return (
    <div className="flex space-x-4">
      <select
        value={selectedZone}
        onChange={(e) => setSelectedZone(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Select Zone</option>
        {zones.map(zone => (
          <option key={zone} value={zone}>{zone}</option>
        ))}
      </select>

      <select
        value={selectedWard}
        onChange={(e) => setSelectedWard(e.target.value)}
        disabled={!selectedZone}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
      >
        <option value="">Select Ward</option>
        {wards.map(ward => (
          <option key={ward} value={ward}>{ward}</option>
        ))}
      </select>

      <select
        value={selectedLocality}
        onChange={(e) => setSelectedLocality(e.target.value)}
        disabled={!selectedWard}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
      >
        <option value="">Select Locality</option>
        {localities.map(locality => (
          <option key={locality} value={locality}>{locality}</option>
        ))}
      </select>
    </div>
  );
};