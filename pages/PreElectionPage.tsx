import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCandidates, voteForCandidate, hasVoted } from '../services/dataService';
import { useAuth } from '../services/authService';
import { Candidate } from '../types';
import { FaThumbsUp, FaUser, FaAward, FaScroll, FaCheck } from 'react-icons/fa';

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
    if (!user || !window.confirm('Are you sure you want to vote for this candidate? You cannot change your vote later.')) return;
    
    try {
        await voteForCandidate(candidateId, user.phone_number);
        setUserHasVoted(true);
        // Refresh candidates to show new count
        if (id) {
            const cands = await getCandidates(id);
            setCandidates(cands);
        }
    } catch (error) {
        alert('Voting failed: ' + error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Candidates...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
             <Link to={`/constituency/${id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-1 block">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold text-gray-900">Select Your Candidate</h1>
            <p className="text-gray-600">Review proposals and background carefully before voting.</p>
        </div>
        {userHasVoted && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold flex items-center">
                <FaCheck className="w-5 h-5 mr-2" /> You Have Voted
            </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Candidates List */}
        <div className="flex-grow space-y-6">
            {candidates.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">No candidates have registered yet.</p>
                    <Link to={`/constituency/${id}/apply`} className="mt-4 inline-block text-blue-600 hover:underline">Be the first candidate</Link>
                 </div>
            ) : (
                candidates.map((candidate) => (
                    <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2">
                                    <FaUser className="h-12 w-12" />
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{candidate.vote_count}</div>
                                    <div className="text-xs text-gray-500 uppercase">Votes</div>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <FaAward className="w-3 h-3 mr-1" /> {candidate.qualification}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Background: {candidate.background}
                                    </span>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        <FaScroll className="w-4 h-4 mr-2" /> Key Proposals
                                    </h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
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
                                    className={`px-6 py-3 rounded-lg font-bold flex items-center ${
                                        userHasVoted 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition'
                                    }`}
                                >
                                    <FaThumbsUp className="w-5 h-5 mr-2" />
                                    {userHasVoted ? 'Voted' : 'Vote'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Sidebar - Top Candidates */}
        <div className="w-full lg:w-80 flex-shrink-0">
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                 <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Top Contenders</h3>
                 <div className="space-y-4">
                    {candidates.slice(0, 3).map((c, index) => (
                        <div key={c.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                                    <p className="text-xs text-gray-500">{c.qualification}</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-blue-600">{c.vote_count}</span>
                        </div>
                    ))}
                    {candidates.length === 0 && <p className="text-sm text-gray-400">No data yet.</p>}
                 </div>

                 <div className="mt-8 pt-6 border-t border-gray-100">
                     <p className="text-sm text-gray-600 mb-4">Think you can do better?</p>
                     <Link to={`/constituency/${id}/apply`} className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                        Become a Candidate
                     </Link>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default PreElectionPage;