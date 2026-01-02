import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';
import { detectConstituency, getConstituencies } from '../services/dataService';
import { Constituency } from '../types';
import { PROVINCES } from '../constants';
import { FaSearch, FaUsers, FaVoteYea, FaClipboardCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [address, setAddress] = useState({ province: '', district: '', municipality: '', ward: '' });
  const [detectedId, setDetectedId] = useState<string | null>(null);

  // Pagination & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    getConstituencies().then(setConstituencies);
  }, []);

  const handleFindConstituency = async () => {
    if (address.province && address.district && address.municipality && address.ward) {
      const id = await detectConstituency(address.province, address.district, address.municipality, address.ward);
      setDetectedId(id);
    }
  };

  // Filter Logic
  const filteredConstituencies = constituencies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince ? c.province === selectedProvince : true;
    return matchesSearch && matchesProvince;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredConstituencies.length / itemsPerPage);
  const currentConstituencies = filteredConstituencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541872703-74c5963631df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Democracy Starts With <span className="text-yellow-400">You</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 text-blue-100">
            Select your candidates directly. Hold representatives accountable. 
            Participate in the constituency that matters to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
             <a href="#find-constituency" className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition transform hover:scale-105 shadow-lg">
                Find My Constituency
             </a>
             <Link to="/verify" className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition">
                Verify & Participate
             </Link>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Nagarik Aawaz Works</h2>
            <p className="mt-4 text-gray-600">A simple, transparent process to reclaim local democracy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaClipboardCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Verify Identity</h3>
                <p className="text-gray-600">Upload your ID and confirm address to ensure 1 citizen = 1 constituency.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaVoteYea className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Select Candidate</h3>
                <p className="text-gray-600">Pre-election, vote for the most capable candidate to represent your area.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUsers className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Ensure Accountability</h3>
                <p className="text-gray-600">Post-election, raise issues, upvote problems, and track MP progress.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Constituency Finder */}
      <div id="find-constituency" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-blue-100 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
              <FaSearch className="w-6 h-6 mr-2 text-blue-600" />
              Find Your Constituency
            </h2>
            <AddressSelector onAddressChange={setAddress} />
            <div className="mt-6 text-center">
              <button 
                onClick={handleFindConstituency}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!address.ward}
              >
                Identify Constituency
              </button>
            </div>

            {detectedId && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center animate-fade-in">
                <p className="text-green-800 font-medium mb-2">Your Constituency is:</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {constituencies.find(c => c.id === detectedId)?.name || detectedId}
                </h3>
                <button 
                   onClick={() => navigate(`/constituency/${detectedId}`)}
                   className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                  Go to Constituency Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Constituencies Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Browse Constituencies</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search district..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                
                {/* Filter */}
                <select 
                    className="py-2 pl-3 pr-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={selectedProvince}
                    onChange={(e) => { setSelectedProvince(e.target.value); setCurrentPage(1); }}
                >
                    <option value="">All Provinces</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentConstituencies.map((c) => (
              <div key={c.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {c.province.split(' ')[0]}
                    </span>
                    <span className="text-xs text-gray-500">{c.district}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{c.name}</h3>
                  <div className="flex items-center space-x-2 mt-4">
                     {c.mp_image ? (
                        <img src={c.mp_image} alt={c.mp_name} className="w-8 h-8 rounded-full object-cover" />
                     ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                             NA
                        </div>
                     )}
                     <div className="text-xs">
                        <p className="text-gray-500">Representative</p>
                        <p className="font-medium truncate max-w-[120px]">{c.mp_name || "Vacant"}</p>
                     </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                  <Link to={`/constituency/${c.id}`} className="text-sm text-blue-600 font-medium hover:text-blue-800">
                    View Constituency &rarr;
                  </Link>
                </div>
              </div>
            ))}
            
            {currentConstituencies.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                    No constituencies found matching your filters.
                </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                  <button 
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <FaChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show generic page numbers nicely
                      let pageNum = i + 1;
                      if (totalPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 3 + i;
                          if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                      }
                      
                      return (
                        <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`w-10 h-10 rounded-md font-medium text-sm transition ${
                                currentPage === pageNum 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 border hover:bg-gray-50'
                            }`}
                        >
                            {pageNum}
                        </button>
                      );
                  })}

                  <button 
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <FaChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
              </div>
          )}
          
          <div className="text-center text-xs text-gray-400 mt-4">
              Showing {currentConstituencies.length} of {filteredConstituencies.length} (Total: {constituencies.length})
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;