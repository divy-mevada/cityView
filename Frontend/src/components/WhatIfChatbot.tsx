import React, { useState } from 'react';
import { Send, Bot, User, MapPin, Activity, Car, Stethoscope, GraduationCap, Building2, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  results?: {
    aqi: number;
    traffic: number;
    healthcare: number;
    schools: number;
    urbanDevelopment: number;
  };
}

export const WhatIfChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I can help you simulate various scenarios for Ahmedabad city. Try asking questions like "What if we reduce traffic by 20%?" or "What would happen if we improve air quality by 30%?"',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const simulateScenario = (query: string) => {
    // Mock simulation results based on query
    const baseResults = {
      aqi: 156,
      traffic: 75,
      healthcare: 68,
      schools: 82,
      urbanDevelopment: 71
    };

    if (query.toLowerCase().includes('traffic')) {
      return { ...baseResults, traffic: Math.max(30, baseResults.traffic - 20) };
    }
    if (query.toLowerCase().includes('air quality') || query.toLowerCase().includes('aqi')) {
      return { ...baseResults, aqi: Math.max(50, baseResults.aqi - 30) };
    }
    if (query.toLowerCase().includes('healthcare')) {
      return { ...baseResults, healthcare: Math.min(90, baseResults.healthcare + 15) };
    }
    if (query.toLowerCase().includes('school')) {
      return { ...baseResults, schools: Math.min(95, baseResults.schools + 10) };
    }
    if (query.toLowerCase().includes('urban') || query.toLowerCase().includes('development')) {
      return { ...baseResults, urbanDevelopment: Math.min(85, baseResults.urbanDevelopment + 12) };
    }

    return baseResults;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Call AI API for real predictions
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: 23.0225,
          lon: 72.5714,
          scenario: currentInput,
          duration_months: 6
        }),
      });

      if (response.ok) {
        const aiResult = await response.json();
        const results = {
          aqi: Math.round(aiResult.annotated_aqi),
          traffic: Math.abs(aiResult.details.traffic_change_percent),
          healthcare: 68 + Math.round(aiResult.impact_percentage * 0.3),
          schools: 82 + Math.round(aiResult.impact_percentage * 0.2),
          urbanDevelopment: 71 + Math.round(aiResult.impact_percentage * 0.4)
        };

        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: `AI Analysis: ${aiResult.details.reasoning}\n\nProjected impacts for "${currentInput}":`,
          timestamp: new Date(),
          results,
        };

        setMessages(prev => [...prev, botMessage]);
        
        // Store AI response for sharing
        try {
          await fetch('http://localhost:8000/api/ai-responses/store/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              scenario: currentInput,
              location: { lat: 23.0225, lng: 72.5714 },
              response: aiResult,
              user_id: 'government_user'
            }),
          });
        } catch (storeError) {
          console.log('Failed to store AI response:', storeError);
        }
      } else {
        throw new Error('AI service unavailable');
      }
    } catch (error) {
      console.error('AI API Error:', error);
      // Fallback to mock data
      const results = simulateScenario(currentInput);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Based on your scenario "${currentInput}", here are the projected impacts on Ahmedabad city metrics:`,
        timestamp: new Date(),
        results,
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorForValue = (value: number, type: string) => {
    if (type === 'aqi') {
      if (value <= 50) return 'text-green-600';
      if (value <= 100) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (type === 'traffic') {
      if (value <= 40) return 'text-green-600';
      if (value <= 70) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-blue-600';
  };

  return (
    <div className="flex h-full">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            What-If Scenario Simulator
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Ask questions about potential changes to city metrics
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.results && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <Activity className={`w-6 h-6 mx-auto mb-1 ${getColorForValue(message.results.aqi, 'aqi')}`} />
                        <p className="text-xs text-gray-600">AQI</p>
                        <p className={`font-bold ${getColorForValue(message.results.aqi, 'aqi')}`}>
                          {message.results.aqi}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <Car className={`w-6 h-6 mx-auto mb-1 ${getColorForValue(message.results.traffic, 'traffic')}`} />
                        <p className="text-xs text-gray-600">Traffic</p>
                        <p className={`font-bold ${getColorForValue(message.results.traffic, 'traffic')}`}>
                          {message.results.traffic}%
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <Stethoscope className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                        <p className="text-xs text-gray-600">Healthcare</p>
                        <p className="font-bold text-blue-600">{message.results.healthcare}%</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <GraduationCap className="w-6 h-6 mx-auto mb-1 text-green-600" />
                        <p className="text-xs text-gray-600">Schools</p>
                        <p className="font-bold text-green-600">{message.results.schools}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about scenarios like 'What if traffic reduces by 20%?'"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};