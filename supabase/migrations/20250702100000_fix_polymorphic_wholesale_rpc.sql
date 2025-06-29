/*
  # Fix Polymorphic Wholesale Diamond Image Fetching
  1.  **Goal**: Correct the RPC functions to fetch images from the polymorphic `diamond_images` table using the `wholesale_diamond_id` foreign key.
  2.  **Functions Updated**:
      - `get_all_wholesale_diamonds()`: The subquery for `diamond_images` now correctly queries `diamond_images` where `wholesale_diamond_id` matches.
      - `get_wholesale_diamond_by_id(p_id uuid)`: The subquery for `diamond_images` now correctly queries `diamond_images` where `wholesale_diamond_id` matches.
  3.  **Impact**: This resolves the "column does not exist" error and ensures the correct images are displayed for wholesale listings across the application.
*/

-- Function to get all wholesale diamonds with their images from the polymorphic table
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

-- Function to get a single wholesale diamond by ID with its images from the polymorphic table
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
