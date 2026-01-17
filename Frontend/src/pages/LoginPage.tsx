import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: 'citizen' | 'government' }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setStep('otp');
    setError('');
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
    
    setLoading(true);
    const success = await login(phone, otp, role!);
    
    if (success) {
      navigate(role === 'government' ? '/government' : '/citizen');
    } else {
      setError('Invalid OTP. Use 1234 for demo.');
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
            {step === 'phone' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(value);
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                
                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <button
                  onClick={handleSendOTP}
                  className="w-full px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-600">
                    OTP sent to <span className="font-semibold text-gray-900">{phone}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit code"
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-semibold text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Demo code: <span className="font-mono">1234</span>
                  </p>
                </div>
                
                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
                
                <button
                  onClick={() => setStep('phone')}
                  className="w-full px-4 py-3 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Use Different Number
                </button>
              </div>
            )}
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