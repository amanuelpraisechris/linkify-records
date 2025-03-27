
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Profile } from './types';

// Helper to prevent duplicate toasts
let activeToasts = new Set();

// Custom toast function that prevents duplicates
const showToast = (props: { title: string; description: string; variant?: "default" | "destructive" }) => {
  const key = `${props.title}-${props.description}`;
  if (activeToasts.has(key)) return;
  
  activeToasts.add(key);
  const id = toast({
    ...props,
  });

  // Clean up the toast ID from tracking after it's dismissed
  setTimeout(() => {
    activeToasts.delete(key);
  }, 5000); // Assuming 5 seconds duration for toast
};

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      showToast({
        title: 'Account created',
        description: 'Your account has been created successfully.',
      });
    }
    return data;
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'Failed to sign up',
      variant: 'destructive',
    });
    throw error;
  }
};

export const registerAdmin = async (email: string, password: string, fullName: string) => {
  try {
    // First register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'admin' // This will be stored in user metadata
        }
      }
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Once the user is created, update their profile role to admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Error updating profile role:', profileError);
      }

      showToast({
        title: 'Admin account created',
        description: 'The admin account has been created successfully.',
      });
    }
    return data;
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'Failed to create admin account',
      variant: 'destructive',
    });
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    showToast({
      title: 'Welcome back',
      description: 'You have been logged in successfully.',
    });
    return data;
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'Failed to sign in',
      variant: 'destructive',
    });
    throw error;
  }
};

export const signInAdmin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Check if the user has admin role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user?.id)
      .single();

    if (profileError) {
      throw new Error('Failed to verify admin status');
    }

    if (profileData.role !== 'admin') {
      // Sign out if not an admin
      await supabase.auth.signOut();
      throw new Error('You do not have administrator privileges');
    }

    // Store in localStorage for convenience
    localStorage.setItem('adminAuth', 'true');
    
    showToast({
      title: 'Admin Login Successful',
      description: 'You have been logged in as an administrator.',
    });
    return { data, isAdmin: true };
  } catch (error: any) {
    showToast({
      title: 'Admin Login Failed',
      description: error.message || 'Failed to sign in as administrator',
      variant: 'destructive',
    });
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Clear admin status in localStorage
    localStorage.removeItem('adminAuth');
    
    await supabase.auth.signOut();
    showToast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'Failed to sign out',
      variant: 'destructive',
    });
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?tab=reset`,
    });

    if (error) {
      throw error;
    }

    showToast({
      title: 'Password reset email sent',
      description: 'Check your email for a password reset link.',
    });
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'Failed to send password reset email',
      variant: 'destructive',
    });
    throw error;
  }
};

export const updatePassword = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    showToast({
      title: 'Password updated',
      description: 'Your password has been updated successfully.',
    });
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'Failed to update password',
      variant: 'destructive',
    });
    throw error;
  }
};
