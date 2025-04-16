/*
  # Add name and email fields to profiles table

  1. Changes
    - Add `full_name` column to profiles table (required)
    - Add `email` column to profiles table (required)
    - Update RLS policies to include new fields

  2. Security
    - Maintain existing RLS policies
    - Users can read and update their own profile data
*/

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN full_name text NOT NULL,
ADD COLUMN email text NOT NULL;

-- Update existing policies to include new fields
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
