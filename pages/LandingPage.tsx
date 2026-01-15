
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';
import { detectConstituency, getConstituencies } from '../services/dataService';
import { useAuth } from '../services/authService';
import { Constituency } from '../types';
import { PROVINCES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { FaSearch, FaUsers, FaVoteYea, FaClipboardCheck, FaChevronLeft, FaChevronRight, FaBuilding, FaCheckCircle, FaArrowRight, FaPlayCircle, FaTimes, FaClock, FaExclamationTriangle, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

// Area Specific Images Mapping
const AREA_IMAGES: Record<string, string> = {
  'bhaktapur-1': 'https://www.relaxgetaways.com/uploads/img/nagarkot-hiking-with-sunrise-1.jpeg', // Bhaktapur/Nagarkot
  'bara-4': 'https://jankarinepal.com/wp-content/uploads/2019/10/nijgadh.jpg', // Terai/Fields
  'kathmandu-7': 'https://www.trektonepal.com/files/pics/View-tower-Kathmandu-Mudhkhu-Vanjhyang.jpg' // Kathmandu
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'; // Generic Nepal

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [address, setAddress] = useState({ province: '', district: '', municipality: '', ward: '' });
  const [detectedId, setDetectedId] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

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

  const filteredConstituencies = constituencies.filter(c => {
    // Strict filter for unverified users: Only show specific 3 areas
    const allowedIds = ['bhaktapur-1', 'bara-4', 'kathmandu-7'];
    if (!allowedIds.includes(c.id)) return false;

    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince ? c.province === selectedProvince : true;
    return matchesSearch && matchesProvince;
  });

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

  const getPendingDeadline = () => {
    const target = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const ad = target.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const bsYear = target.getFullYear() + 57;
    const bsMonths = ["Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
    const bsMonthIndex = (target.getMonth() + 8) % 12;
    const bsDay = target.getDate();
    return { ad, bs: `${bsYear} ${bsMonths[bsMonthIndex]} ${bsDay}` };
  };

  const deadline = getPendingDeadline();

  const renderUserStatusSection = () => {
      // 1. Pending
      if (user?.verification_status === 'pending') {
          return (
              <div className="w-full max-w-2xl mx-auto bg-amber-500/20 backdrop-blur-md border border-amber-400/50 p-6 rounded-md mb-6 animate-fade-in-up shadow-lg">
                  <div className="flex flex-col items-center text-center">
                      <div className="bg-amber-100 p-3 rounded-full mb-3 shadow-inner">
                           <FaClock className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                          {t('तपाईंको प्रमाणिकरण पर्खाइमा छ', 'Your verification is pending')}
                      </h3>
                      <p className="text-amber-100 text-sm mb-4 font-medium">
                          {t(
                              `२४ घण्टा भित्र निर्णय हुनेछ: ${deadline.bs}`,
                              `It will be decided within 24 hours: ${deadline.ad}`
                          )}
                      </p>
                      <button
                          onClick={() => setShowDemoModal(true)}
                          className="bg-red-600 text-white px-6 py-2 rounded-sm font-bold shadow-md hover:bg-red-700 transition flex items-center text-sm"
                      >
                           <FaPlayCircle className="mr-2"/> {t('डेमो हेर्नुहोस्', 'View Demo')}
                      </button>
                  </div>
              </div>
          );
      }
  
      // 2. Verified - Specialized Constituency Card
      if (user?.verification_status === 'approved' && user.constituency_id) {
           const myConstituency = constituencies.find(c => c.id === user.constituency_id);
           const bgImage = AREA_IMAGES[user.constituency_id] || DEFAULT_IMAGE;
           const constituencyName = myConstituency ? myConstituency.name : user.constituency_id;
           const districtName = myConstituency ? myConstituency.district : '';

           return (
              <div className="mt-8 animate-fade-in-up flex justify-center">
                  <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all hover:scale-105 border border-white/20">
                      {/* Image Top */}
                      <div className="h-48 relative overflow-hidden group">
                          <img 
                            src={bgImage} 
                            alt={constituencyName} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center">
                              <FaCheckCircle className="mr-1" />
                              {t('प्रमाणित', 'Verified')}
                          </div>
                      </div>

                      {/* Content Bottom */}
                      <div className="p-6 text-center bg-white">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('तपाईंको निर्वाचन क्षेत्र', 'Your Constituency')}</h4>
                          <h2 className="text-2xl font-bold text-slate-800 mb-1">{constituencyName}</h2>
                          <p className="text-sm text-slate-500 font-medium mb-6">{districtName}, Nepal</p>

                          <div className="space-y-3">
                              <Link
                                  to={`/constituency/${user.constituency_id}`}
                                  className="w-full block bg-[#0094da] text-white py-3 rounded-sm font-bold shadow-md hover:bg-[#007bb8] transition flex items-center justify-center"
                              >
                                  {t('ड्यासबोर्डमा जानुहोस्', 'Enter Constituency')} <FaArrowRight className="ml-2"/>
                              </Link>
                               <button
                                  onClick={() => setShowDemoModal(true)}
                                  className="w-full block bg-red-50 text-red-600 border border-red-200 py-3 rounded-sm font-bold shadow-sm hover:bg-red-100 transition flex items-center justify-center"
                              >
                                   <FaPlayCircle className="mr-2"/> {t('डेमो हेर्नुहोस्', 'View Demo')}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }
  
      // 3. Rejected
      if (user?.verification_status === 'rejected') {
          return (
               <div className="w-full max-w-2xl mx-auto bg-red-500/20 backdrop-blur-md border border-red-400/50 p-6 rounded-md mb-6 animate-fade-in-up shadow-lg">
                  <div className="flex flex-col items-center text-center">
                      <div className="bg-red-100 p-3 rounded-full mb-3 shadow-inner">
                           <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                          {t('तपाईंको प्रमाणिकरण अस्वीकृत भएको छ', 'Your verification was rejected')}
                      </h3>
                      <p className="text-red-100 text-sm mb-6 max-w-lg">
                          {t(
                              'कृपया प्रमाणिक जानकारी सहित फेरि प्रयास गर्नुहोस्।',
                              'Please submit authentic information and try again.'
                          )}
                      </p>
                      <div className="flex gap-4">
                        <Link
                            to="/verify"
                            className="bg-white text-red-600 px-6 py-3 rounded-sm font-bold shadow-md hover:bg-slate-50 transition"
                        >
                            {t('फेरि प्रमाणिकरण गर्नुहोस्', 'Verify Again')}
                        </Link>
                         <button
                            onClick={() => setShowDemoModal(true)}
                            className="bg-red-600 text-white px-6 py-3 rounded-sm font-bold shadow-md hover:bg-red-700 transition flex items-center"
                        >
                             <FaPlayCircle className="mr-2"/> {t('डेमो', 'Demo')}
                        </button>
                      </div>
                  </div>
              </div>
          );
      }
  
      // 4. New User / Unverified (Default)
      return (
           <div className="w-full max-w-2xl mx-auto bg-[#0094da]/30 backdrop-blur-md border border-white/20 p-6 rounded-md mb-6 animate-fade-in-up shadow-lg">
              <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm shadow-inner">
                          <FaMapMarkerAlt className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6">
                      {t('आफ्नो क्षेत्र खोज्नुहोस्', 'Find Your Area')}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <a
                          href="#find-constituency"
                          onClick={(e) => {
                              e.preventDefault();
                              const target = document.getElementById('find-constituency');
                              if (target) target.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-white text-[#0094da] px-8 py-3 rounded-sm font-bold shadow-md hover:bg-slate-50 transition flex items-center justify-center"
                      >
                          <FaSearch className="mr-2" /> {t('खोज्नुहोस्', 'Search Area')}
                      </a>
                       <button
                          onClick={() => setShowDemoModal(true)}
                          className="bg-red-600 text-white px-8 py-3 rounded-sm font-bold shadow-md hover:bg-red-700 transition flex items-center justify-center"
                      >
                          <FaPlayCircle className="mr-2" /> {t('डेमो हेर्नुहोस्', 'View Demo')}
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="bg-slate-50 relative">
      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl bg-black rounded-lg shadow-2xl overflow-hidden ring-1 ring-white/20">
            <div className="aspect-video">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/H7PXlQmblqc?autoplay=1&rel=0"
                title="Civic Candidate Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-lg z-10 group"
            >
              <FaTimes className="w-5 h-5 group-hover:rotate-90 transition duration-300" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-[#0094da] text-white relative border-b border-white/20">
        <div className="absolute inset-0 bg-[#0b3c5d] opacity-20 pattern-grid-lg"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <div className="inline-block rounded-full px-4 py-1 mb-6 bg-white/15 backdrop-blur-sm border border-white/30">
            <span className="text-sm font-medium tracking-wide">
              {t('नागरिक सहभागिता', 'Civic Participation')}
            </span>
          </div>

          {/* App Name Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
            {t('नागरिक उम्मेदवार', 'Civic Candidate')}
          </h1>

          {/* Tagline / Short Description */}
          <p className="text-xl md:text-2xl text-[#e6f4fb] mb-8 font-medium max-w-5xl mx-auto leading-relaxed">
            {t(
              'तपाईंको आवाज, तपाईंको उम्मेदवार, तपाईंको सम्पर्क',
              'Your Voice, Your Candidate, Your Post‑Election Connection'
            )}
          </p>

          {/* Context Description - Hidden for verified users to clear clutter */}
          {(!user?.is_verified) && (
            <p className="text-base md:text-lg text-blue-100 mb-10 max-w-2xl mx-auto font-light">
                {t(
                'लोकतन्त्रको सुरुवात तपाईंबाट हुन्छ। आफ्नो क्षेत्रमा सहभागी हुनुहोस्, उम्मेदवार छान्नुहोस् र जवाफदेहिता सुनिश्चित गर्नुहोस्।',
                'Democracy starts with you. Participate in your constituency, select candidates, and ensure accountability.'
                )}
            </p>
          )}

          {/* Dynamic Status Section */}
          {renderUserStatusSection()}
          
        </div>
      </div>

      {/* Directory Grid - Only for Unverified Users - MOVED TO TOP */}
      {!user?.is_verified && (
      <div className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900">{t('निर्वाचन क्षेत्र निर्देशिका', 'Constituency Directory')}</h2>
            </div>
          
            {/* Keeping the search filter functionality as per instructions to not change functionality, but simplifying appearance */}
            <div className="flex flex-col md:flex-row justify-end items-center mb-8 gap-3">
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-slate-400 w-3 h-3" />
                </div>
                <input
                  type="text"
                  placeholder={t('जिल्ला खोज्नुहोस्...', 'Search district...')}
                  className="pl-8 pr-4 py-2 border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] w-full text-sm font-english"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <select
                className="py-2 pl-3 pr-8 border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] text-sm font-english bg-white w-full md:w-auto"
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setCurrentPage(1); }}
              >
                <option value="">{t('सबै प्रदेश', 'All Provinces')}</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentConstituencies.map((c) => {
              // Determine which image to show based on ID
              const areaImage = AREA_IMAGES[c.id] || DEFAULT_IMAGE;
              
              return (
              <Link 
                to={`/constituency/${c.id}`} 
                key={c.id} 
                className="bg-white border border-slate-200 hover:border-[#0094da] transition group shadow-lg rounded-lg overflow-hidden flex flex-col transform hover:scale-105 duration-300 h-full cursor-pointer block"
              >
                <div className="h-48 overflow-hidden relative">
                    <img 
                        src={areaImage} 
                        alt={c.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
                        {c.province.replace('Province', '')}
                    </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#0094da] transition">{c.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">{c.district}, Nepal</p>
                    
                    <div className="mt-auto w-full bg-[#0094da] text-white py-3 rounded-sm font-bold shadow-sm group-hover:bg-[#007bb8] transition flex items-center justify-center">
                        {t('क्षेत्र हेर्नुहोस्', 'View Constituency')} <FaArrowRight className="ml-2 w-3 h-3" />
                    </div>
                </div>
              </Link>
            )})}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 text-sm font-medium transition rounded-sm ${currentPage === pageNum
                        ? 'bg-[#0094da] text-white border border-[#0094da]'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
              >
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Process Steps - Institutional Cards */}
      <div className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">{t('प्रक्रिया', 'Process')}</h2>
            <p className="mt-2 text-slate-500 font-english">How Civic Candidate works</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 border border-slate-200 rounded-sm hover:border-[#0094da] transition duration-300">
              <div className="w-12 h-12 bg-sky-50 text-[#0094da] flex items-center justify-center mb-6 rounded-sm">
                <FaClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">1. {t('पहिचान प्रमाणीकरण', 'Verify Identity')}</h3>
              <p className="text-slate-600 text-sm">
                {t(
                  'आफ्नो परिचय पत्र अपलोड गर्नुहोस् र आफ्नो निर्वाचन क्षेत्र यकिन गर्नुहोस्।',
                  'Upload your ID document and confirm your constituency.'
                )}
              </p>
            </div>
            <div className="bg-slate-50 p-8 border border-slate-200 rounded-sm hover:border-[#0094da] transition duration-300">
              <div className="w-12 h-12 bg-sky-50 text-[#0094da] flex items-center justify-center mb-6 rounded-sm">
                <FaVoteYea className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">2. {t('उम्मेदवार चयन', 'Vote')}</h3>
              <p className="text-slate-600 text-sm">
                {t(
                  'निर्वाचन पूर्व, योग्य उम्मेदवारको प्रस्ताव हेर्नुहोस् र मतदान गर्नुहोस्।',
                  'Before elections, review candidate proposals and cast your vote.'
                )}
              </p>
            </div>
            <div className="bg-slate-50 p-8 border border-slate-200 rounded-sm hover:border-[#0094da] transition duration-300">
              <div className="w-12 h-12 bg-sky-50 text-[#0094da] flex items-center justify-center mb-6 rounded-sm">
                <FaUsers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">3. {t('जवाफदेहिता', 'Accountability')}</h3>
              <p className="text-slate-600 text-sm">
                {t(
                  'निर्वाचन पश्चात, समस्या दर्ता गर्नुहोस् र प्रतिनिधिको कामको निगरानी गर्नुहोस्।',
                  'After elections, report local issues and track representative progress.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Finder Tool (Hidden if Verified) */}
      {!user?.is_verified && (
      <div id="find-constituency" className="py-16 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-300 p-8 shadow-sm rounded-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
              <FaSearch className="w-5 h-5 mr-3 text-[#0094da]" />
              {t('आफ्नो निर्वाचन क्षेत्र पत्ता लगाउनुहोस्', 'Identify Your Constituency')}
            </h2>
            {/* Search is general UI, so isBilingual={false} uses the Toggle mode */}
            <AddressSelector onAddressChange={setAddress} isBilingual={false} />
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleFindConstituency}
                className="w-full sm:w-auto bg-[#0094da] text-white px-8 py-3 rounded-sm font-semibold hover:bg-[#007bb8] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={!address.ward}
              >
                {t('खोज्नुहोस्', 'Search')}
              </button>
            </div>

            {detectedId && (
              <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 text-center">
                <p className="text-emerald-800 font-medium mb-2 text-sm">{t('तपाईंको निर्वाचन क्षेत्र', 'Your Constituency')}</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {constituencies.find(c => c.id === detectedId)?.name || detectedId}
                </h3>
                <button
                  onClick={() => navigate(`/constituency/${detectedId}`)}
                  className="inline-block bg-[#0094da] text-white px-6 py-2 rounded-sm font-medium hover:bg-[#007bb8] text-sm transition"
                >
                  {t('ड्यासबोर्डमा जानुहोस्', 'Go to Dashboard')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default LandingPage;
