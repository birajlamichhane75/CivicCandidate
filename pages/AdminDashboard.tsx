import React, { useEffect, useState } from 'react';
import { getPendingVerifications, processVerification, getConstituencies } from '../services/dataService';
import { VerificationRequest, Constituency } from '../types';
import { Check, X, Eye, RefreshCw, BarChart2, Shield } from 'lucide-react';

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
    if(window.confirm(`Are you sure you want to ${approve ? 'approve' : 'reject'} this user?`)) {
        await processVerification(id, approve);
        loadData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-blue-700" />
                Admin Control Center
            </h1>
            <div className="bg-white rounded-lg p-1 shadow-sm flex">
                <button 
                    onClick={() => setActiveTab('verifications')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'verifications' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Pending Verifications <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{verifications.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('constituencies')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'constituencies' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Constituencies
                </button>
            </div>
        </div>

        {activeTab === 'verifications' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Verification Requests</h2>
                    <button onClick={loadData} className="text-gray-500 hover:text-blue-600"><RefreshCw className="w-5 h-5" /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Declared Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Document</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {verifications.map((req) => (
                                <tr key={req.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{req.phone_number}</div>
                                        <div className="text-xs text-gray-500">Submitted: {new Date(req.submitted_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{req.municipality}, Ward {req.ward}</div>
                                        <div className="text-xs text-gray-500">{req.district}, {req.province}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={req.id_image_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                                            <Eye className="w-4 h-4 mr-1" /> View ID
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleVerification(req.id, true)} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition">
                                            <Check className="w-4 h-4 inline" /> Approve
                                        </button>
                                        <button onClick={() => handleVerification(req.id, false)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition">
                                            <X className="w-4 h-4 inline" /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {verifications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No pending verifications. Good job!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'constituencies' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Constituency Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {constituencies.map(c => (
                        <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                            <h3 className="font-bold text-gray-900">{c.name}</h3>
                            <p className="text-sm text-gray-500">{c.district}</p>
                            <div className="mt-4 flex justify-between items-center text-sm">
                                <span className="bg-gray-100 px-2 py-1 rounded">2,450 Citizens</span>
                                <span className="text-blue-600 font-medium">MP: {c.mp_name || 'Vacant'}</span>
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