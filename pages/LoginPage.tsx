import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { Phone, Lock, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (phoneNumber.length < 10 && !phoneNumber.includes('admin')) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(phoneNumber, otp);
    if (success) {
      // Redirect to intended page or dashboard
      const from = (location.state as any)?.from?.pathname || '/';
      // If going to verify but already verified, go to dashboard logic handled by ProtectedRoute
      // Just navigating to from should work because ProtectedRoute handles checks
      navigate(from);
    } else {
      setError('Invalid OTP. For demo use 123456');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 'phone' ? 'Login with Mobile' : 'Verify OTP'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'phone' 
              ? 'Enter your mobile number to receive a One-Time Password' 
              : `Enter the 6-digit code sent to ${phoneNumber}`
            }
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
            <div>
              <label htmlFor="phone" className="sr-only">Mobile Number</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                  placeholder="98XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send OTP
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
           <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="sr-only">OTP Code</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 tracking-widest text-center text-lg"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-center text-gray-500">Demo OTP: 123456</p>
            </div>
            <div className="flex space-x-3">
               <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-1/3 py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Verify & Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;