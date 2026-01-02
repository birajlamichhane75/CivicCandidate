import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIssues, reportIssue, upvoteIssue, getConstituencyById } from '../services/dataService';
import { useAuth } from '../services/authService';
import { Issue, Constituency } from '../types';
import { FaExclamationTriangle, FaChevronUp, FaCheckCircle, FaClock } from 'react-icons/fa';

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
          loadData(); // Reload to show updated count
      } catch (e) {
          alert(e);
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

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'resolved': return 'bg-green-100 text-green-800';
          case 'in_progress': return 'bg-yellow-100 text-yellow-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/constituency/${id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">&larr; Back to Dashboard</Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Issues */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Local Issues</h1>
                    <button 
                        onClick={() => setShowIssueForm(!showIssueForm)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                    >
                        Report an Issue
                    </button>
                </div>

                {showIssueForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-red-100 mb-6 animate-fade-in">
                        <h3 className="text-lg font-semibold mb-4">Report New Issue</h3>
                        <form onSubmit={handleReportIssue}>
                            <input 
                                className="w-full border p-2 rounded mb-3" 
                                placeholder="Issue Title" 
                                value={newIssueTitle}
                                onChange={e => setNewIssueTitle(e.target.value)}
                                required 
                            />
                            <textarea 
                                className="w-full border p-2 rounded mb-3" 
                                placeholder="Describe the problem..." 
                                rows={3}
                                value={newIssueDesc}
                                onChange={e => setNewIssueDesc(e.target.value)}
                                required 
                            />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowIssueForm(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Submit Report</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {issues.map(issue => (
                        <div key={issue.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-4">
                            <div className="flex flex-col items-center justify-center space-y-1 min-w-[60px]">
                                <button 
                                    onClick={() => handleUpvote(issue.id)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-orange-500 transition"
                                >
                                    <FaChevronUp className="w-8 h-8" />
                                </button>
                                <span className="font-bold text-lg text-gray-900">{issue.upvotes}</span>
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900">{issue.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(issue.status)}`}>
                                        {issue.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-2">{issue.description}</p>
                                <div className="mt-4 flex items-center text-xs text-gray-500 space-x-4">
                                    <span>Reported: {issue.created_at}</span>
                                    <span>By: {issue.created_by.substring(0, 4)}***</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {issues.length === 0 && <p className="text-center text-gray-500 py-8">No issues reported yet.</p>}
                </div>
            </div>

            {/* Sidebar: MP Accountability */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Representative</h3>
                    <div className="flex items-center space-x-4 mb-4">
                        {constituency?.mp_image ? (
                             <img src={constituency.mp_image} className="w-16 h-16 rounded-full object-cover" alt="MP" />
                        ) : (
                             <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        )}
                        <div>
                            <p className="font-bold text-lg">{constituency?.mp_name || "Vacant"}</p>
                            <p className="text-sm text-gray-500">{constituency?.name}</p>
                        </div>
                    </div>
                    <div className="border-t pt-4 space-y-3">
                         <h4 className="font-semibold text-sm text-gray-700">Monthly Report (Oct)</h4>
                         <p className="text-xs text-gray-600 italic">"We have successfully allocated budget for the Baneshwor road repair..."</p>
                         <button className="text-blue-600 text-xs font-medium hover:underline">Read Full Report</button>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-md font-bold text-blue-900 mb-3">Progress Tracker</h3>
                    <div className="space-y-4">
                        <div className="flex items-center text-sm">
                            <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="flex-1">School Renovation</span>
                            <span className="font-bold text-green-700">Done</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <FaClock className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="flex-1">Water Supply Line</span>
                            <span className="font-bold text-yellow-700">60%</span>
                        </div>
                         <div className="flex items-center text-sm">
                            <FaExclamationTriangle className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="flex-1 text-gray-500">Park Project</span>
                            <span className="text-gray-500">Planned</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PostElectionPage;