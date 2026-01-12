
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';
import { submitVerification, detectConstituency, uploadIdDocument } from '../services/dataService';
import { useAuth } from '../services/authService';
import { FaCloudUploadAlt, FaCheckCircle, FaIdCard, FaShieldAlt, FaClock, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const VerificationPage: React.FC = () => {
  const { user, updateUserVerification } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [address, setAddress] = useState({ province: '', district: '', municipality: '', ward: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Success State
  const [isSuccess, setIsSuccess] = useState(false);
  const [decisionDates, setDecisionDates] = useState<{ ad: string, bs: string, time: string } | null>(null);

  // Cleanup preview URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate File Size (Max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please upload a smaller image.");
        return;
      }

      // Validate File Type
      if (!selectedFile.type.startsWith('image/')) {
        alert("Please upload a valid image file (JPG, PNG).");
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const calculateDecisionTime = () => {
    const now = new Date();
    const target = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours

    // Format Time (e.g., "2 PM")
    let hours = target.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const timeString = `${hours} ${ampm}`;

    // English Date (AD)
    const adDate = target.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Approximation for BS (AD + ~57 years)
    const bsYear = target.getFullYear() + 57;
    const bsMonths = ["Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
    const bsMonthIndex = (target.getMonth() + 8) % 12; 
    const bsDay = target.getDate(); 
    const bsDateStr = `${bsYear} ${bsMonths[bsMonthIndex]} ${bsDay}`;

    return { ad: adDate, bs: bsDateStr, time: timeString };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file || !address.ward || !isConfirmed) return;

    setIsSubmitting(true);
    
    try {
        // 1. Upload Image to Supabase Storage
        const uploadedImageUrl = await uploadIdDocument(file, user.id);
        
        // 2. Detect Constituency
        const constituencyId = await detectConstituency(address.province, address.district, address.municipality, address.ward);

        // 3. Submit Verification Request
        await submitVerification({
            user_id: user.id,
            phone_number: user.phone_number,
            province: address.province,
            district: address.district,
            municipality: address.municipality,
            ward: address.ward,
            id_image_url: uploadedImageUrl, 
        });

        // 4. Update Local State
        updateUserVerification('pending', constituencyId);
        
        // 5. Show Success View
        setDecisionDates(calculateDecisionTime());
        setIsSuccess(true);
        setIsSubmitting(false);

    } catch (error: any) {
        console.error("Verification submission failed:", error);
        alert(error.message || "Failed to submit verification. Please try again.");
        setIsSubmitting(false);
    }
  };

  const isFormFilled = file && address.ward;

  if (isSuccess && decisionDates) {
    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="bg-white rounded-sm border-t-4 border-[#0094da] shadow-lg p-10 text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-50 mb-6">
                    <FaClock className="h-10 w-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Verification Pending</h2>
                <p className="text-xl text-slate-600 mb-8 font-medium">
                    तपाईंको प्रमाणिकरण पर्खाइमा छ। <br/>
                    <span className="text-sm text-slate-500 mt-2 block">(Your verification is pending.)</span>
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 mb-8 text-left">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                        Estimated Decision Time: {decisionDates.time} (२४ घण्टा भित्र)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-3">
                            <FaCalendarAlt className="w-5 h-5 text-[#0094da] mt-1" />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Bikram Sambat (BS)</p>
                                <p className="text-lg font-bold text-slate-800">{decisionDates.bs}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCalendarAlt className="w-5 h-5 text-slate-400 mt-1" />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">English Date (AD)</p>
                                <p className="text-lg font-bold text-slate-800 font-english">{decisionDates.ad}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                  onClick={() => navigate('/verification-status')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-sm shadow-sm text-white bg-[#0094da] hover:bg-[#007bb8] transition"
                >
                    स्थिति जाँच गर्नुहोस् (Check Status) <FaArrowRight className="ml-2"/>
                </button>
            </div>
        </div>
    );
  }

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
              <div className="space-y-2 text-center w-full">
                {file && previewUrl ? (
                   <div className="flex flex-col items-center">
                       <div className="relative mb-3">
                           <img 
                            src={previewUrl} 
                            alt="ID Preview" 
                            className="max-h-64 object-contain rounded-md border border-slate-200 shadow-sm"
                           />
                           <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                               <FaCheckCircle className="h-6 w-6 text-emerald-600" />
                           </div>
                       </div>
                       <p className="text-sm text-slate-900 font-medium font-english">{file.name}</p>
                       <p className="text-xs text-slate-500 font-english">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                       
                       <label
                            htmlFor="file-upload"
                            className="mt-3 cursor-pointer text-xs font-bold text-[#0094da] hover:text-[#007bb8] uppercase tracking-wider border border-[#0094da] px-4 py-2 rounded-sm"
                        >
                            Change Image
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
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
              {isSubmitting ? 'अपलोड गर्दै... (Uploading...)' : 'पेश गर्नुहोस् (Submit for Verification)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationPage;
