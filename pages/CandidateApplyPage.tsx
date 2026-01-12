
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { registerCandidate } from '../services/dataService';
import { FaPlus, FaTrash, FaUserEdit, FaInfoCircle } from 'react-icons/fa';
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
  
  // Proposals state now array of objects
  const [proposals, setProposals] = useState<Proposal[]>([
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' }
  ]); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProposalChange = (index: number, field: keyof Proposal, value: string) => {
    const newProposals = [...proposals];
    newProposals[index] = { ...newProposals[index], [field]: value };
    setProposals(newProposals);
  };

  const addProposal = () => {
    setProposals([...proposals, { title: '', description: '' }]);
  };

  const removeProposal = (index: number) => {
    if (proposals.length <= 5) return;
    const newProposals = proposals.filter((_, i) => i !== index);
    setProposals(newProposals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    
    // Validations
    if (!party) {
        alert("Please select a party affiliation.");
        return;
    }
    if (!ecFiled) {
        alert("Please specify if you have filed with the Election Commission.");
        return;
    }
    if (proposals.some(p => p.title.trim() === '' || p.description.trim() === '')) {
        alert("All 5 proposals must have a title and a description.");
        return;
    }

    setIsSubmitting(true);
    
    try {
        await registerCandidate({
            user_id: user.id,
            constituency_id: id,
            name: name || user.phone_number,
            qualification,
            background,
            proposals: proposals,
            party_affiliation: party,
            election_commission_filed: ecFiled === 'yes'
        });
        
        alert("Candidate application submitted successfully! It is now PENDING ADMIN APPROVAL. You will be listed once approved.");
        navigate(`/constituency/${id}`);
    } catch (err) {
        console.error(err);
        alert("Failed to submit application.");
        setIsSubmitting(false);
    }
  };

  const inputClass = "mt-1 block w-full border border-slate-300 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] sm:text-sm";
  const labelClass = "block text-sm font-semibold text-slate-700";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-8">
        <div className="border-b border-slate-100 pb-6 mb-8">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <FaUserEdit className="mr-3 text-[#0094da]" />
                उम्मेदवारी दर्ता फारम (Candidate Registration)
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
                आफ्नो निर्वाचन क्षेत्रको नेतृत्व गर्न तयार हुनुहोस्। यो फारम प्रशासकको स्वीकृतिको लागि पेश गरिनेछ।
                <br />
                <span className="font-english opacity-80">(Step forward to lead. This form will be submitted for admin approval.)</span>
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>पूरा नाम (Full Name)</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>शैक्षिक योग्यता (Qualification)</label>
                    <input type="text" required value={qualification} onChange={e => setQualification(e.target.value)} placeholder="e.g. Masters in Economics" className={inputClass} />
                </div>
            </div>

            {/* Political Details */}
            <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>राजनीतिक दल / संलग्नता (Party Affiliation)</label>
                    <select 
                        required 
                        value={party} 
                        onChange={e => setParty(e.target.value)} 
                        className={inputClass}
                    >
                        <option value="">Select Party</option>
                        {PARTIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                
                <div>
                    <label className={labelClass}>निर्वाचन आयोगमा उम्मेदवारी दर्ता भयो? (Filed with Election Commission?)</label>
                    <div className="mt-2 flex space-x-4">
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                name="ecFiled" 
                                value="yes" 
                                checked={ecFiled === 'yes'} 
                                onChange={e => setEcFiled(e.target.value)}
                                className="form-radio text-[#0094da]" 
                            />
                            <span className="ml-2 text-slate-700">Yes (हो)</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                name="ecFiled" 
                                value="no" 
                                checked={ecFiled === 'no'} 
                                onChange={e => setEcFiled(e.target.value)}
                                className="form-radio text-red-600" 
                            />
                            <span className="ml-2 text-slate-700">No (होइन)</span>
                        </label>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        <FaInfoCircle className="inline mr-1"/>
                        Note: Official candidates must mark 'Yes'.
                    </p>
                </div>
            </div>

            <div>
                <label className={labelClass}>अनुभव / पृष्ठभूमि (Background)</label>
                <textarea required value={background} onChange={e => setBackground(e.target.value)} rows={3} className={inputClass} placeholder="Brief description of your past work..." />
            </div>

            {/* Proposals Section */}
            <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm">
                 <div className="flex justify-between items-center mb-4">
                     <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                         मुख्य एजेन्डाहरु (Key Proposals - Min 5)
                     </label>
                     <span className="text-xs text-slate-500">
                         Click + to add more
                     </span>
                 </div>
                 
                 <div className="space-y-6">
                     {proposals.map((proposal, index) => (
                         <div key={index} className="bg-white p-4 border border-slate-200 rounded-sm relative">
                             <div className="absolute top-2 right-2 text-xs font-bold text-slate-300">#{index + 1}</div>
                             <div className="space-y-3">
                                 <div>
                                     <label className="block text-xs font-semibold text-slate-600 mb-1">प्रस्तावको शीर्षक (Title)</label>
                                     <input 
                                        type="text"
                                        required
                                        value={proposal.title}
                                        onChange={e => handleProposalChange(index, 'title', e.target.value)}
                                        className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0094da] focus:ring-1 focus:ring-[#0094da]"
                                        placeholder="e.g. Clean Water Initiative"
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-semibold text-slate-600 mb-1">विस्तृत विवरण (Description)</label>
                                     <textarea 
                                        required
                                        value={proposal.description}
                                        onChange={e => handleProposalChange(index, 'description', e.target.value)}
                                        className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:border-[#0094da] focus:ring-1 focus:ring-[#0094da]"
                                        placeholder="Explain how you will achieve this..."
                                        rows={2}
                                     />
                                 </div>
                             </div>
                             
                             {proposals.length > 5 && (
                                 <button type="button" onClick={() => removeProposal(index)} className="absolute bottom-2 right-2 text-slate-400 hover:text-red-600">
                                     <FaTrash className="w-4 h-4" />
                                 </button>
                             )}
                         </div>
                     ))}
                 </div>
                 
                 <button type="button" onClick={addProposal} className="mt-4 text-sm text-[#0094da] font-bold flex items-center hover:text-[#007bb8] border border-dashed border-[#0094da] px-4 py-2 rounded-sm w-full justify-center">
                     <FaPlus className="w-3 h-3 mr-1" /> अर्को प्रस्ताव थप्नुहोस् (Add Proposal)
                 </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-base font-bold text-white bg-[#0094da] hover:bg-[#007bb8] focus:outline-none transition uppercase tracking-wide"
                >
                    {isSubmitting ? 'प्रक्रियामा... (Processing...)' : 'दर्ता गर्नुहोस् (Submit Application)'}
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">
                    Submiting will send your application for administrative review.
                </p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateApplyPage;
