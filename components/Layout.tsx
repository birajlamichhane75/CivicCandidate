
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { FaBars, FaTimes, FaSignOutAlt, FaUserShield, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(language === 'ne' ? 'en' : 'ne');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Strip - Purely Institutional/Official */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-center sm:justify-start items-center">
          <span>
            {t('नेपालको लोकतान्त्रिक सहभागिता प्लेटफर्म', "Nepal's Democratic Participation Platform")}
          </span>
        </div>
      </div>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-[#0094da] text-white p-2 rounded-sm shadow-sm group-hover:bg-[#007bb8] transition">
                  <FaUserShield className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg md:text-xl text-slate-900 leading-tight">
                    {t('नागरिक उम्मेदवार', 'Civic Candidate')}
                  </span>
                  
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`px-4 py-2 text-sm font-medium transition ${isActive('/') ? 'text-[#0094da] border-b-2 border-[#0094da]' : 'text-slate-600 hover:text-[#0094da] hover:bg-slate-50'}`}>
                {t('गृहपृष्ठ', 'Home')}
              </Link>
              
              {user ? (
                <>
                  {user.role === 'admin' && (
                     <Link to="/admin" className={`px-4 py-2 text-sm font-medium transition ${isActive('/admin') ? 'text-[#0094da] border-b-2 border-[#0094da]' : 'text-slate-600 hover:text-[#0094da] hover:bg-slate-50'}`}>
                      {t('प्रशासक', 'Admin')}
                    </Link>
                  )}
                  {user.is_verified && user.constituency_id && (
                    <Link to={`/constituency/${user.constituency_id}`} className={`px-4 py-2 text-sm font-medium transition flex items-center ${isActive(`/constituency/${user.constituency_id}`) ? 'text-[#0094da] border-b-2 border-[#0094da]' : 'text-slate-600 hover:text-[#0094da] hover:bg-slate-50'}`}>
                      <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                      {t('मेरो क्षेत्र', 'My Area')}
                    </Link>
                  )}
                  {!user.is_verified && user.verification_status !== 'pending' && (
                     <Link to="/verify" className="ml-2 bg-[#0094da] text-white px-5 py-2 rounded-sm text-sm font-medium hover:bg-[#007bb8] transition shadow-sm">
                     {t('प्रमाणीकरण', 'Verify')}
                   </Link>
                  )}
                  <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-slate-200">
                    <div className="flex flex-col text-right">
                        <span className="text-xs font-bold text-slate-900 font-english">{user.phone_number}</span>
                        <span className="text-[10px] uppercase text-slate-500 font-english tracking-wide">{user.role}</span>
                    </div>
                    {/* ONLY SHOW LOGOUT FOR ADMIN */}
                    {user.role === 'admin' && (
                      <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 p-2 transition" title={t('लगआउट', 'Logout')}>
                        <FaSignOutAlt className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="ml-4 bg-[#0094da] text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-[#007bb8] transition shadow-sm">
                  {t('लगइन', 'Login')}
                </Link>
              )}

              {/* Language Toggle - Prominent in Navbar */}
              <div className="ml-4 pl-4 border-l border-slate-200 flex items-center">
                 <button 
                  onClick={toggleLanguage} 
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-sm border border-[#0094da] text-[#0094da] hover:bg-sky-50 transition focus:outline-none"
                  title="Switch Language"
                >
                  <FaGlobe className="h-4 w-4" />
                  <span className="font-bold text-sm">
                    {language === 'ne' ? 'English' : 'नेपाली'}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
               <button 
                  onClick={toggleLanguage} 
                  className="mr-4 text-[#0094da] font-bold text-sm focus:outline-none flex items-center"
                >
                  {language === 'ne' ? 'EN' : 'NE'}
                </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-[#0094da] hover:bg-slate-100 focus:outline-none"
              >
                {isMenuOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0094da] border-l-4 border-transparent hover:border-[#0094da]">
                 {t('गृहपृष्ठ', 'Home')}
               </Link>
               {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-[#0094da]">
                        {t('प्रशासक', 'Admin')}
                      </Link>
                    )}
                    {user.is_verified && user.constituency_id && (
                       <Link to={`/constituency/${user.constituency_id}`} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-[#0094da]">
                         {t('मेरो क्षेत्र', 'My Area')}
                       </Link>
                    )}
                    {!user.is_verified && user.verification_status !== 'pending' && (
                       <Link to="/verify" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-[#0094da]">
                         {t('प्रमाणीकरण', 'Verify')}
                       </Link>
                    )}
                    {user.role === 'admin' && (
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 border-l-4 border-transparent hover:border-red-600">
                        {t('लगआउट', 'Logout')}
                      </button>
                    )}
                  </>
               ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-[#0094da]">
                    {t('लगइन', 'Login')}
                  </Link>
               )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 border-t-4 border-[#0094da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center">
              <FaUserShield className="h-5 w-5 mr-3 text-[#0094da]" /> {t('नागरिक उम्मेदवार', 'Civic Candidate')}
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              {t(
                'स्थानीय लोकतन्त्रमा नागरिकहरूको सहभागिता सुनिश्चित गर्न र जनप्रतिनिधिहरूलाई जवाफदेही बनाउन।',
                'Ensuring citizen participation in local democracy and holding representatives accountable.'
              )}
            </p>
          </div>
          <div className="md:border-l md:border-slate-800 md:pl-8">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">{t('द्रुत लिंकहरू', 'Quick Links')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-[#0094da] transition">{t('गृहपृष्ठ', 'Home')}</Link></li>
              <li><Link to="/login" className="hover:text-[#0094da] transition">{t('लगइन', 'Login')}</Link></li>
              <li><Link to="/verify" className="hover:text-[#0094da] transition">{t('प्रमाणीकरण', 'Verify Identity')}</Link></li>
            </ul>
          </div>
          <div className="md:border-l md:border-slate-800 md:pl-8">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">{t('सम्पर्क', 'Contact')}</h4>
            <p className="text-sm">{t('काठमाडौँ, नेपाल', 'Kathmandu, Nepal')}</p>
            <p className="text-sm mt-2 font-english">support@civiccandidate.org</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-8 border-t border-slate-800 text-xs text-center font-english text-slate-500">
           {/* STEALTH TRIGGER FOR ADMIN LOGIN */}
           <span 
              onDoubleClick={() => navigate('/sys/access-portal')} 
              className="cursor-default select-none"
              title="©"
            >
             &copy; {new Date().getFullYear()} Civic Candidate. Civic Tech Initiative.
           </span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
