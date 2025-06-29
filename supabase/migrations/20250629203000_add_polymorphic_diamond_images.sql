/*
  # Update diamond_images for wholesale listings
  1. Renames `diamond_id` to `individual_diamond_id` to clarify its purpose.
  2. Adds a `wholesale_diamond_id` column with a foreign key to the `wholesale_diamonds` table.
  3. Adds a CHECK constraint to ensure an image is linked to either an individual OR a wholesale diamond, but not both.
  4. Updates RLS policies to grant admins full access and public read access.
*/

-- Drop the existing foreign key constraint to allow renaming the column
ALTER TABLE public.diamond_images DROP CONSTRAINT IF EXISTS diamond_images_diamond_id_fkey;

-- Rename the column for clarity
ALTER TABLE public.diamond_images RENAME COLUMN diamond_id TO individual_diamond_id;

-- Re-add the foreign key constraint on the renamed column
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

-- Make the original column nullable, as an image will only belong to one type of diamond
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