/*
  # Add wholesale diamonds table and update diamonds table

  1. Changes
    - Rename existing diamonds table to individual_diamonds
    - Create new wholesale_diamonds table
    - Update RLS policies for both tables
    - Remove type column from individual_diamonds as it's no longer needed

  2. New Tables
    - wholesale_diamonds
      - id (uuid)
      - name (text)
      - description (text)
      - base_price_per_carat (numeric)
      - minimum_carat (numeric)
      - maximum_carat (numeric)
      - color (text)
      - clarity (text)
      - cut (text)
      - available_quantity (integer)
      - minimum_order_quantity (integer)
      - bulk_discount_percentage (numeric)
      - image_url (text)
      - created_at (timestamp)

  3. Security
    - Enable RLS on wholesale_diamonds table
    - Update policies for both tables
*/

-- First, create the new wholesale_diamonds table
CREATE TABLE wholesale_diamonds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price_per_carat numeric NOT NULL CHECK (base_price_per_carat > 0),
  minimum_carat numeric NOT NULL CHECK (minimum_carat > 0),
  maximum_carat numeric NOT NULL CHECK (maximum_carat > 0),
  color text NOT NULL,
  clarity text NOT NULL,
  cut text NOT NULL,
  available_quantity integer NOT NULL CHECK (available_quantity > 0),
  minimum_order_quantity integer NOT NULL CHECK (minimum_order_quantity > 0),
  bulk_discount_percentage numeric NOT NULL CHECK (bulk_discount_percentage >= 0 AND bulk_discount_percentage <= 100),
  image_url text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_carat_range CHECK (maximum_carat >= minimum_carat),
  CONSTRAINT valid_quantity CHECK (available_quantity >= minimum_order_quantity)
);

-- Rename existing diamonds table to individual_diamonds
ALTER TABLE diamonds RENAME TO individual_diamonds;

-- Remove the type and quantity columns from individual_diamonds as they're no longer needed
ALTER TABLE individual_diamonds DROP COLUMN type;
ALTER TABLE individual_diamonds DROP COLUMN quantity;

-- Enable RLS on wholesale_diamonds
ALTER TABLE wholesale_diamonds ENABLE ROW LEVEL SECURITY;

-- Update policies for individual_diamonds
DROP POLICY IF EXISTS "Anyone can view diamonds" ON individual_diamonds;
DROP POLICY IF EXISTS "Only admins can insert diamonds" ON individual_diamonds;
DROP POLICY IF EXISTS "Only admins can update diamonds" ON individual_diamonds;

CREATE POLICY "Anyone can view individual diamonds"
  ON individual_diamonds
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert individual diamonds"
  ON individual_diamonds
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update individual diamonds"
  ON individual_diamonds
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for wholesale_diamonds
CREATE POLICY "Anyone can view wholesale diamonds"
  ON wholesale_diamonds
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert wholesale diamonds"
  ON wholesale_diamonds
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update wholesale diamonds"
  ON wholesale_diamonds
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete wholesale diamonds"
  ON wholesale_diamonds
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );