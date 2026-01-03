import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConstituencyById } from '../services/dataService';
import { Constituency } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { FaVoteYea, FaUsers, FaFileAlt, FaMapMarkerAlt, FaUserTie } from 'react-icons/fa';

const ConstituencyDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [constituency, setConstituency] = useState<Constituency | undefined>();
  const { t } = useLanguage();

  useEffect(() => {
    if (id) {
      getConstituencyById(id).then(setConstituency);
    }
  }, [id]);

  if (!constituency) return <div className="p-8 text-center text-slate-500">{t('लोड हुँदैछ...', 'Loading...')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header - Institutional Look */}
      <div className="bg-white border border-slate-200 rounded-sm p-8 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <FaMapMarkerAlt className="w-32 h-32 text-[#0094da]" />
        </div>
        <div className="relative z-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{constituency.name}</h1>
            <p className="text-slate-500 font-medium">{constituency.district} • {constituency.province}</p>
            
            {constituency.mp_name && (
                <div className="mt-8 inline-flex items-center bg-slate-50 border border-slate-200 px-6 py-4 rounded-sm">
                    {constituency.mp_image ? (
                        <img src={constituency.mp_image} alt="MP" className="w-12 h-12 rounded-sm grayscale object-cover mr-4" />
                    ) : (
                         <div className="w-12 h-12 bg-slate-200 rounded-sm flex items-center justify-center text-slate-400 mr-4"><FaUserTie /></div>
                    )}
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t('जनप्रतिनिधि', 'Representative')}</p>
                        <p className="font-bold text-lg text-slate-800">{constituency.mp_name}</p>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pre-Election Card */}
        <div className="bg-white border border-slate-200 rounded-sm hover:border-[#0094da] transition group">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{t('निर्वाचन चरण', 'Election Phase')}</h2>
                    <p className="text-xs text-slate-500 font-english uppercase tracking-wide">Candidate Selection</p>
                </div>
                <FaVoteYea className="h-6 w-6 text-slate-400 group-hover:text-[#0094da] transition" />
            </div>
            <div className="p-6">
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {t(
                      'उम्मेदवारहरूको विवरण हेर्नुहोस् र आफ्नो अमूल्य मत प्रदान गर्नुहोस्।',
                      'View candidate profiles and cast your valuable vote.'
                    )}
                </p>
                <div className="flex gap-3">
                    <Link to={`/constituency/${id}/pre-election`} className="flex-1 bg-[#0094da] text-center text-white py-2.5 rounded-sm text-sm font-semibold hover:bg-[#007bb8] transition">
                        {t('उम्मेदवारहरू', 'Candidates')}
                    </Link>
                    <Link to={`/constituency/${id}/apply`} className="flex-1 bg-white border border-slate-300 text-center text-slate-700 py-2.5 rounded-sm text-sm font-medium hover:bg-slate-50 hover:text-[#0094da] transition">
                        {t('उम्मेदवारी दिनुहोस्', 'Apply')}
                    </Link>
                </div>
            </div>
        </div>

        {/* Post-Election Card */}
        <div className="bg-white border border-slate-200 rounded-sm hover:border-[#0094da] transition group">
             <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{t('नागरिक निगरानी', 'Civic Oversight')}</h2>
                    <p className="text-xs text-slate-500 font-english uppercase tracking-wide">Post-Election</p>
                </div>
                <FaUsers className="h-6 w-6 text-slate-400 group-hover:text-[#0094da] transition" />
            </div>
            <div className="p-6">
                 <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {t(
                      'समस्याहरू दर्ता गर्नुहोस् र विकास निर्माणको निगरानी गर्नुहोस्।',
                      'Report local issues and track development progress.'
                    )}
                </p>
                <Link to={`/constituency/${id}/post-election`} className="block w-full bg-[#0094da] text-center text-white py-2.5 rounded-sm text-sm font-semibold hover:bg-[#007bb8] transition">
                    {t('समस्या बोर्ड', 'Issue Board')}
                </Link>
            </div>
        </div>
      </div>
      
      {/* Activity Log */}
      <div className="mt-10">
         <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">{t('हालैका गतिविधिहरू', 'Recent Updates')}</h3>
         <div className="bg-white border border-slate-200 rounded-sm p-4">
             <div className="flex items-start space-x-3">
                <div className="bg-sky-50 p-2 rounded-sm border border-sky-100 mt-1">
                    <FaFileAlt className="h-3 w-3 text-[#0094da]" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">{t('नयाँ समस्या दर्ता', 'New Issue Reported')}</p>
                    <p className="text-xs text-slate-500 font-english mt-1">"Road construction delayed in Ward 4" was reported.</p>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default ConstituencyDashboard;