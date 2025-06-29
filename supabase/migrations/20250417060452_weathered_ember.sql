/*
  # Enable storage extension for Supabase

  1. Changes
    - Enable the storage extension in the extensions schema
    - This must be done before creating any storage buckets
*/

-- Enable the storage extension in the extensions schema
create extension if not exists "storage" with schema "extensions";
