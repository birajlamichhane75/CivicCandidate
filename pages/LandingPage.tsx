import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';
import { detectConstituency, getConstituencies } from '../services/dataService';
import { Constituency } from '../types';
import { PROVINCES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { FaSearch, FaUsers, FaVoteYea, FaClipboardCheck, FaChevronLeft, FaChevronRight, FaBuilding } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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

  const filteredConstituencies = constituencies.filter(c => {
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

  return (
    <div className="bg-slate-50">
      {/* Hero Section - Official Tone */}
      <div className="bg-[#0094da] text-white relative border-b border-white/20">
        {/* pattern overlay */}
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

          {/* Context Description */}
          <p className="text-base md:text-lg text-blue-100 mb-10 max-w-2xl mx-auto font-light">
            {t(
              'लोकतन्त्रको सुरुवात तपाईंबाट हुन्छ। आफ्नो क्षेत्रमा सहभागी हुनुहोस्, उम्मेदवार छान्नुहोस् र जवाफदेहिता सुनिश्चित गर्नुहोस्।',
              'Democracy starts with you. Participate in your constituency, select candidates, and ensure accountability.'
            )}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#find-constituency"
              onClick={(e) => {
                e.preventDefault(); // Prevent default jump
                const target = document.getElementById('find-constituency');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#0b3c5d] text-white px-8 py-3 rounded-sm 
             font-semibold text-lg shadow-md 
             hover:bg-[#072c45] transition cursor-pointer"
            >
              {t('मेरो क्षेत्र खोज्नुहोस्', 'Find My Area')}
            </a>


            <a
              href="https://www.youtube.com/watch?v=H7PXlQmblqc"
              target="_blank"
              rel="noopener noreferrer"
              className="
    bg-red-600
    border border-red-400
    text-white
    px-8 py-3
    rounded-sm
    font-semibold text-lg
    hover:bg-red-500
    transition
  "
            >
              ▶ {t('डेमो हेर्नुहोस्', 'View Demo')}
            </a>

          </div>
        </div>
      </div>

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

      {/* Finder Tool */}
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

      {/* Directory Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900">{t('निर्वाचन क्षेत्रहरू', 'Constituency Directory')}</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="relative">
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
                className="py-2 pl-3 pr-8 border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] text-sm font-english bg-white"
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setCurrentPage(1); }}
              >
                <option value="">{t('सबै प्रदेश', 'All Provinces')}</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentConstituencies.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 hover:border-[#0094da] transition p-5 group">
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    {c.province.replace('Province', '')}
                  </span>
                  <div className="text-xs text-slate-400 font-english">{c.district}</div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-[#0094da] transition">{c.name}</h3>
                <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
                  {c.mp_image ? (
                    <img src={c.mp_image} alt={c.mp_name} className="w-8 h-8 grayscale group-hover:grayscale-0 transition object-cover rounded-sm" />
                  ) : (
                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-400 rounded-sm">
                      <FaBuilding className="w-3 h-3" />
                    </div>
                  )}
                  <div className="text-xs">
                    <p className="text-slate-500">{t('प्रतिनिधि', 'Representative')}</p>
                    <p className="font-medium text-slate-800 truncate max-w-[100px]">{c.mp_name || t("पद रिक्त", "Vacant")}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to={`/constituency/${c.id}`} className="text-xs font-bold text-[#0094da] hover:underline uppercase tracking-wide">
                    {t('विवरण हेर्नुहोस्', 'View Details')} &rarr;
                  </Link>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default LandingPage;