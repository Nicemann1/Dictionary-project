import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  // Fetch user profile after successful sign in
  if (data.user) {
    await getOrCreateProfile(data.user);
  }

  return data;
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    throw error;
  }

  // Create profile for new user
  if (data.user) {
    await createProfile(data.user, name);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: any) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
  
  return data.subscription.unsubscribe;
}

async function createProfile(user: User, name?: string) {
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email,
      name: name || user.email?.split('@')[0], // Use provided name or fallback to email username
      display_name: user.email?.split('@')[0] // Default display name from email
    });

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

async function getOrCreateProfile(user: User): Promise<Profile> {
  // Try to get existing profile
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') { // Record not found
        // Create new profile
        await createProfile(user);
        
        // Fetch the newly created profile
        const { data: newProfile, error: newFetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (newFetchError) {
          console.error('Error fetching new profile:', newFetchError);
          throw newFetchError;
        }
        return newProfile as Profile;
      }
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }
    return profile as Profile;
  } catch (error) {
    console.error('Error in getOrCreateProfile:', error);
    // Return a minimal profile to prevent UI errors
    return {
      id: user.id,
      email: user.email || '',
      display_name: user.email?.split('@')[0] || 'User'
    };
  }
}