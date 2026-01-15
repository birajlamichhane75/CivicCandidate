
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCandidates, voteForCandidate, hasVoted } from '../services/dataService';
import { useAuth } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { Candidate, Proposal } from '../types';
import { FaUserTie, FaCheckDouble, FaScroll, FaChevronLeft, FaUniversity, FaFlag, FaStamp, FaTimes, FaCheckCircle, FaExclamationCircle, FaListAlt, FaVoteYea } from 'react-icons/fa';

const PreElectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [viewAllCandidate, setViewAllCandidate] = useState<Candidate | null>(null);
  const [candidateToVote, setCandidateToVote] = useState<Candidate | null>(null);

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

  const initiateVote = (candidate: Candidate) => {
      setCandidateToVote(candidate);
  };

  const confirmVote = async () => {
    if (!user || !candidateToVote) return;
    
    try {
        await voteForCandidate(candidateToVote.id, user.phone_number);
        setUserHasVoted(true);
        setCandidateToVote(null); // Close Modal
        if (id) {
            const cands = await getCandidates(id);
            setCandidates(cands);
        }
    } catch (error) {
        alert('Failed to cast vote.');
        setCandidateToVote(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">{t('डाटा लोड हुँदैछ...', 'Loading data...')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Voting Confirmation Modal */}
      {candidateToVote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm">
             <div className="bg-white rounded-sm shadow-xl max-w-sm w-full p-6 relative animate-fade-in-up border-t-4 border-[#0094da] text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-sky-50 mb-4">
                    <FaVoteYea className="h-8 w-8 text-[#0094da]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Vote</h3>
                <p className="text-slate-600 text-sm mb-6">
                    के तपाइँ <strong>{candidateToVote.name}</strong> लाई भोट गर्न निश्चित हुनुहुन्छ? यो कार्य अपरिवर्तनीय छ।
                    <br/>
                    <span className="text-xs text-slate-500 mt-2 block">(Are you sure you want to vote for this candidate? This action is irreversible.)</span>
                </p>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setCandidateToVote(null)}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-sm hover:bg-slate-50 font-medium text-sm transition"
                    >
                        रद्द (Cancel)
                    </button>
                    <button 
                        onClick={confirmVote}
                        className="flex-1 px-4 py-2 bg-[#0094da] text-white rounded-sm hover:bg-[#007bb8] font-bold text-sm shadow-sm transition"
                    >
                        निश्चित गर्नुहोस् (Confirm)
                    </button>
                </div>
             </div>
        </div>
      )}

      {/* Single Proposal Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-sm shadow-xl max-w-lg w-full p-6 relative animate-fade-in-up border-t-4 border-[#0094da]">
                <button 
                    onClick={() => setSelectedProposal(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-50 rounded-full mr-3">
                        <FaScroll className="w-5 h-5 text-[#0094da]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 pr-6">{selectedProposal.title}</h3>
                </div>
                <div className="prose prose-sm text-slate-600 max-h-[60vh] overflow-y-auto bg-slate-50 p-4 rounded-sm border border-slate-100">
                    <p className="whitespace-pre-wrap leading-relaxed">{selectedProposal.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={() => setSelectedProposal(null)}
                        className="bg-slate-800 text-white px-5 py-2 rounded-sm text-sm font-medium hover:bg-slate-900 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* View All Proposals Modal */}
      {viewAllCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full p-0 relative animate-fade-in-up flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{viewAllCandidate.name} - सबै प्रस्तावहरू</h3>
                        <p className="text-sm text-slate-500">All Candidate Proposals ({viewAllCandidate.proposals.length})</p>
                    </div>
                    <button 
                        onClick={() => setViewAllCandidate(null)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {viewAllCandidate.proposals.map((prop, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-sm p-4 hover:border-[#0094da] transition">
                                <h4 className="font-bold text-slate-800 mb-2 flex items-center">
                                    <span className="bg-[#0094da] text-white text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2">{idx + 1}</span>
                                    {prop.title}
                                </h4>
                                <p className="text-slate-600 text-sm leading-relaxed pl-8">
                                    {prop.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                     <button 
                        onClick={() => setViewAllCandidate(null)}
                        className="bg-slate-800 text-white px-5 py-2 rounded-sm text-sm font-medium hover:bg-slate-900 transition"
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
        <div className="flex-grow space-y-8">
            {candidates.length === 0 ? (
                 <div className="text-center py-16 bg-white border border-slate-200 rounded-sm">
                    <p className="text-slate-500 mb-4">{t('कुनै उम्मेदवार स्वीकृत भएका छैनन्।', 'No approved candidates yet.')}</p>
                    <Link to={`/constituency/${id}/apply`} className="inline-block bg-[#0094da] text-white px-6 py-2 rounded-sm text-sm font-medium">Apply to be a Candidate</Link>
                 </div>
            ) : (
                candidates.map((candidate) => (
                    <div key={candidate.id} className="bg-white rounded-sm border border-slate-200 transition shadow-sm overflow-hidden group hover:shadow-md">
                        
                        {/* SECTION 1: EC STATUS HIGHLIGHT */}
                        <div className={`px-6 py-3 border-b flex items-center justify-between ${candidate.election_commission_filed ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                            <div className="flex items-center font-bold text-sm">
                                {candidate.election_commission_filed ? (
                                    <>
                                        <FaCheckCircle className="mr-2 w-4 h-4" />
                                        <span>पहिले दर्ता गरिसकिएको उम्मेदवार (EC Registered)</span>
                                    </>
                                ) : (
                                    <>
                                        <FaExclamationCircle className="mr-2 w-4 h-4" />
                                        <span>उम्मेदवार दर्ता भएको छैन (Not Registered with EC)</span>
                                    </>
                                )}
                            </div>
                            {candidate.election_commission_filed && <FaStamp className="opacity-20 w-8 h-8" />}
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Vote Count Badge & Profile Image */}
                                <div className="flex-shrink-0 flex flex-col items-center min-w-[100px] md:border-r border-slate-100 md:pr-6">
                                    
                                    {/* Profile Image Display */}
                                    <div className="h-24 w-24 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3 relative overflow-hidden shadow-sm">
                                        {candidate.profile_image_url ? (
                                            <img 
                                                src={candidate.profile_image_url} 
                                                alt={candidate.name} 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <FaUserTie className="h-10 w-10" />
                                        )}
                                    </div>

                                    <div className="text-center w-full">
                                        <div className="text-3xl font-bold text-slate-900 font-english">{candidate.vote_count}</div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-english">Votes</div>
                                    </div>
                                    <button
                                        onClick={() => initiateVote(candidate)}
                                        disabled={userHasVoted}
                                        className={`mt-4 w-full px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide transition border shadow-sm ${
                                            userHasVoted 
                                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                            : 'bg-[#0094da] text-white border-transparent hover:bg-[#007bb8] hover:shadow-md'
                                        }`}
                                    >
                                        {userHasVoted ? t('Done', 'Done') : t('Vote', 'Vote')}
                                    </button>
                                </div>

                                {/* SECTION 2: IDENTITY & PARTY */}
                                <div className="flex-grow space-y-5">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{candidate.name}</h3>
                                        
                                        {/* Party Info Badge */}
                                        <div className="inline-flex items-center bg-slate-800 text-white px-3 py-1.5 rounded-sm text-sm font-medium shadow-sm">
                                            <FaFlag className="mr-2 text-yellow-400" />
                                            {candidate.party_affiliation}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 text-sm">
                                        <div className="flex items-start">
                                            <FaUniversity className="w-4 h-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="font-bold text-slate-700 block text-xs uppercase tracking-wide">Qualification</span>
                                                <span className="text-slate-800">{candidate.qualification}</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-sm border border-slate-100 italic text-slate-600 text-sm">
                                            "{candidate.background}"
                                        </div>
                                    </div>

                                    {/* SECTION 3: PROPOSALS */}
                                    <div className="border-t border-slate-100 pt-5">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                                            <FaScroll className="w-3 h-3 mr-2" /> {t('मुख्य एजेन्डाहरु', 'Key Proposals')}
                                        </h4>
                                        <div className="space-y-2 mb-3">
                                            {candidate.proposals.slice(0, 3).map((prop, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setSelectedProposal(prop)}
                                                    className="w-full text-left flex items-start p-2 rounded-sm hover:bg-slate-50 border border-transparent hover:border-slate-200 transition group"
                                                >
                                                    <span className="text-[#0094da] font-bold mr-2 text-sm">{idx + 1}.</span>
                                                    <span className="text-sm text-slate-700 font-medium group-hover:text-[#0094da] transition">
                                                        {prop.title}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => setViewAllCandidate(candidate)}
                                            className="text-xs font-bold text-[#0094da] hover:text-[#007bb8] flex items-center uppercase tracking-wide py-2"
                                        >
                                            <FaListAlt className="mr-2" />
                                            सबै प्रस्तावहरू हेर्नुहोस् (View All {candidate.proposals.length} Proposals)
                                        </button>
                                    </div>
                                </div>
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
