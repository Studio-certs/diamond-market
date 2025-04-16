/*
      # Update Profile RLS Policies for Admin Access

      This migration updates the Row Level Security (RLS) policies for the `profiles` table
      to grant administrators full CRUD access while maintaining user self-management capabilities.

      1. Modified Policies
        - SELECT: Allows authenticated users to read their own profile AND allows users with the 'admin' role to read all profiles.
        - UPDATE: Allows authenticated users to update their own profile AND allows users with the 'admin' role to update any profile.

      2. New Policies
        - DELETE: Allows users with the 'admin' role to delete any profile.

      3. Unchanged Policies
        - INSERT: Remains the same, allowing authenticated users to insert their own profile (typically handled by the `handle_new_user` trigger).

      4. Security Considerations
        - Granting admins full update/delete access is powerful. Ensure only trusted users have the 'admin' role.
    */

    -- Drop existing SELECT and UPDATE policies that are too restrictive for admins
    DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

    -- SELECT Policy: Users can read their own profile, Admins can read all profiles.
    CREATE POLICY "Allow read access for users and admins"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (
        (auth.uid() = id) OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
      );

    -- UPDATE Policy: Users can update their own profile, Admins can update any profile.
    CREATE POLICY "Allow update access for users and admins"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (
        (auth.uid() = id) OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
      )
      WITH CHECK (
        (auth.uid() = id) OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
      );

    -- DELETE Policy: Admins can delete any profile.
    CREATE POLICY "Allow delete for admins only"
      ON public.profiles
      FOR DELETE
      TO authenticated
      USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
      );

    -- INSERT policy remains unchanged (Users can create own profile)
    -- CREATE POLICY "Users can create own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
    -- This policy should already exist from migration 20250416022435_emerald_base.sql