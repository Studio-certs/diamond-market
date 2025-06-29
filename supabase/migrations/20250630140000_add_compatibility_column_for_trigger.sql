/*
  # Add Compatibility Column for Legacy Trigger
  1.  **Problem**: An old, un-updated trigger on the `individual_diamonds` table is failing because it references a non-existent `diamond_id` column on the `diamond_images` table.
  2.  **Solution**: Add a `diamond_id` column back to `diamond_images` as a `GENERATED` column that always mirrors the value of `individual_diamond_id`.
  3.  **Impact**: This satisfies the legacy trigger, allowing inserts to succeed, without breaking the new polymorphic schema. This is a non-destructive, backward-compatible fix.
*/

DO $$
BEGIN
  -- Check if the column does NOT exist before adding it to ensure idempotency.
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'diamond_images'
    AND column_name = 'diamond_id'
  ) THEN
    -- Add the 'diamond_id' column as a generated column that always stores the value of 'individual_diamond_id'.
    -- This will satisfy the old trigger that is likely still referencing 'diamond_id'.
    ALTER TABLE public.diamond_images
    ADD COLUMN diamond_id uuid GENERATED ALWAYS AS (individual_diamond_id) STORED;
  END IF;
END $$;