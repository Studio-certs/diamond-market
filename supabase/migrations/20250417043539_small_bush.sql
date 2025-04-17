/*
  # Add DELETE policy for individual diamonds

  1. Changes
    - Add DELETE policy for individual_diamonds table allowing admins to delete diamonds
    - Uses the existing is_admin() function for role checking

  2. Security
    - Only admins can delete individual diamonds
    - Maintains existing security model
*/

CREATE POLICY "Only admins can delete individual diamonds"
  ON individual_diamonds
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );