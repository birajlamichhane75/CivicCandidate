import React from 'react';
import { useAuth } from '../services/authService';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerificationStatusPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {user.verification_status === 'pending' && (
            <>
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6 animate-pulse">
                    <Clock className="h-10 w-10 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h2>
                <p className="text-gray-600 mb-6">
                    We have received your details. Our admin team is reviewing your ID and address. 
                    This usually takes 24-48 hours. You will be notified via SMS once approved.
                </p>
                <div className="bg-blue-50 p-4 rounded text-left text-sm text-blue-800">
                    <strong>Note:</strong> You cannot access your constituency dashboard or vote until verification is complete.
                </div>
            </>
        )}

        {user.verification_status === 'rejected' && (
            <>
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                    <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                <p className="text-gray-600 mb-6">
                    Your verification request was rejected. The ID provided might be unclear or does not match the address.
                </p>
                <Link to="/verify" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                    Try Again
                </Link>
            </>
        )}

        {user.verification_status === 'approved' && (
            <>
                 <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You are Verified!</h2>
                <p className="text-gray-600 mb-6">
                    Welcome to <strong>{user.constituency_id}</strong>. You can now participate fully.
                </p>
                <Link to={`/constituency/${user.constituency_id}`} className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                    Go to Dashboard
                </Link>
            </>
        )}
      </div>
    </div>
  );
};

export default VerificationStatusPage;