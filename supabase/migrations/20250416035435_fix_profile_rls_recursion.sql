/*
  # Simplify Profile RLS Policies to Prevent Recursion

  This migration addresses an infinite recursion error caused by RLS policies
  on the `profiles` table querying the same table to check the user's role.

  1. New Function
    - `is_admin()`: A security definer function that checks if the currently
      authenticated user has the 'admin' role in the `profiles` table.
      Using a function breaks the recursive loop in the policy definitions.

  2. Modified Policies
    - SELECT (`Allow read access for users and admins`): Updated to use `is_admin()`
      instead of a direct subquery to check for admin role. Allows users to
      read their own profile or admins to read any profile.
    - UPDATE (`Allow update access for users and admins`): Updated to use `is_admin()`
      instead of a direct subquery. Allows users to update their own profile
      or admins to update any profile.
    - DELETE (`Allow delete for admins only`): Updated to use `is_admin()`
      instead of a direct subquery. Allows only admins to delete profiles.

  3. Unchanged Policies
    - INSERT (`Users can create own profile`): Remains unchanged.

  4. Security Considerations
    - The `is_admin()` function runs with the privileges of the user who defines it
      (SECURITY DEFINER), ensuring it can read the necessary role information.
    - Access control remains the same: users manage their own profiles, admins manage all.
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Allow read access for users and admins" ON public.profiles;
DROP POLICY IF EXISTS "Allow update access for users and admins" ON public.profiles;
DROP POLICY IF EXISTS "Allow delete for admins only" ON public.profiles;

-- Create helper function to check admin role (breaks recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public -- Important for SECURITY DEFINER functions
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- Recreate SELECT Policy using the helper function
CREATE POLICY "Allow read access for users and admins"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id) OR public.is_admin()
  );

-- Recreate UPDATE Policy using the helper function
CREATE POLICY "Allow update access for users and admins"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = id) OR public.is_admin()
  )
  WITH CHECK (
    (auth.uid() = id) OR public.is_admin()
  );

-- Recreate DELETE Policy using the helper function
CREATE POLICY "Allow delete for admins only"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- INSERT policy remains unchanged and should still exist:
-- CREATE POLICY "Users can create own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
