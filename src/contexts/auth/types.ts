
import { Session, User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  role: string;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  registerAdmin: (email: string, password: string, fullName: string) => Promise<void>;
  signInAdmin: (email: string, password: string) => Promise<void>;
  isAdmin: boolean;
};
