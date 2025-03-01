// Simple script to test Supabase connection independently
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env') });

// Get environment variables directly from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('======= Supabase Connection Test =======');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key available:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function
async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Try a simple query to see if the connection works
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('Response data:', data);
    
    // Also test auth service
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth service test failed:', authError.message);
    } else {
      console.log('✅ Auth service test successful!');
      console.log('Session exists:', !!authData.session);
    }
    
  } catch (err) {
    console.error('❌ Connection test exception:', err.message);
  }
}

// Run the test
testConnection(); 