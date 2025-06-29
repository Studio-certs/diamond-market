# Supabase Storage Setup Guide

This guide explains how to set up the storage bucket for diamond images in your Supabase project.

## Storage Bucket Setup

1. Navigate to your Supabase project dashboard
2. Go to the "Storage" section in the left sidebar
3. Click "Create new bucket"
4. Enter the following details:
   - Bucket Name: `diamond-images`
   - Make it public: Yes
   - Enable file size limit: Optional (recommended: 5MB)

## Storage Policies

After creating the bucket, you need to set up the following policies to control access:

### 1. Public Read Access

This allows anyone to view the images:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'diamond-images');
```

### 2. Authenticated Upload Access

This allows authenticated users to upload images:

```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'diamond-images'
  AND owner = auth.uid()
);
```

### 3. Update Access

This allows users to update their own images:

```sql
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'diamond-images'
  AND owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'diamond-images'
  AND owner = auth.uid()
);
```

### 4. Delete Access

This allows users to delete their own images:

```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'diamond-images'
  AND owner = auth.uid()
);
```

## Setting Up via Dashboard

Alternatively, you can set up these policies through the Supabase Dashboard:

1. Go to Storage > Policies
2. Select the `diamond-images` bucket
3. Click "Add Policy"
4. For each policy above:
   - Select the appropriate template
   - Set the roles (authenticated/anon)
   - Set the policy name
   - Add the USING and WITH CHECK expressions as shown above
   - Save the policy

## Testing the Storage Setup

To test if your storage setup is working correctly:

1. Try uploading an image through the application
2. Check if the image appears in the storage bucket
3. Verify that the image URL is publicly accessible
4. Test updating and deleting images as an authenticated user

## Troubleshooting

Common issues and solutions:

1. **Upload fails**: Check if the user is authenticated and the policy expressions are correct
2. **Images not displaying**: Verify that the bucket is public and the SELECT policy is in place
3. **Permission errors**: Ensure the policies are properly configured and the user has the correct role

## Additional Configuration

- Consider setting up a CDN for better performance
- Implement file type restrictions if needed
- Set up backup policies for the storage bucket
- Monitor storage usage and set up alerts

For more detailed information, refer to the [Supabase Storage documentation](https://supabase.com/docs/guides/storage).
