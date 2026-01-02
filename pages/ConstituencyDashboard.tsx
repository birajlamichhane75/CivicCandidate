import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConstituencyById } from '../services/dataService';
import { Constituency } from '../types';
import { FaVoteYea, FaUsers, FaFileAlt, FaChevronRight } from 'react-icons/fa';

const ConstituencyDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [constituency, setConstituency] = useState<Constituency | undefined>();

  useEffect(() => {
    if (id) {
      getConstituencyById(id).then(setConstituency);
    }
  }, [id]);

  if (!constituency) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2">{constituency.name}</h1>
        <p className="text-blue-100">{constituency.district} • {constituency.province}</p>
        
        {constituency.mp_name && (
            <div className="mt-6 flex items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm w-fit">
                {constituency.mp_image && <img src={constituency.mp_image} alt="MP" className="w-12 h-12 rounded-full mr-3 border-2 border-white" />}
                <div>
                    <p className="text-xs text-blue-200 uppercase tracking-wider">Current Representative</p>
                    <p className="font-bold text-lg">{constituency.mp_name}</p>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pre-Election Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100">
            <div className="bg-blue-50 p-6 border-b border-blue-100 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-blue-900">Pre-Election Phase</h2>
                    <p className="text-sm text-blue-700">Select the best candidate</p>
                </div>
                <FaVoteYea className="h-8 w-8 text-blue-500" />
            </div>
            <div className="p-6">
                <p className="text-gray-600 mb-6">
                    View candidate profiles, read their proposals, and cast your vote for the person you trust to lead.
                </p>
                <div className="flex space-x-4">
                    <Link to={`/constituency/${id}/pre-election`} className="flex-1 bg-blue-600 text-center text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                        View Candidates
                    </Link>
                    <Link to={`/constituency/${id}/apply`} className="flex-1 bg-white border border-blue-600 text-center text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
                        Apply as Candidate
                    </Link>
                </div>
            </div>
        </div>

        {/* Post-Election Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100">
             <div className="bg-green-50 p-6 border-b border-green-100 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-green-900">Post-Election Phase</h2>
                    <p className="text-sm text-green-700">Accountability & Issues</p>
                </div>
                <FaUsers className="h-8 w-8 text-green-500" />
            </div>
            <div className="p-6">
                 <p className="text-gray-600 mb-6">
                    Report local issues, upvote community problems, and track the progress of your elected representative.
                </p>
                <Link to={`/constituency/${id}/post-election`} className="block w-full bg-green-600 text-center text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
                    Go to Issue Board
                </Link>
            </div>
        </div>
      </div>
      
      {/* Recent Activity / Stats (Placeholder for future) */}
      <div className="mt-8">
         <h3 className="text-lg font-bold text-gray-900 mb-4">Constituency Updates</h3>
         <div className="bg-white rounded-lg shadow p-6">
             <div className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="bg-yellow-100 p-2 rounded-full">
                    <FaFileAlt className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">New Issue Reported</p>
                    <p className="text-xs text-gray-500">"Road construction delayed in Ward 4" was reported today.</p>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default ConstituencyDashboard;