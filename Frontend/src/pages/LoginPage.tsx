import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: 'citizen' | 'government' }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');
    const success = await login(username, password, role!);

    if (success) {
      navigate(role === 'government' ? '/government' : '/citizen');
    } else {
      setError(role === 'government'
        ? 'Invalid credentials. Use username: divy, password: 1234'
        : 'Invalid credentials. Use username: tirth, password: 1234');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#D1E7F0' }}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8 -ml-2 pl-2 py-1"
        >
          <ArrowLeft size={18} className="mr-1.5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Card Container */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

          {/* Header Section */}
          <div className="px-6 py-8 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              {role === 'government' ? 'Government' : 'Citizen'} Portal
            </h1>
            <p className="text-center text-sm text-gray-600">
              {role === 'government'
                ? 'Employee Authentication'
                : 'Secure Access to Services'}
            </p>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'government' ? 'Enter username (divy)' : 'Enter username (tirth)'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (1234)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {role === 'government' ? (
                <p>Demo: username: <span className="font-mono">divy</span>, password: <span className="font-mono">1234</span></p>
              ) : (
                <p>Demo: username: <span className="font-mono">tirth</span>, password: <span className="font-mono">1234</span></p>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate(`/register/${role}`)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secure portal for smart city services
        </p>
      </div>
    </div>
  );
};