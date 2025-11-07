
import { supabase } from '@/lib/supabase';
import { showToast } from './toastUtils';

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
    showToast({
      title: 'Error',
      description: errorMessage,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
    showToast({
      title: 'Error',
      description: errorMessage,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
    showToast({
      title: 'Error',
      description: errorMessage,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
    showToast({
      title: 'Error',
      description: errorMessage,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
    showToast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
    throw error;
  }
};
