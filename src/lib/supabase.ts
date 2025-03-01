import { createClient } from '@supabase/supabase-js';

// Get environment variables from import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add debugging to help diagnose connection issues
console.log('Supabase configuration:');
console.log('- URL available:', !!supabaseUrl);
console.log('- URL:', supabaseUrl?.substring(0, 15) + '...');
console.log('- Anon Key available:', !!supabaseAnonKey);
console.log('- Anon Key (truncated):', supabaseAnonKey?.substring(0, 15) + '...');

// More detailed error message
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`);
}

// Create Supabase client with additional options for better error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

// Add a more comprehensive connection test
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection to:', supabaseUrl);
    
    // Test connection with a simple query
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (profilesError) {
      console.error('Profiles table test failed:', profilesError.message);
      
      // If profiles table fails, check if the database itself is accessible
      const { data: tableData, error: tableError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (tableError && tableError.code === 'PGRST301') {
        // Table doesn't exist error
        return { 
          success: false, 
          error: `Table 'profiles' doesn't exist. The database schema might not be set up correctly.`,
          details: tableError.message
        };
      } else if (tableError) {
        // Other database errors
        return { 
          success: false, 
          error: `Database connection error: ${tableError.message}`,
          details: tableError.details
        };
      }
      
      return { 
        success: false, 
        error: profilesError.message,
        details: profilesError.details
      };
    }
    
    // If we got here, the connection is working
    console.log('Supabase connection successful!');
    return { success: true };
  } catch (err) {
    console.error('Supabase connection test exception:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error',
      details: 'Check browser console for more information'
    };
  }
};