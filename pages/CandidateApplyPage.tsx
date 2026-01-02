import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { registerCandidate } from '../services/dataService';
import { Plus, Trash2 } from 'lucide-react';

const CandidateApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.full_name || '');
  const [qualification, setQualification] = useState('');
  const [background, setBackground] = useState('');
  const [proposals, setProposals] = useState<string[]>(['', '', '', '', '']); // Start with 5 empty
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
    
    // Validate
    if (proposals.some(p => p.trim() === '')) {
        alert("Please fill in all proposals.");
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Candidate Registration</h1>
        <p className="text-gray-600 mb-8">Step forward to lead your constituency. Present your vision clearly.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                />
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                <input 
                    type="text" 
                    required 
                    value={qualification} 
                    onChange={e => setQualification(e.target.value)} 
                    placeholder="e.g. Masters in Economics"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                />
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Professional/Social Background</label>
                <textarea 
                    required 
                    value={background} 
                    onChange={e => setBackground(e.target.value)} 
                    rows={3}
                    placeholder="Briefly describe your experience and work..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                />
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Key Proposals (Minimum 5)</label>
                 <div className="space-y-3">
                     {proposals.map((proposal, index) => (
                         <div key={index} className="flex gap-2">
                             <span className="mt-2 text-xs text-gray-400 w-4">{index + 1}.</span>
                             <input 
                                type="text"
                                required
                                value={proposal}
                                onChange={e => handleProposalChange(index, e.target.value)}
                                placeholder={`Proposal ${index + 1}`}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                             />
                             {proposals.length > 5 && (
                                 <button type="button" onClick={() => removeProposal(index)} className="text-red-500 hover:text-red-700">
                                     <Trash2 className="w-5 h-5" />
                                 </button>
                             )}
                         </div>
                     ))}
                 </div>
                 <button 
                    type="button" 
                    onClick={addProposal} 
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                 >
                     <Plus className="w-4 h-4 mr-1" /> Add Proposal
                 </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isSubmitting ? 'Registering...' : 'Submit Candidacy'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateApplyPage;