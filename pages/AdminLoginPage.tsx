
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { FaShieldAlt, FaKey, FaEnvelope } from 'react-icons/fa';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await loginAdmin(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid system credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 border border-slate-700 shadow-2xl rounded-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 mb-4 text-emerald-500">
             <FaShieldAlt className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 uppercase tracking-widest">
            System Access
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-mono">Restricted Personnel Only</p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 p-3 text-sm text-red-400 mb-6 text-center font-mono">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Identifier</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 bg-slate-900 border-slate-700 text-slate-300 rounded-sm py-3 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                placeholder="system@node"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Key</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 bg-slate-900 border-slate-700 text-slate-300 rounded-sm py-3 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-wider rounded-sm text-slate-900 bg-emerald-500 hover:bg-emerald-400 focus:outline-none transition shadow-lg shadow-emerald-900/20"
          >
            Authenticate
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <button onClick={() => navigate('/')} className="text-xs text-slate-600 hover:text-slate-400 font-mono">
                ← Return to Public Gateway
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
