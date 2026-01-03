import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';
import { submitVerification, detectConstituency } from '../services/dataService';
import { useAuth } from '../services/authService';
import { FaCloudUploadAlt, FaCheckCircle, FaIdCard, FaShieldAlt } from 'react-icons/fa';

const VerificationPage: React.FC = () => {
  const { user, updateUserVerification } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [address, setAddress] = useState({ province: '', district: '', municipality: '', ward: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file || !address.ward || !isConfirmed) return;

    setIsSubmitting(true);
    setTimeout(async () => {
        const constituencyId = await detectConstituency(address.province, address.district, address.municipality, address.ward);
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

        updateUserVerification('pending', constituencyId);
        navigate('/verification-status');
    }, 1500);
  };

  const isFormFilled = file && address.ward;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <FaIdCard className="mr-3 text-slate-700" />
            नागरिक प्रमाणीकरण (Citizen Verification)
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            स्वच्छ र निष्पक्ष लोकतान्त्रिक सहभागिताको लागि आफ्नो विवरण पेश गर्नुहोस्।
            <span className="block mt-1 font-english opacity-80">(Submit details for fair democratic participation.)</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Section 1: ID Upload */}
          <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-[#0094da] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">1</span>
              परिचय पत्र (Identity Document)
            </h3>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-sm bg-white hover:bg-slate-50 transition">
              <div className="space-y-2 text-center">
                {file ? (
                   <div className="flex flex-col items-center">
                       <FaCheckCircle className="h-10 w-10 text-emerald-600 mb-2" />
                       <p className="text-sm text-slate-900 font-medium font-english">{file.name}</p>
                       <button type="button" onClick={() => setFile(null)} className="text-xs text-red-600 hover:text-red-800 mt-2 font-english uppercase tracking-wider font-semibold">Remove & Change</button>
                   </div>
                ) : (
                    <>
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-[#0094da]" />
                        <div className="flex text-sm text-slate-600 justify-center">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-sm font-medium text-[#0094da] hover:text-[#007bb8] focus-within:outline-none"
                        >
                            <span className="underline">अपलोड गर्नुहोस् (Upload File)</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" required />
                        </label>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-english">PNG, JPG up to 5MB (Citizenship, License, Voter ID)</p>
                    </>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-[#0094da] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">2</span>
              स्थायी ठेगाना (Permanent Address)
            </h3>
            <div className="bg-white p-4 border border-slate-200">
               <AddressSelector onAddressChange={setAddress} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {/* Confirmation Checkbox */}
            <div className={`mb-6 p-5 border rounded-sm transition-colors duration-200 ${isConfirmed ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
               <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      checked={isConfirmed}
                      onChange={(e) => setIsConfirmed(e.target.checked)}
                      className="h-5 w-5 text-[#0094da] border-slate-300 rounded focus:ring-[#0094da] cursor-pointer"
                    />
                  </div>
                  <div className="text-sm text-slate-700 space-y-3">
                     <div className="flex items-start">
                        <FaShieldAlt className="w-4 h-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                           <p className="font-medium text-slate-900">
                              म पुष्टि गर्छु कि मेरो परिचयपत्र केवल प्रशासकको प्रमाणिकरणको लागि प्रयोग हुनेछ। विकासकर्ताले पहुँच पाउँदैनन्।
                           </p>
                           <p className="text-xs text-slate-500 font-english mt-1">
                              I confirm that my ID is submitted only for admin verification. Developers or anyone else do not have access.
                           </p>
                        </div>
                     </div>
                     <div className="flex items-start">
                         <div className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0"></div>
                         <div>
                            <p className="font-medium text-slate-900">
                               मैले दिएका सबै विवरण सत्य हुन् र झूटो जानकारी वा परिचयपत्र भए कानुनी कारवाही हुन सक्छ भन्ने बुझ्दछु।
                            </p>
                            <p className="text-xs text-slate-500 font-english mt-1">
                               I confirm that all information provided is true. Providing fake information or ID may result in legal action.
                            </p>
                         </div>
                     </div>
                  </div>
               </label>
            </div>

            {/* Warning Message if form filled but not confirmed */}
            {isFormFilled && !isConfirmed && (
               <div className="text-amber-600 text-sm mb-3 font-medium flex items-center justify-center animate-pulse">
                  * सबमिट गर्नुअघि माथिको बक्समा टिक लगाउनुहोस् (Please confirm before submitting)
               </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isFormFilled || !isConfirmed}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-base font-bold text-white bg-[#0094da] hover:bg-[#007bb8] focus:outline-none disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'प्रक्रियामा छ... (Submitting...)' : 'पेश गर्नुहोस् (Submit for Verification)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationPage;