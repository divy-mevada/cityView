import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Lock, UserPlus } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { role } = useParams<{ role: 'citizen' | 'government' }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    const { username, password, name, email } = formData;
    if (!username || !password || !name || !email) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          name,
          email,
          role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully registered, now login automatically
        const loginSuccess = await login(username, password, role!);
        if (loginSuccess) {
          navigate(role === 'government' ? '/government' : '/citizen');
        } else {
          navigate(`/login/${role}`);
        }
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
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
              Join as {role === 'government' ? 'Government' : 'Citizen'}
            </h1>
            <p className="text-center text-sm text-gray-600">
              Create your account to start using the platform
            </p>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                  <UserPlus size={16} className="text-gray-400" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                  <Lock size={16} className="text-gray-400" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 mt-2"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="text-sm text-gray-600 text-center mt-4">
                Already have an account?{' '}
                <Link to={`/login/${role}`} className="text-blue-600 font-semibold hover:underline">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Join the Ahmedabad Urban Intelligence Platform
        </p>
      </div>
    </div>
  );
};