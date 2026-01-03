import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { FaPhone, FaLock, FaArrowRight, FaInfoCircle } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phoneNumber.length < 10 && phoneNumber !== 'admin') {
      setError(t('कृपया मान्य १० अंकको मोबाइल नम्बर प्रविष्ट गर्नुहोस्', 'Please enter a valid 10-digit mobile number'));
      return;
    }
    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(phoneNumber, otp);
    if (success) {
      const from = (location.state as any)?.from?.pathname || '/';
      if (phoneNumber === 'admin') {
          navigate('/admin');
      } else {
          navigate(from);
      }
    } else {
      setError(t('अमान्य विवरण।', 'Invalid Credentials.'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 shadow-sm rounded-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {step === 'phone' ? t('लगइन', 'Login') : t('ओटीपी प्रविष्ट गर्नुहोस्', 'Enter OTP')}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-english">
            {step === 'phone' 
              ? t('नागरिक आवाज पोर्टलमा सुरक्षित पहुँच।', 'Secure access to Nagarik Aawaz portal.') 
              : `${t('कोड पठाइयो', 'Code sent to')} ${phoneNumber}`
            }
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 mb-6 font-english">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form className="space-y-6" onSubmit={handlePhoneSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">{t('मोबाइल नम्बर', 'Mobile Number')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-sm py-3 focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] font-english"
                  placeholder="98XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-sm text-white bg-[#0094da] hover:bg-[#007bb8] focus:outline-none transition"
              >
                {t('ओटीपी पठाउनुहोस्', 'Send OTP')}
                <FaArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex items-start p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600 font-english">
                <FaInfoCircle className="w-4 h-4 mr-2 flex-shrink-0 text-slate-500" />
                <span>
                    <strong>Admin Access:</strong> ID: <code>admin</code>
                </span>
            </div>
          </form>
        ) : (
           <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 mb-1">{t('ओटीपी कोड', 'OTP Code')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="password"
                  required
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-sm py-3 tracking-widest text-center text-lg focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] font-english"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-center text-slate-400 font-english">
                  Default: <code>123456</code> | Admin: <code>admin123</code>
              </p>
            </div>
            <div className="flex space-x-3">
               <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-1/3 py-3 px-4 border border-slate-300 text-sm font-medium rounded-sm text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                {t('फिर्ता', 'Back')}
              </button>
              <button
                type="submit"
                className="w-2/3 flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-sm text-white bg-[#0094da] hover:bg-[#007bb8] focus:outline-none transition"
              >
                 {t('प्रवेश गर्नुहोस्', 'Login')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;