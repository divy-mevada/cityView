import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MapComponent } from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, MapPin, Building2, Calendar, FileText } from 'lucide-react';

interface PredictionResult {
    aqi: number;
    traffic: number;
    healthcare: number;
    education: number;
    reasoning: string;
}

export const PredictDataPage: React.FC = () => {
    const { user } = useAuth();
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [infrastructureType, setInfrastructureType] = useState('');
    const [projectDuration, setProjectDuration] = useState('6');
    const [projectDetails, setProjectDetails] = useState('');
    const [predicting, setPredicting] = useState(false);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
        setError(null); // Clear error when location changes
    };

    const handlePredict = async () => {
        if (!selectedLocation || !infrastructureType) {
            setError('Please select a location and infrastructure type');
            return;
        }

        setPredicting(true);
        setError(null);
        try {
            const scenario = `Building ${infrastructureType} at location. ${projectDetails}`;

            const response = await fetch('http://localhost:8000/api/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    lat: selectedLocation.lat,
                    lon: selectedLocation.lng,
                    scenario: scenario,
                    duration_months: parseInt(projectDuration)
                }),
            });

            if (response.ok) {
                const data = await response.json();
                
                // Validate response structure
                if (!data.annotated_aqi || !data.details) {
                    throw new Error('Invalid response format from server');
                }
                
                setPrediction({
                    aqi: Math.round(data.annotated_aqi),
                    traffic: Math.round(data.details.traffic_change_percent || 0),
                    healthcare: data.details.healthcare_index || 0,
                    education: data.details.schools_index || 0,
                    reasoning: data.details.reasoning || 'Impact analysis completed'
                });
            } else {
                // Try to get error message from response
                let errorMessage = 'Prediction failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                    
                    // Provide helpful message for common errors
                    if (response.status === 503) {
                        errorMessage = 'AI server is not running. Please start the AI server on port 8001. See HOW_TO_RUN.md for instructions.';
                    } else if (response.status === 500) {
                        errorMessage = `Server error: ${errorMessage}`;
                    }
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Prediction error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate prediction. Please check that the AI server is running on port 8001.';
            setError(errorMessage);
        } finally {
            setPredicting(false);
        }
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
            <Sidebar userRole={(user?.role as 'citizen' | 'government') || 'government'} />

            <main className="flex-1 ml-64 p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Predict Infrastructure Impact</h1>
                    <p className="text-gray-600">Analyze the impact of new infrastructure projects on city metrics</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Map Section */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Select Project Location
                        </h3>
                        <div className="h-[400px] rounded-lg overflow-hidden mb-4">
                            <MapComponent layers={[]} onLocationSelect={handleLocationSelect} />
                        </div>
                        {selectedLocation && (
                            <p className="text-sm text-gray-600">
                                Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                            </p>
                        )}
                    </div>

                    {/* Input Form */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Project Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Infrastructure Type
                                </label>
                                <select
                                    value={infrastructureType}
                                    onChange={(e) => setInfrastructureType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select type...</option>
                                    <option value="Metro Station">Metro Station</option>
                                    <option value="Bridge">Bridge</option>
                                    <option value="Highway">Highway</option>
                                    <option value="Hospital">Hospital</option>
                                    <option value="School">School</option>
                                    <option value="Park">Park</option>
                                    <option value="Shopping Mall">Shopping Mall</option>
                                    <option value="Industrial Zone">Industrial Zone</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Project Duration (months)
                                </label>
                                <input
                                    type="number"
                                    value={projectDuration}
                                    onChange={(e) => setProjectDuration(e.target.value)}
                                    min="1"
                                    max="60"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    Additional Details
                                </label>
                                <textarea
                                    value={projectDetails}
                                    onChange={(e) => setProjectDetails(e.target.value)}
                                    placeholder="E.g., Expected capacity, construction method, environmental measures..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                onClick={handlePredict}
                                disabled={predicting || !selectedLocation || !infrastructureType}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <TrendingUp className="w-5 h-5" />
                                {predicting ? 'Generating Prediction...' : 'Generate Prediction'}
                            </button>
                            
                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800 font-medium mb-1">Error:</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                    {error.includes('AI server') && (
                                        <p className="text-xs text-red-600 mt-2">
                                            To start the AI server, run: <code className="bg-red-100 px-1 rounded">run_ai_server.bat</code> or <code className="bg-red-100 px-1 rounded">cd ai && python api_server.py</code>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Prediction Results */}
                {prediction && (
                    <div className="card mt-6">
                        <h3 className="text-lg font-semibold mb-4">Prediction Results</h3>

                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                                <p className="text-sm text-gray-600 mb-1">Air Quality Index</p>
                                <p className="text-3xl font-bold text-red-600">{prediction.aqi}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-600 mb-1">Traffic Congestion</p>
                                <p className="text-3xl font-bold text-blue-600">{prediction.traffic}%</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                                <p className="text-sm text-gray-600 mb-1">Healthcare Index</p>
                                <p className="text-3xl font-bold text-green-600">{prediction.healthcare}%</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                                <p className="text-sm text-gray-600 mb-1">Education Index</p>
                                <p className="text-3xl font-bold text-purple-600">{prediction.education}%</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Analysis</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{prediction.reasoning}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
