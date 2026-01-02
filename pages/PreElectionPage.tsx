import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCandidates, voteForCandidate, hasVoted } from '../services/dataService';
import { useAuth } from '../services/authService';
import { Candidate } from '../types';
import { FaUserTie, FaCheckDouble, FaScroll, FaChevronLeft, FaUniversity } from 'react-icons/fa';

const PreElectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (!user || !window.confirm('Are you sure? This action is irreversible.\n(के तपाइँ निश्चित हुनुहुन्छ?)')) return;
    
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

  if (loading) return <div className="p-8 text-center text-slate-500">डाटा लोड हुँदैछ... (Loading...)</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8 border-b border-slate-200 pb-6">
        <div>
             <Link to={`/constituency/${id}`} className="text-sm text-slate-500 hover:text-slate-900 mb-2 flex items-center font-english"><FaChevronLeft className="mr-1 w-3 h-3"/> Dashboard</Link>
            <h1 className="text-2xl font-bold text-slate-900">उम्मेदवार चयन (Select Candidate)</h1>
            <p className="text-slate-500 text-sm mt-1">उम्मेदवारको योग्यता र प्रस्ताव हेरेर मात्र मतदान गर्नुहोस्। (Vote wisely based on merit.)</p>
        </div>
        {userHasVoted && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-sm text-sm font-bold flex items-center shadow-sm">
                <FaCheckDouble className="w-4 h-4 mr-2" /> मतदान सम्पन्न (Voted)
            </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Candidates List */}
        <div className="flex-grow space-y-4">
            {candidates.length === 0 ? (
                 <div className="text-center py-16 bg-white border border-slate-200 rounded-sm">
                    <p className="text-slate-500">कुनै उम्मेदवार छैनन्। (No candidates registered.)</p>
                    <Link to={`/constituency/${id}/apply`} className="mt-4 inline-block text-slate-900 underline font-medium text-sm">Be the first candidate</Link>
                 </div>
            ) : (
                candidates.map((candidate) => (
                    <div key={candidate.id} className="bg-white rounded-sm border border-slate-200 p-6 transition hover:border-slate-300">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 flex flex-col items-center min-w-[100px] border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                                <div className="h-16 w-16 rounded-sm bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                                    <FaUserTie className="h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-slate-900 font-english">{candidate.vote_count}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-english">Votes</div>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-bold text-slate-900">{candidate.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                        <FaUniversity className="w-3 h-3 mr-1 text-slate-400" /> {candidate.qualification}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-white border border-slate-200 text-slate-600">
                                        {candidate.background}
                                    </span>
                                </div>
                                
                                <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                        <FaScroll className="w-3 h-3 mr-2" /> मुख्य एजेन्डाहरु (Key Proposals)
                                    </h4>
                                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                        {candidate.proposals.map((prop, idx) => (
                                            <li key={idx}>{prop}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-center md:justify-start">
                                <button
                                    onClick={() => handleVote(candidate.id)}
                                    disabled={userHasVoted}
                                    className={`px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-wide transition border ${
                                        userHasVoted 
                                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                        : 'bg-slate-900 text-white border-transparent hover:bg-slate-800 shadow-sm'
                                    }`}
                                >
                                    {userHasVoted ? 'भोट दिइसकियो (Done)' : 'भोट दिनुहोस् (Vote)'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Sidebar - Stats */}
        <div className="w-full lg:w-72 flex-shrink-0">
             <div className="bg-white rounded-sm border border-slate-200 p-5 sticky top-24">
                 <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 uppercase tracking-wide">अग्रस्थान (Leading)</h3>
                 <div className="space-y-0 divide-y divide-slate-100">
                    {candidates.slice(0, 3).map((c, index) => (
                        <div key={c.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                                <span className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold mr-3 ${index === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-slate-900 font-english">{c.vote_count}</span>
                        </div>
                    ))}
                    {candidates.length === 0 && <p className="text-xs text-slate-400 py-2">डाटा उपलब्ध छैन (No Data)</p>}
                 </div>

                 <div className="mt-6 pt-4 border-t border-slate-100">
                     <Link to={`/constituency/${id}/apply`} className="block w-full text-center bg-white border border-slate-300 text-slate-700 py-2 rounded-sm text-xs font-bold uppercase hover:bg-slate-50">
                        उम्मेदवारी दर्ता (Register Candidate)
                     </Link>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default PreElectionPage;