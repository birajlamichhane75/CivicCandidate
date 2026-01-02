import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { User, VerificationStatus } from '../types';

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
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Set initial state from local storage to prevent flicker
        setUser(parsedUser);

        // Fetch fresh data from DB to get latest verification status and constituency_id
        try {
           if (parsedUser.phone_number === 'admin') return; // Skip for static admin
           
           const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', parsedUser.id)
            .single();
          
          if (data) {
            setUser(data);
            localStorage.setItem('demo_user', JSON.stringify(data));
          }
        } catch (err) {
          console.error("Error refreshing user session:", err);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (identifier: string, secret: string): Promise<boolean> => {
    // Admin Login
    if (identifier === 'admin') {
      if (secret === 'admin123') {
        const { data: adminUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone_number', 'admin')
          .single();

        if (adminUser) {
           setUser(adminUser);
           localStorage.setItem('demo_user', JSON.stringify(adminUser));
           return true;
        }
      }
      return false;
    }

    // Citizen Login (Simulating OTP)
    if (secret === '123456') {
      try {
        // Check if user exists
        let { data: existingUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone_number', identifier)
          .single();

        if (!existingUser) {
          // Register new user
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([{ 
                phone_number: identifier,
                role: 'citizen',
                verification_status: 'unverified'
            }])
            .select()
            .single();
          
          if (createError) throw createError;
          existingUser = newUser;
        }

        setUser(existingUser);
        localStorage.setItem('demo_user', JSON.stringify(existingUser));
        return true;
      } catch (e) {
        console.error("Login failed", e);
        return false;
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