import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { FaBars, FaTimes, FaSignOutAlt, FaUserShield, FaMapMarkerAlt, FaUserCheck } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 text-center sm:text-left">
        <div className="max-w-7xl mx-auto">
          नेपालको लोकतान्त्रिक सहभागिता प्लेटफर्म (Nepal's Democratic Participation Platform)
        </div>
      </div>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-slate-900 text-white p-2 rounded-sm">
                  <FaUserShield className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-slate-900 leading-tight">नागरिक आवाज</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-english group-hover:text-slate-700 transition">Nagarik Aawaz</span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`px-4 py-2 text-sm font-medium transition ${isActive('/') ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                गृहपृष्ठ (Home)
              </Link>
              
              {user ? (
                <>
                  {user.role === 'admin' && (
                     <Link to="/admin" className={`px-4 py-2 text-sm font-medium transition ${isActive('/admin') ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                      प्रशासक (Admin)
                    </Link>
                  )}
                  {user.is_verified && user.constituency_id && (
                    <Link to={`/constituency/${user.constituency_id}`} className={`px-4 py-2 text-sm font-medium transition flex items-center ${isActive(`/constituency/${user.constituency_id}`) ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                      <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                      मेरो क्षेत्र (My Area)
                    </Link>
                  )}
                  {!user.is_verified && user.verification_status !== 'pending' && (
                     <Link to="/verify" className="ml-2 bg-slate-900 text-white px-5 py-2 rounded-sm text-sm font-medium hover:bg-slate-800 transition shadow-sm">
                     प्रमाणीकरण (Verify)
                   </Link>
                  )}
                  <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-slate-200">
                    <div className="flex flex-col text-right">
                        <span className="text-xs font-bold text-slate-900 font-english">{user.phone_number}</span>
                        <span className="text-[10px] uppercase text-slate-500 font-english tracking-wide">{user.role}</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 p-2 transition" title="Logout">
                      <FaSignOutAlt className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="ml-4 bg-slate-900 text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-slate-800 transition shadow-sm">
                  लगइन (Login)
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
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
               <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent hover:border-slate-900">
                 गृहपृष्ठ (Home)
               </Link>
               {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-900">
                        प्रशासक (Admin)
                      </Link>
                    )}
                    {user.is_verified && user.constituency_id && (
                       <Link to={`/constituency/${user.constituency_id}`} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-900">
                         मेरो क्षेत्र (My Area)
                       </Link>
                    )}
                    {!user.is_verified && user.verification_status !== 'pending' && (
                       <Link to="/verify" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-900">
                         प्रमाणीकरण (Verify)
                       </Link>
                    )}
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 border-l-4 border-transparent hover:border-red-600">
                      लगआउट (Logout)
                    </button>
                  </>
               ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-900">
                    लगइन (Login)
                  </Link>
               )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 border-t-4 border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center">
              <FaUserShield className="h-5 w-5 mr-3" /> नागरिक आवाज
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              स्थानीय लोकतन्त्रमा नागरिकहरूको सहभागिता सुनिश्चित गर्न र जनप्रतिनिधिहरूलाई जवाफदेही बनाउन।
              <br/>
              <span className="font-english italic opacity-70">(Ensuring citizen participation in local democracy.)</span>
            </p>
          </div>
          <div className="md:border-l md:border-slate-800 md:pl-8">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">द्रुत लिंकहरू (Quick Links)</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition">गृहपृष्ठ (Home)</Link></li>
              <li><Link to="/login" className="hover:text-white transition">लगइन (Login)</Link></li>
              <li><Link to="/verify" className="hover:text-white transition">प्रमाणीकरण (Verify Identity)</Link></li>
            </ul>
          </div>
          <div className="md:border-l md:border-slate-800 md:pl-8">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">सम्पर्क (Contact)</h4>
            <p className="text-sm">काठमाडौँ, नेपाल (Kathmandu, Nepal)</p>
            <p className="text-sm mt-2 font-english">support@nagarikaawaz.org</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-8 border-t border-slate-800 text-xs text-center font-english text-slate-500">
          &copy; {new Date().getFullYear()} Nagarik Aawaz. Civic Tech Initiative.
        </div>
      </footer>
    </div>
  );
};

export default Layout;