
import { supabase } from '@/lib/supabase';
import { showToast } from './toastUtils';

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create admin account';
    showToast({
      title: 'Error',
      description: errorMessage,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in as administrator';
    showToast({
      title: 'Admin Login Failed',
      description: errorMessage,
      variant: 'destructive',
    });
    throw error;
  }
};
