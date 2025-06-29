/*
  # Create RPC for adding an individual diamond with images
  1.  **New Function**: `add_individual_diamond_with_images`
  2.  **Purpose**: To create a single, atomic transaction for adding a diamond and its associated images. This bypasses potential legacy triggers on the `diamond_images` table that may still reference the old `diamond_id` column.
  3.  **Logic**:
      - Accepts all diamond attributes and a JSONB array of images.
      - Performs an admin role check for security.
      - Inserts into `individual_diamonds` and retrieves the new ID.
      - Iterates through the JSONB array and inserts each image into `diamond_images` with the correct `individual_diamond_id`.
      - Returns the new diamond's ID.
  4.  **Security**: Runs with `SECURITY DEFINER` and includes an explicit check to ensure the calling user has the 'admin' role.
*/

CREATE OR REPLACE FUNCTION add_individual_diamond_with_images(
  p_name text,
  p_description text,
  p_price numeric,
  p_carat numeric,
  p_color text,
  p_clarity text,
  p_cut text,
  p_images jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_diamond_id uuid;
  img jsonb;
BEGIN
  -- First, verify that the calling user is an admin.
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Permission denied: You must be an admin to perform this action.';
  END IF;

  -- Insert the diamond into the individual_diamonds table
  INSERT INTO individual_diamonds (name, description, price, carat, color, clarity, cut)
  VALUES (p_name, p_description, p_price, p_carat, p_color, p_clarity, p_cut)
  RETURNING id INTO new_diamond_id;

  -- If images are provided, loop through them and insert into diamond_images
  IF p_images IS NOT NULL AND jsonb_array_length(p_images) > 0 THEN
    FOR img IN SELECT * FROM jsonb_array_elements(p_images)
    LOOP
      INSERT INTO diamond_images (individual_diamond_id, image_url, is_primary)
      VALUES (
        new_diamond_id,
        img->>'url',
        (img->>'isPrimary')::boolean
      );
    END LOOP;
  END IF;

  RETURN new_diamond_id;
END;
$$;