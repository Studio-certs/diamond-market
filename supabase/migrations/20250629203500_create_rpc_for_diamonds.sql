/*
  # Create RPC functions for fetching individual diamonds
  1. New Functions:
     - `get_all_individual_diamonds()`: Fetches all individual diamonds with their associated images, resolving the join ambiguity.
     - `get_individual_diamond_by_id(p_id uuid)`: Fetches a single individual diamond by its ID, including its images.
  2. Purpose: To bypass the PostgREST error "Could not embed because more than one relationship was found" by explicitly defining the data fetching logic in the database.
*/

-- Function to get all individual diamonds with their images
CREATE OR REPLACE FUNCTION get_all_individual_diamonds()
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price numeric,
  carat numeric,
  color text,
  clarity text,
  cut text,
  created_at timestamptz,
  diamond_images jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.name,
    d.description,
    d.price,
    d.carat,
    d.color,
    d.clarity,
    d.cut,
    d.created_at,
    (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('image_url', di.image_url, 'is_primary', di.is_primary)), '[]'::jsonb)
      FROM diamond_images di
      WHERE di.individual_diamond_id = d.id
    ) AS diamond_images
  FROM
    individual_diamonds d
  ORDER BY
    d.created_at DESC;
END;
$$;

-- Function to get a single individual diamond by ID with its images
CREATE OR REPLACE FUNCTION get_individual_diamond_by_id(p_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price numeric,
  carat numeric,
  color text,
  clarity text,
  cut text,
  created_at timestamptz,
  diamond_images jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.name,
    d.description,
    d.price,
    d.carat,
    d.color,
    d.clarity,
    d.cut,
    d.created_at,
    (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('image_url', di.image_url, 'is_primary', di.is_primary)), '[]'::jsonb)
      FROM diamond_images di
      WHERE di.individual_diamond_id = d.id
    ) AS diamond_images
  FROM
    individual_diamonds d
  WHERE
    d.id = p_id;
END;
$$;
