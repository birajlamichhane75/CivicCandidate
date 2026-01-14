
import React, { useEffect, useState } from 'react';
import { getPendingVerifications, processVerification, getConstituencies, getPendingCandidates, processCandidateApplication, getAllUsers, forceLogoutUser } from '../services/dataService';
import { VerificationRequest, Constituency, Candidate, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { FaCheck, FaTimes, FaEye, FaSync, FaShieldAlt, FaUserTie, FaBuilding, FaIdCard, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [pendingCandidates, setPendingCandidates] = useState<Candidate[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [activeTab, setActiveTab] = useState<'verifications' | 'candidates' | 'constituencies' | 'users'>('verifications');
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getPendingVerifications().then(setVerifications);
    getPendingCandidates().then(setPendingCandidates);
    getConstituencies().then(setConstituencies);
    getAllUsers().then(setUsers);
  };

  const handleVerification = async (id: string, approve: boolean) => {
    if(window.confirm(`Confirm Verification Action?`)) {
        await processVerification(id, approve);
        loadData();
    }
  };

  const handleCandidateApproval = async (id: string, approve: boolean) => {
      if(window.confirm(`Confirm Candidate ${approve ? 'Approval' : 'Rejection'}?`)) {
          await processCandidateApplication(id, approve);
          loadData();
      }
  };

  const handleForceLogout = async (userId: string, phoneNumber: string) => {
      if (window.confirm(`Are you sure you want to FORCE LOGOUT user ${phoneNumber}? They will need to login again.`)) {
          try {
              await forceLogoutUser(userId);
              alert(`User ${phoneNumber} has been flagged for logout.`);
              loadData();
          } catch (e) {
              alert("Failed to force logout user.");
          }
      }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-english">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <FaShieldAlt className="w-6 h-6 mr-3 text-slate-700" />
                {t('प्रशासक पोर्टल', 'Admin Portal')}
            </h1>
            <div className="bg-white rounded-sm p-1 shadow-sm border border-slate-200 flex flex-wrap gap-1">
                <button 
                    onClick={() => setActiveTab('verifications')}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition flex items-center ${activeTab === 'verifications' ? 'bg-[#0094da] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <FaIdCard className="mr-2"/> ID Requests <span className="ml-2 bg-red-600 text-white px-1.5 rounded-sm text-xs">{verifications.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('candidates')}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition flex items-center ${activeTab === 'candidates' ? 'bg-[#0094da] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <FaUserTie className="mr-2"/> Candidates <span className="ml-2 bg-red-600 text-white px-1.5 rounded-sm text-xs">{pendingCandidates.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition flex items-center ${activeTab === 'users' ? 'bg-[#0094da] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <FaUsers className="mr-2"/> Users
                </button>
                <button 
                    onClick={() => setActiveTab('constituencies')}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition flex items-center ${activeTab === 'constituencies' ? 'bg-[#0094da] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <FaBuilding className="mr-2"/> Constituencies
                </button>
            </div>
        </div>

        {activeTab === 'verifications' && (
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">ID Verification Queue</h2>
                    <button onClick={loadData} className="text-slate-500 hover:text-slate-800"><FaSync className="w-4 h-4" /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Address Details</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Document</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Decision</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {verifications.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{req.phone_number}</div>
                                        <div className="text-xs text-slate-500">{new Date(req.submitted_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-900 font-bold">{req.municipality}, Ward {req.ward}</div>
                                        <div className="text-xs text-slate-500">{req.district}, {req.province}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={req.id_image_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-sm hover:bg-slate-200 border border-slate-300">
                                            <FaEye className="w-3 h-3 mr-1" /> View ID
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleVerification(req.id, true)} className="bg-emerald-600 text-white px-3 py-1 rounded-sm hover:bg-emerald-700 text-xs shadow-sm">
                                            <FaCheck className="w-3 h-3 inline mr-1" /> Approve
                                        </button>
                                        <button onClick={() => handleVerification(req.id, false)} className="bg-red-600 text-white px-3 py-1 rounded-sm hover:bg-red-700 text-xs shadow-sm">
                                            <FaTimes className="w-3 h-3 inline mr-1" /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {verifications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                                        Queue Empty. No pending verifications.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'candidates' && (
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Candidate Approval Queue</h2>
                    <button onClick={loadData} className="text-slate-500 hover:text-slate-800"><FaSync className="w-4 h-4" /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Affiliation</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Decision</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {pendingCandidates.map((cand) => (
                                <tr key={cand.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-900">{cand.name}</div>
                                        <div className="text-xs text-slate-500">Const: {cand.constituency_id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-900">{cand.party_affiliation}</div>
                                        {cand.election_commission_filed ? 
                                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 rounded-sm border border-blue-200">EC Filed</span> : 
                                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded-sm border border-amber-200">Not Filed</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <p className="font-semibold text-xs mb-1">Background:</p>
                                        <p className="line-clamp-2 text-xs mb-2">{cand.background}</p>
                                        <p className="font-semibold text-xs mb-1">Proposals ({cand.proposals.length}):</p>
                                        <ul className="list-disc list-inside text-xs">
                                            {cand.proposals.slice(0, 2).map((p, i) => <li key={i}>{p.title}</li>)}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 align-top">
                                        <button onClick={() => handleCandidateApproval(cand.id, true)} className="bg-emerald-600 text-white px-3 py-1 rounded-sm hover:bg-emerald-700 text-xs shadow-sm">
                                            <FaCheck className="w-3 h-3 inline mr-1" /> Approve
                                        </button>
                                        <button onClick={() => handleCandidateApproval(cand.id, false)} className="bg-red-600 text-white px-3 py-1 rounded-sm hover:bg-red-700 text-xs shadow-sm">
                                            <FaTimes className="w-3 h-3 inline mr-1" /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pendingCandidates.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                                        No pending candidate applications.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">All Users & Sessions</h2>
                    <button onClick={loadData} className="text-slate-500 hover:text-slate-800"><FaSync className="w-4 h-4" /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Verification Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Constituency</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {users.map((u) => (
                                <tr key={u.id} className={`hover:bg-slate-50 ${u.force_logout ? 'bg-red-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900">{u.phone_number}</div>
                                        {u.force_logout && <span className="text-[10px] text-red-600 font-bold uppercase">Logout Pending</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">
                                        {u.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-sm ${
                                            u.verification_status === 'approved' ? 'bg-green-100 text-green-800' : 
                                            u.verification_status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                            'bg-amber-100 text-amber-800'
                                        }`}>
                                            {u.verification_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {u.constituency_id || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {!u.force_logout && (
                                            <button 
                                                onClick={() => handleForceLogout(u.id, u.phone_number)} 
                                                className="bg-red-100 text-red-700 px-3 py-1.5 rounded-sm hover:bg-red-200 text-xs shadow-sm flex items-center"
                                            >
                                                <FaSignOutAlt className="w-3 h-3 mr-1" /> Force Logout
                                            </button>
                                        )}
                                        {u.force_logout && (
                                            <span className="text-slate-400 italic text-xs">Terminated</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'constituencies' && (
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Master Data</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {constituencies.map(c => (
                        <div key={c.id} className="border border-slate-200 rounded-sm p-3 hover:border-slate-400 transition bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-sm">{c.name}</h3>
                            <p className="text-xs text-slate-500 mb-2">{c.district}</p>
                            <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-2 mt-2">
                                <span className="text-slate-400">ID: {c.id}</span>
                                <span className={`font-medium ${c.mp_name ? 'text-emerald-700' : 'text-slate-400'}`}>{c.mp_name ? 'Active MP' : 'Vacant'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
