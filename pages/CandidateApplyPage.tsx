import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { registerCandidate } from '../services/dataService';
import { FaPlus, FaTrash, FaUserEdit } from 'react-icons/fa';

const CandidateApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.full_name || '');
  const [qualification, setQualification] = useState('');
  const [background, setBackground] = useState('');
  const [proposals, setProposals] = useState<string[]>(['', '', '', '', '']); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProposalChange = (index: number, value: string) => {
    const newProposals = [...proposals];
    newProposals[index] = value;
    setProposals(newProposals);
  };

  const addProposal = () => {
    setProposals([...proposals, '']);
  };

  const removeProposal = (index: number) => {
    if (proposals.length <= 5) return;
    const newProposals = proposals.filter((_, i) => i !== index);
    setProposals(newProposals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    if (proposals.some(p => p.trim() === '')) {
        alert("Please fill all fields.");
        return;
    }
    setIsSubmitting(true);
    await registerCandidate({
        user_id: user.id,
        constituency_id: id,
        name: name || user.phone_number,
        qualification,
        background,
        proposals: proposals.filter(p => p.trim() !== '')
    });
    navigate(`/constituency/${id}/pre-election`);
  };

  const inputClass = "mt-1 block w-full border border-slate-300 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] sm:text-sm";
  const labelClass = "block text-sm font-semibold text-slate-700";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-8">
        <div className="border-b border-slate-100 pb-6 mb-8">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <FaUserEdit className="mr-3 text-[#0094da]" />
                उम्मेदवारी दर्ता फारम (Candidate Registration)
            </h1>
            <p className="text-slate-500 mt-2 text-sm">आफ्नो निर्वाचन क्षेत्रको नेतृत्व गर्न तयार हुनुहोस्। (Step forward to lead.)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

             <div>
                <label className={labelClass}>अनुभव / पृष्ठभूमि (Background)</label>
                <textarea required value={background} onChange={e => setBackground(e.target.value)} rows={3} className={inputClass} placeholder="Brief description..." />
            </div>

            <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm">
                 <label className="block text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">मुख्य एजेन्डाहरु (Key Proposals - Min 5)</label>
                 <div className="space-y-3">
                     {proposals.map((proposal, index) => (
                         <div key={index} className="flex gap-2 items-center">
                             <span className="text-xs text-slate-400 w-5 font-english">{index + 1}.</span>
                             <input 
                                type="text"
                                required
                                value={proposal}
                                onChange={e => handleProposalChange(index, e.target.value)}
                                className={inputClass}
                                placeholder="Proposal..."
                             />
                             {proposals.length > 5 && (
                                 <button type="button" onClick={() => removeProposal(index)} className="text-slate-400 hover:text-red-600 p-2">
                                     <FaTrash className="w-4 h-4" />
                                 </button>
                             )}
                         </div>
                     ))}
                 </div>
                 <button type="button" onClick={addProposal} className="mt-4 text-sm text-[#0094da] font-bold flex items-center hover:text-[#007bb8]">
                     <FaPlus className="w-3 h-3 mr-1" /> थप गर्नुहोस् (Add Proposal)
                 </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-sm font-bold text-white bg-[#0094da] hover:bg-[#007bb8] focus:outline-none transition uppercase tracking-wide"
                >
                    {isSubmitting ? 'प्रक्रियामा... (Processing...)' : 'दर्ता गर्नुहोस् (Submit Candidacy)'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateApplyPage;