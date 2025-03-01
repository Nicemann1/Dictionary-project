// Database initialization script for Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if a table exists
async function tableExists(tableName) {
  try {
    // Try to get a single row from the table
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    // If there's no error or the error isn't about the table not existing
    return !error || error.code !== 'PGRST301';
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
}

// Function to create the profiles table
async function createProfilesTable() {
  console.log('Creating profiles table...');
  
  // SQL to create profiles table
  const { error } = await supabase.rpc('create_profiles_table');
  
  if (error) {
    console.error('❌ Error creating profiles table:', error);
    
    // Alternative method - create profile trigger through SQL
    console.log('Trying alternative method...');
    
    // Checking if we need to add RLS policies
    console.log('This script needs to be run with admin privileges.');
    console.log('Please go to your Supabase project:');
    console.log(`1. Open the URL: ${supabaseUrl}`);
    console.log('2. Navigate to SQL Editor');
    console.log('3. Paste and execute the following SQL:');
    
    console.log(`
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profile access
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1),
    SPLIT_PART(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`);
  } else {
    console.log('✅ Profiles table created successfully!');
  }
}

// Function to create all required tables
async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  // Check and create profiles table
  const hasProfilesTable = await tableExists('profiles');
  console.log(`Profiles table exists: ${hasProfilesTable}`);
  
  if (!hasProfilesTable) {
    await createProfilesTable();
  }
  
  // Add more tables as needed
  // Create other tables the application needs
  
  console.log('Database initialization complete.');
}

// Run the initialization
initializeDatabase()
  .catch(err => {
    console.error('❌ Database initialization failed:', err);
  }); 