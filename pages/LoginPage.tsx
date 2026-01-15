
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { FaPhone, FaArrowRight, FaCheckSquare } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
        if (user.role === 'admin') {
            navigate('/admin', { replace: true });
        } else if (user.is_verified && user.constituency_id) {
            navigate(`/constituency/${user.constituency_id}`, { replace: true });
        } else {
            navigate('/verify', { replace: true });
        }
    }
  }, [isAuthenticated, user, loading, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Strict Validation: 10 digits only
    const phoneRegex = /^\d{10}$/;
    
    // Check for admin keyword bypass or valid phone number
    const isValidPhone = phoneRegex.test(phoneNumber);
    const isAdminBypass = phoneNumber === 'admin';

    if (!isValidPhone && !isAdminBypass) {
      setError(t(
        'कृपया मान्य १० अंकको मोबाइल नम्बर प्रविष्ट गर्नुहोस् (अक्षरहरू वा विशेष वर्णहरू बिना)', 
        'Please enter a valid 10-digit mobile number (digits only, no special characters)'
      ));
      return;
    }

    // 2. Checkbox Validation (Not required for admin bypass)
    if (!isAdminBypass && !isConfirmed) {
      setError(t(
        'कृपया जारी राख्नको लागि बक्समा टिक लगाउनुहोस्', 
        'Please check the box to confirm your identity before continuing'
      ));
      return;
    }

    // 3. Login Flow
    const success = await login(phoneNumber);
    if (success) {
      const from = (location.state as any)?.from?.pathname || '/verify'; // Default to /verify if no redirect state
      if (phoneNumber === 'admin') {
          navigate('/admin');
      } else {
          // If the user came from a specific page, go there, otherwise go to verify
          navigate(from === '/' ? '/verify' : from);
      }
    } else {
      setError(t('लगइन असफल भयो।', 'Login Failed.'));
    }
  };

  // Show nothing or loader while checking auth status to prevent flash of login form
  if (loading || isAuthenticated) {
     return null; 
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 shadow-sm rounded-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {t('लगइन', 'Login')}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-english">
            {t('नागरिक उम्मेदवार पोर्टलमा सुरक्षित पहुँच।', 'Secure access to Civic Candidate portal.')}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 mb-6 font-english">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLoginSubmit}>
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
                maxLength={10}
                className="block w-full pl-10 sm:text-sm border-slate-300 rounded-sm py-3 focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] font-english"
                placeholder="98XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => {
                  // Only allow digits to be typed
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setPhoneNumber(val);
                  }
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 font-english text-right">
               {phoneNumber.length}/10
            </p>
          </div>

          {/* Mandatory Confirmation Checkbox */}
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-sm">
             <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="h-5 w-5 text-[#0094da] border-slate-300 rounded focus:ring-[#0094da] cursor-pointer"
                  />
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                   <span className="font-bold text-slate-900 block mb-1">
                     म पुष्टि गर्छु कि यो मेरो वास्तविक फोन नम्बर हो।
                   </span>
                   <span className="font-english">
                     I confirm this is my real phone number and I agree to the <Link to="/privacy-policy" target="_blank" className="text-[#0094da] hover:underline hover:text-[#007bb8]">Privacy Policy & Terms of Use</Link>. If I fail verification when needed, the admin can remove me from the app.
                   </span>
                </div>
             </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={phoneNumber.length !== 10 && phoneNumber !== 'admin'}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-sm text-white bg-[#0094da] hover:bg-[#007bb8] focus:outline-none transition disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {t('प्रवेश गर्नुहोस्', 'Login')}
              <FaArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;