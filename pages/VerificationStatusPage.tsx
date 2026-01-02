import React from 'react';
import { useAuth } from '../services/authService';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VerificationStatusPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-sm border border-slate-200 shadow-sm p-10 text-center">
        {user.verification_status === 'pending' && (
            <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 border border-amber-200 mb-6">
                    <FaClock className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">प्रक्रियामा (Pending)</h2>
                <p className="text-slate-600 mb-8 text-sm">
                    तपाईंको विवरण प्राप्त भएको छ। प्रशासकले यसको जाँच गर्दै हुनुहुन्छ। कृपया धैर्य गर्नुहोस्।
                    <br/><span className="text-xs font-english block mt-2">(Your details are under review. Please wait for approval.)</span>
                </p>
                <div className="bg-slate-50 border border-slate-200 p-4 text-left text-xs text-slate-700">
                    <strong>Note:</strong> Access restricted until approved.
                </div>
            </>
        )}

        {user.verification_status === 'rejected' && (
            <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 border border-red-200 mb-6">
                    <FaTimesCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">अस्वीकृत (Rejected)</h2>
                <p className="text-slate-600 mb-8 text-sm">
                    तपाईंको कागजात वा विवरण स्पष्ट नभएकोले अस्वीकृत गरिएको छ।
                    <br/><span className="text-xs font-english block mt-2">(Verification rejected due to unclear documents or mismatch.)</span>
                </p>
                <Link to="/verify" className="inline-block bg-slate-900 text-white px-6 py-2 rounded-sm font-medium hover:bg-slate-800 text-sm">
                    पुनः प्रयास गर्नुहोस् (Try Again)
                </Link>
            </>
        )}

        {user.verification_status === 'approved' && (
            <>
                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
                    <FaCheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">प्रमाणित (Verified)</h2>
                <p className="text-slate-600 mb-8 text-sm">
                    तपाईंको प्रमाणीकरण सफल भयो। स्वागत छ।
                    <br/><span className="text-xs font-english block mt-2">(Verification successful. Welcome to {user.constituency_id}.)</span>
                </p>
                <Link to={`/constituency/${user.constituency_id}`} className="inline-block bg-emerald-700 text-white px-6 py-2 rounded-sm font-medium hover:bg-emerald-800 text-sm">
                    ड्यासबोर्ड (Go to Dashboard)
                </Link>
            </>
        )}
      </div>
    </div>
  );
};

export default VerificationStatusPage;