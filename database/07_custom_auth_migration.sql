-- Migration: Add password column and update for custom authentication
-- Run this in your Supabase SQL editor

-- Add password column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Remove the auth_id column dependency since we're not using Supabase Auth anymore
ALTER TABLE users ALTER COLUMN auth_id DROP NOT NULL;

-- Drop existing RLS policies that depend on auth.uid()
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Disable RLS temporarily for our custom auth system
-- In production, you might want to create custom policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Optional: Remove the trigger since we're handling user creation manually
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_password ON users(email, password);

-- Add some constraints
-- Drop constraint if it exists, then add it
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_check;
ALTER TABLE users ADD CONSTRAINT users_email_check 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Update existing records to remove auth_id dependency (if any)
-- UPDATE users SET auth_id = NULL WHERE auth_id IS NOT NULL;
