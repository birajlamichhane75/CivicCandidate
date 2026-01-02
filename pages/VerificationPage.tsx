import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';
import { submitVerification, detectConstituency } from '../services/dataService';
import { useAuth } from '../services/authService';
import { Upload, CheckCircle } from 'lucide-react';

const VerificationPage: React.FC = () => {
  const { user, updateUserVerification } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [address, setAddress] = useState({ province: '', district: '', municipality: '', ward: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file || !address.ward) return;

    setIsSubmitting(true);
    
    // Simulate delay
    setTimeout(async () => {
        // Detect constituency for this user
        const constituencyId = await detectConstituency(address.province, address.district, address.municipality, address.ward);
        
        // In real app, upload file to Supabase Storage here.
        // For this demo, we simulate the URL.
        const fakeImageUrl = `https://via.placeholder.com/400x300?text=ID+Card+${user.phone_number}`;

        await submitVerification({
            user_id: user.id,
            phone_number: user.phone_number,
            province: address.province,
            district: address.district,
            municipality: address.municipality,
            ward: address.ward,
            id_image_url: fakeImageUrl, 
        });

        // Update local state to pending
        updateUserVerification('pending', constituencyId); // Optimistically setting ID, though admin will confirm
        
        navigate('/verification-status');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Identity</h1>
          <p className="mt-2 text-gray-600">To ensure free and fair democratic participation, we need to verify you are a real citizen of your declared constituency.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: ID Upload */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
              Upload Government ID
            </h3>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition">
              <div className="space-y-1 text-center">
                {file ? (
                   <div className="flex flex-col items-center">
                       <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                       <p className="text-sm text-gray-900 font-medium">{file.name}</p>
                       <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500 hover:text-red-700 mt-2">Change</button>
                   </div>
                ) : (
                    <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB (Citizenship, License, Voter ID)</p>
                    </>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
              Confirm Your Permanent Address
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
               <AddressSelector onAddressChange={setAddress} />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !file || !address.ward}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
            <p className="mt-4 text-xs text-gray-500 text-center">
              By submitting, you declare that the information provided is true. Providing false information for voting purposes is a punishable offense.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationPage;