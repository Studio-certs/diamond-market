/*
  # Create diamond images storage bucket

  1. New Storage Bucket
    - Creates a storage bucket named 'diamond-images' for storing diamond product images
  
  2. Security
    - Enables public access for viewing images
    - Restricts upload/delete operations to authenticated users
*/

-- Enable the storage extension if not already enabled
create extension if not exists "storage" schema "extensions";

-- Create the storage bucket
insert into storage.buckets (id, name, public)
values ('diamond-images', 'diamond-images', true)
on conflict (id) do nothing;

-- Policy to allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'diamond-images' );

-- Policy to allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'diamond-images'
  and owner = auth.uid()
);

-- Policy to allow authenticated users to update their own images
create policy "Users can update own images"
on storage.objects for update
to authenticated
using ( bucket_id = 'diamond-images' and owner = auth.uid() )
with check ( bucket_id = 'diamond-images' and owner = auth.uid() );

-- Policy to allow authenticated users to delete their own images
create policy "Users can delete own images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'diamond-images' and owner = auth.uid() );