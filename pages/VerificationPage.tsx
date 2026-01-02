import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';
import { submitVerification, detectConstituency } from '../services/dataService';
import { useAuth } from '../services/authService';
import { FaCloudUploadAlt, FaCheckCircle, FaIdCard } from 'react-icons/fa';

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
              <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">1</span>
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
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600 justify-center">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-sm font-medium text-slate-900 hover:text-blue-800 focus-within:outline-none"
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
              <span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">2</span>
              स्थायी ठेगाना (Permanent Address)
            </h3>
            <div className="bg-white p-4 border border-slate-200">
               <AddressSelector onAddressChange={setAddress} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting || !file || !address.ward}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-base font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'प्रक्रियामा छ... (Submitting...)' : 'पेश गर्नुहोस् (Submit for Verification)'}
            </button>
            <p className="mt-4 text-xs text-slate-500 text-center max-w-2xl mx-auto">
              मैले पेश गरेको विवरण सत्य छ र झुटो ठहरेमा कानून बमोजिम सहुँला/बुझाउँला।
              <br/><span className="font-english opacity-70">(I declare the information provided is true. False submission is punishable by law.)</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationPage;