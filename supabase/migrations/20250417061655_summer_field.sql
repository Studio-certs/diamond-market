/*
  # Remove image_url columns and consolidate images

  1. Changes
    - Remove image_url column from individual_diamonds table
    - Remove image_url column from wholesale_diamonds table
    - Ensure existing image URLs are preserved in diamond_images table

  2. Migration Steps
    - First, migrate any existing image_url values to diamond_images table
    - Then remove the columns from both tables
*/

-- First, migrate any existing image URLs from individual_diamonds to diamond_images
INSERT INTO diamond_images (diamond_id, image_url, is_primary)
SELECT 
  id,
  image_url,
  true
FROM individual_diamonds
WHERE image_url IS NOT NULL
AND NOT EXISTS (
  SELECT 1 
  FROM diamond_images 
  WHERE diamond_id = individual_diamonds.id 
  AND image_url = individual_diamonds.image_url
);

-- Now remove the image_url column from individual_diamonds
ALTER TABLE individual_diamonds
DROP COLUMN IF EXISTS image_url;

-- Create a new diamond_images table specifically for wholesale diamonds if needed
CREATE TABLE IF NOT EXISTS wholesale_diamond_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diamond_id uuid NOT NULL,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_wholesale_diamond
    FOREIGN KEY (diamond_id)
    REFERENCES wholesale_diamonds(id)
    ON DELETE CASCADE
);

-- Enable RLS on wholesale_diamond_images
ALTER TABLE wholesale_diamond_images ENABLE ROW LEVEL SECURITY;

-- Add the same policies as diamond_images
CREATE POLICY "Anyone can view wholesale diamond images"
  ON wholesale_diamond_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert wholesale diamond images"
  ON wholesale_diamond_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
  );

CREATE POLICY "Only admins can update wholesale diamond images"
  ON wholesale_diamond_images
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
  );

CREATE POLICY "Only admins can delete wholesale diamond images"
  ON wholesale_diamond_images
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- Create the same trigger for wholesale_diamond_images
CREATE OR REPLACE FUNCTION maintain_single_primary_wholesale_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE wholesale_diamond_images
    SET is_primary = false
    WHERE diamond_id = NEW.diamond_id
      AND id != NEW.id
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_wholesale_image
  BEFORE INSERT OR UPDATE ON wholesale_diamond_images
  FOR EACH ROW
  EXECUTE FUNCTION maintain_single_primary_wholesale_image();

-- Migrate any existing image URLs from wholesale_diamonds to wholesale_diamond_images
INSERT INTO wholesale_diamond_images (diamond_id, image_url, is_primary)
SELECT 
  id,
  image_url,
  true
FROM wholesale_diamonds
WHERE image_url IS NOT NULL
AND NOT EXISTS (
  SELECT 1 
  FROM wholesale_diamond_images 
  WHERE diamond_id = wholesale_diamonds.id 
  AND image_url = wholesale_diamonds.image_url
);

-- Finally, remove the image_url column from wholesale_diamonds
ALTER TABLE wholesale_diamonds
DROP COLUMN IF EXISTS image_url;