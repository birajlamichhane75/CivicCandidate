import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { Menu, X, User as UserIcon, LogOut, ShieldCheck, MapPin } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <ShieldCheck className="h-8 w-8 text-blue-300" />
                <span className="font-bold text-xl tracking-tight">Nagarik Aawaz</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${isActive('/') ? 'bg-blue-800' : ''}`}>
                Home
              </Link>
              
              {user ? (
                <>
                  {user.role === 'admin' && (
                     <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${isActive('/admin') ? 'bg-blue-800' : ''}`}>
                      Admin Dashboard
                    </Link>
                  )}
                  {user.is_verified && user.constituency_id && (
                    <Link to={`/constituency/${user.constituency_id}`} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      My Constituency
                    </Link>
                  )}
                  {!user.is_verified && user.verification_status !== 'pending' && (
                     <Link to="/verify" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-4 py-2 rounded-md text-sm font-bold">
                     Verify Now
                   </Link>
                  )}
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-blue-700">
                    <div className="flex flex-col text-right">
                        <span className="text-xs text-blue-300">{user.phone_number}</span>
                        <span className="text-xs font-semibold capitalize">{user.role}</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 rounded-full hover:bg-blue-800" title="Logout">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="bg-white text-blue-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-100 transition">
                  Login / Register
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Home</Link>
             {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Admin Dashboard</Link>
                  )}
                  {user.is_verified && user.constituency_id && (
                     <Link to={`/constituency/${user.constituency_id}`} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">My Constituency</Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 text-red-300">
                    Logout
                  </button>
                </>
             ) : (
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Login</Link>
             )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" /> Nagarik Aawaz
            </h3>
            <p className="text-sm">Empowering citizens to participate in local democracy, select candidates, and hold representatives accountable.</p>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/verify" className="hover:text-white">Verify Identity</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Contact</h4>
            <p className="text-sm">Kathmandu, Nepal</p>
            <p className="text-sm">support@nagarikaawaz.org</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-700 text-xs text-center">
          &copy; {new Date().getFullYear()} Nagarik Aawaz. Building a better democracy.
        </div>
      </footer>
    </div>
  );
};

export default Layout;