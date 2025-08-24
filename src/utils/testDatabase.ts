/**
 * Database connectivity test
 * Run this to verify Supabase connection and table existence
 */

import { supabase } from '../services/database/supabaseClient';

export const testDatabaseConnection = async () => {
  console.log('=== TESTING DATABASE CONNECTION ===');
  
  try {
    // Test basic connection
    console.log('Testing basic Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('Database connection failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === '42P01') {
        console.log('❌ USERS TABLE DOES NOT EXIST!');
        console.log('📝 You need to create the database tables first.');
        console.log('🔧 Run the SQL commands from DATABASE_SCHEMA.md in your Supabase dashboard.');
        return false;
      }
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ Users table exists!');
      return true;
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Call this function to test
testDatabaseConnection();
