import React, { useEffect, useState } from 'react';
import { getPendingVerifications, processVerification, getConstituencies } from '../services/dataService';
import { VerificationRequest, Constituency } from '../types';
import { FaCheck, FaTimes, FaEye, FaSync, FaShieldAlt } from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [activeTab, setActiveTab] = useState<'verifications' | 'constituencies'>('verifications');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getPendingVerifications().then(setVerifications);
    getConstituencies().then(setConstituencies);
  };

  const handleVerification = async (id: string, approve: boolean) => {
    if(window.confirm(`Confirm Action?`)) {
        await processVerification(id, approve);
        loadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-english">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <FaShieldAlt className="w-6 h-6 mr-3 text-slate-700" />
                Admin Portal
            </h1>
            <div className="bg-white rounded-sm p-1 shadow-sm border border-slate-200 flex">
                <button 
                    onClick={() => setActiveTab('verifications')}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition ${activeTab === 'verifications' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    Pending Verifications <span className="ml-2 bg-red-600 text-white px-1.5 rounded-sm text-xs">{verifications.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('constituencies')}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition ${activeTab === 'constituencies' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    Constituencies
                </button>
            </div>
        </div>

        {activeTab === 'verifications' && (
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Verification Queue</h2>
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