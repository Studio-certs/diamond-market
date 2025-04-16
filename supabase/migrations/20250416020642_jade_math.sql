/*
  # Initial schema setup for diamond marketplace

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - role (text)
      - created_at (timestamp)
    - diamonds
      - id (uuid)
      - name (text)
      - description (text)
      - price (numeric)
      - carat (numeric)
      - color (text)
      - clarity (text)
      - cut (text)
      - image_url (text)
      - type (text)
      - quantity (integer, for bulk diamonds)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Create diamonds table
CREATE TABLE diamonds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price > 0),
  carat numeric NOT NULL CHECK (carat > 0),
  color text NOT NULL,
  clarity text NOT NULL,
  cut text NOT NULL,
  image_url text,
  type text NOT NULL CHECK (type IN ('individual', 'bulk')),
  quantity integer CHECK (
    (type = 'bulk' AND quantity > 0) OR
    (type = 'individual' AND quantity IS NULL)
  ),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamonds ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Diamonds policies
CREATE POLICY "Anyone can view diamonds"
  ON diamonds
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert diamonds"
  ON diamonds
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update diamonds"
  ON diamonds
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

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
