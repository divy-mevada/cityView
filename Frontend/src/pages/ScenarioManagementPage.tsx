import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Plus, Play, Trash2, Copy, LogOut } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    trafficReduction: number;
    aqiImprovement: number;
    healthcareIncrease: number;
    schoolImprovement: number;
    urbanDevelopment: number;
  };
  results?: {
    aqi: number;
    traffic: number;
    healthcare: number;
    schools: number;
    urbanDevelopment: number;
  };
  createdAt: Date;
}

export const ScenarioManagementPage: React.FC = () => {
  const { logout } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Green Transport Initiative',
      description: 'Increase public transport and reduce private vehicle usage',
      parameters: {
        trafficReduction: 25,
        aqiImprovement: 15,
        healthcareIncrease: 5,
        schoolImprovement: 0,
        urbanDevelopment: 10,
      },
      results: {
        aqi: 132,
        traffic: 56,
        healthcare: 71,
        schools: 82,
        urbanDevelopment: 78,
      },
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Healthcare Expansion',
      description: 'Build new hospitals and improve existing facilities',
      parameters: {
        trafficReduction: 0,
        aqiImprovement: 0,
        healthcareIncrease: 30,
        schoolImprovement: 0,
        urbanDevelopment: 15,
      },
      results: {
        aqi: 156,
        traffic: 75,
        healthcare: 88,
        schools: 82,
        urbanDevelopment: 82,
      },
      createdAt: new Date('2024-01-10'),
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    parameters: {
      trafficReduction: 0,
      aqiImprovement: 0,
      healthcareIncrease: 0,
      schoolImprovement: 0,
      urbanDevelopment: 0,
    },
  });

  const runScenario = (scenarioId: string) => {
    // Mock scenario execution
    console.log('Running scenario:', scenarioId);
  };

  const duplicateScenario = (scenario: Scenario) => {
    const newScenario: Scenario = {
      ...scenario,
      id: Date.now().toString(),
      name: `${scenario.name} (Copy)`,
      createdAt: new Date(),
    };
    setScenarios([...scenarios, newScenario]);
  };

  const deleteScenario = (scenarioId: string) => {
    setScenarios(scenarios.filter(s => s.id !== scenarioId));
  };

  const createScenario = () => {
    const scenario: Scenario = {
      id: Date.now().toString(),
      ...newScenario,
      createdAt: new Date(),
    };
    setScenarios([...scenarios, scenario]);
    setShowCreateModal(false);
    setNewScenario({
      name: '',
      description: '',
      parameters: {
        trafficReduction: 0,
        aqiImprovement: 0,
        healthcareIncrease: 0,
        schoolImprovement: 0,
        urbanDevelopment: 0,
      },
    });
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole="government" />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Scenario Management</h1>
            <p className="text-gray-600">Create, manage, and compare different policy scenarios</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Scenario
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runScenario(scenario.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Run Scenario"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateScenario(scenario)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteScenario(scenario.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Parameters</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>Traffic Reduction: <span className="font-semibold">{scenario.parameters.trafficReduction}%</span></div>
                  <div>AQI Improvement: <span className="font-semibold">{scenario.parameters.aqiImprovement}%</span></div>
                  <div>Healthcare Increase: <span className="font-semibold">{scenario.parameters.healthcareIncrease}%</span></div>
                  <div>School Improvement: <span className="font-semibold">{scenario.parameters.schoolImprovement}%</span></div>
                </div>

                {scenario.results && (
                  <>
                    <h4 className="font-medium text-gray-900 mt-4">Projected Results</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-600">AQI</p>
                        <p className="font-bold text-red-600">{scenario.results.aqi}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-600">Traffic</p>
                        <p className="font-bold text-yellow-600">{scenario.results.traffic}%</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-600">Healthcare</p>
                        <p className="font-bold text-blue-600">{scenario.results.healthcare}%</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create Scenario Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Scenario</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newScenario.name}
                    onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newScenario.description}
                    onChange={(e) => setNewScenario({...newScenario, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Traffic Reduction (%)</label>
                    <input
                      type="number"
                      value={newScenario.parameters.trafficReduction}
                      onChange={(e) => setNewScenario({
                        ...newScenario,
                        parameters: {...newScenario.parameters, trafficReduction: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AQI Improvement (%)</label>
                    <input
                      type="number"
                      value={newScenario.parameters.aqiImprovement}
                      onChange={(e) => setNewScenario({
                        ...newScenario,
                        parameters: {...newScenario.parameters, aqiImprovement: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createScenario}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Scenario
                </button>
              </div>
            </div>
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
