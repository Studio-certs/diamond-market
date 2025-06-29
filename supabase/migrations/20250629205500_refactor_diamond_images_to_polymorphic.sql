/*
  # Refactor diamond_images to be polymorphic (Idempotent)
  1.  **Goal**: Allow the `diamond_images` table to be associated with both `individual_diamonds` and `wholesale_diamonds`.
  2.  **Changes**:
      - Safely renames `diamond_id` to `individual_diamond_id` only if the old column name exists.
      - Adds a `wholesale_diamond_id` foreign key column if it doesn't exist.
      - Adds a `CHECK` constraint to ensure an image is linked to EITHER an individual OR a wholesale diamond, but not both.
  3.  **Impact**: This resolves schema ambiguity by creating explicit, separate relationships. This script is now safe to re-run.
*/

-- Safely rename 'diamond_id' to 'individual_diamond_id' if necessary
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='diamond_images' AND column_name='diamond_id') THEN
    -- Drop the old foreign key constraint before renaming
    ALTER TABLE public.diamond_images DROP CONSTRAINT IF EXISTS diamond_images_diamond_id_fkey;
    -- Rename the column
    ALTER TABLE public.diamond_images RENAME COLUMN diamond_id TO individual_diamond_id;
  END IF;
END $$;

-- Ensure the foreign key constraint for individual_diamonds is in place
-- Drop it first to avoid errors on re-run, then add it.
ALTER TABLE public.diamond_images DROP CONSTRAINT IF EXISTS diamond_images_individual_diamond_id_fkey;
ALTER TABLE public.diamond_images ADD CONSTRAINT diamond_images_individual_diamond_id_fkey
  FOREIGN KEY (individual_diamond_id) REFERENCES public.individual_diamonds(id) ON DELETE CASCADE;

-- Add the new column for wholesale diamonds if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='diamond_images' and column_name='wholesale_diamond_id') THEN
    ALTER TABLE public.diamond_images ADD COLUMN wholesale_diamond_id uuid
      REFERENCES public.wholesale_diamonds(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Make the individual_diamond_id column nullable, as an image will only belong to one type of diamond
ALTER TABLE public.diamond_images ALTER COLUMN individual_diamond_id DROP NOT NULL;

-- Add a check constraint to ensure data integrity
-- First, drop if it exists to make this script re-runnable
ALTER TABLE public.diamond_images DROP CONSTRAINT IF EXISTS check_one_diamond_type;
ALTER TABLE public.diamond_images ADD CONSTRAINT check_one_diamond_type
  CHECK (
    (individual_diamond_id IS NOT NULL AND wholesale_diamond_id IS NULL) OR
    (individual_diamond_id IS NULL AND wholesale_diamond_id IS NOT NULL)
  );

-- RLS Policies
ALTER TABLE public.diamond_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.diamond_images;
CREATE POLICY "Allow public read access" ON public.diamond_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable full access for admins" ON public.diamond_images;
CREATE POLICY "Enable full access for admins" ON public.diamond_images
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
