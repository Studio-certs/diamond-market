/*
  # Create RPC functions for fetching diamonds
  1.  **Goal**: Create explicit functions to fetch diamonds with their images, bypassing PostgREST's ambiguous relationship error.
  2.  **Functions**:
      - `get_all_individual_diamonds()`: Fetches all individual diamonds with an array of their images.
      - `get_individual_diamond_by_id(p_id uuid)`: Fetches a single individual diamond with its images.
      - `get_all_wholesale_diamonds()`: Fetches all wholesale diamonds with an array of their images.
      - `get_wholesale_diamond_by_id(p_id uuid)`: Fetches a single wholesale diamond with its images.
  3.  **Impact**: Provides a stable and explicit API for the frontend to consume, regardless of schema complexity.
*/

-- Function to get all individual diamonds with their images
CREATE OR REPLACE FUNCTION get_all_individual_diamonds()
RETURNS TABLE (
  id uuid, name text, description text, price numeric, carat numeric, color text, clarity text, cut text, created_at timestamptz,
  diamond_images jsonb
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id, d.name, d.description, d.price, d.carat, d.color, d.clarity, d.cut, d.created_at,
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('image_url', di.image_url, 'is_primary', di.is_primary)), '[]'::jsonb)
     FROM diamond_images di WHERE di.individual_diamond_id = d.id) AS diamond_images
  FROM individual_diamonds d
  ORDER BY d.created_at DESC;
END;
$$;

-- Function to get a single individual diamond by ID with its images
CREATE OR REPLACE FUNCTION get_individual_diamond_by_id(p_id uuid)
RETURNS TABLE (
  id uuid, name text, description text, price numeric, carat numeric, color text, clarity text, cut text, created_at timestamptz,
  diamond_images jsonb
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id, d.name, d.description, d.price, d.carat, d.color, d.clarity, d.cut, d.created_at,
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('image_url', di.image_url, 'is_primary', di.is_primary) ORDER BY di.is_primary DESC), '[]'::jsonb)
     FROM diamond_images di WHERE di.individual_diamond_id = d.id) AS diamond_images
  FROM individual_diamonds d
  WHERE d.id = p_id;
END;
$$;

-- Function to get all wholesale diamonds with their images
CREATE OR REPLACE FUNCTION get_all_wholesale_diamonds()
RETURNS TABLE (
  id uuid, name text, description text, base_price_per_carat numeric, minimum_carat numeric, maximum_carat numeric, color text, clarity text, cut text, available_quantity integer, minimum_order_quantity integer, bulk_discount_percentage numeric, created_at timestamptz,
  diamond_images jsonb
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id, d.name, d.description, d.base_price_per_carat, d.minimum_carat, d.maximum_carat, d.color, d.clarity, d.cut, d.available_quantity, d.minimum_order_quantity, d.bulk_discount_percentage, d.created_at,
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('image_url', di.image_url, 'is_primary', di.is_primary)), '[]'::jsonb)
     FROM diamond_images di WHERE di.wholesale_diamond_id = d.id) AS diamond_images
  FROM wholesale_diamonds d
  ORDER BY d.created_at DESC;
END;
$$;

-- Function to get a single wholesale diamond by ID with its images
CREATE OR REPLACE FUNCTION get_wholesale_diamond_by_id(p_id uuid)
RETURNS TABLE (
  id uuid, name text, description text, base_price_per_carat numeric, minimum_carat numeric, maximum_carat numeric, color text, clarity text, cut text, available_quantity integer, minimum_order_quantity integer, bulk_discount_percentage numeric, created_at timestamptz,
  diamond_images jsonb
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id, d.name, d.description, d.base_price_per_carat, d.minimum_carat, d.maximum_carat, d.color, d.clarity, d.cut, d.available_quantity, d.minimum_order_quantity, d.bulk_discount_percentage, d.created_at,
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('image_url', di.image_url, 'is_primary', di.is_primary) ORDER BY di.is_primary DESC), '[]'::jsonb)
     FROM diamond_images di WHERE di.wholesale_diamond_id = d.id) AS diamond_images
  FROM wholesale_diamonds d
  WHERE d.id = p_id;
END;
$$;
