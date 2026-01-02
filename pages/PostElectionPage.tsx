import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIssues, reportIssue, upvoteIssue, getConstituencyById } from '../services/dataService';
import { useAuth } from '../services/authService';
import { Issue, Constituency } from '../types';
import { FaExclamationTriangle, FaChevronUp, FaCheckCircle, FaClock, FaChevronLeft, FaPen } from 'react-icons/fa';

const PostElectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [constituency, setConstituency] = useState<Constituency>();
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [showIssueForm, setShowIssueForm] = useState(false);

  useEffect(() => {
    if (id) {
        loadData();
        getConstituencyById(id).then(setConstituency);
    }
  }, [id]);

  const loadData = async () => {
      if (id) {
          const data = await getIssues(id);
          setIssues(data);
      }
  };

  const handleUpvote = async (issueId: string) => {
      if (!user) return;
      try {
          await upvoteIssue(issueId, user.phone_number);
          loadData();
      } catch (e) {
          alert("Error: " + e);
      }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id || !user) return;
      await reportIssue({
          constituency_id: id,
          title: newIssueTitle,
          description: newIssueDesc,
          status: 'pending',
          created_by: user.phone_number
      });
      setNewIssueTitle('');
      setNewIssueDesc('');
      setShowIssueForm(false);
      loadData();
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'resolved': 
            return <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">समाधान (Resolved)</span>;
          case 'in_progress': 
            return <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">प्रक्रियामा (In Progress)</span>;
          default: 
            return <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">दर्ता (Pending)</span>;
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/constituency/${id}`} className="text-sm text-slate-500 hover:text-slate-900 mb-4 block flex items-center font-english"><FaChevronLeft className="mr-1 w-3 h-3"/> Back to Dashboard</Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Issues */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">नागरिक गुनासो (Local Issues)</h1>
                    <button 
                        onClick={() => setShowIssueForm(!showIssueForm)}
                        className="bg-slate-900 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-slate-800 transition flex items-center"
                    >
                        <FaPen className="mr-2 w-3 h-3" /> दर्ता गर्नुहोस् (Report)
                    </button>
                </div>

                {showIssueForm && (
                    <div className="bg-slate-50 p-6 rounded-sm border border-slate-200 mb-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">नयाँ समस्या दर्ता फारम (New Issue Form)</h3>
                        <form onSubmit={handleReportIssue} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">विषय (Title)</label>
                                <input 
                                    className="w-full border border-slate-300 p-2 rounded-sm focus:ring-1 focus:ring-slate-900 text-sm" 
                                    placeholder="Eg. Road Damage in Ward 4" 
                                    value={newIssueTitle}
                                    onChange={e => setNewIssueTitle(e.target.value)}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">विवरण (Description)</label>
                                <textarea 
                                    className="w-full border border-slate-300 p-2 rounded-sm focus:ring-1 focus:ring-slate-900 text-sm" 
                                    placeholder="Details..." 
                                    rows={3}
                                    value={newIssueDesc}
                                    onChange={e => setNewIssueDesc(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button type="button" onClick={() => setShowIssueForm(false)} className="px-4 py-2 text-slate-600 text-sm hover:text-slate-900">रद्द (Cancel)</button>
                                <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-sm text-sm font-medium">पेश गर्नुहोस् (Submit)</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {issues.map(issue => (
                        <div key={issue.id} className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex gap-5 hover:border-slate-300 transition">
                            <div className="flex flex-col items-center justify-start min-w-[50px] pt-1">
                                <button 
                                    onClick={() => handleUpvote(issue.id)}
                                    className="p-1 rounded-sm hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition mb-1"
                                    title="Upvote Priority"
                                >
                                    <FaChevronUp className="w-6 h-6" />
                                </button>
                                <span className="font-bold text-lg text-slate-800 font-english">{issue.upvotes}</span>
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-base font-bold text-slate-900">{issue.title}</h3>
                                    {getStatusBadge(issue.status)}
                                </div>
                                <p className="text-slate-600 text-sm mb-3 leading-relaxed">{issue.description}</p>
                                <div className="flex items-center text-[10px] text-slate-400 font-english uppercase tracking-wider space-x-4 border-t border-slate-50 pt-3">
                                    <span>Date: {new Date(issue.created_at).toLocaleDateString()}</span>
                                    <span>User: {issue.created_by.substring(0, 4)}***</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {issues.length === 0 && <p className="text-center text-slate-500 py-8 text-sm">कुनै गुनासो छैन (No issues reported yet).</p>}
                </div>
            </div>

            {/* Sidebar: MP Accountability */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide border-b border-slate-100 pb-2">जनप्रतिनिधि (Representative)</h3>
                    <div className="flex items-center space-x-4 mb-4">
                        {constituency?.mp_image ? (
                             <img src={constituency.mp_image} className="w-14 h-14 rounded-sm object-cover grayscale" alt="MP" />
                        ) : (
                             <div className="w-14 h-14 bg-slate-200 rounded-sm"></div>
                        )}
                        <div>
                            <p className="font-bold text-base text-slate-900">{constituency?.mp_name || "Vacant"}</p>
                            <p className="text-xs text-slate-500">{constituency?.name}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-sm border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">प्रगति विवरण (Progress Tracker)</h3>
                    <div className="space-y-4">
                        <div className="flex items-center text-sm">
                            <FaCheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="flex-1 text-slate-700">School Renovation</span>
                            <span className="text-xs font-bold text-emerald-700 uppercase">सम्पन्न (Done)</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <FaClock className="w-4 h-4 text-amber-500 mr-2" />
                            <span className="flex-1 text-slate-700">Water Supply Line</span>
                            <span className="text-xs font-bold text-amber-700 font-english">60%</span>
                        </div>
                         <div className="flex items-center text-sm">
                            <FaExclamationTriangle className="w-4 h-4 text-slate-300 mr-2" />
                            <span className="flex-1 text-slate-400">Park Project</span>
                            <span className="text-xs text-slate-400 uppercase">योजना (Planned)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PostElectionPage;