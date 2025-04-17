/*
  # Add diamond images table and update existing tables

  1. New Tables
    - diamond_images
      - id (uuid)
      - diamond_id (uuid)
      - image_url (text)
      - is_primary (boolean)
      - created_at (timestamp)

  2. Changes
    - Add foreign key relationships
    - Enable RLS
    - Add policies for admin access

  3. Security
    - Only admins can manage images
    - Anyone can view images
*/

-- Create diamond_images table
CREATE TABLE diamond_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diamond_id uuid NOT NULL,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_individual_diamond
    FOREIGN KEY (diamond_id)
    REFERENCES individual_diamonds(id)
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE diamond_images ENABLE ROW LEVEL SECURITY;

-- Policies for diamond_images
CREATE POLICY "Anyone can view diamond images"
  ON diamond_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert diamond images"
  ON diamond_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
  );

CREATE POLICY "Only admins can update diamond images"
  ON diamond_images
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
  );

CREATE POLICY "Only admins can delete diamond images"
  ON diamond_images
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
  );

-- Function to ensure only one primary image per diamond
CREATE OR REPLACE FUNCTION maintain_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE diamond_images
    SET is_primary = false
    WHERE diamond_id = NEW.diamond_id
      AND id != NEW.id
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single primary image
CREATE TRIGGER ensure_single_primary_image
  BEFORE INSERT OR UPDATE ON diamond_images
  FOR EACH ROW
  EXECUTE FUNCTION maintain_single_primary_image();