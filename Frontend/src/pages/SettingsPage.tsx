import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Settings, Key, Save, CheckCircle, AlertCircle, MessageSquare, Brain, LogOut } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || 'citizen';

  const [apiKeys, setApiKeys] = useState({
    groqApiKey: '',
    openaiOssApiKey: '',
    geminiApiKey: '',
    tomtomApiKey: '',
    aqicnApiKey: ''
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load saved API keys from localStorage
  useEffect(() => {
    const savedKeys = {
      groqApiKey: localStorage.getItem('GROQ_API_KEY') || '',
      openaiOssApiKey: localStorage.getItem('OPENAI_OSS_API_KEY') || '',
      geminiApiKey: localStorage.getItem('GEMINI_API_KEY') || '',
      tomtomApiKey: localStorage.getItem('TOMTOM_API_KEY') || '',
      aqicnApiKey: localStorage.getItem('AQICN_API_KEY') || ''
    };
    setApiKeys(savedKeys);
  }, []);

  const handleChange = (key: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
    setSaveStatus('idle');
    setErrorMessage('');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setErrorMessage('');

    try {
      // Save to localStorage (frontend)
      Object.entries(apiKeys).forEach(([key, value]) => {
        const storageKey = key
          .replace(/([A-Z])/g, '_$1')
          .toUpperCase()
          .replace('GROQ', 'GROQ')
          .replace('OPENAI_OSS', 'OPENAI_OSS');
        if (value) {
          localStorage.setItem(storageKey, value);
        } else {
          localStorage.removeItem(storageKey);
        }
      });

      // Send API keys to backend to update environment
      const response = await fetch('http://localhost:8000/api/settings/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiKeys),
      });

      if (!response.ok) {
        throw new Error('Failed to save API keys to backend');
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving API keys:', error);
      setSaveStatus('error');
      setErrorMessage('Failed to save API keys. They are saved locally but may not be available to the backend.');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const ApiKeyInput = ({ 
    label, 
    keyName, 
    value, 
    description, 
    icon: Icon,
    required = false 
  }: { 
    label: string; 
    keyName: keyof typeof apiKeys; 
    value: string; 
    description: string;
    icon: React.ElementType;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => handleChange(keyName, e.target.value)}
        placeholder={`Enter your ${label}`}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <p className="text-xs text-gray-500">Current: {maskApiKey(value)}</p>
      )}
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
      <Sidebar userRole={userRole as 'citizen' | 'government'} />
      
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Settings className="w-7 h-7" />
            Settings & Configuration
          </h1>
          <p className="text-gray-600">Manage API keys and application settings</p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* API Keys Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Key className="w-6 h-6" />
                API Keys Configuration
              </h2>
            </div>

            <div className="space-y-6">
              {/* What-If Chatbot API Keys */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  What-If Chatbot (AI Models)
                </h3>
                <div className="grid md:grid-cols-1 gap-4 pl-7">
                  <ApiKeyInput
                    label="Groq Meta Llama 8B API Key"
                    keyName="groqApiKey"
                    value={apiKeys.groqApiKey}
                    description="Required for What-If chatbot scenarios. Get your key from https://console.groq.com"
                    icon={Brain}
                    required={true}
                  />
                  <ApiKeyInput
                    label="OpenAI OSS 20B API Key"
                    keyName="openaiOssApiKey"
                    value={apiKeys.openaiOssApiKey}
                    description="Used for standard predictions and analytics. Can use OpenAI API key or compatible endpoint."
                    icon={Brain}
                  />
                  <ApiKeyInput
                    label="Google Gemini API Key"
                    keyName="geminiApiKey"
                    value={apiKeys.geminiApiKey}
                    description="Fallback AI model for predictions. Get your key from https://makersuite.google.com/app/apikey"
                    icon={Brain}
                  />
                </div>
              </div>

              {/* External Services API Keys */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  External Services
                </h3>
                <div className="grid md:grid-cols-1 gap-4">
                  <ApiKeyInput
                    label="TomTom API Key"
                    keyName="tomtomApiKey"
                    value={apiKeys.tomtomApiKey}
                    description="For map tiles and traffic data. Get your key from https://developer.tomtom.com"
                    icon={Key}
                  />
                  <ApiKeyInput
                    label="AQICN API Key"
                    keyName="aqicnApiKey"
                    value={apiKeys.aqicnApiKey}
                    description="For air quality data. Get your token from https://aqicn.org/api/"
                    icon={Key}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  {saveStatus === 'saved' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">API keys saved successfully!</span>
                    </div>
                  )}
                  {saveStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{errorMessage}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save API Keys'}
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">ℹ️ How API Keys Work</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Groq Meta Llama 8B:</strong> Powers the "What-If" chatbot feature. This is the primary AI model for scenario analysis.
              </p>
              <p>
                <strong>OpenAI OSS 20B:</strong> Used for standard predictions and dashboard analytics. Falls back to Gemini if not provided.
              </p>
              <p>
                <strong>API Key Storage:</strong> Keys are stored locally in your browser. For production, configure them in backend environment variables.
              </p>
              <p className="text-xs text-gray-600 mt-3">
                ⚠️ API keys are stored in localStorage. For security, restart the backend server after updating keys to reload environment variables.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Getting API Keys</h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-gray-900">Groq Meta Llama:</strong>
                <ol className="list-decimal list-inside ml-2 mt-1 text-gray-600 space-y-1">
                  <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.groq.com</a></li>
                  <li>Sign up or log in</li>
                  <li>Navigate to API Keys section</li>
                  <li>Create a new API key</li>
                  <li>Copy and paste it above</li>
                </ol>
              </div>
            </div>
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
