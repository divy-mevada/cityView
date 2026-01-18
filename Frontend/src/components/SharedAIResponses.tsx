import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Brain, Share2 } from 'lucide-react';
import { apiService } from '../services/api';

interface AIResponse {
  id: string;
  scenario: string;
  location: { lat: number; lng: number };
  response: any;
  user_id: string;
  created_at: string;
}

export const SharedAIResponses: React.FC = () => {
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      const data = await apiService.getAIResponses(20);
      setResponses(data.responses || []);
    } catch (error) {
      console.error('Failed to load AI responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading AI responses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Share2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Shared AI Insights</h2>
        <span className="text-sm text-gray-500">({responses.length} responses)</span>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No AI responses shared yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {responses.map((response) => (
            <div key={response.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{response.scenario}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(response.created_at)}
                    </div>
                    {response.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {response.location.lat.toFixed(3)}, {response.location.lng.toFixed(3)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  AI Analysis
                </div>
              </div>

              {response.response && (
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium">AQI Impact:</span> {response.response.annotated_aqi || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Change:</span> {response.response.impact_percentage || 0}%
                    </div>
                  </div>
                  {response.response.details?.reasoning && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="font-medium">AI Reasoning:</span>
                      <p className="text-gray-700 mt-1">{response.response.details.reasoning}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};