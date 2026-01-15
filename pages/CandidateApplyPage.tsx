
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { registerCandidate, uploadCandidateProfileImage } from '../services/dataService';
import { FaPlus, FaTrash, FaUserEdit, FaInfoCircle, FaCheckCircle, FaClock, FaCalendarAlt, FaCamera, FaHandshake } from 'react-icons/fa';
import { Proposal } from '../types';

const PARTIES = [
  "Nepali Congress",
  "CPN (UML)",
  "CPN (Maoist Centre)",
  "Rastriya Swatantra Party",
  "Rastriya Prajatantra Party",
  "Janamat Party",
  "Independent (स्वतन्त्र)",
  "Other / Undecided"
];

const CandidateApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.full_name || '');
  const [qualification, setQualification] = useState('');
  const [background, setBackground] = useState('');
  const [party, setParty] = useState('');
  const [ecFiled, setEcFiled] = useState<string>(''); // "yes" or "no"
  
  // New Fields
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [commitmentConfirmed, setCommitmentConfirmed] = useState(false);

  // Proposals state now initialized with 5 empty items to encourage filling them out
  const [proposals, setProposals] = useState<Proposal[]>([
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' }
  ]); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [decisionDates, setDecisionDates] = useState<{ ad: string, bs: string } | null>(null);

  const calculateDecisionTime = () => {
    const now = new Date();
    const target = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours
    const adDate = target.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const bsYear = target.getFullYear() + 57;
    const bsMonths = ["Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
    const bsMonthIndex = (target.getMonth() + 8) % 12; 
    const bsDay = target.getDate(); 
    return { ad: adDate, bs: `${bsYear} ${bsMonths[bsMonthIndex]} ${bsDay}` };
  };

  const handleProposalChange = (index: number, field: keyof Proposal, value: string) => {
    const updated = [...proposals];
    updated[index] = { ...updated[index], [field]: value };
    setProposals(updated);
  };

  const addProposal = () => {
    if (proposals.length < 10) {
      setProposals([...proposals, { title: '', description: '' }]);
    }
  };

  const removeProposal = (index: number) => {
    if (proposals.length > 1) {
      const updated = proposals.filter((_, i) => i !== index);
      setProposals(updated);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;
    if (!party) { alert("Please select a party."); return; }
    if (!ecFiled) { alert("Please specify EC Registration status."); return; }
    
    // Validate Commitment
    if (!commitmentConfirmed) {
      alert("You must confirm your commitment to communicate with citizens.");
      return;
    }

    const validProposals = proposals.filter(p => p.title.trim() !== '' && p.description.trim() !== '');
    if (validProposals.length < 5) {
      alert("Minimum 5 proposals are required to support your candidacy.");
      return;
    }

    setIsSubmitting(true);

    try {
        let profileImageUrl = undefined;
        if (profileImage) {
            profileImageUrl = await uploadCandidateProfileImage(profileImage, user.id);
        }

        await registerCandidate({
            user_id: user.id,
            constituency_id: id,
            name,
            party_affiliation: party,
            qualification,
            background,
            proposals: validProposals,
            election_commission_filed: ecFiled === 'yes',
            profile_image_url: profileImageUrl,
            confirmed_commitment: commitmentConfirmed
        });

        setDecisionDates(calculateDecisionTime());
        setIsSuccess(true);
    } catch (err: any) {
        alert("Failed to apply: " + err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSuccess && decisionDates) {
     return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="bg-white rounded-sm border-t-4 border-[#0094da] shadow-lg p-10 text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-50 mb-6">
                    <FaCheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted</h2>
                <p className="text-xl text-slate-600 mb-8 font-medium">
                    तपाईंको उम्मेदवारी आवेदन प्राप्त भएको छ। <br/>
                    <span className="text-sm text-slate-500 mt-2 block">(Your candidacy application is under review.)</span>
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 mb-8 text-left">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                        Estimated Review Completion
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-3">
                            <FaCalendarAlt className="w-5 h-5 text-[#0094da] mt-1" />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Bikram Sambat</p>
                                <p className="text-lg font-bold text-slate-800">{decisionDates.bs}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaClock className="w-5 h-5 text-slate-400 mt-1" />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">English Date</p>
                                <p className="text-lg font-bold text-slate-800 font-english">{decisionDates.ad}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                  onClick={() => navigate(`/constituency/${id}`)}
                  className="bg-[#0094da] text-white px-8 py-3 rounded-sm font-bold hover:bg-[#007bb8] transition shadow-md"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <FaUserEdit className="mr-3 text-slate-700" />
            उम्मेदवारी दर्ता (Candidate Registration)
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
             Constituency: <span className="font-bold text-slate-800">{id}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Personal Details */}
          <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-[#0094da] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">1</span>
              व्यक्तिगत विवरण (Personal Details)
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">पूरा नाम (Full Name)</label>
                    <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        className="w-full border border-slate-300 p-2 rounded-sm focus:ring-1 focus:ring-[#0094da]"
                    />
                </div>

                {/* Profile Image Upload - NEW */}
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">प्रोफाइल फोटो (Profile Picture) <span className="text-slate-400 font-normal text-xs">(Optional)</span></label>
                   <div className="flex items-center space-x-6">
                      <div className="h-24 w-24 bg-white border border-slate-300 rounded-full flex items-center justify-center overflow-hidden relative">
                          {profilePreview ? (
                              <img src={profilePreview} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                              <FaCamera className="text-slate-300 h-8 w-8" />
                          )}
                      </div>
                      <div>
                          <label className="cursor-pointer bg-white border border-slate-300 px-4 py-2 rounded-sm text-sm font-medium hover:bg-slate-50 text-slate-700 shadow-sm transition">
                             Choose Photo
                             <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                          </label>
                          <p className="text-xs text-slate-500 mt-2">JPG, PNG max 2MB.</p>
                      </div>
                   </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">राजनीतिक दल (Political Party)</label>
                    <select 
                        required 
                        value={party} 
                        onChange={e => setParty(e.target.value)}
                        className="w-full border border-slate-300 p-2 rounded-sm focus:ring-1 focus:ring-[#0094da]"
                    >
                        <option value="">छान्नुहोस् (Select)</option>
                        {PARTIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">योग्यता (Qualification)</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="Eg. Masters in Economics, Social Worker"
                        value={qualification} 
                        onChange={e => setQualification(e.target.value)}
                        className="w-full border border-slate-300 p-2 rounded-sm focus:ring-1 focus:ring-[#0094da]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">अनुभव / पृष्ठभूमि (Background)</label>
                    <textarea 
                        required 
                        rows={3}
                        placeholder="Brief summary of your background..."
                        value={background} 
                        onChange={e => setBackground(e.target.value)}
                        className="w-full border border-slate-300 p-2 rounded-sm focus:ring-1 focus:ring-[#0094da]"
                    />
                </div>
            </div>
          </div>

          {/* Section 2: EC Status */}
          <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-[#0094da] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">2</span>
              निर्वाचन आयोग दर्ता (EC Registration)
            </h3>
            <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="ec_status" 
                        value="yes" 
                        checked={ecFiled === 'yes'} 
                        onChange={e => setEcFiled(e.target.value)}
                        className="text-[#0094da] focus:ring-[#0094da]"
                    />
                    <span className="text-sm font-medium">Yes, Registered</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="ec_status" 
                        value="no" 
                        checked={ecFiled === 'no'} 
                        onChange={e => setEcFiled(e.target.value)}
                        className="text-[#0094da] focus:ring-[#0094da]"
                    />
                    <span className="text-sm font-medium">No / Pending</span>
                </label>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center">
                <FaInfoCircle className="mr-1" />
                This helps verify if you are officially on the ballot.
            </p>
          </div>

          {/* Section 3: Proposals */}
          <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <span className="bg-[#0094da] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">3</span>
                    एजेन्डा / प्रस्तावहरू (Proposals)
                </h3>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-sm border border-amber-200 font-bold">Minimum 5 Required</span>
            </div>
            
            <div className="space-y-4">
                {proposals.map((prop, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-sm relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                            {proposals.length > 1 && (
                                <button type="button" onClick={() => removeProposal(idx)} className="text-red-400 hover:text-red-600">
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Title {idx + 1}</label>
                            <input 
                                type="text"
                                required 
                                value={prop.title}
                                onChange={e => handleProposalChange(idx, 'title', e.target.value)}
                                className="w-full border-b border-slate-200 focus:border-[#0094da] focus:outline-none py-1 text-sm font-bold"
                                placeholder="Short Title (eg. Clean Water)"
                            />
                        </div>
                        <div>
                             <textarea 
                                required 
                                rows={2}
                                value={prop.description}
                                onChange={e => handleProposalChange(idx, 'description', e.target.value)}
                                className="w-full border-slate-200 bg-slate-50 p-2 text-sm focus:outline-none focus:bg-white border focus:border-[#0094da] rounded-sm"
                                placeholder="Description..."
                            />
                        </div>
                    </div>
                ))}
            </div>

            {proposals.length < 10 && (
                <button 
                    type="button" 
                    onClick={addProposal}
                    className="mt-4 flex items-center text-sm font-bold text-[#0094da] hover:text-[#007bb8]"
                >
                    <FaPlus className="mr-2" /> Add Another Proposal
                </button>
            )}
          </div>

          {/* Section 4: Commitment Confirmation - NEW */}
          <div className={`p-5 border rounded-sm transition-colors duration-200 ${commitmentConfirmed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="flex items-center h-6">
                      <input 
                          type="checkbox" 
                          checked={commitmentConfirmed} 
                          onChange={e => setCommitmentConfirmed(e.target.checked)}
                          className="h-5 w-5 text-[#0094da] border-slate-300 rounded focus:ring-[#0094da] cursor-pointer"
                      />
                  </div>
                  <div className="text-sm text-slate-700">
                      <div className="flex items-start mb-1">
                          <FaHandshake className="w-4 h-4 text-slate-500 mr-2 mt-0.5" />
                          <span className="font-bold text-slate-900">
                             I confirm that I will communicate with citizens of this area through the Civic Candidate platform.
                          </span>
                      </div>
                      <p className="text-xs text-slate-500 pl-6">
                          (म पुष्टि गर्छु कि म यस प्लेटफर्म मार्फत यस क्षेत्रका नागरिकहरूसँग संवाद गर्नेछु।)
                      </p>
                  </div>
              </label>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting || !commitmentConfirmed}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-base font-bold text-white bg-[#0094da] hover:bg-[#007bb8] focus:outline-none disabled:bg-slate-300 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Submitting...' : 'उम्मेदवारी दर्ता गर्नुहोस् (Submit Application)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateApplyPage;
