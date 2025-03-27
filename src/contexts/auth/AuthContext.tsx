
import { createContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { 
  AuthContextType, 
  Profile 
} from './types';
import { 
  fetchProfile,
  signUp as signUpUser,
  signIn as signInUser,
  signOut as signOutUser,
  resetPassword as resetUserPassword,
  updatePassword as updateUserPassword,
  registerAdmin as registerAdminUser,
  signInAdmin as signInAdminUser
} from './utils';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      const profileData = await fetchProfile(userId);
      if (profileData) {
        setProfile(profileData);
        setIsAdmin(profileData.role === 'admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      await signUpUser(email, password, fullName);
    } finally {
      setIsLoading(false);
    }
  };

  const registerAdmin = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      await registerAdminUser(email, password, fullName);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInUser(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signInAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { isAdmin: adminStatus } = await signInAdminUser(email, password);
      setIsAdmin(adminStatus);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await resetUserPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    try {
      await updateUserPassword(password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        registerAdmin,
        signInAdmin,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
