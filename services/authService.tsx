import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, VerificationStatus } from '../types';

interface AuthContextType {
  user: User | null;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateUserVerification: (status: VerificationStatus, constituencyId?: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (identifier: string, secret: string): Promise<boolean> => {
    // Demo Login Logic
    // If identifier contains '@', assume admin login
    if (identifier.includes('@')) {
      if (secret === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          phone_number: 'admin',
          role: 'admin',
          is_verified: true,
          verification_status: 'approved',
          full_name: 'System Admin'
        };
        setUser(adminUser);
        localStorage.setItem('demo_user', JSON.stringify(adminUser));
        return true;
      }
    } else {
      // Citizen Login
      if (secret === '123456') {
        // Check if existing mock user
        const citizenUser: User = {
          id: `u-${identifier}`,
          phone_number: identifier,
          role: 'citizen',
          is_verified: false, // Default to unverified for demo flow
          verification_status: 'unverified', 
        };
        
        // Simulating "Returning User" who is verified if phone is specific demo number
        if (identifier === '9800000000') {
            citizenUser.is_verified = true;
            citizenUser.verification_status = 'approved';
            citizenUser.constituency_id = 'ktm-1';
            citizenUser.district = 'Kathmandu';
            citizenUser.province = 'Bagmati Province';
        }

        setUser(citizenUser);
        localStorage.setItem('demo_user', JSON.stringify(citizenUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  const updateUserVerification = (status: VerificationStatus, constituencyId?: string) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        verification_status: status, 
        is_verified: status === 'approved',
        constituency_id: constituencyId 
      };
      setUser(updatedUser);
      localStorage.setItem('demo_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserVerification, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};