
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCandidates, voteForCandidate, hasVoted } from '../services/dataService';
import { useAuth } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { Candidate, Proposal } from '../types';
import { FaUserTie, FaCheckDouble, FaScroll, FaChevronLeft, FaUniversity, FaFlag, FaStamp, FaTimes } from 'react-icons/fa';

const PreElectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    if (id && user) {
      loadData();
    }
  }, [id, user]);

  const loadData = async () => {
    setLoading(true);
    if (id) {
        const cands = await getCandidates(id);
        setCandidates(cands);
    }
    if (user) {
        const voted = await hasVoted(user.phone_number);
        setUserHasVoted(voted);
    }
    setLoading(false);
  };

  const handleVote = async (candidateId: string) => {
    if (!user || !window.confirm('Are you sure you want to vote for this candidate? This action is irreversible.\n(के तपाइँ यस उम्मेदवारलाई भोट गर्न निश्चित हुनुहुन्छ? यो कार्य अपरिवर्तनीय छ।)')) return;
    
    try {
        await voteForCandidate(candidateId, user.phone_number);
        setUserHasVoted(true);
        if (id) {
            const cands = await getCandidates(id);
            setCandidates(cands);
        }
    } catch (error) {
        alert('Failed.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">{t('डाटा लोड हुँदैछ...', 'Loading data...')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Proposal Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-sm shadow-lg max-w-lg w-full p-6 relative animate-fade-in-up">
                <button 
                    onClick={() => setSelectedProposal(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-slate-900 mb-4 pr-6">{selectedProposal.title}</h3>
                <div className="prose prose-sm text-slate-600 max-h-[60vh] overflow-y-auto">
                    <p className="whitespace-pre-wrap leading-relaxed">{selectedProposal.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={() => setSelectedProposal(null)}
                        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-sm text-sm font-medium hover:bg-slate-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6">
        <div>
             <Link to={`/constituency/${id}`} className="text-sm text-slate-500 hover:text-[#0094da] mb-2 flex items-center font-english"><FaChevronLeft className="mr-1 w-3 h-3"/> Dashboard</Link>
            <h1 className="text-2xl font-bold text-slate-900">{t('उम्मेदवार चयन', 'Select Candidate')}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {t('उम्मेदवारको योग्यता र प्रस्ताव हेरेर मात्र मतदान गर्नुहोस्।', 'Review qualifications and proposals before voting.')}
            </p>
        </div>
        {userHasVoted && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-sm text-sm font-bold flex items-center shadow-sm">
                <FaCheckDouble className="w-4 h-4 mr-2" /> {t('मतदान सम्पन्न', 'Voted')}
            </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Candidates List */}
        <div className="flex-grow space-y-6">
            {candidates.length === 0 ? (
                 <div className="text-center py-16 bg-white border border-slate-200 rounded-sm">
                    <p className="text-slate-500 mb-4">{t('कुनै उम्मेदवार स्वीकृत भएका छैनन्।', 'No approved candidates yet.')}</p>
                    <Link to={`/constituency/${id}/apply`} className="inline-block bg-[#0094da] text-white px-6 py-2 rounded-sm text-sm font-medium">Apply to be a Candidate</Link>
                 </div>
            ) : (
                candidates.map((candidate) => (
                    <div key={candidate.id} className="bg-white rounded-sm border border-slate-200 p-6 transition hover:border-[#0094da] shadow-sm">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Vote Count Badge */}
                            <div className="flex-shrink-0 flex flex-col items-center min-w-[100px] border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                                <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3 relative overflow-hidden">
                                    <FaUserTie className="h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-900 font-english">{candidate.vote_count}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-english">Votes</div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-grow">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                    <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                                        {candidate.election_commission_filed && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide" title="Official Candidate">
                                                <FaStamp className="mr-1" /> EC Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                        <FaFlag className="w-3 h-3 mr-1 text-slate-400" /> {candidate.party_affiliation || "Independent"}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                        <FaUniversity className="w-3 h-3 mr-1 text-slate-400" /> {candidate.qualification}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-slate-600 mb-4 italic">"{candidate.background}"</p>
                                
                                <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                                        <FaScroll className="w-3 h-3 mr-2" /> {t('मुख्य एजेन्डाहरु', 'Key Proposals')}
                                    </h4>
                                    <div className="space-y-2">
                                        {candidate.proposals.map((prop, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => setSelectedProposal(prop)}
                                                className="w-full text-left flex items-start p-2 rounded-sm hover:bg-white border border-transparent hover:border-slate-200 transition group"
                                            >
                                                <span className="text-[#0094da] font-bold mr-2 text-sm">{idx + 1}.</span>
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-[#0094da] transition underline decoration-dotted underline-offset-4">
                                                    {prop.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex-shrink-0 flex items-center justify-center md:justify-start">
                                <button
                                    onClick={() => handleVote(candidate.id)}
                                    disabled={userHasVoted}
                                    className={`w-full md:w-auto px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-wide transition border shadow-sm ${
                                        userHasVoted 
                                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                        : 'bg-[#0094da] text-white border-transparent hover:bg-[#007bb8] hover:shadow-md'
                                    }`}
                                >
                                    {userHasVoted ? t('भोट दिइसकियो', 'Done') : t('भोट दिनुहोस्', 'Vote')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Sidebar - Stats */}
        <div className="w-full lg:w-80 flex-shrink-0">
             <div className="bg-white rounded-sm border border-slate-200 p-5 sticky top-24">
                 <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 uppercase tracking-wide">{t('अग्रस्थान', 'Leading')}</h3>
                 <div className="space-y-0 divide-y divide-slate-100">
                    {candidates.slice(0, 3).map((c, index) => (
                        <div key={c.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                                <span className={`w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-bold mr-3 ${index === 0 ? 'bg-[#0094da] text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 line-clamp-1">{c.name}</p>
                                    <p className="text-[10px] text-slate-500">{c.party_affiliation}</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-slate-900 font-english">{c.vote_count}</span>
                        </div>
                    ))}
                    {candidates.length === 0 && <p className="text-xs text-slate-400 py-2">{t('डाटा उपलब्ध छैन', 'No Data')}</p>}
                 </div>

                 <div className="mt-6 pt-4 border-t border-slate-100">
                     <Link to={`/constituency/${id}/apply`} className="block w-full text-center bg-white border border-slate-300 text-slate-700 py-2 rounded-sm text-xs font-bold uppercase hover:bg-slate-50 hover:text-[#0094da] transition">
                        {t('उम्मेदवारी दर्ता', 'Register Candidate')}
                     </Link>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default PreElectionPage;
