
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { User, VerificationStatus } from '../types';

interface AuthContextType {
  user: User | null;
  login: (phone: string, otp: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserVerification: (status: VerificationStatus, constituencyId?: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // Ref to keep track of user ID for the interval to prevent stale closure
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Initial Load & Heartbeat
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Fetch fresh data from DB
        try {
           // Admin user case (no numeric ID usually, or special handling)
           if (parsedUser.role === 'admin') {
               setUser(parsedUser);
               return; 
           }
           
           const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', parsedUser.id)
            .single();
          
          if (data) {
            // Check for forced logout logic
            if (data.force_logout) {
                logout();
                return;
            }
            setUser(data);
            localStorage.setItem('demo_user', JSON.stringify(data));
          } else {
              // User might be deleted
              logout();
          }
        } catch (err) {
          console.error("Error refreshing user session:", err);
          setUser(parsedUser);
        }
      }
    };

    initializeAuth();

    // Heartbeat to check for force logout or status revocation every 10 seconds
    const intervalId = setInterval(async () => {
        if (userRef.current && userRef.current.role !== 'admin') {
             // We select '*' to be safe against missing specific columns causing query errors
             const { data } = await supabase
                .from('users')
                .select('*') 
                .eq('id', userRef.current.id)
                .single();
            
            if (data) {
                // 1. Explicit Force Logout
                if (data.force_logout) {
                    console.log("Forced logout flag detected.");
                    logout();
                    return;
                }
                
                // 2. Implicit Force Logout via Verification Revocation
                if (userRef.current.is_verified && !data.is_verified) {
                    console.log("Verification revoked. Forcing logout.");
                    logout();
                    return;
                }
            }
        }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // 1. CITIZEN LOGIN (Phone + OTP)
  // Security: MUST reject if the user role is 'admin'
  const login = async (identifier: string, secret: string): Promise<boolean> => {
    // Admin checks in this flow are REMOVED. 
    // Admins must use loginAdmin via the hidden route.

    // Citizen Login (Simulating OTP)
    if (secret === '123456') {
      try {
        // Check if user exists
        let { data: existingUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone_number', identifier)
          .single();

        if (existingUser) {
            // SECURITY CHECK: Block Admin from using OTP flow
            if (existingUser.role === 'admin') {
                console.warn("Security Alert: Admin attempted login via OTP flow.");
                alert("Access Denied: Administrative accounts cannot use this login method.");
                return false;
            }

            // Reset force_logout flag on successful login (Best Effort)
            supabase
                .from('users')
                .update({ force_logout: false })
                .eq('id', existingUser.id)
                .then(({error}) => {
                    if (error) console.warn("Could not reset force_logout:", error.message);
                });
            existingUser.force_logout = false;
        } else {
          // Register new user (Citizens only)
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([{ 
                phone_number: identifier,
                role: 'citizen',
                verification_status: 'unverified',
                force_logout: false
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

  // 2. ADMIN LOGIN (Email + Password)
  // Security: Only accessed via hidden route
  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
      // Hardcoded check for this demo environment to separate flow without DB migrations
      // In a real production app, this would query Supabase Auth or Users table with hashed password
      if (email === 'admin@civiccandidate.org' && password === 'admin123') {
          // Fetch the actual admin record from DB to maintain ID consistency
          const { data: adminUser } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'admin') 
            .limit(1)
            .single();
            
          if (adminUser) {
              setUser(adminUser);
              localStorage.setItem('demo_user', JSON.stringify(adminUser));
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
    <AuthContext.Provider value={{ user, login, loginAdmin, logout, updateUserVerification, isAuthenticated: !!user }}>
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
